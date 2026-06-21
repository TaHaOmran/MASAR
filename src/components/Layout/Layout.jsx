import React from 'react'
import style from './Layout.module.css'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import ScrollToTop from '../ScrollToTop'

export default function Layout() {
        const location = useLocation();
        const hideNavbar = ['/login', '/signup', '/forget-password', '/reset-password', '/change-password'].includes(location.pathname);

        

        return (
            
            <div className="min-h-screen flex flex-col">
                <ScrollToTop />
                {!hideNavbar && <Navbar />}

                <main className="flex-1">
                    <Outlet />
                </main>

                {!hideNavbar && <Footer />}
            </div>
        );
}