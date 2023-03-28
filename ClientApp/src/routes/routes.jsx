import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/RegisterPage";
import CreateQuestion from "../pages/CreateQuestion";
import LoginPage from "../pages/LoginPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";



import { Layout } from "../components/main/layout";

const AppRouter = () => {

    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/createQuestion" element={<CreateQuestion />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    )
}

export default AppRouter;