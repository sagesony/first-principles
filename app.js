const PROVOCATIONS = [
  { short: "What actually compounds in life?",          full: "What actually compounds in life — and why do most people optimise for the wrong things?" },
  { short: "Why do some products become habits?",       full: "Why do some products become habits while objectively better ones get ignored?" },
  { short: "What makes people genuinely persuasive?",   full: "What actually makes people persuasive — and why is it rarely what they think it is?" },
  { short: "Why do some people see opportunities first?", full: "Why do some people consistently notice opportunities earlier than everyone else?" },
  { short: "What separates enduring companies from hype?", full: "What actually separates enduring companies from hype cycles?" },
  { short: "Will AI make creativity richer or rarer?",  full: "Will AI genuinely increase human creativity, or quietly reduce it over time?" },
  { short: "Why do some ideas spread, others die?",     full: "Why do some ideas spread rapidly while better ones die quietly?" },
  { short: "What becomes rare in an abundant world?",   full: "What becomes genuinely rare and valuable in a world where information and execution are cheap?" }
];

const THINKING = [
  "Finding the interesting angle...", "Connecting the dots...", "Looking for the non-obvious...",
  "Going one layer deeper...", "Finding what matters here...", "Surfacing the pattern...",
  "Thinking this through..."
];

const CLARITY_COLORS = [
  { max: 20, color: "#E24B4A" }, { max: 40, color: "#EF9F27" },
  { max: 60, color: "#BA7517" }, { max: 80, color: "#639922" },
  { max: 95, color: "#1D9E75" }, { max: 100, color: "#0F6E56" }
];

const STAGE_CONFIG = [
  { id: "surface", label: "Getting underneath it" },
  { id: "deepen",  label: "Going deeper" },
  { id: "connect", label: "Connecting the dots" },
  { id: "insight", label: "The insight" }
];

