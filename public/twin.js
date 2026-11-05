/*!
 * Jumeau IA de Younouss Athie — widget de discussion à intégrer dans un site.
 * Intégration : <script src="https://jumeau-younouss.netlify.app/twin.js" defer></script>
 * Options (attributs du script) : data-endpoint, data-open="true", data-lang="fr|en".
 */
(function () {
  "use strict";
  if (window.__younoussTwin) return;
  window.__younoussTwin = true;

  var script = document.currentScript;
  var ENDPOINT = (script && script.dataset.endpoint) || "https://rmwcbnrhhvllwebjkvnr.supabase.co/functions/v1/twin-chat";
  var LANG = (script && script.dataset.lang) || ((navigator.language || "fr").toLowerCase().indexOf("fr") === 0 ? "fr" : "en");
  var STORE = "younouss-twin-v1";

  var T = {
    fr: {
      launch: "Discuter avec mon jumeau IA",
      title: "Younouss",
      badge: "jumeau IA",
      status: "Répond à ma place, 24 h/24",
      hello: "Salut ! Je suis le jumeau IA de Younouss. Pose-moi tes questions sur mon parcours, mes projets ou ce que je recherche.",
      chips: ["C'est quoi ton parcours ?", "Parle-moi du baromètre des communes", "Pourquoi la gouvernance de l'information ?", "Comment te contacter ?"],
      placeholder: "Écris ta question…",
      send: "Envoyer",
      close: "Fermer",
      reset: "Nouvelle conversation",
      foot: "Réponses générées par IA, elles peuvent contenir des erreurs.",
      contact: "Me contacter",
      errLimit: "Beaucoup de questions d'un coup ! Réessaie dans quelques minutes.",
      errDay: "Mon jumeau se repose pour aujourd'hui. Écris-moi directement sur LinkedIn !",
      errOff: "Je ne suis pas joignable pour le moment. Réessaie plus tard ou contacte-moi sur LinkedIn.",
      thinking: "Younouss réfléchit…",
    },
    en: {
      launch: "Chat with my AI twin",
      title: "Younouss",
      badge: "AI twin",
      status: "Answers for me, 24/7",
      hello: "Hi! I'm Younouss's AI twin. Ask me anything about my background, my projects or what I'm looking for.",
      chips: ["What's your background?", "Tell me about the municipalities barometer", "Why information governance?", "How can I reach you?"],
      placeholder: "Type your question…",
      send: "Send",
      close: "Close",
      reset: "New conversation",
      foot: "AI-generated answers may contain mistakes.",
      contact: "Contact me",
      errLimit: "That's a lot of questions at once! Please try again in a few minutes.",
      errDay: "My twin is resting for today. Reach me directly on LinkedIn!",
      errOff: "I can't be reached right now. Please try later or contact me on LinkedIn.",
      thinking: "Younouss is thinking…",
    },
  }[LANG];

  var LINKEDIN = "https://www.linkedin.com/in/younouss-athie-26312a1b7";

  // ---------- Styles (isolés dans un Shadow DOM) ----------
  var CSS = [
    ":host{all:initial}",
    "*{box-sizing:border-box}",
    ".root{--navy:#0e1a33;--navy2:#13244a;--ink:#e8eefc;--muted:#9fb0d3;--blue:#4f8cff;--blue2:#7aa8ff;--line:rgba(122,168,255,.18);",
    "font-family:Inter,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:var(--ink);position:fixed;right:20px;bottom:20px;z-index:2147483000}",
    ".launch{display:flex;align-items:center;gap:10px;border:1px solid var(--line);cursor:pointer;padding:8px 16px 8px 8px;border-radius:999px;",
    "background:linear-gradient(135deg,rgba(19,36,74,.96),rgba(14,26,51,.96));color:var(--ink);font:600 14px/1 inherit;font-family:inherit;",
    "box-shadow:0 12px 40px -12px rgba(79,140,255,.55),0 0 0 1px rgba(255,255,255,.04) inset;backdrop-filter:blur(10px);transition:transform .2s}",
    ".launch:hover{transform:translateY(-2px)}",
    ".av{position:relative;flex:none;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;font:700 15px/1 'Playfair Display',Georgia,serif;",
    "color:#fff;background:radial-gradient(circle at 30% 30%,#6ea0ff,#2b5bd7 60%,#173a8a)}",
    ".av::after{content:'';position:absolute;inset:-4px;border-radius:50%;border:2px solid rgba(79,140,255,.6);animation:pulse 2.4s ease-out infinite}",
    ".dot{position:absolute;right:0;bottom:0;width:11px;height:11px;border-radius:50%;background:#34d399;border:2px solid var(--navy)}",
    "@keyframes pulse{0%{transform:scale(.9);opacity:.9}100%{transform:scale(1.35);opacity:0}}",
    ".panel{position:absolute;right:0;bottom:64px;width:min(390px,calc(100vw - 32px));height:min(600px,calc(100vh - 110px));display:flex;flex-direction:column;",
    "border-radius:22px;overflow:hidden;border:1px solid var(--line);background:linear-gradient(180deg,#101e3d,#0b1630);",
    "box-shadow:0 30px 80px -20px rgba(0,0,0,.6),0 0 60px -20px rgba(79,140,255,.45);transform-origin:bottom right;animation:pop .22s ease-out}",
    "@keyframes pop{from{opacity:0;transform:translateY(10px) scale(.97)}to{opacity:1;transform:none}}",
    ".hd{display:flex;align-items:center;gap:12px;padding:14px 14px 12px 16px;border-bottom:1px solid var(--line);",
    "background:radial-gradient(120% 140% at 0% 0%,rgba(79,140,255,.22),transparent 60%)}",
    ".hd .name{font:600 20px/1.1 'Playfair Display',Georgia,serif;color:#fff;display:flex;align-items:center;gap:8px}",
    ".tag{font:600 10px/1 Inter,system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:var(--blue2);border:1px solid var(--line);border-radius:999px;padding:4px 7px}",
    ".hd .st{font-size:12px;color:var(--muted);margin-top:3px}",
    ".ib{margin-left:auto;display:flex;gap:4px}",
    ".icon{width:34px;height:34px;border-radius:10px;border:0;background:transparent;color:var(--muted);cursor:pointer;display:grid;place-items:center}",
    ".icon:hover{background:rgba(255,255,255,.06);color:#fff}",
    ".msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth}",
    ".m{max-width:86%;padding:10px 13px;border-radius:16px;font-size:14px;line-height:1.5;white-space:pre-wrap;word-wrap:break-word}",
    ".m.bot{align-self:flex-start;background:rgba(255,255,255,.06);border:1px solid var(--line);border-bottom-left-radius:6px}",
    ".m.me{align-self:flex-end;background:linear-gradient(135deg,#3b74f0,#2a56c9);color:#fff;border-bottom-right-radius:6px}",
    ".m a{color:var(--blue2)}.m.me a{color:#fff}",
    ".m.err{background:rgba(244,63,94,.12);border-color:rgba(244,63,94,.35)}",
    ".typing{display:inline-flex;gap:4px;align-items:center;color:var(--muted);font-size:13px}",
    ".typing i{width:6px;height:6px;border-radius:50%;background:var(--blue2);animation:b 1s infinite}",
    ".typing i:nth-child(2){animation-delay:.15s}.typing i:nth-child(3){animation-delay:.3s}",
    "@keyframes b{0%,80%,100%{opacity:.25;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}",
    ".caret::after{content:'▍';color:var(--blue2);animation:blink 1s steps(1) infinite;margin-left:1px}",
    "@keyframes blink{50%{opacity:0}}",
    ".chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 16px 10px}",
    ".chip{border:1px solid var(--line);background:rgba(79,140,255,.08);color:var(--ink);border-radius:999px;padding:7px 11px;font:500 12.5px/1.2 inherit;font-family:inherit;cursor:pointer;text-align:left}",
    ".chip:hover{background:rgba(79,140,255,.18)}",
    "form{display:flex;gap:8px;padding:12px;border-top:1px solid var(--line);background:rgba(0,0,0,.15)}",
    "textarea{flex:1;resize:none;height:44px;max-height:120px;border-radius:14px;border:1px solid var(--line);background:rgba(255,255,255,.05);color:#fff;",
    "padding:11px 12px;font:14px/1.4 inherit;font-family:inherit;outline:none}",
    "textarea:focus{border-color:rgba(122,168,255,.6)}",
    "textarea::placeholder{color:#7d8db0}",
    ".send{flex:none;width:44px;height:44px;border-radius:14px;border:0;cursor:pointer;color:#fff;display:grid;place-items:center;",
    "background:linear-gradient(135deg,#4f8cff,#2a56c9);box-shadow:0 8px 20px -8px rgba(79,140,255,.8)}",
    ".send:disabled{opacity:.45;cursor:not-allowed}",
    ".ft{display:flex;justify-content:space-between;gap:8px;padding:0 14px 10px;font-size:11px;color:#7d8db0;background:rgba(0,0,0,.15)}",
    ".ft a{color:var(--blue2);text-decoration:none;white-space:nowrap}",
    "button:focus-visible,textarea:focus-visible,a:focus-visible{outline:2px solid var(--blue2);outline-offset:2px}",
    "@media (max-width:520px){.root{right:12px;bottom:12px}.panel{position:fixed;inset:0;width:auto;height:auto;border-radius:0;bottom:0}",
    ".launch .lbl{display:none}.launch{padding:6px}.root.open .launch{display:none}}",
    "@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}",
  ].join("");

  var ICON = {
    close: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    reset: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',
    send: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/></svg>',
  };

  // ---------- Mémoire de la conversation (onglet courant) ----------
  function load() { try { return JSON.parse(sessionStorage.getItem(STORE) || "[]"); } catch (e) { return []; } }
  function persist() { try { sessionStorage.setItem(STORE, JSON.stringify(history.slice(-20))); } catch (e) { /* stockage indisponible */ } }
  var history = load(); // [{role:'user'|'model', text}]

  // ---------- Mise en forme sûre (texte échappé, liens et gras) ----------
  function esc(s) { return s.replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function fmt(s) {
    var h = esc(s);
    h = h.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
    h = h.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    h = h.replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, '$1<a href="$2" target="_blank" rel="noopener">$2</a>');
    h = h.replace(/(^|[\s(])([\w.+-]+@[\w-]+\.[\w.]+)/g, '$1<a href="mailto:$2">$2</a>');
    return h;
  }

  // ---------- Construction ----------
  var host = document.createElement("div");
  host.id = "younouss-twin";
  var shadow = host.attachShadow({ mode: "open" });
  shadow.innerHTML =
    "<style>" + CSS + "</style>" +
    '<div class="root">' +
    '<div class="panel" role="dialog" aria-modal="false" aria-label="' + esc(T.launch) + '" hidden>' +
    '<div class="hd"><div class="av" aria-hidden="true">YA<span class="dot"></span></div>' +
    '<div><div class="name">' + T.title + ' <span class="tag">' + T.badge + "</span></div>" +
    '<div class="st">' + T.status + "</div></div>" +
    '<div class="ib"><button class="icon" data-act="reset" title="' + esc(T.reset) + '" aria-label="' + esc(T.reset) + '">' + ICON.reset + "</button>" +
    '<button class="icon" data-act="close" title="' + esc(T.close) + '" aria-label="' + esc(T.close) + '">' + ICON.close + "</button></div></div>" +
    '<div class="msgs" aria-live="polite"></div>' +
    '<div class="chips"></div>' +
    '<form><textarea rows="1" aria-label="' + esc(T.placeholder) + '" placeholder="' + esc(T.placeholder) + '" maxlength="600"></textarea>' +
    '<button class="send" type="submit" aria-label="' + esc(T.send) + '">' + ICON.send + "</button></form>" +
    '<div class="ft"><span>' + T.foot + '</span><a href="' + LINKEDIN + '" target="_blank" rel="noopener">' + T.contact + " →</a></div>" +
    "</div>" +
    '<button class="launch" aria-expanded="false"><span class="av" aria-hidden="true">YA<span class="dot"></span></span><span class="lbl">' + T.launch + "</span></button>" +
    "</div>";

  var $ = function (s) { return shadow.querySelector(s); };
  var rootEl = $(".root"), panel = $(".panel"), launch = $(".launch"), msgs = $(".msgs"), chips = $(".chips"), form = $("form"), input = $("textarea"), sendBtn = $(".send");
  var busy = false;

  function bubble(role, html, extra) {
    var d = document.createElement("div");
    d.className = "m " + (role === "user" ? "me" : "bot") + (extra ? " " + extra : "");
    d.innerHTML = html;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }
  function render() {
    msgs.innerHTML = "";
    bubble("model", fmt(T.hello));
    history.forEach(function (m) { bubble(m.role, fmt(m.text)); });
    chips.innerHTML = "";
    if (!history.length) {
      T.chips.forEach(function (c) {
        var b = document.createElement("button");
        b.type = "button"; b.className = "chip"; b.textContent = c;
        b.addEventListener("click", function () { ask(c); });
        chips.appendChild(b);
      });
    }
  }
  function open() {
    panel.hidden = false;
    rootEl.classList.add("open");
    launch.setAttribute("aria-expanded", "true");
    render();
    setTimeout(function () { input.focus(); }, 50);
  }
  function close() {
    panel.hidden = true;
    rootEl.classList.remove("open");
    launch.setAttribute("aria-expanded", "false");
    launch.focus();
  }

  async function ask(text) {
    text = (text || "").trim();
    if (!text || busy) return;
    busy = true; sendBtn.disabled = true; chips.innerHTML = "";
    history.push({ role: "user", text: text.slice(0, 600) });
    persist();
    bubble("user", fmt(text));
    input.value = ""; input.style.height = "";
    var out = bubble("model", '<span class="typing"><i></i><i></i><i></i>&nbsp;' + esc(T.thinking) + "</span>");
    var acc = "";
    try {
      var res = await fetch(ENDPOINT, {
        method: "POST",
        // Requête « simple » (texte brut, sans en-tête personnalisé) : pas de pré-vérification CORS
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify({ messages: history.slice(-12) }),
      });
      if (!res.ok || !res.body) {
        var code = "";
        try { code = (await res.json()).error || ""; } catch (e) { /* */ }
        throw new Error(res.status === 429 ? (code === "daily_limit" ? "day" : "limit") : "off");
      }
      var reader = res.body.getReader(), dec = new TextDecoder();
      out.classList.add("caret");
      for (;;) {
        var r = await reader.read();
        if (r.done) break;
        acc += dec.decode(r.value, { stream: true });
        out.innerHTML = fmt(acc);
        msgs.scrollTop = msgs.scrollHeight;
      }
      out.classList.remove("caret");
      if (!acc.trim()) throw new Error("off");
      history.push({ role: "model", text: acc });
      persist();
    } catch (e) {
      out.classList.remove("caret");
      out.classList.add("err");
      var key = e && e.message === "limit" ? T.errLimit : e && e.message === "day" ? T.errDay : T.errOff;
      out.innerHTML = fmt(acc ? acc + "\n\n" + key : key);
      if (!acc) { history.pop(); persist(); }
    } finally {
      busy = false; sendBtn.disabled = false; input.focus();
    }
  }

  launch.addEventListener("click", function () { panel.hidden ? open() : close(); });
  shadow.querySelector('[data-act="close"]').addEventListener("click", close);
  shadow.querySelector('[data-act="reset"]').addEventListener("click", function () { history = []; persist(); render(); input.focus(); });
  form.addEventListener("submit", function (e) { e.preventDefault(); ask(input.value); });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(input.value); }
  });
  input.addEventListener("input", function () { input.style.height = "auto"; input.style.height = Math.min(120, input.scrollHeight) + "px"; });
  panel.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

  function mount() {
    document.body.appendChild(host);
    if (script && script.dataset.open === "true") open();
  }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);
})();
