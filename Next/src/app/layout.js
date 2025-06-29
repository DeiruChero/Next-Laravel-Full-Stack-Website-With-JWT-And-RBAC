// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import { CartProvider } from "./_context/CartContext";
import MainLayout from "./_components/MainLayout";
import { AuthProvider } from "./_context/AuthContext";
import 'bootstrap-icons/font/bootstrap-icons.css'; 
import { LocationProvider } from "./_context/LocationContext";
import Form from 'react-bootstrap/Form';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Gharaya - Online Vegetables & Fruits Delivery",
  description: "Freshness delivered right to your doorstep! Gharaya brings you the finest selection of farm-fresh vegetables and fruits, sourced directly from trusted local farmers. Enjoy hassle-free online shopping, speedy delivery, and unbeatable quality every time. Eat healthy, live happy with Gharaya!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} style={{ fontFamily: 'Roboto, sans-serif' }}>
        <LocationProvider>
        <AuthProvider>
          <CartProvider>
            <MainLayout>{children}</MainLayout>
          </CartProvider>
        </AuthProvider>
        </LocationProvider>
      </body>
    </html>
  );
}