const PROMPTS = {
  "sparring": `You are a brilliant thinking partner — curious, well-read, and genuinely interested in helping people develop sharper, more original perspectives on ideas that matter.

Your job is not to win arguments or catch people out. Your job is to help people see things they haven't seen before, make connections they haven't made, and leave feeling more capable and perceptive.

PERSONA:
- Intellectually generous but precise
- You think in systems, patterns, and non-obvious connections
- You're genuinely excited by good ideas — that energy is contagious
- You ask questions that open things up, not close them down
- You find the most interesting angle on any topic, especially the one most people miss

THE CONVERSATION HAS 4 STAGES — move through them in order:

STAGE 1 — SURFACE:
- Find what's genuinely interesting or non-obvious about this topic
- Ask one question that gets beneath the surface — something that reframes rather than interrogates
- Make the user feel: "I haven't thought about it from that angle"
- Never start with a challenge or pushback — start with curiosity

STAGE 2 — DEEPEN:
- Take what they said and surface the non-obvious implication
- "What's interesting about that is..." — find the layer underneath
- Connect their thinking to a pattern or principle worth naming
- Push gently for specificity: "Can you think of a concrete example?"

STAGE 3 — CONNECT:
- Find unexpected connections to adjacent ideas, domains, or mental models
- Introduce a framework or lens that sharpens their thinking
- Surface the tension worth sitting with: "Here's what makes this genuinely hard..."
- This isn't about proving them wrong — it's about showing more of the territory

STAGE 4 — INSIGHT:
- Help them synthesize what emerged in the conversation
- Name the non-obvious insight: "What you've actually described is..."
- Leave them with a new lens or question, not a tidy conclusion
- The user should feel: more perceptive, more capable, mentally expanded

TONE AND STYLE:
- Warm, energising, intellectually alive — never cold or combative
- Max 3 sentences + 1 question per response. Never lecture.
- Never make someone feel wrong — make them feel like they're seeing more
- Language to use: "What's interesting is...", "That connects to...", "Here's the non-obvious part...", "The pattern underneath this..."
- Language to avoid: "Actually...", "But you're missing...", "That's not right", "Devil's advocate..."
- If they give a surface answer, go one layer deeper without signalling disappointment
- If they say something smart, build on it — don't just validate it

STRICT RULES:
- Max 3 sentences + 1 question per turn. No exceptions.
- Never ask more than one question per turn
- Never lecture or explain unprompted
- If they're too abstract: "Can you make that concrete — a real example?"

After EVERY response, append on a new line:
STAGE:{"stage":"S","label":"L"}
S = one of: "surface"|"deepen"|"connect"|"insight"
L = one of: "Getting underneath it"|"Going deeper"|"Connecting the dots"|"The insight"`,

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

// Analytics
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
let selectedMode = "sparring";
let currentStage = "stance";
let messages = [];
let loading = false;
let clarityScore = 0;
let thinkingInterval = null;
let thinkingIdx = 0;
let exchangeCount = 0;
let sessionId = "";

// DOM
const homeEl        = document.getElementById("home");
const dialogueEl    = document.getElementById("dialogue");
const conceptInput  = document.getElementById("concept-input");
const startBtn      = document.getElementById("start-btn");
const provocationsEl= document.getElementById("provocations");
const conceptTitle  = document.getElementById("concept-title");
const restartBtn    = document.getElementById("restart-btn");
const messagesEl    = document.getElementById("messages");
const userInput     = document.getElementById("user-input");
const sendBtn       = document.getElementById("send-btn");
const clarityFill   = document.getElementById("clarity-fill");
const clarityLabelEl= document.getElementById("clarity-label");
const modeTagEl     = document.getElementById("mode-tag");
const stageBarEl    = document.getElementById("stage-bar");
const clarityBarEl  = document.getElementById("clarity-bar");

// Build mode selector
const MODE_OPTIONS = [
  { id: "sparring",        label: "Deep Exploration",      desc: "Surface non-obvious insights · go deeper" },
  { id: "personal-memory", label: "Personal Memory",       desc: "Anchor in your own experiences" },
  { id: "analogy-first",   label: "Analogy First",         desc: "Map to something you already know" },
  { id: "prediction",      label: "Prediction",            desc: "Guess what happens, then find out" },
  { id: "break-it-down",   label: "Break It Down",         desc: "Build from the smallest unit" }
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

// Build provocations
PROVOCATIONS.forEach(p => {
  const btn = document.createElement("button");
  btn.className = "provocation-btn";
  btn.textContent = p.short;
  btn.onclick = () => {
    conceptInput.value = p.full;
    startBtn.disabled = false;
    conceptInput.focus();
  };
  provocationsEl.appendChild(btn);
});

// Input / button wiring
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

// ── Clarity helpers ──
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

// ── Stage helpers ──
function updateStage(stage, label) {
  currentStage = stage;
  const stageIdx = STAGE_CONFIG.findIndex(s => s.id === stage);
  const dots  = document.querySelectorAll(".stage-dot");
  const steps = document.querySelectorAll(".stage-step");
  dots.forEach((dot, i) => {
    dot.classList.toggle("active",  i < stageIdx);
    dot.classList.toggle("current", i === stageIdx);
  });
  steps.forEach((step, i) => step.classList.toggle("is-current", i === stageIdx));
  const labelEl = document.getElementById("stage-label");
  if (labelEl) labelEl.textContent = label || STAGE_CONFIG[stageIdx]?.label || "";
}

function showProgressBars() {
  const sparring = selectedMode === "sparring";
  stageBarEl.style.display   = sparring ? "block" : "none";
  clarityBarEl.style.display = sparring ? "none"  : "block";
}

// ── Response parsing ──
function parseResponse(raw) {
  const stageIdx   = raw.indexOf("STAGE:");
  const clarityIdx = raw.indexOf("CLARITY_SCORE:");
  const firstTag   = Math.min(
    stageIdx   === -1 ? Infinity : stageIdx,
    clarityIdx === -1 ? Infinity : clarityIdx
  );
  const text = firstTag === Infinity ? raw.trim() : raw.slice(0, firstTag).trim();

  let score = null, label = null, stage = null, stageLabel = null;

  if (clarityIdx !== -1) {
    try {
      const j = JSON.parse(raw.slice(clarityIdx + 14).trim());
      score = j.score; label = j.label;
    } catch {}
  }
  if (stageIdx !== -1) {
    try {
      const rest = raw.slice(stageIdx + 6).trim();
      const end  = rest.indexOf("\n");
      const j    = JSON.parse(end === -1 ? rest : rest.slice(0, end));
      stage = j.stage; stageLabel = j.label;
    } catch {}
  }
  return { text, score, label, stage, stageLabel };
}

// ── Message rendering ──
function removeActionButtons() {
  document.querySelectorAll(".action-btns").forEach(el => el.remove());
}

function addMessage(role, text) {
  removeActionButtons();
  const div    = document.createElement("div");
  div.className = `msg ${role}`;
  const bubble  = document.createElement("div");
  bubble.className = `bubble ${role === "user" ? "user" : "ai"}`;
  bubble.textContent = text;
  div.appendChild(bubble);
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return div;
}

function addActionMessage(label) {
  removeActionButtons();
  const div  = document.createElement("div");
  div.className = "msg action-msg";
  const chip = document.createElement("span");
  chip.className  = "action-chip";
  chip.textContent = label;
  div.appendChild(chip);
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function addActionButtons() {
  removeActionButtons();
  const wrap    = document.createElement("div");
  wrap.className = "action-btns";
  const actions  = selectedMode === "sparring" ? [
    { label: "→ Go deeper",        msg: "Go one layer deeper on this — what's the non-obvious thing underneath?",                                       display: "→ Go deeper" },
    { label: "⬡ Connect the dots", msg: "What does this connect to in a broader context — another domain, pattern, or idea?",                          display: "⬡ Connect the dots" },
    { label: "↗ Make it practical",msg: "How does this actually apply? What would someone do differently knowing this?",                               display: "↗ Make it practical" }
  ] : [
    { label: "↻ Try differently", msg: "Try a completely different angle or scenario on this.",           display: "↻ Try differently" },
    { label: "↓ Simpler",         msg: "That's too complex for me. Use a much simpler everyday example.", display: "↓ Simpler" },
    { label: "↑ Go deeper",       msg: "I already get this. Push further and challenge me more.",         display: "↑ Go deeper" }
  ];
  actions.forEach(a => {
    const btn = document.createElement("button");
    btn.className   = "action-btn";
    btn.textContent = a.label;
    btn.onclick = () => sendAction(a.msg, a.display);
    wrap.appendChild(btn);
  });
  messagesEl.appendChild(wrap);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// ── API message builder ──
function buildApiMessages() {
  const opener = selectedMode === "sparring"
    ? `The user wants to explore: "${concept}". Begin Stage 1 (Surface) — find the most interesting angle on this topic and open with one question that gets beneath the surface. Warm, curious, concise. STAGE should be "surface".`
    : `Concept: "${concept}". Open with your most surprising, short question.`;
  return [
    { role: "user", content: opener },
    ...messages.map(m => ({ role: m.role, content: m.content }))
  ];
}

// ── Thinking indicator ──
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

// ── API call ──
async function callAPI(apiMessages) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: apiMessages, system: PROMPTS[selectedMode], concept, sessionId, mode: selectedMode })
  });
  const data = await res.json();
  return data.content?.find(b => b.type === "text")?.text || "Say more — what do you mean by that?";
}

