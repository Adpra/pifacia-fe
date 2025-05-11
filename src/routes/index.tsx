import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/Home";
import AppLayout from "../layout/AppLayout";

// Panel Pages
import Home from "../pages/Panel/Dashboard/Home";

// Auth
import SignIn from "../pages/Panel/AuthPages/SignIn";
import SignUp from "../pages/Panel/AuthPages/SignUp";
import NotFound from "../pages/Panel/OtherPage/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import Role from "../pages/Panel/Roles/Role";
import RoleCreate from "../pages/Panel/Roles/RoleCreate";
import RoleEdit from "../pages/Panel/Roles/RoleEdit";

const router = createBrowserRouter([
  // Public Routes
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "*",
    element: <NotFound />,
  },

  // Protected Routes
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <AppLayout />,
        children: [
          {
            path: "/panel",
            element: <Home />,
          },
          // Roles
          {
            path: "/panel/role",
            element: <Role />,
          },
          {
            path: "/panel/role/create",
            element: <RoleCreate />,
          },
          {
            path: "/panel/role/edit/:id",
            element: <RoleEdit />,
          },
        ],
      },
    ],
  },
]);

export default router;
