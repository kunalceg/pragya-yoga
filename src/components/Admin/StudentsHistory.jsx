import React, { useState, useEffect } from 'react';
import s from './YogaAdmin.module.css';
import Badge from './Badge';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function StudentsHistory({ form, setForm, onSave, feedback }) {
  const [students, setStudents]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [search, setSearch]         = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [showForm, setShowForm]     = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/students`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setStudents(data);
    } catch {
      setError('Could not load students. Check your server connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  useEffect(() => {
    if (feedback?.type === 'success') {
      fetchStudents();
      setShowForm(false);
    }
  }, [feedback]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove ${name} from the system? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${API_URL}/api/students/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setStudents(prev => prev.filter(st => st._id !== id));
    } catch {
      alert('Failed to delete student. Try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = students.filter(st =>
    st.name.toLowerCase().includes(search.toLowerCase()) ||
    st.email.toLowerCase().includes(search.toLowerCase()) ||
    (st.city || '').toLowerCase().includes(search.toLowerCase())
  );

  const getPlanStatus = (st) => {
    if (!st.planMonths || st.planMonths === 0) return 'Pending';
    return 'Active';
  };

  return (
    <div>
      {/* ── Header ── */}
      <div className={s.pageHeader}>
        <div>
          <h2 className={s.pageTitle}>Student CRM Directory</h2>
          <p className={s.pageSub}>Manage profiles, history & memberships</p>
        </div>
        <button
          type="button"
          className={`${s.btn} ${showForm ? '' : s.btnPrimary} ${s.btnSm}`}
          onClick={() => setShowForm(v => !v)}
        >
          {showForm ? '✕ Cancel' : '+ Add Student'}
        </button>
      </div>

      {/* ── Feedback Banner ── */}
      {feedback?.message && (
        <div style={{
          padding: '10px 16px',
          marginBottom: '16px',
          borderRadius: '8px',
          fontSize: '13px',
          background: feedback.type === 'success' ? '#dcfce7' : '#fee2e2',
          color:      feedback.type === 'success' ? '#15803d' : '#dc2626',
          border:     `1px solid ${feedback.type === 'success' ? '#86efac' : '#fca5a5'}`,
        }}>
          {feedback.type === 'success' ? '✅' : '⚠️'} {feedback.message}
        </div>
      )}

      {/* ── Register Form ── */}
      {showForm && (
        <form onSubmit={onSave} className={s.card} style={{ marginBottom: '20px' }}>
          <h3 className={s.cardTitle}>◈ Register New Profile</h3>
          <div className={s.grid3} style={{ marginBottom: '12px' }}>
            <input type="text"  placeholder="Full name *"     value={form.name}  onChange={e => setForm({ ...form, name: e.target.value })}  required />
            <input type="email" placeholder="Email address *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <input type="text"  placeholder="Phone number *"  value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
          </div>
          <div className={s.grid3} style={{ marginBottom: '16px' }}>
            <input type="text" placeholder="City"       value={form.city}  onChange={e => setForm({ ...form, city: e.target.value })}  />
            <input type="text" placeholder="Yoga Style" value={form.style} onChange={e => setForm({ ...form, style: e.target.value })} />
            <input type="text" placeholder="Level"      value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} />
          </div>
          <button type="submit" className={`${s.btn} ${s.btnPrimary}`}>Save Profile</button>
        </form>
      )}

      {/* ── Stats Row ── */}
      <div className={s.statsGrid} style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '20px' }}>
        {[
          { label: 'Total Students', value: students.length,                                          cls: s.statOrange, valCls: s.valOrange },
          { label: 'Active Plans',   value: students.filter(st => st.planMonths > 0).length,          cls: s.statGreen,  valCls: s.valGreen  },
          { label: 'No Plan Yet',    value: students.filter(st => !st.planMonths || st.planMonths === 0).length, cls: s.statAmber, valCls: s.valAmber },
        ].map(stat => (
          <div key={stat.label} className={`${s.statCard} ${stat.cls}`}>
            <div className={s.statLabel}>{stat.label}</div>
            <div className={`${s.statVal} ${stat.valCls}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* ── Search ── */}
      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Search by name, email or city…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', boxSizing: 'border-box' }}
        />
      </div>

      {/* ── Table ── */}
      <div className={`${s.card} ${s.cardNoPad}`}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>
            Loading students…
          </div>
        ) : error ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#dc2626', fontSize: '13px' }}>
            {error}
            <br />
            <button type="button" className={`${s.btn} ${s.btnSm}`} style={{ marginTop: '12px' }} onClick={fetchStudents}>
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>
            {search ? 'No students match your search.' : 'No students registered yet — add one above!'}
          </div>
        ) : (
          <table className={s.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>City</th>
                <th>Style / Level</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(st => (
                <tr key={st._id}>
                  <td><strong>{st.name}</strong></td>
                  <td className={s.tdMuted}>
                    <div>{st.email}</div>
                    {st.phone && <div style={{ fontSize: '11px', marginTop: '2px' }}>{st.phone}</div>}
                  </td>
                  <td>{st.city || '—'}</td>
                  <td>
                    <div>{st.style || '—'}</div>
                    {st.level && <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>{st.level}</div>}
                  </td>
                  <td>{st.planMonths ? `${st.planMonths} mo` : <span className={s.tdMuted}>None</span>}</td>
                  <td><Badge label={getPlanStatus(st)} /></td>
                  <td className={s.tdMuted} style={{ fontSize: '11px' }}>
                    {st.createdAt
                      ? new Date(st.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                      : '—'}
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`${s.btn} ${s.btnSm}`}
                      style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                      onClick={() => handleDelete(st._id, st.name)}
                      disabled={deletingId === st._id}
                    >
                      {deletingId === st._id ? '…' : 'Delete'}
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
