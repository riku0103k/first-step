// 練習文章データはこのファイル上部に集約しています。
// カテゴリを増やす場合は practiceTexts にカテゴリ名を追加し、300文字以上の文章を5問以上入れてください。
// 物流ニュースを反映する場合も、既存カテゴリの文章を差し替えるだけで画面に反映されます。
const practiceTexts = {
  "物流全般": [
    "輸出案件では、営業から出荷依頼を受けた時点で、貨物内容、梱包形態、重量、容積、希望ETD、希望ETA、POL、POD、納品条件を確認します。社会人2年目の担当者であれば、依頼書をそのまま船会社へ流すだけでなく、カット日、CY Open、VGM締切、B/L Instruction締切を一覧にして、倉庫、ドレー会社、通関業者へ共有します。港混雑や運賃変動がある場合は、ONE、SITC、Evergreenなど複数船会社のスケジュールを比較し、遅延リスクと追加費用を顧客へ説明します。 また、担当者は変更理由、確認時刻、回答期限を案件メモに残し、次の担当者が同じ判断を再現できる状態にします。顧客へは費用、納期、リスク、代替案をセットで伝え、単なる連絡係ではなく調整役として行動することが求められます。",
    "輸入コンテナでは、Arrival Noticeを受け取った後、B/LのSurrender状況、輸入申告の進捗、D/O切替、配送予約、空コンテナ返却日を同時に管理します。ETAが前倒しまたは遅延した場合、Free Timeの起算日が変わるため、DemurrageとDetentionの発生条件を再確認します。配送先の荷受人が受入日を変更できない時は、港近くの保税倉庫利用や配送日調整を検討し、船会社、フォワーダー、通関業者、ドレー会社へ同じ更新情報を送ります。 また、担当者は変更理由、確認時刻、回答期限を案件メモに残し、次の担当者が同じ判断を再現できる状態にします。顧客へは費用、納期、リスク、代替案をセットで伝え、単なる連絡係ではなく調整役として行動することが求められます。",
    "B/L確認では、Shipper、Consignee、Notify Party、品名、個数、重量、容積、Marks、POL、POD、Place of Deliveryがインボイスやパッキングリストと一致しているかを確認します。スペルミスだけでも銀行決済、輸入通関、現地引き渡しに影響するため、ドラフトB/Lを受け取ったら顧客承認の期限を明確にします。ETD直前の訂正は船会社の訂正料や本船積み残しにつながることがあるため、変更があれば理由、承認者、送信時刻を記録し、関係者へ最新版を再送します。 また、担当者は変更理由、確認時刻、回答期限を案件メモに残し、次の担当者が同じ判断を再現できる状態にします。顧客へは費用、納期、リスク、代替案をセットで伝え、単なる連絡係ではなく調整役として行動することが求められます。",
    "危険品輸送では、DG cargoとして船会社へ事前承認を取り、SDS、UN番号、Class、Packing Group、Proper Shipping Name、Flash Point、容器情報を確認します。普通品として見積を進めた貨物でも、塗料、接着剤、リチウム電池を含む場合は危険品に該当する可能性があります。承認が遅れるとCY搬入や本船スペースに影響するため、営業担当は顧客へ早めに資料提出を依頼し、担当者は危険品倉庫、通関業者、船会社の締切を通常貨物より前倒しで管理します。 また、担当者は変更理由、確認時刻、回答期限を案件メモに残し、次の担当者が同じ判断を再現できる状態にします。顧客へは費用、納期、リスク、代替案をセットで伝え、単なる連絡係ではなく調整役として行動することが求められます。",
    "運賃見積では、Ocean Freightだけでなく、THC、DOC Fee、Seal Fee、CFS Charge、Drayage、通関料、保険料、Peak Season Surchargeを含めた総額で比較します。スポット運賃は市況により短期間で変動するため、見積有効期限、適用ETD、為替条件を明記します。顧客が価格を重視する場合でも、港混雑、Blank Sailing、Busan経由の積み替えリスクを説明し、納期優先なら直行便や別船会社を提案します。判断材料を整理して伝えることが実務担当者の重要な役割です。 また、担当者は変更理由、確認時刻、回答期限を案件メモに残し、次の担当者が同じ判断を再現できる状態にします。顧客へは費用、納期、リスク、代替案をセットで伝え、単なる連絡係ではなく調整役として行動することが求められます。"
  ],
  "英語メール": [
    "Subject: Request for revised schedule and free time confirmation. Dear Team, we have been informed that the ETA at Nagoya may be delayed due to port congestion. Could you please confirm the latest ETD from Busan, revised ETA at Nagoya, and the applicable Free Time for this shipment? The consignee is arranging delivery with a limited receiving window, so we need to avoid Demurrage and Detention as much as possible. Please also advise whether any additional local charges will apply if the container is discharged later than planned. Thank you for your support.",
    "Subject: Draft B/L checking for Shanghai shipment. Dear Sir or Madam, please find attached the draft B/L for the shipment from Nagoya to Shanghai. Kindly check the Shipper, Consignee, Notify Party, cargo description, package quantity, gross weight, measurement, POL, POD, and freight term carefully. If there are any corrections, please send your comments by 10:00 a.m. tomorrow, because the carrier's documentation deadline is approaching. We will proceed with final B/L issuance after receiving your approval. Your prompt confirmation would be appreciated.",
    "Subject: DG cargo documents for carrier approval. Dear Operations Team, attached are the SDS, dangerous goods declaration, and packing details for the DG cargo scheduled to depart from Nagoya next week. Please review the UN number, Class, Packing Group, Proper Shipping Name, and emergency contact information before submitting the application to the carrier. Since DG approval may take longer than regular booking, please advise immediately if any information is missing. We also need to confirm whether transshipment via Busan is acceptable for this commodity.",
    "Subject: Coordination request for import delivery. Dear Partner, the container under B/L number ABCD123456 is expected to arrive at Tokyo on May 18. Before arranging delivery, could you confirm whether the surrender process has been completed and whether the D/O can be released without original documents? The consignee prefers delivery on May 21, but we must check the last free day first. Please coordinate with the customs broker and trucking company, and let us know if storage, Demurrage, or Detention may occur under the current schedule.",
    "Subject: Freight quotation follow-up. Dear Carrier Team, thank you for your quotation for the Nagoya to Shanghai shipment. Before we present it to our customer, could you clarify the validity, applicable vessel, ETD, ETA, space availability, THC, documentation fee, and any seasonal surcharge? The customer is comparing cost and lead time, so we also need to know whether a direct service is available or whether the cargo will be transshipped at Busan. If the rate may change next week, please mention the reason so that we can explain the market situation properly."
  ],
  "物流全般英語版": [
    "In daily forwarding operations, a second-year logistics staff member should not only receive a shipping request but also check whether the cargo details are practical for booking. The person needs to confirm cargo description, package count, gross weight, measurement, requested ETD and ETA, POL, POD, and delivery terms. After that, the staff should compare carrier schedules, documentation deadlines, CY cut-off, VGM deadline, and trucking availability. If port congestion or a sudden freight increase may affect the plan, the customer should receive both the risk and the possible alternatives.",
    "For import containers, schedule control begins when the arrival notice is received. The staff must check the B/L status, surrender confirmation, customs clearance progress, D/O release, delivery appointment, and empty container return plan. If ETA changes, Free Time may also change, and this can create Demurrage or Detention. A practical operator should contact the consignee, customs broker, forwarder, trucking company, and carrier with the same updated information. Clear communication prevents unnecessary storage charges and helps the consignee prepare warehouse space.",
    "B/L checking is a small task with large consequences. The logistics staff must compare the draft B/L with the invoice, packing list, booking confirmation, and customer instruction. Shipper, Consignee, Notify Party, cargo description, marks, package quantity, gross weight, measurement, POL, POD, and freight term should match across all documents. If a correction is needed close to ETD, the carrier may charge an amendment fee or reject the change after documentation closing. Therefore, the staff should record who approved the draft, when it was approved, and which version is final.",
    "Dangerous goods shipments require earlier coordination than general cargo. Before booking DG cargo, the operator should collect the SDS, UN number, Class, Packing Group, Proper Shipping Name, flash point, package type, and emergency contact details. Some carriers may accept the cargo on a direct service but reject it on a transshipment service via Busan or another port. If approval is delayed, the cargo may miss the CY cut-off even when the truck is ready. A careful logistics staff member confirms requirements with the carrier, warehouse, customs broker, and customer before promising the ETD.",
    "Freight quotation work is more than copying a rate from a carrier email. The staff should compare ocean freight, THC, documentation fee, seal fee, CFS charge, drayage, customs clearance cost, insurance, and possible peak season surcharge. Spot rates can change quickly, so the quotation should show validity, applicable sailing, currency, and assumptions. When the customer asks for the cheapest option, the operator still needs to explain schedule reliability, port congestion, blank sailing risk, Free Time conditions, and the cost impact of delay. This balanced explanation supports better business decisions."
  ]
};

