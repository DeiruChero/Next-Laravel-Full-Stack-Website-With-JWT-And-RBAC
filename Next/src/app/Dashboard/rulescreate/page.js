'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function RulesCreate() {
    const [ruleName, setRuleName] = useState('');
    const [route, setRoute] = useState('');
    const [groupName, setGroupName] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!ruleName.trim() || !route.trim() || !groupName.trim()) {
            setErrorMsg('All fields are required.');
            setSuccessMsg('');
            return;
        }

        try {
            await api.post('rules-store', {
                rule_name: ruleName,
                route: route,
                group_name: groupName,
            });

            setSuccessMsg('Rule created successfully! 🎉');
            setErrorMsg('');
            setRuleName('');
            setRoute('');
            setGroupName('');
            router.refresh();
            window.location.reload();
        } catch (error) {
            console.error('Error creating rule:', error);
            setErrorMsg('Failed to create rule. Please try again.');
            setSuccessMsg('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Create New Rule</h2>

            {successMsg && <div className="alert alert-success">{successMsg}</div>}
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
                <div className="mb-3">
                    <label className="form-label">
                        Rule Name <span className="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={ruleName}
                        onChange={(e) => setRuleName(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        Link <span className="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={route}
                        onChange={(e) => setRoute(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        Rule Group <span className="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading && (
                        <span
                            className="spinner-border spinner-border-sm text-light"
                            role="status"
                            aria-hidden="true"
                        ></span>
                    )}
                    {loading ? ' Creating...' : 'Create Rule'}
                </button>
            </form>
        </div>
    );
}
