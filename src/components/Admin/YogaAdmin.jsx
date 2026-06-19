import React, { useState, useEffect, useCallback } from 'react';
import s from './YogaAdmin.module.css';
import { useTheme } from '../../contexts/ThemeContext';
import {
  LuLayoutDashboard, LuUsers, LuFilter, LuRadioTower, LuGraduationCap,
  LuReceipt, LuCalendarClock, LuFolderLock, LuMegaphone, LuTicketPercent,
} from 'react-icons/lu';

// Layout Shell Components
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import LogoutModal from './LogoutModal';

// Section Components
import DashboardInsights from './DashboardInsights';
import StudentsHistory from './StudentsHistory';
import PipelineCRMLeads from './PipelineCRMLeads';
import BatchesStreams from './BatchesStreams';
import CoursesPlans from './CoursesPlans';
import ReportsInvoices from './ReportsInvoices';
import BookingsCalendar from './BookingsCalendar';
import ContentControl from './ContentControl';
import CommsWebConfig from './CommsWebConfig';
import CouponsReferrals from './CouponsReferrals';

import {
  getOverview, getPayments, getConsultations, getStudents,
  coursesApi, membershipPlansApi, couponsApi, downloadsApi,
  createStudent, broadcastNotification,
  getLeads, getBatches,
} from '../api/AdminServices.js';
import {
  AddStudentModal, AddLeadModal, NewBatchModal, RecordPaymentModal,
} from './QuickActionModals';

