'use client';

import ChangePassword from "@/app/_comp/Changepassword";
import MyAddress from "@/app/_comp/Myaddress";
import YourAccountDetails from "@/app/_comp/YourAccountDetails";
import YourOrders from "@/app/_comp/YourOrders";
import Link from "next/link";
import { useState } from "react";

const MyAccountPage = () => {
  // ✅ Set default to show orders initially
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showOrders, setShowOrders] = useState(true); // ✅ Default true

  return (
    <div className="container mt-5 pt-5">
      <div
        className="row text-center text-white p-3"
        style={{ backgroundColor: '#643C64' }}
      >
        <div className="col-2">
          <h6
            className="text-center  cursor-pointer"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setShowOrders(true);
              setShowAddress(false);
              setShowAccount(false);
              setShowChangePassword(false);
            }}
          >
        <i className="bi bi-list-ol"></i> My Orders
          </h6>
        </div>

        <div className="col-2">
          <h6
            className="text-center  cursor-pointer"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setShowAddress(true);
              setShowAccount(false);
              setShowOrders(false);
              setShowChangePassword(false);
            }}
          >
           <i className="bi bi-house-add"></i> My Address
          </h6>
        </div>

        <div className="col-2">
          <h6 className="text-center bi bi-person-circle"
          style={{ cursor: 'pointer'}}
          onClick={() => {
            setShowAccount(true);
            setShowAddress(false);
            setShowOrders(false);
            setShowChangePassword(false);
          }}
          > Account Details</h6>
        </div>

        <div className="col-3">
          <h6
            className="text-center bi bi-file-earmark-lock2 cursor-pointer"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setShowChangePassword(true);
              setShowAccount(false);
              setShowOrders(false);
              setShowAddress(false);
            }}
          >
            Change Password
          </h6>
        </div>

        <div className="col-2">
          <Link href="/" className="text-decoration-none text-white">
            <h6 className="text-center bi bi-cart-dash"> Continue Shopping</h6>
          </Link>
        </div>
      </div>

      {/* Conditional Renders */}
      {showOrders && <YourOrders />}
      {showChangePassword && <ChangePassword />}
      {showAddress && <MyAddress />}
      {showAccount && <YourAccountDetails />}
    </div>
  );
};

export default MyAccountPage;
