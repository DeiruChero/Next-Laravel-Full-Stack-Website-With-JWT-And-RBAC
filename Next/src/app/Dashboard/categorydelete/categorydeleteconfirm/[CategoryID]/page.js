'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function CategoryDelete({ params }) {
  const CategoryID = params.CategoryID;
  const router = useRouter();

  const [categoryName, setCategoryName] = useState('');
  const [remark, setRemark] = useState('');
  const [percentageMargin, setPercentageMargin] = useState('');
  const [sortingLossPercentage, setSortingLossPercentage] = useState('');
  const [weightLossPercentage, setWeightLossPercentage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!CategoryID) return;

    const fetchCategory = async () => {
      try {
        const res = await api.get(`category-show/${CategoryID}`);
        const category = res.data;

        setCategoryName(category.CategoryName || '');
        setRemark(category.Remark || '');
        setPercentageMargin(category.PercentageMargin || '');
        setSortingLossPercentage(category.SortingLossPercentage || '');
        setWeightLossPercentage(category.WeightLossPercentage || '');
        setLoading(false);
      } catch (err) {
        setError('Failed to load category data.');
        console.error(err);
        setLoading(false);
      }
    };

    fetchCategory();
  }, [CategoryID]);

  const handleDelete = async () => {
    try {
      await api.delete(`category-delete/${CategoryID}`);
      router.push('/Dashboard/categorydelete');
    } catch (err) {
      setError('Failed to delete category.');
      console.error(err.response?.data || err.message);
    }
  };

  const handleCancel = () => {
    router.push('/Dashboard/categorydelete');
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
      <h2 className="text-center mb-4 text-danger">Delete Category</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="shadow p-4 rounded bg-white">
        <p>Are you sure you want to delete the following category?</p>

        <div className="mb-3">
          <label className="form-label fw-bold">Category Name</label>
          <input type="text" className="form-control" value={categoryName} disabled />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Remark</label>
          <textarea className="form-control" value={remark} disabled rows={3} />
        </div>

        <div className='row'>
          <div className="mb-3 col-md-4">
            <label className="form-label fw-bold">Percentage Margin</label>
            <textarea className="form-control" value={percentageMargin} disabled />
          </div>

          <div className="mb-3 col-md-4">
            <label className="form-label fw-bold">Sorting Loss Percentage</label>
            <textarea className="form-control" value={sortingLossPercentage} disabled />
          </div>

          <div className="mb-3 col-md-4">
            <label className="form-label fw-bold">Weight Loss Percentage</label>
            <textarea className="form-control" value={weightLossPercentage} disabled />
          </div>
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
