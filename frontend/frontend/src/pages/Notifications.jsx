import React, { useEffect, useState } from "react";
import styles from "./Notifications.module.css";
import { toast } from "react-toastify";
import { FaSync } from "react-icons/fa";

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
    const cacheExists = localStorage.getItem("notificationsCache");
    if (!cacheExists) {
      setLoading(true);
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      const notificationsArray = Array.isArray(data) ? data : [];
      setNotifications(notificationsArray);

      // save to localStorage cache
      localStorage.setItem(
        "notificationsCache",
        JSON.stringify(notificationsArray)
      );
    } catch (err) {
      toast.error("Could not load notifications");
    } finally {
      setLoading(false);
    }
  };

  // New function to manually refetch notifications
  const refetchNotifications = async () => {
    setLoading(true); // Always show loading on manual refetch

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      const notificationsArray = Array.isArray(data) ? data : [];
      setNotifications(notificationsArray);

      // save to localStorage cache
      localStorage.setItem(
        "notificationsCache",
        JSON.stringify(notificationsArray)
      );
    } catch (err) {
      toast.error("Could not load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cached = localStorage.getItem("notificationsCache");

    if (cached) {
      // 1. Load cached data instantly (fastest display)
      setNotifications(JSON.parse(cached));
    }

    // 2. ALWAYS fetch fresh data from the database regardless of cache presence.
    // This will update the display and overwrite the cache when the fetch completes.
    fetchNotifications();
  }, []); // Runs once on mount

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
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("failed");

      setNotifications((prev) => prev.filter((n) => n.notification_id !== id));

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

  // --- UPDATED DATE FUNCTION ---
  const formatDate = (dateStr) => {
    if (!dateStr) return "";

    // 1. Replace the SQL space with an ISO 'T'
    // "2025-12-11 05:38:35" -> "2025-12-11T05:38:35"
    let cleanDateStr = dateStr.replace(" ", "T");

    // 2. Ensure timezone indicator exists.
    // If it has "+00:00", JS handles it fine, but appending Z to pure strings helps fallback.
    if (!cleanDateStr.endsWith("Z") && !cleanDateStr.includes("+")) {
      cleanDateStr = cleanDateStr + "Z";
    }
    const date = new Date(cleanDateStr);

    return date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      second: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === notifications.length) {
      // All are selected → deselect
      setSelectedItems(new Set());
    } else {
      // Select all
      setSelectedItems(new Set(notifications.map((n) => n.notification_id)));
    }
  };

  const deleteAll = async () => {
    try {
      const token = localStorage.getItem("token");

      for (let id of selectedItems) {
        await fetch(`/api/notifications/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      // remove from UI
      setNotifications((prev) => {
        const updated = prev.map((n) =>
          n.notification_id === id ? { ...n, is_read: true } : n
        );
        localStorage.setItem("notificationsCache", JSON.stringify(updated));
        return updated;
      });

      setSelectedItems(new Set());
      toast.success("Deleted all selected");
      setSelected(null);
    } catch (err) {
      console.log(err);
      toast.error("Could not delete all");
    }
  };


  const testHTML = `
  <p>This is test content.</p>
  <p>This is test content.</p>
  <p>This is test content.</p>
  <p>This is test content.</p>
  <p>This is test content.</p>
    <p>This is test content.</p>
  <p>This is test content.</p>
  <p>This is test content.</p>
  <p>This is test content.</p>
  <p>This is test content.</p>
    <p>This is test content.</p>
  <p>This is test content.</p>
  <p>This is test content.</p>
  <p>This is test content.</p>
  <p>This is test content.</p>
    <p>This is test content.</p>
  <p>This is test content.</p>
  <p>This is test content.</p>
  <p>This is test content.</p>
  <p>This is test content.</p>
`;

  return (
    <div className={styles.container}>
      {/* LEFT LIST */}
      <div className={selected ? styles.listPanelSelected : styles.listPanel}>
        <div className={styles.inboxHeaderRow}>
          <h2>Inbox ({unreadCount})</h2>

          <div className={styles.bulkActions}>
            <button onClick={toggleSelectAll} className={styles.bulkButton}>
              Select All
            </button>
            <button onClick={deleteAll} className={styles.bulkButton}>
              Delete
            </button>
            <button
              onClick={refetchNotifications}
              className={styles.bulkButton}
            >
              <FaSync />
            </button>
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
                }}
                className={`
					${styles.emailRow} 
					${!n.is_read ? styles.unread : ""} 
					${selectedItems.has(n.notification_id) ? styles.selectedRow : ""}
				`}
              >
                <div
                  className={styles.checkboxContainer}
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    className={styles.checkBox}
                    type="checkbox"
                    checked={selectedItems.has(n.notification_id)}
                    onChange={() => toggleSelect(n.notification_id)}
                  />
                </div>

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
                    — {stripHTML(getMessageText(n)).slice(0, 210)}
                    {stripHTML(getMessageText(n)).length > 210 && "..."}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      {selected && (
        <>
          <div className={styles.contentPanel}>
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
                  {/* {new Date(selected.created_at).toLocaleString()} */}
                  {formatDate(selected.created_at)}
                </span>
              </div>
            </div>

            {/* Email Body */}
            <div
              className="emailBody"
              dangerouslySetInnerHTML={{ __html: (selected.message || "") }}
            > 

            </div>


            
          </div>
        </>
      )}
    </div>
  );
}
