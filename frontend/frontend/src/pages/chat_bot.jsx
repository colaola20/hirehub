// Chatbot.jsx
import { useState, useRef } from "react";
import styles from "./job_dashboard.module.css";

export default function Chatbot({ job }) {
  const [open, setOpen] = useState(true);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! Ask me anything about this job, your resume bullets, or a mini cover letter." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const boxRef = useRef(null);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, job })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Chat error");
      setMessages((m) => [...m, { role: "assistant", content: data.answer || "(no reply)" }]);
      // scroll to bottom
      setTimeout(() => boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" }), 0);
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", content: "Sorry—something went wrong reaching the assistant." }]);
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

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
              <div key={i} className={m.role === "user" ? styles.msgUser : styles.msgAssistant}>
                {m.content}
              </div>
            ))}
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
            <button className={styles.chatSend} onClick={send} disabled={loading || !input.trim()}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
