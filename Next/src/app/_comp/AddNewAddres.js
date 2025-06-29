'use client';

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { ToastContainer, toast } from 'react-toastify';


export default function AddNewAddress({ branchInfo, onAddressAdded }) {
  const [form, setForm] = useState({
    AddressTitle: '',
    DisplayName: '',
    Mobile: '',
    WhatsApp: '',
    Email: '',
    Address: '',
    Area: '',
    City: '',
    State: '',
    PinCode: '',
  });

  useEffect(() => {
    if (branchInfo) {
      setForm((prev) => ({
        ...prev,
        City: branchInfo.CityName || '',
        State: branchInfo.State || '',
        Area: branchInfo.Areas?.[0]?.AreaName || '',
        PinCode: branchInfo.Areas?.[0]?.PinCode || '',
      }));
    }
  }, [branchInfo]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? (checked ? 'Yes' : 'No') : value;

    // Update PinCode based on selected Area
    if (name === 'Area' && branchInfo?.Areas?.length) {
      const selected = branchInfo.Areas.find(a => a.AreaName === value);
      setForm((prev) => ({
        ...prev,
        Area: value,
        PinCode: selected?.PinCode || ''
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: newValue }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/add-address', form);
      toast.success(res.data.message);
      setForm({
        AddressTitle: '',
        DisplayName: '',
        Mobile: '',
        WhatsApp: '',
        Email: '',
        Address: '',
        Area: '',
        City: '',
        State: '',
        PinCode: '',
      });
      if (onAddressAdded) onAddressAdded();
    } catch (error) {
      if (error.response?.data?.errors) {
        alert("Validation Error:\n" + JSON.stringify(error.response.data.errors, null, 2));
      // } else {
      //   toast.error('Failed to add address');
      }
      console.error(error);
    }
  };

  return (
    <div className="container">
     <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
       <form onSubmit={handleSubmit}>
        <div className="row mb-2">
          {/* Address Type, Name, Phone */}
          <div className="col-md-6">
            <label className="form-label">Address Type</label>
            <select
              className="form-select"
              name="AddressTitle"
              value={form.AddressTitle}
              onChange={handleChange}
              required
            >
              <option value="">Select Address Type</option>
              <option value="Default">Default</option>
              <option value="Home">Home</option>
              <option value="Office">Office</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              name="DisplayName"
              value={form.DisplayName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mt-2">
            <label className="form-label">Mobile</label>
            <input
              type="tel"
              className="form-control"
              name="Mobile"
              value={form.Mobile}
              onChange={handleChange}
              maxLength={10}
              required
            />
          </div>

          <div className="col-md-6 mt-2">
            <label className="form-label">WhatsApp</label>
            <input
              type="tel"
              className="form-control"
              name="WhatsApp"
              value={form.WhatsApp}
              onChange={handleChange}
              maxLength={10}
            />
          </div>

          <div className="col-md-6 mt-2">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="Email"
              value={form.Email}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mt-2">
            <label className="form-label">Address</label>
            <textarea
              className="form-control"
              name="Address"
              value={form.Address}
              onChange={handleChange}
              rows="2"
              required
            />
          </div>

          <div className="col-md-6 mt-2">
            <label className="form-label">Area</label>
            <select
              className="form-select"
              name="Area"
              value={form.Area}
              onChange={handleChange}
              required
            >
              <option value="">Select Area</option>
              {branchInfo?.Areas?.map(area => (
                <option key={area.AreaID} value={area.AreaName}>
                  {area.AreaName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6 mt-2">
            <label className="form-label">City</label>
            <input
              type="text"
              className="form-control"
              name="City"
              value={form.City}
              onChange={handleChange}
              readOnly
            />
          </div>

          <div className="col-md-6 mt-2">
            <label className="form-label">State</label>
            <input
              type="text"
              className="form-control"
              name="State"
              value={form.State}
              onChange={handleChange}
              required
              readOnly
            />
          </div>
          
          <div className="col-md-6 mt-2">
            <label className="form-label">Pincode</label>
            <input
              type="text"
              className="form-control"
              name="PinCode"
              value={form.PinCode}
              onChange={handleChange}
              required
              readOnly
            />
          </div>
        </div>

        <div className="text-end mt-4">
          <button type="submit" className="btn btn-primary">
            Save Address
          </button>
        </div>
      </form>
    </div>
  );
}
