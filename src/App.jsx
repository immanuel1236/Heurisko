import React, { useState } from "react";
import { Search, MapPin, Video, ArrowRight, Users, Building2, SlidersHorizontal, X, ChevronRight, ArrowLeft, Mail, Clock, GraduationCap, Globe2, Building, MessageSquare, Check, Upload, ShieldCheck, Share2, Copy, MessageCircle, Phone, Calendar, Bell, FileText, Link2, Download, ChevronLeft, Plus, Trash2 } from "lucide-react";
import { supabase } from "./supabaseClient";

const c = {
  ink: "#0E1A2B",
  navy: "#16273F",
  navyHover: "#25405F",
  navyTint: "#E7ECF2",
  gold: "#C9A461",
  goldTint: "#E4D3A8",
  sage: "#6E8F73",
  cream: "#FAF7F1",
  paper: "#FFFFFF",
  gray600: "#6B6459",
  gray300: "#D9D3C7",
  red: "#B3402F",
};

const fonts = {
  display: "'Fraunces', serif",
  body: "'Inter', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

function Seal({ size = 16, showLabel = false }) {
  const s = size;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <svg width={s} height={s} viewBox="0 0 32 32" style={{ flexShrink: 0 }}>
        <circle cx="16" cy="16" r="15" fill={c.navy} />
        <path d="M9.5 16.5l4.2 4.2 8.8-9.4" fill="none" stroke={c.gold} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {showLabel && (
        <span style={{ fontFamily: fonts.body, fontSize: 12, fontWeight: 600, color: c.navy }}>
          Verified
        </span>
      )}
    </span>
  );
}

function Chip({ active, children, onClick }) {
  return (
    <button
      className="h-chip-anim"
      onClick={onClick}
      style={{
        fontFamily: fonts.body,
        fontSize: 13,
        fontWeight: 500,
        padding: "7px 14px",
        borderRadius: 999,
        border: `1px solid ${active ? c.navy : c.gray300}`,
        background: active ? c.navyTint : c.paper,
        color: active ? c.navy : c.gray600,
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

function Button({ variant = "primary", children, onClick, style: extra = {}, className = "" }) {
  const base = {
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: 600,
    padding: "11px 20px",
    borderRadius: 8,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    border: "none",
  };
  const variants = {
    primary: { background: c.navy, color: c.paper },
    secondary: { background: c.paper, color: c.navy, border: `1px solid ${c.navy}` },
    ghost: { background: "transparent", color: c.navy },
  };
  return (
    <button className={`h-btn-anim ${className}`} style={{ ...base, ...variants[variant], ...extra }} onClick={onClick}>
      {children}
    </button>
  );
}

const CATEGORIES = ["Anxiety", "Depression", "Stress", "Trauma", "Couples counselling", "Child & adolescent", "Grief", "Addiction"];

// Real data only from here on, for public testing — no fictional seed profiles.
// The directory and external-listings pool both start empty and are populated
// entirely by real sign-ups/registrations/claims, persisted to shared storage
// (see the storage load/save wiring in the root component below).

const CONFIDENCE_META = {
  high: { label: "High confidence", fg: c.sage, bg: "#EEF3EF" },
  moderate: { label: "Moderate confidence", fg: "#8A6416", bg: "#FBF3E4" },
  low: { label: "Low confidence", fg: c.red, bg: "#FBEEEC" },
};

function modeLabel(modes) {
  if (!modes || modes.length === 0) return "Mode not listed";
  if (modes.includes("online") && modes.includes("in_person")) return "Online & in-person";
  if (modes.includes("online")) return "Online";
  return "In-person";
}

const DETAILS = {
  "Dr. Amara Osei": {
    qualifications: "MBBS, MD Psychiatry",
    university: "University of Ghana Medical School",
    registration: "DHA Licensed Psychiatrist",
    licenceNumber: "DHA-PSY-004821",
    licensingAuthority: "Dubai Health Authority",
    licenceValidity: "Mar 2027",
    yearsExperience: "12",
    specialities: "Mood disorders, medication management, adult ADHD",
    conditions: "Depression, anxiety, bipolar disorder, ADHD",
    approaches: "Integrated psychiatric care, CBT-informed",
    ageGroups: "Young adults, Adults, Older adults",
    consultationModes: "In-person, Online",
    workingHours: "Mon–Fri, 9am–5pm",
    insurance: "Daman, AXA, Cigna",
    accessibility: "Ground-floor clinic access",
    approachToCare: "I see psychiatric care as one part of a fuller picture — medication where it helps, always alongside a conversation about what's actually going on in someone's life.",
    firstConsultation: "A first session runs about 50 minutes: history, current concerns, and a shared plan for what comes next — no assumption that medication is the answer before we've talked.",
    values: "Transparency about what a diagnosis does and doesn't mean, and never rushing a first prescription.",
  },
  "Better Help Clinic": {
    yearEstablished: "2014",
    services: "Individual therapy, psychiatry, group programmes, workplace mental health",
    departments: "Adult Psychiatry, Child & Adolescent, Addiction Services",
    ageGroups: "Children, Adolescents, Adults, Families",
    languages: "English, Arabic, Hindi, Tagalog",
    careType: "Outpatient",
    telehealth: "Yes",
    emergency: "No — refers to emergency services",
    insurance: "Most major UAE insurers accepted",
    branches: [
      { name: "Al Barsha Branch", address: "Al Barsha 1, Dubai", hours: "Sun–Thu, 9am–7pm" },
      { name: "Ajman Branch", address: "Al Nuaimiya, Ajman", hours: "Sat–Thu, 9am–6pm" },
    ],
    team: ["Dr. Amara Osei — Psychiatrist", "Dr. Leila Haddad — Clinical Psychologist", "James Whitfield — Counsellor"],
  },
};

const EMERGENCY_CONTACTS = [
  { label: "UAE Police — Emergency", number: "999", tel: "999", note: "Immediate danger to yourself or someone else", urgent: true },
  { label: "UAE Ambulance", number: "998", tel: "998", note: "Medical emergency", urgent: true },
  { label: "National Mental Support Line (800-HOPE)", number: "800 4673", tel: "8004673", note: "Daily, 8am–8pm · call or WhatsApp the same number" },
  { label: "SAKINA — Abu Dhabi mental health support", number: "800 725 462", tel: "800725462", note: "24/7, Department of Health Abu Dhabi" },
  { label: "Istijaba Mental Health Support", number: "800 1717", tel: "8001717", note: "Abu Dhabi, staffed by trained professionals" },
];

// Shared a11y hook: closes on Escape and restores focus to whatever triggered the modal.
function useModalA11y(onClose) {
  const triggerRef = React.useRef(typeof document !== "undefined" ? document.activeElement : null);
  React.useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      if (triggerRef.current && triggerRef.current.focus) triggerRef.current.focus();
    };
  }, [onClose]);
}

const CHATBOT_NAV_LABELS = {
  home: "Home", search: "Search", resources: "Resources", about: "About",
  contact: "Contact", register: "Join as a professional", dashboard: "Dashboard",
};

// Zero-cost by design: no API call, no key, nothing billed per message. This is
// a deliberate downgrade from the AI-powered version in the Claude-hosted
// artifact (which was free there because the platform proxies that call) —
// once this runs on your own Anthropic key outside Claude, every message has
// a real cost, so it's rule-based here until you choose to turn that back on.
// See README.md "Turning the chatbot back into a real AI assistant" for how.
//
// Crisis phrases are checked FIRST, before any topic matching below, and their
// response only ever points to the Emergency support button — this bot must
// never attempt anything resembling clinical or crisis guidance.
const CRISIS_PATTERNS = [
  "suicide", "kill myself", "end my life", "want to die", "self harm", "self-harm",
  "hurt myself", "hurting myself", "crisis", "can't go on", "cant go on",
];

const CHAT_TOPICS = [
  {
    keywords: ["search", "find a", "find someone", "looking for", "filter"],
    response: "Use the search bar on the homepage — type what you're looking for and a location, then use the filters (Concern, Consultation mode, Profile Source, Verified-only) on the results page to narrow it down.",
    nav: "search",
  },
  {
    keywords: ["register", "join", "sign up as a professional", "become a professional", "list my practice", "add my profile"],
    response: "Click \"Join as a professional\" in the top nav — you'll sign up first, then go through a 5-step wizard (account type, basic info, credentials, services, review). It shows as \"Pending\" in search right away; an admin has to approve it before you get the Verified badge.",
    nav: "register",
  },
  {
    keywords: ["verify", "verified", "verification", "badge", "seal", "tick"],
    response: "The gold tick-in-circle seal means an administrator has reviewed and approved that profile — not just an automated check. \"Pending\" (clock icon) means it's registered but still awaiting that review.",
    nav: null,
  },
  {
    keywords: ["claim", "this is me", "unclaimed", "public listing"],
    response: "If you find a profile that's unclaimed or listed as a \"Public Listing,\" open it and use the \"Claim this profile\" button — it starts an identity-confirmation flow similar to registering fresh.",
    nav: null,
  },
  {
    keywords: ["resource", "breathing", "grounding", "anxiety", "stress", "glossary", "article", "exercise"],
    response: "The Resources page has breathing exercises, grounding techniques, quick tips, a plain-language glossary, and articles from real registered professionals — no account needed.",
    nav: "resources",
  },
  {
    keywords: ["delete my profile", "remove my profile", "delete account"],
    response: "Go to your Dashboard → Overview — there's a \"Delete my profile\" option there with a confirmation step.",
    nav: "dashboard",
  },
  {
    keywords: ["dashboard", "my profile", "my enquiries", "my calendar"],
    response: "Your Dashboard (once logged in) has your profile status, calendar, enquiries, published articles, and a shareable profile card.",
    nav: "dashboard",
  },
  {
    keywords: ["about", "vision", "mission", "who are you", "who made this"],
    response: "The About page has our vision, mission, and goals for Heurisko, plus where things stand right now.",
    nav: "about",
  },
  {
    keywords: ["contact", "support", "email", "phone number", "reach you"],
    response: "The Contact page has enquiry categories and a contact form — note the details there are still placeholders while we finalize them.",
    nav: "contact",
  },
];

function matchChatTopic(text) {
  const lower = text.toLowerCase();
  for (const topic of CHAT_TOPICS) {
    if (topic.keywords.some((k) => lower.includes(k))) return topic;
  }
  return null;
}

function ChatbotWidget({ onNavigate }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I can help you find your way around Heurisko — try asking about searching, registering, verification, claiming a profile, or resources." },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = React.useRef(null);
  useModalA11y(() => setOpen(false));

  React.useEffect(() => {
    if (open && scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");

    const lower = text.toLowerCase();
    if (CRISIS_PATTERNS.some((p) => lower.includes(p))) {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "I'm not able to help with that here, but please don't wait — use the Emergency support button in the bottom-right corner of the screen right now. It has real crisis line numbers you can call directly.",
      }]);
      return;
    }

    const topic = matchChatTopic(lower);
    if (topic) {
      setMessages((prev) => [...prev, { role: "assistant", content: topic.response, nav: topic.nav }]);
    } else {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "I can help with searching, registering, verification, claiming a profile, resources, your dashboard, or contact info — try asking about one of those.",
      }]);
    }
  };


  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close help chat" : "Open help chat"}
        className="h-btn-anim"
        style={{
          position: "fixed", bottom: 20, left: 20, zIndex: 40,
          display: "flex", alignItems: "center", gap: 8,
          background: c.paper, color: c.navy, border: `1px solid ${c.gray300}`, borderRadius: 999,
          padding: "12px 18px", fontFamily: fonts.body, fontSize: 13, fontWeight: 600, cursor: "pointer",
          boxShadow: "0 4px 16px rgba(14,26,43,0.12)",
        }}
      >
        <MessageCircle size={15} /> {open ? "Close" : "Help"}
      </button>

      {open && (
        <div
          role="dialog" aria-modal="true" aria-label="Heurisko help chat" className="h-pop"
          style={{ position: "fixed", bottom: 74, left: 20, zIndex: 41, width: 340, maxWidth: "88vw", height: 440, maxHeight: "70vh", background: c.paper, border: `1px solid ${c.gray300}`, borderRadius: 16, display: "flex", flexDirection: "column", boxShadow: "0 10px 36px rgba(14,26,43,0.22)", overflow: "hidden" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${c.gray300}`, background: c.navy }}>
            <p style={{ fontFamily: fonts.display, fontWeight: 600, fontSize: 14.5, color: c.paper }}>Heurisko guide</p>
            <button onClick={() => setOpen(false)} aria-label="Close chat" style={{ background: "none", border: "none", cursor: "pointer", color: c.paper }}>
              <X size={16} />
            </button>
          </div>

          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "85%", background: m.role === "user" ? c.navy : c.cream, color: m.role === "user" ? c.paper : c.ink, borderRadius: 12, padding: "8px 12px", fontSize: 13, lineHeight: 1.55 }}>
                  {m.content}
                </div>
                {m.nav && (
                  <button
                    onClick={() => { onNavigate(m.nav); setOpen(false); }}
                    className="h-btn-anim"
                    style={{ marginTop: 6, fontSize: 11.5, fontWeight: 600, color: c.navy, background: c.navyTint, border: "none", borderRadius: 999, padding: "5px 10px", cursor: "pointer" }}
                  >
                    Go to {CHATBOT_NAV_LABELS[m.nav] || m.nav} <ChevronRight size={11} style={{ display: "inline", verticalAlign: "middle" }} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, padding: 12, borderTop: `1px solid ${c.gray300}` }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") send(); }}
              placeholder="Ask about using Heurisko…"
              aria-label="Message"
              style={{ flex: 1, border: `1px solid ${c.gray300}`, borderRadius: 8, padding: "8px 10px", fontFamily: fonts.body, fontSize: 13 }}
            />
            <Button variant="primary" style={{ padding: "8px 14px", fontSize: 12.5 }} onClick={send}>Send</Button>
          </div>
        </div>
      )}
    </>
  );
}

function EmergencyModal({ onClose }) {
  useModalA11y(onClose);
  return (
    <div onClick={onClose} className="h-fade-in-fast" style={{ position: "fixed", inset: 0, background: "rgba(14,26,43,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: 20 }}>
      <div className="h-pop" role="dialog" aria-modal="true" aria-labelledby="emergency-modal-title" onClick={(e) => e.stopPropagation()} style={{ background: c.paper, borderRadius: 16, padding: 24, width: 440, maxWidth: "100%", maxHeight: "85vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <h3 id="emergency-modal-title" style={{ fontFamily: fonts.display, fontSize: 19, fontWeight: 600, color: c.ink }}>Emergency support</h3>
          <button onClick={onClose} aria-label="Close emergency support dialog" style={{ background: "none", border: "none", cursor: "pointer", color: c.gray600 }}>
            <X size={18} />
          </button>
        </div>
        <p style={{ fontSize: 12.5, color: c.gray600, marginBottom: 18, lineHeight: 1.6 }}>
          Heurisko is a directory, not an emergency service. If you or someone else is in immediate danger, use one of these — tapping a number calls it directly.
        </p>

        {EMERGENCY_CONTACTS.map((ct, i) => (
          <a
            key={i}
            href={`tel:${ct.tel}`}
            aria-label={`Call ${ct.label}, ${ct.number}`}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
              textDecoration: "none", padding: "12px 14px", borderRadius: 10, marginBottom: 8,
              border: `1px solid ${ct.urgent ? c.red : c.gray300}`,
              background: ct.urgent ? "#FBEEEC" : c.cream,
            }}
          >
            <div>
              <p style={{ fontSize: 13.5, fontWeight: 600, color: c.ink }}>{ct.label}</p>
              <p style={{ fontSize: 11.5, color: c.gray600, marginTop: 2 }}>{ct.note}</p>
            </div>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: fonts.mono, fontSize: 14, fontWeight: 600, color: ct.urgent ? c.red : c.navy, flexShrink: 0 }}>
              <Phone size={14} aria-hidden="true" /> {ct.number}
            </span>
          </a>
        ))}

        <a
          href="https://findahelpline.com"
          target="_blank"
          rel="noreferrer"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, textDecoration: "none", padding: "12px 14px", borderRadius: 10, border: `1px solid ${c.gray300}`, background: c.paper }}
        >
          <div>
            <p style={{ fontSize: 13.5, fontWeight: 600, color: c.ink }}>Outside the UAE</p>
            <p style={{ fontSize: 11.5, color: c.gray600, marginTop: 2 }}>Find A Helpline — chat and call options by country</p>
          </div>
          <ChevronRight size={16} color={c.gray600} aria-hidden="true" />
        </a>

        <p style={{ fontSize: 11, color: c.gray600, marginTop: 14, lineHeight: 1.6 }}>
          Numbers shown reflect UAE public sources as of 2026 and are provided for this prototype — verify current numbers before launch, as helplines occasionally change.
        </p>
      </div>
    </div>
  );
}

function getDetail(r) {
  return DETAILS[r.name] || {
    qualifications: "On file, pending public display",
    university: "—",
    registration: r.status === "verified" ? "Registered professional" : r.status === "pending" ? "Registration submitted, under review" : "Registration pending review",
    licenceNumber: r.status === "verified" ? "Available on request" : "—",
    licensingAuthority: "Local health authority",
    licenceValidity: "—",
    yearsExperience: r.exp?.replace(/[^0-9]/g, "") || "—",
    specialities: r.title,
    conditions: "See speciality above",
    approaches: "Not yet published",
    ageGroups: "Adults",
    consultationModes: modeLabel(r.modes),
    workingHours: "By appointment",
    insurance: "Contact for details",
    accessibility: "Contact for details",
    approachToCare: "This professional hasn't published a full statement yet.",
    firstConsultation: "Contact the professional directly to ask what a first session involves.",
    values: "—",
  };
}

function StatusMark({ status, size = 14 }) {
  if (status === "verified") return <span className="h-pop"><Seal size={size} /></span>;
  if (status === "pending")
    return (
      <span className="h-pulse" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
        <Clock size={size - 1} color={c.gray600} />
        <span style={{ fontFamily: fonts.body, fontSize: 11.5, fontWeight: 600, color: c.gray600 }}>Pending</span>
      </span>
    );
  return null;
}

function statusBanner(status, isInstitution) {
  if (status === "verified") {
    return { bg: c.goldTint, border: c.gold, text: "#5C4A21" };
  }
  if (status === "pending") {
    return { bg: c.navyTint, border: c.gray300, text: c.ink };
  }
  return { bg: c.navyTint, border: c.gray300, text: c.ink };
}

const STORAGE_KEYS = {
  directory: "heurisko:directory",
  external: "heurisko:external-listings",
  adminQueue: "heurisko:admin-queue",
  auditTrail: "heurisko:audit-trail",
  discoveryQueue: "heurisko:discovery-queue",
  articles: "heurisko:published-articles",
  accounts: "heurisko:accounts", // email -> real name, so returning "log in" shows the right name
};

async function loadShared(key, fallback) {
  try {
    const { data, error } = await supabase.from("kv_store").select("value").eq("key", key).maybeSingle();
    if (error || !data) return fallback;
    return data.value ?? fallback;
  } catch (e) {
    return fallback;
  }
}

async function saveShared(key, value) {
  try {
    // jsonb column — supabase-js serializes the JS value itself, no manual
    // JSON.stringify/parse needed the way window.storage's string API required.
    const { error } = await supabase.from("kv_store").upsert({ key, value, updated_at: new Date().toISOString() });
    if (error) console.error("Heurisko: storage save failed for", key, error);
  } catch (e) {
    console.error("Heurisko: storage save failed for", key, e);
  }
}

export default function Heurisko() {
  const [view, setView] = useState("home");
  const [activeCats, setActiveCats] = useState([]);
  const [searchQuery, setSearchQuery] = useState({ keyword: "", location: "", mode: "Both" });
  const [selected, setSelected] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authIntent, setAuthIntent] = useState(null); // 'register' | 'claim' | null
  const [account, setAccount] = useState(null); // { name, email, role }
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [isAdminAuthed, setIsAdminAuthed] = useState(false);

  // Shared, persisted state — real data, visible to everyone who opens this link.
  const [directory, setDirectoryRaw] = useState([]);
  const [externalListings, setExternalListingsRaw] = useState([]);
  const [adminQueue, setAdminQueueRaw] = useState([]);
  const [auditTrail, setAuditTrailRaw] = useState([]);
  const [discoveryQueue, setDiscoveryQueueRaw] = useState([]);
  const [publishedArticles, setPublishedArticlesRaw] = useState([]);
  const [accountsDirectory, setAccountsDirectoryRaw] = useState({}); // email -> real name
  const [dataLoaded, setDataLoaded] = useState(false);
  const [storageWarning, setStorageWarning] = useState(false);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [dir, ext, aq, at, dq, arts, accts] = await Promise.all([
          loadShared(STORAGE_KEYS.directory, []),
          loadShared(STORAGE_KEYS.external, []),
          loadShared(STORAGE_KEYS.adminQueue, []),
          loadShared(STORAGE_KEYS.auditTrail, []),
          loadShared(STORAGE_KEYS.discoveryQueue, []),
          loadShared(STORAGE_KEYS.articles, []),
          loadShared(STORAGE_KEYS.accounts, {}),
        ]);
        if (cancelled) return;
        setDirectoryRaw(dir);
        setExternalListingsRaw(ext);
        setAdminQueueRaw(aq);
        setAuditTrailRaw(at);
        setDiscoveryQueueRaw(dq);
        setPublishedArticlesRaw(arts);
        setAccountsDirectoryRaw(accts);
      } catch (e) {
        if (!cancelled) setStorageWarning(true);
      } finally {
        if (!cancelled) setDataLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Realtime sync — genuinely live, not "reload to see what changed": any tester's
  // write shows up for everyone else within the subscription's latency. Falls back
  // gracefully to per-load fetches (above) if realtime is unavailable or disabled.
  React.useEffect(() => {
    const setterFor = {
      [STORAGE_KEYS.directory]: (v) => setDirectoryRaw(v ?? []),
      [STORAGE_KEYS.external]: (v) => setExternalListingsRaw(v ?? []),
      [STORAGE_KEYS.adminQueue]: (v) => setAdminQueueRaw(v ?? []),
      [STORAGE_KEYS.auditTrail]: (v) => setAuditTrailRaw(v ?? []),
      [STORAGE_KEYS.discoveryQueue]: (v) => setDiscoveryQueueRaw(v ?? []),
      [STORAGE_KEYS.articles]: (v) => setPublishedArticlesRaw(v ?? []),
      [STORAGE_KEYS.accounts]: (v) => setAccountsDirectoryRaw(v ?? {}),
    };
    const channel = supabase
      .channel("heurisko-kv-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "kv_store" }, (payload) => {
        const row = payload.new && Object.keys(payload.new).length ? payload.new : payload.old;
        if (!row || !setterFor[row.key]) return;
        setterFor[row.key](payload.eventType === "DELETE" ? undefined : payload.new.value);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // Persisting setters — same calling convention as useState's setter, but also
  // write through to shared storage so every tester sees the same live data.
  const setDirectory = (updater) => setDirectoryRaw((prev) => { const next = typeof updater === "function" ? updater(prev) : updater; saveShared(STORAGE_KEYS.directory, next); return next; });
  const setExternalListings = (updater) => setExternalListingsRaw((prev) => { const next = typeof updater === "function" ? updater(prev) : updater; saveShared(STORAGE_KEYS.external, next); return next; });
  const setAdminQueue = (updater) => setAdminQueueRaw((prev) => { const next = typeof updater === "function" ? updater(prev) : updater; saveShared(STORAGE_KEYS.adminQueue, next); return next; });
  const setAuditTrail = (updater) => setAuditTrailRaw((prev) => { const next = typeof updater === "function" ? updater(prev) : updater; saveShared(STORAGE_KEYS.auditTrail, next); return next; });
  const setDiscoveryQueue = (updater) => setDiscoveryQueueRaw((prev) => { const next = typeof updater === "function" ? updater(prev) : updater; saveShared(STORAGE_KEYS.discoveryQueue, next); return next; });
  const setPublishedArticles = (updater) => setPublishedArticlesRaw((prev) => { const next = typeof updater === "function" ? updater(prev) : updater; saveShared(STORAGE_KEYS.articles, next); return next; });
  const setAccountsDirectory = (updater) => setAccountsDirectoryRaw((prev) => { const next = typeof updater === "function" ? updater(prev) : updater; saveShared(STORAGE_KEYS.accounts, next); return next; });

  const submitForReview = (entry) => {
    const id = Date.now() + Math.random();
    setAdminQueue((prev) => [{ id, ...entry }, ...prev]);
    if (entry.directoryEntry) {
      setDirectory((prev) => [...prev, { ...entry.directoryEntry, id, _queueId: id, _ownerEmail: account?.email || null, hidden: false, flaggedForReview: false }]);
    }
  };

  // Claiming an unclaimed or externally-listed profile: creates/updates a real
  // pending directory entry and puts it into the same admin review queue as a
  // fresh registration — claiming never grants Verified on its own.
  const submitClaim = (r) => {
    const id = Date.now() + Math.random();
    if (r.status === "external") {
      setExternalListings((prev) => prev.filter((e) => e !== r));
      setDirectory((prev) => [...prev, { type: r.type, name: r.name, title: r.title, status: "pending", location: r.location, languages: r.languages, exp: r.exp, fee: r.fee, initials: r.initials, modes: r.modes || [], concerns: r.concerns || [], id, _queueId: id, _ownerEmail: account?.email || null, hidden: false, flaggedForReview: false }]);
    } else {
      // Matched by stable id, not name — two entries can legitimately share a
      // display name, and name-matching would silently update the wrong one.
      setDirectory((prev) => prev.map((d) => (d.id === r.id ? { ...d, status: "pending", _queueId: id, _ownerEmail: account?.email || d._ownerEmail } : d)));
    }
    setAdminQueue((prev) => [{
      id, name: r.name, type: r.type, submittedDate: new Date().toISOString().slice(0, 10),
      autoScore: null, docScore: null, fields: [],
      flags: ["Profile claim — identity and documents pending admin review"],
      documentName: null, status: "needs_review",
    }, ...prev]);
  };

  // Self-service delete from the professional's own dashboard, and the same
  // path admin "Delete" uses — both go through id, never name matching.
  const deleteDirectoryEntry = (id) => {
    setDirectory((prev) => prev.filter((d) => d.id !== id));
  };

  const setDirectoryEntryVisibility = (id, hidden) => {
    setDirectory((prev) => prev.map((d) => (d.id === id ? { ...d, hidden } : d)));
  };

  const toggleDirectoryEntryFlag = (id) => {
    setDirectory((prev) => prev.map((d) => (d.id === id ? { ...d, flaggedForReview: !d.flaggedForReview } : d)));
  };

  const toggleCat = (cat) =>
    setActiveCats((prev) => (prev.includes(cat) ? prev.filter((x) => x !== cat) : [...prev, cat]));

  const goSearch = (query) => {
    setSearchQuery(query || { keyword: "", location: "", mode: "Both" });
    setView("search");
  };

  const openProfile = (r) => {
    setSelected(r);
    setView("profile");
  };

  const goRegister = () => {
    if (isLoggedIn) setView("register");
    else {
      setAuthIntent("register");
      setView("auth");
    }
  };

  const goClaim = () => {
    if (isLoggedIn) setView("claim");
    else {
      setAuthIntent("claim");
      setView("auth");
    }
  };

  // Routes the chatbot's suggested destination through the same auth-aware logic
  // as the real nav — a bare setView("dashboard") would show a broken empty
  // dashboard to someone who isn't logged in yet.
  const handleChatNav = (tag) => {
    if (tag === "register") { goRegister(); return; }
    if (tag === "dashboard") {
      if (isLoggedIn) setView("dashboard");
      else { setAuthIntent(null); setView("auth"); }
      return;
    }
    setView(tag);
  };

  const handleAuthenticated = (acct) => {
    setIsLoggedIn(true);
    // If this email has signed up before, use the real name on file instead of
    // whatever guess the login form derived from the email prefix — otherwise a
    // returning "Log in" quietly renames a person on their own dashboard.
    const resolvedName = accountsDirectory[acct.email] || acct.name;
    const finalAcct = { role: "professional", ...acct, name: resolvedName };
    setAccount(finalAcct);
    setAccountsDirectory((prev) => ({ ...prev, [acct.email]: resolvedName }));
    if (authIntent === "register") setView("register");
    else if (authIntent === "claim") setView("claim");
    else setView("home");
    setAuthIntent(null);
  };

  const logOut = () => {
    setIsLoggedIn(false);
    setAccount(null);
    setView("home");
  };

  return (
    <div style={{ background: c.cream, minHeight: "100%", fontFamily: fonts.body, position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;800&family=JetBrains+Mono:wght@400;500&display=swap');

        @keyframes h-fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes h-fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes h-popIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
        @keyframes h-shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
        @keyframes h-pulseSoft { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes h-spin { to { transform: rotate(360deg); } }

        .h-fade-in { animation: h-fadeInUp 0.36s ease both; }
        .h-fade-in-fast { animation: h-fadeIn 0.18s ease both; }
        .h-pop { animation: h-popIn 0.22s cubic-bezier(0.2, 0.8, 0.3, 1) both; }
        .h-skeleton { background: linear-gradient(90deg, #ECE7DC 25%, #F5F2EA 37%, #ECE7DC 63%); background-size: 400px 100%; animation: h-shimmer 1.3s ease infinite; border-radius: 8px; }
        .h-pulse { animation: h-pulseSoft 1.7s ease-in-out infinite; }
        .h-spin { animation: h-spin 0.8s linear infinite; }
        .h-card-hover { transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease; }
        .h-card-hover:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(14,26,43,0.10); }
        .h-btn-anim { transition: background 0.15s ease, transform 0.1s ease, opacity 0.15s ease; }
        .h-btn-anim:active { transform: scale(0.97); }
        .h-chip-anim { transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease; }
        .h-progress-fill { transition: width 0.3s ease; }

        @media (prefers-reduced-motion: reduce) {
          .h-fade-in, .h-fade-in-fast, .h-pop, .h-skeleton, .h-pulse, .h-spin { animation: none !important; }
          .h-card-hover, .h-btn-anim, .h-chip-anim, .h-progress-fill { transition: none !important; }
          .h-card-hover:hover { transform: none !important; }
        }

        /* Responsive layout utilities */
        .h-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
        .h-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .h-grid-3-tight { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .h-row-to-col { }
        .h-hero-title { font-size: 44px; }
        .h-nav-links { display: flex; gap: 24px; }
        .h-filter-sidebar { }

        @media (max-width: 860px) {
          .h-grid-3, .h-grid-3-tight { grid-template-columns: 1fr 1fr; }
          .h-row-to-col { flex-direction: column; }
          .h-filter-sidebar { width: 100% !important; position: static !important; }
          .h-steprail { width: 100% !important; display: flex !important; flex-wrap: wrap; gap: 4px; }
        }
        @media (max-width: 640px) {
          .h-grid-2, .h-grid-3, .h-grid-3-tight { grid-template-columns: 1fr; }
          .h-hero-title { font-size: 32px !important; }
          .h-nav-links { display: none !important; }
        }
      `}</style>

      {/* NAV */}
      <header style={{ background: c.paper, borderBottom: `1px solid ${c.gray300}` }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div
            onClick={() => setView("home")}
            style={{ fontFamily: fonts.display, fontSize: 22, fontWeight: 600, color: c.navy, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
          >
            <svg width="30" height="30" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" fill="#FFFFFF" stroke="#111111" strokeWidth="3" />
              <text x="50" y="66" textAnchor="middle" fontFamily={fonts.body} fontWeight="700" fontSize="52" fill="#111111">ε</text>
            </svg>
            Heurisko
          </div>
          <nav className="h-nav-links" style={{ gap: 24, fontSize: 14, color: c.gray600, fontWeight: 500, alignItems: "center" }}>
            <span style={{ cursor: "pointer" }} onClick={() => setView("about")}>About</span>
            <span style={{ cursor: "pointer" }} onClick={() => setView("resources")}>Resources</span>
            <span style={{ cursor: "pointer" }} onClick={() => setView("contact")}>Contact</span>
            {isLoggedIn && account?.role === "professional" && (
              <span style={{ cursor: "pointer", color: c.navy, fontWeight: 600 }} onClick={() => setView("dashboard")}>Dashboard</span>
            )}
            {isAdminAuthed && (
              <span style={{ cursor: "pointer", color: c.gold, fontWeight: 600 }} onClick={() => setView("admin")}>Admin queue</span>
            )}
          </nav>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <Button variant="secondary" style={{ padding: "9px 16px" }} onClick={goRegister}>Join as a professional</Button>
            {isLoggedIn ? (
              <>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: c.navyTint, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.display, fontWeight: 600, fontSize: 13, color: c.navy }}>
                  {(account?.name || "U").slice(0, 1).toUpperCase()}
                </div>
                <button onClick={logOut} style={{ background: "none", border: "none", color: c.gray600, fontSize: 13, cursor: "pointer" }}>Log out</button>
              </>
            ) : (
              <Button variant="primary" style={{ padding: "9px 16px" }} onClick={() => { setAuthIntent(null); setView("auth"); }}>Sign up / Log in</Button>
            )}
          </div>
        </div>
      </header>

      {!dataLoaded ? (
        <main style={{ maxWidth: 600, margin: "0 auto", padding: "120px 24px", textAlign: "center" }}>
          <span className="h-spin" style={{ display: "inline-block", width: 22, height: 22, border: `2px solid ${c.gray300}`, borderTopColor: c.navy, borderRadius: "50%" }} />
          <p style={{ fontSize: 13, color: c.gray600, marginTop: 14 }}>Loading shared directory…</p>
        </main>
      ) : view === "home" ? (
        <HomeView
          activeCats={activeCats}
          toggleCat={toggleCat}
          onSearch={goSearch}
          onResources={() => setView("resources")}
        />
      ) : view === "resources" ? (
        <ResourcesView publishedArticles={publishedArticles} />
      ) : view === "search" ? (
        <SearchView
          activeCats={activeCats}
          toggleCat={toggleCat}
          initialQuery={searchQuery}
          onBack={() => setView("home")}
          onOpenProfile={openProfile}
          directory={directory}
          externalListings={externalListings}
        />
      ) : view === "profile" ? (
        selected?.status === "external" ? (
          <ExternalProfileView r={selected} onBack={() => setView("search")} onClaim={goClaim} />
        ) : (
          <ProfileView r={selected} onBack={() => setView("search")} onClaim={goClaim} isLoggedIn={isLoggedIn} account={account} />
        )
      ) : view === "auth" ? (
        <AuthView
          intent={authIntent}
          claimTarget={selected}
          onAuthenticated={handleAuthenticated}
          onCancel={() => { setAuthIntent(null); setView("home"); }}
        />
      ) : view === "register" ? (
        <RegisterView onBack={() => setView("home")} onSubmitForReview={submitForReview} />
      ) : view === "dashboard" ? (
        <DashboardView
          account={account}
          onBack={() => setView("home")}
          publishedArticles={publishedArticles}
          setPublishedArticles={setPublishedArticles}
          directory={directory}
          onDeleteProfile={deleteDirectoryEntry}
        />
      ) : view === "about" ? (
        <AboutView />
      ) : view === "contact" ? (
        <ContactView isAdminAuthed={isAdminAuthed} onAdminAuthed={() => { setIsAdminAuthed(true); setView("admin"); }} />
      ) : view === "admin" ? (
        <AdminView
          queue={adminQueue}
          setQueue={setAdminQueue}
          auditTrail={auditTrail}
          setAuditTrail={setAuditTrail}
          directory={directory}
          setDirectory={setDirectory}
          onDeleteDirectoryEntry={deleteDirectoryEntry}
          onSetVisibility={setDirectoryEntryVisibility}
          onToggleFlag={toggleDirectoryEntryFlag}
          discoveryQueue={discoveryQueue}
          setDiscoveryQueue={setDiscoveryQueue}
          onExit={() => { setIsAdminAuthed(false); setView("home"); }}
        />
      ) : (
        <ClaimView r={selected} onBack={() => setView("profile")} onSubmitClaim={submitClaim} />
      )}

      {storageWarning && (
        <div style={{ position: "fixed", bottom: 74, right: 20, zIndex: 39, background: "#FBEEEC", border: `1px solid ${c.red}`, borderRadius: 8, padding: "8px 12px", fontSize: 11.5, color: c.red, maxWidth: 260 }}>
          Shared storage isn't available right now — changes in this session may not be saved for other testers.
        </div>
      )}

      {/* EMERGENCY SUPPORT — always accessible, on every view */}
      <button
        onClick={() => setEmergencyOpen(true)}
        aria-label="Open emergency support contacts"
        style={{
          position: "fixed", bottom: 20, right: 20, zIndex: 40,
          display: "flex", alignItems: "center", gap: 8,
          background: c.navy, color: c.paper, border: "none", borderRadius: 999,
          padding: "12px 18px", fontFamily: fonts.body, fontSize: 13, fontWeight: 600, cursor: "pointer",
          boxShadow: "0 4px 16px rgba(14,26,43,0.25)",
        }}
      >
        <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: "50%", background: c.red, flexShrink: 0 }} />
        Emergency support
      </button>
      {emergencyOpen && <EmergencyModal onClose={() => setEmergencyOpen(false)} />}
      <ChatbotWidget onNavigate={handleChatNav} />
    </div>
  );
}

