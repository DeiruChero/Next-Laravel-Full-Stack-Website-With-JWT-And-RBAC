'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function PackingMaterialDelete({ params }) {
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
  const [deleting, setDeleting] = useState(false);

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
        setLoading(false);
      }
    };

    fetchPackingMaterial();
  }, [PackingMaterialID]);

  const handleDelete = async () => {
    setDeleting(true);
    setErrorMsg('');
    try {
      await api.delete(`packingmaterial-delete/${PackingMaterialID}`);
      setSuccessMsg('Packing material deleted successfully! 🎉');
      setTimeout(() => {
        router.push('/Dashboard/packingmaterialdelete');
      }, 1500);
    } catch (error) {
      setErrorMsg('Failed to delete packing material. Please try again.');
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    router.push('/Dashboard/packingmaterialdelete');
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
      <h2 className="text-center mb-4 text-danger">Delete Packing Material</h2>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      <form className="shadow p-4 rounded bg-light">
        <div className="mb-3">
          <label className="form-label">
            Packing Material Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            name="PackingMaterialName"
            value={formData.PackingMaterialName}
            disabled
          />
        </div>

        <div className="row">
          <div className="mb-3 col-md-6">
            <label className="form-label">
              Weight <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              className="form-control"
              name="Weight"
              value={formData.Weight ==0 ? 0 : formData.Weight}
              disabled
            />
          </div>

          <div className="mb-3 col-md-6">
            <label className="form-label">
              Pcs Per Unit <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              className="form-control"
              name="PcsPerUnit"
              value={formData.PcsPerUnit ==0 ? 0 : formData.PcsPerUnit}
              disabled
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
              disabled
            />
          </div>

          <div className="mb-3 col-md-6">
            <label className="form-label">
              Minimum Purchase Quantity <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              className="form-control"
              name="MinimumPurchaseQty"
              value={formData.MinimumPurchaseQty ==0 ? 0 : formData.MinimumPurchaseQty}
              disabled
            />
          </div>
        </div>

        <div className="mb-3 col-md-6">
          <label className="form-label">
            Packaging Cost <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            className="form-control"
            name="PackagingCost"
            value={formData.PackagingCost ==0 ? 0 : formData.PackagingCost}
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Remark</label>
          <input
            type="text"
            className="form-control"
            name="Remark"
            value={formData.Remark =="" ? "N/A" : formData.Remark}
            disabled
          />
        </div>

        <button
          type="button"
          className="btn btn-danger w-100 mb-3"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? 'Deleting...' : 'Delete Packing Material'}
        </button>

        <button
          type="button"
          className="btn btn-secondary w-100"
          onClick={handleCancel}
          disabled={deleting}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
