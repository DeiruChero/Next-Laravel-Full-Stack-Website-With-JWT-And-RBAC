'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { toWords } from 'number-to-words';
import { useParams } from 'next/navigation';

export default function PrintOrderPage() {
    const { id: orderId } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        if (!orderId) return;
        api.get(`ordercancelcustomer-show/${orderId}`).then(res => {
            setData(res.data);
            setTimeout(() => window.print(), 300);
        });
    }, [orderId]);

    if (!data) return <p>Loading...</p>;

    return (
        <div className="container py-4">
            <div className="mb-4 border-bottom pb-2 bg-dark text-white">
                <h4 className="fw-bold text-primary text-center"><i className="bi bi-receipt-cutoff me-2"></i>Order Details</h4>
            </div>
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
                            <p className="mb-1 small">Status: <span className={`${data.OrderStatus === 'Delivered' ? 'text-success' : 'text-secondary'}`}>{data.OrderStatus}</span></p>
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
                            <p className="mb-1 small">Is Distributor: <strong>{data.IsUnderDistributor ? 'Yes' : 'No'}</strong></p>
                            {data.IsUnderDistributor && (
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
            <hr />
            <p><strong>Type:</strong> {data.AddressTitle}</p>
            <p><strong>Address:</strong> {`${data.CustomerName}, ${data.Mobile}, ${data.WhatsApp}, ${data.Email}, ${data.Address}, ${data.Area}, ${data.City}, ${data.State} - ${data.PinCode}`}</p>

            <h5 className="fw-bold text-center text-primary mt-4"><i className="bi bi-cart-check me-2"></i>Item(s) Details</h5>
            <hr />
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
    );
}
