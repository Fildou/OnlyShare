import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";

import { Layout } from "../components/main/layout";
import { AuthProvider } from "../middleware/authContext";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Layout>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                    </Routes>
                </Layout>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default AppRouter;