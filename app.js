const CONCEPTS = [
  "Happiness", "Money", "Inflation", "Stock Market",
  "Blockchain", "Artificial Intelligence", "Electricity", "Climate Change",
  "Evolution", "Sleep", "Memory", "Stress", "Theory of Relativity"
];

const THINKING = [
  "Finding a better angle...", "Looking for the simple truth...",
  "Cutting through the noise...", "Checking that assumption...",
  "Finding a good analogy...", "Simplifying...", "Connecting the dots..."
];

const CLARITY_COLORS = [
  { max: 20, color: "#E24B4A" }, { max: 40, color: "#EF9F27" },
  { max: 60, color: "#BA7517" }, { max: 80, color: "#639922" },
  { max: 95, color: "#1D9E75" }, { max: 100, color: "#0F6E56" }
];

const SYSTEM_PROMPT = `You are a warm, patient teacher talking to someone with no background knowledge. Your only job: help them feel something click. One small step at a time.

RULES — follow every single one:

FIRST question — strict format:
- Must start with "Think of a time when..." or "When did you last..." or "Have you ever noticed..."
- Must be about a real personal memory or direct observation
- Never a hypothetical ("imagine if..."), never a theory, never a concept
- Under 15 words
- Examples for "happiness": "Think of a time you smiled without trying to — what were you doing?"
- Examples for "money": "When did you last feel relief after paying something off?"
- Examples for "fear": "Think of a time your heart raced — where were you?"

Every response after the first:
- ONE sentence reaction ("Yes, exactly." / "Right." / "That's it.")
- ONE question about the physical or observable reality behind what they just said
- Never more than these two things. No lectures. No explanations.

Questions must always stay in observable reality:
- Ask about sensations, actions, things they saw or felt
- Never ask about categories, definitions, or vocabulary
- Never ask "why do you think X happens" until turn 4 or later
- Bad: "Why does happiness fade over time?"
- Good: "What were you doing the last time you felt completely at ease?"

Build bottom-up only:
- Never use the concept's name or any related jargon in the first 3 turns
- Let the user discover the pattern first, name it only after they've felt it

If the user seems confused or gives a one-word answer:
- Don't push the same question
- Drop back to something more concrete and personal
- Example: "Let's try something simpler — think of the last meal you really enjoyed. What made it good?"

After 5-6 exchanges with genuine back-and-forth:
- Give ONE plain-English sentence summarizing what they figured out
- No jargon. No concept names unless they used them first.
- Then stop. Don't ask another question.

After EVERY response, append on a new line:
CLARITY_SCORE:{"score":N,"label":"L"}
N = 0-100 (how well they're building real understanding from personal experience, not just answering correctly).
L = one of: "Just started"|"Surface scratched"|"Digging deeper"|"Getting there"|"Breakthrough near"|"Understood"`;

// Analytics persistence
const ANALYTICS_KEY = "fp_analytics";

function loadAnalytics() {
  try { return JSON.parse(localStorage.getItem(ANALYTICS_KEY)) || { sessions: [] }; }
  catch { return { sessions: [] }; }
}

function saveSession(concept, finalScore, finalLabel, exchangeCount) {
  const data = loadAnalytics();
  data.sessions.push({ concept, finalScore, finalLabel, exchangeCount, date: new Date().toISOString() });
  if (data.sessions.length > 100) data.sessions = data.sessions.slice(-100);
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data));
}

// State
let concept = "";
let messages = [];
let loading = false;
let clarityScore = 0;
let thinkingInterval = null;
let thinkingIdx = 0;
let exchangeCount = 0;
let sessionId = "";

// DOM
const homeEl = document.getElementById("home");
const dialogueEl = document.getElementById("dialogue");
const conceptInput = document.getElementById("concept-input");
const startBtn = document.getElementById("start-btn");
const chipsEl = document.getElementById("chips");
const conceptTitle = document.getElementById("concept-title");
const restartBtn = document.getElementById("restart-btn");
const messagesEl = document.getElementById("messages");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const clarityFill = document.getElementById("clarity-fill");
const clarityLabelEl = document.getElementById("clarity-label");

