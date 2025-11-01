import React, { useState } from "react";
import { X, Edit3, Save } from "lucide-react";
import styles from "./AppliedNotesModal.module.css";

const AppliedNotesModal = ({ job, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(job.notes || "");

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => {
    // Save logic will be added later
    setIsEditing(false);
  };

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
            <button className={styles.saveBtn} onClick={handleSave}>
              <Save size={16} /> Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppliedNotesModal;
