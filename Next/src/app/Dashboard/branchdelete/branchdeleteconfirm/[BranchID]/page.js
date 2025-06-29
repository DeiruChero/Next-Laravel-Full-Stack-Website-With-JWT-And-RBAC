'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function BranchDelete({ params }) {
  const BranchID = params.BranchID;
  const router = useRouter();

  const [branchName, setBranchName] = useState('');
  const [shortName, setShortName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!BranchID) return;

    const fetchBranch = async () => {
      try {
        const res = await api.get(`branch-show/${BranchID}`);
        const branch = res.data.branch[0];

        setBranchName(branch.BranchName || '');
        setShortName(branch.ShortName || '');
        setLoading(false);
      } catch (err) {
        setError('Failed to load branch data.');
        console.error(err);
        setLoading(false);
      }
    };

    fetchBranch();
  }, [BranchID]);

  const handleDelete = async () => {
    try {
      await api.delete(`branch-delete/${BranchID}`);
      router.push('/Dashboard/branchdelete');
    } catch (err) {
      setError('Failed to delete branch.');
      console.error(err.response?.data || err.message);
    }
  };

  const handleCancel = () => {
    router.push('/Dashboard/branchdelete');
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
      <h2 className="text-center mb-4 text-danger">Delete Branch</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="shadow p-4 rounded bg-white">
        <p>Are you sure you want to delete the following branch?</p>

        <div className="mb-3">
          <label className="form-label fw-bold">Branch Name</label>
          <input type="text" className="form-control" value={branchName} disabled />
        </div>
        <div className="mb-3">
            <label className="form-label fw-bold">Branch Code</label>
            <input className="form-control" value={shortName} type='text' disabled></input>
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
