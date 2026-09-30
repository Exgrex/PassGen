// --- Geração de senha aleatória ---
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = LOWER.toUpperCase();
const NUM = '0123456789';
const SYM = '!@#$%^&*()-_=+[]{}?';
const LEET = {a:'4',e:'3',i:'1',o:'0',s:'5',t:'7',b:'8',g:'9',l:'1'};

function secureRandomInt(max) {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

function generatePassword(len, useLower, useUpper, useNum, useSym) {
  let pool = '';
  const required = [];
  if (useLower) { pool += LOWER; required.push(LOWER); }
  if (useUpper) { pool += UPPER; required.push(UPPER); }
  if (useNum) { pool += NUM; required.push(NUM); }
  if (useSym) { pool += SYM; required.push(SYM); }
  if (!pool) return '';
  let chars = required.map(set => set[secureRandomInt(set.length)]);
  while (chars.length < len) chars.push(pool[secureRandomInt(pool.length)]);
  // shuffle (Fisher-Yates, crypto-random)
  for (let i = chars.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.slice(0, len).join('');
}

function scoreStrength(pw) {
  if (!pw) return 0;
  let poolSize = 0;
  if (/[a-z]/.test(pw)) poolSize += 26;
  if (/[A-Z]/.test(pw)) poolSize += 26;
  if (/[0-9]/.test(pw)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) poolSize += SYM.length;
  const entropy = pw.length * Math.log2(poolSize || 1);
  if (entropy < 40) return 1;
  if (entropy < 60) return 2;
  if (entropy < 80) return 3;
  return 4;
}

function renderStrength(pw) {
  const s = scoreStrength(pw);
  const bars = document.querySelectorAll('#strengthBars span');
  const colors = ['#e0654f','#e0654f','#e0a458','#4fc3a1'];
  const labels = ['muito fraca','fraca','boa','muito forte'];
  bars.forEach((b, i) => { b.style.background = i < s ? colors[s-1] : 'var(--line)'; });
  document.getElementById('strengthLabel').textContent = pw ? labels[s-1] : '—';
}

function doGenerate() {
  const len = parseInt(document.getElementById('lenRange').value, 10);
  const pw = generatePassword(
    len,
    document.getElementById('cLower').checked,
    document.getElementById('cUpper').checked,
    document.getElementById('cNum').checked,
    document.getElementById('cSym').checked
  );
  const out = document.getElementById('output');
  out.textContent = pw || 'selecione ao menos uma opção';
  renderStrength(pw);
}

document.getElementById('lenRange').addEventListener('input', e => {
  document.getElementById('lenVal').textContent = e.target.value;
});
document.getElementById('genBtn').addEventListener('click', doGenerate);
document.getElementById('genBtn2').addEventListener('click', doGenerate);

document.getElementById('copyBtn').addEventListener('click', async () => {
  const text = document.getElementById('output').textContent;
  const btn = document.getElementById('copyBtn');
  try {
    await navigator.clipboard.writeText(text);
    btn.classList.add('copied');
    btn.textContent = '✓';
    setTimeout(() => { btn.classList.remove('copied'); btn.textContent = '⧉'; }, 1200);
  } catch (e) { /* clipboard unavailable */ }
});

// --- Variações de senha (leet-speak, maiúsculas, símbolos) ---
function leetify(word) {
  return word.split('').map(ch => {
    const lower = ch.toLowerCase();
    if (LEET[lower] && secureRandomInt(2) === 0) return LEET[lower];
    return ch;
  }).join('');
}

function randomCase(word) {
  return word.split('').map(ch =>
    secureRandomInt(2) === 0 ? ch.toUpperCase() : ch.toLowerCase()
  ).join('');
}

function makeVariant(base) {
  const symPick = SYM[secureRandomInt(SYM.length)];
  const numPick = String(secureRandomInt(90) + 10);
  let core = leetify(base);
  core = core.charAt(0).toUpperCase() + core.slice(1);
  const style = secureRandomInt(3);
  if (style === 0) return core + numPick + symPick;
  if (style === 1) return symPick + core + numPick;
  return randomCase(core) + symPick + numPick;
}

function showVariants(words, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  if (!words.length) return;
  const seen = new Set();
  let attempts = 0;
  while (seen.size < 5 && attempts < 30) {
    attempts++;
    const source = words[secureRandomInt(words.length)];
    const v = makeVariant(source);
    if (!seen.has(v)) seen.add(v);
  }
  seen.forEach(v => {
    const row = document.createElement('div');
    row.className = 'variant';
    const span = document.createElement('span');
    span.textContent = v;
    const btn = document.createElement('button');
    btn.textContent = 'usar';
    btn.addEventListener('click', () => {
      document.getElementById('output').textContent = v;
      renderStrength(v);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    row.appendChild(span);
    row.appendChild(btn);
    container.appendChild(row);
  });
}

document.getElementById('varyBtn').addEventListener('click', () => {
  const raw = document.getElementById('baseWord').value.trim();
  if (!raw) return;
  const words = raw.split(',').map(w => w.trim()).filter(Boolean);
  showVariants(words.length ? words : [raw], 'variantsOut');
});

doGenerate();

// --- Idioma ---
// Alterna entre português e inglês usando texto já embutido no código —
// sem depender de nenhum serviço externo, funciona sempre, online ou offline.
let localLangIsEnglish = false;

function applyLocalEnglish(toEnglish) {
  document.querySelectorAll('[data-en]').forEach(el => {
    if (!el.dataset.pt) el.dataset.pt = el.textContent;
    el.textContent = toEnglish ? el.dataset.en : el.dataset.pt;
  });
  document.querySelectorAll('[data-en-placeholder]').forEach(el => {
    if (!el.dataset.ptPlaceholder) el.dataset.ptPlaceholder = el.placeholder;
    el.placeholder = toEnglish ? el.dataset.enPlaceholder : el.dataset.ptPlaceholder;
  });
  document.querySelectorAll('[data-en-title]').forEach(el => {
    if (!el.dataset.ptTitle) el.dataset.ptTitle = el.title;
    el.title = toEnglish ? el.dataset.enTitle : el.dataset.ptTitle;
  });
  localLangIsEnglish = toEnglish;
  const btn = document.getElementById('langToggle');
  btn.textContent = toEnglish ? 'PT' : 'EN';
  btn.title = toEnglish ? 'Voltar para português' : 'Switch to English';
}

document.getElementById('langToggle').addEventListener('click', () => {
  applyLocalEnglish(!localLangIsEnglish);
});

// --- Modo escuro ---
(function initTheme() {
  const toggle = document.getElementById('themeToggle');
  let saved = null;
  try { saved = localStorage.getItem('cofre-theme'); } catch (e) { /* sem storage */ }
  let theme = saved;
  if (!theme) {
    theme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  }
  applyTheme(theme);

  function applyTheme(t) {
    if (t === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      toggle.textContent = '☀️';
    } else {
      document.documentElement.removeAttribute('data-theme');
      toggle.textContent = '🌙';
    }
  }

  toggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('cofre-theme', next); } catch (e) { /* sem storage */ }
  });
})();

// --- Base local de temas (offline, sem internet) ---
const LOCAL_TOPICS = {
  "bts":["bangtan","army","dynamite","butter","jimin","jungkook","taehyung","namjoon"],
  "blackpink":["jisoo","jennie","rose","lisa","yg","ddu","pink"],
  "twice":["once","nayeon","sana","momo","tzuyu","fancy"],
  "newjeans":["bunnies","hanni","danielle","haerin","minji","ador"],
  "stray kids":["skz","stay","bangchan","felix","hyunjin","chk"],
  "seventeen":["carat","svt","hoshi","mingyu","woozi"],
  "exo":["exol","baekhyun","chanyeol","kai","suho"],
  "ateez":["atiny","hongjoong","seonghwa","wooyoung"],
  "kpop":["idol","bias","comeback","fandom","debut","stan"],
  "taylor swift":["swiftie","eras","lover","folklore","cardigan"],
  "billie eilish":["ocean","bellyache","happier","bad guy"],
  "hoshimachi suisei":["comet","hololive","vtuber","stardust","suisui"],
  "hololive":["oshi","vtuber","towa","marine","gura","superchat"],
  "vtuber":["oshi","stream","superchat","rigging","model3d"],
  "naruto":["hokage","shinobi","konoha","sasuke","sakura","kunai"],
  "one piece":["luffy","strawhat","zoro","nakama","grandline"],
  "attack on titan":["eren","titan","survey","mikasa","wall"],
  "demon slayer":["tanjiro","nezuko","hashira","breathing"],
  "jujutsu kaisen":["gojo","itadori","cursed","sukuna","jjk"],
  "my hero academia":["deku","allmight","quirk","ua","bakugo"],
  "dragon ball":["goku","saiyan","kamehameha","vegeta"],
  "sailor moon":["usagi","moonlight","guardian","luna"],
  "studio ghibli":["totoro","spirited","howl","miyazaki"],
  "pokemon":["pikachu","trainer","gotta","catch","poke"],
  "minecraft":["creeper","diamond","crafting","steve","redstone"],
  "fortnite":["battle","royale","victory","llama","storm"],
  "league of legends":["summoner","rift","nexus","lol","penta"],
  "valorant":["agent","spike","clutch","ace"],
  "zelda":["hyrule","link","triforce","hero","master"],
  "genshin impact":["traveler","teyvat","primogem","archon"],
  "among us":["impostor","crewmate","vent","sus","task"],
  "roblox":["robux","noob","avatar","blox"],
  "gta":["vice","liberty","heist","wasted"],
  "marvel":["avenger","stark","hero","infinity","shield"],
  "star wars":["jedi","force","skywalker","droid","saber"],
  "harry potter":["hogwarts","wizard","wand","quidditch","muggle"],
  "stranger things":["hawkins","upside","eleven","demogorgon"],
  "disney":["magic","castle","princess","pixar"],
  "futebol":["gol","craque","torcida","camisa","estadio"],
  "formula 1":["pole","podio","boxes","piloto","grid"],
  "sol":["astro","raio","calor","luz","verao","dourado"],
  "lua":["luar","crescente","noite","satelite","prata"],
  "mar":["onda","praia","sal","azul","mare","oceano"],
  "floresta":["verde","trilha","folhas","selva","natureza"],
  "montanha":["pico","trilha","altitude","rocha","cume"],
  "cafe":["expresso","aroma","xicara","grao","cafeina"],
  "gato":["felino","miau","bigode","pata","ronronar"],
  "cachorro":["latido","fiel","pata","rex","amigo"],
  "viagem":["mala","destino","passagem","roteiro","aventura"],
  "inverno":["frio","neve","cobertor","gelo"],
  "verao":["calor","praia","sol","ferias"],
  "estrelas":["constelacao","brilho","noite","galaxia","cosmos"]
};

function normalizeTopic(s) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function findLocalTopic(topic) {
  const norm = normalizeTopic(topic);
  if (LOCAL_TOPICS[norm]) return LOCAL_TOPICS[norm];
  const keys = Object.keys(LOCAL_TOPICS);
  const match = keys.find(k => norm.includes(k) || k.includes(norm));
  return match ? LOCAL_TOPICS[match] : null;
}

// --- Referências por tema ---
// Ordem de tentativa: 0) base local embutida (sem internet) 1) capacidade
// "sample" (só existe dentro do Artifact do claude.ai) 2) Datamuse, API
// pública e gratuita de associação de palavras
// (funciona fora do Artifact, ex: app de desktop) 3) chave própria da
// Anthropic, se o usuário salvou uma.

let sampleFn = null;
let sampleChecked = false;

async function getSample() {
  if (sampleChecked) return sampleFn;
  sampleChecked = true;
  try {
    sampleFn = await claude.use('sample');
  } catch (e) {
    sampleFn = null;
  }
  return sampleFn;
}

function getApiKey() {
  try { return localStorage.getItem('cofre-anthropic-key') || ''; } catch (e) { return ''; }
}

async function fetchViaSample(topic) {
  const sample = await getSample();
  if (typeof claude === 'undefined' || !sample) return null;
  const result = await sample.json(
    `Tema/interesse: "${topic}". Liste de 15 a 20 palavras curtas associadas a esse tema ` +
    `(apelidos, termos relacionados, conceitos, símbolos, gírias de fã-clube, traduções). ` +
    `Cada item deve ser uma única palavra, sem espaços, sem acentos, minúscula, boa para compor uma senha. ` +
    `Responda APENAS com um array JSON de strings, nada mais.`,
    { modelTier: 'quick' }
  );
  return Array.isArray(result) ? result.filter(w => typeof w === 'string' && w.trim()) : [];
}

async function fetchViaDatamuse(topic) {
  const res = await fetch('https://api.datamuse.com/words?ml=' + encodeURIComponent(topic) + '&max=24');
  if (!res.ok) throw new Error('datamuse_error');
  const data = await res.json();
  return Array.isArray(data) ? data.map(item => item.word).filter(Boolean) : [];
}

const STOPWORDS = new Set(['de','da','do','das','dos','em','com','para','por','uma','um','os','as',
  'the','and','for','with','from','this','that','was','are','its','his','her','their']);

async function fetchViaWikipedia(topic) {
  // 1) acha o artigo mais próximo do tema digitado
  const searchRes = await fetch('https://pt.wikipedia.org/w/api.php?action=opensearch&format=json&origin=*&limit=1&search=' + encodeURIComponent(topic));
  if (!searchRes.ok) throw new Error('wiki_search_error');
  const searchData = await searchRes.json();
  const title = searchData[1] && searchData[1][0];
  if (!title) return [];

  // 2) pega categorias e links do artigo — são a fonte das palavras relacionadas
  const infoRes = await fetch('https://pt.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=categories|links&pllimit=30&cllimit=20&titles=' + encodeURIComponent(title));
  if (!infoRes.ok) throw new Error('wiki_info_error');
  const infoData = await infoRes.json();
  const pages = infoData.query && infoData.query.pages;
  if (!pages) return [];
  const page = Object.values(pages)[0];
  const raw = [];
  (page.categories || []).forEach(c => raw.push(c.title.replace('Categoria:', '')));
  (page.links || []).forEach(l => raw.push(l.title));

  const topicNorm = normalizeTopic(topic);
  const words = raw
    .filter(t => !t.includes(':'))
    .flatMap(t => t.split(/\s+/))
    .map(w => normalizeTopic(w).replace(/[^a-z0-9]/g, ''))
    .filter(w => w.length >= 3 && w.length <= 16)
    .filter(w => w !== topicNorm && !STOPWORDS.has(w));

  return [...new Set(words)].slice(0, 24);
}

async function fetchViaAnthropicKey(topic, apiKey) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `Tema/interesse: "${topic}". Liste de 15 a 20 palavras curtas associadas a esse tema ` +
          `(apelidos, termos relacionados, conceitos, símbolos, gírias de fã-clube, traduções). ` +
          `Cada item deve ser uma única palavra, sem espaços, sem acentos, minúscula, boa para compor uma senha. ` +
          `Responda APENAS com um array JSON de strings, nada mais, sem markdown.`
      }]
    })
  });
  if (!res.ok) {
    if (res.status === 401) throw { code: 'invalid_key' };
    throw new Error('anthropic_error');
  }
  const data = await res.json();
  const text = (data.content || []).map(b => b.text || '').join('').trim();
  const clean = text.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(clean);
  return Array.isArray(parsed) ? parsed.filter(w => typeof w === 'string' && w.trim()) : [];
}

