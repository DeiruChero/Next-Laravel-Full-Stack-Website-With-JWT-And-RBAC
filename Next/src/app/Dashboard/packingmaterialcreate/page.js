'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function PackingMaterialCreate() {
  const [formData, setFormData] = useState({
    PackingMaterialName: '',
    Remark: '',
    Weight: '',
    PcsPerUnit: '',
    PurchaseUnit: '',
    MinimumPurchaseQty: '',
    PackagingCost: '',
    BranchID: 1,
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'BranchID' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.PackingMaterialName.trim()) {
      setErrorMsg('Packing Material Name is required.');
      setSuccessMsg('');
      return;
    }
    if (!formData.Weight.trim()) {
      setErrorMsg('Weight is required.');
      setSuccessMsg('');
      return;
    }
    if (!formData.PcsPerUnit.trim()) {
      setErrorMsg('Pcs Per Unit is required.');
      setSuccessMsg('');
      return;
    }
    if (!formData.PurchaseUnit.trim()) {
      setErrorMsg('Purchase Unit is required.');
      setSuccessMsg('');
      return;
    }
    if (!formData.MinimumPurchaseQty.trim()) {
      setErrorMsg('Minimum Purchase Quantity is required.');
      setSuccessMsg('');
      return;
    }
    if (!formData.PackagingCost.trim()) {
      setErrorMsg('Packaging Cost is required.');
      setSuccessMsg('');
      return;
    }

    try {
      await api.post('packingmaterial-store', formData);

      setSuccessMsg('Packing material created successfully! 🎉');
      setErrorMsg('');

      setFormData({
        PackingMaterialName: '',
        Remark: '',
        Weight: '',
        PcsPerUnit: '',
        PurchaseUnit: '',
        MinimumPurchaseQty: '',
        PackagingCost: '',
        BranchID: 1,
      });

    } catch (error) {
      console.error('Error creating packing material:', error);
      setErrorMsg('Failed to create packing material. Please try again.');
      setSuccessMsg('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Create New Packing Material</h2>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
        <div className="mb-3">
          <label className="form-label">
            Packing Material Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            name="PackingMaterialName"
            value={formData.PackingMaterialName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="row">
          <div className="mb-3 col-md-6">
            <label className="form-label">
              Weight <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              step={0.01}
              className="form-control"
              name="Weight"
              value={formData.Weight}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 col-md-6">
            <label className="form-label">
              Pcs Per Unit <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              step={0.01}
              className="form-control"
              name="PcsPerUnit"
              value={formData.PcsPerUnit}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="mb-3 col-md-6">
            <label className="form-label">
              Purchase Unit <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              name="PurchaseUnit"
              value={formData.PurchaseUnit}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 col-md-6">
            <label className="form-label">
              Minimum Purchase Quantity <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              step={0.01}
              className="form-control"
              name="MinimumPurchaseQty"
              value={formData.MinimumPurchaseQty}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3 col-md-6">
          <label className="form-label">
            Packaging Cost <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            step={0.01}
            className="form-control"
            name="PackagingCost"
            value={formData.PackagingCost}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Remark</label>
          <input
            type="text"
            className="form-control"
            name="Remark"
            value={formData.Remark}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading && (
            <span
              className="spinner-border spinner-border-sm text-light"
              role="status"
              aria-hidden="true"
            ></span>
          )}
          {loading ? ' Creating...' : 'Create Packing Material'}
        </button>
      </form>
    </div>
  );
}
