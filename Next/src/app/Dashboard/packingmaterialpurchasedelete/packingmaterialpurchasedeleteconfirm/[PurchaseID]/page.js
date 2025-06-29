'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function PackingMaterialPurchaseDelete({ params }) {
    const PurchaseID = params.PurchaseID;
    const router = useRouter();

    const [purchaseInvoiceNo, setPurchaseInvoiceNo] = useState('');
    const [date, setDate] = useState('');
    const [selectVendor, setSelectVendor] = useState('');
    const [remark, setRemark] = useState('');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!PurchaseID) return;

        const fetchPackingMaterialPurchase = async () => {
            try {
                const res = await api.get(`packingmaterialpurchase-info/${PurchaseID}`);
                const data = res.data;

                setPurchaseInvoiceNo(data.PurchaseInvoiceNo);
                setDate(data.PurchaseDate);
                setSelectVendor(data.VenderName);
                setRemark(data.Remark || '');
                setItems(data.items || []);
                setLoading(false);
            } catch (err) {
                setError('Failed to load packing material purchase data.');
                console.error(err);
                setLoading(false);
            }
        };

        fetchPackingMaterialPurchase();
    }, [PurchaseID]);

    const handleDelete = async () => {
        try {
            await api.delete(`packingmaterialpurchase-delete/${PurchaseID}`);
            router.push('/Dashboard/packingmaterialpurchasedelete');
        } catch (err) {
            setError('Failed to delete this packing material purchase data.');
            console.error(err.response?.data || err.message);
        }
    };

    const handleCancel = () => {
        router.push('/Dashboard/packingmaterialpurchasedelete');
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
            <h2 className="text-center mb-4 text-danger fw-bold">Delete Packing Material Purchase</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="shadow p-4 rounded bg-white">
                <p className='text-danger fw-bold'>Are you sure you want to delete the following data?</p>

                <div className="row">
                    <div className="mb-3 col-md-6">
                        <label className="form-label fw-bold">Purchase Invoice No.</label>
                        <input type="text" className="form-control" value={purchaseInvoiceNo} disabled />
                    </div>
                    <div className='mb-3 col-md-6'>
                        <label className='form-label fw-bold'>Date</label>
                        <input className="form-control" value={date} disabled />
                    </div>
                </div>

                <div className="mb-3">
                    <label className='form-label fw-bold'>Selected Vendor</label>
                    <input className="form-control" value={selectVendor} disabled />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Remark</label>
                    <textarea className="form-control" value={remark} disabled rows={3} />
                </div>

                <hr className="my-4 border border-danger" />
                <h5 className="mb-3 fw-bold">Added Packing Material(s)</h5>

                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead className="table-success">
                            <tr>
                                <th style={{ minWidth: '240px', backgroundColor: 'lightgrey' }}>Packing Material</th>
                                <th style={{ width: '140px', minWidth: '100px', backgroundColor: 'lightgrey' }}>Qty</th>
                                <th style={{ width: '140px', minWidth: '80px', backgroundColor: 'lightgrey' }}>Unit</th>
                                <th style={{ width: '140px', minWidth: '100px', backgroundColor: 'lightgrey' }}>Rate</th>
                                <th style={{ width: '160px', minWidth: '120px', backgroundColor: 'lightgrey' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length > 0 ? (
                                items.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.PackingMaterialName}</td>
                                        <td>{item.Quantity}</td>
                                        <td>{item.PurchaseUnit}</td>
                                        <td>{item.RatePerUnit}</td>
                                        <td>{item.Amount}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted">No items found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
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
