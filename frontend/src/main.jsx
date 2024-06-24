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
import HomePage from './routes/HomePage'
import Root from './routes/root';
import ErrorPage from './ErrorPage';

// pagine specifiche
import MapSearch from "./routes/MapSearch"
import RadioGroupForm from "./routes/form"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "home",
        element: <HomePage />
      },
      {
        path: "search",
        element: <MapSearch />
      },
      {
        path: "form",
        element: <RadioGroupForm />
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
