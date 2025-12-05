// job_dashboard.jsx
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Job_Dashboard.module.css";
import Chatbot from "./chat_bot";
import SmallModal from "../components/SmallModal.jsx";
import { marked } from "marked";
import DOMPurify from "dompurify";

// Configure marked options for better formatting
marked.setOptions({
  breaks: true, // Adds <br> on single line breaks
  gfm: true, // GitHub Flavored Markdown
  headerIds: false, // Disable header IDs
  smartLists: true, // Use smarter list behavior
  smartypants: true, // Use smart punctuation
});

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
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Sorry—something went wrong reaching the assistant." }]);
    } finally {
      setLoading(false);
      setTimeout(() => boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" }), 0);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <aside className={styles.chatPanel}>
      <div className={styles.chatHeader}>
        <div className={styles.chatTitle}>Job Assistant</div>
        <div className={styles.chatBadge}>Groq</div>
        <div className={styles.chatControls}>
          <button 
            className={styles.minimizeBtn}
            onClick={onClose}
            aria-label="Minimize chat"
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M19 13H5v-2h14v2z" fill="currentColor"/>
            </svg>
          </button>
          </div>
      </div>

      <div className={styles.chatBox} ref={boxRef}>
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? styles.msgUser : styles.msgAssistant}>
            {m.content}
          </div>
        ))}
        {loading && <div className={styles.msgAssistant}>Thinking…</div>}
      </div>

      <div className={styles.inputGroup}>
        <textarea
          className={styles.chatInput}
          rows={1}
          placeholder="Ask anything..."
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
  const [showModal, setShowModal] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("job_dashboard_payload");
    console.log(raw)
    if (!raw) return;
    try { setJob(JSON.parse(raw)); } catch {}
  }, []);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  if (!job) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.shell}>
          <div className={styles.frame}>
            <div className={styles.card}>
              <h2>No job selected</h2>
              <p>Go back to the Jobs list and click a job to view its details here.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.shell}>
        {/* Outer rounded frame like the mock */}
        <div className={styles.frame}>
          {/* Back to dashboard */}
         

          <div className={styles.grid}>
            {/* LEFT: content */}
            <div className={`${styles.card} ${isChatOpen ? styles.chatOpen : ''}`}>
  <div className={styles.titleSection}>
    <Link to="/UserDashboard" className={styles.backBtn}>
      <span className={styles.backText}>Go back to home</span>
    </Link>
    <h1 className={styles.title}>{job.title || "Job Details"}</h1>
  </div>

  <div className={styles.meta}>
    <div className={styles.metaInfo}>
      <span className={styles.metaItem}>
        <span className={styles.metaLabel}>Company:</span> {job.company || "—"}
      </span>
      <span className={styles.metaItem}>
        <span className={styles.metaLabel}>Location:</span> {job.location || "—"}
      </span>
      <span className={styles.metaItem}>
        <span className={styles.metaLabel}>Department:</span> Product Management
      </span>
    </div>
    <div className={styles.actionButtons}>
      <button 
        className={styles.chatToggle}
        onClick={toggleChat}
      >
        {isChatOpen ? 'Close Chat' : 'Open Chat'}
      </button>
    </div>
  </div>

  {/* NEW: scrollable content area */}
  <div className={styles.cardBody}>
    
   <section>
  <h3 className={styles.sectionTitle}>Description</h3>
  <div className={styles.description}>
    
    {/* existing description HTML */}
    <div
      className={styles.descriptionContent}
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(
          marked.parse(job.description?.trim() || "No description provided.")
        ),
      }}
    />
  </div>
</section>



    {Array.isArray(job.skills) && job.skills.length > 0 && (
      <section style={{ marginTop: 18 }}>
        <h3 className={styles.sectionTitle}>Skills</h3>
        <ul className={styles.skills}>
          {job.skills.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </section>
    )}


  </div>
    {/* NEW button */}
    <button className={styles.applyBtn} onClick={() => {window.open(job.url, "_blank");
      setShowModal(true)}}>
    Apply
    </button>
            

</div>


            {/* RIGHT: chat panel */}
            {isChatOpen && <Chatbot job={job} />}
          </div>
        </div>
      </div>
      {/* Modal */}
      {showModal && (
        <SmallModal
          job={job}
          onNo={() => setShowModal(false)}
          href={job.apply_url}
        />
      )}
    </div>
  );
};

export default JobDashboard;