'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function GroupEdit({ params }) {
  const GroupID = params.GroupID;
  const router = useRouter();

  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!GroupID) return;

    const fetchGroup = async () => {
      try {
        const res = await api.get(`group-show/${GroupID}`);
        const group = res.data;

        setGroupName(group.GroupName || '');
        setLoading(false);
      } catch (err) {
        setError('Failed to load product group data.');
        console.error(err);
        setLoading(false);
      }
    };

    fetchGroup();
  }, [GroupID]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`group-update/${GroupID}`, {
        GroupName: groupName,
      });
      router.push('/Dashboard/groupedit');
    } catch (err) {
      setError('Failed to update product group.');
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/Dashboard/groupedit');
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

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Edit Product Group</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-white">
        <div className="mb-3">
          <label className="form-label fw-bold">Group Name</label>
          <input
            type="text"
            className="form-control"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-success w-100 mb-3" disabled={loading}>
          {loading && (
            <span
              className="spinner-border spinner-border-sm text-light"
              role="status"
              aria-hidden="true"
            ></span>
          )}
          {loading ? ' Updating...' : 'Update Product Group'}
        </button>
        <button type="button" className="btn btn-secondary w-100" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}
