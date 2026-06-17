import React from 'react';
import { Link } from 'react-router-dom';
import s from './YogaAdmin.module.css';
import {
  LuChevronsLeft, LuChevronsRight, LuChevronsUpDown, LuPlus, LuLogOut, LuArrowLeft,
} from 'react-icons/lu';

const SECTIONS = [
  { label: 'Core Operations', range: [0, 4] },
  { label: 'Studio Management', range: [4, 8] },
  { label: 'Growth & Comms', range: [8, 10] },
];

export default function Sidebar({
  activeTab, setActiveTab, navItems, user, onSignOut,
  collapsed, onToggleCollapse, mobileOpen, onCloseMobile, onQuickCreate,
}) {
  const handleNav = (id) => { setActiveTab(id); onCloseMobile?.(); };

  return (
    <aside className={`${s.sidebar} ${collapsed ? s.sidebarCollapsed : ''} ${mobileOpen ? s.sidebarOpen : ''}`}>
      <div className={s.sidebarInner}>
        <button type="button" className={s.collapseBtn} onClick={onToggleCollapse} title={collapsed ? 'Expand' : 'Collapse'}>
          {collapsed ? <LuChevronsRight /> : <LuChevronsLeft />}
        </button>

        {/* Workspace switcher */}
        <div className={s.workspace}>
          <div className={s.logoMark}>🪷</div>
          <div>
            <span className={s.logoTitle}>Ashram OS</span>
            <span className={s.logoSub}>Pragya Yoga Studio</span>
          </div>
          <LuChevronsUpDown className={s.workspaceChevron} />
        </div>

        {/* Quick action */}
        <button type="button" className={s.sideQuick} onClick={onQuickCreate}>
          <LuPlus size={16} /><span className={s.sideQuickText}>Quick Create</span>
        </button>

        {/* Nav */}
        <nav className={s.navScroll}>
          {SECTIONS.map(sec => (
            <React.Fragment key={sec.label}>
              <div className={s.sidebarSection}>{sec.label}</div>
              {navItems.slice(sec.range[0], sec.range[1]).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleNav(tab.id)}
                  className={`${s.navItem} ${activeTab === tab.id ? s.navActive : ''}`}
                  title={tab.label}
                >
                  <span className={s.navIcon}>{tab.icon}</span>
                  <span className={s.navText}>{tab.label}</span>
                  {tab.badge ? <span className={s.navBadge}>{tab.badge}</span> : null}
                </button>
              ))}
            </React.Fragment>
          ))}
        </nav>

        {/* Footer / profile */}
        <div className={s.sidebarFooter}>
          <div className={s.userRow}>
            <div className={s.userAvatar}>{user.avatar}</div>
            <div className={s.userMeta}>
              <div className={s.userName}>{user.name}</div>
              <div className={s.userRole}>{user.role}</div>
            </div>
          </div>
          <Link to="/" className={s.btnLogout} title="Back to Website">
            <span className={s.logoutIcon}><LuArrowLeft /></span><span>Back to Website</span>
          </Link>
          <button type="button" className={s.btnLogout} onClick={onSignOut} title="Sign Out">
            <span className={s.logoutIcon}><LuLogOut /></span><span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
