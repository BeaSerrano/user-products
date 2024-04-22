import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./App.jsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes.jsx";
import { AuthContextProvider } from "./context/authContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <RouterProvider router={router} />
  </AuthContextProvider>
);
