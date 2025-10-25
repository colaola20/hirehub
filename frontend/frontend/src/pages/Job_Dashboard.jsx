// job_dashboard.jsx
import { useEffect, useRef, useState } from "react";
import styles from "./job_dashboard.module.css";

/* Inline chat panel to match the design mock exactly */
function JobChatPanel({ job }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Ask me anything about this job or your resume bullets." }
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
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", content: "Sorry—something went wrong reaching the assistant." }]);
    } finally {
      setLoading(false);
      setTimeout(() => boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" }), 0);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <aside className={styles.chatPanel}>
      <div className={styles.chatHeader}>
        <div className={styles.chatTitle}>Job Assistant</div>
        <div className={styles.chatBadge}>Groq</div>
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
          rows={2}
          placeholder="Ask anything…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button className={styles.chatSend} onClick={send} disabled={loading || !input.trim()}>
          Send
        </button>
      </div>
    </aside>
  );
}

const JobDashboard = () => {
  const [job, setJob] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("job_dashboard_payload");
    if (!raw) return;
    try { setJob(JSON.parse(raw)); } catch {}
  }, []);

  if (!job) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.shell}>
          <div className={styles.card}>
            <h2>No job selected</h2>
            <p>Go back to the Jobs list and click a job to view its details here.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.shell}>
        <div className={styles.grid}>
          {/* LEFT: job content */}
          <div className={styles.card}>
            <h1 className={styles.title}>{job.title || "Job Details"}</h1>

            <div className={styles.meta}>
              {job.company && (
                <span className={styles.metaItem}><strong>Company</strong> • {job.company}</span>
              )}
              {job.location && (
                <span className={styles.metaItem}><strong>Location</strong> • {job.location}</span>
              )}
              {job.category && (
                <span className={styles.metaItem}><strong>Product Management</strong></span>
              )}
            </div>

            <section>
              <h3 className={styles.sectionTitle}>Description</h3>
              <p className={styles.description}>
                {job.description || "No description provided."}
              </p>
            </section>

            {Array.isArray(job.skills) && job.skills.length > 0 && (
              <section style={{ marginTop: 18 }}>
                <h3 className={styles.sectionTitle}>Skills</h3>
                <ul className={styles.skills}>
                  {job.skills.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </section>
            )}

            {job.apply_url && (
              <a
                className={styles.applyBtn}
                href={job.apply_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                APPLY NOW
              </a>
            )}
          </div>

          {/* RIGHT: embedded chat panel */}
          <JobChatPanel job={job} />
        </div>
      </div>
    </div>
  );
};

export default JobDashboard;
