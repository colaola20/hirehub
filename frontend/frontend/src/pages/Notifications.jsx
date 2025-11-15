import React, { useEffect, useState } from 'react';
import styles from './Notifications.module.css';
import { toast } from 'react-toastify';

// Simple notifications page. Expects backend endpoints:
// GET  /api/notifications         -> [{ id, title, body, created_at, read }]
// POST /api/notifications/send    -> { ok: true }
// POST /api/notifications/:id/read -> { ok: true }
// DELETE /api/notifications/:id   -> { ok: true }

export default function Notifications() {
	const [notifications, setNotifications] = useState([]);
	const [loading, setLoading] = useState(false);
	const [sending, setSending] = useState(false);
	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');

	const fetchNotifications = async () => {
		setLoading(true);
		try {
			const token = localStorage.getItem('token');
			const res = await fetch('/api/notifications', {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (!res.ok) throw new Error('Failed to fetch');
			const data = await res.json();
			setNotifications(Array.isArray(data) ? data : []);
		} catch (err) {
			console.error(err);
			toast.error('Could not load notifications');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => { fetchNotifications(); }, []);

	const markRead = async (id) => {
		try {
			const token = localStorage.getItem('token');
			const res = await fetch(`/api/notifications/${id}/read`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
			if (!res.ok) throw new Error('failed');
			setNotifications((prev) => prev.map(n => n.id === id ? { ...n, read: true } : n));
			toast.success('Marked read');
		} catch (e) {
			toast.error('Could not mark read');
		}
	};

	const remove = async (id) => {
		if (!confirm('Delete this notification?')) return;
		try {
			const token = localStorage.getItem('token');
			const res = await fetch(`/api/notifications/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
			if (!res.ok) throw new Error('failed');
			setNotifications((prev) => prev.filter(n => n.id !== id));
			toast.success('Deleted');
		} catch (e) {
			toast.error('Could not delete');
		}
	};

	const sendNotification = async (e) => {
		e.preventDefault();
		if (!title.trim() || !body.trim()) return toast.warn('Title and body required');
		setSending(true);
		try {
			const token = localStorage.getItem('token');
			const res = await fetch('/api/notifications/send', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
				body: JSON.stringify({ title, body }),
			});
			if (!res.ok) throw new Error('failed');
			setTitle(''); setBody('');
			toast.success('Notification sent');
			fetchNotifications();
		} catch (e) {
			toast.error('Failed to send');
		} finally { setSending(false); }
	};

	return (
		<div className={styles.wrapper}>
			<div className={styles.header}>
				<h2>Notifications</h2>
				<div className={styles.headerActions}>
					<button onClick={fetchNotifications} className={styles.refresh}>Refresh</button>
				</div>
			</div>

			<form className={styles.sendForm} onSubmit={sendNotification}>
				<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
				<textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Message body" />
				<button type="submit" disabled={sending} className={styles.sendBtn}>{sending ? 'Sending…' : 'Send notification'}</button>
			</form>

			<div className={styles.list}>
				{loading && <div className={styles.empty}>Loading…</div>}
				{!loading && notifications.length === 0 && <div className={styles.empty}>No notifications</div>}
				{notifications.map((n) => (
					<div key={n.id} className={`${styles.item} ${n.read ? styles.read : ''}`}>
						<div className={styles.itemMain}>
							<div className={styles.itemTitle}>{n.title}</div>
							<div className={styles.itemTime}>{new Date(n.created_at).toLocaleString()}</div>
						</div>
						<div className={styles.itemBody}>{n.body}</div>
						<div className={styles.itemActions}>
							{!n.read && <button onClick={() => markRead(n.id)} className={styles.markBtn}>Mark read</button>}
							<button onClick={() => remove(n.id)} className={styles.delBtn}>Delete</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}