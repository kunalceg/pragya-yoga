import React from 'react';
import s from './YogaAdmin.module.css';

export default function Sidebar({ activeTab, setActiveTab, navItems, user, onSignOut }) {
  return (
    <aside className={s.sidebar}>
      <div className={s.sidebarLogo}>
        <span className={s.logoMark}>🪷</span>
        <div><span className={s.logoTitle}>Ashram OS</span><span className={s.logoSub}>Yoga Studio Admin</span></div>
      </div>
      <div className={s.sidebarSection}>Core Operations</div>
      {navItems.slice(0, 4).map(tab => (
        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`${s.navItem} ${activeTab === tab.id ? s.navActive : ''}`}>
          <span className={s.navIcon}>{tab.icon}</span>{tab.label}
        </button>
      ))}
      <div className={s.sidebarSection}>Studio Management</div>
      {navItems.slice(4, 8).map(tab => (
        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`${s.navItem} ${activeTab === tab.id ? s.navActive : ''}`}>
          <span className={s.navIcon}>{tab.icon}</span>{tab.label}
        </button>
      ))}
      <div className={s.sidebarSection}>Communications</div>
      {navItems.slice(8).map(tab => (
        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`${s.navItem} ${activeTab === tab.id ? s.navActive : ''}`}>
          <span className={s.navIcon}>{tab.icon}</span>{tab.label}
        </button>
      ))}
      <div className={s.sidebarFooter}>
        <div className={s.userRow}>
          <div className={s.userAvatar}>{user.avatar}</div>
          <div><div className={s.userName}>{user.name}</div><div className={s.userRole}>{user.role}</div></div>
        </div>
        <button type="button" className={s.btnLogout} onClick={onSignOut}>
          <span className={s.logoutIcon}>⏏</span>Sign Out of Studio
        </button>
      </div>
    </aside>
  );
}