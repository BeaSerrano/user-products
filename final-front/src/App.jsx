import { Outlet } from "react-router-dom";
import "./App.css";
import { Footer, Header } from "./components";

export const App = () => {
  window.onunload = () => localStorage.removeItem("user");
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
