# festival

교내 오프라인 방탈출 행사용 웹사이트.

## 구조

- `public/` — 정적 파일 (Vercel이 이 폴더를 그대로 배포). 브라우저에서 접근 가능한 모든 것은 여기 있어야 함.
  - `index1.html`, `index2.html`, ... — 노트북 대수만큼 존재하는 단계별 페이지
  - `assets/stage{N}/` — 각 단계 전용 이미지/영상
  - `assets/shared/` — 공통 리소스 (배경 등)
  - `css/` — 공통 스타일
  - `js/common.js` — 모든 단계 공통 로직: 화면 전환(`data-next`), 힌트 모달, 정답 제출, 영상 화면(`<video data-next="...">`이면 화면이 보일 때 자동재생하고 끝나면 지정한 화면으로 이동), 객관식 문제(`.mc-choices`), 시작 화면(`#stage-intro`)으로 돌아오면 입력값/영상 위치 등을 자동으로 초기화. 각 단계 페이지의 `js/stage{N}.js`에는 `const STAGE_ID = N;`과 그 단계만의 정말 특별한 동작(예: 3번 노트북의 랜덤 부적 뽑기)만 작성 — 화면 전환이나 영상 재생은 HTML의 `data-*` 속성만으로 처리되므로 대부분의 단계는 `STAGE_ID` 선언 한 줄이면 충분함
- `api/verify.js` — 비밀번호/정답 검증 서버리스 함수. **정답은 절대 `public/`에 두지 말 것.**
- `lib/stages-data.js` — 단계별 정답/비밀번호 데이터. `api/`에서만 불러오므로 브라우저에서 열람 불가.
- `materials/` — 웹사이트에 올라가지 않는 참고용 파일 (인쇄물, 상품 등).
- `scripts/fix_transparency.py` — 배경 제거 도구가 투명 배경 대신 체크무늬를 실제 픽셀로 구워서 내보낸 사진을 진짜 투명 PNG로 고쳐주는 스크립트. 사진 배경이 투명이어야 하는데 체크무늬가 그대로 보이면 이걸로 처리: `python scripts/fix_transparency.py 원본.png 결과.png` (Python + `pillow`, `numpy`, `scipy` 필요).

## 로컬에서 확인하기

```bash
npm i -g vercel
vercel dev
```

## 배포

GitHub 저장소에 push하면 Vercel이 자동으로 배포합니다 (Vercel 프로젝트와 저장소 연결 필요).

## 새 단계(`index{N}.html`) 만들 때

1. `lib/stages-data.js`에 해당 단계 번호로 `password`(현재는 안 씀, null)와 `problems` 배열을 채우기. 한 노트북 안에 문제가 여러 개면 `problems`에 순서대로 추가.
2. `public/index{N}.html`을 만들고: "탐정 도착!" 시작 화면(`#stage-intro`) → 문제 화면(들) → 결말 화면 순으로 구성. 문제마다 `<form class="answer-form" data-step="N" data-next="다음-화면-id">`의 `data-step`을 `problems` 배열의 순서(1부터)와 맞추기.
3. **각 노트북은 물리적으로 서로 다른 위치에 있으므로, 결말 화면의 마지막 버튼은 다음 index로 링크(`<a href>`)하지 않는다.** 대신 마무리 영상을 한 번 보여주고 다음 팀을 위해 시작 화면으로 돌아가는 "초기화" 버튼으로 만든다:
   ```html
   <button type="button" class="next-btn" data-next="stage-ending-video">...으로 이동!</button>
   ...
   <div id="stage-ending-video" class="stage-screen">
     <video src="/assets/stage{N}/ending.mp4" muted playsinline data-next="stage-intro"></video>
   </div>
   ```
   (참가자에게 다음 노트북이 있는 실제 위치를 알려주는 것은 스토리 텍스트 안에서만 하고, 실제 이동은 참가자가 직접 걸어서 함)
4. `<script src="/js/common.js"></script>` 다음에 `public/js/stage{N}.js`를 만들어 `const STAGE_ID = N;`만 선언. 화면 전환·영상 재생은 `data-next` 속성만으로 공통 로직이 처리하므로, 정말 그 단계만의 특별한 동작(랜덤 뽑기, 타이머 등)이 있을 때만 추가 코드를 작성.
