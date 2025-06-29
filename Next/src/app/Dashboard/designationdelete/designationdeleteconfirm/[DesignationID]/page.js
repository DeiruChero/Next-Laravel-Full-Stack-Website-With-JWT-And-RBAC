'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function DesignationDelete({ params }) {
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

  const handleDelete = async () => {
    try {
      await api.delete(`designation-delete/${DesignationID}`);
      router.push('/Dashboard/designationdelete');
    } catch (err) {
      setError('Failed to delete designation.');
      console.error(err.response?.data || err.message);
    }
  };

  const handleCancel = () => {
    router.push('/Dashboard/designationdelete');
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

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-danger">Delete Designation</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="shadow p-4 rounded bg-white">
        <p>Are you sure you want to delete the following designation?</p>

        <div className="mb-3">
          <label className="form-label fw-bold">Designation Name</label>
          <input type="text" className="form-control" value={designationName} disabled />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Remark</label>
          <textarea className="form-control" value={remark} disabled rows={3} />
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
