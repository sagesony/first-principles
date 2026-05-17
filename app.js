const CONCEPTS = [
  "Money", "Time", "Happiness", "Success", "Love", "Power", "Freedom",
  "Trust", "Intelligence", "Luck", "Fairness", "Risk",
  "Motivation", "Identity", "Value", "Creativity", "Discipline", "Fear",
  "Compounding", "Valuation", "Diversification", "Bull Market",
  "Muscle Gain", "Fat Loss", "Recovery", "Consistency",
  "Job Satisfaction", "Burnout", "Purpose"
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

const SYSTEM_PROMPT = `You are a brilliant, warm, slightly playful teacher — think Feynman's spirit. Your goal: give the user aha moments about any concept by asking short, surprising questions and offering simple analogies.

RULES:
1. FIRST message: ask ONE short, surprising question that instantly makes them see the concept differently. No intro. No "great question". Just the question. Keep it under 20 words.
2. Every response: MAX 2-3 short sentences. Never lecture. Never go philosophical.
3. Mix question types: concrete examples, surprising reversals, analogies, simple definitions, edge cases.
4. React to their answer — find the most interesting thing they said and build on it.
5. Keep cognitive load low. Short questions. Short answers expected.
6. Be warm, occasionally witty.
7. Avoid abstract philosophy. Keep everything grounded in real, tangible examples.
8. After 4-5 good exchanges, offer a short synthesis of THEIR reasoning — then ask if anything surprised them.

After EVERY response, append on a new line:
CLARITY_SCORE:{"score":N,"label":"L"}
N = 0-100. L = one of: "Just started"|"Surface scratched"|"Digging deeper"|"Getting there"|"Breakthrough near"|"Understood"`;

// State
let concept = "";
let messages = [];
let loading = false;
let clarityScore = 0;
let thinkingInterval = null;
let thinkingIdx = 0;

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
    body: JSON.stringify({ messages: apiMessages, system: SYSTEM_PROMPT })
  });
  const data = await res.json();
  return data.content?.find(b => b.type === "text")?.text || "Interesting. What do you mean by that?";
}

async function startDialogue(c) {
  concept = c;
  messages = [];
  clarityScore = 0;
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
    messages.push({ role: "assistant", content: reply });
    addMessage("assistant", reply);
    if (score !== null) updateClarity(score, label);
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