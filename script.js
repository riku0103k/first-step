const noisePatterns = [
  /お疲れ様です/g,
  /よろしくお願いします/g,
  /聞こえますか/g,
  /少々お待ちください/g,
  /画面共有/g,
  /雑談/g,
  /こんにちは/g,
  /ありがとうございます/g
];

const decisionWords = ["決定", "合意", "進める", "承認", "確定", "採用", "了承", "方針", "決める"];
const todoWords = ["対応", "作成", "確認", "連絡", "提出", "共有", "修正", "調整", "依頼", "送付", "更新", "交渉"];
const issueWords = ["課題", "懸念", "問題", "リスク", "未確認", "要確認", "未決", "不足", "遅延", "影響"];
const nextWords = ["次回", "次の会議", "次回まで", "次回会議", "次回定例"];
const highPriorityWords = ["顧客", "クライアント", "至急", "本日", "明日", "承認", "意思決定", "遅延", "リスク", "Demurrage", "デマレージ", "影響"];
const lowPriorityWords = ["参考", "余裕", "任意", "可能であれば", "後日"];

const elements = {
  meetingName: document.getElementById("meetingName"),
  meetingDate: document.getElementById("meetingDate"),
  participants: document.getElementById("participants"),
  clientName: document.getElementById("clientName"),
  meetingPurpose: document.getElementById("meetingPurpose"),
  agenda: document.getElementById("agenda"),
  transcript: document.getElementById("transcript"),
  keywords: document.getElementById("keywords"),
  confidentiality: document.getElementById("confidentiality"),
  tone: document.getElementById("tone"),
  useCase: document.getElementById("useCase"),
  output: document.getElementById("output"),
  statusMessage: document.getElementById("statusMessage"),
  generateButton: document.getElementById("generateButton"),
  sampleButton: document.getElementById("sampleButton"),
  promptButton: document.getElementById("promptButton"),
  copyButton: document.getElementById("copyButton"),
  downloadButton: document.getElementById("downloadButton"),
  resetButton: document.getElementById("resetButton")
};

function getFormData() {
  return {
    meetingName: elements.meetingName.value.trim(),
    meetingDate: elements.meetingDate.value.trim(),
    participants: elements.participants.value.trim(),
    clientName: elements.clientName.value.trim(),
    meetingPurpose: elements.meetingPurpose.value.trim(),
    agenda: elements.agenda.value.trim(),
    transcript: elements.transcript.value.trim(),
    keywords: elements.keywords.value.trim(),
    confidentiality: elements.confidentiality.value,
    tone: elements.tone.value,
    useCase: elements.useCase.value
  };
}

function setStatus(message) {
  elements.statusMessage.textContent = message;
  window.clearTimeout(setStatus.timer);
  setStatus.timer = window.setTimeout(() => {
    elements.statusMessage.textContent = "";
  }, 3500);
}

function cleanTranscript(text) {
  let cleaned = text.replace(/\r/g, "\n");
  noisePatterns.forEach((pattern) => {
    cleaned = cleaned.replace(pattern, "");
  });
  return cleaned
    .split(/\n|。|．|\./)
    .map((line) => line.replace(/^\s*[-・*\d）).:：]+\s*/, "").trim())
    .filter((line) => line.length >= 6);
}

function includesAny(text, words) {
  return words.some((word) => text.includes(word));
}

function uniqueItems(items, limit = 8) {
  const seen = new Set();
  return items.filter((item) => {
    const source = typeof item === "string" ? item : item.text;
    const normalized = source.replace(/\s+/g, "").slice(0, 80);
    if (seen.has(normalized)) {
      return false;
    }
    seen.add(normalized);
    return true;
  }).slice(0, limit);
}

function extractAgendaItems(agendaText) {
  const items = agendaText
    .split(/\n|、|,/)
    .map((item) => item.replace(/^\s*[-・*\d）).:：]+\s*/, "").trim())
    .filter(Boolean);
  return items.length > 0 ? items : ["会議目的・背景の確認", "主要論点の整理", "決定事項・TODOの確認"];
}

