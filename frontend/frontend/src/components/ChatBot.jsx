import React, { useState } from "react";
import styles from "./chatBot.module.css";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hi there! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");


    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "I do not get it Bro :)" },
      ]);
    }, 600);
  };

  return (
    <div className={styles.chatbotContainer}>
      {isOpen ? (
        <div className={styles.chatWindow}>
          <div className={styles.header}>
            <span> we do not know you name yet buddy</span>
            <button className={styles.closeChatButton} onClick={() => setIsOpen(false)}>✖</button>
          </div>
          <div className={styles.messages}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.sender === "user" ? styles.userMessage : styles.botMessage}
              >
                {m.text}
              </div>
            ))}
          </div>
          <div className={styles.inputArea}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className={styles.textArea}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      ) : (
        <button className={styles.openBtn} onClick={() => setIsOpen(true)}>
          💬 Chat
        </button>
      )}
    </div>
  );
};

export default ChatBot;