const rankRules = [
  { rank: "S", min: 180, hint: "180字/分以上。物流実務でも非常に速い入力です。" },
  { rank: "A", min: 140, hint: "140〜179字/分。速く安定した入力です。" },
  { rank: "B", min: 100, hint: "100〜139字/分。実務で使いやすい速度です。" },
  { rank: "C", min: 70, hint: "70〜99字/分。正確性を保ちながら速度を上げましょう。" },
  { rank: "D", min: 40, hint: "40〜69字/分。基礎を固めていきましょう。" },
  { rank: "E", min: 0, hint: "39字/分以下。まずは正確な入力を意識しましょう。" }
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
  const targetLength = splitCharacters(currentText).length;

  elements.elapsedTime.textContent = `${stats.elapsedSeconds.toFixed(1)}秒`;
  elements.charsPerMinute.textContent = String(stats.charsPerMinute);
  elements.accuracy.textContent = `${stats.accuracy}%`;
  elements.mistakes.textContent = String(stats.mistakes);
  elements.typedCount.textContent = String(stats.inputLength);
  elements.progressText.textContent = `${Math.min(stats.inputLength, targetLength)} / ${targetLength} 文字`;
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
    const stats = calculateStats(input);
    const rank = getRank(stats.charsPerMinute);
    elements.completionMessage.textContent = `完了しました。時間: ${stats.elapsedSeconds.toFixed(1)}秒 / 速度: ${stats.charsPerMinute}字/分 / 正答率: ${stats.accuracy}% / ランク: ${rank.rank}`;
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
  elements.categoryBadge.textContent = `${category} ${currentTextIndex + 1}/${texts.length}`;
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
