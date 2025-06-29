import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Grid, Link } from '@mui/material';

const animatedLinkStyle = {
  fontFamily: 'Candara',
  position: 'relative',
  display: 'inline-block',
  color: '#000',
  textDecoration: 'none',
  transition: 'color 0.3s ease',
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '0%',
    height: '0.125rem',
    left: 0,
    bottom: 0,
    backgroundColor: '#ffeb3b',
    transition: 'width 0.3s ease',
  },
  '&:hover': {
    color: '#1e8c42',
    '&::after': {
      width: '100%',
    },
  },
};

const ReturnRefund = () => {
  return (
    <>
      <div className="container-fluid" style={{ fontFamily: 'Candara', paddingTop: '6rem' }}>
        <div className="row justify-content-center mb-4">
          <div className="col-12 col-md-10">
            <img
              src="/refund.jpg"
              alt="main wallpaper"
              className="img-fluid rounded w-100"
              style={{ maxHeight: '17rem', objectFit: 'cover' }}
            />
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-12 col-md-10 text-start">
            <h2 className="mb-3">Return Policy for www.gharaya.com</h2>
            <p>
              At Gharaya <b>(Brand of Desimati Agri technologies & Services Pvt Ltd)</b>,
              we are committed to providing our customers with the freshest and highest
              quality fruits and vegetables. We understand that sometimes situations may
              arise where you need to return or exchange a product. To ensure that your
              shopping experience with us is smooth and hassle-free, please take a moment
              to review our return policy.
            </p>

            <h4 className="mt-3">1. Freshness Guarantee</h4>
            <p>
              We take great pride in sourcing and delivering the freshest fruits and
              vegetables directly to your doorstep. In the unlikely event that you receive
              any product that does not meet our freshness standards, please notify us
              within 24 hours of receipt for a full refund or replacement.
            </p>

            <h4 className="mt-3">2. Eligibility for Returns</h4>
            <p>To be eligible for a return or exchange, the following conditions must be met:</p>
            <ul>
              <li>The item must be returned within 24 hours of delivery (for online orders) or within the same day (for in-store purchases).</li>
              <li>The item must be unused and in its original packaging.</li>
              <li>You must have proof of purchase (receipt, invoice, or order confirmation).</li>
              <li>Please note that due to the perishable nature of fruits and vegetables, we cannot accept returns for items that have been consumed, opened, or damaged after delivery or purchase.</li>
            </ul>

            <h4 className="mt-3">3. Damaged or Spoiled Goods</h4>
            <p>
              In the case that you receive damaged or spoiled produce, please take clear
              photographs of the affected items and contact our customer support team
              immediately. We will work with you to arrange for a refund, replacement, or
              store credit based on the severity of the issue. Refunds will only be provided
              for damaged or spoiled goods that fall within our return window (24 hours).
            </p>

            <h3 className="mt-4">4. Incorrect Items</h3>
            <p>
              If we send you the wrong items by mistake, we sincerely apologize for the
              inconvenience caused. Please notify us within 24 hours of receiving the wrong
              order. You will be eligible for a full refund or an exchange for the correct
              items. The incorrect items must be returned in their original condition for
              the return process to be completed.
            </p>

            <h3 className="mt-4">5. Non-Returnable Items</h3>
            <p>Certain items are non-returnable due to hygiene reasons. These include, but are not limited to:</p>
            <ul>
              <li>Any products that have been opened or consumed.</li>
            </ul>

            <h3 className="mt-4">6. How to Process a Return</h3>
            <p>To initiate a return or exchange, please follow these simple steps:</p>
            <ul>
              <li>Contact our customer support team at <b><Link href="mailto:admin@desimati.com" underline="hover" color="#fff" sx={animatedLinkStyle}>admin@desimati.com </Link></b> or call us at <b><Link href="tel:+916261497479" underline="hover" color="#fff" sx={animatedLinkStyle}>+91-6261497479</Link></b></li>
              <li>Provide your order details, including the order number, and describe the issue.</li>
              <li>If applicable, share any photographs of the damaged or incorrect items.</li>
              <li>Our team will guide you through the return or replacement process.</li>
            </ul>

            <h3 className="mt-4">7. Refunds and Store Credits</h3>
            <p>For order cancellation, order must be cancelled within 1 hour of order placement.</p>

            <h3 className="mt-4">8. Order Cancellation</h3>
            <p>For order cancellation, order must be cancelled within 1 hour of order placement.</p>

            <h3 className="mt-4">9. Contact Us</h3>
            <p>
              If you have any questions about our return policy or need assistance, please don’t hesitate to contact us at:
            </p>
            <ul className="text">
              <Grid item>
                Email: 
                <Link href="mailto:admin@desimati.com" underline="hover" color="#fff" sx={animatedLinkStyle}>
                  <b style={{marginLeft: '.4rem'}}>admin@desimati.com</b>
                </Link>
                <br />
              </Grid>
              <Grid item>
                Phone: 
                <Link href="tel:+916261497479" underline="hover" color="#fff" sx={animatedLinkStyle}>
                  <b style={{marginLeft: '.4rem'}}>+91 - 6261497479</b>
                </Link>
              </Grid>
            </ul>
            <p>
              We appreciate your business and strive to ensure your satisfaction with every order.
              Thank you for choosing Gharaya for your fresh produce needs!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReturnRefund;
