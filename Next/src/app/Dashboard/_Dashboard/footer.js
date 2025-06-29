// app/components/Footer.tsx or /components/Footer.tsx
'use client';

import * as React from 'react';
import Image from 'next/image';
import NextLink from 'next/link';
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
                p: 4,
                mt: '3rem',
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
            <Grid container spacing={4} maxWidth="lg" margin="auto">
                {/* Logo */}
                <Grid item xs={12} md={3}>
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
                    <Box>
                        <IconButton
                            href="https://www.facebook.com/desimatijabalpur/"
                            target="_blank"
                            aria-label="Facebook"
                            size="large"
                            sx={socialIconStyles}
                        >
                            <FacebookIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton href="#" aria-label="Instagram" size="large" sx={socialIconStyles}>
                            <InstagramIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton href="#" aria-label="LinkedIn" size="large" sx={socialIconStyles}>
                            <LinkedInIcon fontSize="inherit" />
                        </IconButton>
                    </Box>
                    <a
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
                    </a>
                    <a
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
                    </a>
                </Grid>

                {/* Menu Links */}
                <Grid item xs={6} sm={6} md={3}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.3rem', color: '#fff', textTransform: 'uppercase' }}>
                        Menu
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={1}>
                        <Grid><NextLink href="/website/product" passHref>
                            <Box component="a" sx={animatedLinkStyle}>Home</Box>
                        </NextLink></Grid>
                        <Grid><NextLink href="/website/about" passHref>
                            <Box component="a" sx={animatedLinkStyle}>About Us</Box>
                        </NextLink></Grid>
                        <Grid><NextLink href="/website/contact" passHref>
                            <Box component="a" sx={animatedLinkStyle}>Contact Us</Box>
                        </NextLink></Grid>
                        <Grid><NextLink href="/website/faq" passHref>
                            <Box component="a" sx={animatedLinkStyle}>FAQs</Box>
                        </NextLink></Grid>
                    </Box>
                </Grid>

                {/* Customer Services */}
                <Grid item xs={6} sm={6} md={3}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.3rem', color: '#fff', textTransform: 'uppercase' }}>
                        Customer Services
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={1}>
                        <Grid><NextLink href="/website/faq" passHref>
                            <Box component="a" sx={animatedLinkStyle}>FAQs</Box>
                        </NextLink></Grid>
                        <Grid><NextLink href="/website/terms&conditions" passHref>
                            <Box component="a" sx={animatedLinkStyle}>Terms & Conditions</Box>
                        </NextLink></Grid>
                        <Grid><NextLink href="/website/privacypolicy" passHref>
                            <Box component="a" sx={animatedLinkStyle}>Privacy Policy</Box>
                        </NextLink></Grid>
                        <Grid><NextLink href="/website/refund" passHref>
                            <Box component="a" sx={animatedLinkStyle}>Refund Policy</Box>
                        </NextLink></Grid>
                    </Box>
                </Grid>

                {/* Contact */}
                <Grid item xs={6} md={3} gap={1}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.3rem', color: '#fff', textTransform: 'uppercase' }}>
                        Contact Us
                    </Typography>
                    <Box>
                        <Box component="a" href="mailto:admin@desimati.com" sx={animatedLinkStyle}>
                            <b>admin@desimati.com</b>
                        </Box>
                        <Box component="a" href="tel:+916261497479" sx={animatedLinkStyle}>
                            <b>+91 - 6261497479</b>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            {/* Footer Bottom Text */}
            <Box textAlign="center" pt={2} mt={2} borderTop="0.063rem solid #ddd">
                <Typography variant="body2" color="#fff">
                    © {new Date().getFullYear()} Gharaya. All Rights Reserved.
                </Typography>
            </Box>
        </Box>
    );
};

export default Footer;