function HomeView({ activeCats, toggleCat, onSearch, onResources }) {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [mode, setMode] = useState("Both");

  const cycleMode = () => setMode((m) => (m === "Both" ? "Online" : m === "Online" ? "In-person" : "Both"));
  const submitSearch = () => onSearch({ keyword, location, mode });

  return (
    <main style={{ maxWidth: 1120, margin: "0 auto", padding: "56px 24px 80px" }}>
      {/* HERO */}
      <section style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 40px" }}>
        <p style={{ fontFamily: fonts.body, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: c.gold, textTransform: "uppercase", marginBottom: 14 }}>
          Global mental health directory
        </p>
        <h1 className="h-hero-title" style={{ fontFamily: fonts.display, fontSize: 44, lineHeight: 1.15, color: c.ink, marginBottom: 16, fontWeight: 500 }}>
          Find the right mental<br />health support for you.
        </h1>
        <p style={{ fontSize: 16, color: c.gray600, lineHeight: 1.6 }}>
          Search verified professionals, institutions, and resources by speciality,
          language, location, and how you'd like to be seen.
        </p>
      </section>

      {/* SEARCH CARD */}
      <section
        style={{
          background: c.paper,
          border: `1px solid ${c.gray300}`,
          borderRadius: 16,
          padding: 20,
          boxShadow: "0 1px 2px rgba(14,26,43,0.04), 0 4px 12px rgba(14,26,43,0.06)",
          maxWidth: 760,
          margin: "0 auto 32px",
        }}
      >
        <form
          onSubmit={(e) => { e.preventDefault(); submitSearch(); }}
          style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
        >
          <div style={{ flex: "2 1 220px", display: "flex", alignItems: "center", gap: 8, border: `1px solid ${c.gray300}`, borderRadius: 8, padding: "11px 14px" }}>
            <Search size={16} color={c.gray600} />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="What help are you looking for?"
              aria-label="What help are you looking for?"
              style={{ border: "none", outline: "none", fontFamily: fonts.body, fontSize: 14, width: "100%", background: "transparent" }}
            />
          </div>
          <div style={{ flex: "1 1 160px", display: "flex", alignItems: "center", gap: 8, border: `1px solid ${c.gray300}`, borderRadius: 8, padding: "11px 14px" }}>
            <MapPin size={16} color={c.gray600} />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              aria-label="Location"
              style={{ border: "none", outline: "none", fontFamily: fonts.body, fontSize: 14, width: "100%", background: "transparent" }}
            />
          </div>
          <button
            type="button"
            onClick={cycleMode}
            className="h-chip-anim"
            style={{ flex: "1 1 150px", display: "flex", alignItems: "center", gap: 8, border: `1px solid ${c.gray300}`, borderRadius: 8, padding: "11px 14px", background: c.paper, cursor: "pointer" }}
          >
            <Video size={16} color={c.gray600} />
            <span style={{ fontSize: 14, color: c.ink, fontWeight: 500 }}>{mode === "Both" ? "Online or in-person" : mode}</span>
          </button>
          <Button variant="primary" onClick={submitSearch} style={{ flex: "0 0 auto" }}>
            Search <ArrowRight size={15} />
          </Button>
        </form>
      </section>

      {/* QUICK CATEGORIES */}
      <section style={{ marginBottom: 56 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {CATEGORIES.map((cat) => (
            <Chip key={cat} active={activeCats.includes(cat)} onClick={() => { toggleCat(cat); onSearch({ keyword: "", location: "", mode: "Both" }); }}>
              {cat}
            </Chip>
          ))}
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="h-grid-3" style={{ marginBottom: 56 }}>
        {[
          { icon: <Seal size={28} />, title: "Verified, not just claimed", body: "Every badge links to what was actually checked — licence number, authority, and expiry date." },
          { icon: <Users size={28} color={c.navy} />, title: "Built for how you search", body: "Filter by language, age group, consultation mode, and specific concerns, not just job title." },
          { icon: <Building2 size={28} color={c.navy} />, title: "Directory, not a diagnosis", body: "Heurisko helps you find and compare care. It's never a substitute for emergency or medical services." },
        ].map((item, i) => (
          <div key={i} style={{ background: c.paper, border: `1px solid ${c.gray300}`, borderRadius: 12, padding: 22 }}>
            <div style={{ marginBottom: 14 }}>{item.icon}</div>
            <h3 style={{ fontFamily: fonts.display, fontSize: 17, fontWeight: 600, color: c.ink, marginBottom: 8 }}>{item.title}</h3>
            <p style={{ fontSize: 13.5, color: c.gray600, lineHeight: 1.6 }}>{item.body}</p>
          </div>
        ))}
      </section>

      {/* FEATURED RESOURCES */}
      <section style={{ background: c.navy, borderRadius: 16, padding: "32px 36px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
        <div style={{ maxWidth: 420 }}>
          <p style={{ fontFamily: fonts.body, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: c.gold, textTransform: "uppercase", marginBottom: 10 }}>
            Featured resources
          </p>
          <h3 style={{ fontFamily: fonts.display, fontSize: 22, color: c.paper, marginBottom: 10, fontWeight: 500 }}>
            Not ready to talk to someone yet?
          </h3>
          <p style={{ fontSize: 14, color: "#C6CEDA", lineHeight: 1.6 }}>
            Self-help tools, guides reviewed by professionals, and crisis information — no account needed.
          </p>
        </div>
        <Button variant="secondary" style={{ background: "transparent", color: c.gold, border: `1px solid ${c.gold}` }} onClick={onResources}>
          Explore resources <ChevronRight size={15} />
        </Button>
      </section>
    </main>
  );
}

function SkeletonCard() {
  return (
    <div style={{ background: c.paper, border: `1px solid ${c.gray300}`, borderRadius: 12, padding: 18 }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <div className="h-skeleton" style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="h-skeleton" style={{ height: 14, width: "70%", marginBottom: 8 }} />
          <div className="h-skeleton" style={{ height: 11, width: "45%" }} />
        </div>
      </div>
      <div className="h-skeleton" style={{ height: 11, width: "90%", marginBottom: 14 }} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="h-skeleton" style={{ height: 12, width: 60 }} />
        <div className="h-skeleton" style={{ height: 28, width: 90, borderRadius: 8 }} />
      </div>
    </div>
  );
}

function SearchView({ activeCats, toggleCat, initialQuery, onBack, onOpenProfile, directory, externalListings }) {
  const [keyword, setKeyword] = useState(initialQuery?.keyword || "");
  const [location, setLocation] = useState(initialQuery?.location || "");
  const [modeFilter, setModeFilter] = useState(initialQuery?.mode || "Both");
  const [sourceFilter, setSourceFilter] = useState("All"); // default excludes external — opt-in only
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    setLoading(true);
    const id = setTimeout(() => setLoading(false), 320);
    return () => clearTimeout(id);
  }, [activeCats, sourceFilter, modeFilter, verifiedOnly, keyword, location]);

  // Public Listings only ever appear when explicitly selected — never mixed into
  // "All" — per the requirement that external/discovered profiles are opt-in.
  const pool = sourceFilter === "Public Listings" ? externalListings : directory;

  const kw = keyword.trim().toLowerCase();
  const loc = location.trim().toLowerCase();

  const shown = pool
    .filter((r) => !r.hidden)
    .filter((r) => (sourceFilter === "Heurisko Verified" ? r.status === "verified" : true))
    .filter((r) => (sourceFilter === "Registered" ? r.status === "pending" || r.status === "unclaimed" : true))
    .filter((r) => (verifiedOnly ? r.status === "verified" : true))
    .filter((r) => (modeFilter === "Both" ? true : (r.modes || []).includes(modeFilter === "Online" ? "online" : "in_person")))
    .filter((r) => (activeCats.length === 0 ? true : (r.concerns || []).some((con) => activeCats.includes(con))))
    .filter((r) => (!kw ? true : r.name.toLowerCase().includes(kw) || r.title.toLowerCase().includes(kw) || (r.concerns || []).some((con) => con.toLowerCase().includes(kw))))
    .filter((r) => (!loc ? true : r.location.toLowerCase().includes(loc)))
    .sort((a, b) => {
      const rank = { verified: 0, pending: 1, unclaimed: 2, external: 3 };
      return rank[a.status] - rank[b.status];
    });

  return (
    <main style={{ maxWidth: 1120, margin: "0 auto", padding: "32px 24px 80px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: c.gray600, fontSize: 13, marginBottom: 20, cursor: "pointer", fontFamily: fonts.body }}>
        ← Back to home
      </button>

      {/* Persistent search bar — carries over what was typed on the homepage and stays editable here */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24, background: c.paper, border: `1px solid ${c.gray300}`, borderRadius: 12, padding: 14 }}>
        <div style={{ flex: "2 1 200px", display: "flex", alignItems: "center", gap: 8, border: `1px solid ${c.gray300}`, borderRadius: 8, padding: "9px 12px" }}>
          <Search size={15} color={c.gray600} />
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Search by name, title, or concern" aria-label="Search" style={{ border: "none", outline: "none", fontFamily: fonts.body, fontSize: 13.5, width: "100%", background: "transparent" }} />
        </div>
        <div style={{ flex: "1 1 150px", display: "flex", alignItems: "center", gap: 8, border: `1px solid ${c.gray300}`, borderRadius: 8, padding: "9px 12px" }}>
          <MapPin size={15} color={c.gray600} />
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" aria-label="Location" style={{ border: "none", outline: "none", fontFamily: fonts.body, fontSize: 13.5, width: "100%", background: "transparent" }} />
        </div>
      </div>

      <div className="h-row-to-col" style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
        {/* FILTER SIDEBAR */}
        <aside className="h-filter-sidebar" style={{ width: 220, flexShrink: 0, position: "sticky", top: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
            <SlidersHorizontal size={15} color={c.navy} />
            <span style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 14, color: c.navy }}>Filters</span>
          </div>

          <FilterGroup label="Profile source">
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {["All", "Heurisko Verified", "Registered", "Public Listings"].map((s) => (
                <label key={s} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: c.ink, cursor: "pointer" }}>
                  <input type="radio" checked={sourceFilter === s} onChange={() => setSourceFilter(s)} />
                  {s}
                </label>
              ))}
            </div>
            {sourceFilter === "Public Listings" && (
              <p style={{ fontSize: 11, color: c.gray600, marginTop: 8, lineHeight: 1.5 }}>Public listings are compiled from external sources and aren't registered or verified on Heurisko.</p>
            )}
          </FilterGroup>

          <FilterGroup label="Concern">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {CATEGORIES.slice(0, 6).map((cat) => (
                <Chip key={cat} active={activeCats.includes(cat)} onClick={() => toggleCat(cat)}>
                  {cat}
                </Chip>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup label="Consultation mode">
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {["Both", "Online", "In-person"].map((m) => (
                <label key={m} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: c.ink, cursor: "pointer" }}>
                  <input type="radio" checked={modeFilter === m} onChange={() => setModeFilter(m)} />
                  {m}
                </label>
              ))}
            </div>
          </FilterGroup>

          {sourceFilter !== "Public Listings" && (
            <FilterGroup label="Verification">
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: c.ink, cursor: "pointer" }}>
                <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} />
                Verified only
              </label>
            </FilterGroup>
          )}
        </aside>

        {/* RESULTS */}
        <section style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <p style={{ fontFamily: fonts.body, fontSize: 14, color: c.gray600 }}>
              <strong style={{ color: c.ink }}>{shown.length} results</strong> · sorted by relevance
            </p>
          </div>

          {activeCats.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
              {activeCats.map((cat) => (
                <span key={cat} onClick={() => toggleCat(cat)} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, background: c.navyTint, color: c.navy, padding: "5px 10px", borderRadius: 999, cursor: "pointer" }}>
                  {cat} <X size={11} />
                </span>
              ))}
            </div>
          )}

          <div className="h-grid-2">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : shown.map((r, i) => (
                  <div key={r.name} className="h-fade-in" style={{ animationDelay: `${Math.min(i, 6) * 40}ms` }}>
                    {r.status === "external" ? (
                      <ExternalResultCard r={r} onOpen={onOpenProfile} />
                    ) : (
                      <ResultCard r={r} onOpenProfile={onOpenProfile} />
                    )}
                  </div>
                ))}
          </div>
          {!loading && shown.length === 0 && (
            <p style={{ fontSize: 13.5, color: c.gray600, padding: "20px 0" }}>No results match this filter — try widening it.</p>
          )}
        </section>
      </div>
    </main>
  );
}

