'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './dashboard.module.css';
import api from '@/lib/axios';

function Sidebar({ links = [] }) {
    const pathname = usePathname();
    const [openGroups, setOpenGroups] = useState({});
    const [activeParent, setActiveParent] = useState(null);
    const [activeChildLink, setActiveChildLink] = useState(null);

    const groupedLinks = Array.isArray(links)
        ? links.reduce((groups, link) => {
              const { group_name } = link;
              if (!groups[group_name]) {
                  groups[group_name] = [];
              }
              groups[group_name].push(link);
              return groups;
          }, {})
        : {};

    const toggleGroup = (groupName) => {
        setOpenGroups((prev) => {
            const newOpenGroups = { ...prev };
            if (newOpenGroups[groupName]) {
                newOpenGroups[groupName] = false;
                setActiveParent(null);
            } else {
                Object.keys(newOpenGroups).forEach((key) => {
                    newOpenGroups[key] = false;
                });
                newOpenGroups[groupName] = true;
                setActiveParent(groupName);
            }
            return newOpenGroups;
        });

        setActiveChildLink(null);
    };

    const handleChildClick = (link) => {
        setActiveChildLink(link.route);
        setActiveParent(link.group_name);
    };

    return (
        <div className={styles.sidebar}>
            <h2 className={styles.menuTitle}>Menu</h2>

            {Object.keys(groupedLinks).length === 0 ? (
                <div className={styles.loadingText}>Loading menu...</div>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {Object.entries(groupedLinks).map(([groupName, groupLinks]) => {
                        const isGroupActive = activeParent === groupName;

                        return (
                            <li key={groupName} className={styles.group}>
                                <div
                                    className={`${styles.groupTitle} ${
                                        isGroupActive ? styles.groupTitleActive : ''
                                    }`}
                                    onClick={() => toggleGroup(groupName)}
                                >
                                    {groupName}
                                </div>

                                {isGroupActive && (
                                    <ul className={styles.childLinkList}>
                                        {groupLinks.map((link, index) => {
                                            const isChildActive = pathname === `/dashboard${link.route}`;

                                            return (
                                                <li key={index}>
                                                    <Link
                                                        href={`/dashboard${link.route}`}
                                                        onClick={() => handleChildClick(link)}
                                                        className={`${styles.childLink} ${
                                                            isChildActive ? styles.childLinkActive : ''
                                                        }`}
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
        </div>
    );
}

export default function DashboardPage() {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [links, setLinks] = useState([]);

    useEffect(() => {
        api
            .get('/user')
            .then((res) => setName(res.data.name))
            .catch((err) => console.error('Error fetching user:', err));

        api
            .get('/sidebar-links')
            .then((res) => {
                setLinks(res.data.links);
                setRole(res.data.role_name);
            })
            .catch((err) => console.error('Error fetching sidebar links:', err));
    }, []);

    return (
        <div className={styles.pageWrapper}>
            <Sidebar links={links} />
            <div className={styles.mainContent}>
                <div className={styles.welcomeBox}>
                    <a href="/Dashboard/loginpage" className={styles.loginLink}>
                        Login
                    </a>
                    <h1>
                        {name ? `Hi ${name} 👋` : 'Loading...'}{' '}
                        <span className={styles.roleTag}>({role})</span>
                    </h1>
                    <p>Welcome to your dashboard!</p>
                </div>
            </div>
        </div>
    );
}
