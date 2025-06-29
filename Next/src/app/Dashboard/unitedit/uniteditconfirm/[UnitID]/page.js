'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function UnitEdit({ params }) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`unit-update/${UnitID}`, {
        UnitName: unitName,
        Remark: remark,
      });
      router.push('/Dashboard/unitedit');
    } catch (err) {
      setError('Failed to update unit.');
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/Dashboard/unitedit');
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
      <h2 className="text-center mb-4">Edit Unit</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-white">
        <div className="mb-3">
          <label className="form-label fw-bold">Unit Name <span className='text-danger'>*</span></label>
          <input
            type="text"
            className="form-control"
            value={unitName}
            onChange={(e) => setUnitName(e.target.value)}
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
          {loading ? ' Updating...' : 'Update Unit'}
        </button>
        <button type="button" className="btn btn-secondary w-100" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}
