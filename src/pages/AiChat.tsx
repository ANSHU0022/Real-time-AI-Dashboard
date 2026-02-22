import { useEffect, useRef, useState } from "react";
import { BarChart3, Mic, Plus, Send, Sparkles, TrendingUp } from "lucide-react";
import Header from "@/components/layout/Header";

type ChatMessage = {
  id: string;
  type: "user" | "bot";
  text: string;
  time: string;
};

const popularSpaces = [
  {
    title: "Revenue Performance",
    location: "Last 30 days",
    tag: "Trend",
    image:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=900&auto=format&fit=crop",
  },
  {
    title: "Pipeline Health",
    location: "This quarter",
    tag: "Live",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=900&auto=format&fit=crop",
  },
  {
    title: "Customer Retention",
    location: "Cohort view",
    tag: "Insight",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=900&auto=format&fit=crop",
  },
  {
    title: "Product Adoption",
    location: "Feature usage",
    tag: "Growth",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=900&auto=format&fit=crop",
  },
];

const quickActions = [
  {
    title: "Summarize key KPIs",
    subtitle: "Monthly revenue, churn, and CAC",
  },
  {
    title: "Year over year growth",
    subtitle: "Compare this year vs last",
  },
  {
    title: "Build a dashboard",
    subtitle: "Growth by region and product",
  },
  {
    title: "Generate a report",
    subtitle: "Executive summary with insights",
  },
];

