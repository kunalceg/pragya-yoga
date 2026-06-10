import React, { useState, useEffect } from 'react';
import s from './YogaAdmin.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const STAGES = [
  { id: 'New',       label: 'New',       colorClass: s.stageOrange },
  { id: 'Follow up', label: 'Follow Up', colorClass: s.stageAmber  },
  { id: 'Converted', label: 'Converted', colorClass: s.stageGreen  },
  { id: 'Cold',      label: 'Cold',      colorClass: s.stageBlue   },
];

const EMPTY = { name: '', phone: '', email: '', interestType: '', notes: '' };

export default function PipelineCRMLeads() {
  const [leads, setLeads]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [feedback, setFeedback]   = useState({ message: '', type: '' });
  const [movingId, setMovingId]   = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const flash = (message, type = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: '', type: '' }), 4000);
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/leads`);
      if (!res.ok) throw new Error();
      setLeads(await res.json());
    } catch {
      flash('Could not load leads.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  // ── Add lead ──
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name) { flash('Name is required.', 'error'); return; }
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setLeads(prev => [data, ...prev]);
      setForm(EMPTY);
      setShowForm(false);
      flash(`Lead "${data.name}" added to pipeline!`);
    } catch (err) {
      flash(err.message || 'Failed to add lead.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Move stage ──
  const handleStageChange = async (id, newStage) => {
    setMovingId(id);
    try {
      const res = await fetch(`${API_URL}/api/leads/${id}/stage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setLeads(prev => prev.map(l => l._id === id ? data : l));
    } catch {
      flash('Failed to update stage.', 'error');
    } finally {
      setMovingId(null);
    }
  };

  // ── Delete ──
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove lead "${name}"?`)) return;
    setDeletingId(id);
    try {
      await fetch(`${API_URL}/api/leads/${id}`, { method: 'DELETE' });
      setLeads(prev => prev.filter(l => l._id !== id));
      flash(`Lead "${name}" removed.`);
    } catch {
      flash('Failed to delete lead.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const stageLeads = (stageId) => leads.filter(l => l.stage === stageId);

  return (
    <div>
      {/* ── Header ── */}
      <div className={s.pageHeader}>
        <div>
          <h2 className={s.pageTitle}>Pipeline Lead Conversion Matrix</h2>
          <p className={s.pageSub}>Track & convert prospective students</p>
        </div>
        <button
          type="button"
          className={`${s.btn} ${showForm ? '' : s.btnPrimary} ${s.btnSm}`}
          onClick={() => setShowForm(v => !v)}
        >
          {showForm ? '✕ Cancel' : '+ Add Lead'}
        </button>
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

      {/* ── Add Lead Form ── */}
      {showForm && (
        <form onSubmit={handleAdd} className={s.card} style={{ marginBottom: '20px' }}>
          <h3 className={s.cardTitle}>◎ Add New Lead</h3>
          <div className={s.grid3} style={{ marginBottom: '12px' }}>
            <input type="text"  placeholder="Full name *"      value={form.name}         onChange={e => setForm({ ...form, name: e.target.value })}         required />
            <input type="text"  placeholder="Phone number"     value={form.phone}        onChange={e => setForm({ ...form, phone: e.target.value })}        />
            <input type="email" placeholder="Email (optional)" value={form.email}        onChange={e => setForm({ ...form, email: e.target.value })}        />
          </div>
          <div className={s.grid2} style={{ marginBottom: '14px' }}>
            <input type="text" placeholder="Interest (e.g. Hatha Yoga)" value={form.interestType} onChange={e => setForm({ ...form, interestType: e.target.value })} />
            <input type="text" placeholder="Notes (optional)"           value={form.notes}        onChange={e => setForm({ ...form, notes: e.target.value })}        />
          </div>
          <button type="submit" className={`${s.btn} ${s.btnPrimary}`} disabled={saving}>
            {saving ? 'Adding…' : 'Add to Pipeline'}
          </button>
        </form>
      )}

      {/* ── Stats ── */}
      <div className={s.statsGrid} style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '20px' }}>
        {STAGES.map(st => (
          <div key={st.id} className={`${s.statCard} ${st.id === 'New' ? s.statOrange : st.id === 'Follow up' ? s.statAmber : st.id === 'Converted' ? s.statGreen : s.statBlue}`}>
            <div className={s.statLabel}>{st.label}</div>
            <div className={`${s.statVal} ${st.id === 'New' ? s.valOrange : st.id === 'Follow up' ? s.valAmber : st.id === 'Converted' ? s.valGreen : s.valBlue}`}>
              {loading ? '…' : stageLeads(st.id).length}
            </div>
          </div>
        ))}
      </div>

      {/* ── Kanban ── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#9ca3af', fontSize: '13px' }}>Loading pipeline…</div>
      ) : (
        <div className={s.kanban}>
          {STAGES.map(stage => (
            <div key={stage.id} className={s.leadCol}>
              <div className={`${s.leadColTitle} ${stage.colorClass}`}>
                {stage.label} ({stageLeads(stage.id).length})
              </div>

              {stageLeads(stage.id).length === 0 && (
                <div style={{ fontSize: '12px', color: '#9ca3af', padding: '10px 0', textAlign: 'center' }}>
                  No leads
                </div>
              )}

              {stageLeads(stage.id).map(lead => (
                <div key={lead._id} className={s.leadCard}>
                  <strong>{lead.name}</strong>
                  <div className={s.leadMeta}>📌 {lead.interestType || 'General Yoga'}</div>
                  {lead.phone && <div className={s.leadMeta}>📞 {lead.phone}</div>}
                  {lead.notes && <div className={s.leadMeta} style={{ fontStyle: 'italic' }}>"{lead.notes}"</div>}

                  {/* Stage mover */}
                  <div style={{ marginTop: '10px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {STAGES.filter(st => st.id !== stage.id).map(st => (
                      <button
                        key={st.id}
                        type="button"
                        className={`${s.btn} ${s.btnSm}`}
                        style={{ fontSize: '10px', padding: '3px 8px' }}
                        disabled={movingId === lead._id}
                        onClick={() => handleStageChange(lead._id, st.id)}
                      >
                        → {st.label}
                      </button>
                    ))}
                    <button
                      type="button"
                      className={`${s.btn} ${s.btnSm}`}
                      style={{ fontSize: '10px', padding: '3px 8px', color: '#dc2626', borderColor: '#fca5a5', marginLeft: 'auto' }}
                      disabled={deletingId === lead._id}
                      onClick={() => handleDelete(lead._id, lead.name)}
                    >
                      {deletingId === lead._id ? '…' : '✕'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
