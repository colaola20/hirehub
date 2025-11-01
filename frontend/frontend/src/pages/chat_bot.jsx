// chat_bot.jsx
import { useState, useRef } from "react";
import JoditEditor from "jodit-react";

import styles from "./job_dashboard.module.css";

export default function Chatbot({ job }) {
  const [open, setOpen] = useState(true);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! Ask me anything about this job, your resume bullets, or a mini cover letter." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const boxRef = useRef(null);

  // track last assistant reply + last question (for PDF)
  const [lastAssistant, setLastAssistant] = useState("");
  const [lastQuestion, setLastQuestion] = useState("");

  // editor state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorValue, setEditorValue] = useState("");

  // === NEW: quick prompts shown in the center before first user message ===
  const quickPrompts = [
    "Draft 3 resume bullets from this JD",
    "Write a 120-word mini cover letter",
    "Summarize responsibilities in 5 points",
    "Match my skills to this job",
    "What keywords should I add to my resume?"
  ];

  // NOTE: send() now accepts an optional preset string; existing calls still work
  const send = async (preset) => {
    const raw = typeof preset === "string" ? preset : input;
    const text = (raw || "").trim();
    if (!text || loading) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setLastQuestion(text);
    if (!preset) setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, job })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Chat error");
      const answer = data.answer || "(no reply)";
      setMessages((m) => [...m, { role: "assistant", content: answer }]);
      setLastAssistant(answer);
      setTimeout(() => boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" }), 0);
    } catch (e) {
      const err = "Sorry—something went wrong reaching the assistant.";
      setMessages((m) => [...m, { role: "assistant", content: err }]);
      setLastAssistant(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async () => {
    if (!lastAssistant) return;
    const res = await fetch("/api/chat/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: lastAssistant, question: lastQuestion, job })
    });
    if (!res.ok) {
      let msg = "Failed to export PDF";
      try { const j = await res.json(); if (j?.error) msg = j.error; } catch { /* ignore */ }
      alert(msg);
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "assistant_reply.pdf";
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // === NEW: open editor with last assistant reply ===
  const openInEditor = () => {
    if (!lastAssistant) return;
    setEditorValue(lastAssistant);
    setEditorOpen(true);
  };

  const applyEditorChanges = () => {
    // write edits back so PDF uses the edited content
    setLastAssistant(editorValue);

    // also reflect the edited reply in the chat history (replace last assistant bubble if it was last)
    setMessages((prev) => {
      for (let i = prev.length - 1; i >= 0; i--) {
        if (prev[i].role === "assistant") {
          const clone = [...prev];
          clone[i] = { ...clone[i], content: editorValue };
          return clone;
        }
      }
      return prev;
    });

    setEditorOpen(false);
  };

  const hasUserMessage = messages.some((m) => m.role === "user");

  return (
    <div className={styles.chatDock}>
      <button className={styles.chatToggle} onClick={() => setOpen(!open)}>
        {open ? "×" : "Chat"}
      </button>

      {open && (
        <div className={styles.chatCard}>
          <div className={styles.chatHeader}>
            <strong>Job Assistant</strong>
            <span className={styles.chatSub}>Groq</span>
          </div>

          <div className={styles.chatBox} ref={boxRef}>
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? styles.msgUser : styles.msgAssistant}
                   dangerouslySetInnerHTML={ m.role === "assistant"
                     ? { __html: m.content } // allow rich text rendering
                     : undefined }>
                {m.role === "user" ? m.content : null}
              </div>
            ))}

            {/* === NEW: Centered pre-defined prompts (only before first user message) === */}
            {!loading && !hasUserMessage && (
              <div
                style={{
                  display: "grid",
                  gap: "10px",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  alignItems: "center",
                  justifyItems: "center",
                  width: "100%",
                  maxWidth: 720,
                  margin: "24px auto 8px",
                  padding: "8px 0",
                  opacity: 0.95
                }}
              >
                {quickPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => send(p)}
                    aria-label={`Use prompt: ${p}`}
                    style={{
                      cursor: "pointer",
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.06)",
                      padding: "10px 14px",
                      borderRadius: "999px",
                      fontSize: "0.95rem",
                      lineHeight: 1.25,
                      textAlign: "center",
                      width: "100%",
                      transition: "transform 120ms ease, background 120ms ease, border-color 120ms ease",
                      backdropFilter: "blur(2px)",
                      WebkitBackdropFilter: "blur(2px)",
                      color: "inherit"
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.98)"}
                    onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {loading && <div className={styles.msgAssistant}>Thinking…</div>}
          </div>

          <div className={styles.chatInputRow}>
            <textarea
              className={styles.chatInput}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="e.g., Draft 3 resume bullets from this JD"
              rows={2}
            />
            <button className={styles.chatSend} onClick={() => send()} disabled={loading || !input.trim()}>
              Send
            </button>
            <button className={styles.chatExport} onClick={downloadPdf} disabled={!lastAssistant || loading}>
              PDF
            </button>
            {/* NEW: Open in Editor button */}
            <button className={styles.chatEditorBtn} onClick={openInEditor} disabled={!lastAssistant || loading}>
              Open in Editor
            </button>
          </div>
        </div>
      )}

      {/* === NEW: Editor Modal === */}
      {editorOpen && (
        <div className={styles.editorOverlay} onMouseDown={(e) => {
          // click outside to close (optional). Remove if you don't want this behavior.
          if (e.target.classList.contains(styles.editorOverlay)) setEditorOpen(false);
        }}>
          <div className={styles.editorModal} onMouseDown={(e) => e.stopPropagation()}>
            <div className={styles.editorHeader}>
              <strong>Edit Assistant Reply</strong>
              <button className={styles.editorClose} onClick={() => setEditorOpen(false)}>×</button>
            </div>

            <div className={styles.editorBody}>
              <JoditEditor
                value={editorValue}
                onChange={setEditorValue}
                config={{
                  height: 420,
                  readonly: false,
                  toolbarSticky: false,
                  toolbarAdaptive: false,
                  // lets images work without a server
                  uploader: { insertImageAsBase64URI: true },
                  // a generous toolbar; trim as you like
                  buttons:
                    "source,|,undo,redo,|,font,fontsize,paragraph,|,bold,italgic,underline,strikethrough,|" +
                    "superscript,subscript,|,align,|,ul,ol,indent,outdent,|,lineHeight,|,fontcolor,background,|" +
                    "link,image,table,hr,emoji,|,cut,copy,paste,selectall,find,|,eraser,fullsize"
                }}
              />
            </div>

            <div className={styles.editorActions}>
              <button className={styles.editorApply} onClick={applyEditorChanges}>Apply</button>
              <button className={styles.editorCancel} onClick={() => setEditorOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
