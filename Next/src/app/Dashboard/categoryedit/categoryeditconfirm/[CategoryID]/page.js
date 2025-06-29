'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function CategoryEdit({ params }) {
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
                setSortingLossPercentage(category.SortingLossPercentage || '');
                setPercentageMargin(category.PercentageMargin || '');
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put(`category-update/${CategoryID}`, {
                CategoryName: categoryName,
                Remark: remark,
                SortingLossPercentage: sortingLossPercentage,
                PercentageMargin: percentageMargin,
                WeightLossPercentage: weightLossPercentage
            });
            router.push('/Dashboard/categoryedit');
        } catch (err) {
            setError('Failed to update category.');
            console.error(err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.push('/Dashboard/categoryedit');
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
            <h2 className="text-center mb-4">Edit Category</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-white">
                <div className="mb-3">
                    <label className="form-label fw-bold">Category Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
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

                <div className='row'>
                    <div className="mb-3 col-md-4">
                        <label className="form-label fw-bold">
                            Percentage Margin (%) <span className="text-danger">*</span>
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            value={percentageMargin}
                            onChange={(e) => setPercentageMargin(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3 col-md-4">
                        <label className="form-label fw-bold">
                            Sorting Loss Percentage (%) <span className="text-danger">*</span>
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            value={sortingLossPercentage}
                            onChange={(e) => setSortingLossPercentage(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3 col-md-4">
                        <label className="form-label fw-bold">
                            Weight Loss Percentage (%) <span className="text-danger">*</span>
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            value={weightLossPercentage}
                            onChange={(e) => setWeightLossPercentage(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="btn btn-success w-100 mb-3" disabled={loading}>
                    {loading && (
                        <span
                            className="spinner-border spinner-border-sm text-light"
                            role="status"
                            aria-hidden="true"
                        ></span>
                    )}
                    {loading ? ' Updating...' : 'Update Category'}
                </button>
                <button type="button" className="btn btn-secondary w-100" onClick={handleCancel}>
                    Cancel
                </button>
            </form>
        </div>
    );
}
