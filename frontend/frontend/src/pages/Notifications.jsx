import React, { useEffect, useState } from "react";
import styles from "./Notifications.module.css";
import { toast } from "react-toastify";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selected, setSelected] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [starred, setStarred] = useState(new Set());

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Could not load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const markRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("failed");

      setNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === id ? { ...n, is_read: true } : n
        )
      );
    } catch (e) {
      toast.error("Could not mark as read");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this notification?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("failed");

      setNotifications((prev) =>
        prev.filter((n) => n.notification_id !== id)
      );

      toast.success("Deleted");
      if (selected?.notification_id === id) setSelected(null);
    } catch (e) {
      toast.error("Could not delete");
    }
  };

  const handleSendNotification = async () => {
    if (!title.trim() || !body.trim())
      return toast.warn("Title and body required");

    setSending(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, body }),
      });

      if (!res.ok) throw new Error("failed");

      setTitle("");
      setBody("");
      toast.success("Notification sent");
      fetchNotifications();
    } catch (e) {
      toast.error("Failed to send");
    } finally {
      setSending(false);
    }
  };

  const openNotification = (n) => {
    setSelected(n);
    if (!n.is_read) markRead(n.notification_id);
  };

  const toggleSelect = (id) => {
    setSelectedItems((prev) => {
      const set = new Set(prev);
      set.has(id) ? set.delete(id) : set.add(id);
      return set;
    });
  };

  const toggleStar = (id, e) => {
    e.stopPropagation();
    setStarred((prev) => {
      const set = new Set(prev);
      set.has(id) ? set.delete(id) : set.add(id);
      return set;
    });
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const getMessageText = (n) => n?.message || n?.body || "";
  const getNotificationType = (n) => n?.type || n?.title || "Notification";

  const stripHTML = (html = "") => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
	
  };
const selectAll = () => {
  const allIds = notifications.map(n => n.notification_id);
  setSelectedItems(new Set(allIds));
};

const deleteAll = async () => {
  if (!confirm("Delete ALL selected notifications?")) return;

  try {
    const token = localStorage.getItem("token");

    for (let id of selectedItems) {
      await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    // remove from UI
    setNotifications(prev =>
      prev.filter(n => !selectedItems.has(n.notification_id))
    );

    setSelectedItems(new Set());
    toast.success("Deleted all selected");
    setSelected(null);

  } catch (err) {
    toast.error("Could not delete all");
  }
};

  return (
    <div className={styles.container}>
      {/* LEFT LIST */}
      <div className={styles.listPanel}>
        <div className={styles.inboxHeaderRow}>
		<h2>Inbox ({unreadCount})</h2>

		<div className={styles.bulkActions}>
			<button onClick={selectAll} className={styles.bulkButton}>Select All</button>
			<button onClick={deleteAll} className={styles.bulkButton}>Delete All</button>
		</div>
		</div>

        <div className={styles.emailList}>
          {loading && <div className={styles.loading}>Loading…</div>}

          {!loading &&
            notifications.map((n) => (
              <div
				key={n.notification_id}
				onClick={() => {
					openNotification(n);
					toggleSelect(n.notification_id);
				}}
				className={`
					${styles.emailRow} 
					${!n.is_read ? styles.unread : ""} 
					${selectedItems.has(n.notification_id) ? styles.selectedRow : ""}
				`}
				>
				<input
				type="checkbox"
				checked={selectedItems.has(n.notification_id)}
				onChange={(e) => {
					e.stopPropagation();
					toggleSelect(n.notification_id);
				}}
				/>

                <div className={styles.emailRowTop}>
                  <span className={styles.emailSender}>HireHub</span>
                  <span className={styles.emailDate}>
                    {formatDate(n.created_at)}
                  </span>
                </div>

                <div className={styles.emailRowBottom}>
                  <span className={styles.emailSubject}>
                    {getNotificationType(n)}
                  </span>
                  <span className={styles.emailPreview}>
                    {" "}
                   — {stripHTML(getMessageText(n)).slice(0, 90)}
					{stripHTML(getMessageText(n)).length > 90 && "..."}

                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
{/* RIGHT PANEL */}
<div className={styles.contentPanel}>
  {selected ? (
    <>
      {/* Toolbar */}
      <div className={styles.emailToolbar}>
        <button
          className={styles.toolbarButton}
          onClick={() => remove(selected.notification_id)}
        >
          Delete
        </button>
        <button
          className={styles.toolbarButton}
          onClick={() => setSelected(null)}
        >
          Close
        </button>
      </div>

      {/* Subject */}
      <div className={styles.emailSubjectBar}>
        {getNotificationType(selected)}
      </div>

      {/* Sender Block */}
      <div className={styles.emailHeader}>
        <div className={styles.senderAvatar}>H</div>

        <div className={styles.headerInfo}>
          <span className={styles.senderName}>HireHub</span>
          <span className={styles.senderEmail}>no-reply@hirehub.com</span>
          <span className={styles.emailTimestamp}>
            {new Date(selected.created_at).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Email Body */}
      <div
		className="emailBody"
		dangerouslySetInnerHTML={{ __html: selected.message }}
	></div>
    </>
  ) : (
    <div className={styles.noEmail}>
      Select an email to read
    </div>
  )}
</div>
    </div>
  );
}