function StepRail({ steps, current, completed }) {
  return (
    <nav className="h-steprail" style={{ width: 200, flexShrink: 0 }}>
      {steps.map((s, i) => {
        const isDone = completed.includes(i);
        const isCurrent = i === current;
        return (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, background: isCurrent ? c.navyTint : "transparent", marginBottom: 2 }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
              background: isDone ? c.navy : isCurrent ? c.paper : "transparent",
              border: isDone ? "none" : `1.5px solid ${isCurrent ? c.navy : c.gray300}`,
            }}>
              {isDone ? <Check size={12} color={c.paper} /> : <span style={{ fontSize: 11, color: isCurrent ? c.navy : c.gray600, fontWeight: 600 }}>{i + 1}</span>}
            </div>
            <span style={{ fontSize: 13, fontWeight: isCurrent ? 600 : 500, color: isCurrent ? c.navy : c.gray600 }}>{s}</span>
          </div>
        );
      })}
    </nav>
  );
}

function TextField({ label, required, area, placeholder, hint, value, onChange, id }) {
  const fieldId = id || `f-${label?.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
  const controlled = value !== undefined;
  return (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor={fieldId} style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 13, fontWeight: 500, color: c.ink, marginBottom: 6 }}>
        {label}
        {required && (
          <span style={{ fontFamily: fonts.mono, fontSize: 9.5, color: c.navy, background: c.navyTint, padding: "1px 6px", borderRadius: 4 }}>req</span>
        )}
      </label>
      {area ? (
        <textarea id={fieldId} rows={3} placeholder={placeholder} {...(controlled ? { value, onChange } : {})} style={{ width: "100%", border: `1px solid ${c.gray300}`, borderRadius: 8, padding: "10px 12px", fontFamily: fonts.body, fontSize: 14, resize: "vertical" }} />
      ) : (
        <input id={fieldId} placeholder={placeholder} {...(controlled ? { value, onChange } : {})} style={{ width: "100%", border: `1px solid ${c.gray300}`, borderRadius: 8, padding: "10px 12px", fontFamily: fonts.body, fontSize: 14 }} />
      )}
      {hint && <p style={{ fontSize: 11.5, color: c.gray600, marginTop: 4 }}>{hint}</p>}
    </div>
  );
}

const PRO_STEPS = ["Account type", "Basic info", "Credentials", "Services", "Review"];

function AuthView({ intent, claimTarget, onAuthenticated, onCancel }) {
  const [mode, setMode] = useState("signup"); // 'signup' | 'login'
  const [stage, setStage] = useState("form"); // 'form' | 'verify'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const intentCopy = {
    register: "Creating a professional or institution profile needs a verified account first — it's what lets you edit your own listing later and keeps the verification queue tied to a real person.",
    claim: claimTarget ? `Claiming ${claimTarget.name}'s profile needs a verified account, so we know who's requesting edit access.` : "Claiming a profile needs a verified account.",
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || (mode === "signup" && !name.trim())) {
      setError("Fill in every field before continuing.");
      return;
    }
    setError("");
    if (mode === "signup") setStage("verify");
    else onAuthenticated({ name: email.split("@")[0], email });
  };

  const confirmVerify = () => onAuthenticated({ name, email });

  if (stage === "verify") {
    return (
      <main style={{ maxWidth: 440, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: c.navyTint, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
          <Mail size={22} color={c.navy} />
        </div>
        <h1 style={{ fontFamily: fonts.display, fontSize: 22, color: c.ink, marginBottom: 10, fontWeight: 500 }}>Verify your email</h1>
        <p style={{ fontSize: 13.5, color: c.gray600, lineHeight: 1.7, marginBottom: 22 }}>
          We've sent a 6-digit code to <strong>{email}</strong>. Enter it below to confirm it's you.
        </p>
        <input
          placeholder="000000"
          maxLength={6}
          style={{ width: 140, textAlign: "center", letterSpacing: "0.3em", fontFamily: fonts.mono, fontSize: 18, border: `1px solid ${c.gray300}`, borderRadius: 8, padding: "10px 0", marginBottom: 20 }}
        />
        <div>
          <Button variant="primary" onClick={confirmVerify}>Confirm and continue</Button>
        </div>
        <button onClick={() => setStage("form")} style={{ background: "none", border: "none", color: c.gray600, fontSize: 12.5, marginTop: 16, cursor: "pointer" }}>
          Use a different email
        </button>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 440, margin: "0 auto", padding: "56px 24px 80px" }}>
      <button onClick={onCancel} style={{ background: "none", border: "none", color: c.gray600, fontSize: 13, marginBottom: 20, cursor: "pointer", fontFamily: fonts.body, display: "flex", alignItems: "center", gap: 6 }}>
        <ArrowLeft size={14} /> Cancel
      </button>

      {intent && (
        <div style={{ background: c.navyTint, border: `1px solid ${c.gray300}`, borderRadius: 10, padding: "12px 16px", marginBottom: 22, fontSize: 13, color: c.ink, lineHeight: 1.6 }}>
          {intentCopy[intent]}
        </div>
      )}

      <div style={{ display: "flex", borderRadius: 8, border: `1px solid ${c.gray300}`, overflow: "hidden", marginBottom: 24 }}>
        {["signup", "login"].map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setError(""); }}
            style={{
              flex: 1, padding: "10px 0", border: "none", cursor: "pointer", fontFamily: fonts.body, fontSize: 13.5, fontWeight: 600,
              background: mode === m ? c.navy : c.paper, color: mode === m ? c.paper : c.gray600,
            }}
          >
            {m === "signup" ? "Sign up" : "Log in"}
          </button>
        ))}
      </div>

      <h1 style={{ fontFamily: fonts.display, fontSize: 22, color: c.ink, marginBottom: 20, fontWeight: 500 }}>
        {mode === "signup" ? "Create your account" : "Welcome back"}
      </h1>

      <form onSubmit={submitForm}>
        {mode === "signup" && (
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: c.ink, marginBottom: 6 }}>Full name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" style={{ width: "100%", border: `1px solid ${c.gray300}`, borderRadius: 8, padding: "10px 12px", fontFamily: fonts.body, fontSize: 14 }} />
          </div>
        )}
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: c.ink, marginBottom: 6 }}>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={{ width: "100%", border: `1px solid ${c.gray300}`, borderRadius: 8, padding: "10px 12px", fontFamily: fonts.body, fontSize: 14 }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: c.ink, marginBottom: 6 }}>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" style={{ width: "100%", border: `1px solid ${c.gray300}`, borderRadius: 8, padding: "10px 12px", fontFamily: fonts.body, fontSize: 14 }} />
        </div>

        {error && <p style={{ fontSize: 12.5, color: c.red, marginTop: 8 }}>{error}</p>}

        <Button variant="primary" style={{ width: "100%", justifyContent: "center", marginTop: 18 }}>
          {mode === "signup" ? "Create account" : "Log in"}
        </Button>
      </form>

      <p style={{ fontSize: 12, color: c.gray600, textAlign: "center", marginTop: 18 }}>
        {mode === "signup" ? "Already have an account? " : "New to Heurisko? "}
        <span onClick={() => setMode(mode === "signup" ? "login" : "signup")} style={{ color: c.navy, fontWeight: 600, cursor: "pointer" }}>
          {mode === "signup" ? "Log in" : "Sign up"}
        </span>
      </p>
    </main>
  );
}

const MATCH_LABEL = {
  matched: { label: "Matched", bg: "#E6F0E8", fg: "#3D6B45" },
  partial: { label: "Partial match", bg: "#FBF3E4", fg: "#8A6416" },
  mismatch: { label: "Mismatch", bg: "#FBEEEC", fg: c.red },
  not_detected: { label: "Not detected", bg: c.cream, fg: c.gray600 },
};

function compareField(submitted, extracted) {
  const s = (submitted || "").trim().toLowerCase();
  const e = (extracted || "").trim().toLowerCase();
  if (!e) return "not_detected";
  if (!s) return "partial";
  if (s === e) return "matched";
  if (e.includes(s) || s.includes(e)) return "partial";
  return "mismatch";
}

// Simulated document-extraction result. A real system would call an OCR/parsing
// service here (see HEURISKO_PRODUCTION_READINESS.md for where this plugs into
// the real pipeline); this generates a plausible comparison against what was
// actually typed in, so the UI is honestly demoed rather than showing static
// canned numbers regardless of input.
function mockExtractCredential({ fullName, licensingAuthority, licenceNumber, fileName, fileSize, fileType }) {
  // Honest about what this prototype can and can't do: there is no OCR or
  // document-AI call here (see HEURISKO_PRODUCTION_READINESS.md §10) — the file's
  // actual content is never read, at all. What follows uses only two kinds of real
  // signal: (1) genuine metadata from the File object itself (size, MIME type), and
  // (2) whether the person filled in the required text fields. Nothing here is ever
  // compared against the document's actual content — "extracted" values below are
  // never fabricated to look like real OCR output; they say plainly that no content
  // was read. This means the check below has ZERO ability to detect a fraudulent or
  // mismatched document — someone can upload any valid-sized PDF/image of anything
  // at all (a photo of a cat would pass the file-sanity check) as long as they've
  // filled in the text fields. Don't let the "score" or "passed" language below be
  // read as fraud detection — it isn't, and it was never designed to be.
  const NOT_AVAILABLE = "Not read — this prototype has no OCR";

  const formRows = [
    { field: "Full name", submitted: fullName || "Not entered" },
    { field: "Licence / registration number", submitted: licenceNumber || "Not entered" },
    { field: "Licensing / accrediting authority", submitted: licensingAuthority || "Not entered" },
  ].map((r) => ({ ...r, extracted: NOT_AVAILABLE, status: r.submitted !== "Not entered" ? "matched" : "not_detected" }));

  const ocrRows = ["Licence type / category", "Issue date", "Expiry / validity date", "Qualification / credential title"]
    .map((field) => ({ field, submitted: "—", extracted: NOT_AVAILABLE, status: "not_detected" }));

  const rows = [...formRows, ...ocrRows];

  // Real checks against the actual uploaded file's metadata (not fabricated) —
  // this is genuinely mechanical, computed from the real File object, but it's a
  // sanity check on the file's shape, never a check on what the file contains.
  const flags = [];
  const acceptedTypes = ["application/pdf", "image/jpeg", "image/png", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
  let fileSanityOk = true;
  if (typeof fileSize === "number") {
    if (fileSize < 8000) {
      flags.push(`The uploaded file is only ${(fileSize / 1024).toFixed(1)}KB — unusually small for a scanned certificate. Flagged for manual review.`);
      fileSanityOk = false;
    }
    if (fileSize > 20 * 1024 * 1024) {
      flags.push("The uploaded file is unusually large.");
    }
  }
  if (fileType && !acceptedTypes.includes(fileType)) {
    flags.push(`File type "${fileType || "unknown"}" doesn't match an expected credential format.`);
    fileSanityOk = false;
  }
  const formComplete = formRows.every((r) => r.status === "matched");
  if (!formComplete) flags.push("One or more required fields weren't filled in before upload.");
  flags.push("Automated checks here only confirm the form is complete and the file looks plausible by size/type — they cannot verify the document is genuine, unaltered, or actually belongs to this person.");

  const sizeOk = typeof fileSize !== "number" || (fileSize >= 8000 && fileSize <= 20 * 1024 * 1024);
  const typeOk = !fileType || acceptedTypes.includes(fileType);
  const docScore = (sizeOk ? 50 : 15) + (typeOk ? 50 : 15);

  // A completeness score, not a "match against the document" score — it can
  // only ever reflect what's genuinely checkable here: form fields + file sanity.
  const formPart = (formRows.filter((r) => r.status === "matched").length / formRows.length) * 70;
  const filePart = fileSanityOk ? 30 : 10;
  const score = Math.round(formPart + filePart);

  return { fileName, rows, score, docScore, flags, formComplete, fileSanityOk };
}

