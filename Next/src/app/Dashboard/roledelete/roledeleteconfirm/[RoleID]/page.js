'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function RoleDelete({ params }) {
    const RoleID = params.RoleID;
    const router = useRouter();

    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const res = await api.get(`roles-show/${RoleID}`);
                setRole(res.data.role);
            } catch (err) {
                console.error('Error fetching role:', err);
                setErrorMsg('Failed to fetch role data.');
            } finally {
                setLoading(false);
            }
        };

        if (RoleID) fetchRole();
    }, [RoleID]);

    const handleDelete = async () => {
        try {
            await api.delete(`roles-delete/${RoleID}`);
            router.push('/Dashboard/roledelete');
        } catch (err) {
            console.error('Error deleting role:', err);
            setErrorMsg('Failed to delete the role.');
        }
    };

    const handleCancel = () => {
        router.push('/Dashboard/roledelete');
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (errorMsg) {
        return <div className="alert alert-danger mt-5 text-center">{errorMsg}</div>;
    }

    return (
        <div className="container mt-5">
            <div className="card shadow p-4">
                <h3 className="mb-3 text-danger text-center">Are you sure you want to delete this role?</h3>
                <ul className="list-group mb-4">
                    <li className="list-group-item"><strong>ID:</strong> {role.RoleID}</li>
                    <li className="list-group-item"><strong>Name:</strong> {role.RoleName}</li>
                    <li className="list-group-item"><strong>Remark:</strong> {role.Remark}</li>
                </ul>

                <div className="d-flex justify-content-center gap-3">
                    <button onClick={handleDelete} className="btn btn-danger">Delete</button>
                    <button onClick={handleCancel} className="btn btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
    );
}
