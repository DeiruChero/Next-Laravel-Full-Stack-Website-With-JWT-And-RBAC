'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';  // ✅ Import router
import api from '@/lib/axios';
import { ToastContainer, toast } from 'react-toastify';

export default function UserAccountDelete({ onDeleted }) {
    const [loading, setLoading] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const router = useRouter();  // ✅ Initialize router

    const handleDelete = async () => {
        if (!confirmed) return;

        setLoading(true);
        try {
            await api.post('/deletecustomeraccount');
            toast.success('Account deleted successfully.');

            // Clear localStorage or tokens if needed
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('cart'); // if you store cart

            if (onDeleted) onDeleted();

            // Delay redirect so user sees toast
            setTimeout(() => {
                router.push('/loginpage');
            }, 1000); 
        } catch (error) {
            console.error('Delete failed', error);
            toast.error('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='container'>
            <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
            <h5 className='text-danger'>Once your account is deleted:</h5>
            <p>1. You cannot access your account anymore.</p>
            <p>2. This action cannot be undone.</p>

            <div className="form-check my-3">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="confirmDelete"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="confirmDelete">
                    I understand the consequences
                </label>
            </div>

            <button
                type="button"
                className="btn btn-danger w-100"
                disabled={!confirmed || loading}
                onClick={handleDelete}
            >
                {loading ? 'Deleting...' : 'Delete Account'}
            </button>
        </div>
    );
}
