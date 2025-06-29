'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './dashboard.module.css';

export default function Sidebar({ links = [], isOpen = true, isMobile: isMobileProp = false }) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState({});
  const [activeParent, setActiveParent] = useState(null);
  const [activeChildLink, setActiveChildLink] = useState(null);
  const [isMobile, setIsMobile] = useState(isMobileProp);

  useEffect(() => {
    setIsMobile(isMobileProp);
  }, [isMobileProp]);

  // Group links by group_name
  const groupedLinks = useMemo(() => {
    if (!Array.isArray(links)) return {};
    return links.reduce((groups, link) => {
      const { group_name } = link;
      if (!groups[group_name]) groups[group_name] = [];
      groups[group_name].push(link);
      return groups;
    }, {});
  }, [links]);

  useEffect(() => {
    for (const [groupName, groupLinks] of Object.entries(groupedLinks)) {
      for (const link of groupLinks) {
        const fullRoute = `/Dashboard${link.route}`;
        if (pathname === fullRoute) {
          setOpenGroups({ [groupName]: true });
          setActiveParent(groupName);
          setActiveChildLink(link.route);
          return;
        }
      }
    }
  }, [pathname, groupedLinks]);

  const toggleGroup = (groupName) => {
    setOpenGroups((prev) => {
      const newGroups = {};
      Object.keys(prev).forEach((key) => {
        newGroups[key] = false;
      });
      newGroups[groupName] = !prev[groupName];
      return newGroups;
    });

    setActiveParent((prev) => (prev === groupName ? null : groupName));
    setActiveChildLink(null);
  };

  const handleChildClick = (link) => {
    setActiveChildLink(link.route);
    setActiveParent(link.group_name);
  };

  const sidebarClasses = [
    styles.sidebar,
    isMobile ? (isOpen ? styles.sidebarOpen : styles.sidebarCollapsed) : isOpen ? '' : styles.sidebarCollapsed,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <aside className={sidebarClasses} aria-hidden={!isOpen && isMobile}>
      <h2 className={styles.menuTitle}>Menu</h2>

      {Object.keys(groupedLinks).length === 0 ? (
        <div className={styles.loadingText}>Loading menu...</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {Object.entries(groupedLinks).map(([groupName, groupLinks]) => {
            const isGroupOpen = openGroups[groupName];

            return (
              <li key={groupName} className={styles.group}>
                <div
                  className={`${styles.groupTitle} ${isGroupOpen ? styles.groupTitleActive : ''}`}
                  onClick={() => toggleGroup(groupName)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleGroup(groupName);
                    }
                  }}
                  aria-expanded={isGroupOpen}
                  aria-controls={`group-${groupName}`}
                >
                  {groupName}
                </div>

                {isGroupOpen && (
                  <ul className={styles.childLinkList} id={`group-${groupName}`}>
                    {groupLinks.map((link, index) => {
                      const fullRoute = `/Dashboard${link.route}`;
                      const isActive = pathname === fullRoute || activeChildLink === link.route;

                      return (
                        <li key={index}>
                          <Link
                            href={fullRoute}
                            onClick={() => handleChildClick(link)}
                            className={`${styles.childLink} ${isActive ? styles.childLinkActive : ''}`}
                          >
                            {link.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
