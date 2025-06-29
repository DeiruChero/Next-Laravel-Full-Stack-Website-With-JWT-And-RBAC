'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function ProductEdit({ params }) {
    const ProductID = params.ProductID;
    const router = useRouter();

    const [productName, setProductName] = useState('');
    const [units, setUnits] = useState([]);
    const [packSizes, setPackSizes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [packingMaterials, setPackingMaterials] = useState([]);
    const [facter, setFacter] = useState('');
    const [productUnicodeName, setProductUnicodeName] = useState('');
    const [productGroupName, setProductGroupName] = useState('');
    const [groups, setGroups] = useState([]);
    const [groupID, setGroupID] = useState('');
    const [productHindiName, setProductHindiName] = useState('');
    const [minOrderQty, setMinOrderQty] = useState('');
    const [unitID, setUnitID] = useState('');
    const [categoryID, setCategoryID] = useState('');
    const [packSizeID, setPackSizeID] = useState('');
    const [percentageMargin, setPercentageMargin] = useState('');
    const [sortingLossPercentage, setSortingLossPercentage] = useState('');
    const [weightLossPercentage, setWeightLossPercentage] = useState('');
    const [packingMaterialID, setPackingMaterialID] = useState('');
    const [packagingCost, setPackagingCost] = useState('');
    const [productPicture, setProductPicture] = useState(null);
    const [activeForm, setActiveForm] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

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
        const fetchGroups = async () => {
            try {
                const res = await api.get('/group-data');
                setGroups(res.data.data);
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        };

        const fetchUnits = async () => {
            try {
                const res = await api.get('/unit-data');
                setUnits(res.data.data);
            } catch (error) {
                console.error('Error fetching units:', error);
            }
        };

        const fetchPackSizes = async () => {
            try {
                const res = await api.get('/packsize-data');
                setPackSizes(res.data.data);
            } catch (error) {
                console.error('Error fetching pack sizes:', error);
            }
        };

        const fetchCategories = async () => {
            try {
                const res = await api.get('/category-data');
                setCategories(res.data.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchPackingMaterials = async () => {
            try {
                const res = await api.get('/packingmaterial-data');
                setPackingMaterials(res.data.data);
            } catch (error) {
                console.error('Error fetching packing materials:', error);
            }
        };

        fetchPackingMaterials();
        fetchCategories();
        fetchUnits();
        fetchPackSizes();
        fetchGroups();
    }, []);

    useEffect(() => {
        if (!ProductID) return;

        const fetchProduct = async () => {
            try {
                const res = await api.get(`product-show/${ProductID}`);
                const product = res.data.product;

                setProductName(product.ProductName || '');
                setProductUnicodeName(product.ProductUnicodeName || '');
                setProductHindiName(product.ProductHindiName || '');
                setMinOrderQty(product.MinOrderQty || '');
                setCategoryID(product.CategoryID || '');
                setPackSizeID(product.PackSizeID || '');
                setGroupID(product.GroupID || '');
                setProductGroupName(product.group.GroupName || '');
                setUnitID(product.unit.UnitID || '');
                setFacter(product.packsize.Facter || '');
                setPercentageMargin(product.category.PercentageMargin || '');
                setSortingLossPercentage(product.category.SortingLossPercentage || '');
                setWeightLossPercentage(product.category.WeightLossPercentage || '');
                setPackingMaterialID(product.packing_material.PackingMaterialID || '');
                setPackagingCost(product.packing_material.PackagingCost || '');
                setSwiggyData({
                    itemCode: product.ItemCodeSwiggy || '',
                    name: product.NameSwiggy || '',
                    storage: product.StorageSwiggy || '',
                    shelfLife: product.ShelfLifeSwiggy || '',
                    uom: product.UOMSwiggy || '',
                })
                setBlinkitData({
                    itemCode: product.ItemCodeBlinkit || '',
                    name: product.NameBlinkit || '',
                    uom: product.UOMBlinkit || '',
                })
                setRelianceData({
                    relianceitemCode: product.ItemCodeRelience || '',
                    reliancename: product.NameRelience || '',
                    relianceuom: product.UOMRelience || '',
                })
                setLoading(false);
            } catch (err) {
                setError('Failed to load product data.');
                console.error(err);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [ProductID]);

    const handleGroupNameChange = (e) => {
        const name = e.target.value;
        setProductGroupName(name);

        const matchedGroup = groups.find(
            (group) => group.GroupName.trim().toLowerCase() === name.trim().toLowerCase()
        );

        if (matchedGroup) {
            setGroupID(matchedGroup.GroupID);
        } else {
            setGroupID('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!productName || !categoryID || !packSizeID || !groupID || !unitID || !packingMaterialID || !productGroupName || !productHindiName || !productUnicodeName || !minOrderQty) {
            setError('Please fill in all required fields.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('ProductName', productName);
            formData.append('ProductUnicodeName', productUnicodeName);
            formData.append('ProductHindiName', productHindiName);
            formData.append('UnitID', unitID);
            formData.append('GroupID', groupID);
            formData.append('PackSizeID', packSizeID);
            formData.append('CategoryID', categoryID);
            formData.append('PackingMaterialID', packingMaterialID);
            formData.append('ItemCodeSwiggy', swiggyData.itemCode || '');
            formData.append('NameSwiggy', swiggyData.name || '');
            formData.append('StorageSwiggy', swiggyData.storage || '');
            formData.append('ShelfLifeSwiggy', swiggyData.shelfLife || '');
            formData.append('UOMSwiggy', swiggyData.uom || '');
            formData.append('ItemCodeBlinkit', blinkitData.itemCode || '');
            formData.append('NameBlinkit', blinkitData.name || '');
            formData.append('UOMBlinkit', blinkitData.uom || '');
            formData.append('ItemCodeRelience', relianceData.relianceitemCode || '');
            formData.append('NameRelience', relianceData.reliancename || '');
            formData.append('UOMRelience', relianceData.relianceuom || '');
            formData.append('MinOrderQty', minOrderQty);

            if (productPicture) {
                formData.append('Picture', productPicture);
            }

            await api.post(`product-update/${ProductID}?_method=PUT`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            setSuccess('Product updated successfully!');
            setError('');
            router.push('/Dashboard/productedit');
        } catch (err) {
            console.error('Update error:', err?.response || err);
            setError('Failed to update product.');
        } finally {
            setLoading(false);
        }
    }
    const handleCancel = () => {
        router.push('/Dashboard/productedit');
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Edit Product</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
                <div className="mb-3">
                    <label className="form-label fw-bold">
                        Product Name<span className="text-danger"> *</span>
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                    />
                </div>

                <div className="row">
                    <div className="mb-3 col-md-6">
                        <label className="form-label d-block fw-bold">Product Group Name <span className='text-danger'>*</span></label>
                        <input
                            type="text"
                            className="form-control"
                            value={productGroupName}
                            onChange={handleGroupNameChange}
                            placeholder="Type Group Name"
                            list="group-options"
                            required
                        />
                        <datalist id="group-options">
                            {groups.map((group) => (
                                <option key={group.GroupID} value={group.GroupName} />
                            ))}
                        </datalist>
                    </div>

                    <div className="mb-3 col-md-6">
                        <label className="form-label fw-bold">Product Group ID</label>
                        <input
                            type="text"
                            className="form-control"
                            value={groupID}
                            disabled
                        />
                    </div>
                </div>

                <div className='row'>
                    <div className="mb-3 col-md-6">
                        <label className="form-label fw-bold">Name in Hindi <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className="form-control"
                            value={productHindiName}
                            onChange={(e) => setProductHindiName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3 col-md-6">
                        <label className="form-label fw-bold">Name in Unicode <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className="form-control"
                            value={productUnicodeName}
                            onChange={(e) => setProductUnicodeName(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="card p-3 mb-3">
                    <div className='row'>
                        <div className="mb-3 col-md-4">
                            <label className="form-label fw-bold">Unit Name <span className="text-danger">*</span></label>
                            <select
                                className="form-select"
                                value={unitID || ''}
                                onChange={(e) => {
                                    const selectedUnitID = e.target.value;
                                    setUnitID(selectedUnitID);
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
                            <label className="form-label fw-bold">Pack Size Name <span className="text-danger">*</span></label>
                            <select
                                className="form-select"
                                value={packSizeID || ''}
                                onChange={(e) => {
                                    const selectedPackSizeID = e.target.value;
                                    const selectedPackSize = packSizes.find(packsize => packsize.PackSizeID.toString() === selectedPackSizeID);
                                    setPackSizeID(selectedPackSizeID);
                                    setFacter(selectedPackSize?.Facter || '');
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
                            <label className="form-label fw-bold">Facter</label>
                            <input
                                type="text"
                                className="form-control"
                                value={facter}
                                disabled
                            />
                        </div>
                    </div>
                </div>

                <div className="card p-3 mb-3">
                    <div className='row'>
                        <div className='mb-3 col-md-6'>
                            <label className="form-label fw-bold">Category Name <span className="text-danger">*</span></label>
                            <select
                                className="form-select"
                                value={categoryID || ''}
                                onChange={(e) => {
                                    const selectedCategoryID = e.target.value;
                                    const selectedCategory = categories.find(category => category.CategoryID.toString() === selectedCategoryID);
                                    setCategoryID(selectedCategoryID);
                                    setPercentageMargin(selectedCategory?.PercentageMargin || '');
                                    setSortingLossPercentage(selectedCategory?.SortingLossPercentage || '');
                                    setWeightLossPercentage(selectedCategory?.WeightLossPercentage || '');
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
                            <label className="form-label fw-bold">Category Margin (%)</label>
                            <input
                                type="text"
                                className="form-control"
                                value={percentageMargin == 0 ? 0 : percentageMargin}
                                disabled
                            />
                        </div>
                        <div className='mb-3 col-md-6'>
                            <label className="form-label fw-bold">Sorting Loss (%)</label>
                            <input
                                type="text"
                                className="form-control"
                                value={sortingLossPercentage == 0 ? 0 : sortingLossPercentage}
                                disabled
                            />
                        </div>
                        <div className='mb-3 col-md-6'>
                            <label className="form-label fw-bold">Weight Loss (%)</label>
                            <input
                                type="text"
                                className="form-control"
                                value={weightLossPercentage == 0 ? 0 : weightLossPercentage}
                                disabled
                            />
                        </div>
                    </div>
                </div>

                <div className="card p-3 mb-3">
                    <div className="row">
                        <div className="mb-3 col-md-6">
                            <label className="form-label fw-bold">
                                Packing Material Name <span className="text-danger">*</span>
                            </label>
                            <select
                                className="form-select"
                                value={packingMaterialID || ''}
                                onChange={(e) => {
                                    const selectedID = e.target.value;
                                    const selectedMaterial = packingMaterials.find(
                                        (pm) => pm.PackingMaterialID.toString() === selectedID
                                    );
                                    setPackingMaterialID(selectedID);
                                    setPackagingCost(selectedMaterial?.PackagingCost || '');
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
                            <label className="form-label fw-bold">
                                Packaging Cost (Rs)
                            </label>
                            <input
                                type="text"
                                id="packagingCost"
                                className="form-control"
                                value={packagingCost == 0 ? 0 : packagingCost}
                                disabled
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="mb-3 col-md-6">
                        <label className="form-label fw-bold">Minimum Order Qty <span className='text-danger'>*</span></label>
                        <input
                            type="number"
                            className="form-control"
                            value={minOrderQty}
                            onChange={(e) => setMinOrderQty(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="card p-3 mb-3">
                    <div className='mb-3'>

                        <div className="mb-3 d-flex gap-2">
                            <button className="btn btn-warning" type='button' onClick={() => setActiveForm('swiggy')}>
                                Swiggy
                            </button>
                            <button className="btn btn-success" type='button' onClick={() => setActiveForm('blinkit')}>
                                Blinkit
                            </button>
                            <button className='btn btn-danger' type='button' onClick={() => setActiveForm('reliance')}>Reliance</button>
                        </div>

                        {activeForm === 'swiggy' && (
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label"><b className='text-warning'>Swiggy</b> Item Code</label>
                                    <input
                                        type="text"
                                        name="itemCode"
                                        className="form-control"
                                        value={swiggyData.itemCode}
                                        onChange={handleSwiggyChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label"><b className='text-warning'>Swiggy</b> Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        value={swiggyData.name}
                                        onChange={handleSwiggyChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label"><b className='text-warning'>Swiggy</b> Storage</label>
                                    <input
                                        type="text"
                                        name="storage"
                                        className="form-control"
                                        value={swiggyData.storage}
                                        onChange={handleSwiggyChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label"><b className='text-warning'>Swiggy</b> ShelfLife</label>
                                    <input
                                        type="text"
                                        name="shelfLife"
                                        className="form-control"
                                        value={swiggyData.shelfLife}
                                        onChange={handleSwiggyChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label"><b className='text-warning'>Swiggy</b> UOM</label>
                                    <input
                                        type="text"
                                        name="uom"
                                        className="form-control"
                                        value={swiggyData.uom}
                                        onChange={handleSwiggyChange}
                                    />
                                </div>
                            </div>
                        )}

                        {activeForm === 'blinkit' && (
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label"><b className='text-success'>Blinkit</b> Item Code</label>
                                    <input
                                        type="text"
                                        name="itemCode"
                                        className="form-control"
                                        value={blinkitData.itemCode}
                                        onChange={handleBlinkitChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label"><b className='text-success'>Blinkit</b> Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        value={blinkitData.name}
                                        onChange={handleBlinkitChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label"><b className='text-success'>Blinkit</b> UOM</label>
                                    <input
                                        type="text"
                                        name="uom"
                                        className="form-control"
                                        value={blinkitData.uom}
                                        onChange={handleBlinkitChange}
                                    />
                                </div>
                            </div>
                        )}

                        {activeForm === 'reliance' && (
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label"><b className='text-danger'>Reliance</b> Item Code</label>
                                    <input
                                        type="text"
                                        name="relianceitemCode"
                                        className="form-control"
                                        value={relianceData.relianceitemCode}
                                        onChange={handleRelianceChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label"><b className='text-danger'>Reliance</b> Name</label>
                                    <input
                                        type="text"
                                        name="reliancename"
                                        className="form-control"
                                        value={relianceData.reliancename}
                                        onChange={handleRelianceChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label"><b className='text-danger'>Reliance</b> UOM</label>
                                    <input
                                        type="text"
                                        name="relianceuom"
                                        className="form-control"
                                        value={relianceData.relianceuom}
                                        onChange={handleRelianceChange}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Product Picture</label>
                    <input
                        type="file"
                        className={`form-control ${error?.productPicture ? 'is-invalid' : ''}`}
                        onChange={(e) => setProductPicture(e.target.files[0])}
                        accept="image/*"
                    />
                    {error?.productPicture && (
                        <div className="invalid-feedback">{error.productPicture[0]}</div>
                    )}

                    {productPicture && (
                        <img
                            src={URL.createObjectURL(productPicture)}
                            alt="Preview"
                            className="img-thumbnail mt-2"
                            style={{ maxWidth: '200px' }}
                        />
                    )}
                </div>

                <button type="submit" className="btn btn-warning w-100 mb-3" disabled={loading}>
                    {loading && (
                        <span
                            className="spinner-border spinner-border-sm text-light"
                            role="status"
                            aria-hidden="true"
                        ></span>
                    )}
                    {loading ? ' Updating...' : 'Update Product'}
                </button>
                <button type="button" className="btn btn-secondary w-100" onClick={handleCancel}>
                    Cancel
                </button>
            </form>
        </div>
    );
}
