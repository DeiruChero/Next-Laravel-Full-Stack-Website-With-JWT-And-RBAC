'use client';

import React, { useEffect, useState } from 'react';
import AdminEdit from '@/app/_Shared/AdminEdit';
import api from '@/lib/axios';
import DistributorEdit from '@/app/_Shared/DistributorEdit';
import EmployeeEdit from '@/app/_Shared/EmployeeEdit';
import DriverEdit from '@/app/_Shared/DriverEdit';
import ShopManagerEdit from '@/app/_Shared/ShopManagerEdit';
import CustomerEdit from '@/app/_Shared/CustomerEdit';
import QuickCommerceEdit from '@/app/_Shared/QuickCommerceEdit';
import InstitutionEdit from '@/app/_Shared/InstitutionEdit';

export default function UserEdit({ params }) {
    const UserID = params.UserID;

    const [userData, setUserData] = useState(null);
    const [roleName, setRoleName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!UserID) return;

        const fetchUser = async () => {
            try {
                const res = await api.get(`user-info/${UserID}`);
                const user = res.data;
                setUserData(user);
                setRoleName(user.RoleName);
            } catch (err) {
                setError('Failed to load user data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [UserID]);

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger text-center mt-4">
                {error}
            </div>
        );
    }

    return (
        <div className='container'>
            {roleName?.toLowerCase() === 'admin' && <AdminEdit params={userData} />}
            {roleName?.toLowerCase() === 'distributor' && <DistributorEdit params={userData} />}
            {roleName?.toLowerCase() === 'employee' && <EmployeeEdit params={userData} />}
            {roleName?.toLowerCase() === 'driver' && <DriverEdit params={userData} />}
            {roleName?.toLowerCase() === 'shop manager' && <ShopManagerEdit params={userData} />}
            {roleName?.toLowerCase() === 'customer' && <CustomerEdit params={userData} />}
            {roleName?.toLowerCase() === 'quick commerce' && <QuickCommerceEdit params={userData} />}
            {roleName?.toLowerCase() === 'institution' && <InstitutionEdit params={userData} />}
            <h3 className="text-center mt-4">Role: {roleName}</h3>
        </div>
    );
}