function extractAssignee(text) {
  const patterns = [
    /([一-龥ぁ-んァ-ヶA-Za-z0-9]{1,16}(?:さん|様|氏|部|課|チーム|担当|会社|業者))/,
    /担当[:：は\s]*([一-龥ぁ-んァ-ヶA-Za-z0-9]+(?:さん|様|氏|部|課|チーム)?)/
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const candidate = match[1].replace(/^担当[:：は\s]*/, "");
      if (!/[のにをがへで]/.test(candidate)) {
        return candidate;
      }
    }
  }
  return "要確認";
}

function extractDueDate(text) {
  const match = text.match(/(本日中|明日|明後日|今週中|来週中|来週|月末|週明け|\d{1,2}[\/月]\d{1,2}日?|\d{1,2}日まで|\d{1,2}営業日以内)/);
  return match ? match[1] : "要確認";
}

function classifyPriority(text, dueDate) {
  if (includesAny(text, highPriorityWords) || ["本日中", "明日", "明後日", "今週中"].includes(dueDate)) {
    return "高";
  }
  if (includesAny(text, lowPriorityWords)) {
    return "低";
  }
  return "中";
}

function toBulletLines(items, fallback, limit = 6) {
  const selected = uniqueItems(items, limit);
  if (selected.length === 0) {
    return `・${fallback}`;
  }
  return selected.map((item) => `・${summarizeLine(item)}`).join("\n");
}

