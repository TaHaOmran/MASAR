import React from 'react'
import style from './ProtectedRoute.module.css'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
    // البحث عن التوكن في الكاش الدائم أو المؤقت فوراً
    const token = localStorage.getItem("accessToken") || 
        localStorage.getItem("token") || 
        sessionStorage.getItem("accessToken") || 
        sessionStorage.getItem("token");

    if (token) {
        return children;
    } else {
        return <Navigate to="/login" replace={true} />;
    }
}