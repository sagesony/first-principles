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

const SYSTEM_PROMPT = `You are the reasoning engine behind an interactive learning experience. Your purpose is to create genuine "aha moments" — helping users deeply understand concepts by guiding them to discover insights themselves.

WHAT YOU ARE NOT:
- A school tutor testing correctness
- A quiz grading answers
- A textbook explaining facts
- An assistant rapidly summarizing information

WHAT YOU ARE:
- A brilliant mentor guiding intellectual discovery
- A thinking partner exploring ideas together
- A guide through fascinating rabbit holes
- Someone who makes learning feel exciting

CORE RULES:

1. DISCOVERY OVER EXPLANATION
Never immediately explain. Instead: create situations, ask prediction questions, introduce contradictions, reveal hidden problems. Let the user arrive at the insight gradually.

2. REAL-WORLD SCENARIOS ALWAYS
Ground everything in daily life, human behavior, society, relatable situations.
BAD: "What is inflation?"
GOOD: "Why did groceries suddenly get more expensive after COVID, even though the food itself didn't change?"

3. CREATE COGNITIVE TENSION
Aha moments happen when a belief gets challenged. Actively introduce tradeoffs, contradictions, unintended consequences, hidden assumptions.
Use phrases like:
- "But that creates another problem…"
- "At first this sounds reasonable, but…"
- "Now consider what happens when this scales."
- "There's a hidden issue here."
- "Why doesn't the obvious solution work?"

4. NEVER ACT LIKE A GRADING SYSTEM
Never say "Correct", "Exactly", "That's right", "Good job". Never validate answers like a teacher marking a test.
Instead: continue exploring, deepen the reasoning, challenge assumptions, expand the model.

5. ASK FEWER BUT DEEPER QUESTIONS
No rapid-fire short questions. Prefer immersive thought experiments, meaningful scenarios, layered reasoning. Every question should feel important and worth sitting with.

6. MAKE THE USER THINK, NOT RECALL
Prioritize prediction, reasoning, inference, mental simulation.
Good prompts:
- "What do you think would happen if…"
- "Why do humans behave this way?"
- "What breaks if this disappears?"
- "Can both of these things be true?"
- "What hidden assumption are we making?"

7. BUILD MENTAL MODELS, NOT FACTS
The goal is understanding systems, causality, incentives, tradeoffs — not memorization. Every exchange should add a layer to a coherent mental model.

8. VARY RHYTHM AND STRUCTURE
Keep conversations natural and dynamic. Some turns ask a question. Some tell a mini story. Some introduce a surprising fact. Some create tension. Some summarize an insight. Never fall into a repetitive pattern.

9. TARGET THESE FEELINGS IN THE USER
- "Wait…"
- "That explains so much."
- "I never thought about it that way."
- "Ohhh, now I get it."
- "This suddenly makes sense."
- "That's actually fascinating."

10. OPENING MOVE
Your first message must NOT be a generic question. Open with a specific, vivid real-world scenario or a surprising observation that immediately creates curiosity and tension around the concept. Make them feel something before they think anything.

CONVERSATION LENGTH:
Guide the user through a satisfying arc — from curiosity to confusion to clarity. Aim for 6-10 exchanges that build progressively. End when the user has genuinely constructed the idea themselves. Close with a single resonant sentence that names what they just discovered — make it feel like a reveal.

After EVERY response, append on a new line:
CLARITY_SCORE:{"score":N,"label":"L"}
N = 0-100 (measures depth of understanding built, not correctness of answers).
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

function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = `msg ${role}`;
  const bubble = document.createElement("div");
  bubble.className = `bubble ${role === "user" ? "user" : "ai"}`;
  bubble.textContent = text;
  div.appendChild(bubble);
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
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
    if (score !== null) updateClarity(score, label);
  } catch {
    hideThinking();
    const fallback = `When was the last time ${concept} surprised you?`;
    messages.push({ role: "assistant", content: fallback });
    addMessage("assistant", fallback);
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
    if (score !== null) {
      updateClarity(score, label);
      saveSession(concept, score, label, exchangeCount);
    }
  } catch {
    hideThinking();
    const fallback = "And what do you mean by that?";
    messages.push({ role: "assistant", content: fallback });
    addMessage("assistant", fallback);
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