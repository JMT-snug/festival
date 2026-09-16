// 스테이지(노트북)별 정답/비밀번호 데이터.
// public/ 밖에 있어서 브라우저에서는 직접 접근할 수 없고, /api 함수에서만 불러옵니다.
// TODO 표시된 값들을 실제 정답/비밀번호/장소 안내 문구로 교체하세요.
//
// 한 노트북(스테이지) 안에 문제가 여러 개 있을 수 있어서, problems 배열의
// 각 항목이 문제 하나에 대응합니다 (1번째 문제 = problems[0], ...).
// 마지막 문제를 맞히면 nextLocationText/nextPassword가 응답으로 내려가고,
// 그 전 문제를 맞히면 다음 문제로만 넘어갑니다.

module.exports = {
  1: {
    // 1번 노트북은 팜플렛으로 시작하므로 비밀번호 확인 단계가 없습니다.
    password: null,
    problems: [
      { answer: 'freshman' },
      { answer: '철수' },
      {
        answer: '낙방',
        nextLocationText: 'TODO: 2번 노트북이 있는 장소 안내',
        nextPassword: 'TODO_2번_비밀번호',
      },
    ],
  },
};
