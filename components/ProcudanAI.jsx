"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Mic, Send, Volume2, VolumeX, FileText, Trash2, X, Plus, Menu,
  Beaker, Scale, Package, ClipboardCheck, AlertTriangle, Paperclip, Globe, Image as ImageIcon,
  Building2, ExternalLink, Sparkles, Calculator, ListChecks, Wrench, Languages, ShieldCheck, Cpu
} from "lucide-react";

const PROCESSES = [
  { id: "blanding", label: "Blanding", sub: "Mixing & blending", icon: Beaker },
  { id: "dosering", label: "Dosering", sub: "Afvejning & dosering", icon: Scale },
  { id: "pakning", label: "Pakning", sub: "Emballering", icon: Package },
  { id: "qc", label: "Kvalitetskontrol", sub: "QC & frigivelse", icon: ClipboardCheck },
];

const QUICK_ACTIONS = {
  blanding: ["Start en ny blanding", "Fejlsøgning: klumper i pulveret", "Rengøring mellem batches"],
  dosering: ["Kalibrér vægten", "Hvad er tolerancen for afvejning?", "Dobbelttjek af dosering"],
  pakning: ["Klargør emballagen", "Batch- og holdbarhedsmærkning", "Tjek af forsegling"],
  qc: ["Sådan udtager jeg en prøve", "Kan jeg frigive denne batch?", "Dokumentér en afvigelse"],
  none: ["Hvad kan du hjælpe med?", "Forklar GMP kort", "Hvordan sikrer jeg sporbarhed?"],
};

const SKILLS = [
  { id: "calc", label: "Produktionsberegninger", desc: "Dosering, skalering af batch, blandingsforhold & fyldevægt.", icon: Calculator, prompt: "Du kan udføre produktionsberegninger: dosering, op-/nedskalering af batches, blandingsforhold (ratio) og kontrol af fyldevægt. Vis altid mellemregninger trin for trin og angiv enheder." },
  { id: "docs", label: "Dokumentgenerering", desc: "Batch-record, afvigelsesrapport & tjeklister.", icon: FileText, prompt: "Du kan generere udkast til produktionsdokumenter på struktureret form: batch-record, afvigelsesrapport (deviation) og tjeklister. Brug klare felter og overskrifter, og markér felter der skal udfyldes manuelt." },
  { id: "checklist", label: "Interaktive tjeklister", desc: "Guider trin for trin, ét trin ad gangen.", icon: ListChecks, prompt: "Når en proces gennemgås, så før brugeren gennem den ÉT trin ad gangen som en interaktiv tjekliste: præsentér ét trin, vent på bekræftelse (fx 'næste' eller 'ok'), og fortsæt derefter til næste." },
  { id: "troubleshoot", label: "Fejlsøgning", desc: "Struktureret årsagsanalyse ved problemer.", icon: Wrench, prompt: "Ved problemer udfører du struktureret fejlsøgning: spørg kort ind til symptomerne, oplist sandsynlige årsager prioriteret, og foreslå konkrete tjek og løsninger trin for trin." },
  { id: "translate", label: "Oversæt svar", desc: "Oversæt svaret til et valgt sprog for medarbejderen.", icon: Languages, prompt: "Hvis brugeren beder om det, kan du oversætte dit svar til et andet sprog (fx engelsk, arabisk, polsk eller tysk). Hold fagudtryk korrekte." },
  { id: "qa", label: "Fødevaresikkerhed & kvalitet (QA)", desc: "HACCP, GMP, ISO 22000, allergener, sporbarhed & audit.", icon: ShieldCheck, prompt: "Du agerer som en erfaren kvalitetssikrings- og fødevaresikkerhedsekspert (QA). Forankr dine svar i anerkendte rammer: HACCP, GMP/GHP, ISO 22000 / FSSC 22000, BRCGS, allergenstyring, hygiejne, fuld sporbarhed, kritiske kontrolpunkter (CCP), prøveudtagning, audit samt håndtering af afvigelser og korrigerende/forebyggende handlinger (CAPA). Forklar kort hvilket princip der er relevant, vær konkret og handlingsorienteret, og henvis altid til virksomhedens egne SOP'er og den kvalitetsansvarlige ved kritiske beslutninger." },
  { id: "teknik", label: "Teknisk", desc: "Anlæg, maskiner, PLC/SCADA (TwinCAT), el, alarmer & fejlfinding.", icon: Cpu, prompt: "Du agerer som teknisk anlægs- og vedligeholdelsesekspert. Du hjælper med anlæg og maskiner, mekanik, el og pneumatik, PLC/SCADA-overvågning, Beckhoff TwinCAT-miljøet, HMI-betjening, alarm- og fejlhåndtering, opstart/nedlukning af udstyr samt opsætning af batch- og proceparametre. Giv altid systematisk fejlfinding trin for trin. Prioritér sikkerhed (nødstop, LOTO/lockout-tagout) og henvis til den driftsansvarlige, automatiktekniker eller elektriker ved indgreb i selve styringen eller el-installationen." },
];


