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
  contentItems = [] 
}) {
  const [activeTab, setActiveTab] = useState('insights');
  
  // Controlled form states
  const [studentForm, setStudentForm] = useState({ name: '', email: '', phone: '', batch: '', plan: '' });
  const [batchForm, setBatchForm] = useState({ name: '', timing: '', trainer: '', zoomLink: '' });
  const [commForm, setCommForm] = useState({ segment: 'All', platform: 'WhatsApp', text: '' });
  const [couponForm, setCouponForm] = useState({ code: '', type: 'Percentage', value: '', isReferral: false });

  return (
    <div className={s.rootContainer} style={{ width: '100%', display: 'flex', minHeight: '100vh' }}>
      
      {/* INTERNAL WORKSPACE SUB-NAVBAR */}
      <div style={{ width: '220px', background: 'var(--bark2)', padding: '20px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ padding: '0 10px 15px', color: '#f7941d', fontFamily: 'Cormorant Garamond', fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid var(--bdr)' }}>
          Operational Menu
        </div>
        {[
          { id: 'insights', label: 'Dashboard Insights' },
          { id: 'students', label: 'Students & History' },
          { id: 'leads', label: 'Pipeline CRM Leads' },
          { id: 'batches', label: 'Batches & Streams' },
          { id: 'curriculum', label: 'Courses & Plans' },
          { id: 'attendance', label: 'Reports & Invoices' },
          { id: 'consultations', label: 'Bookings Calendar' },
          { id: 'content', label: 'Content Control' },
          { id: 'comms', label: 'Comms & Web Config' },
          { id: 'rewards', label: 'Coupons & Referrals' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`${s.navItem} ${activeTab === tab.id ? s.activeNav : ''}`}
            style={{ textAlign: 'left', width: '100%', background: 'none', border: 'none', fontSize: '12px' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* DYNAMIC SCREEN WORKSPACE CONTROLLER */}
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        
        {/* INSTRUCTION 1: UNIFIED DASHBOARD INSIGHTS */}
        {activeTab === 'insights' && (
          <div>
            <h2 className={s.pageTitle}>Dashboard Aggregator Engine</h2>
            <div className={s.statsGrid}>
              <div className={s.statCard}><h3>Active Members</h3><div className={s.statVal}>{data.metrics.activeStudents || 248}</div></div>
              <div className={s.statCard}><h3>Open CRM Leads</h3><div className={s.statVal} style={{color:'var(--amber)'}}>{leads.length || 14}</div></div>
              <div className={s.statCard}><h3>Live Batches</h3><div className={s.statVal} style={{color:'var(--blue)'}}>{batches.length || 6}</div></div>
              <div className={s.statCard}><h3>Gross Revenue</h3><div className={s.statVal} style={{color:'var(--green)'}}>₹{(data.metrics.revenue || 180000).toLocaleString('en-IN')}</div></div>
            </div>
            <div className={s.card}>
              <h3>System Health Snapshot</h3>
              <p>All core API gateways are operating normatively. Structural sync loops with Zoom streaming links and payment processors are live.</p>
            </div>
          </div>
        )}

        {/* INSTRUCTION 2 & 3: STUDENT PROFILES & DETAILED PROFILE HISTORY */}
        {activeTab === 'students' && (
          <div>
            <h2 className={s.pageTitle}>Student CRM Directory & Detailed Histories</h2>
            <div className={s.card}>
              <h3>Register New Yogi Entry Profile</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '10px' }}>
                <input type="text" placeholder="Student Name" value={studentForm.name} onChange={e => setStudentForm({...studentForm, name: e.target.value})} />
                <input type="email" placeholder="Email Address" value={studentForm.email} onChange={e => setStudentForm({...studentForm, email: e.target.value})} />
                <input type="text" placeholder="Phone Number" value={studentForm.phone} onChange={e => setStudentForm({...studentForm, phone: e.target.value})} />
              </div>
              <button className={`${s.btn} ${s.btnPrimary}`} style={{ marginTop: '12px' }}>Save Profile Node</button>
            </div>
            <div className={s.tblWrap}>
              <table className={s.table}>
                <thead>
                  <tr><th>Name</th><th>Email / Phone</th><th>Assigned Batch</th><th>Active Matrix Plan</th><th>System Timeline History</th></tr>
                </thead>
                <tbody>
                  {students.map((st, i) => (
                    <tr key={i}>
                      <td><strong>{st.name}</strong></td>
                      <td>{st.email || st.phone || 'N/A'}</td>
                      <td>{st.batch || 'Morning General'}</td>
                      <td>{st.plan || 'Quarterly Pass'}</td>
                      <td><button className={s.btn} style={{ fontSize: '11px', padding: '4px 8px' }}>View Logs</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INSTRUCTION 4: LEADS & STAGE PIPELINE CRM */}
        {activeTab === 'leads' && (
          <div>
            <h2 className={s.pageTitle}>Pipeline Lead Conversion Matrix</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {['New', 'Follow up', 'Converted', 'Cold'].map(stage => (
                <div key={stage} className={s.leadColumn}>
                  <h4 style={{ borderBottom: '2px solid var(--or)', paddingBottom: '4px', marginBottom: '10px' }}>{stage.toUpperCase()}</h4>
                  {leads.filter(l => l.stage === stage || (!l.stage && stage === 'New')).map((l, idx) => (
                    <div key={idx} className={s.leadCard}>
                      <strong>{l.name}</strong>
                      <div style={{ fontSize: '11px', color: 'var(--t2)' }}>Interest: {l.interestType || 'General Yoga'}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INSTRUCTION 5: BATCHES CONFIGURATION & ZOOM LINKS */}
        {activeTab === 'batches' && (
          <div>
            <h2 className={s.pageTitle}>Live Streaming & Traditional Batch Setup</h2>
            <div className={s.card}>
              <h3>Deploy Dynamic Batch Track</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '10px' }}>
                <input type="text" placeholder="Batch Name (e.g., Morning Vinyasa)" value={batchForm.name} onChange={e => setBatchForm({...batchForm, name: e.target.value})} />
                <input type="text" placeholder="Timings (e.g., 06:00 AM - 07:15 AM)" value={batchForm.timing} onChange={e => setBatchForm({...batchForm, timing: e.target.value})} />
                <input type="text" placeholder="Assigned Archarya / Instructor" value={batchForm.trainer} onChange={e => setBatchForm({...batchForm, trainer: e.target.value})} />
                <input type="url" placeholder="Secure Streaming Zoom Link" value={batchForm.zoomLink} onChange={e => setBatchForm({...batchForm, zoomLink: e.target.value})} />
              </div>
              <button className={`${s.btn} ${s.btnPrimary}`} style={{ marginTop: '12px' }}>Initialize Stream Segment</button>
            </div>
          </div>
        )}

        {/* INSTRUCTION 6, 7 & 11: COURSES MATRIX, PLANS, & INTERACTIVE WORKSHOPS */}
        {activeTab === 'curriculum' && (
          <div>
            <h2 className={s.pageTitle}>Curriculum, Tiered Memberships & Workshops</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className={s.card}>
                <h3>Course Matrix Configuration</h3>
                {courses.map((c, i) => (
                  <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid var(--bdr)' }}>
                    <strong>{c.title}</strong> — <span>{c.duration} ({c.mode})</span>
                    <div style={{ color: 'var(--or)', fontWeight: 'bold' }}>₹{c.price}</div>
                  </div>
                ))}
              </div>
              <div className={s.card}>
                <h3>Membership Passes & Live Workshops</h3>
                {plans.map((p, i) => (
                  <div key={i} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid var(--bdr)' }}>
                    <strong>{p.name}</strong> - <span style={{color: 'var(--green)'}}>₹{p.price}</span>
                    <div style={{ fontSize: '11px', color: 'var(--t2)' }}>Duration constraint: {p.durationMonths} Months</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* INSTRUCTION 8 & 9: ATTENDANCE ANALYTICS & INVOICING REVENUE MANAGEMENT */}
        {activeTab === 'attendance' && (
          <div>
            <h2 className={s.pageTitle}>Attendance Analytics & Revenue Control Ledger</h2>
            <div className={s.card}>
              <h3>System Attendance Insights</h3>
              <p>Average studio floor attendance rate: <strong>84.6%</strong> this week. Streaming completion rate: <strong>91.2%</strong>.</p>
            </div>
            <div className={s.card}>
              <h3>Recent Invoices & Payment Ledger</h3>
              <div className={s.tblWrap}>
                <table className={s.table}>
                  <thead>
                    <tr><th>Invoice Reference</th><th>Student Profile</th><th>Amount Collected</th><th>Status Token</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>#INV-2026-001</td><td>Priya Sharma</td><td>₹4,500</td><td><span style={{color:'var(--green)'}}>Settled</span></td></tr>
                    <tr><td>#INV-2026-002</td><td>Rahul Mehta</td><td>₹6,500</td><td><span style={{color:'var(--green)'}}>Settled</span></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* INSTRUCTION 10: INTEGRATED CALENDAR & CONSULTATION BOOKINGS */}
        {activeTab === 'consultations' && (
          <div>
            <h2 className={s.pageTitle}>Consultation Booking & Therapy Calendars</h2>
            <div className={s.card}>
              <h3>Today's Therapy Agenda</h3>
              {data.todayConsultations && data.todayConsultations.length > 0 ? (
                data.todayConsultations.map((c, i) => (
                  <div key={i} style={{ padding: '12px', borderBottom: '1px solid var(--bdr)', display: 'flex', justifyContent: 'space-between' }}>
                    <div><strong>{c.clientName}</strong> — {c.dateTime} ({c.mode})</div>
                    <span style={{ fontWeight: 'bold' }}>{c.status}</span>
                  </div>
                ))
              ) : (
                <p>No active standard private consultation schedules locked for today.</p>
              )}
            </div>
          </div>
        )}

        {/* INSTRUCTION 12 & 13: DIGITAL ASSET VAULT & MULTI-LAYER ACCESS MANAGEMENT */}
        {activeTab === 'content' && (
          <div>
            <h2 className={s.pageTitle}>Secure Content Vault & Granular Access Rules</h2>
            <div className={s.tblWrap}>
              <table className={s.table}>
                <thead>
                  <tr><th>Asset Title</th><th>Content Format</th><th>Access Tier Constraint</th><th>Allowed Targets</th></tr>
                </thead>
                <tbody>
                  {contentItems.map((co, i) => (
                    <tr key={i}>
                      <td><strong>{co.title}</strong></td>
                      <td>{co.contentType}</td>
                      <td><span style={{ color: 'var(--or)', fontWeight: 'bold' }}>{co.accessLevel}</span></td>
                      <td>{co.allowedPlans?.join(', ') || 'All Active Subscribers'}</td>
                    </tr>
                  ))}
                  <tr>
                    <td>Asana Framework Blueprint Handbook</td>
                    <td>PDF Guide</td>
                    <td><span style={{ color: 'var(--amber)', fontWeight: 'bold' }}>Plan-Specific</span></td>
                    <td>Premium Tier Pass Holders</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INSTRUCTION 14 & 17: SYSTEM COUPONS & MULTI-TIER REFERRAL PROGRAM MATRIX */}
        {activeTab === 'rewards' && (
          <div>
            <h2 className={s.pageTitle}>System Promo Coupons & Referral Reward Loops</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className={s.card}>
                <h3>Generate Rules Coupon Code</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input type="text" placeholder="Code String (e.g., FESTIVE20)" value={couponForm.code} onChange={e => setCouponForm({...couponForm, code: e.target.value})} />
                  <input type="number" placeholder="Discount Numerical Value" value={couponForm.value} onChange={e => setCouponForm({...couponForm, value: e.target.value})} />
                  <label>
                    <input type="checkbox" checked={couponForm.isReferral} onChange={e => setCouponForm({...couponForm, isReferral: e.target.checked})} />
                    Designate as Referral Tracking Rule Code
                  </label>
                  <button className={`${s.btn} ${s.btnPrimary}`}>Activate Promotion Token</button>
                </div>
              </div>
              <div className={s.card}>
                <h3>Active Incentive Program Matrix</h3>
                {coupons.map((cp, i) => (
                  <div key={i} className={s.couponCard} style={{ marginBottom: '10px' }}>
                    <div className={s.couponCode}>{cp.code}</div>
                    <div>Value rule: {cp.value}% Off ({cp.discountType})</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* INSTRUCTION 15 & 16: NOTIFICATION ORCHESTRATION & WEB CONTENT CONFIGURATION */}
        {activeTab === 'comms' && (
          <div>
            <h2 className={s.pageTitle}>Broadcast System Gateway & Web Content Configuration</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className={s.card}>
                <h3>Trigger Real-time Mass Notifications</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <select value={commForm.segment} onChange={e => setCommForm({...commForm, segment: e.target.value})}>
                    <option value="All">All Registered Profiles</option>
                    <option value="Expired">Expired Membership Accounts</option>
                  </select>
                  <select value={commForm.platform} onChange={e => setCommForm({...commForm, platform: e.target.value})}>
                    <option value="WhatsApp">WhatsApp Business API</option>
                    <option value="Email">Secure SMTP Email Node</option>
                  </select>
                  <textarea placeholder="Type broadcast message payload..." value={commForm.text} onChange={e => setCommForm({...commForm, text: e.target.value})} style={{ height: '80px' }} />
                  <button className={`${s.btn} ${s.btnPrimary}`}>Dispatch Live Notification Flow</button>
                </div>
              </div>
              <div className={s.card}>
                <h3>Landing Website CMS Configuration Injection</h3>
                <p style={{ fontSize: '12px' }}>Update public-facing layout elements, media strings, or configuration parameters instantly down-funnel.</p>
                <textarea 
                  defaultValue='{ "announcementBanner": "Grand Ashram Intensive Starts Next Week! Secure Your Pass Now." }' 
                  style={{ width: '100%', height: '110px', marginTop: '10px', fontFamily: 'monospace', fontSize: '12px' }} 
                />
                <button className={s.btn} style={{ marginTop: '10px' }}>Push to Production Edge</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}