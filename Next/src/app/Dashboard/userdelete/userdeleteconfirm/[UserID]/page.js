'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function UserDelete({ params }) {
  const UserID = params.UserID;
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!UserID) return;

    const fetchUser = async () => {
      try {
        const res = await api.get(`user-show/${UserID}`);
        setUser(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load user data.');
        console.error(err);
        setLoading(false);
      }
    };

    fetchUser();
  }, [UserID]);

  const handleDelete = async () => {
    try {
      await api.delete(`user-delete/${UserID}`);
      router.push('/Dashboard/userdelete');
    } catch (err) {
      setError('Failed to delete user.');
      console.error(err.response?.data || err.message);
    }
  };

  const handleCancel = () => {
    router.push('/Dashboard/userdelete');
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center mt-5">
        <p>No user found.</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-danger">Delete User</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="shadow p-4 rounded bg-white">
        <p>Are you sure you want to delete this user?</p>

        <div className="mb-3">
          <label className="form-label fw-bold">User Name</label>
          <input type="text" className="form-control" value={user.DisplayName || ''} disabled />
        </div>

        <div className='row'>
            <div className="mb-3 col-md-6">
                <label className='form-label fw-bold'>User Status</label>
                <input type="text" className='form-control' value={user.Status || ''} disabled/>
            </div>
            <div className="mb-3 col-md-6">
                <label className='form-label fw-bold'>User Role</label>
                <input type="text" className='form-control' value={user.role.RoleName || ''} disabled/>
            </div>
        </div>

        <button onClick={handleDelete} className="btn btn-danger w-100 mb-3">
          Confirm Delete
        </button>
        <button onClick={handleCancel} className="btn btn-secondary w-100">
          Cancel
        </button>
      </div>
    </div>
  );
}
