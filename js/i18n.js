// Road Signs BD — UI strings (EN / বাংলা).
(function (root) {
  const STR = {
    tagline: ["Learn Bangladesh road signs — then test yourself.", "বাংলাদেশের রোড সাইন শিখুন — তারপর নিজেকে যাচাই করুন।"],
    tabLearn: ["Learn signs", "সাইন শিখুন"],
    tabQuiz: ["Quiz", "কুইজ"],
    searchPh: ["Search signs… (try “school” or “পার্কিং”)", "সাইন খুঁজুন… (যেমন “স্কুল” বা “পার্কিং”)"],
    all: ["All", "সব"],
    warning: ["Warning", "সতর্কতা"],
    prohibitory: ["Prohibitory", "নিষেধাজ্ঞা"],
    mandatory: ["Mandatory", "বাধ্যতামূলক"],
    informative: ["Informative", "তথ্যমূলক"],
    signOfDay: ["Sign of the day", "আজকের সাইন"],
    showing: ["showing", "দেখানো হচ্ছে"],
    signs: ["signs", "টি সাইন"],
    noMatch: ["No signs match your search.", "আপনার খোঁজের সাথে কোনো সাইন মিলল না।"],
    startQuiz: ["Start 10-question quiz", "১০ প্রশ্নের কুইজ শুরু করুন"],
    best: ["Best score", "সেরা স্কোর"],
    question: ["Question", "প্রশ্ন"],
    of: ["of", "এর"],
    whatMeans: ["What does this sign mean?", "এই সাইনটির অর্থ কী?"],
    next: ["Next", "পরেরটি"],
    finish: ["See result", "ফলাফল দেখুন"],
    result: ["Your result", "আপনার ফলাফল"],
    correct: ["correct", "টি সঠিক"],
    newBest: ["New best score!", "নতুন সেরা স্কোর!"],
    review: ["Review answers", "উত্তরগুলো দেখুন"],
    playAgain: ["Play again", "আবার খেলুন"],
    backLearn: ["Back to learning", "শেখায় ফিরুন"],
    yourAnswer: ["Your answer", "আপনার উত্তর"],
    correctAnswer: ["Correct answer", "সঠিক উত্তর"],
    footer: ["Learning aid only — always follow the official Road Transport Act rules and real road signs on the street.", "শুধু শেখার সহায়ক — সবসময় সরকারি সড়ক পরিবহন আইন ও রাস্তার আসল সাইন মেনে চলুন।"],
    catNames: { warning: ["Warning signs", "সতর্কতামূলক সাইন"], prohibitory: ["Prohibitory signs", "নিষেধাজ্ঞামূলক সাইন"], mandatory: ["Mandatory signs", "বাধ্যতামূলক সাইন"], informative: ["Informative signs", "তথ্যমূলক সাইন"] }
  };
  function t(key, lang) {
    const v = STR[key];
    if (Array.isArray(v)) return lang === "bn" ? v[1] : v[0];
    return v;
  }
  const api = { STR: STR, t: t };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.RoadSignsI18n = api;
})(typeof window !== "undefined" ? window : globalThis);
