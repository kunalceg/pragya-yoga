import React, { useState, useEffect } from 'react';
import s from './YogaAdmin.module.css';
import { PageHeader } from './ui/Primitives';
import { coursesApi, membershipPlansApi } from '../api/AdminServices.js';
import { LuGraduationCap, LuPlus, LuTrash2, LuCheck, LuCrown, LuBookOpen } from 'react-icons/lu';

const EMPTY_COURSE = { title: '', duration: '', mode: 'Online', price: '', description: '' };
const EMPTY_PLAN = { name: '', price: '', durationMonths: '', pauseDays: '', benefits: '' };

const COURSE_ICONS = ['🧘', '🕉️', '🌅', '💪', '🌿', '🔥'];

export default function CoursesPlans({ onChanged } = {}) {
  const [courses, setCourses] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [courseForm, setCourseForm] = useState(EMPTY_COURSE);
  const [planForm, setPlanForm] = useState(EMPTY_PLAN);
  const [savingCourse, setSavingCourse] = useState(false);
  const [savingPlan, setSavingPlan] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  const flash = (message, type = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: '', type: '' }), 4000);
  };

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [co, pl] = await Promise.all([coursesApi.list(), membershipPlansApi.list()]);
      setCourses(co);
      setPlans(pl);
    } catch (err) {
      setError(err.message || 'Could not load courses & plans. Check your server connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    if (!courseForm.title) { flash('Course title is required.', 'error'); return; }
    setSavingCourse(true);
    try {
      const data = await coursesApi.create({
        title: courseForm.title,
        duration: courseForm.duration,
        mode: courseForm.mode,
        price: Number(courseForm.price) || 0,
        description: courseForm.description,
      });
      setCourses(prev => [data, ...prev]);
      setCourseForm(EMPTY_COURSE);
      flash(`Course "${data.title}" added.`);
      onChanged?.();
    } catch (err) {
      flash(err.message || 'Failed to add course.', 'error');
    } finally {
      setSavingCourse(false);
    }
  };

  const handleSavePlan = async (e) => {
    e.preventDefault();
    if (!planForm.name || planForm.durationMonths === '') {
      flash('Plan name and duration (months) are required.', 'error');
      return;
    }
    setSavingPlan(true);
    try {
      const data = await membershipPlansApi.create({
        name: planForm.name,
        price: Number(planForm.price) || 0,
        durationMonths: Number(planForm.durationMonths),
        pauseDays: Number(planForm.pauseDays) || 0,
        benefits: planForm.benefits
          ? planForm.benefits.split(',').map(b => b.trim()).filter(Boolean)
          : [],
      });
      setPlans(prev => [data, ...prev]);
      setPlanForm(EMPTY_PLAN);
      flash(`Plan "${data.name}" added.`);
      onChanged?.();
    } catch (err) {
      flash(err.message || 'Failed to add plan.', 'error');
    } finally {
      setSavingPlan(false);
    }
  };

  const handleDeleteCourse = async (id, title) => {
    if (!window.confirm(`Delete course "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await coursesApi.remove(id);
      setCourses(prev => prev.filter(c => c._id !== id));
      flash(`Course "${title}" deleted.`);
      onChanged?.();
    } catch {
      flash('Failed to delete course.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeletePlan = async (id, name) => {
    if (!window.confirm(`Delete plan "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await membershipPlansApi.remove(id);
      setPlans(prev => prev.filter(p => p._id !== id));
      flash(`Plan "${name}" deleted.`);
      onChanged?.();
    } catch {
      flash('Failed to delete plan.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const fmtPrice = (n) => Number(n || 0).toLocaleString('en-IN');
  // Most expensive plan = "popular" highlight (presentation only).
  const popularId = plans.length ? plans.reduce((a, b) => (Number(b.price) > Number(a.price) ? b : a), plans[0])._id : null;

  return (
    <div>
      <PageHeader title="Product Catalog" subtitle="Manage curriculum and membership tiers — saved to the database" />

      {feedback.message && (
        <div className={`${s.feedbackInline} ${feedback.type === 'success' ? s.bannerSuccess : s.bannerError}`}>
          <span className={s.bannerIcon}>{feedback.type === 'success' ? '✓' : '⚠'}</span>{feedback.message}
        </div>
      )}
      {error && (
        <div className={`${s.feedbackInline} ${s.bannerError}`}>
          {error}
          <button type="button" className={`${s.btn} ${s.btnSm}`} style={{ marginLeft: 12 }} onClick={fetchAll}>Retry</button>
        </div>
      )}

      {/* Courses */}
      <form onSubmit={handleSaveCourse} className={s.card}>
        <h3 className={s.cardTitle}><span className={s.cardTitleIcon}><LuBookOpen /></span>Add Course</h3>
        <div className={s.grid3} style={{ marginBottom: '10px' }}>
          <input type="text" placeholder="Course title *" value={courseForm.title} onChange={e => setCourseForm({ ...courseForm, title: e.target.value })} />
          <input type="text" placeholder="Duration (e.g. 3 Weeks)" value={courseForm.duration} onChange={e => setCourseForm({ ...courseForm, duration: e.target.value })} />
          <select value={courseForm.mode} onChange={e => setCourseForm({ ...courseForm, mode: e.target.value })}>
            <option value="Online">Online</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Studio">Studio</option>
          </select>
          <input type="number" placeholder="Price (₹)" value={courseForm.price} onChange={e => setCourseForm({ ...courseForm, price: e.target.value })} />
          <input type="text" placeholder="Short description (optional)" value={courseForm.description} onChange={e => setCourseForm({ ...courseForm, description: e.target.value })} style={{ gridColumn: 'span 2' }} />
        </div>
        <button type="submit" className={`${s.btn} ${s.btnPrimary}`} disabled={savingCourse}>
          {savingCourse ? 'Saving…' : 'Add Course'}
        </button>
      </form>

      <h3 className={s.cardTitle} style={{ margin: '6px 2px 14px' }}><span className={s.cardTitleIcon}><LuGraduationCap /></span>Course Catalog</h3>
      {loading ? (
        <div className={s.catalogGrid}>{[...Array(3)].map((_, i) => <div key={i} className={`${s.skel} ${s.skelCard}`} style={{ height: 200 }} />)}</div>
      ) : courses.length === 0 ? (
        <div className={`${s.card} ${s.emptyState}`}><div className={s.emptyIcon}>📚</div>No courses yet — add one above.</div>
      ) : (
        <div className={s.catalogGrid} style={{ marginBottom: 26 }}>
          {courses.map((c, i) => (
            <div key={c._id} className={s.productCard}>
              <div className={s.productCover}>{COURSE_ICONS[i % COURSE_ICONS.length]}</div>
              <div className={s.productBody}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div className={s.productTitle}>{c.title}</div>
                  {c.mode && <span className={s.catTag}>{c.mode}</span>}
                </div>
                <div className={s.productMeta}>{[c.duration].filter(Boolean).join(' · ') || 'Self-paced'}</div>
                {c.description && <div className={s.productMeta} style={{ color: 'var(--text-3)' }}>{c.description}</div>}
                <div className={s.productFoot}>
                  <div className={s.productPrice}>₹{fmtPrice(c.price)}</div>
                  <button type="button" className={`${s.btn} ${s.btnSm} ${s.btnDanger}`} onClick={() => handleDeleteCourse(c._id, c.title)} disabled={deletingId === c._id}>
                    {deletingId === c._id ? '…' : <LuTrash2 size={13} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Plans */}
      <form onSubmit={handleSavePlan} className={s.card}>
        <h3 className={s.cardTitle}><span className={s.cardTitleIcon}><LuCrown /></span>Add Membership Pass</h3>
        <div className={s.grid2} style={{ marginBottom: '10px' }}>
          <input type="text" placeholder="Plan name *" value={planForm.name} onChange={e => setPlanForm({ ...planForm, name: e.target.value })} />
          <input type="number" placeholder="Price (₹)" value={planForm.price} onChange={e => setPlanForm({ ...planForm, price: e.target.value })} />
          <input type="number" placeholder="Duration (months) *" value={planForm.durationMonths} onChange={e => setPlanForm({ ...planForm, durationMonths: e.target.value })} />
          <input type="number" placeholder="Pause days allowed" value={planForm.pauseDays} onChange={e => setPlanForm({ ...planForm, pauseDays: e.target.value })} />
          <input type="text" placeholder="Benefits (comma separated)" value={planForm.benefits} onChange={e => setPlanForm({ ...planForm, benefits: e.target.value })} style={{ gridColumn: 'span 2' }} />
        </div>
        <button type="submit" className={`${s.btn} ${s.btnPrimary}`} disabled={savingPlan}>
          {savingPlan ? 'Saving…' : 'Add Plan'}
        </button>
      </form>

      <h3 className={s.cardTitle} style={{ margin: '6px 2px 14px' }}><span className={s.cardTitleIcon}><LuCrown /></span>Membership Passes</h3>
      {loading ? (
        <div className={s.catalogGrid}>{[...Array(3)].map((_, i) => <div key={i} className={`${s.skel} ${s.skelCard}`} style={{ height: 220 }} />)}</div>
      ) : plans.length === 0 ? (
        <div className={`${s.card} ${s.emptyState}`}><div className={s.emptyIcon}>💳</div>No plans yet — add one above.</div>
      ) : (
        <div className={s.catalogGrid}>
          {plans.map((p) => {
            const benefits = Array.isArray(p.benefits) ? p.benefits : [];
            const isPopular = p._id === popularId && plans.length > 1;
            return (
              <div key={p._id} className={`${s.planCard} ${isPopular ? s.planPopular : ''}`}>
                {isPopular && <span className={s.popularBadge}><LuCrown size={11} style={{ verticalAlign: '-1px' }} /> Popular</span>}
                <div className={s.planName}>{p.name}</div>
                <div className={s.planPrice}>₹{fmtPrice(p.price)}<span className={s.planPriceUnit}> / {p.durationMonths} mo</span></div>
                <div className={s.productMeta}>{p.durationMonths} Month{p.durationMonths > 1 ? 's' : ''} access{p.pauseDays ? ` · ${p.pauseDays} pause days` : ''}</div>
                <ul className={s.planFeatures}>
                  {(benefits.length ? benefits : ['Full studio access', 'Live & recorded sessions']).slice(0, 5).map((b, i) => (
                    <li key={i} className={s.planFeat}><span className={s.planFeatCheck}><LuCheck size={14} /></span>{b}</li>
                  ))}
                </ul>
                <button type="button" className={`${s.btn} ${s.btnDanger} ${s.btnSm}`} style={{ width: 'fit-content' }} onClick={() => handleDeletePlan(p._id, p.name)} disabled={deletingId === p._id}>
                  {deletingId === p._id ? '…' : <><LuTrash2 size={13} /> Delete</>}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