// ── Action button handler ──
async function sendAction(msg, display) {
  if (loading) return;
  addActionMessage(display);
  messages.push({ role: "user", content: msg });
  loading = true;
  userInput.disabled = true;
  sendBtn.disabled   = true;
  showThinking();
  try {
    const raw = await callAPI(buildApiMessages());
    const { text: reply, score, label, stage, stageLabel } = parseResponse(raw);
    hideThinking();
    exchangeCount++;
    messages.push({ role: "assistant", content: reply });
    addMessage("assistant", reply);
    addActionButtons();
    if (stage) updateStage(stage, stageLabel);
    else if (score !== null) { updateClarity(score, label); saveSession(concept, score, label, exchangeCount); }
  } catch {
    hideThinking();
    const fallback = selectedMode === "sparring"
      ? "Let me try a different angle — what's the most interesting part of this to you?"
      : "Let me try a different way — what's one thing you're confident about here?";
    messages.push({ role: "assistant", content: fallback });
    addMessage("assistant", fallback);
    addActionButtons();
  }
  loading = false;
  userInput.disabled = false;
  sendBtn.disabled   = !userInput.value.trim();
  userInput.focus();
}

// ── Start session ──
async function startDialogue(c) {
  concept       = c;
  messages      = [];
  clarityScore  = 0;
  currentStage  = "surface";
  exchangeCount = 0;
  sessionId     = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  homeEl.style.display      = "none";
  dialogueEl.style.display  = "block";
  conceptTitle.textContent  = c.length > 60 ? c.slice(0, 57) + "..." : c;
  modeTagEl.textContent     = MODE_OPTIONS.find(m => m.id === selectedMode)?.label || "";
  messagesEl.innerHTML      = "";

  showProgressBars();
  if (selectedMode === "sparring") updateStage("surface", "Getting underneath it");
  else updateClarity(0, "Just started");

  loading = true;
  userInput.disabled = true;
  sendBtn.disabled   = true;
  showThinking();

  const opener = selectedMode === "sparring"
    ? `The user wants to explore: "${c}". Begin Stage 1 (Surface) — find the most interesting or non-obvious angle on this topic. Open with one warm, curious question that gets beneath the surface. Make them feel: "I haven't thought about it that way." STAGE should be "surface".`
    : `Concept: "${c}". Open with your most surprising, short question. CLARITY_SCORE should be 0.`;

  try {
    const raw = await callAPI([{ role: "user", content: opener }]);
    const { text, score, label, stage, stageLabel } = parseResponse(raw);
    hideThinking();
    messages.push({ role: "assistant", content: text });
    addMessage("assistant", text);
    addActionButtons();
    if (stage) updateStage(stage, stageLabel);
    else if (score !== null) updateClarity(score, label);
  } catch {
    hideThinking();
    const fallback = selectedMode === "sparring"
      ? `What draws you to this question: "${c}"?`
      : `When was the last time ${c} surprised you?`;
    messages.push({ role: "assistant", content: fallback });
    addMessage("assistant", fallback);
    addActionButtons();
  }
  loading = false;
  userInput.disabled = false;
  sendBtn.disabled   = true;
  setTimeout(() => userInput.focus(), 100);
}

