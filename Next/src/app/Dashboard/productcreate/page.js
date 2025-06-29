'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Autocomplete, TextField } from '@mui/material';
import api from '@/lib/axios';

export default function ProductCreate() {
    const [formData, setFormData] = useState({
        ProductName: '',
        ProductGroupName: '',
        GroupID: '',
        ProductHindiName: '',
        ProductUnicodeName: '',
        UnitID: '',
        UnitName: '',
        MinOrderQty: '',
        PackSizeID: '',
        PackSizeName: '',
        Facter: '',
        CategoryID: '',
        CategoryName: '',
        PercentageMargin: '',
        SortingLossPercentage: '',
        WeightLossPercentage: '',
        product_picture: null,
    });

    const [units, setUnits] = useState([]);
    const [packSizes, setPackSizes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [packingMaterials, setPackingMaterials] = useState([]);
    const [groups, setGroups] = useState([]);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [activeForm, setActiveForm] = useState(null);
    const [loading, setLoading] = useState(false);

    const [swiggyData, setSwiggyData] = useState({
        itemCode: '',
        name: '',
        storage: '',
        shelfLife: '',
        uom: '',
    });

    const [blinkitData, setBlinkitData] = useState({
        itemCode: '',
        name: '',
        uom: '',
    });

    const [relianceData, setRelianceData] = useState({
        relianceitemCode: '',
        reliancename: '',
        relianceuom: '',
    });

    const handleSwiggyChange = (e) => {
        const { name, value } = e.target;
        setSwiggyData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleBlinkitChange = (e) => {
        const { name, value } = e.target;
        setBlinkitData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRelianceChange = (e) => {
        const { name, value } = e.target;
        setRelianceData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        api.get('group-data')
            .then(res => setGroups(res.data.data))
            .catch(err => console.error("Failed to fetch groups:", err));
    }, []);

    useEffect(() => {
        api.get('unit-data')
            .then(res => setUnits(res.data.data))
            .catch(err => console.error("Failed to fetch units:", err));
    }, []);

    useEffect(() => {
        api.get('packsize-data')
            .then(res => setPackSizes(res.data.data))
            .catch(err => console.error("Failed to fetch pack sizes:", err));
    }, []);

    useEffect(() => {
        api.get('category-data')
            .then(res => setCategories(res.data.data))
            .catch(err => console.error("Failed to fetch categories:", err));
    }, []);

    useEffect(() => {
        api.get('packingmaterial-data')
            .then(res => setPackingMaterials(res.data.data))
            .catch(err => console.error("Failed to fetch packing materials:", err));
    }, []);

    const handleChange = (e) => {
        const { name, type, value, files } = e.target;

        if (type === 'file') {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleGroupChange = (e) => {
        const selectedName = e.target.value;
        const selectedGroup = groups.find(group => group.GroupName === selectedName);

        setFormData(prev => ({
            ...prev,
            ProductGroupName: selectedName,
            GroupID: selectedGroup?.GroupID || ''
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const {
            ProductName,
            ProductHindiName,
            ProductUnicodeName,
            UnitID,
            PackSizeID,
            CategoryID
        } = formData;

        if (
            !ProductName?.trim() ||
            !ProductHindiName?.trim() ||
            !ProductUnicodeName?.trim() ||
            !UnitID || !PackSizeID || !CategoryID
        ) {
            setErrorMsg('All fields are required.');
            setSuccessMsg('');
            return;
        }

        const payload = new FormData();

        for (const key in formData) {
            if (formData[key] !== undefined && formData[key] !== null) {
                payload.append(key, formData[key]);
            }
        }

        payload.append('ItemCodeSwiggy', swiggyData.itemCode);
        payload.append('NameSwiggy', swiggyData.name);
        payload.append('StorageSwiggy', swiggyData.storage);
        payload.append('ShelfLifeSwiggy', swiggyData.shelfLife);
        payload.append('UOMSwiggy', swiggyData.uom);

        payload.append('ItemCodeBlinkit', blinkitData.itemCode);
        payload.append('NameBlinkit', blinkitData.name);
        payload.append('UOMBlinkit', blinkitData.uom);

        payload.append('ItemCodeRelience', relianceData.relianceitemCode);
        payload.append('NameRelience', relianceData.reliancename);
        payload.append('UOMRelience', relianceData.relianceuom);

        try {
            await api.post('product-store', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setSuccessMsg('Product created successfully! 🎉');
            setErrorMsg('');

            setFormData({
                ProductName: '',
                ProductGroupName: '',
                GroupID: '',
                ProductHindiName: '',
                ProductUnicodeName: '',
                UnitID: '',
                PackSizeID: '',
                PackSizeName: '',
                Facter: '',
                CategoryID: '',
                CategoryName: '',
                PercentageMargin: '',
                SortingLossPercentage: '',
                WeightLossPercentage: '',
                SwiggyItemCode: '',
                SwiggyName: '',
                StorageSwiggy: '',
                ShelfLifeSwiggy: '',
                UOMSwiggy: '',
                BlinkitItemCode: '',
                BlinkitName: '',
                BlinkitUOM: '',
                RelianceItemCode: '',
                RelianceName: '',
                RelianceUOM: '',
                product_picture: null,
                MinOrderQty: '',
                PackagingCost: '',
            });

            setSwiggyData({
                itemCode: '',
                name: '',
                storage: '',
                shelfLife: '',
                uom: ''
            });
            setBlinkitData({
                itemCode: '',
                name: '',
                uom: ''
            });
            setRelianceData({
                relianceitemCode: '',
                reliancename: '',
                relianceuom: ''
            });

        } catch (error) {
            console.error('Error creating product:', error);
            setErrorMsg('Failed to create product. Please try again.');
            setSuccessMsg('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">

            {/* Product Name */}
            <h2 className="text-center mb-4">Create New Product</h2>

            {successMsg && <div className="alert alert-success">{successMsg}</div>}
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
                <div className="mb-3">
                    <label className="form-label">
                        Product Name <span className="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        name="ProductName"
                        className="form-control"
                        value={formData.ProductName}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Product Group */}
                <div className="row">
                    <div className="mb-3 col-md-6">
                        <label className="form-label d-block">Product Group Name</label>
                        <input
                            type="text"
                            name="ProductGroupName"
                            className="form-control"
                            value={formData.ProductGroupName}
                            onChange={handleChange}
                            onBlur={() => {
                                const match = groups.find(
                                    group => group.GroupName.trim().toLowerCase() === formData.ProductGroupName.trim().toLowerCase()
                                );
                                console.log("User typed:", formData.ProductGroupName);
                                console.log("Matched Group:", match);
                                setFormData(prev => ({
                                    ...prev,
                                    GroupID: match?.GroupID || ''
                                }));
                            }}
                            placeholder="Type Group Name"
                            list="group-options"
                        />
                        <datalist id="group-options">
                            {groups.map(group => (
                                <option key={group.GroupID} value={group.GroupName} />
                            ))}
                        </datalist>
                    </div>

                    <div className="mb-3 col-md-6">
                        <label className="form-label">Product Group ID</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.GroupID}
                            disabled
                        />
                    </div>
                </div>

                {/* Hindi Name */}
                <div className='row'>
                    <div className="mb-3 col-md-6">
                        <label className="form-label">Name in Hindi <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            name="ProductHindiName"
                            className="form-control"
                            value={formData.ProductHindiName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Unicode Name */}
                    <div className="mb-3 col-md-6">
                        <label className="form-label">Name in Unicode <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            name="ProductUnicodeName"
                            className="form-control"
                            value={formData.ProductUnicodeName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Unit */}
                <div className="card p-3 mb-3">
                    <div className='row'>
                        <div className="mb-3 col-md-4">
                            <label className="form-label">Unit Name <span className="text-danger">*</span></label>
                            <select
                                name="UnitID"
                                className="form-select"
                                value={formData.UnitID || ''}
                                onChange={(e) => {
                                    const selectedUnitID = e.target.value;
                                    const selectedUnit = units.find(unit => unit.UnitID.toString() === selectedUnitID);
                                    setFormData(prev => ({
                                        ...prev,
                                        UnitID: selectedUnitID,
                                        UnitName: selectedUnit?.UnitName || ''
                                    }));
                                }}
                                required
                            >
                                <option value="">Select Unit</option>
                                {units.map(unit => (
                                    <option key={unit.UnitID} value={unit.UnitID}>
                                        {unit.UnitName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3 col-md-4">
                            <label className="form-label">Pack Size Name <span className="text-danger">*</span></label>
                            <select
                                name="PackSizeID"
                                className="form-select"
                                value={formData.PackSizeID || ''}
                                onChange={(e) => {
                                    const selectedPackSizeID = e.target.value;
                                    const selectedPackSize = packSizes.find(packsize => packsize.PackSizeID.toString() === selectedPackSizeID);
                                    setFormData(prev => ({
                                        ...prev,
                                        PackSizeID: selectedPackSizeID,
                                        PackSizeName: selectedPackSize?.PackSizeName || '',
                                        Facter: selectedPackSize?.Facter || ''
                                    }));
                                }}
                                required
                            >
                                <option value="">Select Pack Size</option>
                                {packSizes.map(packSize => (
                                    <option key={packSize.PackSizeID} value={packSize.PackSizeID}>
                                        {packSize.PackSizeName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3 col-md-4">
                            <label className="form-label">Facter</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.Facter}
                                disabled
                            />
                        </div>
                    </div>
                </div>

                {/* Category */}
                <div className="card p-3 mb-3">
                    <div className='row'>
                        <div className='mb-3 col-md-6'>
                            <label className="form-label">Category Name <span className="text-danger">*</span></label>
                            <select
                                name="CategoryID"
                                className="form-select"
                                value={formData.CategoryID || ''}
                                onChange={(e) => {
                                    const selectedCategoryID = e.target.value;
                                    const selectedCategory = categories.find(category => category.CategoryID.toString() === selectedCategoryID);
                                    setFormData(prev => ({
                                        ...prev,
                                        CategoryID: selectedCategoryID,
                                        CategoryName: selectedCategory?.CategoryName || '',
                                        PercentageMargin: selectedCategory?.PercentageMargin || '',
                                        SortingLossPercentage: selectedCategory?.SortingLossPercentage || '',
                                        WeightLossPercentage: selectedCategory?.WeightLossPercentage || ''
                                    }));
                                }}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category.CategoryID} value={category.CategoryID}>
                                        {category.CategoryName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='mb-3 col-md-6'>
                            <label className="form-label">Category Margin (%)</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.PercentageMargin == 0 ? 0 : formData.PercentageMargin}
                                disabled
                            />
                        </div>
                        <div className='mb-3 col-md-6'>
                            <label className="form-label">Sorting Loss (%)</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.SortingLossPercentage == 0 ? 0 : formData.SortingLossPercentage}
                                disabled
                            />
                        </div>
                        <div className='mb-3 col-md-6'>
                            <label className="form-label">Weight Loss (%)</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.WeightLossPercentage == 0 ? 0 : formData.WeightLossPercentage}
                                disabled
                            />
                        </div>
                    </div>
                </div>

                {/* Packing Material */}
                <div className="card p-3 mb-3">
                    <div className="row">
                        <div className="mb-3 col-md-6">
                            <label htmlFor="packingMaterialSelect" className="form-label">
                                Packing Material Name <span className="text-danger">*</span>
                            </label>
                            <select
                                id="packingMaterialSelect"
                                name="PackingMaterialID"
                                className="form-select"
                                value={formData.PackingMaterialID || ''}
                                onChange={(e) => {
                                    const selectedID = e.target.value;
                                    const selectedMaterial = packingMaterials.find(
                                        (pm) => pm.PackingMaterialID.toString() === selectedID
                                    );
                                    setFormData((prev) => ({
                                        ...prev,
                                        PackingMaterialID: selectedID,
                                        PackingMaterialName: selectedMaterial?.PackingMaterialName || '',
                                        PackagingCost: selectedMaterial?.PackagingCost || 0,
                                    }));
                                }}
                                required
                            >
                                <option value="">Select Material</option>
                                {packingMaterials.map((pm) => (
                                    <option key={pm.PackingMaterialID} value={pm.PackingMaterialID}>
                                        {pm.PackingMaterialName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3 col-md-6">
                            <label htmlFor="packagingCost" className="form-label">
                                Packaging Cost (Rs)
                            </label>
                            <input
                                type="text"
                                id="packagingCost"
                                className="form-control"
                                value={formData.PackagingCost == 0 ? 0 : formData.PackagingCost}
                                disabled
                            />
                        </div>
                    </div>
                </div>

                {/* Min Order Qty */}
                <div className='row'>
                    <div className="mb-3 col-md-6">
                        <label className="form-label">Min Order Qty <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            name="MinOrderQty"
                            className="form-control"
                            value={formData.MinOrderQty}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="card p-3 mb-3">
                    <div className='mb-3'>
                        {/* Buttons */}
                        <div className="mb-3 d-flex gap-2">
                            <button className="btn btn-warning" type='button' onClick={() => setActiveForm('swiggy')}>
                                Swiggy
                            </button>
                            <button className="btn btn-success" type='button' onClick={() => setActiveForm('blinkit')}>
                                Blinkit
                            </button>
                            <button className='btn btn-danger' type='button' onClick={() => setActiveForm('reliance')}>Reliance</button>
                        </div>

                        {/* Conditional Forms */}
                        {/* Swiggy From */}

                        {activeForm === 'swiggy' && (
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label"><b className='text-warning'>Swiggy</b> Item Code</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="itemCode"
                                        value={swiggyData.itemCode}
                                        onChange={handleSwiggyChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label"><b className='text-warning'>Swiggy</b> Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={swiggyData.name}
                                        onChange={handleSwiggyChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label"><b className='text-warning'>Swiggy</b> Storage</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="storage"
                                        value={swiggyData.storage}
                                        onChange={handleSwiggyChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label"><b className='text-warning'>Swiggy</b> ShelfLife</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="shelfLife"
                                        value={swiggyData.shelfLife}
                                        onChange={handleSwiggyChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label"><b className='text-warning'>Swiggy</b> UOM</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="uom"
                                        value={swiggyData.uom}
                                        onChange={handleSwiggyChange}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Blinkit From */}
                        {activeForm === 'blinkit' && (
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label"><b className='text-success'>Blinkit</b> Item Code</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="itemCode"
                                        value={blinkitData.itemCode}
                                        onChange={handleBlinkitChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label"><b className='text-success'>Blinkit</b> Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={blinkitData.name}
                                        onChange={handleBlinkitChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label"><b className='text-success'>Blinkit</b> UOM</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="uom"
                                        value={blinkitData.uom}
                                        onChange={handleBlinkitChange}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Reliance From */}
                        {activeForm === 'reliance' && (
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label"><b className='text-danger'>Reliance</b> Item Code</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="relianceitemCode"
                                        value={relianceData.relianceitemCode}
                                        onChange={handleRelianceChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label"><b className='text-danger'>Reliance</b> Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="reliancename"
                                        value={relianceData.reliancename}
                                        onChange={handleRelianceChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label"><b className='text-danger'>Reliance</b> UOM</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="relianceuom"
                                        value={relianceData.relianceuom}
                                        onChange={handleRelianceChange}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Product Picture */}
                <div className="mb-3">
                    <label className="form-label">Product Picture</label>
                    <input
                        type="file"
                        className={`form-control ${errorMsg.product_picture ? 'is-invalid' : ''}`}
                        name="product_picture"
                        onChange={handleChange}
                        accept="image/*"
                    />
                    {errorMsg.product_picture && (
                        <div className="invalid-feedback">{errorMsg.product_picture[0]}</div>
                    )}
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading && (
                        <span
                            className="spinner-border spinner-border-sm text-light"
                            role="status"
                            aria-hidden="true"
                        ></span>
                    )}
                    {loading ? ' Creating...' : 'Create Product'}
                </button>
            </form>
        </div>
    );
}