function Logo({ size = 40, animated = true }) {
  const ring1 = [[83, 50], [66.5, 78.6], [33.5, 78.6], [17, 50], [33.5, 21.4], [66.5, 21.4]];
  const ring2 = [[67.3, 60], [50, 70], [32.7, 60], [32.7, 40], [50, 30], [67.3, 40]];
  const poly1 = ring1.map((p) => p.join(",")).join(" ");
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={`pa-logo ${animated ? "on" : ""}`} role="img" aria-label="Procudan AI">
      <defs>
        <radialGradient id="pa-core" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#42454d" />
          <stop offset="100%" stopColor="#0e0f13" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.12" />
      <g className="pa-r1">
        <polygon points={poly1} fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.22" />
        {ring1.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={i % 2 ? 2 : 2.9} fill="currentColor" opacity="0.85" />)}
      </g>
      <g className="pa-r2">
        {ring2.map((p, i) => (
          <g key={i}>
            <line x1="50" y1="50" x2={p[0]} y2={p[1]} stroke="currentColor" strokeWidth="0.5" opacity="0.16" />
            <circle cx={p[0]} cy={p[1]} r="1.6" fill="currentColor" opacity="0.5" />
          </g>
        ))}
      </g>
      <g className="pa-orbit">
        <circle cx="50" cy="8" r="5" fill="currentColor" opacity="0.1" />
        <circle cx="50" cy="8" r="2.1" fill="currentColor" />
      </g>
      <circle cx="50" cy="50" r="11" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.28" />
      <circle cx="50" cy="50" r="8.6" fill="url(#pa-core)" />
      <circle cx="46.6" cy="46.6" r="2.3" fill="#fff" opacity="0.38" />
    </svg>
  );
}

