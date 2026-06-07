import React, { useState } from 'react';
import s from './YogaAdmin.module.css';

// Layout Shell Components
import Sidebar from './Sidebar';
import LogoutModal from './LogoutModal';

// Section Components Aligned Explicitly to Sidebar Functions
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

export default function YogaAdmin({
  data = { metrics: {}, todayConsultations: [] },
  students = [], leads = [], batches = [], courses = [],
  plans = [], coupons = [], contentItems = [], onLogout = () => {},
}) {
  const [activeTab, setActiveTab] = useState('insights');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  // Centralized Form Component States Aligned to Backend Mongoose Schemas
  const [studentForm, setStudentForm] = useState({ name: '', email: '', phone: '', city: '', style: '', level: '', batch: '', plan: '' });
  const [batchForm, setBatchForm] = useState({ name: '', timing: '', trainer: '', zoomLink: '' });
  const [commForm, setCommForm] = useState({ segment: 'All', platform: 'WhatsApp', text: '' });
  const [couponForm, setCouponForm] = useState({ code: '', type: 'Percentage', value: '', isReferral: false });

  const NAV_ITEMS = [
    { id: 'insights',       label: 'Dashboard Insights',  icon: '⬡' },
    { id: 'students',       label: 'Students & History',   icon: '◈' },
    { id: 'leads',          label: 'Pipeline CRM Leads',   icon: '◎' },
    { id: 'batches',        label: 'Batches & Streams',    icon: '▶' },
    { id: 'curriculum',     label: 'Courses & Plans',      icon: '◉' },
    { id: 'attendance',     label: 'Reports & Invoices',   icon: '≡' },
    { id: 'consultations',  label: 'Bookings Calendar',    icon: '◷' },
    { id: 'content',        label: 'Content Control',      icon: '◫' },
    { id: 'comms',          label: 'Comms & Web Config',   icon: '◈' },
    { id: 'rewards',        label: 'Coupons & Referrals',  icon: '✦' },
  ];

  // Database Persistent Action Handler
  const handleSaveStudent = async (e) => {
    e.preventDefault();
    if (!studentForm.name || !studentForm.email || !studentForm.phone) {
      setFeedback({ message: 'Error: Name, Email, and Phone fields are strictly mandatory.', type: 'error' });
      return;
    }

    const payload = {
      name: studentForm.name,
      email: studentForm.email,
      role: 'student',
      phone: studentForm.phone,
      city: studentForm.city || 'Patna',
      style: studentForm.style || '',
      level: studentForm.level || '',
      planMonths: studentForm.plan === 'Annual Pass' ? 12 : studentForm.plan === 'Quarterly Pass' ? 3 : 0,
      referralCount: 0,
      stats: { classes: 0, attendancePct: 0 },
      months: 0,
      certifs: 0,
      progress: { flexibility: 0, strength: 0, breathing: 0, meditation: 0 },
      unreadNotifications: 0,
      badges: []
    };

    // 🎯 FIX: Read dynamic API URL from Vite environment variables with your Render fallback
    const API_URL = import.meta.env.VITE_API_URL || 'https://pragya-yoga.onrender.com';

    try {
      // 🎯 FIX: Changed target endpoint destination from '/api/students' to your main unified '/api/auth/register'
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || 'Failed to sync student record.');
      }

      setFeedback({ message: `Successfully synchronized record for ${payload.name}. Secure password credentials emailed!`, type: 'success' });
      setStudentForm({ name: '', email: '', phone: '', city: '', style: '', level: '', batch: '', plan: '' });
    } catch (err) {
      // 🎯 FIX: Dynamic clean messaging instead of hardcoded critical failures
      setFeedback({ message: err.message || 'Critical Error: Failed write operations to database layer.', type: 'error' });
    } finally {
      setTimeout(() => setFeedback({ message: '', type: '' }), 4500);
    }
  };

  return (
    <div className={s.shell}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        navItems={NAV_ITEMS} 
        user={{ name: 'Admin Yogi', role: 'Studio Administrator', avatar: 'AY' }}
        onSignOut={() => setShowLogoutModal(true)} 
      />

      <main className={s.main}>
        {activeTab === 'insights' && <DashboardInsights data={data} totalLeads={leads.length || 6} totalBatches={batches.length || 6} />}
        {activeTab === 'students' && (
          <StudentsHistory 
            students={students} 
            form={studentForm} 
            setForm={setStudentForm} 
            onSave={handleSaveStudent} 
            feedback={feedback}
          />
        )}
        {activeTab === 'leads' && <PipelineCRMLeads leads={leads} />}
        {activeTab === 'batches' && <BatchesStreams form={batchForm} setForm={setBatchForm} />}
        {activeTab === 'curriculum' && <CoursesPlans courses={courses} plans={plans} />}
        {activeTab === 'attendance' && <ReportsInvoices />}
        {activeTab === 'consultations' && <BookingsCalendar consultations={data.todayConsultations} />}
        {activeTab === 'content' && <ContentControl contentItems={contentItems} />}
        {activeTab === 'comms' && <CommsWebConfig form={commForm} setForm={setCommForm} />}
        {activeTab === 'rewards' && <CouponsReferrals form={couponForm} setForm={setCouponForm} coupons={coupons} />}
      </main>

      {showLogoutModal && (
        <LogoutModal 
          onCancel={() => setShowLogoutModal(false)} 
          onConfirm={() => { setShowLogoutModal(false); onLogout(); }} 
        />
      )}
    </div>
  );
}