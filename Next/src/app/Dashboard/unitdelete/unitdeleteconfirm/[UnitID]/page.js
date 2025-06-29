'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function UnitDelete({ params }) {
  const UnitID = params.UnitID;
  const router = useRouter();

  const [unitName, setUnitName] = useState('');
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!UnitID) return;

    const fetchUnit = async () => {
      try {
        const res = await api.get(`unit-show/${UnitID}`);
        const unit = res.data;

        setUnitName(unit.UnitName || '');
        setRemark(unit.Remark || '');
        setLoading(false);
      } catch (err) {
        setError('Failed to load unit data.');
        console.error(err);
        setLoading(false);
      }
    };

    fetchUnit();
  }, [UnitID]);

  const handleDelete = async () => {
    try {
      await api.delete(`unit-delete/${UnitID}`);
      router.push('/Dashboard/unitdelete');
    } catch (err) {
      setError('Failed to delete unit.');
      console.error(err.response?.data || err.message);
    }
  };

  const handleCancel = () => {
    router.push('/Dashboard/unitdelete');
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
      <h2 className="text-center mb-4 text-danger">Delete Unit</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="shadow p-4 rounded bg-white">
        <p>Are you sure you want to delete the following unit?</p>

        <div className="mb-3">
          <label className="form-label fw-bold">Unit Name</label>
          <input type="text" className="form-control" value={unitName} disabled />
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