// ---- Lightweight Markdown renderer (bold, italic, code, lists, headings, links) ----
function mdInline(text, kp = "i") {
  const out = []; let key = 0; let last = 0;
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(__[^_]+__)|(\*[^*\n]+\*)|(\[[^\]]+\]\([^)]+\))/g;
  let m;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const t = m[0];
    if (t.startsWith("`")) out.push(<code key={kp + key++} className="md-ic">{t.slice(1, -1)}</code>);
    else if (t.startsWith("**") || t.startsWith("__")) out.push(<strong key={kp + key++}>{t.slice(2, -2)}</strong>);
    else if (t.startsWith("*")) out.push(<em key={kp + key++}>{t.slice(1, -1)}</em>);
    else if (t.startsWith("[")) {
      const mm = /\[([^\]]+)\]\(([^)]+)\)/.exec(t);
      out.push(<a key={kp + key++} href={mm[2]} target="_blank" rel="noreferrer">{mm[1]}</a>);
    }
    last = m.index + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function Markdown({ text }) {
  const lines = (text || "").split("\n");
  const blocks = []; let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim().startsWith("```")) {
      const buf = []; i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) { buf.push(lines[i]); i++; }
      i++; blocks.push({ t: "code", c: buf.join("\n") }); continue;
    }
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) { blocks.push({ t: "h", lvl: h[1].length, c: h[2] }); i++; continue; }
    if (/^>\s?/.test(line)) { const q = []; while (i < lines.length && /^>\s?/.test(lines[i])) { q.push(lines[i].replace(/^>\s?/, "")); i++; } blocks.push({ t: "q", c: q.join("\n") }); continue; }
    if (/^\s*[-*]\s+/.test(line)) { const it = []; while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) { it.push(lines[i].replace(/^\s*[-*]\s+/, "")); i++; } blocks.push({ t: "ul", it }); continue; }
    if (/^\s*\d+\.\s+/.test(line)) { const it = []; while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) { it.push(lines[i].replace(/^\s*\d+\.\s+/, "")); i++; } blocks.push({ t: "ol", it }); continue; }
    if (line.trim() === "") { i++; continue; }
    const p = [line]; i++;
    while (i < lines.length && lines[i].trim() !== "" && !/^(#{1,4})\s/.test(lines[i]) && !/^\s*[-*]\s+/.test(lines[i]) && !/^\s*\d+\.\s+/.test(lines[i]) && !lines[i].trim().startsWith("```") && !/^>\s?/.test(lines[i])) { p.push(lines[i]); i++; }
    blocks.push({ t: "p", c: p.join("\n") });
  }
  const withBreaks = (c, kp) => c.split("\n").flatMap((ln, idx) => idx === 0 ? mdInline(ln, kp + idx) : [<br key={kp + "br" + idx} />, ...mdInline(ln, kp + idx)]);
  return (
    <div className="md">
      {blocks.map((b, bi) => {
        if (b.t === "code") return <pre key={bi} className="md-code"><code>{b.c}</code></pre>;
        if (b.t === "h") { const T = `h${Math.min(b.lvl + 2, 6)}`; return React.createElement(T, { key: bi, className: "md-h" }, mdInline(b.c, "h" + bi)); }
        if (b.t === "q") return <blockquote key={bi} className="md-q">{withBreaks(b.c, "q" + bi)}</blockquote>;
        if (b.t === "ul") return <ul key={bi} className="md-ul">{b.it.map((x, xi) => <li key={xi}>{mdInline(x, "u" + bi + xi)}</li>)}</ul>;
        if (b.t === "ol") return <ol key={bi} className="md-ol">{b.it.map((x, xi) => <li key={xi}>{mdInline(x, "o" + bi + xi)}</li>)}</ol>;
        return <p key={bi} className="md-p">{withBreaks(b.c, "p" + bi)}</p>;
      })}
    </div>
  );
}

