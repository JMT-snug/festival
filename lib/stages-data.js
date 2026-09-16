// 스테이지(노트북)별 정답/비밀번호 데이터.
// public/ 밖에 있어서 브라우저에서는 직접 접근할 수 없고, /api 함수에서만 불러옵니다.
// TODO 표시된 값들을 실제 정답/비밀번호/장소 안내 문구로 교체하세요.

module.exports = {
  1: {
    // 1번 노트북은 팜플렛으로 시작하므로 비밀번호 확인 단계가 없습니다.
    password: null,
    answer: 'freshman',
    nextLocationText: 'TODO: 2번 노트북이 있는 장소 안내',
    nextPassword: 'TODO_2번_비밀번호',
  },
};
