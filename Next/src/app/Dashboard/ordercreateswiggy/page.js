'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import * as XLSX from 'xlsx';

export default function SwiggyOrderCreate() {
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
    const [discount, setDiscount] = useState(0);
    const [products, setProducts] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [productID, setProductID] = useState('');
    const [editIndex, setEditIndex] = useState(null);
    const [editQty, setEditQty] = useState(0);
    const [editRate, setEditRate] = useState(0);
    const [unitID, setUnitID] = useState('');
    const [poNumber, setPoNumber] = useState('');
    const [poDate, setPoDate] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchOrderNo = async () => {
            try {
                const response = await api.get('latest-order-no');
                setOrderNo(response.data.nextOrderNo);
            } catch (error) {
                console.error('Failed to fetch latest OrderNo:', error);
                setOrderNo('Error');
            }
        };
        fetchOrderNo();
    }, []);

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
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const formatted = `${yyyy}-${mm}-${dd}`;
        setDate(formatted);
        setPoDate(formatted);
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

    const handleClientBlur = () => {
        const match = clients.find(
            client => client.PlatformName.trim().toLowerCase() === selectClient.trim().toLowerCase()
        );
        setUserID(match?.UserID || '');
    };

    const handleItemBlur = () => {
        const match = products.find(item => {
            const combined = `${item.NameSwiggy} (${item.ItemCodeSwiggy})`.toLowerCase().trim();
            return combined === itemName.toLowerCase().trim();
        });
        if (match) {
            setProductID(match.ProductID || '');
            setUnit(match.UnitName || '');
        } else {
            setUnit('');
        }
    };

    const handleInfoClick = async () => {
        if (!userID) {
            setErrorMsg('Please select a valid client first.');
            return;
        }
        try {
            const response = await api.get(`/user-show/${userID}`);
            setClientInfo(response.data);
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching client info:', error);
            setErrorMsg('Failed to load client info.');
        }
    };

    const handleAddItem = () => {
        const matchedItem = products.find(item => {
            const combined = `${item.NameSwiggy} (${item.ItemCodeSwiggy})`.toLowerCase().trim();
            return combined === itemName.toLowerCase().trim();
        });

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
            itemName: `${matchedItem.NameSwiggy} (${matchedItem.ItemCodeSwiggy})`,
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
    const totalAmount = subtotal + Number(deliveryCharges) - Number(discount);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const workbook = XLSX.read(bstr, { type: 'binary' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

            const formattedItems = rawData.map(row => {
                const matchedProduct = products.find(p => p.ItemCodeSwiggy === String(row.Code).trim());
                if (!matchedProduct) return null;

                const qty = Number(row.Qty);
                const rate = Number(row.Rate);

                return {
                    productID: matchedProduct.ProductID,
                    itemName: `${matchedProduct.NameSwiggy} (${matchedProduct.ItemCodeSwiggy})`,
                    unit: matchedProduct.UnitName || '',
                    qty,
                    rate,
                    amount: qty * rate
                };
            }).filter(item => item !== null);

            setItems(formattedItems);
        };
        reader.readAsBinaryString(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!userID) {
            setErrorMsg('Please select a valid client from the dropdown.');
            return;
        }

        try {
            await api.post('ordercreate-store', {
                OrderNo: orderNo,
                OrderDate: date,
                ClientID: userID,
                SubTotal: subtotal,
                DeliveryCharges: deliveryCharges,
                TotalAmount: totalAmount,
                Remark: remark || 'null',
                Discount: discount,
                PODate: poDate,
                PONumber: poNumber,
                OrderTransModels: items.map(item => ({
                    ProductID: item.productID,
                    Quantity: item.qty,
                    Rate: item.rate,
                    Amount: item.amount
                }))
            });

            setSuccessMsg('Swiggy order created successfully! 🎉');
            setErrorMsg('');
            setOrderNo('');
            setDate('');
            setPoDate('');
            setSelectClient('');
            setRemark('');
            setUserID('');
            setItems([]);
            setDeliveryCharges('');
            setDiscount('');
            setPoNumber('');
        } catch (error) {
            console.error('Error creating order:', error);
            setErrorMsg('Failed to create order. Please try again.');
            setSuccessMsg('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-success fw-bold">Swiggy Order Create</h2>

            {successMsg && <div className="alert alert-success">{successMsg}</div>}
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
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

                <div className="row">
                    <div className="mb-3 col-md-10">
                        <label className="form-label fw-bold">Select Client <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className="form-control"
                            list="client-options"
                            value={selectClient}
                            onChange={(e) => setSelectClient(e.target.value)}
                            onBlur={handleClientBlur}
                            placeholder="Select a client"
                            required
                        />
                        <datalist id="client-options">
                            {clients.map(client => (
                                <option key={client.UserID} value={client.PlatformName} />
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

                <div className="row">
                    <div className="mb-3 col-md-6">
                        <label className='form-label fw-bold'>PO Number</label>
                        <input
                            type="text"
                            className="form-control"
                            value={poNumber}
                            onChange={(e) => setPoNumber(e.target.value)}
                        />
                    </div>
                    <div className="mb-3 col-md-6">
                        <label className="form-label fw-bold">PO Date <span className="text-danger">*</span></label>
                        <input
                            type="date"
                            className="form-control"
                            value={poDate}
                            onChange={(e) => setPoDate(e.target.value)}
                            required
                        />
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

                <div className='mb-3'>
                    <label className='form-label fw-bold'>Upload File</label>
                    <input
                        type="file"
                        accept=".xlsx"
                        onChange={handleFileUpload}
                        className="form-control my-2"
                    />
                </div>

                <h5 className="mb-3 fw-bold">Item Details</h5>

                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead className="table-success">
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
                                        placeholder="Enter Item Code"
                                        required={items.length === 0}
                                    />
                                    <datalist id="items-options">
                                        {products
                                            .filter(item => item.NameSwiggy && item.ItemCodeSwiggy && item.ItemCodeSwiggy !== "0")
                                            .map(item => (
                                                <option
                                                    key={item.ProductID}
                                                    value={`${item.NameSwiggy} (${item.ItemCodeSwiggy})`}
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
                            <tr>
                                <th style={{ minWidth: '240px', backgroundColor: 'lightgrey' }}>Item Name</th>
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

                <button type="submit" className="btn shadow btn-primary w-100" disabled={loading}>
                    {loading && (
                        <span
                            className="spinner-border spinner-border-sm text-light"
                            role="status"
                            aria-hidden="true"
                        ></span>
                    )}
                    {loading ? ' Creating...' : 'Create Swiggy Order'}
                </button>
            </form>

            {showModal && clientInfo && (
                <div className="modal fade show d-block" tabIndex={-1}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content shadow-lg">
                            <div className="modal-header bg-success text-white">
                                <h5 className="modal-title">Client Details</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p><strong>Client Type:</strong> Quick Commerce</p>
                                <p><strong>Client Name:</strong> {clientInfo.DisplayName}</p>
                                <p><strong>Address:</strong> {clientInfo.branch.Address}</p>
                                <p><strong>Mobile:</strong> {clientInfo.Mobile}</p>
                                <p><strong>Email:</strong> {clientInfo.Email}</p>
                                <p><strong>Branch:</strong> {clientInfo.branch.ShortName}</p>
                                <p><strong>City:</strong> {clientInfo.branch.City}</p>
                                <p><strong>State:</strong> {clientInfo.branch.State}</p>
                                <p><strong>Pincode:</strong> {clientInfo.branch.PinCode}</p>
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
