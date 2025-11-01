import React, { useState } from "react";
import { X, Edit3, Save } from "lucide-react";
import styles from "./AppliedNotesModal.module.css";

const AppliedNotesModal = ({ job, onClose, onUpdateNotes }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(job.notes || "");
  const [saving, setSaving] = useState(false);

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/applications/${job.application_id}/notes`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notes: note }),
      });

      if (!res.ok) throw new Error("Failed to save notes");

      const data = await res.json();

      if (onUpdateNotes) onUpdateNotes(job.application_id, note);
      setIsEditing(false);
      setSaving(false);
      
    } catch (err) {
      console.error("Error saving notes:", err);
      alert("Failed to save notes");

  }
}

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={20} />
        </button>

        <h2 className={styles.title}>{job.job?.title || "Untitled Job"}</h2>
        <p className={styles.status}>Status: <strong>{job.status}</strong></p>

        <textarea
          className={styles.textArea}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          disabled={!isEditing}
          placeholder="Write your notes here..."
        />

        <div className={styles.actions}>
          {!isEditing ? (
            <button className={styles.editBtn} onClick={handleEdit}>
              <Edit3 size={16} /> Edit
            </button>
          ) : (
            <button
              className={styles.saveBtn}
              onClick={handleSave}
              disabled={saving}
            >
              <Save size={16} /> {saving ? "Saving..." : "Save"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppliedNotesModal;
