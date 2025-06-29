'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';

export default function OrderDetails({ orderId, onBack }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/getorder/${orderId}`);
        setOrder(res.data?.order || null);
      } catch {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) return <div className="container mt-5">Loading order...</div>;
  if (!order) return <div className="container mt-5">Order not found.</div>;

  return (
    <div className="container mt-5">
      <button className="btn btn-secondary mb-3" onClick={onBack}>
        ← Back to Orders
      </button>
      <h4 className="text-primary">Order #{order.OrderNo}</h4>
      <p><strong>Status:</strong> {order.OrderStatus}</p>
      <p><strong>Total:</strong> ₹{order.TotalAmount}</p>
      <p><strong>Payment:</strong> {order.PaymentStatus}</p>
      {/* Add more fields if needed */}
    </div>
  );
}
