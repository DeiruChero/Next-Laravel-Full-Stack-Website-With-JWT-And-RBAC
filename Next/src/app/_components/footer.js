'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Grid, Typography, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useTheme } from '@mui/material/styles';

const Footer = () => {
  const theme = useTheme();

  const socialIconStyles = {
    color: '#fff',
    fontSize: 28,
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.2)',
      color: '#fff',
    },
  };

  const animatedLinkStyle = {
    fontFamily: "'Poppins', sans-serif",
    position: 'relative',
    display: 'inline-block',
    color: '#fff',
    textDecoration: 'none',
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
      color: '#ffeb3b',
      '&::after': {
        width: '100%',
      },
    },
  };

  return (
    <Box
      sx={{
        position: 'relative',
        color: '#fff',
        p: { xs: 2, md: 5 },
        mt: '2rem',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#26a649',
          backgroundImage: 'linear-gradient(327deg,#1e8c42 0%, #0b7c3c 74%)',
          borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
          transform: 'scaleX(1.5)',
          zIndex: 0,
        },
        [theme.breakpoints.down('sm')]: {
          '&::before': {
            borderRadius: '100% 100% 0 0 / 40% 40% 0 0',
            transform: 'scaleX(1.4)',
          },
        },
        '& > *': {
          position: 'relative',
          zIndex: 1,
        },
      }}
    >
      <Grid container spacing={2} maxWidth="lg">
        {/* Logo Section - Hidden on small screens */}
        <Grid item xs={12} md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Image
            src="/gharayalogo2-removebg-preview.png"
            alt="Gharaya.com logo"
            width={200}
            height={80}
            style={{ cursor: 'pointer', transition: 'transform 0.3s ease-in-out' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
          <Typography variant="body2" sx={{ mb: 2 }} color="#fff">
            Your trusted source for fresh, farm-to-home products.
          </Typography>

          <Link href="mailto:admin@desimati.com" style={{ textDecoration: 'none' }}>
            <Box sx={animatedLinkStyle}>
              <b>admin@desimati.com</b>
            </Box>
          </Link>

          <Link href="tel:+916261497479" style={{ textDecoration: 'none' }}>
            <Box sx={animatedLinkStyle}>
              <b>+91 - 6261497479</b>
            </Box>
          </Link>
        </Grid>

        {/* Menu and Customer Services */}
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            textAlign: { xs: 'center', md: 'left' }, // center text on mobile, left on desktop
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', md: 'flex-start' }, // center items on mobile, left on desktop
          }}
        >
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={{ xs: 1, md: 4 }}
            width="100%"
          >
            {/* Menu Section (Hidden on xs) */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '1rem',
                  color: '#fff',
                  mb: 1,
                }}
              >
                Menu
              </Typography>
              <Box display="flex" flexDirection="row" flexWrap="wrap" gap={2}>
                <Link href="/" style={{ textDecoration: 'none' }}>
                  <Box sx={animatedLinkStyle}>Home |</Box>
                </Link>
                <Link href="/website/about" style={{ textDecoration: 'none' }}>
                  <Box sx={animatedLinkStyle}>About Us |</Box>
                </Link>
                <Link href="/website/contact" style={{ textDecoration: 'none' }}>
                  <Box sx={animatedLinkStyle}>Contact Us |</Box>
                </Link>
                <Link href="/website/faq" style={{ textDecoration: 'none' }}>
                  <Box sx={animatedLinkStyle}>FAQs</Box>
                </Link>
              </Box>
            </Box>

            {/* Customer Services - Always Visible */}
            <Box>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '1rem',
                  color: '#fff',
                  mb: 1,
                  display: { xs: 'none', md: 'flex' },
                }}
              >
                Customer Services
              </Typography>
              <Box
                display="flex"
                flexDirection="row"
                flexWrap="wrap"
                gap={2}
                sx={{
                  textAlign: { xs: 'center' }, // center text on mobile
                  display: { xs: 'flex', md: 'flex' },
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  alignItems: { xs: 'center' },
                }}
              >
                <Link href="/website/terms&conditions" style={{ textDecoration: 'none' }}>
                  <Box sx={animatedLinkStyle}>Terms & Conditions |</Box>
                </Link>
                <Link href="/website/privacypolicy" style={{ textDecoration: 'none' }}>
                  <Box sx={animatedLinkStyle}>Privacy Policy |</Box>
                </Link>
                <Link href="/website/refund" style={{ textDecoration: 'none' }}>
                  <Box sx={animatedLinkStyle}>Refund Policy</Box>
                </Link>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Connect With Us Section */}
        <Grid
          item
          xs={12}
          md={3}
          sx={{
            textAlign: { xs: 'center', md: 'left' }, // center text on mobile, left on desktop
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            alignItems: { xs: 'center', md: 'flex-start' }, // center on mobile, left on desktop
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '1rem',
              color: '#fff',
              mb: 1,
            }}
          >
            Connect With Us
          </Typography>

          {/* Social Icons */}
          <Box display="flex" flexWrap="wrap" alignItems="center" sx={{ mb: 1 }}>
            <IconButton
              href="https://www.facebook.com/desimatijabalpur/"
              target="_blank"
              rel="noopener noreferrer"
              sx={socialIconStyles}
            >
              <FacebookIcon fontSize="inherit" />
            </IconButton>
            <IconButton href="#" sx={socialIconStyles}>
              <InstagramIcon fontSize="inherit" />
            </IconButton>
            <IconButton href="#" sx={socialIconStyles}>
              <LinkedInIcon fontSize="inherit" />
            </IconButton>
          </Box>

          {/* App Download Links */}
          <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
            <Link
              href="https://play.google.com/store/apps/details?id=co.median.android.kpeknb&pcampaignid=web_share"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/playstorelogo.png"
                alt="Download on Play Store"
                width={120}
                height={50}
                style={{ cursor: 'pointer', transition: 'transform 0.3s ease-in-out' }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              />
            </Link>
            <Link
              href="https://apps.apple.com/in/app/gharaya/id6739162919"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/applelogo.png"
                alt="Download on App Store"
                width={120}
                height={50}
                style={{ cursor: 'pointer', transition: 'transform 0.3s ease-in-out' }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              />
            </Link>
          </Box>
        </Grid>
      </Grid>

      {/* Footer Bottom */}
      <Box textAlign="center" pt={2} mt={2} borderTop="0.063rem solid #ddd">
        <Typography variant="body2" color="#fff">
          © {new Date().getFullYear()} Gharaya. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
