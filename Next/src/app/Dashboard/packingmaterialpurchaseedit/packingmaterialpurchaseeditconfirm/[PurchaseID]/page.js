'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function PackingMaterialPurchaseEdit({ params }) {
    const PurchaseID = params.PurchaseID;
    const router = useRouter();

    const [orderNo, setOrderNo] = useState('');
    const [date, setDate] = useState('');
    const [selectClient, setSelectClient] = useState('');
    const [remark, setRemark] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [clients, setClients] = useState([]);
    const [userID, setUserID] = useState('');
    const [clientInfo, setClientInfo] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [items, setItems] = useState([]);
    const [itemName, setItemName] = useState('');
    const [qty, setQty] = useState(0);
    const [rate, setRate] = useState(0);
    const [unit, setUnit] = useState('');
    const [deliveryCharges, setDeliveryCharges] = useState(0);
    const [products, setProducts] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [productID, setProductID] = useState('');
    const [editIndex, setEditIndex] = useState(null);
    const [editQty, setEditQty] = useState(0);
    const [editRate, setEditRate] = useState(0);
    const [unitID, setUnitID] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!PurchaseID) return;

        const fetchPackingMaterialPurchase = async () => {
            try {
                const res = await api.get(`packingmaterialpurchase-info/${PurchaseID}`);
                const packingmaterialpurchase = res.data;

                setOrderNo(packingmaterialpurchase.PurchaseInvoiceNo);
                setDate(packingmaterialpurchase.PurchaseDate);
                setUserID(packingmaterialpurchase.VendorID);
                setSelectClient(packingmaterialpurchase.VenderName);
                setRemark(packingmaterialpurchase.Remark || 'null');
                setItems(
                    (packingmaterialpurchase.items || []).map(item => ({
                        productID: item.PackingMaterialID,
                        itemName: item.PackingMaterialName,
                        qty: Number(item.Quantity),
                        unit: item.PurchaseUnit,
                        rate: Number(item.RatePerUnit),
                        amount: Number(item.Amount)
                    }))
                );
                setDeliveryCharges(packingmaterialpurchase.OtherCharges || 0);
                setLoading(false);
            } catch (err) {
                setError('Failed to load packing material purchase data.');
                console.error(err);
                setLoading(false);
            }
        };

        fetchPackingMaterialPurchase();
    }, [PurchaseID]);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const res = await api.get('/select-vendor-data');
                setClients(res.data);
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };
        fetchClients();
    }, []);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await api.get('packingmaterialpurchaseitem-data');
                setProducts(response.data.data);
            } catch (error) {
                console.error('Failed to fetch items:', error);
                setProducts([]);
            }
        };
        fetchItems();
    }, []);

    const handleClientBlur = () => {
        const match = clients.find(
            client => client.VenderName.trim().toLowerCase() === selectClient.trim().toLowerCase()
        );
        setUserID(match?.VenderID || '');
    };

    const handleItemBlur = () => {
        const match = products.find(
            item => item.PackingMaterialName.trim().toLowerCase() === itemName.trim().toLowerCase()
        );
        if (match) {
            setProductID(match.PackingMaterialID || '');
            setQty(match.MinimumPurchaseQty || 0);
            setUnit(match.PurchaseUnit || '');
            setRate(match.PackagingCost || 0);
        } else {
            setQty(0);
            setUnit('');
            setRate(0);
        }
    };

    const handleInfoClick = async () => {
        if (!userID) {
            setErrorMsg('Please select a valid vendor first.');
            return;
        }
        try {
            const response = await api.get(`/vendor-info/${userID}`);
            setClientInfo(response.data);
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching vendor info:', error);
            setErrorMsg('Failed to load vendor info.');
        }
    };

    const handleAddItem = () => {
        const matchedItem = products.find(
            item => item.PackingMaterialName.trim().toLowerCase() === itemName.trim().toLowerCase()
        );

        if (!matchedItem) {
            setErrorMsg('Please select a valid item from the dropdown.');
            return;
        }

        if (qty <= 0 || rate <= 0) {
            setErrorMsg('Please enter a valid quantity and rate.');
            return;
        }

        const amount = qty * rate;

        setItems([...items, {
            productID: matchedItem.PackingMaterialID,
            itemName: matchedItem.PackingMaterialName,
            unit: matchedItem.PurchaseUnit,
            qty,
            rate,
            amount
        }]);

        setItemName('');
        setQty(0);
        setRate(0);
        setUnit('');
    };

    const handleEditClick = (index) => {
        setEditIndex(index);
        setEditQty(items[index].qty);
        setEditRate(items[index].rate);
    };

    const handleSaveEdit = () => {
        const updatedItems = [...items];
        updatedItems[editIndex] = {
            ...updatedItems[editIndex],
            qty: editQty,
            rate: editRate,
            amount: editQty * editRate,
        };
        setItems(updatedItems);
        setEditIndex(null);
    };

    const handleDeleteItem = (index) => {
        const updatedItems = [...items];
        updatedItems.splice(index, 1);
        setItems(updatedItems);
    };

    const subtotal = items.reduce((acc, item) => acc + item.amount, 0);
    const totalAmount = subtotal + Number(deliveryCharges);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!userID) {
            setErrorMsg('Please select a valid client from the dropdown.');
            return;
        }
        try {
            await api.put(`packingmaterialpurchase-update/${PurchaseID}`, {
                PurchaseInvoiceNo: orderNo,
                PurchaseDate: date,
                Subtotal: subtotal,
                OtherCharges: deliveryCharges,
                GrandTotal: totalAmount,
                PaymentStatus: 'UnPaid',
                VendorID: userID,
                Remark: remark || 'null',
                OrderTransModels: items.map(item => ({
                    PackingMaterialID: item.productID,
                    RatePerUnit: item.rate,
                    PurchaseUnit: item.unit,
                    Quantity: item.qty,
                    Amount: item.amount
                }))
            });
            router.push('/Dashboard/packingmaterialpurchaseedit');
        } catch (err) {
            setError('Failed to update packing material purchase.');
            console.error(err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.push('/Dashboard/packingmaterialpurchaseedit');
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4 text-warning fw-bold">Edit Packing Material Purchase</h2>

            {error && <div className="alert alert-danger">{error}</div> || errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-white">
                <div className="row">
                    <div className="mb-3 col-md-6">
                        <label className="form-label fw-bold">Purchase Invoice No.</label>
                        <input
                            type="text"
                            className="form-control"
                            value={orderNo}
                            disabled
                        />
                    </div>
                    <div className="mb-3 col-md-6">
                        <label className="form-label fw-bold">Date <span className="text-danger">*</span></label>
                        <input
                            type="date"
                            className="form-control"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="mb-3 col-md-10">
                        <label className="form-label fw-bold">Select Vendor <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className="form-control"
                            list="client-options"
                            value={selectClient}
                            onChange={(e) => setSelectClient(e.target.value)}
                            onBlur={handleClientBlur}
                            placeholder="Select a vendor"
                            required
                        />
                        <datalist id="client-options">
                            {clients.map(client => (
                                <option key={client.VenderID} value={client.VenderName} />
                            ))}
                        </datalist>
                    </div>
                    <div className="mb-3 col-md-2 d-flex align-items-end">
                        <button
                            className="btn btn-info text-white w-100"
                            type="button"
                            onClick={handleInfoClick}
                        >
                            <i className="bi bi-eye-fill text-white"></i> Info
                        </button>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Remark</label>
                    <textarea
                        className="form-control"
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                    ></textarea>
                </div>
                <hr className="my-4 border border-primary" />

                <h5 className="mb-3 fw-bold">Add Packing Material</h5>

                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead className="table-success">
                            <tr>
                                <th style={{ minWidth: '240px' }}>Packing Material</th>
                                <th style={{ width: '140px', minWidth: '100px' }}>Qty</th>
                                <th style={{ width: '140px', minWidth: '80px' }}>Unit</th>
                                <th style={{ width: '140px', minWidth: '100px' }}>Rate</th>
                                <th style={{ width: '160px', minWidth: '120px' }}>Amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        list="items-options"
                                        value={itemName}
                                        onChange={(e) => setItemName(e.target.value)}
                                        onBlur={handleItemBlur}
                                        placeholder="Enter Packing Material Name"
                                        required={items.length === 0}
                                    />
                                    <datalist id="items-options">
                                        {products
                                            .map(item => (
                                                <option
                                                    key={item.PackingMaterialID}
                                                    value={item.PackingMaterialName}
                                                />
                                            ))
                                        }
                                    </datalist>
                                </td>
                                <td>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={qty}
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            if (/^\d{0,4}$/.test(input)) {
                                                setQty(input);
                                            }
                                        }}
                                    />
                                </td>
                                <td>
                                    <input
                                        className="form-control"
                                        value={unit}
                                        placeholder='unit'
                                        onChange={e => setUnit(e.target.value)}
                                        disabled
                                    />
                                </td>
                                <td>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={rate}
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            if (/^\d*\.?\d{0,2}$/.test(input) || input === '') {
                                                setRate(input);
                                            }
                                        }}
                                    />
                                </td>
                                <td>
                                    <input
                                        className="form-control"
                                        value={qty * rate}
                                        disabled
                                    />
                                </td>
                                <td className='text-center align-middle'>
                                    <div className="d-flex justify-content-center align-items-center">
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={handleAddItem}
                                        >
                                            <i className='bi bi-patch-plus'></i> Add
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th style={{ minWidth: '240px', backgroundColor: 'lightgrey' }}>Packing Material</th>
                                <th style={{ width: '140px', minWidth: '100px', backgroundColor: 'lightgrey' }}>Qty</th>
                                <th style={{ width: '140px', minWidth: '80px', backgroundColor: 'lightgrey' }}>Unit</th>
                                <th style={{ width: '140px', minWidth: '100px', backgroundColor: 'lightgrey' }}>Rate</th>
                                <th style={{ width: '160px', minWidth: '120px', backgroundColor: 'lightgrey' }}>Amount</th>
                                <th style={{ backgroundColor: 'lightgrey' }}>Action</th>
                            </tr>

                            {items.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.itemName}</td>

                                    <td>
                                        {editIndex === idx ? (
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editQty}
                                                onChange={(e) => {
                                                    const input = e.target.value;
                                                    if (/^\d{0,4}$/.test(input)) {
                                                        setEditQty(input);
                                                    }
                                                }}
                                            />
                                        ) : (
                                            item.qty
                                        )}
                                    </td>

                                    <td>{item.unit}</td>

                                    <td>
                                        {editIndex === idx ? (
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editRate}
                                                onChange={(e) => {
                                                    const input = e.target.value;
                                                    if (/^\d*\.?\d{0,2}$/.test(input) || input === '') {
                                                        setEditRate(input);
                                                    }
                                                }}
                                            />
                                        ) : (
                                            item.rate
                                        )}
                                    </td>

                                    <td>{editIndex === idx ? (editQty * editRate).toFixed(2) : item.amount}</td>

                                    <td className='text-center align-middle'>
                                        <div className="d-flex justify-content-center align-items-center">
                                            {editIndex === idx ? (
                                                <button
                                                    type="button"
                                                    className="btn btn-success text-white me-2"
                                                    onClick={handleSaveEdit}
                                                >
                                                    <i className="bi bi-check-lg"></i>
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="btn btn-warning text-white me-2"
                                                    onClick={() => handleEditClick(idx)}
                                                >
                                                    <i className='bi bi-pen-fill'></i>
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                className="btn btn-danger text-white"
                                                onClick={() => handleDeleteItem(idx)}
                                            >
                                                <i className='bi bi-trash3-fill'></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="4" className="text-end fw-bold">Other Charges: (+)</td>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={deliveryCharges}
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            if (/^\d*\.?\d{0,3}$/.test(input) || input === '') {
                                                setDeliveryCharges(input);
                                            }
                                        }}
                                    />
                                </td>
                                <td></td>
                            </tr>
                            <tr>
                                <td colSpan="4" className="text-end fw-bold text-success">Sub Total</td>
                                <td>{subtotal.toFixed(2)}</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td colSpan="4" className="text-end fw-bold text-primary">Total Amount</td>
                                <td className="fw-bold">{totalAmount.toFixed(2)}</td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <button type="submit" className="btn btn-success w-100 mb-3 shadow" disabled={loading}>
                    {loading && (
                        <span
                            className="spinner-border spinner-border-sm text-light"
                            role="status"
                            aria-hidden="true"
                        ></span>
                    )}
                    {loading ? ' Updating...' : 'Update Packing Material Purchase'}
                </button>
                <button type="button" className="btn btn-secondary w-100 shadow" onClick={handleCancel}>
                    Cancel
                </button>
            </form>
            {showModal && clientInfo && (
                <div className="modal fade show d-block" tabIndex={-1}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content shadow-lg">
                            <div className="modal-header bg-success text-white">
                                <h5 className="modal-title">Vendor Details</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p><strong>Vendor Name:</strong> {clientInfo.VenderName}</p>
                                <p><strong>Mobile:</strong> {clientInfo.Mobile}</p>
                                <p><strong>Email:</strong> {clientInfo.Email}</p>
                                <p><strong>Address:</strong> {clientInfo.Address}</p>
                                <p><strong>Area:</strong> {clientInfo.Area}</p>
                                <p><strong>City:</strong> {clientInfo.City}</p>
                                <p><strong>State:</strong> {clientInfo.State}</p>
                                <p><strong>Pincode:</strong> {clientInfo.PinCode}</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
