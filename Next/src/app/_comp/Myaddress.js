'use client';

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Modal as RBModal, Button } from 'react-bootstrap';
import AddNewAddress from "./AddNewAddres";
import { ToastContainer, toast } from 'react-toastify';

export default function MyAddress() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [branchInfo, setBranchInfo] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/getdeliveryaddresses');
      const data = res.data?.data || [];
      setAddresses(data);
    } catch (err) {
      console.error("Error fetching addresses:", err);
      setError("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (addressId) => {
    try {
      const res = await api.delete(`/delete-address/${addressId}`);
      toast.success(res.data.message);
      fetchAddresses();
    } catch (error) {
      toast.error("Failed to delete address");
      console.error(error);
    }
  };

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
      toast.error('Could not load branch info');
    }
  };

  const handleAddressAdded = () => {
    fetchAddresses();
    handleAddressModalClose();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div className="container py-4">
     <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
       <div className="mb-4 text-end" style={{ paddingTop: '2rem' }}>
        <button className="btn btn-primary" onClick={handleAddressModalShow}>
          Add / Update Address
        </button>

        <RBModal show={show} onHide={handleAddressModalClose}>
          <RBModal.Header closeButton >
            <RBModal.Title className="text-center">Add New Address</RBModal.Title>
          </RBModal.Header>    
          <RBModal.Body>
            <AddNewAddress branchInfo={branchInfo} onAddressAdded={handleAddressAdded} />
          </RBModal.Body>
        </RBModal>
      </div>

      <div className="row g-3">
        {addresses.length > 0 ? (
          addresses.map((address) => {
            const isDeletable = ['Home', 'Office', 'Other'].includes(address.AddressTitle);

            return (
              <div key={address.DeliveryAddressID} className="col-md-4">
                <div className="card h-100 shadow-sm border">
                  <div className="card-body">
                    <h5 className="card-title text-success">{address.AddressTitle}</h5>
                    <p className="card-text">
                      <strong>Display Name:</strong> {address.DisplayName}<br />
                      <strong>Address:</strong> {address.Address}<br />
                      <strong>Mobile:</strong> {address.Mobile}<br />
                      <strong>City:</strong> {address.City}<br />
                      <strong>Area:</strong> {address.Area}<br />
                      <strong>Email:</strong> {address.Email}<br />
                      <strong>PinCode:</strong> {address.PinCode}
                    </p>
                  </div>

                  {isDeletable && (
                    <div className="card-footer text-end">
                      <Button variant="danger" onClick={() => handleDelete(address.DeliveryAddressID)}>
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-12 text-center">
            <p>No addresses found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
