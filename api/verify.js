const stages = require('../lib/stages-data');

function normalize(value) {
  return String(value ?? '').trim().toLowerCase();
}

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, message: 'POST 요청만 허용됩니다.' });
    return;
  }

  const { stageId, kind, step, value } = req.body || {};
  const stage = stages[stageId];

  if (!stage) {
    res.status(404).json({ ok: false, message: '존재하지 않는 단계입니다.' });
    return;
  }

  if (kind === 'password') {
    if (!stage.password) {
      res.status(400).json({ ok: false, message: '이 단계는 비밀번호 확인이 필요하지 않습니다.' });
      return;
    }
    if (normalize(value) === normalize(stage.password)) {
      res.status(200).json({ ok: true, story: stage.story, problem: stage.problem });
    } else {
      res.status(200).json({ ok: false, message: '비밀번호가 올바르지 않습니다.' });
    }
    return;
  }

  if (kind === 'answer') {
    const problems = stage.problems || [];
    const problem = problems[(Number(step) || 1) - 1];

    if (!problem) {
      res.status(400).json({ ok: false, message: '잘못된 문제 번호입니다.' });
      return;
    }

    if (normalize(value) === normalize(problem.answer)) {
      res.status(200).json({
        ok: true,
        nextLocationText: problem.nextLocationText,
        nextPassword: problem.nextPassword,
      });
    } else {
      res.status(200).json({ ok: false, message: '정답이 아닙니다. 다시 시도해보세요.' });
    }
    return;
  }

  res.status(400).json({ ok: false, message: '알 수 없는 요청입니다.' });
};
