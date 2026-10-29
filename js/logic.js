// Road Signs BD — pure logic (runs unchanged in Node and in the browser).
(function (root) {
  function getSigns() { return root.RoadSigns ? root.RoadSigns.SIGNS : require("./signs.js").SIGNS; }

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(arr, rng) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function filterSigns(signs, category, query) {
    const q = (query || "").trim().toLowerCase();
    return signs.filter(function (s) {
      if (category !== "all" && s.cat !== category) return false;
      if (!q) return true;
      return (s.nameEn + " " + s.nameBn + " " + s.meanEn + " " + s.meanBn).toLowerCase().indexOf(q) !== -1;
    });
  }

  // Date-seeded sign of the day: same sign for everyone on the same calendar date.
  function signOfDay(signs, dateStr) {
    const parts = dateStr.split("-").map(Number);
    const seed = parts[0] * 372 + parts[1] * 31 + parts[2];
    const rng = mulberry32(seed);
    return signs[Math.floor(rng() * signs.length)];
  }

  // Build a quiz: `count` questions, each = one sign + 4 meaning options (1 correct).
  function buildQuiz(signs, count, rng) {
    const picked = shuffle(signs, rng).slice(0, count);
    return picked.map(function (sign) {
      const others = shuffle(signs.filter(function (s) { return s.id !== sign.id; }), rng).slice(0, 3);
      const options = shuffle([sign].concat(others), rng);
      return { sign: sign, options: options, answerId: sign.id };
    });
  }

  function scoreQuiz(questions, answers) {
    let score = 0;
    questions.forEach(function (q, i) { if (answers[i] === q.answerId) score++; });
    return score;
  }

  const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  function toBnDigits(str) {
    return String(str).replace(/[0-9]/g, function (d) { return BN_DIGITS[Number(d)]; });
  }

  const api = { mulberry32: mulberry32, shuffle: shuffle, filterSigns: filterSigns, signOfDay: signOfDay, buildQuiz: buildQuiz, scoreQuiz: scoreQuiz, toBnDigits: toBnDigits, getSigns: getSigns };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.RoadSignsLogic = api;
})(typeof window !== "undefined" ? window : globalThis);
