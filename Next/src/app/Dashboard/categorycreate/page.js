'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function CategoryCreate() {
    const [categoryName, setCategoryName] = useState('');
    const [percentageMargin, setPercentageMargin] = useState('');
    const [sortingLossPercentage, setSortingLossPercentage] = useState('');
    const [weightLossPercentage, setWeightLossPercentage] = useState('');
    const [remark, setRemark] = useState('');
    const [loading, setLoading] = useState(false);

    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!categoryName || !percentageMargin || !sortingLossPercentage || !weightLossPercentage) {
            setErrorMsg('Please fill in all required fields.');
            setSuccessMsg('');
            return;
        }

        try {
            await api.post('category-store', {
                CategoryName: categoryName,
                PercentageMargin: percentageMargin,
                SortingLossPercentage: sortingLossPercentage,
                WeightLossPercentage: weightLossPercentage,
                Remark: remark,
            });

            setSuccessMsg('Category created successfully! 🎉');
            setErrorMsg('');
            setCategoryName('');
            setPercentageMargin('');
            setSortingLossPercentage('');
            setWeightLossPercentage('');
            setRemark('');
        } catch (error) {
            console.error('Error creating category:', error);
            setErrorMsg('Failed to create category. Please try again.');
            setSuccessMsg('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Create New Category</h2>

            {successMsg && <div className="alert alert-success">{successMsg}</div>}
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
                <div className="mb-3">
                    <label className="form-label fw-bold">
                        Category Name <span className="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Remark (Optional)</label>
                    <input
                        type="text"
                        className="form-control"
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
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

                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading && (
                        <span
                            className="spinner-border spinner-border-sm text-light"
                            role="status"
                            aria-hidden="true"
                        ></span>
                    )}
                    {loading ? ' Creating...' : 'Create Category'}
                </button>
            </form>
        </div>
    );
}
