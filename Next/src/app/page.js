'use client';

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; 
import { SearchProvider } from './_context/SearchContext';
import HomeHeader from './_comp/HomeHeader';
import ProductList from './_comp/ProductsList';
import Form from 'react-bootstrap/Form';


export default function Home() {
  return (
    <>
    <SearchProvider>
      <HomeHeader />
      <ProductList />
    </SearchProvider>
    </>
  );
}
