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
import SettingsPage from "./Pages/Settings.page.jsx";
import ConnectionPage from "./Pages/Connection.page.jsx";
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
        element: <ConnectionPage />,
      },
      {
        path: "/jobs",
        element: <JobPage />,
      },
      {
        path: "/profile/:username",
        element: <MyProfilePage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
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
