# festival

교내 오프라인 방탈출 행사용 웹사이트.

## 구조

- `public/` — 정적 파일 (Vercel이 이 폴더를 그대로 배포). 브라우저에서 접근 가능한 모든 것은 여기 있어야 함.
  - `index1.html`, `index2.html`, ... — 노트북 대수만큼 존재하는 단계별 페이지
  - `assets/stage{N}/` — 각 단계 전용 이미지/영상
  - `assets/shared/` — 공통 리소스 (배경 등)
  - `css/`, `js/` — 공통 스타일/스크립트
- `api/verify.js` — 비밀번호/정답 검증 서버리스 함수. **정답은 절대 `public/`에 두지 말 것.**
- `lib/stages-data.js` — 단계별 정답/비밀번호/다음 장소 안내 데이터. `api/`에서만 불러오므로 브라우저에서 열람 불가.
- `materials/` — 웹사이트에 올라가지 않는 참고용 파일 (인쇄물, 상품 등).
- `scripts/fix_transparency.py` — 배경 제거 도구가 투명 배경 대신 체크무늬를 실제 픽셀로 구워서 내보낸 사진을 진짜 투명 PNG로 고쳐주는 스크립트. 사진 배경이 투명이어야 하는데 체크무늬가 그대로 보이면 이걸로 처리: `python scripts/fix_transparency.py 원본.png 결과.png` (Python + `pillow`, `numpy`, `scipy` 필요).

## 로컬에서 확인하기

```bash
npm i -g vercel
vercel dev
```

## 배포

GitHub 저장소에 push하면 Vercel이 자동으로 배포합니다 (Vercel 프로젝트와 저장소 연결 필요).

## 각 단계(`index{N}.html`) 채워 넣을 것

1. `lib/stages-data.js`에 해당 단계 번호로 `password`(1번은 없음) / `answer` / `nextLocationText` / `nextPassword`를 실제 값으로 채우기
2. `public/index{N}.html`의 문제 텍스트(및 필요한 이미지) 채우기
3. 2번 이상 단계는 페이지 진입 시 비밀번호 입력 폼부터 시작해야 함 (아직 미구현 — index1 이후 단계 만들 때 추가 예정)