export default function YogaAdmin({ onLogout = () => {} }) {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('insights');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [quickModal, setQuickModal] = useState(null);

  // Live data pulled from MongoDB via the admin API.
  const [overview, setOverview] = useState({ metrics: {}, systemHealth: [], todaySchedule: [], recentStudents: [] });
  const [students, setStudents] = useState([]);
  const [leads, setLeads] = useState([]);
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [plans, setPlans] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [contentItems, setContentItems] = useState([]);
  const [payments, setPayments] = useState([]);
  const [consultations, setConsultations] = useState([]);

  // Form states
  const [studentForm, setStudentForm] = useState({ name: '', email: '', phone: '', city: '', style: '', level: '', batch: '', plan: '' });
  const [batchForm, setBatchForm] = useState({ name: '', timing: '', trainer: '', zoomLink: '' });
  const [commForm, setCommForm] = useState({ segment: 'All', platform: 'WhatsApp', text: '' });
  const [couponForm, setCouponForm] = useState({ code: '', type: 'Percentage', value: '', isReferral: false });

  const flash = (message, type = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: '', type: '' }), 4500);
  };

  const loadAll = useCallback(async () => {
    const safe = (p) => p.then((v) => v).catch(() => null);
    const [ov, st, ld, bt, co, pl, cp, dl, pay, cons] = await Promise.all([
      safe(getOverview()), safe(getStudents()), safe(getLeads()), safe(getBatches()),
      safe(coursesApi.list()), safe(membershipPlansApi.list()), safe(couponsApi.list()),
      safe(downloadsApi.list()), safe(getPayments()), safe(getConsultations()),
    ]);
    if (ov) setOverview(ov);
    if (st) setStudents(st);
    if (ld) setLeads(ld);
    if (bt) setBatches(bt);
    if (co) setCourses(co);
    if (pl) setPlans(pl);
    if (cp) setCoupons(cp);
    if (dl) setContentItems(dl);
    if (pay) setPayments(pay);
    if (cons) setConsultations(cons);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const NAV_ITEMS = [
    { id: 'insights',       label: 'Dashboard',            icon: <LuLayoutDashboard /> },
    { id: 'students',       label: 'Students',             icon: <LuUsers />,         badge: students.length || null },
    { id: 'leads',          label: 'Pipeline CRM',         icon: <LuFilter />,        badge: (overview.totalLeads ?? leads.length) || null },
    { id: 'batches',        label: 'Batches & Streams',    icon: <LuRadioTower /> },
    { id: 'curriculum',     label: 'Courses & Plans',      icon: <LuGraduationCap /> },
    { id: 'attendance',     label: 'Reports & Invoices',   icon: <LuReceipt /> },
    { id: 'consultations',  label: 'Bookings',             icon: <LuCalendarClock /> },
    { id: 'content',        label: 'Content Control',      icon: <LuFolderLock /> },
    { id: 'comms',          label: 'Communication',        icon: <LuMegaphone /> },
    { id: 'rewards',        label: 'Coupons & Referrals',  icon: <LuTicketPercent /> },
  ];

  // Derived feed data for the topbar (presentation only).
  const recentStudents = overview.recentStudents?.length ? overview.recentStudents : students.slice(0, 4);
  const topActivity = recentStudents.slice(0, 5).map((st) => ({
    title: `${st.name || 'New student'} registered`,
    meta: st.city || st.email || 'Student CRM',
    color: '#F97316',
  }));
  const topNotifs = [
    (overview.metrics?.pendingBookings ? { title: `${overview.metrics.pendingBookings} pending bookings`, meta: 'Bookings need confirmation', color: '#D97706' } : null),
    (leads.length ? { title: `${overview.totalLeads ?? leads.length} active leads in pipeline`, meta: 'Pipeline CRM', color: '#FB923C' } : null),
    (overview.metrics?.newThisMonth ? { title: `${overview.metrics.newThisMonth} new members this month`, meta: 'Growth', color: '#16A34A' } : null),
  ].filter(Boolean);

  const goCreate = () => { setActiveTab('insights'); setQuickModal('student'); setMobileOpen(false); };
  const closeModal = () => { setQuickModal(null); };
  const afterCreate = () => { closeModal(); loadAll(); };
  const handleQuickAction = (key) => { setActiveTab('insights'); setQuickModal(key); };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setQuickModal(null);
    setMobileOpen(false);
  };

  // Create a student through the admin API (persists to MongoDB).
  const handleSaveStudent = async (e) => {
    e.preventDefault();
    if (!studentForm.name || !studentForm.email || !studentForm.phone) {
      flash('Error: Name, Email, and Phone are mandatory.', 'error');
      return;
    }
    const planMonths = studentForm.plan === 'Annual Pass' ? 12 : studentForm.plan === 'Quarterly Pass' ? 3 : studentForm.plan === 'Monthly Pass' ? 1 : 0;
    try {
      await createStudent({
        name: studentForm.name, email: studentForm.email, phone: studentForm.phone,
        city: studentForm.city || '', style: studentForm.style || 'Hatha',
        level: studentForm.level || 'Beginner', planMonths,
      });
      flash(`Student ${studentForm.name} created. Credentials emailed.`, 'success');
      setStudentForm({ name: '', email: '', phone: '', city: '', style: '', level: '', batch: '', plan: '' });
      await loadAll();
    } catch (err) {
      flash(err.message || 'Failed to create student.', 'error');
    }
  };

  // Create a coupon through the admin API.
  const handleSaveCoupon = async (e) => {
    e.preventDefault();
    if (!couponForm.code || couponForm.value === '') {
      flash('Coupon code and value are required.', 'error');
      return;
    }
    try {
      await couponsApi.create({
        code: couponForm.code, discountType: couponForm.type,
        value: Number(couponForm.value), isReferral: couponForm.isReferral,
      });
      flash(`Coupon ${couponForm.code.toUpperCase()} created.`, 'success');
      setCouponForm({ code: '', type: 'Percentage', value: '', isReferral: false });
      const cp = await couponsApi.list();
      setCoupons(cp);
    } catch (err) {
      flash(err.message || 'Failed to create coupon.', 'error');
    }
  };

  // Broadcast a notification to students.
  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!commForm.text) { flash('Message text is required.', 'error'); return; }
    try {
      const channelMap = { WhatsApp: 'whatsapp', Email: 'email', SMS: 'sms' };
      await broadcastNotification({
        message: commForm.text,
        segment: commForm.segment,
        channels: [channelMap[commForm.platform] || 'email'],
      });
      flash('Notification broadcast queued.', 'success');
      setCommForm({ segment: 'All', platform: 'WhatsApp', text: '' });
    } catch (err) {
      flash(err.message || 'Failed to broadcast.', 'error');
    }
  };

  const adminUser = { name: 'Studio Admin', role: 'Studio Administrator', avatar: 'SA' };

  return (
    <div className={`${s.shell} ${collapsed ? s.shellCollapsed : ''}`}>
      {mobileOpen && <div className={s.backdrop} onClick={() => setMobileOpen(false)} />}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        navItems={NAV_ITEMS}
        user={adminUser}
        onSignOut={() => setShowLogoutModal(true)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(v => !v)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onQuickCreate={goCreate}
      />

      <div className={s.contentArea}>
        <Topbar
          theme={theme}
          onToggleTheme={toggleTheme}
          onMobileMenu={() => setMobileOpen(true)}
          onQuickCreate={goCreate}
          notifications={topNotifs}
          activity={topActivity}
          user={adminUser}
        />

        <main className={s.main}>
        {activeTab === 'insights' && (
          <DashboardInsights
            data={overview}
            totalLeads={overview.totalLeads ?? leads.length}
            totalBatches={overview.totalBatches ?? batches.length}
            onRefresh={loadAll}
            onQuickAction={handleQuickAction}
          />
        )}
        {activeTab === 'students' && (
          <StudentsHistory
            students={students}
            form={studentForm}
            setForm={setStudentForm}
            onSave={handleSaveStudent}
            onChanged={loadAll}
            feedback={feedback}
          />
        )}
        {activeTab === 'leads' && <PipelineCRMLeads leads={leads} onChanged={loadAll} />}
        {activeTab === 'batches' && <BatchesStreams form={batchForm} setForm={setBatchForm} onChanged={loadAll} />}
        {activeTab === 'curriculum' && <CoursesPlans courses={courses} plans={plans} />}
        {activeTab === 'attendance' && <ReportsInvoices payments={payments} metrics={overview.metrics} />}
        {activeTab === 'consultations' && <BookingsCalendar consultations={consultations} onChanged={loadAll} />}
        {activeTab === 'content' && <ContentControl contentItems={contentItems} />}
        {activeTab === 'comms' && <CommsWebConfig form={commForm} setForm={setCommForm} onBroadcast={handleBroadcast} feedback={feedback} />}
        {activeTab === 'rewards' && <CouponsReferrals form={couponForm} setForm={setCouponForm} coupons={coupons} onSave={handleSaveCoupon} feedback={feedback} />}
        </main>
      </div>

      {showLogoutModal && (
        <LogoutModal
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={() => { setShowLogoutModal(false); onLogout(); }}
        />
      )}

      {quickModal === 'student' && <AddStudentModal onClose={closeModal} onSuccess={afterCreate} />}
      {quickModal === 'lead' && <AddLeadModal onClose={closeModal} onSuccess={afterCreate} />}
      {quickModal === 'batch' && <NewBatchModal onClose={closeModal} onSuccess={afterCreate} />}
      {quickModal === 'payment' && <RecordPaymentModal onClose={closeModal} onSuccess={afterCreate} />}
    </div>
  );
}
