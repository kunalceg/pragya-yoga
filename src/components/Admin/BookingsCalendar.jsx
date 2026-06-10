import React, { useState, useEffect } from 'react';
import s from './YogaAdmin.module.css';
import Badge from './Badge';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Cancelled'];

export default function BookingsCalendar() {
  const [bookings, setBookings]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [filter, setFilter]         = useState('All');
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [feedback, setFeedback]     = useState({ message: '', type: '' });

  const flash = (message, type = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: '', type: '' }), 4000);
  };

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/bookings`);
      if (!res.ok) throw new Error();
      setBookings(await res.json());
    } catch {
      setError('Could not load bookings. Check your server connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  // ── Update status ──
  const handleStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`${API_URL}/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setBookings(prev => prev.map(b => b._id === id ? data : b));
      flash(`Booking marked as ${status}.`);
    } catch {
      flash('Failed to update status.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  // ── Delete ──
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete booking for ${name}?`)) return;
    setDeletingId(id);
    try {
      await fetch(`${API_URL}/api/bookings/${id}`, { method: 'DELETE' });
      setBookings(prev => prev.filter(b => b._id !== id));
      flash('Booking deleted.');
    } catch {
      flash('Failed to delete booking.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = filter === 'All' ? bookings : bookings.filter(b => b.status === filter);

  const counts = {
    All:       bookings.length,
    Pending:   bookings.filter(b => b.status === 'Pending').length,
    Confirmed: bookings.filter(b => b.status === 'Confirmed').length,
    Cancelled: bookings.filter(b => b.status === 'Cancelled').length,
  };

  return (
    <div>
      {/* ── Header ── */}
      <div className={s.pageHeader}>
        <div>
          <h2 className={s.pageTitle}>Bookings Calendar</h2>
          <p className={s.pageSub}>Manage & confirm student course bookings</p>
        </div>
        <button type="button" className={`${s.btn} ${s.btnSm}`} onClick={fetchBookings}>
          ↻ Refresh
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

      {/* ── Stats ── */}
      <div className={s.statsGrid} style={{ marginBottom: '20px' }}>
        {[
          { label: 'Total Bookings', value: counts.All,       cls: s.statOrange, valCls: s.valOrange },
          { label: 'Pending',        value: counts.Pending,   cls: s.statAmber,  valCls: s.valAmber  },
          { label: 'Confirmed',      value: counts.Confirmed, cls: s.statGreen,  valCls: s.valGreen  },
          { label: 'Cancelled',      value: counts.Cancelled, cls: s.statBlue,   valCls: s.valBlue   },
        ].map(stat => (
          <div key={stat.label} className={`${s.statCard} ${stat.cls}`}>
            <div className={s.statLabel}>{stat.label}</div>
            <div className={`${s.statVal} ${stat.valCls}`}>{loading ? '…' : stat.value}</div>
          </div>
        ))}
      </div>

      {/* ── Filter Tabs ── */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {['All', 'Pending', 'Confirmed', 'Cancelled'].map(f => (
          <button
            key={f}
            type="button"
            className={`${s.btn} ${s.btnSm} ${filter === f ? s.btnPrimary : ''}`}
            onClick={() => setFilter(f)}
          >
            {f} ({counts[f] ?? 0})
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      <div className={`${s.card} ${s.cardNoPad}`}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>
            Loading bookings…
          </div>
        ) : error ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#dc2626', fontSize: '13px' }}>
            {error}
            <br />
            <button type="button" className={`${s.btn} ${s.btnSm}`} style={{ marginTop: '12px' }} onClick={fetchBookings}>
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>
            {filter === 'All' ? 'No bookings yet.' : `No ${filter} bookings.`}
          </div>
        ) : (
          <table className={s.table}>
            <thead>
              <tr>
                <th>Student</th>
                <th>Contact</th>
                <th>Course</th>
                <th>Fee</th>
                <th>Payment</th>
                <th>Txn ID</th>
                <th>Status</th>
                <th>Booked On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b._id}>
                  <td>
                    <strong>{b.name}</strong>
                    {b.city && <div style={{ fontSize: '11px', color: '#9ca3af' }}>{b.city}</div>}
                  </td>
                  <td className={s.tdMuted}>
                    <div>{b.email}</div>
                    {b.phone && <div style={{ fontSize: '11px', marginTop: '2px' }}>{b.phone}</div>}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{b.courseName}</div>
                    {b.courseTime && <div style={{ fontSize: '11px', color: '#9ca3af' }}>{b.courseTime}</div>}
                  </td>
                  <td style={{ fontWeight: 600, color: '#d97706' }}>{b.coursePrice}</td>
                  <td className={s.tdMuted}>{b.paymentMethod}</td>
                  <td className={s.tdMuted} style={{ fontSize: '11px' }}>{b.transactionId || '—'}</td>
                  <td><Badge label={b.status} /></td>
                  <td className={s.tdMuted} style={{ fontSize: '11px' }}>
                    {new Date(b.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {STATUS_OPTIONS.filter(st => st !== b.status).map(st => (
                        <button
                          key={st}
                          type="button"
                          className={`${s.btn} ${s.btnSm}`}
                          style={{
                            fontSize: '11px', padding: '4px 8px',
                            color: st === 'Confirmed' ? '#15803d' : st === 'Cancelled' ? '#dc2626' : '#d97706',
                            borderColor: st === 'Confirmed' ? '#86efac' : st === 'Cancelled' ? '#fca5a5' : '#fcd34d',
                          }}
                          disabled={updatingId === b._id}
                          onClick={() => handleStatus(b._id, st)}
                        >
                          {st}
                        </button>
                      ))}
                      <button
                        type="button"
                        className={`${s.btn} ${s.btnSm}`}
                        style={{ fontSize: '11px', padding: '4px 8px', color: '#dc2626', borderColor: '#fca5a5' }}
                        disabled={deletingId === b._id}
                        onClick={() => handleDelete(b._id, b.name)}
                      >
                        {deletingId === b._id ? '…' : '✕'}
                      </button>
                    </div>
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
