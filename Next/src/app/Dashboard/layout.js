'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Sidebar from './_Dashboard/sidebar';
import styles from './_Dashboard/dashboard.module.css';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';


export default function AdminLayout({ children }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [links, setLinks] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);

  const router = useRouter();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/logout');
      if (response.status === 200) {
        localStorage.removeItem('token');
        router.push('/loginpage');
      } else {
        console.error('Logout failed with status:', response.status);
        alert('Logout failed. Please try again.');
      }
    } catch (err) {
      console.error('Logout error:', err);
      alert('Logout failed. Please try again.');
    }
  };

  useEffect(() => {
    let timeoutId = null;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const mobile = window.innerWidth <= 768;
        setIsMobile(mobile);
        setSidebarOpen(!mobile);
      }, 150);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isMobile &&
        sidebarOpen &&
        sidebarRef.current &&
        hamburgerRef.current &&
        !sidebarRef.current.contains(e.target) &&
        !hamburgerRef.current.contains(e.target)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobile, sidebarOpen]);

  useEffect(() => {
    setLoadingUser(true);
    api.get('/userdashboard')
      .then((res) => {
        const { name, role, ['rules names']: rules } = res.data;
        setName(name);
        setRole(role);

        const transformedLinks = Array.isArray(rules)
          ? rules.map((rule) => ({
            name: rule.RulesName,
            group_name: rule.RulesGroup,
            route: rule.Link,
          }))
          : [];

        setLinks(transformedLinks);
      })
      .catch((err) => {
        console.error('Error fetching user details:', err);
      })
      .finally(() => {
        setLoadingUser(false);
      });
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((open) => !open);
  }, []);

  const handleHamburgerKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleSidebar();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName;
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key.toLowerCase() === 'b' &&
        tag !== 'INPUT' &&
        tag !== 'TEXTAREA'
      ) {
        e.preventDefault();
        toggleSidebar();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleSidebar]);

  const mainContentStyle = {
    marginLeft: !isMobile && sidebarOpen ? '220px' : '0',
    transition: 'margin-left 0.3s ease',
  };

  return (
    <div className={styles.pageWrapper}>
      <button
        ref={hamburgerRef}
        className={styles.hamburger}
        onClick={toggleSidebar}
        onKeyDown={handleHamburgerKeyDown}
        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        aria-expanded={sidebarOpen}
        aria-controls="sidebar"
        type="button"
      >
        ☰
      </button>

      <Sidebar
        ref={sidebarRef}
        id="sidebar"
        links={links}
        isOpen={sidebarOpen}
        isMobile={isMobile}
      />

      <div className={styles.mainContent} style={mainContentStyle}>
        <div className={styles.welcomeBox}>
          <a href="#" onClick={handleLogout} className={styles.loginLink}>
            Logout
          </a>
          <h1>
            {loadingUser
              ? 'Loading...'
              : name
                ? `Hi ${name} 👋`
                : 'Hi Guest 👋'}{' '}
            <span className={styles.roleTag}>
              {loadingUser ? 'Loading role' : role || 'No role'}
            </span>
          </h1>
          <p>Welcome to your dashboard!</p>
        </div>
        {children}
      </div>
    </div>
  );
}
