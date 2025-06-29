'use client';
import React, { useState, useEffect } from "react";
import { useCart } from "../_context/CartContext";
import api from '@/lib/axios';
import Link from "next/link";
import { Radio, Box, Stepper, Step, StepLabel, Typography, Modal } from '@mui/material';
import { Modal as RBModal, Button } from 'react-bootstrap';
import AddNewAddress from "./AddNewAddres";
import { ToastContainer, toast } from 'react-toastify';


const CheckOut = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const { cart, clearCart } = useCart();
    const [paymentMethod, setPaymentMethod] = useState('COD'); // default to 'cod'
    const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);
    const [branchInfo, setBranchInfo] = useState(null);
    const handleOpen = () => {
        setOpen(true);
        setActiveStep(steps.length); // Move to final step to show modal
    };

    // For Add Address modal
    const [show, setShow] = useState(false);
    const handleAddressModalClose = () => {
        setShow(false);
        setBranchInfo(null);
    };

    const handleAddressModalShow = async () => {
        try {
            const res = await api.get('/getbranchdata'); // make sure this endpoint returns branch info
            setBranchInfo(res.data?.data);
            setShow(true);
        } catch (err) {
            console.error('Error fetching branch info:', err);
            alert('Could not load branch info');
        }
    };

    const handleAddressAdded = () => {
        fetchAddresses();
        handleAddressModalClose();
    };

    // Get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [selectedAddress, setSelectedAddress] = useState('Default');
    const [allAddresses, setAllAddresses] = useState([]);
    const [addressData, setAddressData] = useState({
        DisplayName: '',
        Address: '',
        Mobile: '',
        WhatsApp: '',
        City: '',
        PinCode: '',
        Area: '',
        State: '',
        Email: ''
    });

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const res = await api.get('/getdeliveryaddresses');
                const addresses = res.data?.data || [];
                setAllAddresses(addresses);

                // 🔥 Auto-select "Default" or first IsDefault address
                const defaultAddress = addresses.find(
                    (addr) => addr.AddressTitle === 'Default' || addr.IsDefault === 'Yes'
                );

                if (defaultAddress) {
                    setSelectedAddress(defaultAddress.AddressTitle);
                    setAddressData({
                        DisplayName: defaultAddress.DisplayName || '',
                        Address: defaultAddress.Address || '',
                        Mobile: defaultAddress.Mobile || '',
                        WhatsApp: defaultAddress.WhatsApp || '',
                        Email: defaultAddress.Email || '',
                        Area: defaultAddress.Area || '',
                        City: defaultAddress.City || '',
                        State: defaultAddress.State || '',
                        PinCode: defaultAddress.PinCode || ''
                    });
                }

            } catch (error) {
                console.error('Error fetching delivery addresses:', error);
            }
        };

        fetchAddresses();
    }, []);


    const handleChange = (e) => {
        const selectedTitle = e.target.value;
        setSelectedAddress(selectedTitle);

        const found = allAddresses.find(
            (addr) => addr.AddressTitle === selectedTitle
        );

        if (found) {
            setAddressData({
                DisplayName: found.DisplayName || '',
                Address: found.Address || '',
                Mobile: found.Mobile || '',
                WhatsApp: found.WhatsApp || '',
                Email: found.Email || '',
                Area: found.Area || '',
                City: found.City || '',
                State: found.State || '',
                PinCode: found.PinCode || ''
            });
        } else {
            // Optional: clear form if not found
            setAddressData({
                DisplayName: '',
                Address: '',
                Mobile: '',
                WhatsApp: '',
                Email: '',
                Area: '',
                City: '',
                State: '',
                PinCode: ''
            });
        }
    };


    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // const res = await api.get("/products");
                // setProducts(res.data);
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const cartProducts = Object.values(cart);
    const calculateTotal = (product) => {
        const qty = cart[product.ProductID]?.quantity || 0;
        const price = parseFloat(product.Price);
        return (qty * price).toFixed(2);
    };

    const steps = ['Select Delivery Address', 'Review Order', 'Payment Information', 'Checkout Summary'];

    const isStepOptional = (step) => step === 1;
    const isStepSkipped = (step) => skipped.has(step);

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }
        setActiveStep((prev) => prev + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            throw new Error("You can't skip a step that isn't optional.");
        }

        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
        setActiveStep((prev) => prev + 1);
    };

    const handleChangePayment = (e) => setPaymentMethod(e.target.value);
    // Format it to a readable string (e.g., "May 29, 2025")
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = tomorrow.toLocaleDateString('en-US', options);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        bgcolor: 'background.paper',
        border: '2px solid green',
        boxShadow: 20,
        borderRadius: '1rem',
        p: 2,

    };

    const items = Object.values(cart);

    const placeOrder = async () => {
        try {
            setLoading(true);

            const subTotal = cartProducts.reduce((sum, item) => sum + item.quantity * item.Price, 0);
            const deliveryCharge = 0;
            const totalAmount = subTotal + deliveryCharge;

            const payload = {
                addressType: selectedAddress,
                paymentMethod: paymentMethod,
                subTotal: subTotal,
                deliveryCharge: deliveryCharge,
                totalAmount: totalAmount,
                itemsList: items.map(item => ({
                    Key: item.ProductID,
                    Quantity: item.quantity
                }))
            };

            const res = await api.post('/place-order', payload);

            if (res.data.result === 'Y') {
                const orderId = res.data.order_id || res.data.orderID; // Adjust key as per API response
                clearCart();
                handleOpen();

                // ✅ Send confirmation SMS
                if (orderId) {
                    try {
                        await api.post('/sendorderconfirmationsms', { orderid: orderId });
                    } catch (smsErr) {
                        console.error('SMS sending failed:', smsErr);
                    }
                }

            } else {
                toast.error("Failed to place order.");
            }
        } catch (error) {
            console.error("Place Order Error:", error);
            toast.error("Something went wrong while placing the order.");
        } finally {
            setLoading(false);
        }
    };



    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <div className="row p-3 justify-content-center text-center bg-light rounded shadow">
                        <div className="col-12">
                            <h5>Step 1: Delivery Address</h5>
                            <p>Selected Address: <strong>{selectedAddress}</strong></p>

                            <input
                                type="text"
                                placeholder="Enter name"
                                className="form-control mb-2"
                                value={addressData.DisplayName}
                                readOnly
                                onChange={(e) =>
                                    setAddressData({ ...addressData, DisplayName: e.target.value })
                                }
                            />

                            <input
                                type="text"
                                placeholder="Enter address"
                                className="form-control mb-2"
                                value={addressData.Address}
                                readOnly
                                onChange={(e) =>
                                    setAddressData({ ...addressData, Address: e.target.value })
                                }
                            />

                            <div className="row">
                                <div className="col-md-6">
                                    <input
                                        type="text"
                                        placeholder="Phone"
                                        className="form-control mb-2"
                                        value={addressData.Mobile}
                                        readOnly
                                        onChange={(e) =>
                                            setAddressData({ ...addressData, Mobile: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="col-md-6">
                                    <input
                                        type="text"
                                        placeholder="WhatsApp"
                                        className="form-control mb-2"
                                        value={addressData.WhatsApp || ''}
                                        readOnly
                                        onChange={(e) =>
                                            setAddressData({ ...addressData, WhatsApp: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        className="form-control mb-2"
                                        value={addressData.Email}
                                        readOnly
                                        onChange={(e) =>
                                            setAddressData({ ...addressData, Email: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="col-md-6">
                                    <input
                                        type="text"
                                        placeholder="Area"
                                        className="form-control mb-2"
                                        value={addressData.Area}
                                        readOnly
                                        onChange={(e) =>
                                            setAddressData({ ...addressData, Area: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <input
                                        type="text"
                                        placeholder="City"
                                        className="form-control mb-2"
                                        value={addressData.City}
                                        readOnly
                                        onChange={(e) =>
                                            setAddressData({ ...addressData, City: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="col-md-6">
                                    <input
                                        type="text"
                                        placeholder="Pin Code"
                                        className="form-control mb-2"
                                        value={addressData.PinCode}
                                        readOnly
                                        onChange={(e) =>
                                            setAddressData({ ...addressData, PinCode: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            <input
                                type="text"
                                placeholder="State"
                                className="form-control mb-2"
                                value={addressData.State}
                                readOnly
                                onChange={(e) =>
                                    setAddressData({ ...addressData, State: e.target.value })
                                }
                            />
                        </div>

                        <div className="mt-3 justify-content-end d-flex justify-items-center">
                            <button className="btn btn-success mt-3" onClick={handleNext}> Save & Next <i className="bi bi-arrow-right-circle"></i></button>
                        </div>
                    </div>

                );

            case 1:
                return (
                    <div className="p-3 text-center">
                        <h5>Step 2: Review & Confirm</h5>
                        <div className="row pt-3">
                            <h1 className="text-dark fs-3 pt-3">Your Cart</h1>
                            <hr />
                            {loading ? (
                                <p>Loading products...</p>
                            ) : cartProducts.length === 0 ? (
                                <p className="text-muted">Your cart is empty.</p>
                            ) : (
                                <table className="table table-bordered  table-hover">
                                    <thead>
                                        <tr>
                                            <th>S.No.</th>
                                            <th>Product Name</th>
                                            <th>Qty</th>
                                            <th>Unit</th>
                                            <th>Rate</th>
                                            <th>Total Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartProducts.map((product, index) => (
                                            <tr key={product.ProductID}>
                                                <td>{index + 1}</td>
                                                <td>{product.ProductName}</td>
                                                <td className="justify-content-center justify-items-center d-flex"><input readOnly value={cart[product.ProductID]?.quantity || 0} className="form-control form-control-sm text-center" style={{ width: "4rem" }} /></td>
                                                <td>{product.UnitName || "N/A"}</td>
                                                <td>₹{product.Price || "N/A"}</td>
                                                <td>₹{calculateTotal(product)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan="5" className="text-end fs-5">Subtotal:</td>
                                            <td className="fs-5">₹{cartProducts.reduce((total, p) => total + parseFloat(calculateTotal(p)), 0).toFixed(2)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            )}

                        </div>
                        <div className="mt-3 justify-content-between d-flex justify-items-center">
                            <button className="btn btn-success bi bi-arrow-left-circle mt-3" onClick={handleBack}> Back</button>
                            <button className="btn btn-success  mt-3" onClick={handleNext}> Save & Next <i className="bi bi-arrow-right-circle"></i></button>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="p-3 text-center bg-light rounded shadow">
                        <h5>Step 3: Payment Information</h5>
                        <p>Please select a payment method:</p>

                        {['HDFC', 'PAYTM', 'COD'].map((method) => (
                            <div key={method} className="row p-3">
                                <label
                                    htmlFor={method}
                                    className="col-12 d-flex justify-content-start align-items-center gap-3 shadow p-3 rounded"
                                    style={{ cursor: 'pointer' }} // makes it clear it's clickable
                                >
                                    <input
                                        type="radio"
                                        id={method}
                                        name="payment"
                                        value={method}
                                        checked={paymentMethod === method}
                                        onChange={handleChangePayment}
                                    />
                                    <h5 className="m-0 text-capitalize">
                                        {method === 'HDFC' ? 'HDFC' : method}
                                    </h5>
                                </label>
                            </div>
                        ))}

                        <div className="mt-3 justify-content-between d-flex justify-items-center">
                            <button className="btn btn-success bi bi-arrow-left-circle mt-3" onClick={handleBack}> Back</button>
                            <button className="btn btn-success  mt-3" onClick={handleNext}> Save & Next <i className="bi bi-arrow-right-circle"></i></button>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="p-3 bg-light rounded shadow">
                        <h5 className="text-center mb-4">Step 4 : Checkout Summary</h5>

                        <div className="row justify-content-center text-start">
                            <div className="col-12 col-md-10">
                                <div className="row mb-2">
                                    <div className="col-6 col-sm-4 fw-semibold">Selected Address:</div>
                                    <div className="col-6 col-sm-8">{selectedAddress}</div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-6 col-sm-4 fw-semibold">Payment Method:</div>
                                    <div className="col-6 col-sm-8">
                                        {paymentMethod === 'HDFC'
                                            ? 'HDFC Bank'
                                            : paymentMethod === 'PAYTM'
                                                ? 'Paytm'
                                                : paymentMethod === 'COD'
                                                    ? 'COD'
                                                    : 'Not Selected'}
                                    </div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-6 col-sm-4 fw-semibold">Subtotal:</div>
                                    <div className="col-6 col-sm-8">
                                        ₹{cartProducts.reduce((total, p) => total + parseFloat(calculateTotal(p)), 0).toFixed(2)}
                                    </div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-6 col-sm-4 fw-semibold">Delivery Charges:</div>
                                    <div className="col-6 col-sm-8">₹0.00</div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-6 col-sm-4 fw-semibold">Total:</div>
                                    <div className="col-6 col-sm-8 text-success fs-5 ">
                                        ₹{cartProducts.reduce((total, p) => total + parseFloat(calculateTotal(p)), 0).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 justify-content-between d-flex justify-items-center">
                            <button className="btn btn-success bi bi-arrow-left-circle mt-3" onClick={handleBack}> Back</button>
                            <button
                                className="btn btn-info mt-3 d-flex align-items-center justify-content-center"
                                onClick={placeOrder}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                            aria-hidden="true"
                                        ></span>
                                        Placing Order...
                                    </>
                                ) : (
                                    '  Place Order'
                                )}
                            </button>


                        </div>
                    </div>

                );

            default:
                return <div>Unknown Step</div>;
        }
    };

    return (
        <div className="container mt-5 pt-5">
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
            <div className="row">
                <div className="col-12 bg-secondary text-white">
                    <p className="m-3">Orders placed after 4 AM will be delivered the next morning fresh.</p>
                </div>
            </div>

            <div className="row mt-2 bg-light p-2 shadow align-items-center">
                <div className="col-8">
                    <h5 className="pt-2">Select Delivery Address</h5>
                    {allAddresses.length > 0 ? (
                        allAddresses.map((address) => (
                            <span key={address.AddressTitle} className="me-2">
                                <Radio
                                    checked={selectedAddress === address.AddressTitle}
                                    onChange={handleChange}
                                    value={address.AddressTitle}
                                    name="delivery-address"
                                    color="primary"
                                />
                                {address.AddressTitle}
                            </span>
                        ))
                    ) : (
                        <div>No saved addresses. Please add one.</div>
                    )}


                </div>
                <div className="col-4 d-flex justify-content-end">
                    <button
                        className="btn btn-success bi bi-plus-circle"
                        onClick={handleAddressModalShow}
                    >
                        Add Address
                    </button>
                </div>

                <RBModal show={show} onHide={handleAddressModalClose}>
                    <RBModal.Header closeButton >
                        <RBModal.Title className="text-center">Add New Address</RBModal.Title>
                    </RBModal.Header>
                    <RBModal.Body>
                        <AddNewAddress branchInfo={branchInfo} onAddressAdded={handleAddressAdded} />
                    </RBModal.Body>
                </RBModal>

            </div>

            <Box sx={{ width: '100%', mt: 4 }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {};
                        if (isStepOptional(index)) {
                            labelProps.optional = <Typography variant="caption">Optional</Typography>;
                        }
                        if (isStepSkipped(index)) {
                            stepProps.completed = false;
                        }
                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>

                {activeStep === steps.length ? (
                    <React.Fragment>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                            <div className="shadow-sm p-2 bg-light rounded text-center">

                                <Modal open={open} onClose={handleClose}>
                                    <Box
                                        sx={{
                                            ...style,
                                            width: {
                                                xs: '90%',  // phones
                                                sm: '80%',  // tablets
                                                md: '70%',  // desktops
                                            },
                                            maxWidth: 400,
                                            mx: 'auto',
                                            p: 3,
                                            borderRadius: 2,
                                            textAlign: 'center',
                                            backgroundColor: '#FCFAF6',
                                        }}
                                    >
                                        <i className="text-success fs-1 bi bi-patch-check-fill"></i>

                                        <Typography variant="h6">
                                            Thank you for your order!
                                        </Typography>

                                        <hr />

                                        <Typography variant="body1" sx={{ mb: 1 }}>
                                            <span className="text-danger">Estimated Delivery</span>: {formattedDate}
                                        </Typography>


                                        <Link href="/" className="btn btn-success mt-3">
                                            Continue Shopping
                                        </Link><br />
                                        <Link href="/website/myaccount" className="btn btn-info mt-3">
                                            My Orders
                                        </Link>
                                    </Box>
                                </Modal>
                            </div>
                        </Typography>


                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Box sx={{ mt: 2, mb: 1 }}>
                            {getStepContent(activeStep)}
                        </Box>
                    </React.Fragment>
                )}
            </Box>
        </div>
    );
};

export default CheckOut;