function ExtractionResultPanel({ result }) {
  const passed = result.score >= 75;
  const borderline = result.score >= 50 && result.score < 75;
  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ background: c.navy, borderRadius: 10, padding: "10px 16px", textAlign: "center" }}>
          <p style={{ fontFamily: fonts.mono, fontSize: 22, color: c.gold, fontWeight: 600 }}>{result.score}%</p>
          <p style={{ fontSize: 10, color: "#C6CEDA", textTransform: "uppercase", letterSpacing: "0.05em" }}>Field match</p>
        </div>
        <div style={{ background: c.cream, border: `1px solid ${c.gray300}`, borderRadius: 10, padding: "10px 16px", textAlign: "center" }}>
          <p style={{ fontFamily: fonts.mono, fontSize: 22, color: c.ink, fontWeight: 600 }}>{result.docScore}%</p>
          <p style={{ fontSize: 10, color: c.gray600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Document readability</p>
        </div>
        <p style={{ fontSize: 12, color: c.gray600, maxWidth: 280 }}>Automatically generated from "{result.fileName}" — this is a preliminary check, not final verification.</p>
      </div>

      <p style={{ fontSize: 11.5, color: c.gray600, background: c.cream, border: `1px solid ${c.gray300}`, borderRadius: 8, padding: "8px 12px", marginBottom: 14, lineHeight: 1.6 }}>
        These automated checks confirm your form is complete and the file looks like a plausible document by size and type — they do not read the document's content, and cannot confirm it's genuine or actually yours. An administrator does that part.
      </p>

      <div style={{ border: `1px solid ${c.gray300}`, borderRadius: 10, overflow: "hidden", marginBottom: 14 }}>
        {result.rows.map((r, i) => {
          const m = MATCH_LABEL[r.status];
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr 0.9fr", gap: 10, padding: "10px 14px", borderBottom: i < result.rows.length - 1 ? `1px solid ${c.gray300}` : "none", background: i % 2 ? c.cream : c.paper, alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: c.ink }}>{r.field}</span>
              <span style={{ fontSize: 12, color: c.gray600 }}>{r.submitted}</span>
              <span style={{ fontSize: 12, color: c.gray600, fontFamily: fonts.mono }}>{r.extracted || "—"}</span>
              <span style={{ fontSize: 10.5, fontWeight: 600, color: m.fg, background: m.bg, borderRadius: 999, padding: "3px 8px", textAlign: "center", justifySelf: "start" }}>{m.label}</span>
            </div>
          );
        })}
      </div>

      {result.flags.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          {result.flags.map((f, i) => (
            <p key={i} style={{ fontSize: 12, color: "#8A6416", background: "#FBF3E4", borderRadius: 8, padding: "8px 12px", marginBottom: 6 }}>⚑ {f}</p>
          ))}
        </div>
      )}

      {passed && (
        <div style={{ background: c.goldTint, border: `1px solid ${c.gold}`, borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#5C4A21" }}>
          <strong>Primary Verification Complete — Admin Confirmation Pending.</strong> The uploaded document has passed preliminary automated checks. This is not yet an official verification — an administrator still reviews the document and profile before the Verified seal appears.
        </div>
      )}
      {borderline && (
        <div style={{ background: "#FBF3E4", border: "1px solid #E0BF7A", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#8A6416" }}>
          Some details couldn't be automatically confirmed. You can still submit — this will be prioritized for closer manual review rather than the standard queue.
        </div>
      )}
      {!passed && !borderline && (
        <div style={{ background: "#FBEEEC", border: `1px solid ${c.red}`, borderRadius: 10, padding: "12px 16px", fontSize: 13, color: c.red }}>
          Significant mismatches were detected between the document and your profile. Double-check the fields above, or submit anyway for manual review.
        </div>
      )}
    </div>
  );
}

function RegisterView({ onBack, onSubmitForReview }) {
  const [step, setStep] = useState(0);
  const [accountType, setAccountType] = useState("professional");
  const [submitted, setSubmitted] = useState(false);
  const [fullName, setFullName] = useState("");
  const [title, setTitle] = useState("");
  const [intro, setIntro] = useState("");
  const [primaryLocation, setPrimaryLocation] = useState("");
  const [licensingAuthority, setLicensingAuthority] = useState("");
  const [licenceNumber, setLicenceNumber] = useState("");
  const [specialities, setSpecialities] = useState("");
  const [languages, setLanguages] = useState("");
  const [ageGroups, setAgeGroups] = useState("");
  const [modes, setModes] = useState([]); // ['online','in_person']
  const [fee, setFee] = useState("");
  const [processing, setProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState("");
  const [processingPct, setProcessingPct] = useState(0);
  const [extraction, setExtraction] = useState(null);
  const fileInputRef = React.useRef(null);
  const completed = Array.from({ length: step }, (_, i) => i);

  const toggleMode = (m) => setModes((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessing(true);
    setExtraction(null);
    setProcessingPct(0);
    setProcessingStage("Uploading document…");
    setTimeout(() => { setProcessingPct(35); setProcessingStage("Extracting document data…"); }, 50);
    setTimeout(() => { setProcessingPct(75); setProcessingStage("Comparing against your profile…"); }, 500);
    setTimeout(() => { setProcessingPct(100); }, 1100);
    setTimeout(() => {
      setExtraction(mockExtractCredential({ fullName, licensingAuthority, licenceNumber, fileName: file.name, fileSize: file.size, fileType: file.type }));
      setProcessing(false);
    }, 1400);
  };

  const next = () => {
    if (step < PRO_STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    const passed = extraction && extraction.score >= 75;
    const displayName = fullName || (accountType === "professional" ? "Unnamed professional" : "Unnamed institution");
    const initials = displayName.split(" ").filter((w) => w && w[0] === w[0].toUpperCase()).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || displayName.slice(0, 2).toUpperCase();
    const concernsList = specialities.split(",").map((s) => s.trim()).filter(Boolean);

    if (onSubmitForReview) {
      onSubmitForReview({
        // fields for the admin verification queue
        name: displayName,
        type: accountType,
        submittedDate: new Date().toISOString().slice(0, 10),
        autoScore: extraction ? extraction.score : null,
        docScore: extraction ? extraction.docScore : null,
        fields: extraction ? extraction.rows : [],
        flags: extraction ? extraction.flags : ["No credential document was uploaded before submission"],
        documentName: extraction ? extraction.fileName : null,
        status: passed ? "auto_verified_pending_admin" : "needs_review",
        // full directory entry — this is what actually appears in search once approved
        directoryEntry: {
          type: accountType,
          name: displayName,
          title: title || (accountType === "professional" ? "Mental health professional" : "Institution"),
          status: "pending",
          location: primaryLocation || "Location not provided",
          languages: languages || "Not specified",
          exp: intro ? intro.slice(0, 60) : "New listing",
          fee: fee || "Contact for details",
          initials,
          modes: modes.length ? modes : ["online"],
          concerns: concernsList,
        },
      });
    }
    setSubmitted(true);
  };
  const back = () => (step > 0 ? setStep(step - 1) : onBack());

  if (submitted) {
    const passed = extraction && extraction.score >= 75;
    return (
      <main style={{ maxWidth: 560, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: c.navy, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <ShieldCheck size={26} color={c.gold} />
        </div>
        <h1 style={{ fontFamily: fonts.display, fontSize: 24, color: c.ink, marginBottom: 12, fontWeight: 500 }}>
          {passed ? "Primary Verification Complete — Admin Confirmation Pending" : "Submitted for review"}
        </h1>
        <p style={{ fontSize: 14, color: c.gray600, lineHeight: 1.7, marginBottom: 24 }}>
          Your {accountType === "professional" ? "professional" : "institution"} profile is now in the verification queue, and already appears in search as <strong>Pending</strong> so you can see how it looks.{" "}
          {passed
            ? "Your document passed preliminary automated checks, but this isn't an official verification yet — an administrator still does the final confirmation."
            : "An administrator will check your documents and licence details by hand."}
          {" "}The Verified seal appears once that's done.
        </p>
        <Button variant="primary" onClick={onBack}>Back to homepage</Button>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px 80px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: c.gray600, fontSize: 13, marginBottom: 20, cursor: "pointer", fontFamily: fonts.body, display: "flex", alignItems: "center", gap: 6 }}>
        <ArrowLeft size={14} /> Cancel
      </button>
      <h1 style={{ fontFamily: fonts.display, fontSize: 26, color: c.ink, marginBottom: 4, fontWeight: 500 }}>Create your profile</h1>
      <p style={{ fontSize: 14, color: c.gray600, marginBottom: 28 }}>Takes about 10 minutes. You can save and continue later.</p>

      <div className="h-row-to-col" style={{ display: "flex", gap: 32 }}>
        <StepRail steps={PRO_STEPS} current={step} completed={completed} />
        <div style={{ flex: 1, background: c.paper, border: `1px solid ${c.gray300}`, borderRadius: 12, padding: 28 }}>
          {step === 0 && (
            <>
              <h2 style={{ fontFamily: fonts.display, fontSize: 18, marginBottom: 16 }}>What are you registering?</h2>
              <div style={{ display: "flex", gap: 12 }}>
                {[
                  { id: "professional", label: "I'm a mental health professional", icon: <Users size={20} /> },
                  { id: "institution", label: "I represent an institution", icon: <Building2 size={20} /> },
                ].map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setAccountType(opt.id)}
                    style={{
                      flex: 1, cursor: "pointer", borderRadius: 10, padding: 20,
                      border: `1.5px solid ${accountType === opt.id ? c.navy : c.gray300}`,
                      background: accountType === opt.id ? c.navyTint : c.paper,
                    }}
                  >
                    <div style={{ color: c.navy, marginBottom: 10 }}>{opt.icon}</div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: c.ink }}>{opt.label}</p>
                  </div>
                ))}
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <h2 style={{ fontFamily: fonts.display, fontSize: 18, marginBottom: 16 }}>Basic information</h2>
              <TextField
                label={accountType === "professional" ? "Full name" : "Institution name"}
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={accountType === "professional" ? "Dr. Jane Doe" : "Clarity Wellness Centre"}
              />
              <TextField
                label={accountType === "professional" ? "Professional title" : "Institution type"}
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={accountType === "professional" ? "Clinical Psychologist" : "Clinic, hospital, NGO..."}
              />
              <TextField label="Short introduction" area value={intro} onChange={(e) => setIntro(e.target.value)} placeholder="A few sentences public users will see first." />
              <TextField label="Primary location" required value={primaryLocation} onChange={(e) => setPrimaryLocation(e.target.value)} placeholder="City, area" />
            </>
          )}
          {step === 2 && (
            <>
              <h2 style={{ fontFamily: fonts.display, fontSize: 18, marginBottom: 6 }}>Credentials</h2>
              <p style={{ fontSize: 13, color: c.gray600, marginBottom: 16 }}>This is what gets checked before your seal appears — accuracy here speeds up review.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
                <TextField label="Licensing authority" required value={licensingAuthority} onChange={(e) => setLicensingAuthority(e.target.value)} placeholder="e.g. Dubai Health Authority" />
                <TextField label="Licence number" required value={licenceNumber} onChange={(e) => setLicenceNumber(e.target.value)} placeholder="e.g. DHA-PSY-004821" />
              </div>

              <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={handleFile} style={{ display: "none" }} />
              <div
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                style={{ border: `1px dashed ${c.gray300}`, borderRadius: 10, padding: 24, textAlign: "center", marginTop: 4, cursor: "pointer" }}
              >
                <Upload size={20} color={c.gray600} style={{ marginBottom: 8 }} />
                <p style={{ fontSize: 13, color: c.gray600 }}>Upload licence document (PDF, JPG/PNG, DOC/DOCX)</p>
                <p style={{ fontSize: 11.5, color: c.gray600, marginTop: 4 }}>Never shown publicly — reviewed by administrators only.</p>
              </div>

              {processing && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: c.gray600, marginBottom: 8 }}>
                    <span className="h-spin" style={{ width: 14, height: 14, border: `2px solid ${c.gray300}`, borderTopColor: c.navy, borderRadius: "50%", flexShrink: 0 }} />
                    {processingStage}
                  </div>
                  <div style={{ height: 5, borderRadius: 999, background: c.gray300, overflow: "hidden" }}>
                    <div className="h-progress-fill" style={{ height: "100%", width: `${processingPct}%`, background: c.navy, borderRadius: 999 }} />
                  </div>
                </div>
              )}
              {extraction && !processing && <div className="h-fade-in"><ExtractionResultPanel result={extraction} /></div>}
            </>
          )}
          {step === 3 && (
            <>
              <h2 style={{ fontFamily: fonts.display, fontSize: 18, marginBottom: 16 }}>Services</h2>
              <TextField label="Areas of speciality" required hint="Comma-separated — e.g. Anxiety, Trauma. These become searchable concern filters." value={specialities} onChange={(e) => setSpecialities(e.target.value)} placeholder="e.g. Anxiety, Trauma, Couples counselling" />
              <TextField label="Languages spoken" required value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="e.g. English, Arabic" />
              <TextField label="Age groups served" value={ageGroups} onChange={(e) => setAgeGroups(e.target.value)} placeholder="e.g. Adults, adolescents" />
              <TextField label="Fees / fee range" value={fee} onChange={(e) => setFee(e.target.value)} placeholder="e.g. AED 300–500" />
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: c.ink, marginBottom: 8 }}>Consultation modes</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[{ id: "online", label: "Online" }, { id: "in_person", label: "In-person" }].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => toggleMode(m.id)}
                      style={{
                        padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                        border: `1px solid ${modes.includes(m.id) ? c.navy : c.gray300}`,
                        background: modes.includes(m.id) ? c.navyTint : c.paper,
                        color: modes.includes(m.id) ? c.navy : c.gray600,
                      }}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          {step === 4 && (
            <>
              <h2 style={{ fontFamily: fonts.display, fontSize: 18, marginBottom: 6 }}>Review and submit</h2>
              <p style={{ fontSize: 13, color: c.gray600, marginBottom: 16 }}>
                Once submitted, your profile enters the verification queue — it appears in search immediately as Pending, and the Verified seal is added once an administrator approves it.
              </p>
              <div style={{ background: c.cream, borderRadius: 10, padding: 16, fontSize: 13, color: c.ink, lineHeight: 1.8 }}>
                Name: <strong>{fullName || "—"}</strong><br />
                Registering as: <strong>{accountType === "professional" ? "Mental health professional" : "Institution"}</strong> · {title || "—"}<br />
                Location: <strong>{primaryLocation || "—"}</strong><br />
                Specialities: <strong>{specialities || "—"}</strong><br />
                Credential check: <strong>{extraction ? `${extraction.score}% field match` : "No document uploaded yet"}</strong><br />
                Status after submit: <strong>{extraction && extraction.score >= 75 ? "Primary Verification Complete — Admin Confirmation Pending" : "Pending verification"}</strong>
              </div>
            </>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, paddingTop: 20, borderTop: `1px solid ${c.gray300}` }}>
            <Button variant="ghost" onClick={back}>Back</Button>
            <Button variant="primary" onClick={next}>{step === PRO_STEPS.length - 1 ? "Submit for review" : "Continue"}</Button>
          </div>
        </div>
      </div>
    </main>
  );
}

const CLAIM_STEPS = ["Confirm identity", "Upload documents", "Submit"];

function ClaimView({ r, onBack, onSubmitClaim }) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const completed = Array.from({ length: step }, (_, i) => i);

  if (!r) {
    return (
      <main style={{ maxWidth: 560, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <p style={{ color: c.gray600 }}>No profile selected. Go back and choose one to claim.</p>
        <Button variant="secondary" onClick={onBack} style={{ marginTop: 16 }}>Back</Button>
      </main>
    );
  }

  const next = () => {
    if (step < CLAIM_STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    if (onSubmitClaim) onSubmitClaim(r);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main style={{ maxWidth: 560, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: c.navy, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <ShieldCheck size={26} color={c.gold} />
        </div>
        <h1 style={{ fontFamily: fonts.display, fontSize: 24, color: c.ink, marginBottom: 12, fontWeight: 500 }}>Claim submitted</h1>
        <p style={{ fontSize: 14, color: c.gray600, lineHeight: 1.7, marginBottom: 24 }}>
          An administrator will confirm your identity against <strong>{r.name}</strong>'s profile and the documents you uploaded.
          The profile now shows as <strong>Pending</strong> in search — the Verified seal appears once an admin approves it.
        </p>
        <Button variant="primary" onClick={onBack}>Back to profile</Button>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: "32px 24px 80px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: c.gray600, fontSize: 13, marginBottom: 20, cursor: "pointer", fontFamily: fonts.body, display: "flex", alignItems: "center", gap: 6 }}>
        <ArrowLeft size={14} /> Cancel
      </button>
      <h1 style={{ fontFamily: fonts.display, fontSize: 24, color: c.ink, marginBottom: 4, fontWeight: 500 }}>Claim {r.name}'s profile</h1>
      <p style={{ fontSize: 14, color: c.gray600, marginBottom: 8 }}>We'll verify this is really you before granting edit access.</p>
      {r.status === "external" && (
        <p style={{ fontSize: 12.5, color: c.gray600, marginBottom: 16, background: c.cream, border: `1px solid ${c.gray300}`, borderRadius: 8, padding: "9px 12px" }}>
          This listing was compiled from public sources, not entered by anyone at Heurisko. Claiming it starts a normal registered profile you can edit freely — it does not carry over any verification status.
        </p>
      )}

      <div className="h-row-to-col" style={{ display: "flex", gap: 28 }}>
        <StepRail steps={CLAIM_STEPS} current={step} completed={completed} />
        <div style={{ flex: 1, background: c.paper, border: `1px solid ${c.gray300}`, borderRadius: 12, padding: 24 }}>
          {step === 0 && (
            <>
              <h2 style={{ fontFamily: fonts.display, fontSize: 17, marginBottom: 14 }}>Confirm it's you</h2>
              <TextField label="Full legal name" required placeholder={r.name} />
              <TextField label="Email address" required placeholder="you@example.com" />
              <TextField label="How are you connected to this profile?" area placeholder="e.g. This is my own listing / I manage this institution's profiles" />
            </>
          )}
          {step === 1 && (
            <>
              <h2 style={{ fontFamily: fonts.display, fontSize: 17, marginBottom: 6 }}>Upload supporting documents</h2>
              <p style={{ fontSize: 13, color: c.gray600, marginBottom: 16 }}>Government ID plus one licence or employment document.</p>
              <div style={{ border: `1px dashed ${c.gray300}`, borderRadius: 10, padding: 24, textAlign: "center", marginBottom: 12 }}>
                <Upload size={20} color={c.gray600} style={{ marginBottom: 8 }} />
                <p style={{ fontSize: 13, color: c.gray600 }}>Government-issued ID</p>
              </div>
              <div style={{ border: `1px dashed ${c.gray300}`, borderRadius: 10, padding: 24, textAlign: "center" }}>
                <Upload size={20} color={c.gray600} style={{ marginBottom: 8 }} />
                <p style={{ fontSize: 13, color: c.gray600 }}>Licence or employment confirmation</p>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <h2 style={{ fontFamily: fonts.display, fontSize: 17, marginBottom: 6 }}>Review and submit</h2>
              <p style={{ fontSize: 13, color: c.gray600, lineHeight: 1.7 }}>
                Your claim will be reviewed by a Heurisko administrator, matched against the existing public profile for <strong>{r.name}</strong>. You'll be notified once it's approved, returned for correction, or rejected.
              </p>
            </>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24, paddingTop: 18, borderTop: `1px solid ${c.gray300}` }}>
            <Button variant="primary" onClick={next}>{step === CLAIM_STEPS.length - 1 ? "Submit claim" : "Continue"}</Button>
          </div>
        </div>
      </div>
    </main>
  );
}

function FilterGroup({ label, children }) {
  return (
    <div style={{ marginBottom: 22, paddingBottom: 22, borderBottom: `1px solid ${c.gray300}` }}>
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: c.gray600, marginBottom: 10 }}>{label}</p>
      {children}
    </div>
  );
}

function ResultCard({ r, onOpenProfile }) {
  const isInstitution = r.type === "institution";
  return (
    <div className="h-card-hover" style={{ background: c.paper, border: `1px solid ${c.gray300}`, borderRadius: 12, padding: 18, boxShadow: "0 1px 2px rgba(14,26,43,0.04)" }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <div
          style={{
            width: 44,
            height: 44,
            flexShrink: 0,
            borderRadius: isInstitution ? 10 : "50%",
            background: c.navyTint,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fonts.display,
            fontWeight: 600,
            fontSize: 15,
            color: c.navy,
          }}
        >
          {r.initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 15, color: c.ink }}>{r.name}</span>
            <StatusMark status={r.status} size={14} />
            {r.status === "unclaimed" && (
              <span style={{ fontSize: 10.5, fontWeight: 600, color: c.gray600, border: `1px solid ${c.gray300}`, borderRadius: 999, padding: "1px 7px" }}>
                Unclaimed
              </span>
            )}
          </div>
          <p style={{ fontSize: 12.5, color: c.gray600, marginTop: 1 }}>{r.title}</p>
        </div>
      </div>
      <p style={{ fontSize: 12.5, color: c.gray600, marginBottom: 12, lineHeight: 1.6 }}>
        {r.location} · {modeLabel(r.modes)} · {r.languages} · {r.exp}
      </p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: fonts.mono, fontSize: 12.5, color: c.ink }}>{r.fee}</span>
        <Button variant="secondary" style={{ padding: "7px 14px", fontSize: 12.5 }} onClick={() => onOpenProfile(r)}>
          View profile
        </Button>
      </div>
    </div>
  );
}

// Deliberately a separate component from ResultCard, not a conditional badge swap —
// see HEURISKO_DISCOVERY_ARCHITECTURE.md §7 on why that structural separation matters.
function ExternalResultCard({ r, onOpen }) {
  const isInstitution = r.type === "institution";
  return (
    <div className="h-card-hover" style={{ background: c.cream, border: `1px dashed ${c.gray300}`, borderRadius: 12, padding: 18 }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
        <div style={{ width: 44, height: 44, flexShrink: 0, borderRadius: isInstitution ? 10 : "50%", background: c.gray300, opacity: 0.6, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.display, fontWeight: 600, fontSize: 15, color: c.gray600 }}>
          {r.initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 15, color: c.ink }}>{r.name}</span>
          <p style={{ fontSize: 12.5, color: c.gray600, marginTop: 1 }}>{r.title}</p>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <span style={{ fontSize: 10.5, fontWeight: 600, color: c.gray600, background: c.navyTint, borderRadius: 999, padding: "3px 9px" }}>Public Listing</span>
        <span style={{ fontSize: 10.5, color: c.gray600 }}>Not registered on Heurisko</span>
      </div>
      <p style={{ fontSize: 12, color: c.gray600, marginBottom: 12, lineHeight: 1.6 }}>{r.location} · {modeLabel(r.modes)} · {r.languages}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: c.gray600 }}>Checked {r.lastChecked}</span>
        <Button variant="secondary" style={{ padding: "7px 14px", fontSize: 12.5 }} onClick={() => onOpen(r)}>
          View listing
        </Button>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ background: c.paper, border: `1px solid ${c.gray300}`, borderRadius: 12, padding: 24, marginBottom: 16 }}>
      <h2 style={{ fontFamily: fonts.display, fontSize: 18, fontWeight: 600, color: c.ink, marginBottom: 16 }}>{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, value, mono = false }) {
  if (!value) return null;
  return (
    <div style={{ marginBottom: 14 }}>
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: c.gray600, marginBottom: 4 }}>{label}</p>
      <p style={{ fontFamily: mono ? fonts.mono : fonts.body, fontSize: 14, color: c.ink }}>{value}</p>
    </div>
  );
}