// Build chips
CONCEPTS.forEach(c => {
  const btn = document.createElement("button");
  btn.className = "chip";
  btn.textContent = c;
  btn.onclick = () => { conceptInput.value = c; startDialogue(c); };
  chipsEl.appendChild(btn);
});

conceptInput.addEventListener("input", () => {
  startBtn.disabled = !conceptInput.value.trim();
});
conceptInput.addEventListener("keydown", e => {
  if (e.key === "Enter" && conceptInput.value.trim()) startDialogue(conceptInput.value.trim());
});
startBtn.onclick = () => { if (conceptInput.value.trim()) startDialogue(conceptInput.value.trim()); };
restartBtn.onclick = reset;
sendBtn.onclick = sendMessage;
userInput.addEventListener("input", () => { sendBtn.disabled = !userInput.value.trim() || loading; });
userInput.addEventListener("keydown", e => { if (e.key === "Enter") sendMessage(); });

function getColor(score) {
  return (CLARITY_COLORS.find(c => score <= c.max) || CLARITY_COLORS[5]).color;
}

function updateClarity(score, label) {
  clarityScore = score;
  clarityFill.style.width = score + "%";
  clarityFill.style.background = getColor(score);
  clarityLabelEl.style.color = getColor(score);
  clarityLabelEl.textContent = `${label} · ${score}%`;
}

function parseResponse(raw) {
  const idx = raw.indexOf("CLARITY_SCORE:");
  if (idx === -1) return { text: raw.trim(), score: null, label: null };
  const text = raw.slice(0, idx).trim();
  try { const j = JSON.parse(raw.slice(idx + 14).trim()); return { text, score: j.score, label: j.label }; }
  catch { return { text, score: null, label: null }; }
}

function removeActionButtons() {
  document.querySelectorAll(".action-btns").forEach(el => el.remove());
}

function addMessage(role, text) {
  removeActionButtons();
  const div = document.createElement("div");
  div.className = `msg ${role}`;
  const bubble = document.createElement("div");
  bubble.className = `bubble ${role === "user" ? "user" : "ai"}`;
  bubble.textContent = text;
  div.appendChild(bubble);
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return div;
}

function addActionMessage(label) {
  removeActionButtons();
  const div = document.createElement("div");
  div.className = "msg action-msg";
  const chip = document.createElement("span");
  chip.className = "action-chip";
  chip.textContent = label;
  div.appendChild(chip);
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function addActionButtons() {
  removeActionButtons();
  const wrap = document.createElement("div");
  wrap.className = "action-btns";
  const actions = [
    { label: "↻  Try differently", msg: "Try a completely different angle or scenario on this.", display: "↻ Try differently" },
    { label: "↓  Simpler", msg: "That's too complex for me. Use a much simpler everyday example.", display: "↓ Simpler" },
    { label: "↑  Go deeper", msg: "I already get this. Push further and challenge me more.", display: "↑ Go deeper" }
  ];
  actions.forEach(a => {
    const btn = document.createElement("button");
    btn.className = "action-btn";
    btn.textContent = a.label;
    btn.onclick = () => sendAction(a.msg, a.display);
    wrap.appendChild(btn);
  });
  messagesEl.appendChild(wrap);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

async function sendAction(msg, display) {
  if (loading) return;
  addActionMessage(display);
  messages.push({ role: "user", content: msg });
  loading = true;
  userInput.disabled = true;
  sendBtn.disabled = true;
  showThinking();
  const apiMessages = [
    { role: "user", content: `Concept: "${concept}". Open with your most surprising question.` },
    ...messages.map(m => ({ role: m.role, content: m.content }))
  ];
  try {
    const raw = await callAPI(apiMessages);
    const { text: reply, score, label } = parseResponse(raw);
    hideThinking();
    exchangeCount++;
    messages.push({ role: "assistant", content: reply });
    addMessage("assistant", reply);
    addActionButtons();
    if (score !== null) { updateClarity(score, label); saveSession(concept, score, label, exchangeCount); }
  } catch {
    hideThinking();
    const fallback = "Let me try a different way — what's one thing you do know about this?";
    messages.push({ role: "assistant", content: fallback });
    addMessage("assistant", fallback);
    addActionButtons();
  }
  loading = false;
  userInput.disabled = false;
  sendBtn.disabled = !userInput.value.trim();
  userInput.focus();
}

function showThinking() {
  const div = document.createElement("div");
  div.className = "thinking";
  div.id = "thinking-indicator";
  div.innerHTML = `<div class="dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div><span class="thinking-text" id="thinking-text">${THINKING[0]}</span>`;
  messagesEl.appendChild(div);
  thinkingIdx = 0;
  thinkingInterval = setInterval(() => {
    thinkingIdx = (thinkingIdx + 1) % THINKING.length;
    const el = document.getElementById("thinking-text");
    if (el) el.textContent = THINKING[thinkingIdx];
  }, 2000);
}

function hideThinking() {
  clearInterval(thinkingInterval);
  const el = document.getElementById("thinking-indicator");
  if (el) el.remove();
}

async function callAPI(apiMessages) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: apiMessages, system: SYSTEM_PROMPT, concept, sessionId })
  });
  const data = await res.json();
  return data.content?.find(b => b.type === "text")?.text || "Interesting. What do you mean by that?";
}

