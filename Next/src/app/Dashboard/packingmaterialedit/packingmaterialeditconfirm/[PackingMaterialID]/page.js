'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function PackingMaterialEdit({ params }) {
  const { PackingMaterialID } = params;
  const router = useRouter();

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

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!PackingMaterialID) return;

    const fetchPackingMaterial = async () => {
      try {
        const res = await api.get(`packingmaterial-show/${PackingMaterialID}`);
        const pm = res.data;

        setFormData({
          PackingMaterialName: pm.PackingMaterialName || '',
          Remark: pm.Remark || '',
          Weight: pm.Weight || '',
          PcsPerUnit: pm.PcsPerUnit || '',
          PurchaseUnit: pm.PurchaseUnit || '',
          MinimumPurchaseQty: pm.MinimumPurchaseQty || '',
          PackagingCost: pm.PackagingCost || '',
          BranchID: pm.BranchID || 1,
        });

        setLoading(false);
      } catch (error) {
        setErrorMsg('Failed to load packing material data.');
        console.error(error);
        setLoading(false);
      }
    };

    fetchPackingMaterial();
  }, [PackingMaterialID]);

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
    if (!formData.Weight.toString().trim()) {
      setErrorMsg('Weight is required.');
      setSuccessMsg('');
      return;
    }
    if (!formData.PcsPerUnit.toString().trim()) {
      setErrorMsg('Pcs Per Unit is required.');
      setSuccessMsg('');
      return;
    }
    if (!formData.PurchaseUnit.trim()) {
      setErrorMsg('Purchase Unit is required.');
      setSuccessMsg('');
      return;
    }
    if (!formData.MinimumPurchaseQty.toString().trim()) {
      setErrorMsg('Minimum Purchase Quantity is required.');
      setSuccessMsg('');
      return;
    }
    if (!formData.PackagingCost.toString().trim()) {
      setErrorMsg('Packaging Cost is required.');
      setSuccessMsg('');
      return;
    }

    try {
      await api.put(`packingmaterial-update/${PackingMaterialID}`, formData);

      setSuccessMsg('Packing material updated successfully! 🎉');
      setErrorMsg('');
      router.push('/Dashboard/packingmaterialedit');
    } catch (error) {
      console.error('Failed to update packing material:', error);
      setErrorMsg('Failed to update packing material. Please try again.');
      setSuccessMsg('');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/Dashboard/packingmaterialedit');
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
      <h2 className="text-center mb-4">Edit Packing Material</h2>

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

        <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
          {loading && (
            <span
              className="spinner-border spinner-border-sm text-light"
              role="status"
              aria-hidden="true"
            ></span>
          )}
          {loading ? ' Updating...' : 'Update Packing Material'}
        </button>

        <button type="button" className="btn btn-secondary w-100" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}