function drawShareCard(canvas, r, isInstitution, url) {
  const ctx = canvas.getContext("2d");
  const W = 600, H = 750;
  canvas.width = W;
  canvas.height = H;

  // background gradient
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, "#16273F");
  grad.addColorStop(1, "#0E1A2B");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // subtle gold ring pattern top-right
  ctx.strokeStyle = "rgba(201,164,97,0.15)";
  ctx.lineWidth = 1;
  for (let rr = 60; rr < 420; rr += 60) {
    ctx.beginPath();
    ctx.arc(W - 40, 60, rr, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Heurisko wordmark
  ctx.fillStyle = "#C9A461";
  ctx.font = "600 20px Georgia, serif";
  ctx.fillText("ε Heurisko", 40, 56);

  // avatar circle
  ctx.fillStyle = "#25405F";
  const cx = 40 + 56, cy = 150, ar = 56;
  ctx.beginPath();
  if (isInstitution) ctx.roundRect ? ctx.roundRect(40, 94, 112, 112, 18) : ctx.rect(40, 94, 112, 112);
  else ctx.arc(cx, cy, ar, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "600 34px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText(r.initials, cx, cy + 12);
  ctx.textAlign = "left";

  // name
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "600 34px Georgia, serif";
  wrapText(ctx, r.name, 40, 250, 520, 40);

  // title
  ctx.fillStyle = "#E4D3A8";
  ctx.font = "400 20px Arial";
  ctx.fillText(r.title, 40, 292);

  // verification seal (drawn) if verified — simple tick-in-circle
  if (r.status === "verified") {
    const sx = 40, sy = 330, srad = 14;
    ctx.beginPath();
    ctx.arc(sx, sy, srad, 0, Math.PI * 2);
    ctx.fillStyle = "#16273F";
    ctx.fill();
    ctx.strokeStyle = "#C9A461";
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(sx - 5.5, sy + 0.5);
    ctx.lineTo(sx - 1.5, sy + 4.5);
    ctx.lineTo(sx + 6, sy - 4.5);
    ctx.stroke();
    ctx.fillStyle = "#C9A461";
    ctx.font = "600 15px Arial";
    ctx.fillText("Verified profile", sx + 22, sy + 5);
  }

  // meta line
  ctx.fillStyle = "#C6CEDA";
  ctx.font = "400 16px Arial";
  ctx.fillText(`${r.location}  ·  ${r.languages}`, 40, 380);

  // divider
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.beginPath();
  ctx.moveTo(40, 420);
  ctx.lineTo(560, 420);
  ctx.stroke();

  // fee + tagline
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "italic 22px Georgia, serif";
  wrapText(ctx, "Find the right mental health support for you.", 40, 470, 520, 30);

  // footer link
  ctx.fillStyle = "#C9A461";
  ctx.font = "600 16px Arial";
  ctx.fillText(url, 40, H - 40);
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let curY = y;
  for (let n = 0; n < words.length; n++) {
    const test = line + words[n] + " ";
    if (ctx.measureText(test).width > maxWidth && n > 0) {
      ctx.fillText(line, x, curY);
      line = words[n] + " ";
      curY += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, curY);
}

function ShareModal({ r, isInstitution, onClose }) {
  const [copied, setCopied] = useState(false);
  const canvasRef = React.useRef(null);
  useModalA11y(onClose);
  const slug = r.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const url = `heurisko.com/${isInstitution ? "i" : "p"}/${slug}`;
  const shareText = `${r.name} — ${r.title} on Heurisko`;

  React.useEffect(() => {
    if (canvasRef.current) drawShareCard(canvasRef.current, r, isInstitution, url);
  }, [r, isInstitution, url]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://${url}`);
    } catch (e) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const downloadCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${slug}-heurisko-card.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div onClick={onClose} className="h-fade-in-fast" style={{ position: "fixed", inset: 0, background: "rgba(14,26,43,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }}
    >
      <div className="h-pop" role="dialog" aria-modal="true" aria-labelledby="share-modal-title" onClick={(e) => e.stopPropagation()} style={{ background: c.paper, borderRadius: 16, padding: 24, width: 380, maxWidth: "100%", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 id="share-modal-title" style={{ fontFamily: fonts.display, fontSize: 18, fontWeight: 600, color: c.ink }}>Share profile</h3>
          <button onClick={onClose} aria-label="Close share dialog" style={{ background: "none", border: "none", cursor: "pointer", color: c.gray600 }}>
            <X size={18} />
          </button>
        </div>

        {/* Rendered social card */}
        <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 10, border: `1px solid ${c.gray300}` }}>
          <canvas ref={canvasRef} role="img" aria-label={`Shareable card for ${r.name}, ${r.title}, ${r.location}${r.status === "verified" ? ", verified profile" : ""}`} style={{ width: "100%", display: "block" }} />
        </div>
        <Button variant="secondary" style={{ width: "100%", justifyContent: "center", marginBottom: 18 }} onClick={downloadCard}>
          <Download size={14} /> Download card image
        </Button>

        <p style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: c.gray600, marginBottom: 8 }}>Link</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          <div style={{ flex: 1, border: `1px solid ${c.gray300}`, borderRadius: 8, padding: "9px 12px", fontFamily: fonts.mono, fontSize: 12.5, color: c.ink, background: c.cream, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {url}
          </div>
          <Button variant="secondary" style={{ padding: "9px 12px", flexShrink: 0 }} onClick={copyLink}>
            <Copy size={14} /> {copied ? "Copied" : "Copy"}
          </Button>
        </div>

        <p style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: c.gray600, marginBottom: 8 }}>Share via</p>
        <div style={{ display: "flex", gap: 8 }}>
          <a
            href={`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(`Thought this might help: https://${url}`)}`}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, border: `1px solid ${c.gray300}`, borderRadius: 8, padding: "10px 0", textDecoration: "none", fontSize: 13, color: c.ink, fontWeight: 500 }}
          >
            <Mail size={15} /> Email
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Thought this might help: https://${url}`)}`}
            target="_blank"
            rel="noreferrer"
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, border: `1px solid ${c.gray300}`, borderRadius: 8, padding: "10px 0", textDecoration: "none", fontSize: 13, color: c.ink, fontWeight: 500 }}
          >
            <MessageCircle size={15} /> WhatsApp
          </a>
        </div>
        {r.status !== "verified" && (
          <p style={{ fontSize: 11.5, color: c.gray600, marginTop: 14, lineHeight: 1.6 }}>
            This profile is currently {r.status === "pending" ? "pending verification" : "unclaimed"} — the shared card and link will always reflect its current status, not this moment.
          </p>
        )}
      </div>
    </div>
  );
}

function EnquiryModal({ r, isInstitution, isLoggedIn, account, onClose }) {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState(isLoggedIn ? account?.name || "" : "");
  const [contact, setContact] = useState(isLoggedIn ? account?.email || "" : "");
  const [preferredMode, setPreferredMode] = useState("Email");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useModalA11y(onClose);

  const submit = () => {
    if (!name.trim() || !contact.trim() || !message.trim()) {
      setError("Fill in your contact details and a short message before sending.");
      return;
    }
    setError("");
    setSent(true);
  };

  return (
    <div onClick={onClose} className="h-fade-in-fast" style={{ position: "fixed", inset: 0, background: "rgba(14,26,43,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }}>
      <div className="h-pop" role="dialog" aria-modal="true" aria-labelledby="enquiry-modal-title" onClick={(e) => e.stopPropagation()} style={{ background: c.paper, borderRadius: 16, padding: 24, width: 440, maxWidth: "100%", maxHeight: "85vh", overflowY: "auto" }}>
        {sent ? (
          <div style={{ textAlign: "center", padding: "20px 8px" }} role="status">
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: c.navy, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Check size={22} color={c.gold} aria-hidden="true" />
            </div>
            <h3 id="enquiry-modal-title" style={{ fontFamily: fonts.display, fontSize: 19, color: c.ink, marginBottom: 10, fontWeight: 500 }}>Enquiry sent</h3>
            <p style={{ fontSize: 13.5, color: c.gray600, lineHeight: 1.7, marginBottom: 20 }}>
              {r.name} will get back to you via <strong>{preferredMode.toLowerCase()}</strong> at the contact you provided.
              {r.status !== "verified" && " Since this profile isn't fully verified yet, response times may vary."}
            </p>
            <Button variant="primary" onClick={onClose}>Done</Button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <h3 id="enquiry-modal-title" style={{ fontFamily: fonts.display, fontSize: 18, fontWeight: 600, color: c.ink }}>Send an enquiry</h3>
              <button onClick={onClose} aria-label="Close enquiry dialog" style={{ background: "none", border: "none", cursor: "pointer", color: c.gray600 }}>
                <X size={18} />
              </button>
            </div>
            <p style={{ fontSize: 13, color: c.gray600, marginBottom: 18 }}>
              To <strong>{r.name}</strong> · {r.title}
            </p>

            {isLoggedIn ? (
              <div style={{ background: c.navyTint, borderRadius: 8, padding: "9px 12px", fontSize: 12.5, color: c.navy, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
                <Check size={13} aria-hidden="true" /> Sending as {account?.name} ({account?.email}) — this enquiry will also appear in your account.
              </div>
            ) : (
              <div style={{ background: c.cream, border: `1px solid ${c.gray300}`, borderRadius: 8, padding: "9px 12px", fontSize: 12.5, color: c.gray600, marginBottom: 16 }}>
                Sending privately, no account needed. {isInstitution ? "The institution" : "The professional"} only sees what you enter below.
              </div>
            )}

            <div style={{ marginBottom: 14 }}>
              <label htmlFor="enq-name" style={{ display: "block", fontSize: 13, fontWeight: 500, color: c.ink, marginBottom: 6 }}>Your name</label>
              <input id="enq-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" style={{ width: "100%", border: `1px solid ${c.gray300}`, borderRadius: 8, padding: "10px 12px", fontFamily: fonts.body, fontSize: 14 }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label htmlFor="enq-contact" style={{ display: "block", fontSize: 13, fontWeight: 500, color: c.ink, marginBottom: 6 }}>Your contact (email or phone)</label>
              <input id="enq-contact" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="you@example.com or +971 5X XXX XXXX" style={{ width: "100%", border: `1px solid ${c.gray300}`, borderRadius: 8, padding: "10px 12px", fontFamily: fonts.body, fontSize: 14 }} />
            </div>
            <div style={{ marginBottom: 14 }} role="group" aria-labelledby="enq-mode-label">
              <label id="enq-mode-label" style={{ display: "block", fontSize: 13, fontWeight: 500, color: c.ink, marginBottom: 8 }}>Preferred way to be contacted back</label>
              <div style={{ display: "flex", gap: 8 }}>
                {["Email", "Phone", "WhatsApp"].map((m) => (
                  <button
                    key={m}
                    onClick={() => setPreferredMode(m)}
                    aria-pressed={preferredMode === m}
                    style={{
                      flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                      border: `1px solid ${preferredMode === m ? c.navy : c.gray300}`,
                      background: preferredMode === m ? c.navyTint : c.paper,
                      color: preferredMode === m ? c.navy : c.gray600,
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 6 }}>
              <label htmlFor="enq-message" style={{ display: "block", fontSize: 13, fontWeight: 500, color: c.ink, marginBottom: 6 }}>What are you looking for?</label>
              <textarea
                id="enq-message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="A short note on what you'd like help with, and anything relevant like preferred times or language."
                style={{ width: "100%", border: `1px solid ${c.gray300}`, borderRadius: 8, padding: "10px 12px", fontFamily: fonts.body, fontSize: 14, resize: "vertical" }}
              />
            </div>
            <p style={{ fontSize: 11, color: c.gray600, marginBottom: 14, lineHeight: 1.6 }}>
              This isn't an emergency service. If you're in immediate danger, contact local emergency services instead.
            </p>
            {error && <p role="alert" style={{ fontSize: 12.5, color: c.red, marginBottom: 10 }}>{error}</p>}
            <Button variant="primary" style={{ width: "100%", justifyContent: "center" }} onClick={submit}>
              Send enquiry
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

// Full-page view for an externally discovered listing — structurally separate from
// ProfileView (not a conditional branch inside it), so there's no code path where an
// external record could accidentally render with registered-profile chrome (seal,
// enquiry box, dashboard-linked actions). See HEURISKO_DISCOVERY_ARCHITECTURE.md §7.
function ExternalProfileView({ r, onBack, onClaim }) {
  if (!r) return null;
  const isInstitution = r.type === "institution";
  const conf = CONFIDENCE_META[r.confidence] || CONFIDENCE_META.low;

  const visitSource = (url) => {
    // Prototype only — these are placeholder example.com links tied to fictional
    // demo records, not real destinations. In production this navigates straight
    // to the source_url stored on the external_sources row.
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px 80px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: c.gray600, fontSize: 13, marginBottom: 20, cursor: "pointer", fontFamily: fonts.body, display: "flex", alignItems: "center", gap: 6 }}>
        <ArrowLeft size={14} /> Back to results
      </button>

      <div className="h-fade-in" style={{ background: c.cream, border: `1px dashed ${c.gray300}`, borderRadius: 16, padding: 28, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: isInstitution ? 14 : "50%", background: c.gray300, opacity: 0.6, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.display, fontWeight: 600, fontSize: 22, color: c.gray600, flexShrink: 0 }}>
            {r.initials}
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h1 style={{ fontFamily: fonts.display, fontSize: 24, fontWeight: 500, color: c.ink, marginBottom: 6 }}>{r.name}</h1>
            <p style={{ fontSize: 14, color: c.gray600 }}>{r.title} · {r.location}</p>
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, color: c.gray600, background: c.navyTint, borderRadius: 999, padding: "5px 12px" }}>Public Listing</span>
        </div>

        <div style={{ background: c.paper, border: `1px solid ${c.gray300}`, borderRadius: 10, padding: "12px 16px", fontSize: 12.5, color: c.ink, lineHeight: 1.7 }}>
          <strong>This professional has not registered with or been verified by Heurisko.</strong> Information has been compiled from publicly available sources and may not be complete or current.
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        <span className="h-pulse" style={{ fontSize: 12, fontWeight: 600, color: conf.fg, background: conf.bg, borderRadius: 999, padding: "5px 12px" }}>{conf.label}</span>
        <span style={{ fontSize: 12, color: c.gray600, background: c.cream, border: `1px solid ${c.gray300}`, borderRadius: 999, padding: "5px 12px" }}>Public information last checked: {r.lastChecked}</span>
        {r.stale && (
          <span style={{ fontSize: 12, fontWeight: 600, color: c.red, background: "#FBEEEC", borderRadius: 999, padding: "5px 12px" }}>May be out of date</span>
        )}
      </div>

      <Section title="What's publicly known">
        <Field label="Languages" value={r.languages} />
        <Field label="Location" value={r.location} />
        <Field label="Experience / establishment" value={r.exp} />
      </Section>

      <Section title="Sources">
        {r.sources.map((s, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < r.sources.length - 1 ? `1px solid ${c.gray300}` : "none" }}>
            <span style={{ fontSize: 13, color: c.ink }}>{s.label}</span>
            <button onClick={() => visitSource(s.url)} className="h-btn-anim" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: c.navy, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
              View source <ChevronRight size={13} />
            </button>
          </div>
        ))}
      </Section>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Button variant="primary" onClick={onClaim}>Claim this profile</Button>
        <Button variant="secondary" onClick={() => visitSource(r.sources[0]?.url)}>Visit website</Button>
      </div>
      <p style={{ fontSize: 11.5, color: c.gray600, marginTop: 14, lineHeight: 1.6 }}>
        Heurisko does not own, endorse, or represent this listing. If this is your profile, claiming it lets you correct any details and start the standard verification process.
      </p>
    </main>
  );
}

function ProfileView({ r, onBack, onClaim, isLoggedIn, account }) {
  const [shareOpen, setShareOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  if (!r) return null;
  const d = getDetail(r);
  const isInstitution = r.type === "institution";

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px 80px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: c.gray600, fontSize: 13, marginBottom: 20, cursor: "pointer", fontFamily: fonts.body, display: "flex", alignItems: "center", gap: 6 }}>
        <ArrowLeft size={14} /> Back to results
      </button>

      {/* HEADER CARD */}
      <div style={{ background: c.navy, borderRadius: 16, padding: 28, marginBottom: 20, display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ width: 76, height: 76, borderRadius: isInstitution ? 16 : "50%", background: c.navyHover, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.display, fontWeight: 600, fontSize: 26, color: c.paper, flexShrink: 0 }}>
          {r.initials}
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
            <h1 style={{ fontFamily: fonts.display, fontSize: 26, fontWeight: 500, color: c.paper }}>{r.name}</h1>
            {r.status === "verified" && <Seal size={22} />}
            {r.status === "pending" && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#25405F", padding: "3px 10px", borderRadius: 999 }}>
                <Clock size={13} color={c.goldTint} />
                <span style={{ fontSize: 11.5, fontWeight: 600, color: c.goldTint }}>Verification pending</span>
              </span>
            )}
            {r.status === "unclaimed" && (
              <span style={{ fontSize: 11, fontWeight: 600, color: "#C6CEDA", border: "1px solid #3A4E68", borderRadius: 999, padding: "3px 10px" }}>
                Unclaimed listing
              </span>
            )}
          </div>
          <p style={{ fontSize: 14, color: c.goldTint, marginBottom: 10 }}>{r.title}</p>
          <p style={{ fontSize: 13, color: "#C6CEDA" }}>{r.location} · {r.languages}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
          <Button variant="primary" style={{ background: c.gold, color: c.ink }} onClick={() => setEnquiryOpen(true)}>
            <MessageSquare size={14} /> Send enquiry
          </Button>
          <Button variant="secondary" style={{ background: "transparent", color: c.paper, border: "1px solid #3A4E68" }} onClick={() => setShareOpen(true)}>
            <Share2 size={14} /> Share profile
          </Button>
          <Button variant="secondary" style={{ background: "transparent", color: c.paper, border: "1px solid #3A4E68" }}>
            Save profile
          </Button>
        </div>
      </div>

      {r.status === "verified" && (
        <div style={{ background: c.goldTint, border: `1px solid ${c.gold}`, borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#5C4A21" }}>
          <strong>Verified profile.</strong> Identity, licence, and{" "}
          {isInstitution ? "accreditation" : `registration (${d.registration})`} confirmed. Licence checks are independently re-verified before badge renewal — this doesn't guarantee treatment outcomes or personal fit.
        </div>
      )}

      {r.status === "pending" && (
        <div style={{ background: c.cream, border: `1px solid ${c.gray300}`, borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: c.ink, display: "flex", alignItems: "center", gap: 10 }}>
          <Clock size={16} color={c.gray600} style={{ flexShrink: 0 }} />
          <span>
            <strong>Verification in progress.</strong> {isInstitution ? "This institution" : "This professional"} submitted documents and is in the administrator review queue — usually 2–3 business days. The seal will appear here automatically once approved.
          </span>
        </div>
      )}

      {r.status === "unclaimed" && (
        <div style={{ background: c.navyTint, border: `1px solid ${c.gray300}`, borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <p style={{ fontSize: 13, color: c.ink }}>
            <strong>This profile hasn't been claimed.</strong> Basic details were added from public sources and haven't been confirmed by {isInstitution ? "the institution" : "this professional"} yet.
          </p>
          <Button variant="secondary" style={{ padding: "8px 14px", fontSize: 12.5, flexShrink: 0 }} onClick={onClaim}>
            Is this you? Claim this profile
          </Button>
        </div>
      )}

      {shareOpen && <ShareModal r={r} isInstitution={isInstitution} onClose={() => setShareOpen(false)} />}
      {enquiryOpen && <EnquiryModal r={r} isInstitution={isInstitution} isLoggedIn={isLoggedIn} account={account} onClose={() => setEnquiryOpen(false)} />}


      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ flex: "2 1 500px", minWidth: 0 }}>
          {!isInstitution ? (
            <>
              <Section title="Professional information">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                  <Field label="Qualifications" value={d.qualifications} />
                  <Field label="University" value={d.university} />
                  <Field label="Licensing authority" value={d.licensingAuthority} />
                  <Field label="Licence number" value={d.licenceNumber} mono />
                  <Field label="Licence valid until" value={d.licenceValidity} mono />
                  <Field label="Years of experience" value={d.yearsExperience} />
                </div>
                <Field label="Areas of speciality" value={d.specialities} />
                <Field label="Conditions supported" value={d.conditions} />
                <Field label="Therapeutic approaches" value={d.approaches} />
              </Section>

              <Section title="Professional statement">
                <Field label="Approach to care" value={d.approachToCare} />
                <Field label="What a first consultation may involve" value={d.firstConsultation} />
                <Field label="Professional values" value={d.values} />
              </Section>
            </>
          ) : (
            <>
              <Section title="About this institution">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                  <Field label="Established" value={d.yearEstablished} />
                  <Field label="Care type" value={d.careType} />
                  <Field label="Telehealth" value={d.telehealth} />
                  <Field label="Emergency services" value={d.emergency} />
                </div>
                <Field label="Services offered" value={d.services} />
                <Field label="Departments" value={d.departments} />
              </Section>

              <Section title="Branches">
                {d.branches?.map((b, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < d.branches.length - 1 ? `1px solid ${c.gray300}` : "none" }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: c.ink }}>{b.name}</p>
                      <p style={{ fontSize: 12.5, color: c.gray600 }}>{b.address}</p>
                    </div>
                    <p style={{ fontSize: 12.5, color: c.gray600, display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={12} /> {b.hours}
                    </p>
                  </div>
                ))}
              </Section>

              <Section title="Team directory">
                {d.team?.map((t, i) => (
                  <p key={i} style={{ fontSize: 13.5, color: c.ink, padding: "6px 0", display: "flex", alignItems: "center", gap: 6 }}>
                    <Seal size={13} /> {t}
                  </p>
                ))}
              </Section>
            </>
          )}
        </div>

        {/* SIDEBAR */}
        <aside style={{ flex: "1 1 260px", position: "sticky", top: 20 }}>
          <Section title="Service details">
            <Field label="Age groups served" value={d.ageGroups} />
            <Field label="Consultation modes" value={d.consultationModes} />
            <Field label="Working hours" value={d.workingHours} />
            <Field label="Insurance accepted" value={d.insurance} />
            <Field label="Accessibility" value={d.accessibility} />
            <Field label="Fees" value={r.fee} mono />
          </Section>
          <Section title="Contact">
            <p style={{ fontSize: 13, color: c.gray600, marginBottom: 12, lineHeight: 1.6 }}>
              Contact details are shared once an enquiry is submitted, in line with this profile's enquiry preferences.
            </p>
            <Button variant="primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => setEnquiryOpen(true)}>
              <Mail size={14} /> Send enquiry
            </Button>
          </Section>
        </aside>
      </div>
    </main>
  );
}

/* ---------------------------------- RESOURCES ---------------------------------- */

const GLOSSARY = [
  { term: "Anxiety", definition: "A persistent sense of worry or physical unease that doesn't go away when the immediate stressor does. Occasional anxiety is normal; it becomes a concern when it regularly interferes with daily life." },
  { term: "CBT (Cognitive Behavioural Therapy)", definition: "A structured, short-term therapy style focused on noticing the link between thoughts, feelings, and behaviour, and practising ways to shift unhelpful patterns." },
  { term: "Grounding", definition: "Techniques that bring attention back to the present moment and physical surroundings — often used to interrupt anxiety, panic, or dissociation." },
  { term: "Dissociation", definition: "A sense of feeling disconnected from your thoughts, body, or surroundings. Ranges from mild ('zoning out') to more significant experiences that a professional can help assess." },
  { term: "Burnout", definition: "A state of physical and emotional exhaustion from prolonged stress, usually work-related — distinct from clinical depression, though the two can overlap." },
  { term: "Psychiatrist vs. Psychologist", definition: "A psychiatrist is a medical doctor who can prescribe medication. A psychologist typically holds a doctorate in psychology, focuses on therapy and assessment, and in most places cannot prescribe." },
  { term: "Trauma-informed care", definition: "An approach that assumes a person may have a trauma history and shapes how support is offered — pacing, consent, and safety — even if trauma isn't the stated reason for seeking help." },
  { term: "Neurodivergent", definition: "A non-clinical umbrella term describing brains that process, learn, or behave differently from a typical norm — includes ADHD, autism, dyslexia, and others." },
  { term: "Sliding scale", definition: "A fee structure where cost adjusts based on what a client can afford, rather than one fixed rate." },
  { term: "Telehealth", definition: "Receiving care remotely, usually by video or phone, instead of an in-person visit." },
];

const TIPS = [
  { title: "Name it to tame it", body: "Silently naming what you're feeling ('this is anxiety') can measurably lower its intensity — it shifts activity from the emotional brain toward the reasoning one." },
  { title: "Slow the exhale", body: "A longer exhale than inhale (try 4 seconds in, 6 seconds out) signals your nervous system to calm down faster than breathing alone." },
  { title: "Widen your gaze", body: "Anxiety narrows visual focus. Deliberately looking around a wide field of view — without moving your head — can ease the physical sense of threat." },
  { title: "Delay the worry", body: "If a worry hits at an inconvenient time, write it down and schedule 10 minutes later to think about it properly. Most worries lose urgency by then." },
  { title: "One small task", body: "Anxiety often comes with a feeling of being overwhelmed. Picking one small, finishable task can restore a sense of control faster than trying to 'calm down' first." },
  { title: "Cool water on the wrists", body: "Splashing cool water on your wrists or face can trigger the dive reflex, which slows heart rate — a quick, physical off-ramp during a spike." },
  { title: "Unclench on purpose", body: "Anxiety often hides in the jaw and shoulders without you noticing. A quick body check and deliberate unclench can lower overall tension fast." },
  { title: "Say it slower", body: "If you're spiralling verbally (in your head or out loud), deliberately slowing your internal 'voice' down can slow the thought pattern with it." },
];

// Real articles only, published by real registered professionals via their dashboard
// (see publishedArticles state in the root component) — no fictional seed content.

const GROUNDING_TECHNIQUES = [
  {
    title: "Progressive Muscle Relaxation",
    time: "5–8 min",
    summary: "Tense and release major muscle groups, one at a time, to physically discharge stress the body is holding.",
    steps: ["Start at your feet — tense for 5 seconds, then release.", "Move up: calves, thighs, hands, arms.", "Tense your shoulders up to your ears, then drop them.", "Finish by softening your face and jaw.", "Notice the contrast between tense and relaxed."],
  },
  {
    title: "Body Scan",
    time: "3–5 min",
    summary: "A slow, non-judgemental sweep of attention through the body — not to relax on command, just to notice.",
    steps: ["Sit or lie down comfortably.", "Bring attention to your feet — no need to change anything, just notice.", "Move attention slowly upward: legs, torso, arms, shoulders, head.", "If your mind wanders, gently bring it back to the body.", "End by noticing your breath for a few seconds."],
  },
  {
    title: "Anchor Statement",
    time: "1 min",
    summary: "A short, repeatable phrase that pulls you back to the present when thoughts spiral forward or backward in time.",
    steps: ["Choose a simple phrase: 'I am here, right now, and this will pass.'", "Say it slowly, silently or out loud.", "Pair it with one physical sensation — feet on the floor, hands on a surface.", "Repeat 3 times, slower each time."],
  },
  {
    title: "Categorising Game",
    time: "2–3 min",
    summary: "A mental distraction technique that occupies the verbal part of the brain enough to interrupt a spiral.",
    steps: ["Pick a category: animals, cities, foods.", "Name one for each letter of the alphabet, in order.", "If you get stuck, skip the letter and keep going.", "Notice if your thoughts feel any less urgent after."],
  },
  {
    title: "Physical Reset",
    time: "1–2 min",
    summary: "Uses posture and movement — not relaxation — to signal safety to the nervous system.",
    steps: ["Plant both feet flat on the floor, shoulder-width apart.", "Push down gently through your feet and notice the ground pushing back.", "Roll your shoulders back twice, slowly.", "Let your arms hang loose at your sides for a few seconds."],
  },
];

const BREATHING_PATTERNS = [
  {
    id: "box",
    label: "Box breathing",
    description: "Equal 4-4-4-4 counts. Used clinically and by first responders — the equal count gives your mind something simple to follow.",
    phases: [
      { label: "Breathe in", seconds: 4, type: "in" },
      { label: "Hold", seconds: 4, type: "hold-full" },
      { label: "Breathe out", seconds: 4, type: "out" },
      { label: "Hold", seconds: 4, type: "hold-empty" },
    ],
  },
  {
    id: "478",
    label: "4-7-8 breathing",
    description: "A longer hold and exhale than inhale — often used to wind down before sleep or settle a racing mind.",
    phases: [
      { label: "Breathe in", seconds: 4, type: "in" },
      { label: "Hold", seconds: 7, type: "hold-full" },
      { label: "Breathe out", seconds: 8, type: "out" },
    ],
  },
  {
    id: "coherent",
    label: "Coherent breathing",
    description: "Simple 5-in, 5-out pacing, roughly 6 breaths a minute — associated with steadier heart rate variability over a few minutes of practice.",
    phases: [
      { label: "Breathe in", seconds: 5, type: "in" },
      { label: "Breathe out", seconds: 5, type: "out" },
    ],
  },
];

const RESOURCE_TABS = ["Breathing", "Grounding", "Quick tips", "Glossary", "Expert articles"];

function phaseAt(t, phases) {
  let acc = 0;
  for (const p of phases) {
    if (t < acc + p.seconds) return { phase: p, elapsed: t - acc, remaining: Math.ceil(p.seconds - (t - acc)) };
    acc += p.seconds;
  }
  return { phase: phases[0], elapsed: 0, remaining: phases[0].seconds };
}

function phaseScale(phase, elapsed) {
  const f = Math.min(1, elapsed / phase.seconds);
  if (phase.type === "in") return 0.6 + f * 0.4;
  if (phase.type === "out") return 1.0 - f * 0.4;
  if (phase.type === "hold-full") return 1.0;
  return 0.6;
}

function BreathingExercise() {
  const [patternId, setPatternId] = useState("box");
  const pattern = BREATHING_PATTERNS.find((p) => p.id === patternId);
  const total = pattern.phases.reduce((s, p) => s + p.seconds, 0);
  const [active, setActive] = useState(false);
  const [t, setT] = useState(0);

  React.useEffect(() => {
    setActive(false);
    setT(0);
  }, [patternId]);

  React.useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setT((prev) => (prev + 1) % total), 1000);
    return () => clearInterval(id);
  }, [active, total]);

  const { phase, elapsed, remaining } = phaseAt(t, pattern.phases);
  const scale = active ? phaseScale(phase, elapsed) : 0.6;

  return (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 18 }}>
        {BREATHING_PATTERNS.map((p) => (
          <Chip key={p.id} active={patternId === p.id} onClick={() => setPatternId(p.id)}>{p.label}</Chip>
        ))}
      </div>
      <p style={{ fontSize: 14, color: c.gray600, maxWidth: 440, margin: "0 auto 28px", lineHeight: 1.7 }}>
        {pattern.description}
      </p>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 220 }}>
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: c.navyTint,
            border: `2px solid ${c.navy}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${scale})`,
            transition: "transform 1s linear",
          }}
        >
          <div>
            <p style={{ fontFamily: fonts.display, fontSize: 17, color: c.navy, fontWeight: 600 }}>{active ? phase.label : "Ready"}</p>
            {active && <p style={{ fontFamily: fonts.mono, fontSize: 22, color: c.navy, marginTop: 4 }}>{remaining}</p>}
          </div>
        </div>
      </div>
      <Button variant={active ? "secondary" : "primary"} style={{ marginTop: 20 }} onClick={() => { setActive(!active); setT(0); }}>
        {active ? "Stop" : "Start breathing exercise"}
      </Button>
    </div>
  );
}