// ── Send message ──
async function sendMessage() {
  if (!userInput.value.trim() || loading) return;
  const text = userInput.value.trim();
  userInput.value  = "";
  sendBtn.disabled = true;
  messages.push({ role: "user", content: text });
  addMessage("user", text);
  loading = true;
  userInput.disabled = true;
  showThinking();
  try {
    const raw = await callAPI(buildApiMessages());
    const { text: reply, score, label, stage, stageLabel } = parseResponse(raw);
    hideThinking();
    exchangeCount++;
    messages.push({ role: "assistant", content: reply });
    addMessage("assistant", reply);
    addActionButtons();
    if (stage) updateStage(stage, stageLabel);
    else if (score !== null) { updateClarity(score, label); saveSession(concept, score, label, exchangeCount); }
  } catch {
    hideThinking();
    const fallback = selectedMode === "sparring"
      ? "What's the most interesting part of this to you?"
      : "And what do you mean by that?";
    messages.push({ role: "assistant", content: fallback });
    addMessage("assistant", fallback);
    addActionButtons();
  }
  loading = false;
  userInput.disabled = false;
  sendBtn.disabled   = !userInput.value.trim();
  userInput.focus();
}

// ── Reset ──
function reset() {
  homeEl.style.display     = "block";
  dialogueEl.style.display = "none";
  concept = "";
  messages = [];
  conceptInput.value = "";
  startBtn.disabled  = true;
  messagesEl.innerHTML = "";
}
