// Node unit tests for Road Signs BD logic + sign-bank integrity.
const assert = require("assert");
const { SIGNS } = require("../js/signs.js");
const L = require("../js/logic.js");

let n = 0;
function check(name, fn) { fn(); n++; console.log("ok " + n + " - " + name); }

// Bank integrity
check("28 signs, unique ids, 4 categories 8/8/6/6", () => {
  assert.strictEqual(SIGNS.length, 28);
  assert.strictEqual(new Set(SIGNS.map(s => s.id)).size, 28);
  const cats = {};
  SIGNS.forEach(s => { cats[s.cat] = (cats[s.cat] || 0) + 1; });
  assert.deepStrictEqual(cats, { warning: 8, prohibitory: 8, mandatory: 6, informative: 6 });
});
check("every sign has EN+BN name and meaning, shape and symbol", () => {
  SIGNS.forEach(s => {
    assert.ok(s.nameEn.length > 2 && s.nameBn.length > 2, s.id);
    assert.ok(s.meanEn.length > 10 && s.meanBn.length > 10, s.id);
    assert.ok(["W", "P", "M", "I"].includes(s.shape), s.id);
    assert.ok(s.symbol.length >= 1, s.id);
  });
});
check("svgFor renders all shapes with role=img and no NaN", () => {
  SIGNS.forEach(s => {
    const svg = require("../js/signs.js").svgFor(s, 96);
    assert.ok(svg.includes("<svg") && svg.includes('role="img"'), s.id);
    assert.ok(!svg.includes("NaN") && !svg.includes("undefined"), s.id);
  });
});
check("filter: warning = 8; Bangla query 'পার্কিং' finds parking signs", () => {
  assert.strictEqual(L.filterSigns(SIGNS, "warning", "").length, 8);
  const hits = L.filterSigns(SIGNS, "all", "পার্কিং").map(s => s.id);
  assert.ok(hits.includes("i-park") && hits.includes("p-nopark"), hits.join(","));
  assert.strictEqual(L.filterSigns(SIGNS, "all", "zzz-no-match").length, 0);
});
check("signOfDay is deterministic per date and in range", () => {
  const a = L.signOfDay(SIGNS, "2026-10-29"), b = L.signOfDay(SIGNS, "2026-10-29");
  assert.strictEqual(a.id, b.id);
  assert.ok(SIGNS.includes(a));
  const other = L.signOfDay(SIGNS, "2026-10-30");
  assert.ok(SIGNS.includes(other));
});
check("buildQuiz: 10 questions, 4 distinct options, answer present, distinct signs", () => {
  const q = L.buildQuiz(SIGNS, 10, L.mulberry32(42));
  assert.strictEqual(q.length, 10);
  assert.strictEqual(new Set(q.map(x => x.sign.id)).size, 10);
  q.forEach(x => {
    assert.strictEqual(x.options.length, 4);
    assert.strictEqual(new Set(x.options.map(o => o.id)).size, 4);
    assert.ok(x.options.some(o => o.id === x.answerId));
  });
});
check("scoreQuiz: 3 correct of 4 sample answers", () => {
  const q = [{ answerId: "a" }, { answerId: "b" }, { answerId: "c" }, { answerId: "d" }];
  assert.strictEqual(L.scoreQuiz(q, ["a", "b", "x", "d"]), 3);
});
check("toBnDigits converts 2026 and 50", () => {
  assert.strictEqual(L.toBnDigits("2026"), "২০২৬");
  assert.strictEqual(L.toBnDigits("50 km/h"), "৫০ km/h");
});
console.log("ALL " + n + " TEST GROUPS PASSED");