function GroundingExercise() {
  const senses = [
    { n: 5, label: "See", prompt: "Name 5 things you can see right now." },
    { n: 4, label: "Touch", prompt: "Name 4 things you can physically feel — a surface, your clothing, the air." },
    { n: 3, label: "Hear", prompt: "Name 3 sounds you can hear, near or far." },
    { n: 2, label: "Smell", prompt: "Name 2 things you can smell, or two smells you like." },
    { n: 1, label: "Taste", prompt: "Name 1 thing you can taste, even just the inside of your mouth." },
  ];
  const [done, setDone] = useState([]);
  const toggle = (i) => setDone((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));

  return (
    <div>
      <div style={{ maxWidth: 520, margin: "0 auto 40px" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: c.navy, marginBottom: 10 }}>5-4-3-2-1 senses</p>
        <p style={{ fontSize: 14, color: c.gray600, marginBottom: 22, lineHeight: 1.7 }}>
          Go through your senses one at a time — it pulls attention out of anxious thoughts and back into the room you're actually in.
        </p>
        {senses.map((s, i) => (
          <div
            key={i}
            onClick={() => toggle(i)}
            style={{
              display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 10, cursor: "pointer", marginBottom: 8,
              border: `1px solid ${done.includes(i) ? c.navy : c.gray300}`,
              background: done.includes(i) ? c.navyTint : c.paper,
            }}
          >
            <div style={{
              width: 30, height: 30, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
              background: done.includes(i) ? c.navy : c.cream, fontFamily: fonts.mono, fontWeight: 600, fontSize: 13,
              color: done.includes(i) ? c.paper : c.navy,
            }}>
              {done.includes(i) ? <Check size={14} /> : s.n}
            </div>
            <div>
              <p style={{ fontSize: 13.5, fontWeight: 600, color: c.ink }}>{s.label}</p>
              <p style={{ fontSize: 12.5, color: c.gray600 }}>{s.prompt}</p>
            </div>
          </div>
        ))}
        {done.length === 5 && (
          <p style={{ fontSize: 13, color: c.navy, fontWeight: 600, textAlign: "center", marginTop: 14 }}>
            Nicely done. Notice whether anything feels even slightly different.
          </p>
        )}
      </div>

      <p style={{ fontSize: 13, fontWeight: 600, color: c.navy, marginBottom: 14, textAlign: "center" }}>More grounding techniques — swipe through</p>
      <SwipeDeck
        items={GROUNDING_TECHNIQUES}
        cardHeight={260}
        renderItem={(g) => (
          <div style={{ background: c.paper, border: `1px solid ${c.gray300}`, borderRadius: 14, padding: 22, height: "100%", boxShadow: "0 1px 2px rgba(14,26,43,0.04), 0 4px 12px rgba(14,26,43,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <h4 style={{ fontFamily: fonts.display, fontSize: 18, fontWeight: 600, color: c.ink }}>{g.title}</h4>
              <span style={{ fontSize: 11, color: c.gray600, background: c.cream, borderRadius: 999, padding: "2px 9px", flexShrink: 0 }}>{g.time}</span>
            </div>
            <p style={{ fontSize: 13, color: c.gray600, marginBottom: 14, lineHeight: 1.6 }}>{g.summary}</p>
            <ol style={{ margin: 0, paddingLeft: 18 }}>
              {g.steps.map((s, i) => (
                <li key={i} style={{ fontSize: 12.5, color: c.ink, marginBottom: 5, lineHeight: 1.5 }}>{s}</li>
              ))}
            </ol>
          </div>
        )}
      />
    </div>
  );
}

function SwipeDeck({ items, renderItem, cardHeight = 220 }) {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startXRef = React.useRef(0);

  const go = (dir) => setIndex((i) => Math.max(0, Math.min(items.length - 1, i + dir)));

  const handleDown = (x) => { setDragging(true); startXRef.current = x; };
  const handleMove = (x) => { if (dragging) setDragX(x - startXRef.current); };
  const handleUp = () => {
    if (!dragging) return;
    setDragging(false);
    if (dragX < -70) go(1);
    else if (dragX > 70) go(-1);
    setDragX(0);
  };

  return (
    <div>
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <button
          onClick={() => go(-1)}
          disabled={index === 0}
          aria-label="Previous card"
          style={{ flexShrink: 0, background: c.paper, border: `1px solid ${c.gray300}`, borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: index === 0 ? "default" : "pointer", opacity: index === 0 ? 0.35 : 1 }}
        >
          <ChevronLeft size={16} color={c.navy} aria-hidden="true" />
        </button>

        <div
          role="group"
          aria-roledescription="carousel"
          aria-label={`Card ${index + 1} of ${items.length}`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(1);
            if (e.key === "ArrowLeft") go(-1);
          }}
          style={{ flex: 1, maxWidth: 460, height: cardHeight, overflow: "hidden", outline: "none" }}
        >
          <div
            onMouseDown={(e) => handleDown(e.clientX)}
            onMouseMove={(e) => handleMove(e.clientX)}
            onMouseUp={handleUp}
            onMouseLeave={handleUp}
            onTouchStart={(e) => handleDown(e.touches[0].clientX)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX)}
            onTouchEnd={handleUp}
            style={{
              height: "100%", cursor: dragging ? "grabbing" : "grab", touchAction: "pan-y",
              transform: `translateX(${dragX}px) rotate(${dragX / 40}deg)`,
              transition: dragging ? "none" : "transform 0.25s ease",
            }}
          >
            {renderItem(items[index], index)}
          </div>
        </div>

        <button
          onClick={() => go(1)}
          disabled={index === items.length - 1}
          aria-label="Next card"
          style={{ flexShrink: 0, background: c.paper, border: `1px solid ${c.gray300}`, borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: index === items.length - 1 ? "default" : "pointer", opacity: index === items.length - 1 ? 0.35 : 1 }}
        >
          <ChevronRight size={16} color={c.navy} aria-hidden="true" />
        </button>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 14 }}>
        {items.map((_, i) => (
          <span
            key={i}
            onClick={() => setIndex(i)}
            style={{ width: i === index ? 18 : 7, height: 7, borderRadius: 999, background: i === index ? c.navy : c.gray300, cursor: "pointer", transition: "width 0.2s" }}
          />
        ))}
      </div>
      <p style={{ textAlign: "center", fontSize: 11, color: c.gray600, marginTop: 8 }}>{index + 1} of {items.length} · swipe or use the arrows</p>
    </div>
  );
}

