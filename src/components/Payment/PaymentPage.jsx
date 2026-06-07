import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate  = useNavigate();

  // Course data passed via router state
  const course = state || { name: '', price: '', time: '' };

  const [form, setForm] = useState({
    name: '', email: '', phone: '', city: '',
    paymentMethod: 'UPI', transactionId: '', message: '',
  });

  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState('');

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      setError('Name, email and phone are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          courseName:  course.name,
          coursePrice: course.price,
          courseTime:  course.time,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Booking failed.');
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Success Screen ──
  if (success) {
    return (
      <div className="pay-shell">
        <div className="pay-success">
          <div className="pay-success-icon">🙏</div>
          <h2>Booking Confirmed!</h2>
          <p>Thank you, <strong>{form.name}</strong>. Your booking for <strong>{course.name}</strong> has been received.</p>
          <p className="pay-success-sub">Our team will contact you at <strong>{form.phone}</strong> to confirm your slot.</p>
          <button className="pay-btn" onClick={() => navigate('/')}>← Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pay-shell">
      <div className="pay-container">

        {/* ── Left: Course Summary ── */}
        <div className="pay-summary">
          <div className="pay-logo">🌸 Pragya Yoga</div>
          <h2 className="pay-summary-title">Booking Summary</h2>

          <div className="pay-course-card">
            <div className="pay-course-label">Selected Course</div>
            <div className="pay-course-name">{course.name || 'No course selected'}</div>
            {course.time && <div className="pay-course-meta">🕐 {course.time}</div>}
            <div className="pay-course-price">{course.price}</div>
          </div>

          <div className="pay-info-block">
            <div className="pay-info-row">
              <span>Payment Status</span>
              <span className="pay-badge">Pending</span>
            </div>
            <div className="pay-info-row">
              <span>Confirmation</span>
              <span>Via Phone / Email</span>
            </div>
          </div>

          {/* UPI QR placeholder */}
          {form.paymentMethod === 'UPI' && (
            <div className="pay-upi-box">
              <div className="pay-upi-label">Scan & Pay via UPI</div>
              <div className="pay-upi-qr">
                <div className="pay-upi-qr-inner">QR</div>
              </div>
              <div className="pay-upi-id">pragya.yoga@upi</div>
              <div className="pay-upi-note">After payment, enter Transaction ID in the form →</div>
            </div>
          )}
        </div>

        {/* ── Right: Student Form ── */}
        <div className="pay-form-wrap">
          <h2 className="pay-form-title">Your Details</h2>
          <p className="pay-form-sub">Fill in your information to complete the booking</p>

          {error && (
            <div className="pay-error">⚠️ {error}</div>
          )}

          <form onSubmit={handleSubmit} className="pay-form">
            <div className="pay-field-group">
              <label>Full Name *</label>
              <input type="text" placeholder="e.g. Priya Sharma" value={form.name} onChange={set('name')} required />
            </div>

            <div className="pay-row">
              <div className="pay-field-group">
                <label>Email Address *</label>
                <input type="email" placeholder="you@email.com" value={form.email} onChange={set('email')} required />
              </div>
              <div className="pay-field-group">
                <label>Phone Number *</label>
                <input type="text" placeholder="9XXXXXXXXX" value={form.phone} onChange={set('phone')} required />
              </div>
            </div>

            <div className="pay-field-group">
              <label>City</label>
              <input type="text" placeholder="e.g. Patna" value={form.city} onChange={set('city')} />
            </div>

            <div className="pay-field-group">
              <label>Payment Method</label>
              <select value={form.paymentMethod} onChange={set('paymentMethod')}>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash (Pay at Studio)</option>
                <option value="Card">Card</option>
              </select>
            </div>

            {(form.paymentMethod === 'UPI' || form.paymentMethod === 'Bank Transfer' || form.paymentMethod === 'Card') && (
              <div className="pay-field-group">
                <label>Transaction ID <span style={{ color: '#888', fontWeight: 400 }}>(optional)</span></label>
                <input type="text" placeholder="Enter after payment" value={form.transactionId} onChange={set('transactionId')} />
              </div>
            )}

            <div className="pay-field-group">
              <label>Message / Special Request <span style={{ color: '#888', fontWeight: 400 }}>(optional)</span></label>
              <textarea placeholder="Any health conditions, preferences or questions…" value={form.message} onChange={set('message')} rows={3} />
            </div>

            {/* Read-only course confirmation */}
            <div className="pay-confirm-row">
              <span>Booking for:</span>
              <strong>{course.name}</strong>
            </div>
            <div className="pay-confirm-row">
              <span>Fee:</span>
              <strong className="pay-confirm-price">{course.price}</strong>
            </div>

            <button type="submit" className="pay-btn pay-btn-full" disabled={loading}>
              {loading ? 'Confirming…' : 'Confirm Booking 🙏'}
            </button>

            <button type="button" className="pay-back-link" onClick={() => navigate(-1)}>
              ← Back to Courses
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
