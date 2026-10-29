// Road Signs BD — sign bank. Shape codes: W = warning triangle, P = prohibitory circle,
// M = mandatory circle, I = informative rectangle. `slash` draws the red bar on prohibitory signs.
(function (root) {
  const SIGNS = [
    // ---- Warning (8) ----
    { id: "w-ped", cat: "warning", shape: "W", symbol: "🚶", nameEn: "Pedestrian crossing ahead", nameBn: "সামনে পথচারী পারাপার", meanEn: "Slow down — pedestrians may be crossing the road ahead.", meanBn: "গতি কমান — সামনে পথচারীরা রাস্তা পার হতে পারে।" },
    { id: "w-school", cat: "warning", shape: "W", symbol: "🎒", nameEn: "School ahead", nameBn: "সামনে স্কুল", meanEn: "A school is nearby — drive slowly and watch for children.", meanBn: "কাছে স্কুল আছে — ধীরে চালান এবং শিশুদের দিকে লক্ষ্য রাখুন।" },
    { id: "w-bend", cat: "warning", shape: "W", symbol: "↩", nameEn: "Sharp bend to the left", nameBn: "বামে তীক্ষ্ণ বাঁক", meanEn: "The road bends sharply left ahead — slow down before the bend.", meanBn: "সামনে রাস্তা বামে তীক্ষ্ণভাবে বাঁক নিয়েছে — বাঁকের আগে গতি কমান।" },
    { id: "w-narrow", cat: "warning", shape: "W", symbol: "⇥⇤", nameEn: "Road narrows ahead", nameBn: "সামনে রাস্তা সরু", meanEn: "The road becomes narrower ahead — keep to your side.", meanBn: "সামনে রাস্তা সরু হয়ে যাবে — নিজের পাশে থাকুন।" },
    { id: "w-works", cat: "warning", shape: "W", symbol: "🚧", nameEn: "Road works ahead", nameBn: "সামনে রাস্তার কাজ চলছে", meanEn: "Construction or repair work ahead — expect workers and diversions.", meanBn: "সামনে নির্মাণ বা মেরামতের কাজ চলছে — শ্রমিক ও ঘুরপথ থাকতে পারে।" },
    { id: "w-slippery", cat: "warning", shape: "W", symbol: "〰", nameEn: "Slippery road", nameBn: "পিচ্ছিল রাস্তা", meanEn: "The surface may be slippery, especially when wet — avoid sudden braking.", meanBn: "রাস্তা পিচ্ছিল হতে পারে, বিশেষ করে ভেজা অবস্থায় — হঠাৎ ব্রেক এড়িয়ে চলুন।" },
    { id: "w-breaker", cat: "warning", shape: "W", symbol: "⋀", nameEn: "Speed breaker ahead", nameBn: "সামনে স্পিড ব্রেকার", meanEn: "A speed breaker (hump) is ahead — slow down to avoid damage.", meanBn: "সামনে স্পিড ব্রেকার আছে — ক্ষতি এড়াতে গতি কমান।" },
    { id: "w-rail", cat: "warning", shape: "W", symbol: "🚂", nameEn: "Railway crossing ahead", nameBn: "সামনে রেলক্রসিং", meanEn: "A railway level crossing is ahead — stop and look before crossing.", meanBn: "সামনে রেলক্রসিং আছে — পার হওয়ার আগে থামুন ও দেখুন।" },
    // ---- Prohibitory (8) ----
    { id: "p-noentry", cat: "prohibitory", shape: "P", symbol: "—", slash: false, nameEn: "No entry", nameBn: "প্রবেশ নিষেধ", meanEn: "Do not enter this road — traffic flows the other way.", meanBn: "এই রাস্তায় প্রবেশ করবেন না — যান চলাচল উল্টো দিকে।" },
    { id: "p-speed50", cat: "prohibitory", shape: "P", symbol: "50", slash: false, nameEn: "Speed limit 50 km/h", nameBn: "গতিসীমা ৫০ কিমি/ঘণ্টা", meanEn: "You must not exceed 50 kilometres per hour here.", meanBn: "এখানে ঘণ্টায় ৫০ কিলোমিটারের বেশি গতিতে চালানো যাবে না।" },
    { id: "p-nopark", cat: "prohibitory", shape: "P", symbol: "P", slash: true, nameEn: "No parking", nameBn: "পার্কিং নিষেধ", meanEn: "Parking is not allowed in this area.", meanBn: "এই এলাকায় পার্কিং করা যাবে না।" },
    { id: "p-nohorn", cat: "prohibitory", shape: "P", symbol: "♪", slash: true, nameEn: "No horn", nameBn: "হর্ন বাজানো নিষেধ", meanEn: "Do not sound your horn here — often near hospitals and schools.", meanBn: "এখানে হর্ন বাজাবেন না — সাধারণত হাসপাতাল ও স্কুলের কাছে থাকে।" },
    { id: "p-noover", cat: "prohibitory", shape: "P", symbol: "⇉", slash: true, nameEn: "No overtaking", nameBn: "ওভারটেকিং নিষেধ", meanEn: "Overtaking other vehicles is prohibited on this stretch.", meanBn: "এই অংশে অন্য গাড়িকে ওভারটেক করা নিষেধ।" },
    { id: "p-nouturn", cat: "prohibitory", shape: "P", symbol: "↩", slash: true, nameEn: "No U-turn", nameBn: "ইউ-টার্ন নিষেধ", meanEn: "Making a U-turn here is not allowed.", meanBn: "এখানে ইউ-টার্ন নেওয়া যাবে না।" },
    { id: "p-noped", cat: "prohibitory", shape: "P", symbol: "🚶", slash: true, nameEn: "No pedestrians", nameBn: "পথচারী প্রবেশ নিষেধ", meanEn: "Pedestrians are not allowed on this road.", meanBn: "এই রাস্তায় পথচারীদের প্রবেশ নিষেধ।" },
    { id: "p-weight", cat: "prohibitory", shape: "P", symbol: "10t", slash: false, nameEn: "Weight limit 10 tonnes", nameBn: "ওজনসীমা ১০ টন", meanEn: "Vehicles over 10 tonnes total weight must not use this road or bridge.", meanBn: "১০ টনের বেশি ওজনের গাড়ি এই রাস্তা বা সেতু ব্যবহার করতে পারবে না।" },
    // ---- Mandatory (6) ----
    { id: "m-left", cat: "mandatory", shape: "M", symbol: "←", nameEn: "Keep left", nameBn: "বামে থাকুন", meanEn: "You must keep to the left side of the road.", meanBn: "আপনাকে রাস্তার বাম পাশে থাকতে হবে।" },
    { id: "m-turnleft", cat: "mandatory", shape: "M", symbol: "↰", nameEn: "Turn left only", nameBn: "শুধু বামে মোড়", meanEn: "At the junction ahead you must turn left.", meanBn: "সামনের মোড়ে আপনাকে বামে মোড় নিতে হবে।" },
    { id: "m-turnright", cat: "mandatory", shape: "M", symbol: "↱", nameEn: "Turn right only", nameBn: "শুধু ডানে মোড়", meanEn: "At the junction ahead you must turn right.", meanBn: "সামনের মোড়ে আপনাকে ডানে মোড় নিতে হবে।" },
    { id: "m-straight", cat: "mandatory", shape: "M", symbol: "↑", nameEn: "Go straight only", nameBn: "শুধু সোজা যান", meanEn: "You must continue straight ahead — no turning here.", meanBn: "আপনাকে সোজা যেতে হবে — এখানে মোড় নেওয়া যাবে না।" },
    { id: "m-round", cat: "mandatory", shape: "M", symbol: "↻", nameEn: "Roundabout ahead", nameBn: "সামনে গোলচত্বর", meanEn: "Follow the roundabout in the direction shown.", meanBn: "দেখানো দিকে গোলচত্বর অনুসরণ করুন।" },
    { id: "m-min30", cat: "mandatory", shape: "M", symbol: "30", nameEn: "Minimum speed 30 km/h", nameBn: "সর্বনিম্ন গতি ৩০ কিমি/ঘণ্টা", meanEn: "You must drive at least 30 kilometres per hour here.", meanBn: "এখানে কমপক্ষে ঘণ্টায় ৩০ কিলোমিটার গতিতে চালাতে হবে।" },
    // ---- Informative (6) ----
    { id: "i-park", cat: "informative", shape: "I", symbol: "P", nameEn: "Parking", nameBn: "পার্কিং", meanEn: "A parking area is available here.", meanBn: "এখানে পার্কিংয়ের ব্যবস্থা আছে।" },
    { id: "i-hospital", cat: "informative", shape: "I", symbol: "H", nameEn: "Hospital ahead", nameBn: "সামনে হাসপাতাল", meanEn: "A hospital is nearby — drive quietly and be ready to give way.", meanBn: "কাছে হাসপাতাল আছে — নীরবে চালান এবং পথ ছাড়তে প্রস্তুত থাকুন।" },
    { id: "i-petrol", cat: "informative", shape: "I", symbol: "⛽", nameEn: "Petrol station ahead", nameBn: "সামনে পেট্রোল পাম্প", meanEn: "A fuel station is ahead.", meanBn: "সামনে পেট্রোল পাম্প আছে।" },
    { id: "i-bus", cat: "informative", shape: "I", symbol: "🚌", nameEn: "Bus stop", nameBn: "বাস স্টপ", meanEn: "This is a designated bus stopping place.", meanBn: "এটি বাস থামার নির্ধারিত স্থান।" },
    { id: "i-aid", cat: "informative", shape: "I", symbol: "+", nameEn: "First aid post", nameBn: "প্রাথমিক চিকিৎসা কেন্দ্র", meanEn: "First aid is available at this point.", meanBn: "এই স্থানে প্রাথমিক চিকিৎসা পাওয়া যাবে।" },
    { id: "i-dir", cat: "informative", shape: "I", symbol: "→", nameEn: "Direction sign", nameBn: "দিকনির্দেশক সাইন", meanEn: "Shows the direction and distance to the named destination.", meanBn: "গন্তব্যের দিক ও দূরত্ব দেখায়।" }
  ];

  function svgFor(sign, size) {
    size = size || 96;
    const s = sign.symbol;
    if (sign.shape === "W") {
      return '<svg viewBox="0 0 100 100" width="' + size + '" height="' + size + '" role="img" aria-label="' + sign.nameEn + '">'
        + '<polygon points="50,6 96,92 4,92" fill="#fff" stroke="#d8232a" stroke-width="7" stroke-linejoin="round"/>'
        + '<text x="50" y="76" text-anchor="middle" font-size="30" font-family="sans-serif">' + s + '</text></svg>';
    }
    if (sign.shape === "P") {
      let slash = sign.slash ? '<line x1="20" y1="80" x2="80" y2="20" stroke="#d8232a" stroke-width="7" stroke-linecap="round"/>' : '';
      return '<svg viewBox="0 0 100 100" width="' + size + '" height="' + size + '" role="img" aria-label="' + sign.nameEn + '">'
        + '<circle cx="50" cy="50" r="44" fill="#fff" stroke="#d8232a" stroke-width="8"/>'
        + '<text x="50" y="62" text-anchor="middle" font-size="30" font-family="sans-serif" font-weight="bold">' + s + '</text>' + slash + '</svg>';
    }
    if (sign.shape === "M") {
      return '<svg viewBox="0 0 100 100" width="' + size + '" height="' + size + '" role="img" aria-label="' + sign.nameEn + '">'
        + '<circle cx="50" cy="50" r="46" fill="#0b5ed7" stroke="#fff" stroke-width="3"/>'
        + '<text x="50" y="64" text-anchor="middle" font-size="32" font-family="sans-serif" font-weight="bold" fill="#fff">' + s + '</text></svg>';
    }
    return '<svg viewBox="0 0 100 100" width="' + size + '" height="' + size + '" role="img" aria-label="' + sign.nameEn + '">'
      + '<rect x="6" y="6" width="88" height="88" rx="10" fill="#0a7a42" stroke="#fff" stroke-width="3"/>'
      + '<text x="50" y="64" text-anchor="middle" font-size="32" font-family="sans-serif" font-weight="bold" fill="#fff">' + s + '</text></svg>';
  }

  const api = { SIGNS: SIGNS, svgFor: svgFor };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.RoadSigns = api;
})(typeof window !== "undefined" ? window : globalThis);
