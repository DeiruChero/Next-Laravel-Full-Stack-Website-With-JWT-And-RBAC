'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { toWords } from 'number-to-words';
import { motion, AnimatePresence } from 'framer-motion';

export default function OrderModal({ show, onClose, orderId }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!show || !orderId) return;

        setLoading(true);
        setError(null);

        api.get(`ordercancelcustomer-show/${orderId}`)
            .then(res => setData(res.data))
            .catch(err => {
                console.error('API error:', err);
                setError('Failed to load order details.');
            })
            .finally(() => setLoading(false));
    }, [show, orderId]);

    return (
        <AnimatePresence>
            {show && data && (
                <motion.div
                    className="modal fade show d-block"
                    tabIndex={-1}
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div
                        className="modal-dialog modal-xl modal-dialog-centered"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <motion.div
                            className="modal-content shadow-lg border-0 rounded-4"
                            initial={{ y: -50, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 30, opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                        >
                            <div className="modal-header bg-dark text-white rounded-top-4">
                                <h5 className="modal-title fw-semibold"><i className="bi bi-receipt-cutoff me-2"></i>Order Details</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                            </div>

                            <div className="modal-body p-4">
                                {loading ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-warning" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : error ? (
                                    <div className="alert alert-danger">{error}</div>
                                ) : (
                                    <>
                                        <div className="container">
                                            <div className="row mb-4 g-3">
                                                <div className="col-md-4">
                                                    <div className="card shadow-sm h-100">
                                                        <div className="card-body">
                                                            <h6 className="card-title fw-bold"><i className="bi bi-building me-2"></i>Branch Details</h6>
                                                            <img src="/DesiMati-logo.png" alt="Desi Mati" className="img-fluid mb-2" style={{ maxWidth: '160px' }} />
                                                            <p className="mb-0 text-muted small">{data.City}, {data.State}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-md-4">
                                                    <div className="card shadow-sm h-100">
                                                        <div className="card-body">
                                                            <h6 className="card-title fw-bold"><i className="bi bi-box-seam me-2"></i>Order Info</h6>
                                                            <p className="mb-1 small">Order No: <strong>#{data.OrderNo}</strong></p>
                                                            <p className="mb-1 small">Date: <strong>{data.OrderDate}</strong></p>
                                                            <p className="mb-1 small">Mode: <strong>{data.OrderMode}</strong></p>
                                                            <p className="mb-1 small">Status: <span className={`badge ${data.OrderStatus === 'Delivered' ? 'bg-success' : 'bg-secondary'}`}>{data.OrderStatus}</span></p>
                                                            <p className="mb-1 small">User Type: <strong>{data.UserType}</strong></p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-md-4">
                                                    <div className="card shadow-sm h-100">
                                                        <div className="card-body">
                                                            <h6 className="card-title fw-bold"><i className="bi bi-person-lines-fill me-2"></i>Customer Details</h6>
                                                            <p className="mb-1 small">Customer Name: <strong>{data.CustomerName}</strong></p>
                                                            <p className="mb-1 small">Mobile: <strong>{data.Mobile}</strong></p>
                                                            <p className="mb-1 small">Email: <strong>{data.Email}</strong></p>
                                                            <p className="mb-1 small">City: <strong>{data.City}</strong></p>
                                                            <p className="mb-1 small">State: <strong>{data.State}</strong></p>
                                                            <p className="mb-1 small">Is Distributor: <strong>{data.IsUnderDistributor === true ? 'Yes' : 'No'}</strong></p>
                                                            {data.IsUnderDistributor === true && (
                                                                <p className="mb-1 small">Distributor: <strong>{data.DistributorName}</strong></p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row mb-4">
                                                <div className="col-md-12">
                                                    <div className="bg-light p-3 rounded shadow-sm">
                                                        <div className="row text-center">
                                                            <div className="col-md-4">
                                                                <i className="bi bi-currency-rupee fs-5 text-success"></i>
                                                                <div><strong>Total Amount:</strong> ₹{Number(data.TotalAmount).toFixed(2)}</div>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <i className="bi bi-wallet2 fs-5 text-secondary"></i>
                                                                <div><strong>Payment Mode:</strong> <span className='text-secondary fw-bold'>{data.PaymentMode}</span></div>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <i className="bi bi-check-circle fs-5 text-success"></i>
                                                                <div><strong>Payment Status:</strong> <span className={data.PaymentStatus === 'Paid' ? 'text-success fw-bold' : 'text-danger fw-bold'}>{data.PaymentStatus}</span></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h5 className='fw-bold text-center text-primary'><i className="bi bi-geo-alt-fill me-2"></i>Delivery Address</h5>
                                            <p><strong>Type:</strong> {data.AddressTitle}</p>
                                            <p><strong>Address:</strong> {`${data.CustomerName}, ${data.Mobile}, ${data.WhatsApp}, ${data.Email}, ${data.Address}, ${data.Area}, ${data.City}, ${data.State} - ${data.PinCode}`}</p>

                                            <h5 className="fw-bold text-center text-primary mt-4"><i className="bi bi-cart-check me-2"></i>Item(s) Details</h5>
                                            <div className="table-responsive">
                                                <table className="table table-hover table-striped">
                                                    <thead className="table-success sticky-top">
                                                        <tr>
                                                            <th>S. No.</th>
                                                            <th>Product</th>
                                                            <th>Qty</th>
                                                            <th>Unit</th>
                                                            <th>Rate</th>
                                                            <th>Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {data.items?.length > 0 ? (
                                                            data.items.map((item, idx) => (
                                                                <tr key={idx}>
                                                                    <td>{idx + 1}</td>
                                                                    <td>{item.ProductName}</td>
                                                                    <td>{item.Quantity}</td>
                                                                    <td>{item.UnitName}</td>
                                                                    <td>₹{item.Rate}</td>
                                                                    <td>₹{item.Amount}</td>
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

                                            {data.TotalAmount && (
                                                <div className="mt-4 text-end">
                                                    <h5 className="fw-bold text-success">
                                                        Total Amount: ₹{Number(data.TotalAmount).toLocaleString('en-IN')}
                                                    </h5>
                                                    <small className="fst-italic text-muted">
                                                        In Words: {toWords(Number(data.TotalAmount)).toUpperCase()} RUPEES ONLY
                                                    </small>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="modal-footer border-0">
                                <button
                                    type="button"
                                    className="btn btn-outline-primary rounded-pill px-4 me-2"
                                    onClick={() => window.open(`/print/order/${orderId}`)}
                                >
                                    <i className="bi bi-printer me-1"></i> Print
                                </button>
                                <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={onClose}>Close</button>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
