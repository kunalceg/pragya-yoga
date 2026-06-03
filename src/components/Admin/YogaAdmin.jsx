import React, { useState } from 'react';
import s from './YogaAdmin.module.css';

export default function YogaAdmin({
  data = { metrics: {}, todayConsultations: [] },
  students = [],
  leads = [],
  batches = [],
  courses = [],
  plans = [],
  coupons = [],
  contentItems = [],
  onLogout = () => alert('Logged out'),
}) {
  const [activeTab, setActiveTab] = useState('insights');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Controlled form states
  const [studentForm, setStudentForm] = useState({ name: '', email: '', phone: '', batch: '', plan: '' });
  const [batchForm, setBatchForm] = useState({ name: '', timing: '', trainer: '', zoomLink: '' });
  const [commForm, setCommForm] = useState({ segment: 'All', platform: 'WhatsApp', text: '' });
  const [couponForm, setCouponForm] = useState({ code: '', type: 'Percentage', value: '', isReferral: false });

  const NAV_ITEMS = [
    { id: 'insights',      label: 'Dashboard Insights',  icon: '⬡' },
    { id: 'students',      label: 'Students & History',   icon: '◈' },
    { id: 'leads',         label: 'Pipeline CRM Leads',   icon: '◎' },
    { id: 'batches',       label: 'Batches & Streams',    icon: '▶' },
    { id: 'curriculum',    label: 'Courses & Plans',      icon: '◉' },
    { id: 'attendance',    label: 'Reports & Invoices',   icon: '≡' },
    { id: 'consultations', label: 'Bookings Calendar',    icon: '◷' },
    { id: 'content',       label: 'Content Control',      icon: '◫' },
    { id: 'comms',         label: 'Comms & Web Config',   icon: '◈' },
    { id: 'rewards',       label: 'Coupons & Referrals',  icon: '✦' },
  ];

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    onLogout();
  };

  // ─── Sample fallback data ───────────────────────────────────────────────
  const fallbackStudents = students.length ? students : [
    { name: 'Priya Sharma',  email: 'priya@email.com',  batch: 'Morning Vinyasa',      plan: 'Quarterly Pass',  status: 'Active'   },
    { name: 'Rahul Mehta',   email: 'rahul@email.com',  batch: 'Evening Restorative',  plan: 'Monthly Pass',    status: 'Active'   },
    { name: 'Anjali Verma',  email: 'anjali@email.com', batch: 'Morning General',       plan: 'Annual Pass',     status: 'Expiring' },
  ];

  const fallbackLeads = leads.length ? leads : [
    { name: 'Sunita Kapoor',  stage: 'New',        interestType: 'Hatha Yoga'    },
    { name: 'Amit Bose',      stage: 'New',        interestType: 'Meditation'    },
    { name: 'Deepa Nair',     stage: 'Follow up',  interestType: 'Prenatal Yoga' },
    { name: 'Vishal Tiwari',  stage: 'Follow up',  interestType: 'General'       },
    { name: 'Ritu Anand',     stage: 'Converted',  interestType: 'Morning Vinyasa' },
    { name: 'Karan Singh',    stage: 'Cold',       interestType: 'No response x3' },
  ];

  const fallbackCourses = courses.length ? courses : [
    { title: '21-Day Detox Sadhana',    duration: '3 Weeks',   mode: 'Online',  price: '4,500'  },
    { title: '200hr Teacher Training',  duration: '3 Months',  mode: 'Hybrid',  price: '42,000' },
    { title: 'Weekend Yin Retreat',     duration: '2 Days',    mode: 'Studio',  price: '3,200'  },
  ];

  const fallbackPlans = plans.length ? plans : [
    { name: 'Monthly Pass',    price: '2,200',  durationMonths: 1  },
    { name: 'Quarterly Pass',  price: '6,000',  durationMonths: 3  },
    { name: 'Annual Pass',     price: '20,000', durationMonths: 12 },
  ];

  const fallbackCoupons = coupons.length ? coupons : [
    { code: 'FESTIVE20', value: 20, discountType: 'Percentage' },
    { code: 'REFER100',  value: 100, discountType: 'Flat'      },
  ];

  const fallbackContent = contentItems.length ? contentItems : [
    { title: 'Asana Blueprint Handbook',  contentType: 'PDF Guide',      accessLevel: 'Plan-Specific', allowedPlans: ['Premium Tier'] },
    { title: 'Pranayama Video Series',    contentType: 'Video (12 eps)', accessLevel: 'All Members',   allowedPlans: []               },
    { title: 'Meditation Scripts Pack',   contentType: 'Audio + PDF',    accessLevel: 'Free Preview',  allowedPlans: []               },
  ];

  const fallbackConsultations = data.todayConsultations?.length ? data.todayConsultations : [
    { clientName: 'Priya Sharma', dateTime: '7:00 PM', mode: 'Zoom',   status: 'Upcoming'  },
    { clientName: 'Deepa Nair',   dateTime: '10:00 AM', mode: 'Studio', status: 'Completed' },
  ];

  // ─── Badge helper ───────────────────────────────────────────────────────
  const Badge = ({ label }) => {
    const map = {
      Active:    s.badgeGreen,
      Completed: s.badgeGreen,
      Settled:   s.badgeGreen,
      Expiring:  s.badgeAmber,
      Pending:   s.badgeAmber,
      Upcoming:  s.badgeAmber,
      Cold:      s.badgeBlue,
      Referral:  s.badgeBlue,
      'Plan-Specific': s.badgeAmber,
      'All Members':   s.badgeBlue,
      'Free Preview':  s.badgeGreen,
    };
    return <span className={`${s.badge} ${map[label] || s.badgeBlue}`}>{label}</span>;
  };

  // ─── Kanban stage configs ───────────────────────────────────────────────
  const LEAD_STAGES = [
    { id: 'New',        label: 'New',        colorClass: s.stageOrange },
    { id: 'Follow up',  label: 'Follow Up',  colorClass: s.stageAmber  },
    { id: 'Converted',  label: 'Converted',  colorClass: s.stageGreen  },
    { id: 'Cold',       label: 'Cold',       colorClass: s.stageBlue   },
  ];

  return (
    <div className={s.shell}>

      {/* ── SIDEBAR ─────────────────────────────────────────────────── */}
      <aside className={s.sidebar}>
        <div className={s.sidebarLogo}>
          <span className={s.logoMark}>🪷</span>
          <div>
            <span className={s.logoTitle}>Ashram OS</span>
            <span className={s.logoSub}>Yoga Studio Admin</span>
          </div>
        </div>

        <div className={s.sidebarSection}>Core Operations</div>
        {NAV_ITEMS.slice(0, 4).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`${s.navItem} ${activeTab === tab.id ? s.navActive : ''}`}
          >
            <span className={s.navIcon}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}

        <div className={s.sidebarSection}>Studio Management</div>
        {NAV_ITEMS.slice(4, 8).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`${s.navItem} ${activeTab === tab.id ? s.navActive : ''}`}
          >
            <span className={s.navIcon}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}

        <div className={s.sidebarSection}>Communications</div>
        {NAV_ITEMS.slice(8).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`${s.navItem} ${activeTab === tab.id ? s.navActive : ''}`}
          >
            <span className={s.navIcon}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}

        <div className={s.sidebarFooter}>
          <div className={s.userRow}>
            <div className={s.userAvatar}>AY</div>
            <div>
              <div className={s.userName}>Admin Yogi</div>
              <div className={s.userRole}>Studio Administrator</div>
            </div>
          </div>
          <button className={s.btnLogout} onClick={() => setShowLogoutModal(true)}>
            <span className={s.logoutIcon}>⏏</span>
            Sign Out of Studio
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <main className={s.main}>

        {/* ── INSIGHTS ─────────────────────────────────────── */}
        {activeTab === 'insights' && (
          <div>
            <div className={s.pageHeader}>
              <div>
                <h2 className={s.pageTitle}>Dashboard Aggregator Engine</h2>
                <p className={s.pageSub}>Live operational overview — updated in real-time</p>
              </div>
              <button className={`${s.btn} ${s.btnSm}`}>↺ Refresh</button>
            </div>

            <div className={s.statsGrid}>
              <div className={`${s.statCard} ${s.statOrange}`}>
                <div className={s.statLabel}>Active Members</div>
                <div className={`${s.statVal} ${s.valOrange}`}>{data.metrics.activeStudents || 248}</div>
                <div className={s.statTrend}>↑ +12 this month</div>
              </div>
              <div className={`${s.statCard} ${s.statAmber}`}>
                <div className={s.statLabel}>Open CRM Leads</div>
                <div className={`${s.statVal} ${s.valAmber}`}>{fallbackLeads.length}</div>
                <div className={`${s.statTrend} ${s.trendAmber}`}>⏱ 3 follow-ups due</div>
              </div>
              <div className={`${s.statCard} ${s.statBlue}`}>
                <div className={s.statLabel}>Live Batches</div>
                <div className={`${s.statVal} ${s.valBlue}`}>{batches.length || 6}</div>
                <div className={`${s.statTrend} ${s.trendBlue}`}>▶ 2 streaming now</div>
              </div>
              <div className={`${s.statCard} ${s.statGreen}`}>
                <div className={s.statLabel}>Gross Revenue</div>
                <div className={`${s.statVal} ${s.valGreen}`}>₹{(data.metrics.revenue || 180000).toLocaleString('en-IN')}</div>
                <div className={`${s.statTrend} ${s.trendGreen}`}>↑ +8.4% vs last month</div>
              </div>
            </div>

            <div className={s.grid2}>
              <div className={s.card}>
                <h3 className={s.cardTitle}>⬡ System Health Snapshot</h3>
                {[
                  { label: 'Payment Gateway API',   status: 'Operational', ok: true  },
                  { label: 'Zoom Streaming Bridge', status: 'Live',         ok: true  },
                  { label: 'WhatsApp Business API', status: 'Connected',    ok: true  },
                  { label: 'Email SMTP Node',        status: 'Degraded',    ok: false },
                ].map((item, i) => (
                  <div key={i} className={s.healthRow}>
                    <div className={s.healthLabel}>
                      <span className={`${s.healthDot} ${item.ok ? s.dotGreen : s.dotAmber}`} />
                      {item.label}
                    </div>
                    <Badge label={item.status} />
                  </div>
                ))}
              </div>
              <div className={s.card}>
                <h3 className={s.cardTitle}>◷ Today's Schedule</h3>
                {[
                  { label: 'Morning Vinyasa — 6:00 AM', badge: '18 enrolled', badgeType: 'Blue'  },
                  { label: 'Pranayama — 7:30 AM',        badge: 'Completed',  badgeType: 'Green' },
                  { label: 'Restorative — 5:30 PM',      badge: 'Upcoming',   badgeType: 'Amber' },
                  { label: 'Private — Priya S. — 7 PM',  badge: 'Upcoming',   badgeType: 'Amber' },
                ].map((item, i) => (
                  <div key={i} className={s.healthRow}>
                    <div className={s.healthLabel}>{item.label}</div>
                    <Badge label={item.badge} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STUDENTS ─────────────────────────────────────── */}
        {activeTab === 'students' && (
          <div>
            <div className={s.pageHeader}>
              <div>
                <h2 className={s.pageTitle}>Student CRM Directory</h2>
                <p className={s.pageSub}>Manage profiles, history & memberships</p>
              </div>
              <button className={`${s.btn} ${s.btnPrimary} ${s.btnSm}`}>+ Add Student</button>
            </div>

            <div className={s.card}>
              <h3 className={s.cardTitle}>◈ Register New Profile</h3>
              <div className={s.grid3} style={{ marginBottom: '12px' }}>
                <input type="text"  placeholder="Full name"    value={studentForm.name}  onChange={e => setStudentForm({ ...studentForm, name: e.target.value })} />
                <input type="email" placeholder="Email address" value={studentForm.email} onChange={e => setStudentForm({ ...studentForm, email: e.target.value })} />
                <input type="text"  placeholder="Phone number"  value={studentForm.phone} onChange={e => setStudentForm({ ...studentForm, phone: e.target.value })} />
              </div>
              <button className={`${s.btn} ${s.btnPrimary}`}>Save Profile</button>
            </div>

            <div className={`${s.card} ${s.cardNoPad}`}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Name</th><th>Contact</th><th>Batch</th><th>Plan</th><th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fallbackStudents.map((st, i) => (
                    <tr key={i}>
                      <td><strong>{st.name}</strong></td>
                      <td className={s.tdMuted}>{st.email || st.phone || 'N/A'}</td>
                      <td>{st.batch || 'Morning General'}</td>
                      <td>{st.plan || 'Quarterly Pass'}</td>
                      <td><Badge label={st.status || 'Active'} /></td>
                      <td><button className={`${s.btn} ${s.btnSm}`}>View Logs</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── LEADS ────────────────────────────────────────── */}
        {activeTab === 'leads' && (
          <div>
            <div className={s.pageHeader}>
              <div>
                <h2 className={s.pageTitle}>Pipeline Lead Conversion Matrix</h2>
                <p className={s.pageSub}>Track & convert prospective students</p>
              </div>
            </div>
            <div className={s.kanban}>
              {LEAD_STAGES.map(stage => (
                <div key={stage.id} className={s.leadCol}>
                  <div className={`${s.leadColTitle} ${stage.colorClass}`}>{stage.label}</div>
                  {fallbackLeads
                    .filter(l => l.stage === stage.id || (!l.stage && stage.id === 'New'))
                    .map((l, idx) => (
                      <div key={idx} className={s.leadCard}>
                        <strong>{l.name}</strong>
                        <div className={s.leadMeta}>Interest: {l.interestType || 'General Yoga'}</div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── BATCHES ──────────────────────────────────────── */}
        {activeTab === 'batches' && (
          <div>
            <div className={s.pageHeader}>
              <div>
                <h2 className={s.pageTitle}>Batches & Streaming Config</h2>
                <p className={s.pageSub}>Manage live and in-studio batch tracks</p>
              </div>
            </div>
            <div className={s.card}>
              <h3 className={s.cardTitle}>▶ Deploy New Batch</h3>
              <div className={s.grid2} style={{ marginBottom: '12px' }}>
                <input type="text" placeholder="Batch name (e.g. Morning Vinyasa)"       value={batchForm.name}     onChange={e => setBatchForm({ ...batchForm, name: e.target.value })} />
                <input type="text" placeholder="Timings (e.g. 06:00 AM – 07:15 AM)"      value={batchForm.timing}   onChange={e => setBatchForm({ ...batchForm, timing: e.target.value })} />
                <input type="text" placeholder="Assigned Instructor / Acharya"            value={batchForm.trainer}  onChange={e => setBatchForm({ ...batchForm, trainer: e.target.value })} />
                <input type="url"  placeholder="Zoom streaming link (https://...)"        value={batchForm.zoomLink} onChange={e => setBatchForm({ ...batchForm, zoomLink: e.target.value })} />
              </div>
              <button className={`${s.btn} ${s.btnPrimary}`}>Initialize Batch</button>
            </div>
          </div>
        )}

        {/* ── CURRICULUM ───────────────────────────────────── */}
        {activeTab === 'curriculum' && (
          <div>
            <div className={s.pageHeader}>
              <div>
                <h2 className={s.pageTitle}>Courses, Plans & Workshops</h2>
                <p className={s.pageSub}>Manage curriculum and membership tiers</p>
              </div>
            </div>
            <div className={s.grid2}>
              <div className={s.card}>
                <h3 className={s.cardTitle}>◉ Course Matrix</h3>
                {fallbackCourses.map((c, i) => (
                  <div key={i} className={s.curriculumRow}>
                    <div>
                      <strong className={s.curriculumName}>{c.title}</strong>
                      <div className={s.curriculumMeta}>{c.duration} · {c.mode}</div>
                    </div>
                    <div className={s.curriculumPrice}>₹{c.price}</div>
                  </div>
                ))}
              </div>
              <div className={s.card}>
                <h3 className={s.cardTitle}>◈ Membership Passes</h3>
                {fallbackPlans.map((p, i) => (
                  <div key={i} className={s.curriculumRow}>
                    <div>
                      <strong className={s.curriculumName}>{p.name}</strong>
                      <div className={s.curriculumMeta}>{p.durationMonths} Month{p.durationMonths > 1 ? 's' : ''} access</div>
                    </div>
                    <div className={`${s.curriculumPrice} ${s.priceGreen}`}>₹{p.price}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ATTENDANCE ───────────────────────────────────── */}
        {activeTab === 'attendance' && (
          <div>
            <div className={s.pageHeader}>
              <div>
                <h2 className={s.pageTitle}>Reports & Revenue Ledger</h2>
                <p className={s.pageSub}>Attendance analytics & invoice management</p>
              </div>
            </div>
            <div className={s.statsGrid} style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
              <div className={`${s.statCard} ${s.statOrange}`}>
                <div className={s.statLabel}>Floor Attendance</div>
                <div className={`${s.statVal} ${s.valOrange}`}>84.6%</div>
              </div>
              <div className={`${s.statCard} ${s.statBlue}`}>
                <div className={s.statLabel}>Stream Completion</div>
                <div className={`${s.statVal} ${s.valBlue}`}>91.2%</div>
              </div>
              <div className={`${s.statCard} ${s.statGreen}`}>
                <div className={s.statLabel}>Revenue Collected</div>
                <div className={`${s.statVal} ${s.valGreen}`}>₹1.1L</div>
              </div>
            </div>
            <div className={`${s.card} ${s.cardNoPad}`}>
              <table className={s.table}>
                <thead>
                  <tr><th>Invoice</th><th>Student</th><th>Amount</th><th>Date</th><th>Status</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>#INV-2026-001</strong></td>
                    <td>Priya Sharma</td><td>₹4,500</td>
                    <td className={s.tdMuted}>May 12</td>
                    <td><Badge label="Settled" /></td>
                  </tr>
                  <tr>
                    <td><strong>#INV-2026-002</strong></td>
                    <td>Rahul Mehta</td><td>₹6,500</td>
                    <td className={s.tdMuted}>May 18</td>
                    <td><Badge label="Settled" /></td>
                  </tr>
                  <tr>
                    <td><strong>#INV-2026-003</strong></td>
                    <td>Anjali Verma</td><td>₹2,200</td>
                    <td className={s.tdMuted}>Jun 01</td>
                    <td><Badge label="Pending" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── CONSULTATIONS ────────────────────────────────── */}
        {activeTab === 'consultations' && (
          <div>
            <div className={s.pageHeader}>
              <div>
                <h2 className={s.pageTitle}>Bookings & Therapy Calendar</h2>
                <p className={s.pageSub}>Today's consultation agenda</p>
              </div>
            </div>
            <div className={s.card}>
              <h3 className={s.cardTitle}>◷ Today's Therapy Agenda</h3>
              <div className={s.consultList}>
                {fallbackConsultations.map((c, i) => (
                  <div key={i} className={`${s.consultRow} ${c.status === 'Completed' ? s.consultDone : s.consultPending}`}>
                    <div>
                      <strong>{c.clientName}</strong>
                      <span className={s.consultTime}> — {c.dateTime}</span>
                      <span className={s.consultMode}> ({c.mode})</span>
                    </div>
                    <Badge label={c.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── CONTENT ──────────────────────────────────────── */}
        {activeTab === 'content' && (
          <div>
            <div className={s.pageHeader}>
              <div>
                <h2 className={s.pageTitle}>Secure Content Vault</h2>
                <p className={s.pageSub}>Manage access tiers & digital assets</p>
              </div>
            </div>
            <div className={`${s.card} ${s.cardNoPad}`}>
              <table className={s.table}>
                <thead>
                  <tr><th>Asset Title</th><th>Format</th><th>Access Tier</th><th>Allowed Plans</th></tr>
                </thead>
                <tbody>
                  {fallbackContent.map((co, i) => (
                    <tr key={i}>
                      <td><strong>{co.title}</strong></td>
                      <td className={s.tdMuted}>{co.contentType}</td>
                      <td><Badge label={co.accessLevel} /></td>
                      <td className={s.tdMuted}>{co.allowedPlans?.join(', ') || 'All Active Subscribers'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── REWARDS ──────────────────────────────────────── */}
        {activeTab === 'rewards' && (
          <div>
            <div className={s.pageHeader}>
              <div>
                <h2 className={s.pageTitle}>Coupons & Referral Rewards</h2>
                <p className={s.pageSub}>Promotions, discount codes & referral loops</p>
              </div>
            </div>
            <div className={s.grid2}>
              <div className={s.card}>
                <h3 className={s.cardTitle}>✦ Generate Coupon Code</h3>
                <div className={s.formStack}>
                  <input type="text"   placeholder="Code (e.g. FESTIVE20)"    value={couponForm.code}  onChange={e => setCouponForm({ ...couponForm, code: e.target.value })} />
                  <input type="number" placeholder="Discount value (%)"       value={couponForm.value} onChange={e => setCouponForm({ ...couponForm, value: e.target.value })} />
                  <label className={s.checkLabel}>
                    <input
                      type="checkbox"
                      checked={couponForm.isReferral}
                      onChange={e => setCouponForm({ ...couponForm, isReferral: e.target.checked })}
                      className={s.checkInput}
                    />
                    Designate as Referral Tracking Code
                  </label>
                  <button className={`${s.btn} ${s.btnPrimary}`} style={{ width: 'fit-content' }}>Activate Coupon</button>
                </div>
              </div>
              <div className={s.card}>
                <h3 className={s.cardTitle}>◎ Active Promotions</h3>
                {fallbackCoupons.map((cp, i) => (
                  <div key={i} className={s.couponCard}>
                    <div>
                      <div className={s.couponCode}>{cp.code}</div>
                      <div className={s.couponMeta}>{cp.value}{cp.discountType === 'Percentage' ? '%' : '₹'} Off · {cp.discountType}</div>
                    </div>
                    <Badge label={cp.discountType === 'Flat' ? 'Referral' : 'Active'} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── COMMS ────────────────────────────────────────── */}
        {activeTab === 'comms' && (
          <div>
            <div className={s.pageHeader}>
              <div>
                <h2 className={s.pageTitle}>Broadcast & Web Config</h2>
                <p className={s.pageSub}>Notifications & landing page management</p>
              </div>
            </div>
            <div className={s.grid2}>
              <div className={s.card}>
                <h3 className={s.cardTitle}>◈ Mass Notification</h3>
                <div className={s.formStack}>
                  <select value={commForm.segment}  onChange={e => setCommForm({ ...commForm, segment: e.target.value })}>
                    <option value="All">All Registered Profiles</option>
                    <option value="Expired">Expired Members</option>
                  </select>
                  <select value={commForm.platform} onChange={e => setCommForm({ ...commForm, platform: e.target.value })}>
                    <option value="WhatsApp">WhatsApp Business API</option>
                    <option value="Email">Email SMTP</option>
                  </select>
                  <textarea
                    placeholder="Broadcast message payload..."
                    value={commForm.text}
                    onChange={e => setCommForm({ ...commForm, text: e.target.value })}
                    className={s.textarea}
                  />
                  <button className={`${s.btn} ${s.btnPrimary}`} style={{ width: 'fit-content' }}>
                    ↗ Dispatch Notification
                  </button>
                </div>
              </div>
              <div className={s.card}>
                <h3 className={s.cardTitle}>≡ CMS Injection Config</h3>
                <p className={s.cardDesc}>Push updates to public landing page elements instantly.</p>
                <textarea
                  defaultValue={'{ "announcementBanner": "Grand Ashram Intensive Starts Next Week!" }'}
                  className={s.textareaMono}
                />
                <button className={`${s.btn}`} style={{ marginTop: '10px', width: 'fit-content' }}>
                  ↗ Push to Production
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ── LOGOUT MODAL ─────────────────────────────────────────────── */}
      {showLogoutModal && (
        <div className={s.modalOverlay} onClick={() => setShowLogoutModal(false)}>
          <div className={s.modalBox} onClick={e => e.stopPropagation()}>
            <div className={s.modalIcon}>⏏</div>
            <h3 className={s.modalTitle}>Sign out of Ashram OS?</h3>
            <p className={s.modalText}>
              You will be returned to the login screen. Any unsaved changes will be lost.
            </p>
            <div className={s.modalActions}>
              <button className={s.btnCancel} onClick={() => setShowLogoutModal(false)}>
                Stay in session
              </button>
              <button className={s.btnConfirmLogout} onClick={handleLogoutConfirm}>
                Yes, sign out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
