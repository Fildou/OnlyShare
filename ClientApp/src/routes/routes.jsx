import React from "react";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/RegisterPage";

import { Layout } from "../components/main/layout";

const router = createBrowserRouter({
  routes: [
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "/register",
                element: <RegisterPage />,
            },
        ],
    },
  ]
});

const AppRouter = () => {

    return (
        <RouterProvider router={router} />
    )
}

export default AppRouter;