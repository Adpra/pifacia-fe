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
import User from "../pages/Users/User";
import UserCreate from "../pages/Users/UserCreate";
import UserEdit from "../pages/Users/UserEdit";
import RequireAdmin from "../components/auth/RequireAdmin";
import Unauthorized from "../pages/Panel/OtherPage/Unauthorized";
import LeaveType from "../pages/Panel/LeaveTypes/LeaveType";
import LeaveTypeCreate from "../pages/Panel/LeaveTypes/LeaveTypeCreate";
import LeaveTypeEdit from "../pages/Panel/LeaveTypes/LeaveTypeEdit";
import LeaveRequest from "../pages/Panel/LeaveRequests/LeaveRequest";
import LeaveRequestCreate from "../pages/Panel/LeaveRequests/LeaveRequestCreate";
import LeaveRequestEdit from "../pages/Panel/LeaveRequests/LeaveRequestEdit";
import LeaveRequestDetail from "../pages/Panel/LeaveRequests/LeaveRequestDetail";
import LeaveApproval from "../pages/Panel/LeaveApprovals/LeaveApproval";
import LeaveApprovalRequest from "../pages/Panel/LeaveApprovals/LeaveApprovalRequest";
import LeaveApprovalEdit from "../pages/Panel/LeaveApprovals/LeaveApprovalEdit";

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
  {
    path: "/unauthorized",
    element: <Unauthorized />,
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
          // Users
          {
            path: "/panel/user",
            element: (
              <RequireAdmin>
                <User />
              </RequireAdmin>
            ),
          },
          {
            path: "/panel/user/create",
            element: (
              <RequireAdmin>
                <UserCreate />
              </RequireAdmin>
            ),
          },
          {
            path: "/panel/user/edit/:id",
            element: (
              <RequireAdmin>
                <UserEdit />
              </RequireAdmin>
            ),
          },
          // Leave Types
          {
            path: "/panel/leave-type",
            element: (
              <RequireAdmin>
                <LeaveType />
              </RequireAdmin>
            ),
          },
          {
            path: "/panel/leave-type/create",
            element: (
              <RequireAdmin>
                <LeaveTypeCreate />
              </RequireAdmin>
            ),
          },
          {
            path: "/panel/leave-type/edit/:id",
            element: (
              <RequireAdmin>
                <LeaveTypeEdit />
              </RequireAdmin>
            ),
          },

          // Leave Request
          {
            path: "/panel/leave-request",
            element: <LeaveRequest />,
          },
          {
            path: "/panel/leave-request/create",
            element: <LeaveRequestCreate />,
          },
          {
            path: "/panel/leave-request/edit/:id",
            element: <LeaveRequestEdit />,
          },
          {
            path: "/panel/leave-request/detail/:id",
            element: <LeaveRequestDetail />,
          },

          // Leave Approval
          {
            path: "/panel/leave-approval",
            element: (
              <RequireAdmin>
                <LeaveApproval />
              </RequireAdmin>
            ),
          },
          {
            path: "/panel/leave-approval/edit/:id",
            element: (
              <RequireAdmin>
                <LeaveApprovalEdit />
              </RequireAdmin>
            ),
          },
          {
            path: "/panel/approval/request",
            element: (
              <RequireAdmin>
                <LeaveApprovalRequest />
              </RequireAdmin>
            ),
          },
        ],
      },
    ],
  },
]);

export default router;
