import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { BookAppointment } from "./components/BookAppointment";
import { MyAppointments } from "./components/MyAppointments";
import { Confirmation } from "./components/Confirmation";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "book", Component: BookAppointment },
      { path: "appointments", Component: MyAppointments },
      { path: "confirmation", Component: Confirmation },
    ],
  },
]);
