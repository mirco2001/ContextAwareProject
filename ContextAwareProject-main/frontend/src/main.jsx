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
import SearchResult from "./routes/ShowSearchResult"
import Edit from "./routes/Edit.tsx"

import 'ol/ol.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true, // Questo indica che questa è la route di partenza
        element: <HomePage />
      },
      {
        path: "home",
        element: <HomePage />
      },
      {
        path: "searchZone",
        element: <MapSearch searchType="zone" />
      },
      {
        path: "searchDraw",
        element: <MapSearch searchType="draw" />
      },
      {
        path: "searchAddress",
        element: <MapSearch searchType="address" />
      },
      {
        path: "house",
        element: <SearchResult/>
      },
      {
        path: "form",
        element: <RadioGroupForm />
      },
      {
        path: "edit",
        element: <Edit />
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
