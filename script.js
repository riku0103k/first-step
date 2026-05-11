const practiceTexts = {
  "海上輸送": [
    "海上輸送では本船動静を確認し、カット日に間に合うように搬入予定を調整します。",
    "コンテナヤードへの搬入後は、船積み書類とブッキング番号の整合性を確認します。",
    "輸入貨物はフリータイムを把握し、デマレージが発生しないよう早めに配送手配を行います。"
  ],
  "B/L": [
    "B/Lの荷受人欄、通知先、品名、個数、重量に誤りがないか発行前に確認します。",
    "サレンダーB/Lの場合は、船会社からの元地回収確認を受けてから貨物引き渡しを進めます。",
    "オリジナルB/Lは有価証券性があるため、社内規程に従い厳重に保管します。"
  ],
  "港コード": [
    "東京港はJPTYO、横浜港はJPYOK、大阪港はJPOSAとして港コードを入力します。",
    "港コードの入力ミスは誤配や通関遅延につながるため、依頼書とシステムを照合します。",
    "仕向港コードと荷揚港コードが異なる場合は、経由地と最終配送先を必ず確認します。"
  ],
  "危険品": [
    "危険品の船積みではUN番号、クラス、容器等級、SDSを確認して申告します。",
    "リチウム電池を含む貨物は、梱包基準とラベル表示の条件を事前に確認します。",
    "危険品明細に不備がある場合、船会社の承認が下りず出荷スケジュールに影響します。"
  ],
  "英文メール": [
    "Please confirm the vessel schedule and advise the earliest available booking for this shipment.",
    "Kindly send us the draft B/L for checking before the final document is issued.",
    "We would appreciate it if you could update the consignee about the revised arrival date."
  ]
};

const rankRules = [
  { rank: "S", min: 180, hint: "プロレベルの物流オペレーション速度です" },
  { rank: "A", min: 140, hint: "非常に速く正確な入力です" },
  { rank: "B", min: 110, hint: "実務で安心できるスピードです" },
  { rank: "C", min: 80, hint: "安定しています。さらに上を目指しましょう" },
  { rank: "D", min: 50, hint: "基礎練習を継続しましょう" },
  { rank: "E", min: 0, hint: "まずは正確な入力を意識しましょう" }
];

const elements = {
  categorySelect: document.querySelector("#categorySelect"),
  nextTextButton: document.querySelector("#nextTextButton"),
  resetButton: document.querySelector("#resetButton"),
  categoryBadge: document.querySelector("#categoryBadge"),
  targetText: document.querySelector("#targetText"),
  typingInput: document.querySelector("#typingInput"),
  progressText: document.querySelector("#progressText"),
  elapsedTime: document.querySelector("#elapsedTime"),
  charsPerMinute: document.querySelector("#charsPerMinute"),
  accuracy: document.querySelector("#accuracy"),
  mistakes: document.querySelector("#mistakes"),
  typedCount: document.querySelector("#typedCount"),
  rank: document.querySelector("#rank"),
  rankHint: document.querySelector("#rankHint"),
  completionMessage: document.querySelector("#completionMessage")
};

let currentText = "";
let currentTextIndex = 0;
let startTime = null;
let endTime = null;
let timerId = null;

function splitCharacters(text) {
  return Array.from(text);
}

function escapeHtml(character) {
  const replacements = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };

  return replacements[character] || character;
}

function getElapsedSeconds() {
  if (!startTime) {
    return 0;
  }

  const finish = endTime || Date.now();
  return Math.max((finish - startTime) / 1000, 0);
}

function calculateStats(input) {
  const targetChars = splitCharacters(currentText);
  const inputChars = splitCharacters(input);
  let correctCount = 0;
  let mistakes = 0;

  inputChars.forEach((character, index) => {
    if (character === targetChars[index]) {
      correctCount += 1;
    } else {
      mistakes += 1;
    }
  });

  const elapsedSeconds = getElapsedSeconds();
  const minutes = elapsedSeconds / 60;
  const charsPerMinute = minutes > 0 ? Math.round(correctCount / minutes) : 0;
  const accuracy = inputChars.length > 0 ? Math.round((correctCount / inputChars.length) * 100) : 100;

  return {
    inputLength: inputChars.length,
    correctCount,
    mistakes,
    elapsedSeconds,
    charsPerMinute,
    accuracy
  };
}

function getRank(charsPerMinute) {
  return rankRules.find((rule) => charsPerMinute >= rule.min) || rankRules[rankRules.length - 1];
}

function renderTargetText(input = "") {
  const targetChars = splitCharacters(currentText);
  const inputChars = splitCharacters(input);

  elements.targetText.innerHTML = targetChars.map((character, index) => {
    let className = "char-pending";

    if (index < inputChars.length) {
      className = inputChars[index] === character ? "char-correct" : "char-wrong";
    }

    return `<span class="${className}">${escapeHtml(character)}</span>`;
  }).join("");
}

function renderStats(input = "") {
  const stats = calculateStats(input);
  const rank = startTime ? getRank(stats.charsPerMinute) : { rank: "-", hint: "入力を開始すると判定します" };

  elements.elapsedTime.textContent = `${stats.elapsedSeconds.toFixed(1)}秒`;
  elements.charsPerMinute.textContent = String(stats.charsPerMinute);
  elements.accuracy.textContent = `${stats.accuracy}%`;
  elements.mistakes.textContent = String(stats.mistakes);
  elements.typedCount.textContent = String(stats.inputLength);
  elements.progressText.textContent = `${Math.min(stats.inputLength, splitCharacters(currentText).length)} / ${splitCharacters(currentText).length} 文字`;
  elements.rank.textContent = rank.rank;
  elements.rankHint.textContent = rank.hint;
}

function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

function startTimer() {
  if (startTime) {
    return;
  }

  startTime = Date.now();
  timerId = setInterval(() => renderStats(elements.typingInput.value), 100);
}

function isCompleted(input) {
  return input === currentText;
}

function handleInput() {
  const input = elements.typingInput.value;

  if (input.length > 0) {
    startTimer();
  }

  if (isCompleted(input) && !endTime) {
    endTime = Date.now();
    stopTimer();
    elements.completionMessage.textContent = "完了しました。カテゴリや文章を変えて続けて練習できます。";
  } else if (!isCompleted(input)) {
    endTime = null;
    elements.completionMessage.textContent = "";
    if (startTime && !timerId) {
      timerId = setInterval(() => renderStats(elements.typingInput.value), 100);
    }
  }

  renderTargetText(input);
  renderStats(input);
}

function setText(category, direction = 0) {
  const texts = practiceTexts[category];
  currentTextIndex = (currentTextIndex + direction + texts.length) % texts.length;
  currentText = texts[currentTextIndex];
  elements.categoryBadge.textContent = category;
  resetPractice();
}

function resetPractice() {
  stopTimer();
  startTime = null;
  endTime = null;
  elements.typingInput.value = "";
  elements.completionMessage.textContent = "";
  renderTargetText();
  renderStats();
  elements.typingInput.focus();
}

elements.categorySelect.addEventListener("change", (event) => {
  currentTextIndex = 0;
  setText(event.target.value);
});

elements.nextTextButton.addEventListener("click", () => {
  setText(elements.categorySelect.value, 1);
});

elements.resetButton.addEventListener("click", resetPractice);
elements.typingInput.addEventListener("input", handleInput);

setText(elements.categorySelect.value);
