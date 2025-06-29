'use client';

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Modal as RBModal, Button } from 'react-bootstrap';
import UserAccountDelete from "./UserAccountDelete";  // adjust path if needed

export default function YourAccountDetails() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);  // for modal

  const fetchUser = async () => {
    try {
      const res = await api.get('/userprofile');
      setUser(res.data);
    } catch (error) {
      console.error('Fetch user failed', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleModalShow = () => setShow(true);
  const handleModalClose = () => setShow(false);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!user) {
    return <div className="text-danger text-center mt-5">User data not available.</div>;
  }

  const { name, mobile, email, branch, picture } = user;
  const city = branch?.[0]?.City || "N/A";
  const profileImage = picture
    ? `https://your-image-base-url.com/${picture}`
    : "https://via.placeholder.com/150";

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow rounded-4 p-4 border-0">
            <div className="text-center mb-4">
              <img
                src={profileImage}
                alt="Profile"
                className="rounded-circle border border-3"
                style={{ width: '100px', height: '120px', objectFit: 'cover' }}
              />
              <h4 className="mt-3" style={{ color: "#643C64" }}>Your Account Details</h4>
            </div>

            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex align-items-center">
                <i className="bi bi-person-fill me-2 text-primary"></i>
                <strong className="me-2" style={{ color: "#643C64" }}>Name :</strong> {name}
              </li>
              <li className="list-group-item d-flex align-items-center">
                <i className="bi bi-telephone-fill me-2 text-success"></i>
                <strong className="me-2" style={{ color: "#643C64" }}>Mobile :</strong> {mobile}
              </li>
              <li className="list-group-item d-flex align-items-center">
                <i className="bi bi-envelope-fill me-2 text-warning"></i>
                <strong className="me-2" style={{ color: "#643C64" }}>Email :</strong> {email}
              </li>
              <li className="list-group-item d-flex align-items-center">
                <i className="bi bi-geo-alt-fill me-2 text-info"></i>
                <strong className="me-2" style={{ color: "#643C64" }}>City :</strong> {city}
              </li>
            </ul>

            <div className="text-center" style={{ paddingTop: '2rem' }}>
              <button className="btn btn-danger" onClick={handleModalShow}>
                <i className="bi bi-trash-fill me-2"></i> Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      <RBModal show={show} onHide={handleModalClose} centered>
        <RBModal.Header closeButton>
          <div className="w-100 text-center">
          <RBModal.Title className="text-center">Delete Account</RBModal.Title>
          </div>
        </RBModal.Header>
        <RBModal.Body>
          <UserAccountDelete onDeleted={handleModalClose} />
        </RBModal.Body>
      </RBModal>
    </div>
  );
}
