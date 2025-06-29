'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import YourOrderID from './YourOrderID';
import ReOrder from './ReOrder';

export default function YourOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedOrderID, setSelectedOrderID] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/getcustomerorderslist');
      const data = res.data?.ordersList || [];
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (selectedOrderID) {
    // 👉 Show the Order Details component
    return (
      <div className="container mt-5">
        <button className="btn btn-secondary mb-3" onClick={() => setSelectedOrderID(null)}>← Back to Orders</button>
        <YourOrderID orderid={selectedOrderID} />
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h3 className="mb-4 text-center text-success">Your Orders</h3>

      {loading && <div className="text-center">Loading orders...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && orders.length === 0 && <p>No orders found.</p>}

      <div className="row row-cols-1 row-cols-md-2 g-4 ms-5">
        {orders.map((order) => (
          <div className="col" key={order.OrderID} style={{ width: "15rem" }}>
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Order No: {order.OrderNo}</h5>
                <p><strong>Status:</strong> {order.OrderStatus}</p>
                <p><strong>Payment Mode:</strong> {order.PaymentMode}</p>
                <p><strong>Total Amount:</strong> ₹{order.TotalAmount}</p>
                <p className="text-muted"><strong>Order Date:</strong> {new Date(order.OrderDate).toLocaleDateString()}</p>
                <div className='d-flex justify-content-between'>
                  <button
                    className="btn btn-outline-success"
                    onClick={() => setSelectedOrderID(order.OrderID)}
                  >
                    View
                  </button>

                  <ReOrder orderId={order.OrderID} />
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