function QuickTipsGrid() {
  const [cardView, setCardView] = useState(true);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <p style={{ fontSize: 14, color: c.gray600, lineHeight: 1.7, maxWidth: 480 }}>
          Small, immediate things to try when anxiety spikes — not a substitute for ongoing support if it's a regular pattern.
        </p>
        <div style={{ display: "flex", gap: 6 }}>
          <Chip active={cardView} onClick={() => setCardView(true)}>Swipe cards</Chip>
          <Chip active={!cardView} onClick={() => setCardView(false)}>List</Chip>
        </div>
      </div>
      {cardView ? (
        <SwipeDeck
          items={TIPS}
          cardHeight={200}
          renderItem={(t) => (
            <div style={{ background: c.paper, border: `1px solid ${c.gray300}`, borderRadius: 14, padding: 22, height: "100%", boxShadow: "0 1px 2px rgba(14,26,43,0.04), 0 4px 12px rgba(14,26,43,0.06)" }}>
              <h4 style={{ fontFamily: fonts.display, fontSize: 18, fontWeight: 600, color: c.ink, marginBottom: 10 }}>{t.title}</h4>
              <p style={{ fontSize: 13.5, color: c.gray600, lineHeight: 1.7 }}>{t.body}</p>
            </div>
          )}
        />
      ) : (
        <div className="h-grid-2">
          {TIPS.map((t, i) => (
            <div key={i} style={{ background: c.paper, border: `1px solid ${c.gray300}`, borderRadius: 12, padding: 18 }}>
              <h4 style={{ fontFamily: fonts.display, fontSize: 15.5, fontWeight: 600, color: c.ink, marginBottom: 6 }}>{t.title}</h4>
              <p style={{ fontSize: 13, color: c.gray600, lineHeight: 1.6 }}>{t.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GlossaryList() {
  const [query, setQuery] = useState("");
  const [cardView, setCardView] = useState(false);
  const filtered = GLOSSARY.filter((g) => g.term.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: "1 1 260px", display: "flex", alignItems: "center", gap: 8, border: `1px solid ${c.gray300}`, borderRadius: 8, padding: "10px 14px", background: c.paper }}>
          <Search size={15} color={c.gray600} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a term — e.g. 'CBT', 'burnout'"
            style={{ border: "none", outline: "none", fontFamily: fonts.body, fontSize: 14, width: "100%", background: "transparent" }}
          />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <Chip active={cardView} onClick={() => setCardView(true)}>Swipe cards</Chip>
          <Chip active={!cardView} onClick={() => setCardView(false)}>List</Chip>
        </div>
      </div>

      {filtered.length === 0 && <p style={{ fontSize: 13.5, color: c.gray600 }}>No terms match "{query}" yet — try a different word.</p>}

      {filtered.length > 0 && cardView ? (
        <SwipeDeck
          items={filtered}
          cardHeight={220}
          renderItem={(g) => (
            <div style={{ background: c.paper, border: `1px solid ${c.gray300}`, borderRadius: 14, padding: 22, height: "100%", boxShadow: "0 1px 2px rgba(14,26,43,0.04), 0 4px 12px rgba(14,26,43,0.06)" }}>
              <p style={{ fontFamily: fonts.display, fontSize: 19, fontWeight: 600, color: c.ink, marginBottom: 10 }}>{g.term}</p>
              <p style={{ fontSize: 14, color: c.gray600, lineHeight: 1.7 }}>{g.definition}</p>
            </div>
          )}
        />
      ) : (
        filtered.map((g, i) => (
          <div key={i} style={{ padding: "14px 0", borderBottom: `1px solid ${c.gray300}`, maxWidth: 640 }}>
            <p style={{ fontFamily: fonts.display, fontSize: 15.5, fontWeight: 600, color: c.ink, marginBottom: 5 }}>{g.term}</p>
            <p style={{ fontSize: 13.5, color: c.gray600, lineHeight: 1.65 }}>{g.definition}</p>
          </div>
        ))
      )}
    </div>
  );
}

function ExpertArticles({ articles }) {
  if (!articles || articles.length === 0) {
    return (
      <p style={{ fontSize: 13.5, color: c.gray600, maxWidth: 500 }}>
        No articles published yet. Verified professionals can publish short articles or link research from their dashboard — they'll appear here once they do.
      </p>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 700 }}>
      {articles.map((a, i) => (
        <div key={i} style={{ background: c.paper, border: `1px solid ${c.gray300}`, borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 10, flexWrap: "wrap" }}>
            <h4 style={{ fontFamily: fonts.display, fontSize: 17, fontWeight: 600, color: c.ink }}>{a.title}</h4>
            <span style={{ fontSize: 11, color: c.gray600, flexShrink: 0, whiteSpace: "nowrap" }}>Published {a.publishedDate}</span>
          </div>
          <p style={{ fontSize: 13, color: c.gray600, lineHeight: 1.65, marginBottom: 12 }}>{a.body}</p>
          {a.link && <a href={a.link} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: c.navy, marginBottom: 10, display: "inline-block" }}>{a.link}</a>}
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: c.gray600 }}>
            <span><strong style={{ color: c.ink }}>{a.author}</strong></span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ResourcesView({ publishedArticles }) {
  const [tab, setTab] = useState("Breathing");
  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px 80px" }}>
      <h1 style={{ fontFamily: fonts.display, fontSize: 30, color: c.ink, marginBottom: 8, fontWeight: 500 }}>Resources</h1>
      <p style={{ fontSize: 14, color: c.gray600, marginBottom: 20 }}>Self-guided tools and reviewed reading — no account needed.</p>

      <div style={{ background: c.navy, borderRadius: 10, padding: "12px 16px", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
        <ShieldCheck size={16} color={c.gold} style={{ flexShrink: 0 }} />
        <p style={{ fontSize: 12.5, color: "#C6CEDA" }}>
          These tools support wellbeing but aren't a diagnosis or treatment. If you're in immediate danger or crisis, use the Emergency support button in the corner of the screen.
        </p>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {RESOURCE_TABS.map((t) => (
          <Chip key={t} active={tab === t} onClick={() => setTab(t)}>{t}</Chip>
        ))}
      </div>

      <div key={tab} className="h-fade-in-fast" style={{ background: c.paper, border: `1px solid ${c.gray300}`, borderRadius: 16, padding: 28 }}>
        {tab === "Breathing" && <BreathingExercise />}
        {tab === "Grounding" && <GroundingExercise />}
        {tab === "Quick tips" && <QuickTipsGrid />}
        {tab === "Glossary" && <GlossaryList />}
        {tab === "Expert articles" && <ExpertArticles articles={publishedArticles} />}
      </div>
    </main>
  );
}

/* ---------------------------------- PROFESSIONAL DASHBOARD ---------------------------------- */

const MOCK_APPOINTMENTS = [
  { date: "2026-08-18", time: "10:00", label: "Client session — S.K." },
  { date: "2026-08-18", time: "14:30", label: "Supervision call" },
  { date: "2026-08-20", time: "09:00", label: "Client session — new intake" },
  { date: "2026-08-24", time: "16:00", label: "Team case review" },
];

const MOCK_ENQUIRIES = [
  { id: 1, name: "R. Thomas", mode: "Email", message: "Looking for weekly sessions for work-related anxiety, prefer evenings.", read: false, date: "2 hours ago" },
  { id: 2, name: "M. Al Suwaidi", mode: "WhatsApp", message: "Do you see couples for premarital counselling, and in Arabic?", read: false, date: "Yesterday" },
  { id: 3, name: "J. Fernandes", mode: "Phone", message: "My son is 14 and struggling since we moved. Do you work with teenagers?", read: true, date: "3 days ago" },
];

function DashboardView({ account, onBack, publishedArticles, setPublishedArticles, directory, onDeleteProfile }) {
  const [tab, setTab] = useState("overview");
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [enquiries, setEnquiries] = useState(MOCK_ENQUIRIES);
  const unread = enquiries.filter((e) => !e.read).length;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "calendar", label: "Calendar" },
    { id: "enquiries", label: `Enquiries${unread ? ` (${unread})` : ""}` },
    { id: "articles", label: "Articles & publications" },
    { id: "share", label: "Share card" },
  ];

  const mockProfile = { name: account?.name || "Your profile", title: account?.title || "Professional", status: "pending", location: account?.location || "Not set", languages: account?.languages || "Not set", initials: (account?.name || "You").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() };
  const myArticles = publishedArticles.filter((a) => a.author === (account?.name || mockProfile.name));
  const myEntry = directory.find((d) => d._ownerEmail && account?.email && d._ownerEmail === account.email) || null;

  return (
    <main style={{ maxWidth: 1080, margin: "0 auto", padding: "32px 24px 80px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: c.gray600, fontSize: 13, marginBottom: 16, cursor: "pointer", fontFamily: fonts.body, display: "flex", alignItems: "center", gap: 6 }}>
        <ArrowLeft size={14} /> Exit dashboard
      </button>
      <h1 style={{ fontFamily: fonts.display, fontSize: 28, color: c.ink, marginBottom: 4, fontWeight: 500 }}>Welcome back, {mockProfile.name.split(" ")[0]}</h1>
      <p style={{ fontSize: 13.5, color: c.gray600, marginBottom: 24 }}>Manage your calendar, enquiries, and published content from here.</p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {tabs.map((t) => (
          <Chip key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>{t.label}</Chip>
        ))}
      </div>

      <div key={tab} className="h-fade-in-fast">
        {tab === "overview" && <DashboardOverview appointments={appointments} enquiries={enquiries} onGo={setTab} myEntry={myEntry} onDeleteProfile={onDeleteProfile} />}
        {tab === "calendar" && <DashboardCalendar appointments={appointments} setAppointments={setAppointments} />}
        {tab === "enquiries" && <DashboardEnquiries enquiries={enquiries} setEnquiries={setEnquiries} />}
        {tab === "articles" && <DashboardArticles articles={myArticles} authorName={account?.name || mockProfile.name} setPublishedArticles={setPublishedArticles} />}
        {tab === "share" && <DashboardShare profile={mockProfile} />}
      </div>
    </main>
  );
}

function DashboardOverview({ appointments, enquiries, onGo, myEntry, onDeleteProfile }) {
  const upcoming = appointments.slice(0, 3);
  const unread = enquiries.filter((e) => !e.read);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const meta = myEntry ? (STATUS_META[myEntry.status] || { label: myEntry.status }) : null;

  return (
    <div className="h-grid-3-tight">
      <div style={{ background: c.paper, border: `1px solid ${c.gray300}`, borderRadius: 12, padding: 20, gridColumn: "span 1" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Bell size={15} color={c.navy} />
          <p style={{ fontSize: 13, fontWeight: 600, color: c.ink }}>New enquiries</p>
        </div>
        <p style={{ fontFamily: fonts.display, fontSize: 34, color: c.navy, marginBottom: 8 }}>{unread.length}</p>
        <Button variant="secondary" style={{ fontSize: 12.5, padding: "7px 12px" }} onClick={() => onGo("enquiries")}>View all</Button>
      </div>
      <div style={{ background: c.paper, border: `1px solid ${c.gray300}`, borderRadius: 12, padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Calendar size={15} color={c.navy} />
          <p style={{ fontSize: 13, fontWeight: 600, color: c.ink }}>Upcoming this week</p>
        </div>
        <p style={{ fontFamily: fonts.display, fontSize: 34, color: c.navy, marginBottom: 8 }}>{appointments.length}</p>
        <Button variant="secondary" style={{ fontSize: 12.5, padding: "7px 12px" }} onClick={() => onGo("calendar")}>Open calendar</Button>
      </div>
      <div style={{ background: c.navy, borderRadius: 12, padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          {myEntry?.status === "verified" ? <Seal size={16} /> : <Clock size={15} color={c.gold} />}
          <p style={{ fontSize: 13, fontWeight: 600, color: c.paper }}>Profile status</p>
        </div>
        {myEntry ? (
          <>
            <p style={{ fontSize: 13.5, color: c.goldTint, marginBottom: 8 }}>{meta.label}</p>
            <p style={{ fontSize: 11.5, color: "#C6CEDA" }}>{myEntry.name} · {myEntry.location}</p>
          </>
        ) : (
          <p style={{ fontSize: 12.5, color: "#C6CEDA", lineHeight: 1.6 }}>No profile registered under this account yet.</p>
        )}
      </div>

      <div style={{ gridColumn: "span 3", background: c.paper, border: `1px solid ${c.gray300}`, borderRadius: 12, padding: 20 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: c.ink, marginBottom: 12 }}>Next up</p>
        {upcoming.map((a, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < upcoming.length - 1 ? `1px solid ${c.gray300}` : "none" }}>
            <span style={{ fontSize: 13, color: c.ink }}>{a.label}</span>
            <span style={{ fontFamily: fonts.mono, fontSize: 12, color: c.gray600 }}>{a.date} · {a.time}</span>
          </div>
        ))}
      </div>

      {myEntry && (
        <div style={{ gridColumn: "span 3", background: c.paper, border: `1px solid ${c.gray300}`, borderRadius: 12, padding: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: c.ink, marginBottom: 6 }}>Delete your profile</p>
          <p style={{ fontSize: 12.5, color: c.gray600, marginBottom: 12, lineHeight: 1.6 }}>
            Permanently removes {myEntry.name} from the directory and search results. This can't be undone from here — you'd need to register again.
          </p>
          {confirmDelete ? (
            <div style={{ display: "flex", gap: 8 }}>
              <Button
                variant="secondary"
                style={{ color: c.red, borderColor: c.red, fontSize: 12.5, padding: "7px 12px" }}
                onClick={() => { onDeleteProfile(myEntry.id); setConfirmDelete(false); }}
              >
                Confirm delete
              </Button>
              <Button variant="ghost" style={{ fontSize: 12.5, padding: "7px 12px" }} onClick={() => setConfirmDelete(false)}>Cancel</Button>
            </div>
          ) : (
            <Button variant="secondary" style={{ color: c.red, borderColor: c.red, fontSize: 12.5, padding: "7px 12px" }} onClick={() => setConfirmDelete(true)}>
              <Trash2 size={13} /> Delete my profile
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function DashboardCalendar({ appointments, setAppointments }) {
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newLabel, setNewLabel] = useState("");
  const [newTime, setNewTime] = useState("09:00");

  const base = new Date(2026, 7 + monthOffset, 1); // Aug 2026 baseline
  const year = base.getFullYear();
  const month = base.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = base.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const dateKey = (d) => `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const apptsFor = (key) => appointments.filter((a) => a.date === key);

  const addAppointment = () => {
    if (!selectedDate || !newLabel.trim()) return;
    setAppointments((prev) => [...prev, { date: selectedDate, time: newTime, label: newLabel.trim() }].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)));
    setNewLabel("");
  };

  return (
    <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      <div style={{ flex: "1 1 380px", background: c.paper, border: `1px solid ${c.gray300}`, borderRadius: 12, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <button onClick={() => setMonthOffset((m) => m - 1)} style={{ background: "none", border: "none", cursor: "pointer", color: c.gray600 }}><ChevronLeft size={18} /></button>
          <p style={{ fontFamily: fonts.display, fontSize: 16, fontWeight: 600, color: c.ink }}>{monthLabel}</p>
          <button onClick={() => setMonthOffset((m) => m + 1)} style={{ background: "none", border: "none", cursor: "pointer", color: c.gray600 }}><ChevronRight size={18} /></button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 6 }}>
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} style={{ textAlign: "center", fontSize: 11, color: c.gray600, fontWeight: 600 }}>{d}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {cells.map((d, i) => {
            if (!d) return <div key={i} />;
            const key = dateKey(d);
            const has = apptsFor(key).length > 0;
            const isSelected = selectedDate === key;
            return (
              <div
                key={i}
                onClick={() => setSelectedDate(key)}
                style={{
                  aspectRatio: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  borderRadius: 8, cursor: "pointer", fontSize: 12.5,
                  border: `1px solid ${isSelected ? c.navy : "transparent"}`,
                  background: isSelected ? c.navyTint : c.cream,
                  color: c.ink,
                }}
              >
                {d}
                {has && <span style={{ width: 4, height: 4, borderRadius: "50%", background: c.gold, marginTop: 2 }} />}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ flex: "1 1 300px", background: c.paper, border: `1px solid ${c.gray300}`, borderRadius: 12, padding: 20 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: c.ink, marginBottom: 12 }}>
          {selectedDate ? selectedDate : "Select a day"}
        </p>
        {selectedDate && apptsFor(selectedDate).length === 0 && (
          <p style={{ fontSize: 12.5, color: c.gray600, marginBottom: 12 }}>Nothing scheduled yet.</p>
        )}
        {selectedDate && apptsFor(selectedDate).map((a, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${c.gray300}` }}>
            <span style={{ fontSize: 13, color: c.ink }}>{a.label}</span>
            <span style={{ fontFamily: fonts.mono, fontSize: 12, color: c.gray600 }}>{a.time}</span>
          </div>
        ))}
        {selectedDate && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${c.gray300}` }}>
            <p style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: c.gray600, marginBottom: 8 }}>Add to this day</p>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} style={{ border: `1px solid ${c.gray300}`, borderRadius: 8, padding: "8px 10px", fontSize: 13, fontFamily: fonts.mono }} />
              <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Session, engagement, note..." style={{ flex: 1, border: `1px solid ${c.gray300}`, borderRadius: 8, padding: "8px 10px", fontSize: 13 }} />
            </div>
            <Button variant="primary" style={{ width: "100%", justifyContent: "center", fontSize: 13 }} onClick={addAppointment}>
              <Plus size={14} /> Add
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardEnquiries({ enquiries, setEnquiries }) {
  const [openId, setOpenId] = useState(null);
  const markRead = (id) => setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, read: true } : e)));

  return (
    <div style={{ maxWidth: 700 }}>
      {enquiries.map((e) => (
        <div
          key={e.id}
          onClick={() => { setOpenId(openId === e.id ? null : e.id); markRead(e.id); }}
          style={{
            background: c.paper, border: `1px solid ${e.read ? c.gray300 : c.navy}`, borderRadius: 12, padding: 16, marginBottom: 10, cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {!e.read && <span style={{ width: 7, height: 7, borderRadius: "50%", background: c.navy }} />}
              <span style={{ fontSize: 14, fontWeight: 600, color: c.ink }}>{e.name}</span>
              <span style={{ fontSize: 11, background: c.navyTint, color: c.navy, borderRadius: 999, padding: "1px 8px" }}>{e.mode}</span>
            </div>
            <span style={{ fontSize: 11.5, color: c.gray600 }}>{e.date}</span>
          </div>
          {openId === e.id && (
            <p style={{ fontSize: 13, color: c.ink, marginTop: 10, lineHeight: 1.6, paddingTop: 10, borderTop: `1px solid ${c.gray300}` }}>{e.message}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function DashboardArticles({ articles, authorName, setPublishedArticles }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [link, setLink] = useState("");

  const publish = () => {
    if (!title.trim()) return;
    setPublishedArticles((prev) => [
      { id: Date.now(), title: title.trim(), body, link, author: authorName, publishedDate: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) },
      ...prev,
    ]);
    setTitle(""); setBody(""); setLink("");
  };
  const remove = (id) => setPublishedArticles((prev) => prev.filter((a) => a.id !== id));

  return (
    <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      <div style={{ flex: "1 1 320px", background: c.paper, border: `1px solid ${c.gray300}`, borderRadius: 12, padding: 20 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: c.ink, marginBottom: 12 }}>Publish something new</p>
        <TextField label="Title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Recognising burnout early" />
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: c.ink, marginBottom: 6 }}>Article or summary</label>
          <textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Short article, or a summary of a publication." style={{ width: "100%", border: `1px solid ${c.gray300}`, borderRadius: 8, padding: "10px 12px", fontFamily: fonts.body, fontSize: 14, resize: "vertical" }} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: c.ink, marginBottom: 6 }}>
            <Link2 size={13} /> Research publication link (optional)
          </label>
          <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://doi.org/..." style={{ width: "100%", border: `1px solid ${c.gray300}`, borderRadius: 8, padding: "10px 12px", fontFamily: fonts.body, fontSize: 14 }} />
        </div>
        <Button variant="primary" style={{ width: "100%", justifyContent: "center" }} onClick={publish}>
          <FileText size={14} /> Publish to profile
        </Button>
        <p style={{ fontSize: 11, color: c.gray600, marginTop: 10, lineHeight: 1.5 }}>Publishing here also adds it to the public Resources → Expert articles page immediately — there's no admin moderation step in this pilot yet.</p>
      </div>

      <div style={{ flex: "1 1 320px" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: c.ink, marginBottom: 12 }}>Published ({articles.length})</p>
        {articles.length === 0 && <p style={{ fontSize: 13, color: c.gray600 }}>Nothing published yet — it'll appear on the public Resources page once you do.</p>}
        {articles.map((a) => (
          <div key={a.id} style={{ background: c.paper, border: `1px solid ${c.gray300}`, borderRadius: 12, padding: 16, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: c.ink }}>{a.title}</p>
              <button onClick={() => remove(a.id)} aria-label={`Remove ${a.title}`} style={{ background: "none", border: "none", cursor: "pointer", color: c.gray600, flexShrink: 0 }}><Trash2 size={14} /></button>
            </div>
            {a.body && <p style={{ fontSize: 12.5, color: c.gray600, marginTop: 6, lineHeight: 1.6 }}>{a.body}</p>}
            {a.link && <a href={a.link} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: c.navy, marginTop: 6, display: "inline-block" }}>{a.link}</a>}
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardShare({ profile }) {
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    if (canvasRef.current) drawShareCard(canvasRef.current, profile, false, `heurisko.com/p/${profile.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`);
  }, [profile]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "my-heurisko-card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div style={{ maxWidth: 420 }}>
      <p style={{ fontSize: 13.5, color: c.gray600, marginBottom: 16, lineHeight: 1.6 }}>
        A ready-to-post card for your own social channels — pulls directly from your published profile, so it always stays current.
      </p>
      <div style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${c.gray300}`, marginBottom: 14 }}>
        <canvas ref={canvasRef} role="img" aria-label={`Shareable card for ${profile.name}, ${profile.title}`} style={{ width: "100%", display: "block" }} />
      </div>
      <Button variant="primary" style={{ width: "100%", justifyContent: "center" }} onClick={download}>
        <Download size={14} /> Download for socials
      </Button>
    </div>
  );
}

/* ---------------------------------- ADMIN VERIFICATION ---------------------------------- */

// Real submissions only — the admin queue starts empty and fills as real people
// register through the app; persisted to shared storage in the root component.

const ADMIN_ACTIONS = [
  { id: "approve", label: "Approve Verification", variant: "primary" },
  { id: "info", label: "Request More Information", variant: "secondary" },
  { id: "flag", label: "Flag for Further Review", variant: "secondary" },
  { id: "reject", label: "Reject Credential", variant: "danger" },
];

const STATUS_META = {
  auto_verified_pending_admin: { label: "Primary check passed — awaiting admin", bg: c.goldTint, fg: "#5C4A21" },
  needs_review: { label: "Needs manual review", bg: "#FBF3E4", fg: "#8A6416" },
  flagged: { label: "Flagged", bg: "#FBEEEC", fg: c.red },
  info_requested: { label: "More info requested", bg: c.navyTint, fg: c.navy },
  rejected: { label: "Rejected", bg: "#FBEEEC", fg: c.red },
  verified: { label: "Verified", bg: c.goldTint, fg: "#5C4A21" },
};

// Real discoveries only — starts empty (this pilot has no live discovery pipeline
// behind it; see HEURISKO_DISCOVERY_ARCHITECTURE.md). Claims against real external
// listings would land here once that pipeline exists.

const DISCOVERY_STATUS_META = {
  pending_publication: { label: "Awaiting admin publish", bg: c.navyTint, fg: c.navy },
  low_confidence: { label: "Low confidence", bg: "#FBEEEC", fg: c.red },
  possible_duplicate: { label: "Possible duplicate", bg: "#FBF3E4", fg: "#8A6416" },
  published: { label: "Published", bg: c.goldTint, fg: "#5C4A21" },
  rejected: { label: "Rejected", bg: "#FBEEEC", fg: c.red },
};

const DISCOVERY_ACTIONS = ["Publish", "Edit", "Merge", "Reject", "Refresh", "Flag", "Remove"];

const VERIFICATION_FLOW_STAGES = [
  "Profile created", "Credential uploaded", "Document processing", "Automated extraction",
  "Profile/document comparison", "Preliminary match score", "Primary verification complete",
  "Admin review pending", "Admin decision", "Verified / info required / rejected",
];

function VerificationFlowDiagram() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
      {VERIFICATION_FLOW_STAGES.map((s, i) => (
        <React.Fragment key={s}>
          <span style={{ fontSize: 10.5, color: c.gray600, background: c.cream, border: `1px solid ${c.gray300}`, borderRadius: 999, padding: "4px 10px", whiteSpace: "nowrap" }}>{s}</span>
          {i < VERIFICATION_FLOW_STAGES.length - 1 && <ChevronRight size={12} color={c.gray300} style={{ alignSelf: "center" }} aria-hidden="true" />}
        </React.Fragment>
      ))}
    </div>
  );
}

// PROTOTYPE ONLY. There is no real admin authentication behind this button —
// it exists purely to demo the admin dashboard's contents. A real numeric
// "access code" must never ship, even as a labeled placeholder: a code that
// actually works is a real bypass no matter how it's commented. Production
// admin entry is a dedicated authenticated route with real credentials, MFA,
// and rate limiting — see HEURISKO_PRODUCTION_READINESS.md §1.
function AdminLoginPanel({ onAuthed }) {
  return (
    <div style={{ background: c.navy, borderRadius: 12, padding: 24, maxWidth: 360, marginTop: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <ShieldCheck size={16} color={c.gold} />
        <p style={{ fontFamily: fonts.display, fontSize: 15, color: c.paper, fontWeight: 600 }}>Admin entry (prototype)</p>
      </div>
      <p style={{ fontSize: 11.5, color: "#C6CEDA", lineHeight: 1.6, marginBottom: 16 }}>
        This reveal exists only to demo the admin dashboard's contents in this prototype. There is no working access code here on purpose — a code that actually unlocked anything would be a real security bypass, not a demo. Production admin entry is a separate authenticated route with real credentials, MFA, and rate limiting.
      </p>
      <button
        onClick={onAuthed}
        title="Prototype only — bypasses real auth, for demo purposes"
        style={{ width: "100%", fontSize: 12, fontFamily: fonts.mono, color: c.sage, background: "#1E3350", border: `1px dashed ${c.sage}`, borderRadius: 8, padding: "10px 14px", cursor: "pointer" }}
      >
        ⚙ Test: enter admin dashboard (prototype only)
      </button>
    </div>
  );
}

function AboutView() {
  const [tab, setTab] = useState("Public users");
  const audiences = {
    "Public users": "Search professionals and institutions without creating an account. Filter by speciality, language, location, and consultation mode. Free, and always will be for basic search.",
    "Professionals": "Create a verified profile, manage your own credentials, and connect with people looking for exactly what you offer — not just a generic listing.",
    "Institutions": "Represent your clinic, hospital, or organisation with a managed profile, branch locations, and a real team directory.",
  };

  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "32px 24px 100px" }}>
      <h1 style={{ fontFamily: fonts.display, fontSize: 30, color: c.ink, marginBottom: 8, fontWeight: 500 }}>About Heurisko</h1>
      <p style={{ fontSize: 14, color: c.gray600, marginBottom: 32, lineHeight: 1.7 }}>
        Heurisko — from the Greek <em>heurisko</em>, "I find" — is a directory built around one idea: finding the right kind of mental health support shouldn't depend on luck, a friend's recommendation, or an unstructured web search.
      </p>

      <Section title="Our vision">
        <p style={{ fontSize: 14, color: c.ink, lineHeight: 1.75 }}>
          A mental health ecosystem where people find appropriate care based on their actual needs — speciality, language, location, and how they want to be seen — rather than depending only on informal recommendations or general internet searches. Support that's easier to discover, easier to compare, and genuinely trustworthy.
        </p>
      </Section>

      <Section title="Our mission">
        <p style={{ fontSize: 14, color: c.ink, lineHeight: 1.75 }}>
          To give the public a searchable, verified directory of mental health professionals and institutions — and to give those professionals and institutions a trusted place to be found, without pretending a verification badge can promise a personal fit or a treatment outcome. We say plainly what we are: a directory and information platform, not a clinical service and not an emergency response line.
        </p>
      </Section>

      <Section title="Our goals">
        <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            "Make verification mean something — every badge traces back to an actual licence, authority, and expiry date, checked by a person, not just an algorithm.",
            "Make the directory accessible across locations, languages, age groups, and specialities, not just the loudest or best-marketed listings.",
            "Keep the basic search experience free and free of pay-to-rank tricks — sponsored visibility, if it ever exists, will always be clearly labelled and will never override clinical relevance.",
            "Build the credential and admin-review workflow to a standard we'd trust with our own family's search for care.",
          ].map((g, i) => (
            <li key={i} style={{ fontSize: 14, color: c.ink, lineHeight: 1.7 }}>{g}</li>
          ))}
        </ul>
      </Section>

      <Section title="Who it's for">
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {Object.keys(audiences).map((t) => (
            <Chip key={t} active={tab === t} onClick={() => setTab(t)}>{t}</Chip>
          ))}
        </div>
        <p key={tab} className="h-fade-in-fast" style={{ fontSize: 14, color: c.ink, lineHeight: 1.75 }}>{audiences[tab]}</p>
      </Section>

      <Section title="Where we are right now">
        <p style={{ fontSize: 14, color: c.ink, lineHeight: 1.75 }}>
          This is an early pilot, open to a small group of testers before any public launch. The directory starts empty on purpose — every profile you see was created by a real tester going through the real sign-up, registration, or claim flow, not seeded demo data. We'd rather you see it exactly as it is at this stage than a polished façade.
        </p>
      </Section>

      <div style={{ background: c.navyTint, borderRadius: 8, padding: "8px 14px", marginBottom: 8, display: "inline-block" }}>
        <p style={{ fontSize: 11.5, color: c.navy, fontFamily: fonts.mono }}>PLACEHOLDER — pending real content</p>
      </div>
      <Section title="Team & founding story">
        <p style={{ fontSize: 13.5, color: c.gray600, lineHeight: 1.7, fontStyle: "italic" }}>
          Space reserved for who's behind Heurisko and why — to be written once we're ready to share it publicly.
        </p>
      </Section>
    </main>
  );
}

function ContactView({ isAdminAuthed, onAdminAuthed }) {
  const [redClicks, setRedClicks] = useState(0);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const clickDot = (color) => {
    if (color !== "red") return;
    const next = redClicks + 1;
    setRedClicks(next);
    if (next >= 5) setShowAdminLogin(true);
  };

  const sections = [
    { icon: <MessageSquare size={16} />, title: "General enquiries", email: "hello@heurisko.example (placeholder)", note: "Questions about the platform, partnerships, or press." },
    { icon: <Users size={16} />, title: "Professional & institution support", email: "partners@heurisko.example (placeholder)", note: "Help with your listing, affiliations, or dashboard." },
    { icon: <ShieldCheck size={16} />, title: "Credential verification enquiries", email: "verification@heurisko.example (placeholder)", note: "Questions about a submitted document or verification status." },
    { icon: <SlidersHorizontal size={16} />, title: "Technical support", email: "support@heurisko.example (placeholder)", note: "Bugs, login issues, or anything not working as expected." },
  ];

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px 100px" }}>
      <h1 style={{ fontFamily: fonts.display, fontSize: 28, color: c.ink, marginBottom: 6, fontWeight: 500 }}>Contact</h1>
      <div style={{ background: c.navyTint, borderRadius: 8, padding: "8px 14px", marginBottom: 24, display: "inline-block" }}>
        <p style={{ fontSize: 11.5, color: c.navy, fontFamily: fonts.mono }}>PLACEHOLDER CONTENT — final contact details pending, do not treat as production data</p>
      </div>

      <div className="h-grid-2" style={{ marginBottom: 24 }}>
        {sections.map((s, i) => (
          <div key={i} style={{ background: c.paper, border: `1px solid ${c.gray300}`, borderRadius: 12, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: c.navy }}>
              {s.icon}
              <p style={{ fontSize: 14, fontWeight: 600, color: c.ink }}>{s.title}</p>
            </div>
            <p style={{ fontSize: 12.5, color: c.gray600, marginBottom: 8, lineHeight: 1.5 }}>{s.note}</p>
            <p style={{ fontFamily: fonts.mono, fontSize: 12, color: c.navy }}>{s.email}</p>
          </div>
        ))}
      </div>

      <div style={{ background: c.paper, border: `1px solid ${c.gray300}`, borderRadius: 12, padding: 20, marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Phone size={15} color={c.gray600} />
            <span style={{ fontSize: 13, color: c.ink, fontFamily: fonts.mono }}>+971 4 000 0000 (placeholder)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <MapPin size={15} color={c.gray600} />
            <span style={{ fontSize: 13, color: c.ink }}>Office location TBD — Dubai, UAE (placeholder)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Clock size={15} color={c.gray600} />
            <span style={{ fontSize: 13, color: c.ink }}>Expected response: 1–2 business days (placeholder)</span>
          </div>
        </div>
        <p style={{ fontSize: 13, fontWeight: 600, color: c.ink, marginBottom: 10 }}>Send a message</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <input placeholder="Your name" style={{ border: `1px solid ${c.gray300}`, borderRadius: 8, padding: "9px 12px", fontSize: 13 }} />
          <input placeholder="Your email" style={{ border: `1px solid ${c.gray300}`, borderRadius: 8, padding: "9px 12px", fontSize: 13 }} />
        </div>
        <input placeholder="Subject" style={{ width: "100%", border: `1px solid ${c.gray300}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, marginBottom: 10 }} />
        <textarea rows={4} placeholder="Message" style={{ width: "100%", border: `1px solid ${c.gray300}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, marginBottom: 12, resize: "vertical" }} />
        <Button variant="primary">Send message</Button>
      </div>

      {/* Decorative status row — doubles as a discreet prototype-only admin entry point.
          Click the red dot five times to reveal the demo entry button below. No numeric
          code is used anywhere in this flow — see HEURISKO_PRODUCTION_READINESS.md §3
          for why a hidden UI gesture must never be real access control. */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", opacity: 0.5 }}>
        {["gray300", "navy", "gold", "sage", "red"].map((color) => (
          <span
            key={color}
            onClick={() => clickDot(color === "red" ? "red" : "other")}
            title="System status"
            style={{ width: 8, height: 8, borderRadius: "50%", background: c[color] || c.gray300, cursor: "default" }}
          />
        ))}
      </div>

      {showAdminLogin && !isAdminAuthed && <AdminLoginPanel onAuthed={onAdminAuthed} />}
      {isAdminAuthed && (
        <p style={{ textAlign: "center", fontSize: 12, color: c.sage, marginTop: 16 }}>Admin session active — an "Admin queue" link is now in the top navigation for the rest of this visit.</p>
      )}
    </main>
  );
}

function AdminQueueDetail({ item, onAction, onClose }) {
  useModalA11y(onClose);
  return (
    <div onClick={onClose} className="h-fade-in-fast" style={{ position: "fixed", inset: 0, background: "rgba(14,26,43,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: 20 }}>
      <div className="h-pop" role="dialog" aria-modal="true" aria-labelledby="admin-review-title" onClick={(e) => e.stopPropagation()} style={{ background: c.paper, borderRadius: 16, padding: 26, width: 640, maxWidth: "100%", maxHeight: "88vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          <div>
            <h3 id="admin-review-title" style={{ fontFamily: fonts.display, fontSize: 20, fontWeight: 600, color: c.ink }}>{item.name}</h3>
            <p style={{ fontSize: 12.5, color: c.gray600 }}>{item.type === "institution" ? "Institution" : "Professional"} · Submitted {item.submittedDate}</p>
          </div>
          <button onClick={onClose} aria-label="Close review dialog" style={{ background: "none", border: "none", cursor: "pointer", color: c.gray600 }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: "flex", gap: 12, margin: "16px 0" }}>
          <div style={{ background: c.navy, borderRadius: 10, padding: "8px 14px", textAlign: "center" }}>
            <p style={{ fontFamily: fonts.mono, fontSize: 18, color: c.gold, fontWeight: 600 }}>{item.autoScore ?? "—"}%</p>
            <p style={{ fontSize: 9.5, color: "#C6CEDA", textTransform: "uppercase" }}>Field match</p>
          </div>
          <div style={{ background: c.cream, border: `1px solid ${c.gray300}`, borderRadius: 10, padding: "8px 14px", textAlign: "center" }}>
            <p style={{ fontFamily: fonts.mono, fontSize: 18, color: c.ink, fontWeight: 600 }}>{item.docScore ?? "—"}%</p>
            <p style={{ fontSize: 9.5, color: c.gray600, textTransform: "uppercase" }}>Doc readability</p>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: c.gray600 }}>
            <FileText size={14} /> {item.documentName || "No document on file"}
          </div>
        </div>

        <p style={{ fontSize: 12, fontWeight: 600, color: c.ink, marginBottom: 8 }}>Field comparison</p>
        <div style={{ border: `1px solid ${c.gray300}`, borderRadius: 10, overflow: "hidden", marginBottom: 14 }}>
          {item.fields.length === 0 && <p style={{ fontSize: 12.5, color: c.gray600, padding: 14 }}>No document was processed for this submission.</p>}
          {item.fields.map((r, i) => {
            const m = MATCH_LABEL[r.status];
            return (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr 0.9fr", gap: 10, padding: "9px 14px", borderBottom: i < item.fields.length - 1 ? `1px solid ${c.gray300}` : "none", background: i % 2 ? c.cream : c.paper, alignItems: "center" }}>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: c.ink }}>{r.field}</span>
                <span style={{ fontSize: 11.5, color: c.gray600 }}>{r.submitted}</span>
                <span style={{ fontSize: 11.5, color: c.gray600, fontFamily: fonts.mono }}>{r.extracted || "—"}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: m.fg, background: m.bg, borderRadius: 999, padding: "3px 8px", textAlign: "center", justifySelf: "start" }}>{m.label}</span>
              </div>
            );
          })}
        </div>

        {item.flags.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            {item.flags.map((f, i) => (
              <p key={i} style={{ fontSize: 12, color: c.red, background: "#FBEEEC", borderRadius: 8, padding: "8px 12px", marginBottom: 6 }}>⚑ {f}</p>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: 16, borderTop: `1px solid ${c.gray300}` }}>
          {ADMIN_ACTIONS.map((a) => (
            <Button
              key={a.id}
              variant={a.variant === "danger" ? "secondary" : a.variant}
              style={a.variant === "danger" ? { color: c.red, borderColor: c.red } : undefined}
              onClick={() => onAction(item, a.id)}
            >
              {a.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

function DirectoryManagement({ directory, onDelete, onSetVisibility, onToggleFlag, logAction }) {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  if (directory.length === 0) {
    return <p style={{ fontSize: 13.5, color: c.gray600, padding: "10px 0" }}>No profiles in the directory yet.</p>;
  }

  return (
    <div key="directory" className="h-fade-in-fast" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <p style={{ fontSize: 12.5, color: c.gray600, marginBottom: 4 }}>
        Every registered, pending, unclaimed, or verified profile currently in the live directory — separate from the review queue above.
      </p>
      {directory.map((d) => {
        const meta = STATUS_META[d.status] || { label: d.status, bg: c.navyTint, fg: c.navy };
        return (
          <div key={d.id} style={{ background: c.paper, border: `1px solid ${d.flaggedForReview ? c.red : c.gray300}`, borderRadius: 12, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
              <div style={{ minWidth: 200 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: c.ink }}>{d.name}</p>
                <p style={{ fontSize: 11.5, color: c.gray600 }}>{d.type === "institution" ? "Institution" : "Professional"} · {d.location}</p>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: meta.fg, background: meta.bg, borderRadius: 999, padding: "4px 10px" }}>{meta.label}</span>
              {d.hidden && <span style={{ fontSize: 11, fontWeight: 600, color: c.gray600, background: c.cream, border: `1px solid ${c.gray300}`, borderRadius: 999, padding: "4px 10px" }}>Hidden from search</span>}
              {d.flaggedForReview && <span style={{ fontSize: 11, fontWeight: 600, color: c.red, background: "#FBEEEC", borderRadius: 999, padding: "4px 10px" }}>Flagged</span>}
            </div>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <button
                onClick={() => { onSetVisibility(d.id, !d.hidden); logAction(d.hidden ? "Made profile visible" : "Hid profile from search", d.name); }}
                className="h-btn-anim"
                style={{ fontSize: 11.5, fontWeight: 600, color: c.navy, background: c.cream, border: `1px solid ${c.gray300}`, borderRadius: 6, padding: "5px 10px", cursor: "pointer" }}
              >
                {d.hidden ? "Show in search" : "Hide from search"}
              </button>
              <button
                onClick={() => { onToggleFlag(d.id); logAction(d.flaggedForReview ? "Removed flag" : "Flagged profile for review", d.name); }}
                className="h-btn-anim"
                style={{ fontSize: 11.5, fontWeight: 600, color: d.flaggedForReview ? c.gray600 : c.red, background: c.cream, border: `1px solid ${d.flaggedForReview ? c.gray300 : c.red}`, borderRadius: 6, padding: "5px 10px", cursor: "pointer" }}
              >
                {d.flaggedForReview ? "Clear flag" : "Flag for review"}
              </button>
              {confirmDeleteId === d.id ? (
                <>
                  <button
                    onClick={() => { onDelete(d.id); logAction("Deleted profile", d.name); setConfirmDeleteId(null); }}
                    className="h-btn-anim"
                    style={{ fontSize: 11.5, fontWeight: 600, color: "#FFFFFF", background: c.red, border: `1px solid ${c.red}`, borderRadius: 6, padding: "5px 10px", cursor: "pointer" }}
                  >
                    Confirm delete
                  </button>
                  <button onClick={() => setConfirmDeleteId(null)} className="h-btn-anim" style={{ fontSize: 11.5, fontWeight: 600, color: c.gray600, background: c.cream, border: `1px solid ${c.gray300}`, borderRadius: 6, padding: "5px 10px", cursor: "pointer" }}>
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setConfirmDeleteId(d.id)}
                  className="h-btn-anim"
                  style={{ fontSize: 11.5, fontWeight: 600, color: c.red, background: c.cream, border: `1px solid ${c.red}`, borderRadius: 6, padding: "5px 10px", cursor: "pointer" }}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AdminView({ queue, setQueue, auditTrail, setAuditTrail, directory, setDirectory, onDeleteDirectoryEntry, onSetVisibility, onToggleFlag, discoveryQueue, setDiscoveryQueue, onExit }) {
  const [openItem, setOpenItem] = useState(null);
  const [tab, setTab] = useState("queue");

  const sorted = [...queue].sort((a, b) => {
    if (a.status === "flagged" && b.status !== "flagged") return -1;
    if (b.status === "flagged" && a.status !== "flagged") return 1;
    return (a.autoScore ?? 0) - (b.autoScore ?? 0);
  });

  const applyAction = (item, actionId) => {
    const newStatus = { approve: "verified", info: "info_requested", flag: "flagged", reject: "rejected" }[actionId];
    setQueue((prev) => prev.map((q) => (q.id === item.id ? { ...q, status: newStatus } : q)));
    if (actionId === "approve") {
      setDirectory((prev) => prev.map((d) => (d._queueId === item.id ? { ...d, status: "verified" } : d)));
    }
    if (actionId === "reject") {
      // A rejected submission comes out of public search entirely rather than sitting
      // visible with a confusing status — the person can re-submit if they correct it.
      setDirectory((prev) => prev.filter((d) => d._queueId !== item.id));
    }
    setAuditTrail((prev) => [
      { id: Date.now(), timestamp: new Date().toISOString().slice(0, 16).replace("T", " "), admin: "Prototype Admin Session", action: ADMIN_ACTIONS.find((a) => a.id === actionId).label, target: item.name },
      ...prev,
    ]);
    setOpenItem(null);
  };

  const applyDiscoveryAction = (item, action) => {
    const statusMap = { Publish: "published", Reject: "rejected", Flag: "possible_duplicate", Merge: "published", Remove: "rejected" };
    if (statusMap[action]) {
      setDiscoveryQueue((prev) => prev.map((d) => (d.id === item.id ? { ...d, status: statusMap[action] } : d)));
    }
    if (action === "Refresh") {
      setDiscoveryQueue((prev) => prev.map((d) => (d.id === item.id ? { ...d, lastChecked: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }), freshness: "current" } : d)));
    }
    setAuditTrail((prev) => [
      { id: Date.now(), timestamp: new Date().toISOString().slice(0, 16).replace("T", " "), admin: "Prototype Admin Session", action: `${action} (external discovery)`, target: item.name },
      ...prev,
    ]);
  };

  const counts = {
    pending: queue.filter((q) => q.status === "auto_verified_pending_admin" || q.status === "needs_review").length,
    flagged: queue.filter((q) => q.status === "flagged").length,
    verified: queue.filter((q) => q.status === "verified").length,
  };

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px 80px" }}>
      <button onClick={onExit} style={{ background: "none", border: "none", color: c.gray600, fontSize: 13, marginBottom: 16, cursor: "pointer", fontFamily: fonts.body, display: "flex", alignItems: "center", gap: 6 }}>
        <ArrowLeft size={14} /> Exit admin session
      </button>
      <h1 style={{ fontFamily: fonts.display, fontSize: 26, color: c.ink, marginBottom: 4, fontWeight: 500 }}>Verification queue</h1>
      <p style={{ fontSize: 13, color: c.gray600, marginBottom: 20 }}>This queue reflects real submissions from testers. The admin login itself is a prototype-only entry point, not real authentication — see the production readiness plan for the real design.</p>

      <VerificationFlowDiagram />

      <div className="h-grid-3-tight" style={{ marginBottom: 20 }}>
        <div style={{ background: c.paper, border: `1px solid ${c.gray300}`, borderRadius: 12, padding: 16 }}>
          <p style={{ fontFamily: fonts.display, fontSize: 26, color: c.navy }}>{counts.pending}</p>
          <p style={{ fontSize: 12, color: c.gray600 }}>Awaiting decision</p>
        </div>
        <div style={{ background: c.paper, border: `1px solid ${c.gray300}`, borderRadius: 12, padding: 16 }}>
          <p style={{ fontFamily: fonts.display, fontSize: 26, color: c.red }}>{counts.flagged}</p>
          <p style={{ fontSize: 12, color: c.gray600 }}>Flagged, high priority</p>
        </div>
        <div style={{ background: c.paper, border: `1px solid ${c.gray300}`, borderRadius: 12, padding: 16 }}>
          <p style={{ fontFamily: fonts.display, fontSize: 26, color: c.sage }}>{counts.verified}</p>
          <p style={{ fontSize: 12, color: c.gray600 }}>Approved this session</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <Chip active={tab === "queue"} onClick={() => setTab("queue")}>Queue</Chip>
        <Chip active={tab === "directory"} onClick={() => setTab("directory")}>All profiles ({directory.length})</Chip>
        <Chip active={tab === "discovery"} onClick={() => setTab("discovery")}>External Directory Discovery</Chip>
        <Chip active={tab === "audit"} onClick={() => setTab("audit")}>Audit trail</Chip>
      </div>

      {tab === "directory" && (
        <DirectoryManagement
          directory={directory}
          onDelete={onDeleteDirectoryEntry}
          onSetVisibility={onSetVisibility}
          onToggleFlag={onToggleFlag}
          logAction={(action, target) => setAuditTrail((prev) => [
            { id: Date.now(), timestamp: new Date().toISOString().slice(0, 16).replace("T", " "), admin: "Prototype Admin Session", action, target },
            ...prev,
          ])}
        />
      )}

      {tab === "queue" && (
        <div key="queue" className="h-fade-in-fast" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sorted.length === 0 && (
            <p style={{ fontSize: 13.5, color: c.gray600, padding: "20px 0" }}>Nothing in the queue yet — it fills up as real people register or claim profiles through the app.</p>
          )}
          {sorted.map((item) => {
            const meta = STATUS_META[item.status] || STATUS_META.needs_review;
            return (
              <div key={item.id} className="h-card-hover" style={{ background: c.paper, border: `1px solid ${item.status === "flagged" ? c.red : c.gray300}`, borderRadius: 12, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div style={{ minWidth: 200 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: c.ink }}>{item.name}</p>
                  <p style={{ fontSize: 11.5, color: c.gray600 }}>{item.type === "institution" ? "Institution" : "Professional"} · Submitted {item.submittedDate}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontFamily: fonts.mono, fontSize: 13, color: c.ink }}>{item.autoScore ?? "—"}%</span>
                  <span style={{ fontSize: 10.5, color: c.gray600 }}>match</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: meta.fg, background: meta.bg, borderRadius: 999, padding: "4px 10px" }}>{meta.label}</span>
                <Button variant="secondary" style={{ padding: "7px 14px", fontSize: 12.5 }} onClick={() => setOpenItem(item)}>Review</Button>
              </div>
            );
          })}
        </div>
      )}

      {tab === "discovery" && (
        <div key="discovery" className="h-fade-in-fast">
          <p style={{ fontSize: 13, color: c.gray600, marginBottom: 16, lineHeight: 1.6 }}>
            Profiles compiled from publicly available sources, awaiting admin publish. Confidence is an internal ranking signal only — never shown to the public as a Heurisko verification score.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {discoveryQueue.length === 0 && (
              <p style={{ fontSize: 13.5, color: c.gray600, padding: "10px 0" }}>Empty — this pilot has no live discovery pipeline behind it (see HEURISKO_DISCOVERY_ARCHITECTURE.md). Claims against external listings would land here.</p>
            )}
            {discoveryQueue.map((item) => {
              const meta = DISCOVERY_STATUS_META[item.status];
              const conf = CONFIDENCE_META[item.confidence];
              return (
                <div key={item.id} className="h-card-hover" style={{ background: c.paper, border: `1px solid ${item.status === "possible_duplicate" ? "#E0BF7A" : c.gray300}`, borderRadius: 12, padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: item.flags.length ? 10 : 0 }}>
                    <div style={{ minWidth: 220 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: c.ink }}>{item.name}</p>
                      <p style={{ fontSize: 11.5, color: c.gray600 }}>{item.classification} · Tier {item.sourceTier} source · {item.sources} source{item.sources > 1 ? "s" : ""} · Checked {item.lastChecked}</p>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: conf.fg, background: conf.bg, borderRadius: 999, padding: "4px 10px" }}>{conf.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: meta.fg, background: meta.bg, borderRadius: 999, padding: "4px 10px" }}>{meta.label}</span>
                  </div>
                  {item.flags.length > 0 && (
                    <div style={{ marginBottom: 10 }}>
                      {item.flags.map((f, i) => (
                        <p key={i} style={{ fontSize: 11.5, color: "#8A6416", background: "#FBF3E4", borderRadius: 6, padding: "5px 10px", marginBottom: 4 }}>⚑ {f}</p>
                      ))}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {DISCOVERY_ACTIONS.map((a) => (
                      <button
                        key={a}
                        onClick={() => applyDiscoveryAction(item, a)}
                        className="h-btn-anim"
                        style={{ fontSize: 11.5, fontWeight: 600, color: a === "Reject" || a === "Remove" ? c.red : c.navy, background: c.cream, border: `1px solid ${a === "Reject" || a === "Remove" ? c.red : c.gray300}`, borderRadius: 6, padding: "5px 10px", cursor: "pointer" }}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "audit" && (
        <div key="audit" className="h-fade-in-fast" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {auditTrail.length === 0 && (
            <p style={{ fontSize: 13.5, color: c.gray600, padding: "10px 0" }}>No admin actions recorded yet.</p>
          )}
          {auditTrail.map((a) => (
            <div key={a.id} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "10px 14px", background: c.paper, border: `1px solid ${c.gray300}`, borderRadius: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12.5, color: c.ink }}><strong>{a.action}</strong> · {a.target}</span>
              <span style={{ fontSize: 11.5, color: c.gray600 }}>{a.admin} · {a.timestamp}</span>
            </div>
          ))}
        </div>
      )}

      {openItem && <AdminQueueDetail item={openItem} onAction={applyAction} onClose={() => setOpenItem(null)} />}
    </main>
  );
}

