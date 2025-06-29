'use client';
import React from 'react';
import { Box, Typography, IconButton, Link as MuiLink, Grid } from '@mui/material';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import Link from 'next/link';

const ContactUs = () => {
  const animatedLinkStyle = {
    fontFamily: "'Poppins', sans-serif",
    position: "relative",
    display: "inline-block",
    color: "#000",
    textDecoration: "none",
    transition: "color 0.3s ease",
    "&::after": {
      content: '""',
      position: "absolute",
      width: "0%",
      height: "0.125rem",
      left: 0,
      bottom: 0,
      backgroundColor: "#ffeb3b",
      transition: "width 0.3s ease"
    },
    "&:hover": {
      color: "#0b7c3c",
      "&::after": {
        width: "100%"
      }
    }
  };

  const socialIconStyles = {
    color: "#0b7c3c",
    fontSize: 28,
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.2)",
      color: "#fff"
    }
  };

  const bulbIconStyles = {
    color: "#fff",
    fontSize: 28,
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.2)",
      color: "#f9e03a"
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, width: '100%', minHeight: '100vh', paddingTop: { xs: '5rem', sm: '6rem' }}}>
      
      {/* Left Section */}
      <Box sx={{
        width: { xs: '100%', sm: '50%' },
        height: { xs: 'auto', sm: '100vh' },
        backgroundColor: 'lightgrey',
        borderRadius: { xs: '1.875rem 1.875rem 0 0', sm: '1.875rem 0 0 1.875rem' },
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        boxSizing: 'border-box'
      }}>
        <Typography variant="h4" sx={{
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 100,
          color: '#000',
          textAlign: 'left'
        }}>
          Contact Us
        </Typography>

        <Box sx={{
          background: 'linear-gradient(90deg, #f9e03a 0%, #27a84a 100%)',
          borderRadius: '0.25rem',
          height: '0.5rem',
          width: '7rem',
          margin: '0.938rem 0 1.5rem'
        }} />

        {/* Address Header (Removed Location Icon) */}
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.5rem', color: '#262726', fontWeight: 100 }}>
            Address
          </Typography>
        </Box>

        {/* Address Box */}
        <Box sx={{
          backgroundColor: '#fff',
          padding: { xs: '1rem', sm: '1.5rem', md: '2rem' },
          borderRadius: '0.75rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          fontFamily: 'Montserrat, sans-serif',
          color: '#000',
          lineHeight: 1.8
        }}>
          <Typography variant="body1" sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>
            <strong>Desimati Agri Technologies And Services Private Limited</strong><br /><br />
            <strong>Corporate Address</strong><br />
            Plot No. 380, JDA Scheme 14, Vijay Nagar Road,<br />
            Jabalpur, Madhya Pradesh - 482002
          </Typography>

          <Box mt={3}>
            <Typography variant="body1" sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>
              <strong>Mobile</strong>
            </Typography>
            <MuiLink href="tel:+916261497479" underline="hover" sx={{ ...animatedLinkStyle, fontSize: { xs: '1rem', sm: '1.2rem' }, mt: 0.5 }}>
              <strong>+91 - 6261497479</strong>
            </MuiLink>
          </Box>

          <Box mt={3}>
            <Typography variant="body1" sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>
              <strong>Email</strong>
            </Typography>
            <MuiLink href="mailto:admin@desimati.com" underline="hover" sx={{ ...animatedLinkStyle, fontSize: { xs: '1rem', sm: '1.2rem' }, mt: 0.5 }}>
              <strong>admin@desimati.com</strong>
            </MuiLink>
          </Box>
        </Box>
      </Box>

      {/* Right Section */}
      <Box sx={{
        width: { xs: '100%', sm: '50%' },
        height: { xs: 'auto', sm: '100vh' },
        backgroundColor: '#27A84A',
        borderRadius: { xs: '0 0 1.875rem 1.875rem', sm: '0 1.875rem 1.875rem 0' },
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
      }}>
        <Typography variant="h4" sx={{
          fontWeight: 500,
          fontSize: '2.188rem',
          color: '#fff',
          fontFamily: 'Candara'
        }}>
          Get in Touch
        </Typography>

        <Box sx={{
          background: 'linear-gradient(90deg,rgb(255, 0, 0) 0%, #f9e03a 100%)',
          borderRadius: '4px',
          height: '8px',
          width: '104px',
          margin: '15px 0 20px'
        }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Link href="/website/contact" passHref>
            <IconButton aria-label="Tips" size="large" sx={bulbIconStyles}>
              <TipsAndUpdatesIcon fontSize="inherit" />
            </IconButton>
          </Link>
          <Typography sx={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.5rem', color: '#fff', fontWeight: 100 }}>
            Please Fill out your details
          </Typography>
        </Box>

        <Box component="form" noValidate autoComplete="off" sx={{
          backgroundColor: '#fff',
          padding: { xs: '1rem', sm: '1.5rem', md: '2rem' },
          borderRadius: '0.75rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          fontFamily: 'Montserrat, sans-serif',
          color: '#000',
          lineHeight: 1.8
        }}>
          <Grid container spacing={2} columnGap={13}>
            <Grid item xs={12} sm={6}>
              <label htmlFor="full-name" style={{ display: 'inline-block', marginBottom: '.5rem' }}>
                Full Name
              </label>
              <input type="text" id="full-name" className="form-control" style={{
                background: '#39B55A',
                borderRadius: '29px',
                border: '1px solid #39B55A',
                color: '#fff',
                display: 'block',
                width: '100%',
                padding: '.375rem .75rem',
                fontSize: '1rem'
              }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <label htmlFor="mobile" style={{ display: 'inline-block', marginBottom: '.5rem' }}>
                Mobile Number
              </label>
              <input type="tel" id="mobile" className="form-control" style={{
                background: '#39B55A',
                borderRadius: '29px',
                border: '1px solid #39B55A',
                color: '#fff',
                display: 'block',
                width: '100%',
                padding: '.375rem .75rem',
                fontSize: '1rem'
              }} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default ContactUs;
