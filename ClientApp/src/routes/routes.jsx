import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/RegisterPage";
import CreateQuestion from "../pages/CreateQuestion";

import { Layout } from "../components/main/layout";

const AppRouter = () => {

    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/createQuestion" element={<CreateQuestion />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    )
}

export default AppRouter;