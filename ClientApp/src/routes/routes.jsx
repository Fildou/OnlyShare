﻿import React, {useContext} from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/RegisterPage";
import CreateQuestion from "../pages/CreateQuestion";
import LoginPage from "../pages/LoginPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import QuestionDetailPage from "../pages/QuestionDetailPage";
import ProfilePage from "../pages/ProfilePage";

import { Layout } from "../components/main/layout";
import { AuthProvider } from "../middleware/authContext";
import EditQuestion from "../pages/EditQuestion";
import MainPage from "../pages/MainPage";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Layout>
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/questions" element={<HomePage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/createQuestion" element={<CreateQuestion />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/post/:postId" element={<QuestionDetailPage />} />
                        <Route path="/comment/:commentId" element={<QuestionDetailPage />} />
                        <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                        <Route path="/profile/:userId" element={<ProfilePage />} />
                        <Route path="/postEdit/:postId" element={<EditQuestion />} />
                    </Routes>
                </Layout>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default AppRouter;