// 스테이지(노트북)별 정답/비밀번호 데이터.
// public/ 밖에 있어서 브라우저에서는 직접 접근할 수 없고, /api 함수에서만 불러옵니다.
//
// 한 노트북(스테이지) 안에 문제가 여러 개 있을 수 있어서, problems 배열의
// 각 항목이 문제 하나에 대응합니다 (1번째 문제 = problems[0], ...).
// 다음 단계로의 이동은 각 index{N}.html에 정적으로 적어둔 결말 텍스트 +
// 다음 페이지로 가는 버튼(링크)으로 처리합니다.

module.exports = {
  1: {
    // 1번 노트북은 팜플렛으로 시작하므로 비밀번호 확인 단계가 없습니다.
    password: null,
    problems: [
      { answer: 'freshman' },
      { answer: '철수' },
      { answer: '낙방' },
    ],
  },
  2: {
    password: null,
    problems: [
      { answer: 'mirror' },
      { answer: '19' },
      { answer: '5' },
    ],
  },
  3: {
    password: null,
    problems: [
      { answer: 'rain' },
    ],
  },
};
