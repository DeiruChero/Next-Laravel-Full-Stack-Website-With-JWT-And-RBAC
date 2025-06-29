'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function VehicleDelete({ params }) {
  const VehicleID = params.VehicleID;
  const router = useRouter();

  const [vehicleName, setVehicleName] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!VehicleID) return;

    const fetchVehicle = async () => {
      try {
        const res = await api.get(`vehicle-show/${VehicleID}`);
        const vehicle = res.data;

        setVehicleName(vehicle.VehicleName || '');
        setVehicleNumber(vehicle.VehicleNumber || '');
        setVehicleType(vehicle.VehicleType || '');
        setLoading(false);
      } catch (err) {
        setError('Failed to load vehicle data.');
        console.error(err);
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [VehicleID]);

  const handleDelete = async () => {
    try {
      await api.delete(`vehicle-delete/${VehicleID}`);
      router.push('/Dashboard/vehicledelete');
    } catch (err) {
      setError('Failed to delete vehicle.');
      console.error(err.response?.data || err.message);
    }
  };

  const handleCancel = () => {
    router.push('/Dashboard/vehicledelete');
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
      <h2 className="text-center mb-4 text-danger">Delete Vehicle</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="shadow p-4 rounded bg-white">
        <p>Are you sure you want to delete the following vehicle?</p>

        <div className="mb-3">
          <label className="form-label fw-bold">Vehicle Name</label>
          <input type="text" className="form-control" value={vehicleName} disabled />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Vehicle Number</label>
          <input className="form-control" value={vehicleNumber} disabled/>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Vehicle Type</label>
          <input type="text" className="form-control" value={vehicleType} disabled />
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