function renderTopicWords(words, status, out) {
  out.innerHTML = '';
  const cleanWords = words.map(w => w.trim().toLowerCase().replace(/\s+/g, '')).filter(Boolean);
  if (!cleanWords.length) {
    status.textContent = 'Não encontrei referências para esse tema. Tente outro termo.';
    return;
  }
  status.textContent = 'toque em uma palavra para gerar senhas a partir dela:';
  cleanWords.forEach(clean => {
    const row = document.createElement('div');
    row.className = 'variant';
    const span = document.createElement('span');
    span.textContent = clean;
    const btn = document.createElement('button');
    btn.textContent = 'gerar senhas';
    btn.addEventListener('click', () => {
      document.getElementById('baseWord').value = clean;
      showVariants([clean], 'variantsOut');
      document.getElementById('variantsOut').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    row.appendChild(span);
    row.appendChild(btn);
    out.appendChild(row);
  });
}

function shuffleArray(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// pool de palavras já encontradas por tema, pra não precisar buscar de novo
// na rede a cada clique — só mostra um lote novo embaralhado
const topicPools = {};
const BATCH_SIZE = 8;

async function fetchTopicPool(topic) {
  // 1) capacidade "sample" do Artifact (claude.ai)
  try {
    const words = await fetchViaSample(topic);
    if (words !== null && words.length) return { words };
  } catch (e) {
    if (e && e.code === 'not_granted') return { error: 'not_granted' };
    if (e && e.code === 'rate_limited') return { error: 'rate_limited' };
  }

  // 2) Wikipédia (gratuita, sem chave, boa pra nomes próprios e temas específicos)
  try {
    const words = await fetchViaWikipedia(topic);
    if (words.length) return { words };
  } catch (e) { /* sem internet, ou artigo não encontrado: segue */ }

  // 3) Datamuse (gratuita, boa pra palavras comuns do dia a dia)
  try {
    const words = await fetchViaDatamuse(topic);
    if (words.length) return { words };
  } catch (e) { /* sem internet: segue */ }

  // 4) chave própria da Anthropic, se salva
  const apiKey = getApiKey();
  if (apiKey) {
    try {
      const words = await fetchViaAnthropicKey(topic, apiKey);
      if (words.length) return { words };
    } catch (e) {
      if (e && e.code === 'invalid_key') return { error: 'invalid_key' };
    }
  }

  // 5) base local embutida — só entra se nada acima funcionou (ex: sem internet)
  const localWords = findLocalTopic(topic);
  if (localWords) return { words: localWords, offline: true };

  return { words: [] };
}

function showNextBatch(norm, status, out) {
  const pool = topicPools[norm];
  let batch = pool.words.slice(pool.cursor, pool.cursor + BATCH_SIZE);
  pool.cursor += BATCH_SIZE;
  if (pool.cursor >= pool.words.length) {
    // esgotou as opções: reembaralha pra próxima vez
    pool.words = shuffleArray(pool.words);
    pool.cursor = 0;
  }
  renderTopicWords(batch, status, out);
  const hint = pool.words.length > BATCH_SIZE
    ? ' — aperte "Buscar referências" de novo pra ver outras opções'
    : '';
  status.textContent += hint;
}

async function runTopicSearch() {
  const topic = document.getElementById('topicInput').value.trim();
  const status = document.getElementById('topicStatus');
  const out = document.getElementById('topicOut');
  if (!topic) { status.textContent = 'digite um tema primeiro'; out.innerHTML = ''; return; }

  const norm = normalizeTopic(topic);

  // já temos esse tema em cache: só mostra um lote novo, sem ir na rede de novo
  if (topicPools[norm] && topicPools[norm].words.length) {
    showNextBatch(norm, status, out);
    return;
  }

  status.textContent = 'buscando referências...';

  const result = await fetchTopicPool(topic);

  if (result.error === 'not_granted') {
    status.textContent = 'Você precisa permitir o acesso à IA para usar essa feature.';
    return;
  }
  if (result.error === 'rate_limited') {
    status.textContent = 'Muitas tentativas — espere um pouco e tente de novo.';
    return;
  }
  if (result.error === 'invalid_key') {
    status.textContent = 'Sua chave da Anthropic parece inválida. Confira em "opções avançadas".';
    return;
  }
  if (!result.words.length) {
    status.textContent = 'Sem conexão disponível e esse tema não está na base local. Tente novamente mais tarde ou use variações manuais abaixo.';
    return;
  }

  topicPools[norm] = { words: shuffleArray(result.words), cursor: 0 };
  showNextBatch(norm, status, out);
  if (result.offline) status.textContent = 'sem conexão — usando base local embutida: ' + status.textContent;
}

document.getElementById('topicBtn').addEventListener('click', runTopicSearch);
document.getElementById('topicInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    runTopicSearch();
  }
});

document.getElementById('apiKeySave').addEventListener('click', () => {
  const input = document.getElementById('apiKeyInput');
  const status = document.getElementById('apiKeyStatus');
  const key = input.value.trim();
  try {
    if (key) {
      localStorage.setItem('cofre-anthropic-key', key);
      status.textContent = 'Chave salva neste dispositivo.';
    } else {
      localStorage.removeItem('cofre-anthropic-key');
      status.textContent = 'Chave removida.';
    }
    input.value = '';
  } catch (e) {
    status.textContent = 'Não foi possível salvar (armazenamento local indisponível).';
  }
});

(function loadApiKeyStatus() {
  const status = document.getElementById('apiKeyStatus');
  if (getApiKey()) status.textContent = 'Uma chave já está salva neste dispositivo.';
})();
