import React, { useState, useEffect } from 'react';
import s from './YogaAdmin.module.css';
import Badge from './Badge';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const EMPTY = { name: '', timing: '', trainer: '', zoomLink: '' };

export default function BatchesStreams() {
  const [batches, setBatches]     = useState([]);
  const [form, setForm]           = useState(EMPTY);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError]         = useState('');
  const [feedback, setFeedback]   = useState({ message: '', type: '' });

  const flash = (message, type = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: '', type: '' }), 4000);
  };

  // ── Fetch ──
  const fetchBatches = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/batches`);
      if (!res.ok) throw new Error();
      setBatches(await res.json());
    } catch {
      setError('Could not load batches. Check your server connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBatches(); }, []);

  // ── Create ──
  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.timing || !form.trainer) {
      flash('Name, timing and trainer are required.', 'error');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/batches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create batch');
      setBatches(prev => [data, ...prev]);
      setForm(EMPTY);
      flash(`Batch "${data.name}" initialized successfully!`);
    } catch (err) {
      flash(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ──
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete batch "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${API_URL}/api/batches/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setBatches(prev => prev.filter(b => b._id !== id));
      flash(`Batch "${name}" deleted.`);
    } catch {
      flash('Failed to delete batch. Try again.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {/* ── Header ── */}
      <div className={s.pageHeader}>
        <div>
          <h2 className={s.pageTitle}>Batches & Streaming Config</h2>
          <p className={s.pageSub}>Manage live and in-studio batch tracks</p>
        </div>
      </div>

      {/* ── Feedback ── */}
      {feedback.message && (
        <div style={{
          padding: '10px 16px', marginBottom: '16px', borderRadius: '8px', fontSize: '13px',
          background: feedback.type === 'success' ? '#dcfce7' : '#fee2e2',
          color:      feedback.type === 'success' ? '#15803d' : '#dc2626',
          border:     `1px solid ${feedback.type === 'success' ? '#86efac' : '#fca5a5'}`,
        }}>
          {feedback.type === 'success' ? '✅' : '⚠️'} {feedback.message}
        </div>
      )}

      {/* ── Stats ── */}
      <div className={s.statsGrid} style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '20px' }}>
        {[
          { label: 'Total Batches', value: batches.length,                                    cls: s.statOrange, valCls: s.valOrange },
          { label: 'Active',        value: batches.filter(b => b.status === 'Active').length,  cls: s.statGreen,  valCls: s.valGreen  },
          { label: 'With Zoom',     value: batches.filter(b => b.zoomLink).length,             cls: s.statBlue,   valCls: s.valBlue   },
        ].map(stat => (
          <div key={stat.label} className={`${s.statCard} ${stat.cls}`}>
            <div className={s.statLabel}>{stat.label}</div>
            <div className={`${s.statVal} ${stat.valCls}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSave} className={s.card} style={{ marginBottom: '20px' }}>
        <h3 className={s.cardTitle}>▶ Deploy New Batch</h3>
        <div className={s.grid2} style={{ marginBottom: '12px' }}>
          <input
            type="text" placeholder="Batch name (e.g. Morning Vinyasa) *"
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="text" placeholder="Timings (e.g. 06:00 AM – 07:15 AM) *"
            value={form.timing} onChange={e => setForm({ ...form, timing: e.target.value })}
          />
          <input
            type="text" placeholder="Assigned Instructor / Acharya *"
            value={form.trainer} onChange={e => setForm({ ...form, trainer: e.target.value })}
          />
          <input
            type="url" placeholder="Zoom streaming link (https://...) — optional"
            value={form.zoomLink} onChange={e => setForm({ ...form, zoomLink: e.target.value })}
          />
        </div>
        <button type="submit" className={`${s.btn} ${s.btnPrimary}`} disabled={saving}>
          {saving ? 'Initializing…' : 'Initialize Batch'}
        </button>
      </form>

      {/* ── Batches Table ── */}
      <div className={`${s.card} ${s.cardNoPad}`}>
        <div style={{ padding: '16px 22px 12px', borderBottom: '1px solid rgba(247,148,29,0.12)' }}>
          <h3 className={s.cardTitle} style={{ margin: 0 }}>▶ Running Batches</h3>
        </div>

        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>
            Loading batches…
          </div>
        ) : error ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#dc2626', fontSize: '13px' }}>
            {error}
            <br />
            <button type="button" className={`${s.btn} ${s.btnSm}`} style={{ marginTop: '12px' }} onClick={fetchBatches}>
              Retry
            </button>
          </div>
        ) : batches.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>
            No batches yet — deploy one above!
          </div>
        ) : (
          <table className={s.table}>
            <thead>
              <tr>
                <th>Batch Name</th>
                <th>Timings</th>
                <th>Instructor</th>
                <th>Zoom Link</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {batches.map(b => (
                <tr key={b._id}>
                  <td><strong>{b.name}</strong></td>
                  <td className={s.tdMuted}>{b.timing}</td>
                  <td>{b.trainer}</td>
                  <td>
                    {b.zoomLink
                      ? <a href={b.zoomLink} target="_blank" rel="noreferrer" style={{ color: '#2563eb', fontSize: '12px' }}>Open Link ↗</a>
                      : <span className={s.tdMuted} style={{ fontSize: '12px' }}>—</span>}
                  </td>
                  <td><Badge label={b.status} /></td>
                  <td className={s.tdMuted} style={{ fontSize: '11px' }}>
                    {new Date(b.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`${s.btn} ${s.btnSm}`}
                      style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                      onClick={() => handleDelete(b._id, b.name)}
                      disabled={deletingId === b._id}
                    >
                      {deletingId === b._id ? '…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