async function startDialogue(c) {
  concept = c;
  messages = [];
  clarityScore = 0;
  exchangeCount = 0;
  sessionId = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  homeEl.style.display = "none";
  dialogueEl.style.display = "block";
  conceptTitle.textContent = concept;
  messagesEl.innerHTML = "";
  updateClarity(0, "Just started");
  loading = true;
  userInput.disabled = true;
  sendBtn.disabled = true;
  showThinking();
  try {
    const raw = await callAPI([{ role: "user", content: `Concept: "${concept}". Open with your most surprising, short question. CLARITY_SCORE should be 0.` }]);
    const { text, score, label } = parseResponse(raw);
    hideThinking();
    messages.push({ role: "assistant", content: text });
    addMessage("assistant", text);
    addActionButtons();
    if (score !== null) updateClarity(score, label);
  } catch {
    hideThinking();
    const fallback = `When was the last time ${concept} surprised you?`;
    messages.push({ role: "assistant", content: fallback });
    addMessage("assistant", fallback);
    addActionButtons();
  }
  loading = false;
  userInput.disabled = false;
  sendBtn.disabled = true;
  setTimeout(() => userInput.focus(), 100);
}

async function sendMessage() {
  if (!userInput.value.trim() || loading) return;
  const text = userInput.value.trim();
  userInput.value = "";
  sendBtn.disabled = true;
  messages.push({ role: "user", content: text });
  addMessage("user", text);
  loading = true;
  userInput.disabled = true;
  showThinking();
  const apiMessages = [
    { role: "user", content: `Concept: "${concept}". Open with your most surprising question.` },
    ...messages.map(m => ({ role: m.role, content: m.content }))
  ];
  try {
    const raw = await callAPI(apiMessages);
    const { text: reply, score, label } = parseResponse(raw);
    hideThinking();
    exchangeCount++;
    messages.push({ role: "assistant", content: reply });
    addMessage("assistant", reply);
    addActionButtons();
    if (score !== null) {
      updateClarity(score, label);
      saveSession(concept, score, label, exchangeCount);
    }
  } catch {
    hideThinking();
    const fallback = "And what do you mean by that?";
    messages.push({ role: "assistant", content: fallback });
    addMessage("assistant", fallback);
    addActionButtons();
  }
  loading = false;
  userInput.disabled = false;
  sendBtn.disabled = !userInput.value.trim();
  userInput.focus();
}

function reset() {
  homeEl.style.display = "block";
  dialogueEl.style.display = "none";
  concept = "";
  messages = [];
  conceptInput.value = "";
  startBtn.disabled = true;
  messagesEl.innerHTML = "";
}