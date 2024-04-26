import { createBrowserRouter } from "react-router-dom";
import { App } from "../App";
import {
  Home,
  Register,
  Login,
  Profile,
  Dashboard,
  ForgotPassword,
  CheckCode,
  FormProfile,
  ChangePassword,
  ProductIdRoute,
} from "../pages";
import { Protected } from "../components";
import ProtectedCheckChildren from "../components/ProtectedRoute/ProtectedCheckChildren";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/dashboard",
        element: (
          <Protected>
            <Dashboard />
          </Protected>
        ),
      },
      {
        path: "/product/:productId", // Ruta dinámica con el parámetro de ruta :productId
        element: <ProductIdRoute />,
      },
      {
        path: "/forgotPassword",
        element: <ForgotPassword />,
      },
      {
        path: "/verifyCode",
        element: (
          <ProtectedCheckChildren>
            <CheckCode />
          </ProtectedCheckChildren>
        ),
      },
      {
        path: "/profile",
        element: (
          <Protected>
            <Profile />
          </Protected>
        ),
        children: [
          {
            path: "/profile/changePassword",
            element: (
              <Protected>
                <ChangePassword />
              </Protected>
            ),
          },
          {
            path: "/profile/",
            element: (
              <Protected>
                <FormProfile />
              </Protected>
            ),
          },
        ],
      },
    ],
  },
]);
