'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function ProductDelete({ params }) {
  const ProductID = params.ProductID;
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ProductID) return;

    const fetchProduct = async () => {
      try {
        const res = await api.get(`product-show/${ProductID}`);
        setProduct(res.data.product);
        setLoading(false);
      } catch (err) {
        setError('Failed to load product data.');
        console.error(err);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [ProductID]);

  const handleDelete = async () => {
    try {
      await api.delete(`product-delete/${ProductID}`);
      router.push('/Dashboard/productdelete');
    } catch (err) {
      setError('Failed to delete product.');
      console.error(err.response?.data || err.message);
    }
  };

  const handleCancel = () => {
    router.push('/Dashboard/productdelete');
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

  if (!product) {
    return (
      <div className="text-center mt-5">
        <p>No product found.</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-danger">Delete Product</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="shadow p-4 rounded bg-white">
        <p>Are you sure you want to delete the following product?</p>

        <div className="mb-3">
          <label className="form-label fw-bold">Product Name</label>
          <input type="text" className="form-control" value={product.ProductName || ''} disabled />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Product Hindi Name</label>
          <input type="text" className="form-control" value={product.ProductHindiName || ''} disabled />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Product Unicode Name</label>
          <input type="text" className="form-control" value={product.ProductUnicodeName || ''} disabled />
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
