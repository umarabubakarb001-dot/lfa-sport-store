import React, { useState } from 'react';
import { 
  GraduationCap, 
  HelpCircle, 
  Layers, 
  Server, 
  Database as DbIcon, 
  ShieldCheck, 
  Activity,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Lock,
  Compass
} from 'lucide-react';

export default function DefenseGuide() {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

  const vivaQuestions = [
    {
      id: 1,
      q: "1. What is the architecture of this system and how does data flow between client and server?",
      tags: ["System Architecture", "React & Express"],
      a: "This system uses a decoupled Client-Server architecture. The frontend is built on React 19 (compiled with Vite) and styled responsively with Tailwind CSS. The backend is an Express Node.js application. Data flows through standard RESTful JSON APIs. For example, when adding a sale, the React client fires a POST request to '/api/sales' with the product ID and quantity. The Express server validates the payload, updates state, and returns the formal ledger record."
    },
    {
      id: 2,
      q: "2. How is data persisted in this system and how is transactional integrity maintained?",
      tags: ["Database", "State Integrity"],
      a: "For project isolation in a containerized environment (like Google Cloud Run), the system utilizes a persistent, structured JSON-based file storage database ('/data/db.json') with custom transaction logic. When a sale is registered, a transaction lock checks if the current stock of the product in the database is greater than or equal to the requested quantity. If yes, it deducts the stock, writes to the ledger file, and saves. If a sale is later voided, the system performs a structural refund, safely returning the stock back to inventory."
    },
    {
      id: 3,
      q: "3. Explain how the AI Sales Forecasting algorithm works under the hood.",
      tags: ["AI & Machine Learning", "Gemini API"],
      a: "The forecasting algorithm merges historical trend aggregation with advanced LLM analysis. First, the Express backend automatically runs mathematical statistics to sum monthly categories, gross turnover, and list products matching critical low stock levels. This structured information is compiled as a contextual ledger payload. The backend then invokes the 'gemini-3.5-flash' model via the server-side '@google/genai' SDK, instructing it under a strict Type-Safe JSON Response Schema to compute predictive 3-month sales ranges, safety stock advices, target marketing, and stagnancy risks."
    },
    {
      id: 4,
      q: "4. Why did you implement a custom server proxy instead of making AI calls from the browser?",
      tags: ["Security", "API Keys Safety"],
      a: "Security is a critical professional standard. If we make Gemini AI calls directly from the browser, we would have to ship our private 'GEMINI_API_KEY' inside the client-side JavaScript bundle, making it easily stealable by anyone inspecting the code. By establishing a server-side proxy route '/api/forecast' on our Express node, we keep our API keys completely hidden from browser inspectors, fully securing sensitive cloud credits."
    },
    {
      id: 5,
      q: "5. How is user authentication managed and who is it designed for?",
      tags: ["Security", "Authentication"],
      a: "The application is designed specifically for administrative store management, restricting access to the Store Manager alone. The system manages authentication locally: it pre-seeds a manager account ('manager') in the secure database file, hashing credentials using a salted SHA-256 algorithm. In login, it verifies credentials, generates a stateless Bearer session token ('lfa-session-token'), and sends it to the client. The React client retains this token in localStorage and attaches it to the 'Authorization' header of subsequent API requests."
    },
    {
      id: 6,
      q: "6. Tell us about the Member Discount logic and how business rules are maintained.",
      tags: ["Corporate Logic", "Formula Calculus"],
      a: "Business logic is handled natively inside the register computations. When preparing a checkout bill, the system checks the customer loyalty parameter. If set to 'Member', a conditional 5% discount is calculated against the subtotal. This discount alters the final billing price, which consequently reduces the recorded sales revenue and calculated net profit for that transaction, ensuring both retail margins and inventory COGS (Cost of Goods Sold) are computed correctly in database logs."
    }
  ];

  return (
    <div className="space-y-6" id="defense-guide-panel">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <GraduationCap className="text-emerald-500 hover:scale-110 transition-transform stroke-[2.2px]" size={28} />
          <span>Final Year Project Defense Support Guide</span>
        </h2>
        <p className="text-sm text-slate-500 font-medium">Complete visual system mapping and pre-viva mock examiner answer sheets</p>
      </div>

      {/* Interactive System Architecture Map */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6" id="architecture-diagram-card">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-sans font-bold text-slate-800 flex items-center gap-1.5">
            <Layers size={18} className="text-emerald-500" />
            <span>Interactive Full-Stack Architecture Map</span>
          </h3>
          <p className="text-xs text-slate-400 font-medium">How the components of LFA Sport system communicate dynamically</p>
        </div>

        {/* Diagram blocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative" id="dia-grid">
          {/* Block 1: React UI */}
          <div className="bg-slate-50 border border-slate-200 p-4.5 rounded-2xl space-y-2 flex flex-col justify-between" id="dia-block-react">
            <div className="space-y-1">
              <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-md font-mono uppercase">User Interface</span>
              <h4 className="text-sm font-bold text-slate-800">React 19 SPA</h4>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Manager dashboards, Recharts analytics charts, product inventory tables, dynamic sales forms, and pre-viva lists.
            </p>
            <div className="pt-2 flex items-center justify-between text-[10px] font-mono font-bold text-sky-600 border-t border-slate-100 mt-1">
              <span>Frontend Layer</span>
              <span>Client Browser</span>
            </div>
          </div>

          {/* Arrow 1 */}
          <div className="hidden md:flex items-center justify-center text-slate-300">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono font-bold text-emerald-500">JSON APIs</span>
              <ArrowRight size={24} className="animate-pulse" />
              <span className="text-[9px] text-slate-400 font-mono">POST/PUT/GET</span>
            </div>
          </div>

          {/* Block 2: Express Node Server */}
          <div className="bg-slate-50 border border-slate-200 p-4.5 rounded-2xl space-y-2 flex flex-col justify-between" id="dia-block-express">
            <div className="space-y-1">
              <span className="text-[10px] bg-slate-900 text-emerald-400 font-bold px-2 py-0.5 rounded-md font-mono uppercase">Web Server</span>
              <h4 className="text-sm font-bold text-slate-800">Express Node.js</h4>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              API endpoints securely proxying data, validating inventory stocks, salt SHA-256 passwords, and executing AI predictions.
            </p>
            <div className="pt-2 flex items-center justify-between text-[10px] font-mono font-bold text-slate-900 border-t border-slate-100 mt-1">
              <span>API Gateway</span>
              <span>Cloud Server</span>
            </div>
          </div>

          {/* Arrow 2 */}
          <div className="hidden md:flex items-center justify-center text-slate-300">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono font-bold text-emerald-500">Secure API</span>
              <ArrowRight size={24} className="animate-pulse" />
              <span className="text-[9px] text-slate-400 font-mono">Bearer Token</span>
            </div>
          </div>

          {/* Block 3: DB */}
          <div className="bg-slate-50 border border-slate-200 p-4.5 rounded-2xl space-y-2 flex flex-col justify-between" id="dia-block-db">
            <div className="space-y-1">
              <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-md font-mono uppercase">Persistent Store</span>
              <h4 className="text-sm font-bold text-slate-800">JSON Database</h4>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Durable local persistence storage located at '/data/db.json' tracking catalog records, sales ledgers, and credentials.
            </p>
            <div className="pt-2 flex items-center justify-between text-[10px] font-mono font-bold text-red-650 border-t border-slate-100 mt-1">
              <span>Durable File</span>
              <span>integrity checks</span>
            </div>
          </div>

          {/* Arrow 3 */}
          <div className="hidden md:flex items-center justify-center text-slate-300">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono font-bold text-emerald-500">GenAI SDK</span>
              <ArrowRight size={24} className="animate-pulse" />
              <span className="text-[9px] text-slate-400 font-mono">Stream JSON</span>
            </div>
          </div>

          {/* Block 4: Gemini AI */}
          <div className="bg-slate-950 text-white border border-slate-900 p-4.5 rounded-2xl space-y-2 flex flex-col justify-between" id="dia-block-google-gemini">
            <div className="space-y-1">
              <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded-md font-mono uppercase">Cognitive Layer</span>
              <h4 className="text-sm font-bold text-emerald-400">Gemini-3.5-Flash</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Apparel seasonal forecasting, replenishment guidelines advices, and inventory procurement risk analysis computations.
            </p>
            <div className="pt-2 flex items-center justify-between text-[10px] font-mono font-semibold text-emerald-400 border-t border-slate-800 mt-1">
              <span>Google Cloud</span>
              <span>Server-Only SDK</span>
            </div>
          </div>
        </div>

        {/* Professional Summary banner */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3.5" id="dia-security-highlight">
          <ShieldCheck className="text-emerald-600 shrink-0 stroke-[2.5px]" size={22} />
          <div className="text-xs text-slate-600 leading-normal">
            <strong className="text-slate-800">Security Architecture Audit Checked:</strong> Secret keys are safely enclosed within the backend express server process environment; they are never compiled into client-side asset files, meeting strict corporate enterprise security frameworks.
          </div>
        </div>
      </div>

      {/* Accordion Questions Sheet */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs" id="viva-accordion-card">
        <div className="border-b border-slate-100 pb-3 mb-5 flex items-center justify-between">
          <div>
            <h3 className="font-sans font-bold text-slate-800 flex items-center gap-1.5">
              <BookOpen size={18} className="text-emerald-500" />
              <span>Project Defense Study Sheets & Mock Viva</span>
            </h3>
            <p className="text-xs text-slate-400 font-medium">Click on any question below to reveal a perfect, high-scoring defense answer</p>
          </div>
          <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-100">
            6 Core Questions
          </span>
        </div>

        <div className="space-y-3" id="viva-questions-deck">
          {vivaQuestions.map((q, idx) => {
            const isOpen = activeQuestion === idx;
            return (
              <div 
                key={q.id} 
                className={`border rounded-2xl transition-all duration-200 ${
                  isOpen 
                    ? 'border-slate-800 bg-slate-50/50 shadow-xs' 
                    : 'border-slate-150 hover:bg-slate-50/20'
                }`}
                id={`viva-card-${q.id}`}
              >
                <button
                  onClick={() => setActiveQuestion(isOpen ? null : idx)}
                  className="w-full text-left p-4.5 flex items-start justify-between gap-4 cursor-pointer"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {q.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="px-2 py-0.5 bg-slate-100 text-[9px] font-black uppercase text-slate-500 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm font-black text-slate-800 font-sans tracking-tight leading-tight">{q.q}</p>
                  </div>
                  <HelpCircle className={`shrink-0 mt-0.5 transition-transform duration-200 ${isOpen ? 'text-emerald-600 scale-110' : 'text-slate-400'}`} size={18} />
                </button>

                {isOpen && (
                  <div className="p-4.5 pt-0 border-t border-slate-100 bg-white rounded-b-2xl animate-slide-down">
                    <div className="p-4 bg-emerald-50/40 border border-emerald-50/70 text-slate-700 text-xs font-medium leading-relaxed font-sans flex gap-3 rounded-xl">
                      <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={16} />
                      <div className="space-y-2">
                        <strong className="text-slate-900 block text-sm font-bold">Suggested Answer:</strong>
                        <p className="text-[12px]">{q.a}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
