'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function UnitDelete({ params }) {
  const PackSizeID = params.PackSizeID;
  const router = useRouter();

  const [packSizeName, setPackSizeName] = useState('');
  const [facter, setFacter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!PackSizeID) return;

    const fetchPackSize = async () => {
      try {
        const res = await api.get(`packsize-show/${PackSizeID}`);
        const packsize = res.data;

        setPackSizeName(packsize.PackSizeName || '');
        setFacter(packsize.Facter || '');
        setLoading(false);
      } catch (err) {
        setError('Failed to load packsize data.');
        console.error(err);
        setLoading(false);
      }
    };

    fetchPackSize();
  }, [PackSizeID]);

  const handleDelete = async () => {
    try {
      await api.delete(`packsize-delete/${PackSizeID}`);
      router.push('/Dashboard/packsizedelete');
    } catch (err) {
      setError('Failed to delete packsize.');
      console.error(err.response?.data || err.message);
    }
  };

  const handleCancel = () => {
    router.push('/Dashboard/packsizedelete');
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
      <h2 className="text-center mb-4 text-danger">Delete Pack Size</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="shadow p-4 rounded bg-white">

        <div className="mb-3">
          <label className="form-label fw-bold">Pack Size Name</label>
          <input type="text" className="form-control" value={packSizeName} disabled />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Facter</label>
          <textarea className="form-control" value={facter} disabled />
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