function summarizeLine(text) {
  return text
    .replace(/えー|あの|その|ちょっと|まあ|一応/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

function buildExecutiveSummary(data, extracted) {
  const summary = [];
  if (data.meetingPurpose) {
    summary.push(`本会議は、${data.meetingPurpose}ことを目的に実施した。`);
  } else {
    summary.push("本会議では、入力メモに基づき主要論点、決定事項、TODOを整理した。");
  }
  if (extracted.decisions.length > 0) {
    summary.push(`主な決定事項は「${summarizeLine(extracted.decisions[0])}」。`);
  }
  if (extracted.todos.length > 0) {
    const topTodo = extracted.todos[0];
    summary.push(`次アクションは「${summarizeLine(topTodo.text)}」で、担当者は${topTodo.assignee}、期限は${topTodo.dueDate}。`);
  }
  if (extracted.issues.length > 0) {
    summary.push(`継続課題として「${summarizeLine(extracted.issues[0])}」の確認が必要。`);
  }
  if (data.useCase === "経営層報告用") {
    summary.push("経営判断に必要なリスク、顧客影響、期限超過の有無を優先して確認する。");
  }
  return summary.slice(0, 5).map((item) => `・${item}`).join("\n");
}

function extractMeetingInsights(data) {
  const lines = cleanTranscript(data.transcript);
  const decisions = [];
  const issues = [];
  const nextActions = [];
  const todos = [];

  lines.forEach((line) => {
    if (includesAny(line, decisionWords)) {
      decisions.push(line);
    }
    if (includesAny(line, issueWords)) {
      issues.push(line);
    }
    if (includesAny(line, nextWords)) {
      nextActions.push(line);
    }
    if (includesAny(line, todoWords)) {
      const dueDate = extractDueDate(line);
      todos.push({
        text: line,
        assignee: extractAssignee(line),
        dueDate,
        priority: classifyPriority(line, dueDate)
      });
    }
  });

  return {
    lines,
    decisions: uniqueItems(decisions, 8),
    issues: uniqueItems(issues, 8),
    nextActions: uniqueItems(nextActions, 5),
    todos: uniqueItems(todos, 8)
  };
}

function buildDiscussionSummary(agendaItems, extracted) {
  return agendaItems.slice(0, 4).map((agenda, index) => {
    const related = extracted.lines.filter((line) => line.includes(agenda) || agenda.split(/\s|・|\/|／/).some((word) => word.length > 2 && line.includes(word))).slice(0, 2);
    const opinions = related.length > 0 ? related.map((line) => `・主な意見：${summarizeLine(line)}`).join("\n") : "・主な意見：関連する発言は要確認。";
    const conclusion = extracted.decisions.find((line) => related.includes(line)) || extracted.decisions[index] || "結論は要確認。";
    return `【議題${index + 1}】${agenda}\n・論点：${agenda}に関する現状、影響、対応方針を整理。\n${opinions}\n・結論：${summarizeLine(conclusion)}`;
  }).join("\n\n");
}

function buildTodoTable(todos) {
  const rows = todos.length > 0 ? todos : [{ text: "追加対応事項を確認する", assignee: "要確認", dueDate: "要確認", priority: "中" }];
  return [
    "| No | タスク内容 | 担当者 | 期限 | 優先度 | 補足 |",
    "| -- | ----- | --- | -- | --- | -- |",
    ...rows.map((todo, index) => `| ${index + 1} | ${summarizeLine(todo.text)} | ${todo.assignee} | ${todo.dueDate} | ${todo.priority} | 根拠：会議メモより抽出 |`)
  ].join("\n");
}

function buildConfirmationItems(data, extracted) {
  const confirmations = [];
  if (!data.meetingDate) confirmations.push("会議日時が未入力のため確認する。");
  if (!data.participants) confirmations.push("参加者および各社の役割を確認する。");
  if (extracted.todos.some((todo) => todo.assignee === "要確認")) confirmations.push("TODOの担当者が未特定の項目を確認する。");
  if (extracted.todos.some((todo) => todo.dueDate === "要確認")) confirmations.push("TODOの期限が未特定の項目を確認する。");
  if (extracted.decisions.length === 0) confirmations.push("明確な決定事項が読み取れないため、合意内容を確認する。");
  if (extracted.issues.length === 0) confirmations.push("未決事項・課題がないか関係者へ確認する。");
  return toBulletLines(confirmations, "追加確認事項なし。ただし、提出前に担当者・期限・社外共有可否を再確認する。", 8);
}

function generateMinutes() {
  const data = getFormData();
  const extracted = extractMeetingInsights(data);
  const agendaItems = extractAgendaItems(data.agenda);
  const agendaList = agendaItems.map((item, index) => `${index + 1}. ${item}`).join("\n");
  const keywordText = data.keywords ? `重要キーワード：${data.keywords}` : "重要キーワード：未入力";
  const toneNote = `出力トーン：${data.tone}／用途：${data.useCase}`;

  const minutes = `【会議議事録】\n\n■エグゼクティブサマリー\n${buildExecutiveSummary(data, extracted)}\n\n■会議概要\n・会議名：${data.meetingName || "要確認"}\n・日時：${data.meetingDate || "要確認"}\n・参加者：${data.participants || "要確認"}\n・クライアント名／案件名：${data.clientName || "要確認"}\n・目的：${data.meetingPurpose || "要確認"}\n・機密情報レベル：${data.confidentiality}\n\n■アジェンダ\n${agendaList}\n\n■議論内容サマリー\n${buildDiscussionSummary(agendaItems, extracted)}\n\n■決定事項\n${toBulletLines(extracted.decisions, "明確な決定事項は入力内容から抽出できないため、会議主催者へ確認する。", 6)}\n\n■未決事項・課題\n${toBulletLines(extracted.issues, "未決事項・課題は入力内容から抽出できないため、関係者へ確認する。", 6)}\n\n■TODO一覧\n\n${buildTodoTable(extracted.todos)}\n\n■次回会議までのアクション\n${toBulletLines(extracted.nextActions, "次回会議までの具体アクションは要確認。", 5)}\n\n■要確認事項\n${buildConfirmationItems(data, extracted)}\n\n■補足事項\n・${keywordText}\n・${toneNote}\n・本議事録はルールベース抽出による下書きであり、社外共有前に事実関係、担当者、期限、機密情報の記載範囲を確認する。`;

  elements.output.value = minutes;
  setStatus("議事録下書きを作成しました。");
}

function generatePrompt() {
  const data = getFormData();
  const prompt = `あなたは外資系コンサルティングファーム出身のPM兼ビジネスアナリストです。以下の会議情報と文字起こしをもとに、A4 1〜2枚程度で読める実務レベルの議事録を作成してください。\n\n# 重要指示\n- 単なる文字起こしの羅列ではなく、ビジネス上重要な情報のみ整理・要約する\n- 決定事項、TODO、未決事項、期限、担当者、目的・背景を明確化する\n- 「誰が・何を・いつまでに・なぜ行うか」が分かるようにする\n- 不明点は要確認事項として分離する\n- 雑談、挨拶、オンライン会議特有のノイズは除外する\n- 文体は${data.tone}、用途は${data.useCase}を想定する\n- 機密情報レベルは「${data.confidentiality}」。不要な繰り返しは避ける\n\n# 出力フォーマット\n【会議議事録】\n■エグゼクティブサマリー\n■会議概要\n■アジェンダ\n■議論内容サマリー\n■決定事項\n■未決事項・課題\n■TODO一覧（No、タスク内容、担当者、期限、優先度、補足の表）\n■次回会議までのアクション\n■要確認事項\n■補足事項\n\n# 会議情報\n- 会議名：${data.meetingName || "未入力"}\n- 会議日時：${data.meetingDate || "未入力"}\n- 参加者：${data.participants || "未入力"}\n- クライアント名／案件名：${data.clientName || "未入力"}\n- 会議目的：${data.meetingPurpose || "未入力"}\n- 会議アジェンダ：\n${data.agenda || "未入力"}\n- 重要キーワード：${data.keywords || "未入力"}\n\n# 会議メモ・文字起こし\n${data.transcript || "未入力"}`;

  elements.output.value = prompt;
  setStatus("ChatGPT貼り付け用プロンプトを生成しました。");
}

function fillSample() {
  elements.meetingName.value = "輸入コンテナ ETA遅延・費用リスク対応会議";
  elements.meetingDate.value = "2026/05/11 10:00-11:00";
  elements.participants.value = "ABC商事 田中様、物流部 佐藤さん、通関業者 山本さん、倉庫担当 鈴木さん、当社PM 加藤";
  elements.clientName.value = "ABC商事 アジア発輸入案件";
  elements.meetingPurpose.value = "ETA遅延に伴う納品影響、Free Time延長交渉、Demurrage発生リスクへの対応方針を決定する";
  elements.agenda.value = "1. B/L記載内容の確認\n2. 本船ETA遅延状況と納品影響\n3. Free Time延長交渉方針\n4. 通関業者・倉庫との調整事項\n5. 次回会議までのTODO確認";
  elements.keywords.value = "B/L, ETA遅延, Free Time, Demurrage, 通関, 倉庫調整, 船会社";
  elements.confidentiality.value = "社外秘";
  elements.tone.value = "フォーマル";
  elements.useCase.value = "クライアント提出用";
  elements.transcript.value = "B/LのConsignee表記はABC商事で確定。Notify Partyの住所に一部旧住所が残っているため、船会社へ修正依頼することで合意。佐藤さんが本日中に船会社へ連絡し、修正後ドラフトを共有する。\n本船ETAは5/15予定から5/18へ遅延。倉庫の搬入枠に影響があるため、鈴木さんが明日までに倉庫へ再調整を依頼する。顧客納品が5/20指定のため、遅延リスクは高い。\nFree Timeは標準7日だが、ETA遅延によりDemurrage発生リスクがある。山本さんが今週中に船会社へFree Time延長交渉を行う。延長可否が未確認のため課題として残す。\n通関書類はPacking Listの重量欄に差異がある問題を確認。ABC商事 田中様が来週までに仕入先へ修正版を依頼する。\n次回までに、B/L修正版、Free Time延長可否、倉庫搬入枠、通関書類差異の解消状況を共有する。次回会議は5/14に実施する方向で進める。";
  setStatus("物流業界のサンプルを入力しました。");
}

async function copyOutput() {
  if (!elements.output.value.trim()) {
    setStatus("コピーする議事録がありません。");
    return;
  }
  try {
    await navigator.clipboard.writeText(elements.output.value);
    setStatus("クリップボードにコピーしました。");
  } catch (error) {
    elements.output.select();
    document.execCommand("copy");
    setStatus("クリップボードにコピーしました。");
  }
}

function downloadOutput() {
  if (!elements.output.value.trim()) {
    setStatus("ダウンロードする議事録がありません。");
    return;
  }
  const data = getFormData();
  const blob = new Blob([elements.output.value], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const safeName = (data.meetingName || "meeting-minutes").replace(/[\\/:*?"<>|\s]+/g, "-");
  anchor.href = url;
  anchor.download = `${safeName}.txt`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  setStatus("テキストファイルをダウンロードしました。");
}

function resetAll() {
  document.getElementById("minutesForm").reset();
  elements.output.value = "";
  setStatus("入力内容と出力内容をクリアしました。");
}

elements.generateButton.addEventListener("click", generateMinutes);
elements.sampleButton.addEventListener("click", fillSample);
elements.promptButton.addEventListener("click", generatePrompt);
elements.copyButton.addEventListener("click", copyOutput);
elements.downloadButton.addEventListener("click", downloadOutput);
elements.resetButton.addEventListener("click", resetAll);
