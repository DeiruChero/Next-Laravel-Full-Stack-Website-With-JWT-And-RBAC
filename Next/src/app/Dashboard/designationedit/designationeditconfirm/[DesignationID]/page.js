'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function DesignationEdit({ params }) {
  const DesignationID = params.DesignationID;
  const router = useRouter();

  const [designationName, setDesignationName] = useState('');
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!DesignationID) return;

    const fetchDesignation = async () => {
      try {
        const res = await api.get(`designation-show/${DesignationID}`);
        const designation = res.data;

        setDesignationName(designation.DesignationName || '');
        setRemark(designation.Remark || '');
        setLoading(false);
      } catch (err) {
        setError('Failed to load designation data.');
        console.error(err);
        setLoading(false);
      }
    };

    fetchDesignation();
  }, [DesignationID]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`designation-update/${DesignationID}`, {
        DesignationName: designationName,
        Remark: remark,
      });
      router.push('/Dashboard/designationedit');
    } catch (err) {
      setError('Failed to update designation.');
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/Dashboard/designationedit');
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
      <h2 className="text-center mb-4">Edit Designation</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-white">
        <div className="mb-3">
          <label className="form-label fw-bold">Designation Name <span className='text-danger'>*</span></label>
          <input
            type="text"
            className="form-control"
            value={designationName}
            onChange={(e) => setDesignationName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Remark</label>
          <textarea
            className="form-control"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            rows={3}
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
          {loading ? ' Updating...' : 'Update Designation'}
        </button>
        <button type="button" className="btn btn-secondary w-100" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}
