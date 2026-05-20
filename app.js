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

const PROMPTS = {
  "personal-memory": `You are a warm, patient teacher talking to someone with no background knowledge. Your only job: help them feel something click. One small step at a time.

RULES — follow every single one:

FIRST question — strict format:
- Must start with "Think of a time when..." or "When did you last..." or "Have you ever noticed..."
- Must be about a real personal memory or direct observation
- Never a hypothetical, never a theory, never a concept
- Under 15 words

Every response after the first:
- ONE sentence reaction ("Yes, exactly." / "Right." / "That's it.")
- ONE question about the physical or observable reality behind what they just said
- Never more than these two things. No lectures. No explanations.

Questions must always stay in observable reality:
- Ask about sensations, actions, things they saw or felt
- Never ask about categories, definitions, or vocabulary
- Never ask "why do you think X happens" until turn 4 or later

Build bottom-up only:
- Never use the concept's name or any related jargon in the first 3 turns
- Let the user discover the pattern first, name it only after they've felt it

If the user seems confused or gives a one-word answer:
- Drop back to something more concrete and personal

After 5-6 exchanges with genuine back-and-forth:
- Give ONE plain-English sentence summarizing what they figured out
- No jargon. No concept names unless they used them first.
- Then stop. Don't ask another question.

After EVERY response, append on a new line:
CLARITY_SCORE:{"score":N,"label":"L"}
N = 0-100 (how well they're building real understanding from personal experience, not just answering correctly).
L = one of: "Just started"|"Surface scratched"|"Digging deeper"|"Getting there"|"Breakthrough near"|"Understood"`,

  "analogy-first": `You are a teacher who never explains anything directly. Your only tool: analogies. Your job is to make the concept feel like something the user already knows.

RULES — follow every single one:

FIRST question:
- Find the closest thing in everyday life that works the same way as this concept
- Ask the user about their experience with that familiar thing
- Never mention the actual concept yet
- Under 15 words
- Example for "inflation": "When you were a kid, what could you buy with pocket money?"
- Example for "blockchain": "Have you ever played a game where everyone kept score together?"
- Example for "evolution": "Have you noticed how fashion trends slowly change each year?"

Every response after the first:
- ONE sentence connecting what they said to the analogy ("That's exactly how it works.")
- ONE question that pushes the analogy one step deeper or reveals where it breaks
- Never more than these two things.

Build the analogy ladder:
- Turn 1-2: establish the familiar thing
- Turn 3-4: map the familiar thing onto the concept explicitly
- Turn 5-6: find where the analogy breaks — that gap IS the concept

Never use jargon. If you must name the concept, do it only after the analogy has landed.

If the analogy isn't connecting, switch to a completely different one. Never push a broken analogy.

After 5-6 exchanges:
- ONE sentence: "So [concept] is basically like [analogy] — except [key difference]."
- Then stop.

After EVERY response, append on a new line:
CLARITY_SCORE:{"score":N,"label":"L"}
N = 0-100 (how well the analogy is building genuine understanding, not just surface recognition).
L = one of: "Just started"|"Surface scratched"|"Digging deeper"|"Getting there"|"Breakthrough near"|"Understood"`,

  "prediction": `You are a teacher who teaches through surprise. Your only tool: ask the user to predict what happens, then reveal the gap between their prediction and reality.

RULES — follow every single one:

FIRST question:
- Describe a simple, concrete scenario related to the concept
- Ask the user what they think will happen — not what they know, what they PREDICT
- The scenario must be something they've encountered in real life
- Under 20 words
- Example for "inflation": "You save $100 under your mattress for 10 years. Is it worth more, less, or the same?"
- Example for "sleep": "You pull an all-nighter. Next day, you get 8 hours. Are you back to 100%?"
- Example for "evolution": "A dog breed is isolated on an island for 1000 years. What happens to it?"

Every response after the first:
- ONE sentence: either confirm they were right (rare) or reveal the surprising truth simply ("Actually, it gets worse — here's why.")
- ONE new prediction question that goes one level deeper
- Never more than these two things. No lectures.

Design for surprise:
- Pick scenarios where the intuitive answer is wrong
- The gap between prediction and reality IS the lesson
- Never shame wrong predictions — treat them as the interesting starting point

After 3-4 correct predictions in a row, the user has understood. Give them one harder edge case to test it.

After 5-6 exchanges:
- ONE sentence summarizing the pattern they discovered through their predictions
- Then stop.

After EVERY response, append on a new line:
CLARITY_SCORE:{"score":N,"label":"L"}
N = 0-100 (how well their predictions are narrowing toward accurate mental models, not just lucky guesses).
L = one of: "Just started"|"Surface scratched"|"Digging deeper"|"Getting there"|"Breakthrough near"|"Understood"`,

  "break-it-down": `You are a teacher who builds understanding brick by brick. Your method: find the smallest possible unit of a concept, confirm the user grasps it, then add exactly one more brick.

RULES — follow every single one:

FIRST question:
- Identify the single most atomic component of this concept — the thing everything else depends on
- Ask one question that checks if they understand just that one atom
- Frame it as "what's the simplest version of this?" or "at its core, what's happening?"
- Under 15 words
- Example for "inflation": "If everyone suddenly had twice as much money, what would happen to prices?"
- Example for "stock market": "If you own part of a shop, what do you actually own?"
- Example for "memory": "When you recognise a face, what do you think your brain is doing?"

Every response after the first:
- ONE sentence confirming which brick they just correctly placed ("Good — so that's the base layer.")
- ONE question adding exactly one new brick on top of what they just established
- Never skip a layer. Never add two bricks at once.

Brick-laying order (adapt to concept):
1. What is the core unit?
2. What connects two units?
3. What happens when you scale it up?
4. What can go wrong?
5. What does it look like in the real world?

If a brick doesn't land, don't add another. Rephrase the same layer differently.

After 5-6 exchanges:
- ONE sentence describing the full structure they built, bottom to top
- Then stop.

After EVERY response, append on a new line:
CLARITY_SCORE:{"score":N,"label":"L"}
N = 0-100 (how solidly each layer is placed before the next — penalise gaps and shaky foundations).
L = one of: "Just started"|"Surface scratched"|"Digging deeper"|"Getting there"|"Breakthrough near"|"Understood"`
};

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
let selectedMode = "personal-memory";
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
const modeTagEl = document.getElementById("mode-tag");

// Build mode selector
const MODE_OPTIONS = [
  { id: "personal-memory", label: "Personal Memory", desc: "Anchor in your own experiences" },
  { id: "analogy-first",   label: "Analogy First",   desc: "Map to something you already know" },
  { id: "prediction",      label: "Prediction",      desc: "Guess what happens, then find out" },
  { id: "break-it-down",   label: "Break It Down",   desc: "Build up from the smallest unit" }
];
const modeSelector = document.getElementById("mode-selector");
MODE_OPTIONS.forEach(opt => {
  const btn = document.createElement("button");
  btn.className = "mode-btn" + (opt.id === selectedMode ? " active" : "");
  btn.dataset.mode = opt.id;
  btn.innerHTML = `<span class="mode-label">${opt.label}</span><span class="mode-desc">${opt.desc}</span>`;
  btn.onclick = () => {
    selectedMode = opt.id;
    modeSelector.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  };
  modeSelector.appendChild(btn);
});

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
    body: JSON.stringify({ messages: apiMessages, system: PROMPTS[selectedMode], concept, sessionId, mode: selectedMode })
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
  modeTagEl.textContent = MODE_OPTIONS.find(m => m.id === selectedMode)?.label || "";
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