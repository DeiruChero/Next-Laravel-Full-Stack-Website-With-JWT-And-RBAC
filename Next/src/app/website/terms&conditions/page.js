'use client'; // Only if using App Router

import * as React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import Image from 'next/image';

const subheading = {
    fontSize: { xs: '1.3rem', sm: '1.6rem' },
    fontWeight: 600,
    mt: '2rem',
    mb: '0.75rem',
    color: '#444',
    fontFamily: 'Candara',
    textAlign: 'left',
    pl: '1rem',
};

const pointheading = {
    fontSize: { xs: '1.2rem', sm: '1.5rem' },
    fontWeight: 549,
    mt: '2rem',
    mb: '0.75rem',
    color: '#444',
    fontFamily: 'Candara',
    textAlign: 'left',
    pl: '1rem',
};

const subSubheading = {
    fontSize: { xs: '1.1rem', sm: '1.2rem' },
    fontWeight: 500,
    mt: '1.5rem',
    mb: '0.5rem',
    color: '#555',
    fontFamily: 'Candara',
    textAlign: 'left',
    pl: '1rem',
};

const animatedLinkStyle = {
    fontFamily: "'Poppins', sans-serif",
    position: 'relative',
    display: 'inline-block',
    color:'#0b7c3c',
    textDecoration: 'none',
    marginLeft: '.4rem',
    transition: 'color 0.3s ease',
    '&::after': {
        content: '""',
        position: 'absolute',
        width: '0%',
        height: '0.125rem',
        left: 0,
        bottom: 0,
        backgroundColor: '#fff',
        transition: 'width 0.3s ease',
    },
    '&:hover': {
        color: '#000',
        '&::after': {
            width: '100%',
        },
    },
};

