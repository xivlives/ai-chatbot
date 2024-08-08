'use client';

import React from 'react';
import { Box } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Register from '../components/Register';

export default function Home() {
  return (
    <>
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header/>
      <Register />
      <Footer />
      </Box>
    </>
  );
}