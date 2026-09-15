"""
배경 제거 도구가 투명 배경 대신 체크무늬를 실제 픽셀로 구워서 내보낸 PNG를
진짜 투명 배경으로 고쳐준다.

사용법:
    python scripts/fix_transparency.py <입력.png> <출력.png>

동작 방식:
    1. 이미지 네 귀퉁이에서 체크무늬의 두 가지 색(밝은 회색 / 흰색)을 자동으로 감지
    2. 그 두 색과 거의 똑같은(그레이스케일에 가까운) 픽셀만 "체크무늬 후보"로 표시
    3. 체크무늬 칸 사이의 경계(안티에일리어싱)를 형태학적 닫힘 연산으로 이어붙여
       하나의 배경 덩어리로 만듦
    4. 이미지 테두리에 붙어있는 덩어리만 배경으로 판단해 투명 처리
       (사진 안쪽의 밝은 하이라이트 등은 테두리와 연결되지 않으므로 안전)
    5. 남은 작은 잡티(먼지 등)도 함께 투명 처리

주의: 완벽하지 않을 수 있으니, 실행 후 결과 이미지를 꼭 눈으로 확인할 것.
"""
import sys
import numpy as np
from PIL import Image
from scipy.ndimage import (label, binary_dilation, binary_erosion,
                            generate_binary_structure, iterate_structure, gaussian_filter)


def detect_checker_tones(arr, diff_tol=8, corner=40):
    h, w = arr.shape[:2]
    mx = np.max(arr, axis=-1).astype(np.int16)
    mn = np.min(arr, axis=-1).astype(np.int16)
    neutral = (mx - mn) <= diff_tol

    patches = [
        (slice(0, corner), slice(0, corner)),
        (slice(0, corner), slice(w - corner, w)),
        (slice(h - corner, h), slice(0, corner)),
        (slice(h - corner, h), slice(w - corner, w)),
    ]
    values = []
    for ys, xs in patches:
        m = neutral[ys, xs]
        values.append(mx[ys, xs][m])
    values = np.concatenate(values)
    if values.size == 0:
        raise RuntimeError("네 귀퉁이에서 체크무늬 픽셀을 찾지 못했습니다 (이미 투명하거나, 귀퉁이까지 사진 내용이 꽉 찬 경우)")

    hist = np.bincount(values, minlength=256).astype(float)
    hist_smooth = np.convolve(hist, np.ones(5) / 5, mode="same")

    order = np.argsort(-hist_smooth)
    peaks = []
    for v in order:
        if hist_smooth[v] <= 0:
            break
        if all(abs(int(v) - p) > 20 for p in peaks):
            peaks.append(int(v))
        if len(peaks) == 2:
            break
    if len(peaks) < 2:
        raise RuntimeError(f"체크무늬 두 색을 감지하지 못했습니다 (감지된 값: {peaks})")

    lo_tone, hi_tone = sorted(peaks)
    return lo_tone, hi_tone


def fix(path_in, path_out, band_pad=10, close_r=4, dilate_px=1, feather=1.2, min_area=400):
    im = Image.open(path_in).convert("RGB")
    arr = np.array(im).astype(np.int16)
    mx = np.max(arr, axis=-1)
    mn = np.min(arr, axis=-1)
    diff = mx - mn

    lo_tone, hi_tone = detect_checker_tones(arr)
    print(f"  감지된 체크무늬 색상: {lo_tone} (어두운 쪽) / {hi_tone} (밝은 쪽)")

    in_lo_band = (mx >= lo_tone - band_pad) & (mx <= lo_tone + band_pad)
    in_hi_band = (mx >= hi_tone - band_pad) & (mx <= hi_tone + band_pad)
    checker_tight = (diff <= 8) & (in_lo_band | in_hi_band)

    struct = iterate_structure(generate_binary_structure(2, 1), close_r)
    checker_closed = binary_erosion(
        binary_dilation(checker_tight, structure=struct),
        structure=struct, border_value=1,
    )

    labeled, _ = label(checker_closed)
    border_labels = set(labeled[0, :].tolist()) | set(labeled[-1, :].tolist()) \
        | set(labeled[:, 0].tolist()) | set(labeled[:, -1].tolist())
    border_labels.discard(0)
    bg_mask = np.isin(labeled, list(border_labels))

    fg_labeled, fg_n = label(~bg_mask)
    if fg_n > 1:
        sizes = np.bincount(fg_labeled.ravel())
        sizes[0] = 0
        tiny_labels = np.where((sizes > 0) & (sizes < min_area))[0]
        bg_mask |= np.isin(fg_labeled, tiny_labels)

    if dilate_px:
        bg_mask = binary_dilation(bg_mask, iterations=dilate_px)

    alpha = np.where(bg_mask, 0, 255).astype(np.float32)
    alpha = gaussian_filter(alpha, sigma=feather)
    alpha = np.clip(alpha, 0, 255).astype(np.uint8)

    out = np.dstack([np.array(im), alpha])
    Image.fromarray(out, mode="RGBA").save(path_out)
    print(f"  완료: 배경 픽셀 {int(bg_mask.sum())}/{mx.size} 투명 처리, 저장 위치: {path_out}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("사용법: python scripts/fix_transparency.py <입력.png> <출력.png>")
        sys.exit(1)
    fix(sys.argv[1], sys.argv[2])
