import { Grid, Link, Typography } from '@mui/material';
import NextLink from 'next/link';

// Animated link style
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

const PrivacyPolicy = () => (
  <div className="container-fluid" style={{ fontFamily: 'Candara',paddingTop: '7rem' }}>
    <div className="row justify-content-center mb-4">
      <div className="col-12 col-md-10">
        <img
          src="/privacypolicy.jpg"
          alt="main wallpaper"
          className="img-fluid rounded w-100"
          style={{ maxHeight: '17rem', objectFit: 'cover'  }}
        />
      </div>
    </div>

    <div className="row justify-content-center ">
      <div className="col-12 col-md-10 text-start">
        <Typography variant="h4" gutterBottom style={{fontFamily: 'Candara'}}>
          Privacy Policy for www.gharaya.com
        </Typography>
        <Typography variant="body1" paragraph style={{fontFamily: 'Candara'}}>
          Welcome to www.gharaya.com <b>(Brand of Desimati Agri Technologies & Services Pvt Ltd)</b>. This Privacy
          Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
        </Typography>

        <Typography variant="h5" gutterBottom style={{fontFamily: 'Candara'}}>
          Information We Collect
        </Typography>
        
        <Typography variant="h6" gutterBottom style={{fontFamily: 'Candara'}}>
          1. Personal Information
        </Typography>
        <Typography variant="body1" paragraph style={{fontFamily: 'Candara'}}>
          We may collect personal information such as your name, email address, phone number, and any other
          information you provide when you register on the Site, subscribe to our newsletter, or contact us.
        </Typography>

        <Typography variant="h5" gutterBottom style={{fontFamily: 'Candara'}}>
          2. Non-Personal Information
        </Typography>
        <Typography variant="body1" paragraph style={{fontFamily: 'Candara'}}>
          We may collect non-personal information such as your IP address, browser type, device type, and
          information about your visit to the Site, including the pages you view and the links you click.
        </Typography>

        <Typography variant="h5" gutterBottom style={{fontFamily: 'Candara'}}>
          3. Cookies and Tracking Technologies
        </Typography>
        <Typography variant="body1" paragraph style={{fontFamily: 'Candara'}}>
          We may use cookies and similar tracking technologies to collect information about your interaction with the
          Site. You can choose to disable cookies through your browser settings.
        </Typography>

        <Typography variant="h5" gutterBottom style={{fontFamily: 'Candara'}}>
          How We Use Your Information
        </Typography>
        <Typography variant="body1" paragraph style={{fontFamily: 'Candara'}}>
          We use the information we collect for various purposes, including:
        </Typography>
        <ul>
          <li>To operate and maintain the Site</li>
          <li>To improve our website and services</li>
          <li>To personalize your experience on the Site</li>
          <li>To communicate with you, including sending newsletters or updates</li>
          <li>To respond to your inquiries and provide customer support</li>
          <li>To detect, prevent, and address technical issues</li>
        </ul>

        <Typography variant="h5" gutterBottom style={{fontFamily: 'Candara'}}>
          How We Share Your Information
        </Typography>
        <Typography variant="body1" paragraph style={{fontFamily: 'Candara'}}>
          We may share your information in the following situations:
        </Typography>
        <ul>
          <li>With Service Providers: We may share information with third-party vendors, service providers, or contractors who perform services on our behalf.</li>
          <li>For Legal Reasons: We may disclose information if required by law or in response to valid requests by public authorities.</li>
          <li>Business Transfers: We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, or acquisition.</li>
        </ul>

        <Typography variant="h5" gutterBottom style={{fontFamily: 'Candara'}}>
          Security of Your Information
        </Typography>
        <Typography variant="body1" paragraph style={{fontFamily: 'Candara'}}>
          We take reasonable measures to protect the security of your personal information. However, no method of transmission over the internet or method of electronic storage is 100% secure, and we cannot guarantee its absolute security.
        </Typography>

        <Typography variant="h5" gutterBottom style={{fontFamily: 'Candara'}}>
          Third-Party Websites
        </Typography>
        <Typography variant="body1" paragraph style={{fontFamily: 'Candara'}}>
          Our Site may contain links to third-party websites. This Privacy Policy does not apply to those sites. We encourage you to read their privacy policies.
        </Typography>

        <Typography variant="h5" gutterBottom style={{fontFamily: 'Candara'}}>
          Your Privacy Rights
        </Typography>
        <Typography variant="body1" paragraph style={{fontFamily: 'Candara'}}>
          Depending on your location, you may have rights regarding your personal information, such as the right to access, correct, or delete your data. To exercise these rights, please contact us using the information below.
        </Typography>

        <Typography variant="h5" gutterBottom style={{fontFamily: 'Candara'}}>
          Children's Privacy
        </Typography>
        <Typography variant="body1" paragraph style={{fontFamily: 'Candara'}}>
          Our Site is not intended for children under the age of 13. We do not knowingly collect personal information from them. If we learn we have, we will delete it.
        </Typography>

        <Typography variant="h5" gutterBottom style={{fontFamily: 'Candara'}}>
          Changes to This Privacy Policy
        </Typography>
        <Typography variant="body1" paragraph style={{fontFamily: 'Candara'}}>
          We may update this Privacy Policy from time to time. We will notify you of changes by posting the new version on this page.
        </Typography>

        <Typography variant="h5" gutterBottom style={{fontFamily: 'Candara'}}>
          Contact Us
        </Typography>
        <Typography variant="body1" paragraph style={{fontFamily: 'Candara'}}>
          If you have any questions or concerns about this Privacy Policy, please contact us at:
        </Typography>
        <Grid item>
          <Link href="mailto:ashish@desimati.com" underline="hover" color="#fff" sx={animatedLinkStyle}>
            <b>ashish@desimati.com</b>
          </Link>
        </Grid>
      </div>
    </div>
  </div>
);

export default PrivacyPolicy;
