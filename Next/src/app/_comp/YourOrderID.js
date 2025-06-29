'use client';

import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function YourOrderID({ orderid }) {
  const [orderDetails, setOrderDetails] = useState([]);
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderid) return;

    const fetchOrderDetails = async () => {
      try {
        const res = await api.get(`/getcustomerorderdata/${orderid}`);
        const data = res.data?.orderData;
        setOrderInfo(data);
        setOrderDetails(data?.order_details || []);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderid]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <div className="card p-3 mb-4 shadow-sm">
        <h5>Order No: {orderInfo?.OrderNo}</h5>
        <p><strong>Status:</strong> {orderInfo?.OrderStatus}</p>
        <p><strong>Payment:</strong> {orderInfo?.PaymentMode} ({orderInfo?.PaymentStatus})</p>
        <p><strong>SubTotal:</strong> ₹{orderInfo?.SubTotal}</p>
        <p><strong>Delivery Charges:</strong> ₹{orderInfo?.DeliveryCharges}</p>
        <p><strong>Total:</strong> ₹{orderInfo?.TotalAmount}</p>
        <p><strong>Date:</strong> {new Date(orderInfo?.OrderDate).toLocaleDateString()}</p>
        {orderInfo?.DeliveredDate && (
          <p className="text-success"><strong>Delivered On:</strong> {new Date(orderInfo.DeliveredDate).toLocaleDateString()}</p>
        )}
      </div>

      <h5 className="mb-3">Products</h5>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-info">
            <tr>
              <th scope="col">No.</th>
              <th scope="col">image</th>
              <th scope="col">Product ID</th>
              <th scope="col">Product Name</th>
              <th scope="col">Name</th>
              <th scope="col">Quantity</th>
              <th scope="col">Unit</th>
              <th scope="col">Rate</th> 
              <th scope="col"> Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.map((item, index) => (
              <tr key={item.OrderTransID}>
                <td>{index + 1}</td>
                <td>{item.Picture}</td>
                <td>{item.ProductID}</td>
                <td>{item.product?.ProductName || '-'}</td>
                <td>{item.product?.ProductUnicodeName || '-'}</td>
                <td>{item.Quantity}</td>
                <td>{item.product.unit.UnitName}</td>
                <td>₹{item.Rate}</td>
                <td>₹{item.Amount}</td>
              </tr>
            ))}
            {/* 👇 Total Calculation Row */}
            <tr className="table-info">
              <td colSpan="8" className="text-end fw-bold">Total Amount:</td>
              <td className="fw-bold">
                ₹
                {orderDetails.reduce((total, item) => total + parseFloat(item.Amount || 0), 0).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
