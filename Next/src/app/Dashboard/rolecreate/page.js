'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function RoleCreate() {
    const router = useRouter();
    const [roleName, setRoleName] = useState('');
    const [roleRemark, setRoleRemark] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const [rules, setRules] = useState([]);
    const [groupedRules, setGroupedRules] = useState({});
    const [selectedRules, setSelectedRules] = useState([]);
    const [openGroups, setOpenGroups] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRules = async () => {
            try {
                const res = await api.get('rules-data');
                setRules(res.data.data);

                const grouped = res.data.data.reduce((acc, rule) => {
                    acc[rule.RulesGroup] = acc[rule.RulesGroup] || [];
                    acc[rule.RulesGroup].push(rule);
                    return acc;
                }, {});
                setGroupedRules(grouped);

                const toggles = Object.keys(grouped).reduce((acc, group) => {
                    acc[group] = false;
                    return acc;
                }, {});
                setOpenGroups(toggles);
            } catch (err) {
                console.error('Error fetching rules:', err);
            }
        };

        fetchRules();
    }, []);

    const handleCheckboxChange = (id) => {
        setSelectedRules((prev) =>
            prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
        );
    };

    const handleGroupToggle = (groupName) => {
        setOpenGroups((prev) => ({
            ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
            [groupName]: !prev[groupName]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!roleName.trim()) {
            setErrorMsg('Role Name is required.');
            setSuccessMsg('');
            return;
        }

        try {
            await api.post('roles-store', {
                role_name: roleName,
                role_remark: roleRemark,
                rules: selectedRules,
            });

            setSuccessMsg('Role created successfully! 🎉');
            setErrorMsg('');
            setRoleName('');
            setRoleRemark('');
            setSelectedRules([]);
        } catch (err) {
            console.error('Error creating role:', err.response?.data || err.message);
            setErrorMsg('Failed to create role. Please try again.');
            setSuccessMsg('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Create Role</h2>

            {successMsg && <div className="alert alert-success">{successMsg}</div>}
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-white">
                {/* Role Name */}
                <div className="mb-3">
                    <label className="form-label">Role Name <span className="text-danger">*</span></label>
                    <input
                        type="text"
                        className="form-control"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                        required
                    />
                </div>

                {/* Role Remark */}
                <div className="mb-3">
                    <label className="form-label">Role Remark</label>
                    <input
                        type="text"
                        className="form-control"
                        value={roleRemark}
                        onChange={(e) => setRoleRemark(e.target.value)}
                    />
                </div>

                {/* Rules Selection */}
                <div className="mb-4">
                    <label className="form-label">Assign Rules</label>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {Object.entries(groupedRules).map(([group, rules]) => {
                            const selectedCount = selectedRules.filter(id =>
                                rules.some(rule => rule.RulesID === id)
                            ).length;

                            return (
                                <div key={group} className="mb-3">
                                    <div
                                        onClick={() => handleGroupToggle(group)}
                                        className="bg-light p-2 rounded d-flex justify-content-between align-items-center"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <strong>{group}</strong>
                                        <span>{openGroups[group] ? '▲' : '▼'} ({selectedCount})</span>
                                    </div>

                                    {openGroups[group] && (
                                        <div className="mt-2 ps-3">
                                            {rules.map((rule) => (
                                                <div className="form-check" key={rule.RulesID}>
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={`rule-${rule.RulesID}`}
                                                        checked={selectedRules.includes(rule.RulesID)}
                                                        onChange={() => handleCheckboxChange(rule.RulesID)}
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        htmlFor={`rule-${rule.RulesID}`}
                                                    >
                                                        {rule.RulesName}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading && (
                    <span
                        className="spinner-border spinner-border-sm text-light"
                        role="status"
                        aria-hidden="true"
                    ></span>
                )}
                    {loading ? ' Creating...' : 'Create Role'}</button>
            </form>
        </div>
    );
}
