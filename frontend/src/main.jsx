import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// gestione del tema (scuro/chiaro)
import { ThemeProvider } from "@/components/theme-provider"

// gestione della navigazione
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// pagine generiche
import Root from './routes/root';
import ErrorPage from './ErrorPage';

// pagine specifiche
import OlMap from "./routes/OlMap"
import RadioGroupForm from "./routes/testform"
import DrawerDemo from "./routes/testToast"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "mappa",
        element: <OlMap />
      },
      {
        path: "form",
        element: <RadioGroupForm />
      },
      {
        path: "tos",
        element: <DrawerDemo />
      },
    ]
  }
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">


      <RouterProvider router={router} />


    </ThemeProvider>
  </React.StrictMode>,
)
