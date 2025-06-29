'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function CityDelete({ params }) {
  const CityID = params.CityID;
  const router = useRouter();

  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!CityID) return;

    const fetchCity = async () => {
      try {
        const res = await api.get(`/city-show/${CityID}`);
        setCity(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load city data.');
        console.error(err);
        setLoading(false);
      }
    };

    fetchCity();
  }, [CityID]);

  const handleDelete = async () => {
    try {
      await api.delete(`/city-delete/${CityID}`);
      router.push('/Dashboard/citydelete');
    } catch (err) {
      setError('Failed to delete this city.');
      console.error(err.response?.data || err.message);
    }
  };

  const handleCancel = () => {
    router.push('/Dashboard/citydelete');
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

  if (!city) {
    return (
      <div className="text-center mt-5">
        <div className='alert alert-danger'>City details not found!</div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-danger">Delete this City</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="shadow p-4 rounded bg-white">

        <div className="mb-3">
          <label className="form-label fw-bold">City Name</label>
          <input type="text" className="form-control" value={city.CityName || ''} disabled />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">State Name</label>
          <input type="text" className="form-control" value={city.state.StateName || ''} disabled />
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