export default function AiChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const [leftWidth, setLeftWidth] = useState(64);
  const [isDesktop, setIsDesktop] = useState(false);
  const hasUserMessage = messages.some((item) => item.type === "user");
  const [introCollapsed, setIntroCollapsed] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    if (hasUserMessage) {
      setIntroCollapsed(true);
    }
  }, [hasUserMessage]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(media.matches);
    update();
    if (media.addEventListener) {
      media.addEventListener("change", update);
    } else {
      media.addListener(update);
    }
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", update);
      } else {
        media.removeListener(update);
      }
    };
  }, []);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const pushMessage = (next: ChatMessage) =>
    setMessages((prev) => [...prev, next]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    pushMessage({
      id: crypto.randomUUID(),
      type: "user",
      text: trimmed,
      time: formatTime(new Date()),
    });
    setMessage("");
    setIsTyping(true);

    window.setTimeout(() => {
      pushMessage({
        id: crypto.randomUUID(),
        type: "bot",
        text:
          "Thanks for the details. I can help you compare plans, shortlist locations, or start registration. What should we do first?",
        time: formatTime(new Date()),
      });
      setIsTyping(false);
    }, 750);
  };

  const handleSend = () => sendMessage(message);

  const handleQuickAction = (title: string, subtitle: string) => {
    sendMessage(`${title} — ${subtitle}`);
  };

  const handlePointerDown = () => {
    if (!isDesktop) return;
    isDraggingRef.current = true;
    document.body.style.userSelect = "none";
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    document.body.style.userSelect = "";
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percent = (x / rect.width) * 100;
    const clamped = Math.min(74, Math.max(46, percent));
    setLeftWidth(clamped);
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-[#fbf7ee] text-slate-900">
      <Header />
      <section className="relative flex min-h-0 flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 right-[-6%] h-[420px] w-[420px] rounded-full bg-[#fdecc8] opacity-70 blur-3xl" />
          <div className="absolute left-[-10%] h-[460px] w-[460px] rounded-full bg-[#fff1c8] opacity-70 blur-3xl" />
          <div
            className="absolute inset-0 opacity-55"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(245, 158, 11, 0.18) 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>
        <div
          ref={containerRef}
          className="relative z-10 mx-auto flex h-full w-full max-w-none flex-row gap-0 px-0"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <div
            className="flex h-full w-full flex-shrink-0 flex-col bg-transparent"
            style={{ width: isDesktop ? `${leftWidth}%` : "60%" }}
          >
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-2 pb-2 pt-0 md:px-4">
            <div
              className={`mx-auto w-full max-w-[520px] overflow-hidden text-center transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                introCollapsed
                  ? "max-h-0 translate-y-6 opacity-0 pointer-events-none"
                  : "max-h-[420px] translate-y-0 opacity-100"
              }`}
            >
              <div className="mx-auto mb-4 mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff6e5] shadow-[0_10px_22px_rgba(253,186,116,0.35)]">
                <TrendingUp className="h-6 w-6 text-[#f59e0b]" />
              </div>
              <h1 className="text-xl font-semibold text-slate-900 md:text-2xl">
                What do you want to analyze today?
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Ask anything about your data. Our AI can summarize, visualize, and generate reports.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {quickActions.map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => handleQuickAction(item.title, item.subtitle)}
                    className="subcard-tilt rounded-2xl border border-[#f1e6d3] bg-white/95 px-4 py-3 text-left shadow-[0_12px_26px_rgba(148,163,184,0.22)] transition-all hover:-translate-y-0.5 hover:border-[#f3d8a7] hover:shadow-[0_16px_30px_rgba(249,115,22,0.16)]"
                  >
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.subtitle}</p>
                  </button>
                ))}
              </div>
              <div className="h-2" />
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 no-scrollbar">
              {messages.map((item) => (
                <div
                  key={item.id}
                  className={`flex ${item.type === "user" ? "justify-end pr-2" : "justify-start pl-2"}`}
                >
                  <div
                    className={`max-w-[60%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                      item.type === "user"
                        ? "rounded-br-md bg-[#0f172a] text-white"
                        : "rounded-bl-md bg-[#f1f5fb] text-slate-700"
                    }`}
                  >
                    {item.text}
                    <div
                      className={`mt-2 text-[10px] ${
                        item.type === "user" ? "text-slate-200" : "text-slate-400"
                      }`}
                    >
                      {item.time}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-slate-300" />
                  AI is typing...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t border-[#eef2f8] px-2 py-3 md:px-4">
            <div className="relative mx-auto flex w-full max-w-3xl items-center gap-3 rounded-2xl border border-[#e1e8f3] bg-white px-4 py-3 shadow-[0_12px_26px_rgba(15,23,42,0.08)]">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-transparent text-slate-400 transition hover:border-[#e5ecf7] hover:text-slate-600"
                aria-label="Add attachment"
              >
                <Plus className="h-4 w-4" />
              </button>
              <input
                type="text"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSend();
                  }
                }}
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsListening((prev) => !prev)}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border text-sm transition ${
                    isListening
                      ? "border-[#bbf7d0] bg-[#f0fdf4] text-[#16a34a]"
                      : "border-transparent text-slate-400 hover:border-[#e5ecf7] hover:text-slate-600"
                  }`}
                  aria-pressed={isListening}
                  aria-label="Voice input"
                >
                  <Mic className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleSend}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1f2937] text-white transition hover:bg-[#111827]"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="mt-2 text-center text-[11px] text-slate-400">
              AI can make mistakes. Please verify important details.
            </p>
          </div>
        </div>

        <div className="flex h-full items-center">
          <div
            onPointerDown={handlePointerDown}
            className="h-full w-2 cursor-col-resize touch-none"
            aria-label="Resize panels"
          >
            <div className="mx-auto h-full w-px bg-[#e1e8f3]" />
          </div>
        </div>

        <aside
          className="flex h-full w-full flex-shrink-0 flex-col gap-4 overflow-y-auto pb-3 pt-2 no-scrollbar lg:pl-4"
          style={{ width: isDesktop ? `${100 - leftWidth}%` : "40%" }}
        >
          <div className="rounded-2xl border border-[#e7edf6] bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,0.08)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Data Quick Views</p>
                <p className="text-xs text-slate-400">Live dashboards & insights</p>
              </div>
              <button className="text-xs font-semibold text-[#f59e0b] transition hover:text-[#d97706]">
                View all
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {popularSpaces.map((space) => (
                <div
                  key={space.title}
                  className="overflow-hidden rounded-2xl border border-[#e6edf7] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative h-28 overflow-hidden">
                    <img
                      src={space.image}
                      alt={space.title}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                      {space.tag}
                    </span>
                  </div>
                  <div className="space-y-1 p-3">
                    <p className="text-sm font-semibold text-slate-900">{space.title}</p>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <BarChart3 className="h-3 w-3" />
                      {space.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#fdecc8] bg-[linear-gradient(140deg,#fff6e5_0%,#fff3da_45%,#fffaf0_100%)] p-5 shadow-[0_16px_36px_rgba(249,115,22,0.12)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-base font-semibold text-slate-900">Last Month Recap</p>
                <p className="mt-2 text-xs text-slate-600">
                  Snapshot performance across revenue, pipeline, and retention.
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#f59e0b] shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
            <button className="mt-4 w-full rounded-xl bg-[#0f172a] py-2.5 text-sm font-semibold text-white transition hover:bg-[#111827]">
              View recap
            </button>
          </div>

          <div className="rounded-2xl border border-[#e7edf6] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Analyst Playbooks</p>
              <button className="text-xs font-semibold text-[#f59e0b] transition hover:text-[#d97706]">
                See all
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {["Retention deep-dive", "Cohort performance", "Pipeline health"].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-[#edf1f7] bg-[#f8fafc] px-4 py-3 text-sm text-slate-700 transition hover:border-[#d9e4f2]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </aside>
        </div>
      </section>
    </div>
  );
}