export default function ProcudanAI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [activeProcess, setActiveProcess] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [voiceOutput, setVoiceOutput] = useState(true);
  const [sops, setSops] = useState([]);
  const [showSop, setShowSop] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showSkills, setShowSkills] = useState(false);
  const [skillsOn, setSkillsOn] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState(null);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [attachment, setAttachment] = useState(null);
  const [webSearch, setWebSearch] = useState(true);
  const [searching, setSearching] = useState(false);

  const recognitionRef = useRef(null);
  const scrollRef = useRef(null);
  const baseInputRef = useRef("");
  const daVoiceRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setSpeechSupported(false); return; }
    const rec = new SR();
    rec.lang = "da-DK"; rec.interimResults = true; rec.continuous = false;
    rec.onresult = (e) => {
      let txt = "";
      for (let i = 0; i < e.results.length; i++) txt += e.results[i][0].transcript;
      setInput((baseInputRef.current ? baseInputRef.current + " " : "") + txt);
    };
    rec.onend = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);
    recognitionRef.current = rec;
  }, []);

  useEffect(() => {
    const pick = () => {
      const voices = window.speechSynthesis?.getVoices?.() || [];
      daVoiceRef.current = voices.find((v) => v.lang === "da-DK") || voices.find((v) => v.lang?.startsWith("da")) || null;
    };
    pick();
    if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = pick;
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  const speak = useCallback((text) => {
    if (!voiceOutput || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "da-DK";
    if (daVoiceRef.current) u.voice = daVoiceRef.current;
    window.speechSynthesis.speak(u);
  }, [voiceOutput]);

  const toggleListen = () => {
    if (!recognitionRef.current) return;
    if (isListening) { recognitionRef.current.stop(); setIsListening(false); }
    else {
      window.speechSynthesis?.cancel();
      baseInputRef.current = input.trim(); setError(null);
      try { recognitionRef.current.start(); setIsListening(true); } catch { /* */ }
    }
  };

  const buildSystemPrompt = () => {
    const proc = PROCESSES.find((p) => p.id === activeProcess);
    let s =
`Du er Procudan AI — en intelligent produktionsassistent for et pulverproduktionsanlæg (fødevarer og kosttilskud).
Du hjælper produktionsmedarbejdere trin for trin med fire områder: blanding, dosering/afvejning, pakning og kvalitetskontrol (QC).

Retningslinjer:
- Svar kort, klart og handlingsorienteret. Brug nummererede trin og punktlister, når du beskriver en proces.
- Du må bruge let Markdown (overskrifter, **fed**, lister) til at gøre svaret overskueligt.
- Prioritér altid sikkerhed, hygiejne (GMP) og fuld sporbarhed af batches.
- Er du i tvivl, eller kan noget påvirke produktsikkerheden, så sig det tydeligt og bed medarbejderen kontakte den produktionsansvarlige.
- Hvis du har adgang til websøgning og spørgsmålet kræver aktuel viden, så søg og angiv kilder.
- Du kan modtage vedhæftede billeder og PDF'er (fx etiketter, SOP'er, batch-sedler) — læs dem og brug indholdet.
- Svar på samme sprog som brugeren (standard: dansk). Hold sætningerne naturlige, da svaret også kan blive læst højt.`;
    s += `\n\nOm virksomheden (reference): Procudan A/S er en dansk sourcing- og handelsvirksomhed i Kolding (Bronzevej 1, 6000 Kolding · tlf. 75 50 80 00 · CVR 28293860 · stiftet 2004 · ca. 50 ansatte · adm. direktør Tommy Højtoft Pedersen). Procudan leverer "single point sourcing" af fødevareingredienser, emballage og skræddersyede løsninger til fødevare-, nutrition- og pharmaindustrien — samt blandinger, ompakning, QA-dokumentation, logistik- og lagerløsning, risikostyring, IT-integration og forsyningssikkerhed. Slogan: "Adding value to your supply chain".`;
    s += `\n\nHvis du bliver spurgt, hvem der har bygget eller udviklet dig, så svar professionelt og kortfattet: "Jeg er udviklet for Procudan A/S af virksomhedens ingeniør, Adam Ben Hassine." Hold tonen professionel.`;
    const activeSkills = SKILLS.filter((k) => skillsOn[k.id]);
    if (activeSkills.length) {
      s += `\n\nAKTIVE SKILLS (ekstra evner du skal anvende, når det er relevant):`;
      activeSkills.forEach((k) => { s += `\n- ${k.label}: ${k.prompt}`; });
    }
    if (proc) s += `\n\nAktivt procesområde lige nu: ${proc.label} (${proc.sub}).`;
    if (sops.length) {
      s += `\n\nVEDHÆFTEDE SOP-DOKUMENTER (autoritativ kilde — følg disse frem for generel viden):`;
      sops.forEach((d, i) => { s += `\n\n--- SOP ${i + 1}: ${d.title} ---\n${d.content}`; });
    }
    return s;
  };

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const isPdf = f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf");
    const isImg = f.type.startsWith("image/");
    if (!isPdf && !isImg) { setError("Kun PDF og billeder understøttes."); e.target.value = ""; return; }
    const reader = new FileReader();
    reader.onload = () => {
      const data = String(reader.result).split(",")[1];
      setAttachment({ name: f.name, kind: isPdf ? "pdf" : "image", mime: isPdf ? "application/pdf" : f.type, data });
    };
    reader.readAsDataURL(f);
    e.target.value = "";
  };

  const send = async (text) => {
    const content = (text ?? input).trim();
    if ((!content && !attachment) || isLoading) return;
    setInput(""); baseInputRef.current = ""; setError(null); setSidebarOpen(false);
    window.speechSynthesis?.cancel();

    const att = attachment;
    let apiContent;
    if (att) {
      apiContent = [];
      if (att.kind === "pdf") apiContent.push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: att.data } });
      else apiContent.push({ type: "image", source: { type: "base64", media_type: att.mime, data: att.data } });
      apiContent.push({ type: "text", text: content || "Analysér venligst denne vedhæftning." });
    } else apiContent = content;

    const userMsg = { role: "user", content: content || (att ? "Vedhæftning sendt" : ""), att: att ? { name: att.name, kind: att.kind } : null, api: apiContent };
    const next = [...messages, userMsg];
    setMessages([...next, { role: "assistant", content: "" }]);
    setAttachment(null); setIsLoading(true);

    const apiMessages = next.map((m) => ({ role: m.role, content: m.role === "user" ? (m.api ?? m.content) : m.content }));
    const setLast = (t) => setMessages((m) => { const c = [...m]; c[c.length - 1] = { role: "assistant", content: t }; return c; });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: buildSystemPrompt(), messages: apiMessages, webSearch }),
      });
      if (!res.ok) {
        let msg = "";
        try { const j = await res.json(); msg = j.error || ""; } catch { /* */ }
        throw new Error(msg ? String(msg).slice(0, 200) : "HTTP " + res.status);
      }

      let acc = "";
      const ct = res.headers.get("content-type") || "";
      if (res.body && res.body.getReader && ct.includes("event-stream")) {
        const reader = res.body.getReader();
        const dec = new TextDecoder();
        let buf = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          const parts = buf.split("\n");
          buf = parts.pop();
          for (const ln of parts) {
            const l = ln.trim();
            if (!l.startsWith("data:")) continue;
            const d = l.slice(5).trim();
            if (!d || d === "[DONE]") continue;
            try {
              const ev = JSON.parse(d);
              if (ev.type === "content_block_start" && ev.content_block?.type === "server_tool_use") setSearching(true);
              if (ev.type === "content_block_delta" && ev.delta?.type === "text_delta") {
                if (acc === "") setSearching(false);
                acc += ev.delta.text; setLast(acc);
              }
            } catch { /* ignore partial */ }
          }
        }
      } else {
        const data = await res.json();
        acc = (data.content || []).map((b) => (b.type === "text" ? b.text : "")).filter(Boolean).join("\n");
      }
      acc = acc.trim() || "Jeg fik ikke noget svar. Prøv igen.";
      setLast(acc); speak(acc.replace(/[*_#`>]/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"));
    } catch (err) {
      setMessages((m) => m.slice(0, -1));
      setError("Forbindelse til AI mislykkedes — " + (err && err.message ? err.message : "ukendt fejl"));
    } finally { setIsLoading(false); setSearching(false); }
  };

  const clearChat = () => { window.speechSynthesis?.cancel(); setMessages([]); setError(null); };
  const proc = PROCESSES.find((p) => p.id === activeProcess);
  const quick = QUICK_ACTIONS[activeProcess || "none"];

  return (
    <div className="pa-app">

      {sidebarOpen && <div className="pa-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`pa-side ${sidebarOpen ? "open" : ""}`}>
        <div className="pa-brand">
          <Logo size={38} />
          <div className="pa-brand-txt">
            <b>Procudan <span className="pa-aibadge">AI</span></b>
            <span>Produktionsassistent</span>
          </div>
          <button className="pa-x mobile" onClick={() => setSidebarOpen(false)}><X size={18} /></button>
        </div>

        <div className="pa-section">
          <div className="pa-label">Procesområde</div>
          <div className="pa-proclist">
            {PROCESSES.map((p) => {
              const Icon = p.icon; const on = activeProcess === p.id;
              return (
                <button key={p.id} className={`pa-proc ${on ? "on" : ""}`} onClick={() => setActiveProcess(on ? null : p.id)}>
                  <span className="pa-proc-ic"><Icon size={16} /></span>
                  <span className="pa-proc-txt"><b>{p.label}</b><i>{p.sub}</i></span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pa-section">
          <div className="pa-label">Virksomhed</div>
          <button className="pa-listbtn" onClick={() => setShowInfo(true)}>
            <Building2 size={16} /> Procudan
          </button>
        </div>

        <div className="pa-section">
          <div className="pa-label">Viden & indstillinger</div>
          <button className="pa-listbtn" onClick={() => setShowSkills(true)}>
            <Sparkles size={16} /> Skills <span className="pa-count">{Object.values(skillsOn).filter(Boolean).length}</span>
          </button>
          <button className="pa-listbtn" onClick={() => setShowSop(true)}>
            <FileText size={16} /> SOP-dokumenter <span className="pa-count">{sops.length}</span>
          </button>
          <button className="pa-listbtn" onClick={() => { setVoiceOutput(!voiceOutput); window.speechSynthesis?.cancel(); }}>
            {voiceOutput ? <Volume2 size={16} /> : <VolumeX size={16} />} Oplæsning
            <span className={`pa-toggle ${voiceOutput ? "on" : ""}`}><i /></span>
          </button>
          <button className="pa-listbtn" onClick={() => setWebSearch(!webSearch)}>
            <Globe size={16} /> Websøgning
            <span className={`pa-toggle ${webSearch ? "on" : ""}`}><i /></span>
          </button>
          <button className="pa-listbtn" onClick={clearChat}><Trash2 size={16} /> Ryd samtale</button>
        </div>

        <div className="pa-side-foot"><span className="pa-dot" /> Forbundet · klar</div>
      </aside>

      <div className="pa-main">
        <header className="pa-top">
          <button className="pa-burger" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
          {proc ? (
            <div className="pa-ctx">
              <span className="pa-ctx-ic"><proc.icon size={15} /></span>
              <span><b>{proc.label}</b><i>Aktivt procesområde</i></span>
            </div>
          ) : (
            <div className="pa-ctx"><span><b>Oversigt</b><i>Vælg et procesområde for fokuseret hjælp</i></span></div>
          )}
        </header>

        <main className="pa-chat" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="pa-empty">
              <div className="pa-hero"><Logo size={84} /></div>
              <div className="pa-wordmark">Procudan <span>AI</span></div>
              <div className="pa-tagline">Produktionsassistent</div>
              <h2>Goddag. Hvad arbejder du med i dag?</h2>
              <p>Stil et spørgsmål med tekst eller stemme. Jeg guider dig gennem blanding, dosering, pakning og kvalitetskontrol — med fokus på sikkerhed og sporbarhed.</p>
              <div className="pa-quick">
                {quick.map((q) => <button key={q} className="pa-chip" onClick={() => send(q)}>{q}</button>)}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`pa-row ${m.role}`}>
              {m.role === "assistant" && <span className="pa-av"><Logo size={20} animated={false} /></span>}
              <div className="pa-bubble">
                {m.role === "assistant" ? (
                  m.content ? <Markdown text={m.content} />
                    : (searching
                        ? <div className="pa-searching"><Globe size={13} /> Søger på nettet…</div>
                        : <div className="pa-typing"><i /><i /><i /></div>)
                ) : (
                  <>
                    {m.att && <span className="pa-attach-chip">{m.att.kind === "pdf" ? <FileText size={13} /> : <ImageIcon size={13} />} {m.att.name}</span>}
                    {m.content && <span className="pa-utext">{m.content}</span>}
                  </>
                )}
              </div>
            </div>
          ))}
          {error && <div className="pa-error"><AlertTriangle size={15} /> {error}</div>}
        </main>

        <footer className="pa-input">
          <div className="pa-input-wrap">
            {attachment && (
              <div className="pa-attach">
                <span className="pa-attach-ic">{attachment.kind === "pdf" ? <FileText size={14} /> : <ImageIcon size={14} />}</span>
                <span className="pa-attach-name">{attachment.name}</span>
                <button className="pa-attach-x" onClick={() => setAttachment(null)} title="Fjern"><X size={14} /></button>
              </div>
            )}
            <div className="pa-input-row">
              <button className="pa-attachbtn" onClick={() => fileRef.current?.click()} title="Vedhæft PDF eller billede"><Paperclip size={18} /></button>
              <textarea
                rows={1} value={input}
                placeholder={isListening ? "Lytter…" : "Skriv eller tal til Procudan AI…"}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              />
              <button className={`pa-mic ${isListening ? "live" : ""}`} onClick={toggleListen} disabled={!speechSupported}
                title={speechSupported ? "Tryk for at tale" : "Stemme understøttes ikke i denne browser"}>
                <Mic size={18} />{isListening && <span className="pa-ring" />}
              </button>
              <button className="pa-send" onClick={() => send()} disabled={(!input.trim() && !attachment) || isLoading}><Send size={17} /></button>
            </div>
          </div>
          <input ref={fileRef} type="file" accept=".pdf,image/*" onChange={onFile} style={{ display: "none" }} />
          <div className="pa-hint">Procudan AI kan tage fejl. Bekræft kritiske trin med den produktionsansvarlige.</div>
        </footer>
      </div>

      {showSop && <SopPanel sops={sops} setSops={setSops} onClose={() => setShowSop(false)} />}
      {showInfo && <InfoPanel onClose={() => setShowInfo(false)} />}
      {showSkills && <SkillsPanel skillsOn={skillsOn} setSkillsOn={setSkillsOn} onClose={() => setShowSkills(false)} />}
    </div>
  );
}

function SopPanel({ sops, setSops, onClose }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const add = () => {
    if (!title.trim() || !body.trim()) return;
    setSops([...sops, { id: Date.now(), title: title.trim(), content: body.trim() }]);
    setTitle(""); setBody("");
  };
  return (
    <div className="pa-modal-bg" onClick={onClose}>
      <div className="pa-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pa-modal-head">
          <div><b>SOP-dokumenter</b><span>Bruges som autoritativ kilde frem for generel viden</span></div>
          <button className="pa-x" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="pa-modal-body">
          {sops.length === 0 && <p className="pa-modal-empty">Ingen dokumenter endnu. Indsæt en arbejdsinstruktion, så følger assistenten den præcist.</p>}
          {sops.map((d) => (
            <div key={d.id} className="pa-sop">
              <span className="pa-sop-ic"><FileText size={15} /></span>
              <div className="pa-sop-meta"><b>{d.title}</b><span>{d.content.length} tegn</span></div>
              <button className="pa-x sm" onClick={() => setSops(sops.filter((x) => x.id !== d.id))}><Trash2 size={14} /></button>
            </div>
          ))}
          <div className="pa-sop-form">
            <input placeholder="Titel — fx “SOP-014 Blanding af vitaminpulver”" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea rows={5} placeholder="Indsæt selve instruktionen / SOP-teksten her…" value={body} onChange={(e) => setBody(e.target.value)} />
            <button className="pa-add" onClick={add} disabled={!title.trim() || !body.trim()}><Plus size={16} /> Tilføj dokument</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoPanel({ onClose }) {
  const tilbyder = [
    "Single point sourcing & global sourcing",
    "Projektledelse & produktudvikling",
    "Blandinger (blends) & ompakning",
    "Online QA-dokumentation",
    "Logistik- & lagerløsning",
    "Risikostyring & forsyningssikkerhed",
    "IT-integration & market intelligence",
  ];
  const omraader = [
    "Fødevareingredienser & enkeltingredienser",
    "Fødevareemballage & skræddersyet emballage",
    "Ostevoks",
    "Pharma & nutrition",
  ];
  const facts = [
    ["CVR", "28293860"],
    ["Stiftet", "2004"],
    ["Selskabsform", "Aktieselskab (A/S)"],
    ["Medarbejdere", "ca. 50"],
    ["Adm. direktør", "Tommy Højtoft Pedersen"],
    ["Adresse", "Bronzevej 1, 6000 Kolding"],
    ["Telefon", "75 50 80 00"],
    ["Web", "procudan.dk"],
  ];
  const label = { padding: "0 0 8px" };
  const li = { fontSize: "13.5px", lineHeight: 1.5 };
  return (
    <div className="pa-modal-bg" onClick={onClose}>
      <div className="pa-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pa-modal-head">
          <div><b>Om Procudan</b><span>Adding value to your supply chain</span></div>
          <button className="pa-x" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="pa-modal-body">
          <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.62, color: "var(--text2)" }}>
            Procudan A/S er en dansk sourcing- og handelsvirksomhed med base i Kolding. Vi er specialister i <b>single point sourcing</b> — ét samlet kontaktpunkt for indkøb af fødevareingredienser, emballage og skræddersyede løsninger til fødevare-, nutrition- og pharmaindustrien. Vi skaber værdi i hele forsyningskæden gennem global sourcing, lokal tilstedeværelse og tæt partnerskab.
          </p>
          <div>
            <div className="pa-label" style={label}>Det tilbyder vi</div>
            <ul className="md-ul" style={{ paddingLeft: "18px" }}>{tilbyder.map((x) => <li key={x} style={li}>{x}</li>)}</ul>
          </div>
          <div>
            <div className="pa-label" style={label}>Produktområder</div>
            <ul className="md-ul" style={{ paddingLeft: "18px" }}>{omraader.map((x) => <li key={x} style={li}>{x}</li>)}</ul>
          </div>
          <div>
            <div className="pa-label" style={label}>Fakta & kontakt</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {facts.map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: "12px", fontSize: "13.5px", borderBottom: "1px solid var(--border)", paddingBottom: "6px" }}>
                  <span style={{ color: "var(--muted)" }}>{k}</span>
                  <span style={{ fontWeight: 500, textAlign: "right" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <a href="https://procudan.dk" target="_blank" rel="noreferrer" className="pa-add" style={{ textDecoration: "none", marginTop: "4px" }}>
            <ExternalLink size={16} /> Besøg procudan.dk
          </a>
        </div>
      </div>
    </div>
  );
}

function SkillsPanel({ skillsOn, setSkillsOn, onClose }) {
  const toggle = (id) => setSkillsOn({ ...skillsOn, [id]: !skillsOn[id] });
  return (
    <div className="pa-modal-bg" onClick={onClose}>
      <div className="pa-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pa-modal-head">
          <div><b>Skills</b><span>Slå ekstra evner til og fra for assistenten</span></div>
          <button className="pa-x" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="pa-modal-body">
          {SKILLS.map((k) => {
            const Icon = k.icon; const on = !!skillsOn[k.id];
            return (
              <button key={k.id} className="pa-sop" style={{ textAlign: "left", width: "100%", cursor: "pointer" }} onClick={() => toggle(k.id)}>
                <span className="pa-sop-ic" style={on ? { background: "var(--accent)", color: "#fff" } : {}}><Icon size={15} /></span>
                <div className="pa-sop-meta">
                  <b>{k.label}</b>
                  <span style={{ fontFamily: "'Inter', sans-serif", color: "var(--muted)", fontSize: "12px", whiteSpace: "normal" }}>{k.desc}</span>
                </div>
                <span className={`pa-toggle ${on ? "on" : ""}`}><i /></span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
