import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ReactDom from "react-dom/client";
import App from "./App.jsx";
import MainPage from "./Pages/Main.page.jsx";
import HomePage from "./Pages/Home.page.jsx";
import SignupPage from "./Pages/SignUp.page.jsx";
import LoginPage from "./Pages/Login.page.jsx";
import MyProfilePage from "./Pages/MyProfile.page.jsx";
import JobPage from "./Pages/Job.page.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <MainPage />,
      },
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/companies",
        element: <MainPage />,
      },
      {
        path: "/connections",
        element: <MainPage />,
      },
      {
        path: "/jobs",
        element: <JobPage />,
      },
      {
        path: "/profile",
        element: <MyProfilePage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
]);

ReactDom.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
