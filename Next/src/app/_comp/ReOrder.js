'use client';
import { useState } from 'react';
import { useCart } from "../_context/CartContext";
import api from '@/lib/axios';
import { ToastContainer, toast } from 'react-toastify';

export default function ReOrder({ orderId }) {
  const { updateCartItem } = useCart();
  const [loading, setLoading] = useState(false);

  const handleReorder = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/getcustomerorderdata/${orderId}`);
      const items = res.data?.orderData?.order_details || [];

      items.forEach((item) => {
        const product = {
          ProductID: item.ProductID,
          ProductName: item.product?.ProductName,
          Price: item.Rate,
        };
        updateCartItem(product, item.Quantity, true);
      });

      // ✅ Show success toast once after all items processed
       alert('All items added to cart!');

    } catch (err) {
      console.error('Failed to reorder:', err);
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />

      <button
        className="btn btn-outline-primary"
        onClick={handleReorder}
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Re-order'}
      </button>
    </>
  );
}
