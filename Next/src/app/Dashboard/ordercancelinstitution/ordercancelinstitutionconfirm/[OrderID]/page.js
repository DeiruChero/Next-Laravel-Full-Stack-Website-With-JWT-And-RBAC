'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function OrderCancelInstitutionConfirm({ params }) {
    const OrderID = params.OrderID;
    const router = useRouter();

    const [orderNo, setOrderNo] = useState('');
    const [date, setDate] = useState('');
    const [selectedClient, setSelectedClient] = useState('');
    const [remark, setRemark] = useState('');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!OrderID) return;

        const fetchInstitutionOrder = async () => {
            try {
                const res = await api.get(`ordercancelinstitution-show/${OrderID}`);
                const order = res.data;

                setOrderNo(order.OrderNo);
                setDate(order.OrderDate);
                setSelectedClient(order.DisplayName);
                setRemark(order.Remark || 'null');
                setItems(order.items || []);
                setLoading(false);
            } catch (err) {
                setError("Failed to load institution's order data.");
                console.error(err);
                setLoading(false);
            }
        };

        fetchInstitutionOrder();
    }, [OrderID]);

    const handleDelete = async () => {
        try {
            await api.put(`ordercancelinstitution-cancel/${OrderID}`);
            router.push('/Dashboard/ordercancelinstitution');
        } catch (err) {
            setError("Failed to cancel institution's order.");
            console.error(err.response?.data || err.message);
        }
    };

    const handleCancel = () => {
        router.push('/Dashboard/ordercancelinstitution');
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
            <h2 className="text-center mb-4 text-danger fw-bold">Cancel Institution's Order</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="shadow p-4 rounded bg-white">
                <p className='text-danger fw-bold'>Are you sure you want to cancel the following institution's order?</p>

                <div className="row">
                    <div className="mb-3 col-md-6">
                        <label className="form-label fw-bold">Order No</label>
                        <input
                            className="form-control"
                            value={orderNo}
                            disabled
                        />
                    </div>
                    <div className="mb-3 col-md-6">
                        <label className="form-label fw-bold">Date</label>
                        <input
                            className="form-control"
                            value={date}
                            disabled
                        />
                    </div>
                </div>
                <div className="mb-3">
                    <label className='form-label fw-bold'>Institution Name</label>
                    <input className='form-control' value={selectedClient} disabled></input>
                </div>
                <div className="mb-3">
                    <label className="form-label fw-bold">Remark</label>
                    <textarea
                        className="form-control"
                        value={remark}
                        disabled
                    ></textarea>
                </div>

                <hr className="my-4 border border-danger" />
                <h5 className="mb-3 fw-bold">Added Product(s)</h5>

                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead className="table-success">
                            <tr>
                                <th style={{ minWidth: '240px', backgroundColor: 'lightgrey' }}>Product Name</th>
                                <th style={{ width: '140px', minWidth: '100px', backgroundColor: 'lightgrey' }}>Quantity</th>
                                <th style={{ width: '140px', minWidth: '80px', backgroundColor: 'lightgrey' }}>Unit</th>
                                <th style={{ width: '140px', minWidth: '100px', backgroundColor: 'lightgrey' }}>Rate</th>
                                <th style={{ width: '160px', minWidth: '120px', backgroundColor: 'lightgrey' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length > 0 ? (
                                items.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.ProductName}</td>
                                        <td>{item.Quantity}</td>
                                        <td>{item.UnitName}</td>
                                        <td>{item.Rate}</td>
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

                <button onClick={handleDelete} className="btn btn-danger w-100 mb-3 shadow">
                    Cancel Order
                </button>
                <button onClick={handleCancel} className="btn btn-secondary w-100 shadow">
                    Cancel
                </button>
            </div>
        </div>
    );
}
