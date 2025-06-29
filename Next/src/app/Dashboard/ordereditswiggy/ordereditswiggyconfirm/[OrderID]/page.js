'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function OrderEditSwiggyConfirm({ params }) {
    const OrderID = params.OrderID;
    const router = useRouter();

    const [orderNo, setOrderNo] = useState('');
    const [date, setDate] = useState('');
    const [selectClient, setSelectClient] = useState('');
    const [remark, setRemark] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [clients, setClients] = useState([]);
    const [items, setItems] = useState([]);
    const [itemName, setItemName] = useState('');
    const [qty, setQty] = useState(0);
    const [rate, setRate] = useState(0);
    const [unit, setUnit] = useState('');
    const [deliveryCharges, setDeliveryCharges] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [products, setProducts] = useState([]);
    const [productID, setProductID] = useState('');
    const [editIndex, setEditIndex] = useState(null);
    const [editQty, setEditQty] = useState(0);
    const [editRate, setEditRate] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!OrderID) return;

        const fetchOrder = async () => {
            try {
                const res = await api.get(`ordercancelswiggy-show/${OrderID}`);
                const order = res.data;

                setOrderNo(order.OrderNo);
                setDate(order.OrderDate);
                setSelectClient(order.DisplayName);
                setRemark(order.Remark);
                setItems((order.items || []).map(item => ({
                    productID: item.ProductID,
                    itemName: item.ProductName,
                    qty: item.Quantity,
                    unit: item.UnitName,
                    rate: item.Rate,
                    amount: item.Amount
                })));
                setLoading(false);
            } catch (err) {
                setError('Failed to load this order data.');
                console.error(err);
                setLoading(false);
            }
        };

        fetchOrder();
    }, [OrderID]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await api.get('product-data');
                setProducts(response.data.data);
            } catch (error) {
                console.error('Failed to fetch items:', error);
                setProducts([]);
            }
        };
        fetchItems();
    }, []);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const res = await api.get('/swiggyordercreate-data');
                setClients(res.data);
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };
        fetchClients();
    }, []);

    const handleItemBlur = () => {
        const match = products.find(
            item => item.ProductName.trim().toLowerCase() === itemName.trim().toLowerCase()
        );
        if (match) {
            setProductID(match.ProductID || '');
            setUnit(match.UnitName || '');
        } else {
            setUnit('');
        }
    };

    const handleAddItem = () => {
        const matchedItem = products.find(
            item => item.ProductName.trim().toLowerCase() === itemName.trim().toLowerCase()
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
            productID: matchedItem.ProductID,
            itemName: matchedItem.ProductName,
            unit: matchedItem.UnitName,
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
        const selectedItem = items[index];

        if (!selectedItem.qty || !selectedItem.rate || selectedItem.qty <= 0 || selectedItem.rate <= 0) {
            setErrorMsg('Cannot edit. Quantity and rate must be valid numbers.');
            return;
        }

        setEditIndex(index);
        setEditQty(selectedItem.qty);
        setEditRate(selectedItem.rate);
    };

    const handleSaveEdit = () => {
        if (!editQty || !editRate || editQty <= 0 || editRate <= 0) {
            setErrorMsg('Please enter a valid quantity and rate before saving.');
            return;
        }

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
    const totalAmount = subtotal + Number(deliveryCharges) - Number(discount);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put(`orderedit-update`, {
                OrderID: OrderID,
                OrderDate: date,
                SubTotal: subtotal,
                DeliveryCharges: deliveryCharges || 0,
                TotalAmount: totalAmount,
                Remark: remark || 'null',
                Discount: discount || 0,
                OrderTransModels: items.map(item => ({
                    ProductID: item.productID,
                    Quantity: item.qty,
                    Rate: item.rate,
                    Amount: item.amount
                }))
            });
            router.push('/Dashboard/ordereditswiggy');
        } catch (err) {
            setError('Failed to update this order.');
            console.error(err.response?.data || err.message);
        } finally{
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.push('/Dashboard/ordereditswiggy');
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
            <h2 className="text-center mb-4 fw-bold text-warning">Edit Swiggy's Order</h2>

            {error && <div className="alert alert-danger">{error}</div> || errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-white">
                <div className="row">
                    <div className="mb-3 col-md-6">
                        <label className="form-label fw-bold">Order No</label>
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

                <div className="mb-3">
                    <label className="form-label fw-bold">Selected Client</label>
                    <input
                        className="form-control"
                        value={selectClient}
                        disabled
                    />
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

                <h5 className="mb-3 fw-bold">Item Details</h5>

                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead className="table-light">
                            <tr>
                                <th style={{ minWidth: '240px' }}>Item Name</th>
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
                                        placeholder="Enter Item Name"
                                        required={items.length === 0}
                                    />
                                    <datalist id="items-options">
                                        {products.map(item => (
                                            <option key={item.ProductID} value={item.ProductName} />
                                        ))}
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
                                            if (/^\d{0,10}$/.test(input)) {
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
                                                    if (/^\d{0,4}$/.test(input)) {
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
                                <td colSpan="4" className="text-end fw-bold">Delivery Charges: (+)</td>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={deliveryCharges}
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            if (/^\d{0,3}$/.test(input)) {
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
                                <td colSpan="4" className="text-end fw-bold text-danger">Discount: (-)</td>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={discount}
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            if (/^\d{0,4}$/.test(input)) {
                                                setDiscount(input);
                                            }
                                        }}
                                    />
                                </td>
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

                <button type="submit" className="btn btn-success w-100 mb-3" disabled={loading}>
                    {loading && (
                        <span
                            className="spinner-border spinner-border-sm text-light"
                            role="status"
                            aria-hidden="true"
                        ></span>
                    )}
                    {loading ? ' Updating...' : 'Update Order'}
                </button>
                <button type="button" className="btn btn-secondary w-100" onClick={handleCancel}>
                    Cancel
                </button>
            </form>
        </div>
    );
}
