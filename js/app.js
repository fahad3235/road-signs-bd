// Road Signs BD — UI wiring.
(function () {
  const SIGNS = RoadSigns.SIGNS;
  const L = RoadSignsLogic, I = RoadSignsI18n;
  const $ = function (id) { return document.getElementById(id); };
  let lang = localStorage.getItem("rsb-lang") || "en";
  let cat = "all", query = "";
  let quiz = null, qIndex = 0, answers = [];

  function bn(n) { return lang === "bn" ? L.toBnDigits(n) : String(n); }
  function nameOf(s) { return lang === "bn" ? s.nameBn : s.nameEn; }
  function meanOf(s) { return lang === "bn" ? s.meanBn : s.meanEn; }
  function catName(c) { return I.STR.catNames[c][lang === "bn" ? 1 : 0]; }

  function renderStatic() {
    $("tagline").textContent = I.t("tagline", lang);
    $("tabLearn").textContent = I.t("tabLearn", lang);
    $("tabQuiz").textContent = I.t("tabQuiz", lang);
    $("search").placeholder = I.t("searchPh", lang);
    ["all", "warning", "prohibitory", "mandatory", "informative"].forEach(function (c) {
      $("chip-" + c).textContent = I.t(c, lang);
    });
    $("sodTitle").textContent = I.t("signOfDay", lang);
    $("footerText").textContent = I.t("footer", lang);
    $("langBtn").textContent = lang === "bn" ? "English" : "বাংলা";
    document.documentElement.lang = lang === "bn" ? "bn" : "en";
    localStorage.setItem("rsb-lang", lang);
  }

  function renderLearn() {
    const list = L.filterSigns(SIGNS, cat, query);
    $("count").textContent = I.t("showing", lang) + " " + bn(list.length) + " " + I.t("signs", lang);
    const grid = $("grid");
    if (!list.length) { grid.innerHTML = '<p class="empty">' + I.t("noMatch", lang) + "</p>"; return; }
    grid.innerHTML = list.map(function (s) {
      return '<article class="card" data-id="' + s.id + '">'
        + '<div class="sign">' + RoadSigns.svgFor(s, 96) + "</div>"
        + '<h3>' + nameOf(s) + "</h3>"
        + '<p class="cat">' + catName(s.cat) + "</p>"
        + '<p class="mean">' + meanOf(s) + "</p></article>";
    }).join("");
  }

  function renderSod() {
    const today = new Date();
    const ds = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");
    const s = L.signOfDay(SIGNS, ds);
    $("sodSign").innerHTML = RoadSigns.svgFor(s, 110);
    $("sodName").textContent = nameOf(s);
    $("sodMean").textContent = meanOf(s);
    $("sodCat").textContent = catName(s.cat);
  }

  function renderAll() { renderStatic(); renderSod(); renderLearn(); renderQuizPanel(); }

  function showTab(tab) {
    $("learnView").hidden = tab !== "learn";
    $("quizView").hidden = tab !== "quiz";
    $("tabLearn").classList.toggle("active", tab === "learn");
    $("tabQuiz").classList.toggle("active", tab === "quiz");
  }

  function bestScore() { return Number(localStorage.getItem("rsb-best") || 0); }

  function renderQuizPanel() {
    const panel = $("quizPanel");
    if (!quiz) {
      panel.innerHTML = '<p class="best">' + I.t("best", lang) + ": " + bn(bestScore()) + " / 10</p>"
        + '<button id="startBtn" class="primary">' + I.t("startQuiz", lang) + "</button>";
      $("startBtn").onclick = startQuiz;
      return;
    }
    if (qIndex >= quiz.length) { renderResult(panel); return; }
    const q = quiz[qIndex];
    panel.innerHTML = '<p class="qhead">' + I.t("question", lang) + " " + bn(qIndex + 1) + " " + I.t("of", lang) + " 10</p>"
      + '<div class="qsign">' + RoadSigns.svgFor(q.sign, 120) + "</div>"
      + '<p class="qask">' + I.t("whatMeans", lang) + "</p>"
      + '<div class="opts">' + q.options.map(function (o, i) {
        return '<button class="opt" data-i="' + i + '">' + meanOf(o) + "</button>";
      }).join("") + "</div>"
      + '<p id="qfeed" class="feed"></p>'
      + '<button id="qnext" class="primary" disabled>' + (qIndex === quiz.length - 1 ? I.t("finish", lang) : I.t("next", lang)) + "</button>";
    panel.querySelectorAll(".opt").forEach(function (b) {
      b.onclick = function () {
        if (answers[qIndex] !== undefined) return;
        const picked = q.options[Number(b.dataset.i)];
        answers[qIndex] = picked.id;
        panel.querySelectorAll(".opt").forEach(function (x, j) {
          if (q.options[j].id === q.answerId) x.classList.add("right");
          else if (x === b) x.classList.add("wrong");
          x.disabled = true;
        });
        $("qfeed").textContent = picked.id === q.answerId
          ? (lang === "bn" ? "সঠিক!" : "Correct!")
          : (lang === "bn" ? "ভুল — সঠিক উত্তর সবুজ রঙে দেখানো হয়েছে।" : "Not quite — the correct answer is highlighted in green.");
        $("qnext").disabled = false;
      };
    });
    $("qnext").onclick = function () { qIndex++; renderQuizPanel(); };
  }

  function renderResult(panel) {
    const score = L.scoreQuiz(quiz, answers);
    const prevBest = bestScore();
    const isNew = score > prevBest;
    if (isNew) localStorage.setItem("rsb-best", String(score));
    let html = '<h3>' + I.t("result", lang) + "</h3>"
      + '<p class="score">' + bn(score) + " / 10 " + I.t("correct", lang) + "</p>"
      + (isNew ? '<p class="newbest">' + I.t("newBest", lang) + "</p>" : "")
      + '<h4>' + I.t("review", lang) + "</h4>"
      + '<div class="review">' + quiz.map(function (q, i) {
        const mine = SIGNS.find(function (s) { return s.id === answers[i]; });
        const ok = answers[i] === q.answerId;
        return '<div class="rev ' + (ok ? "ok" : "bad") + '"><div class="rsign">' + RoadSigns.svgFor(q.sign, 56) + "</div>"
          + "<div><strong>" + nameOf(q.sign) + "</strong><br>"
          + I.t("yourAnswer", lang) + ": " + (mine ? meanOf(mine) : "—") + "<br>"
          + (ok ? "" : I.t("correctAnswer", lang) + ": " + meanOf(q.sign) + "<br>") + "</div></div>";
      }).join("") + "</div>"
      + '<button id="againBtn" class="primary">' + I.t("playAgain", lang) + "</button> "
      + '<button id="backBtn">' + I.t("backLearn", lang) + "</button>";
    panel.innerHTML = html;
    $("againBtn").onclick = startQuiz;
    $("backBtn").onclick = function () { quiz = null; showTab("learn"); renderQuizPanel(); };
  }

  function startQuiz() {
    quiz = L.buildQuiz(SIGNS, 10, Math.random);
    qIndex = 0; answers = [];
    showTab("quiz"); renderQuizPanel();
  }

  $("langBtn").onclick = function () { lang = lang === "bn" ? "en" : "bn"; renderAll(); };
  $("tabLearn").onclick = function () { showTab("learn"); };
  $("tabQuiz").onclick = function () { showTab("quiz"); };
  document.querySelectorAll(".chip").forEach(function (c) {
    c.onclick = function () {
      document.querySelectorAll(".chip").forEach(function (x) { x.classList.remove("active"); });
      c.classList.add("active"); cat = c.dataset.cat; renderLearn();
    };
  });
  $("search").addEventListener("input", function (e) { query = e.target.value; renderLearn(); });

  renderAll();
})();