export default function TermsAndConditions() {
    return (
        <div className='pt-5'>
        <Box
            sx={{
                bgcolor: '#fff',
                p: { xs: '1rem', sm: '1.5rem', md: '2rem' },
                borderRadius: '0.75rem',
                fontFamily: 'Montserrat, sans-serif',
                color: '#000',
                lineHeight: 1.8,
                maxWidth: '100%',
            }}
        >
            <Box sx={{ height: 300, width: '100%', position: 'relative'}}>
                <Image
                    src="/T&C.jpg"
                    alt="Terms & Conditions"
                    layout="fill"
                    objectFit="cover"
                    priority
                />
            </Box>

            <Typography
                variant="h4"
                sx={{
                    mt: 4,
                    fontWeight: 'bold',
                    mb: 3,
                    fontFamily: 'Candara',
                    fontSize: { xs: '1.8rem', sm: '2rem' },
                    textAlign: 'center',
                    color: '#333',
                }}
            >
                Terms and Conditions for www.gharaya.com
            </Typography>

            <Typography sx={subSubheading} paragraph>
                Welcome to www.gharaya.com{' '}
                <strong>(Brand of Desimati Agri Technologies & Services Pvt Ltd)</strong>. By accessing or using our website, you agree to comply with the following Terms and Conditions. Please read them carefully before using our services.
            </Typography>

            {/* SECTION 1 */}
            <Typography sx={subheading} component="h2">
                1. General Terms
            </Typography>
            <Typography sx={subSubheading} component="ul">
                <li style={{ marginBottom: '0.75rem' }}>
                    By using our website, you confirm that you are at least 18 years old or have obtained parental consent.
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                    We reserve the right to update these Terms and Conditions at any time without prior notice. Changes will be effective upon posting.
                </li>
                <li>
                    Your continued use of our website signifies your acceptance of any updates to these terms.
                </li>
            </Typography>

            {/* SECTION 2 */}
            <Typography sx={subheading} component="h2">
                2. Privacy Policy
            </Typography>
            <Typography sx={subSubheading} paragraph>
                We are committed to safeguarding your privacy. Our Privacy Policy explains how we collect, use, disclose, and protect your information. By using our website, you agree to the collection and use of information as described in our Privacy Policy.
            </Typography>

            <Typography sx={pointheading} component="h4">
                2.1 Information We Collect
            </Typography>
            <Typography sx={subSubheading} component="ul">
                <li style={{ marginBottom: '0.75rem' }}>
                    Personal Information: Name, email, phone number, and any other details you provide when registering, subscribing to newsletters, or contacting us.
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                    Non-Personal Information: IP address, browser type, device type, and browsing activity on our site.
                </li>
                <li>
                    Cookies and Tracking Technologies: We may use cookies to enhance your browsing experience. You can modify your browser settings to disable cookies.
                </li>
            </Typography>

            <Typography sx={pointheading} component="h4">
                2.2 How We Use Your Information
            </Typography>
            <Typography sx={subSubheading} paragraph>
                We use the collected information to:
            </Typography>
            <Typography sx={subSubheading} component="ul">
                <li>Operate and maintain our website.</li>
                <li>Improve user experience and services.</li>
                <li>Communicate with you, including newsletters and support responses.</li>
                <li>Ensure security and prevent fraudulent activities.</li>
            </Typography>

            <Typography sx={pointheading} component="h4">
                2.3 Sharing Your Information
            </Typography>
            <Typography sx={subSubheading} paragraph>
                We may share your information:
            </Typography>
            <Typography sx={subSubheading} component="ul">
                <li>With trusted service providers assisting in site operations.</li>
                <li>To comply with legal requirements.</li>
                <li>In case of a business merger, sale, or acquisition.</li>
            </Typography>

            <Typography sx={pointheading} component="h4">
                2.4 Security Measures
            </Typography>
            <Typography sx={subSubheading} paragraph>
                We implement reasonable security measures to protect your data but cannot guarantee complete security due to the nature of internet communications.
            </Typography>

            <Typography sx={pointheading} component="h4">
                2.5 Third-Party Links
            </Typography>
            <Typography sx={subSubheading} paragraph>
                Our website may contain links to third-party sites. We encourage you to read the privacy policies of any third-party sites you visit.
            </Typography>

            {/* SECTION 3 */}
            <Typography sx={subheading} component="h2">
                3. Return and Refund Policy
            </Typography>
            <Typography sx={subSubheading} paragraph>
                At Gharaya <strong>(Brand of Desimati Agri Technologies & Services Pvt Ltd)</strong>, we strive to deliver the freshest and highest quality fruits and vegetables. If you are unsatisfied with your purchase, please refer to our return policy for assistance.
            </Typography>

            <Typography sx={pointheading} component="h4">
                3.1 Freshness Guarantee
            </Typography>
            <Typography sx={subSubheading} component="ul">
                <li>
                    If you receive produce that does not meet our freshness standards, notify us within 24 hours of receipt for a full refund or replacement.
                </li>
            </Typography>

            <Typography sx={pointheading} component="h4">
                3.2 Eligibility for Returns
            </Typography>
            <Typography sx={subSubheading} component="ul">
                <li>Returns must be requested within 24 hours of delivery (for online orders) or on the same day (for in-store purchases).</li>
                <li>Items must be unused, in original packaging, and accompanied by proof of purchase.</li>
                <li>Perishable items that have been consumed, opened, or damaged post-delivery are not eligible for returns.</li>
            </Typography>

            <Typography sx={pointheading} component="h4">
                3.3 Damaged or Incorrect Items
            </Typography>
            <Typography sx={subSubheading} component="ul">
                <li>If you receive damaged or incorrect items, contact our support team with clear photographs within 24 hours.</li>
                <li>We will arrange a refund, replacement, or store credit based on the issue.</li>
                <li>Refunds will be processed within 7-10 business days to the original payment method.</li>
            </Typography>

            <Typography sx={pointheading} component="h4">
                3.4 Non-Returnable Items
            </Typography>
            <Typography sx={subSubheading} component="ul">
                <li>Fresh-cut or pre-packaged fruits and vegetables.</li>
                <li>Items that have been opened or consumed.</li>
            </Typography>

            <Typography sx={pointheading} component="h4">
                3.5 Order Cancellation
            </Typography>
            <Typography sx={subSubheading} component="ul">
                <li>Orders must be cancelled within 1 hour of placement.</li>
            </Typography>
            <Typography sx={subheading} component="h2">
                4. User Conduct
            </Typography>

            <Typography sx={subSubheading} variant="body1" paragraph>
                By using our website, you agree not to:
            </Typography>
            <Typography sx={subSubheading} component="ul">
                <li style={{ marginBottom: '0.75rem' }}>
                    Use our site for any illegal purpose.
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                    Interfere with or disrupt site functionality.
                </li>
                <li>
                    Attempt to gain unauthorized access to our systems.
                </li>
            </Typography>
            <Typography sx={subheading} component="h2">
                5. Limitation of Liability
            </Typography>
            <Typography sx={subSubheading} component="ul">
                <li style={{ marginBottom: '0.75rem' }}>
                    Gharaya <strong>(Brand of Desimati Agri Technologies & Services Pvt Ltd)</strong> is not responsible for any indirect, incidental, or consequential damages resulting from the use of our website or products.
                </li>
                <li>
                    We do not guarantee uninterrupted service or error-free access to our website.
                </li>
            </Typography>
            <Typography sx={subheading} component="h2">
                6. Intellectual Property
            </Typography>
            <Typography sx={subSubheading} component="ul">
                <li>
                    All website content, including text, images, logos, and trademarks, is the property of Gharaya <strong>(Brand of Desimati Agri Technologies & Services Pvt Ltd)</strong> and may not be copied, distributed, or modified without prior permission.
                </li>
            </Typography>

            <Typography sx={subheading} component="h2">
                7. Governing Law
            </Typography>
            <Typography sx={subSubheading} component="ul">
                <li style={{ marginBottom: '0.75rem' }}>
                    These Terms and Conditions shall be governed and construed in accordance with the laws of India.
                </li>
                <li>
                    Any disputes arising shall be resolved through arbitration or the appropriate legal authorities in Jabalpur (MP).
                </li>
            </Typography>
            <Typography sx={subheading} component="h2">
                8. Contact Us
            </Typography>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '0.75rem' }}>
                    <Typography sx={subSubheading}>
                        <Grid item>
                            Email:
                            <Box component="a" href="mailto:admin@desimati.com" sx={animatedLinkStyle}>
                                <b>admin@desimati.com</b>
                            </Box>
                        </Grid>
                    </Typography>
                </li>
                <li>
                    <Typography sx={subSubheading}>
                        <Grid item>
                            Phone:
                            <Box component="a" href="tel:+916261497479" sx={animatedLinkStyle}>
                                <b>+91 - 6261497479</b>
                            </Box>
                        </Grid>
                    </Typography>
                </li>
            </ul>

            <Typography
                variant="h4"
                sx={{
                    fontFamily: 'Candara',
                    fontSize: { xs: '1.6rem', sm: '1.5rem' },
                    marginBottom: '1rem',
                    marginTop: '2rem',
                    textAlign: 'center',
                    color: '#333',
                }}
            >
                Thank you for choosing Gharaya for your fresh grocery needs!
            </Typography>
        </Box>
        </div>
    );
}
