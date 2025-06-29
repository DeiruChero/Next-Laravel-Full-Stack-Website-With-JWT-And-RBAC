'use client';

import React, { useEffect, useState } from 'react';
import AdminCreate from '@/app/_Shared/AdminCreate';
import ShopManagerCreate from '@/app/_Shared/ShopManagerCreate';
import CustomerCreate from '@/app/_Shared/CustomerCreate';
import DistributorCreate from '@/app/_Shared/DistributorCreate';
import api from '@/lib/axios';
import EmployeeCreate from '@/app/_Shared/EmployeeCreate';
import DriverCreate from '@/app/_Shared/DriverCreate';
import QuickCommerceCreate from '@/app/_Shared/QuickCommerceCreate';
import InstitutionCreate from '@/app/_Shared/InstitutionCreate';

export default function UserCreate() {
    const [formData, setFormData] = useState({ RoleID: '' });
    const [errors, setErrors] = useState({});
    const [roles, setRoles] = useState([]);

    const [admin, setAdmin] = useState(false);
    const [shopManager, setShopManager] = useState(false);
    const [customer, setCustomer] = useState(false);
    const [distributor, setDistributor] = useState(false);
    const [employee, setEmployee] = useState(false);
    const [driver, setDriver] = useState(false);
    const [quickCommerce, setQuickCommerce] = useState(false);
    const [institution, setInstitution] = useState(false);

    useEffect(() => {
        api.get('roles-data')
            .then((res) => setRoles(res.data.data || []))
            .catch((err) => console.error('Failed to fetch roles:', err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        const selectedRole = roles.find((role) => role.RoleID == value);
        if (selectedRole?.RoleName === 'Admin') {
            setShopManager(false);
            setCustomer(false);
            setDistributor(false);
            setEmployee(false);
            setDriver(false);
            setQuickCommerce(false);
            setInstitution(false);
            setAdmin(true);
        } else if (selectedRole?.RoleName === 'Shop Manager') {
            setAdmin(false);
            setCustomer(false);
            setDistributor(false);
            setEmployee(false);
            setDriver(false);
            setQuickCommerce(false);
            setInstitution(false);
            setShopManager(true);
        } else if (selectedRole?.RoleName === 'Customer') {
            setAdmin(false);
            setShopManager(false);
            setDistributor(false);
            setEmployee(false);
            setDriver(false);
            setQuickCommerce(false);
            setInstitution(false);
            setCustomer(true);
        } else if (selectedRole?.RoleName === 'Distributor') {
            setAdmin(false);
            setShopManager(false);
            setCustomer(false);
            setEmployee(false);
            setDriver(false);
            setQuickCommerce(false);
            setInstitution(false);
            setDistributor(true);
        } else if (selectedRole?.RoleName === 'Employee') {
            setAdmin(false);
            setShopManager(false);
            setCustomer(false);
            setDistributor(false);
            setDriver(false);
            setQuickCommerce(false);
            setInstitution(false);
            setEmployee(true);
        } else if (selectedRole?.RoleName === 'Driver') {
            setAdmin(false);
            setShopManager(false);
            setCustomer(false);
            setDistributor(false);
            setEmployee(false);
            setQuickCommerce(false);
            setInstitution(false);
            setDriver(true);
        } else if (selectedRole?.RoleName === 'Quick Commerce') {
            setAdmin(false);
            setShopManager(false);
            setCustomer(false);
            setDistributor(false);
            setEmployee(false);
            setDriver(false);
            setInstitution(false);
            setQuickCommerce(true);
        } else if (selectedRole?.RoleName === 'Institution') {
            setAdmin(false);
            setShopManager(false);
            setCustomer(false);
            setDistributor(false);
            setEmployee(false);
            setDriver(false);
            setQuickCommerce(false);
            setInstitution(true);
        } else {
            setAdmin(false);
            setCustomer(false);
            setDistributor(false);
            setShopManager(false);
            setEmployee(false);
            setDriver(false);
            setInstitution(false);
            setQuickCommerce(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4 text-warning">Create New User</h2>

            <div className="card p-4 shadow mb-3">
                <label className="form-label fw-bold">Select Role <span className="text-danger">*</span></label>
                <select
                    className={`form-select ${errors.RoleID ? 'is-invalid' : ''}`}
                    name="RoleID"
                    value={formData.RoleID}
                    onChange={handleChange}
                    required
                >
                    <option value="">-- Select User Type --</option>
                    {roles.map((role) => (
                        <option key={role.RoleID} value={role.RoleID}>
                            {role.RoleName}
                        </option>
                    ))}
                </select>
                {errors.RoleID && (
                    <div className="invalid-feedback">{errors.RoleID[0]}</div>
                )}
            </div>

            {/* Conditional Components */}
            {admin && <AdminCreate />}
            {shopManager && <ShopManagerCreate />}
            {customer && <CustomerCreate />}
            {distributor && <DistributorCreate />}
            {employee && <EmployeeCreate />}
            {driver && <DriverCreate />}
            {quickCommerce && <QuickCommerceCreate />}
            {institution && <InstitutionCreate />}
        </div>
    );
}
