// src/router/index.tsx
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/sign-in",
    element: <Signin />,
  },
  {
    path: "/sign-up",
    element: <Signup />,
  },
]);

export default router;
