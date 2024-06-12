import React from 'react';
import ReactDOM from 'react-dom/client';

import {
	createBrowserRouter,
	RouterProvider,
} from "react-router-dom";

// import di pagine di utilità
import Root from './routes/root';
import ErrorPage from './ErrorPage';

// import pagine navigazione
import OlMap from './routes/OlMap';
import MyForm from './routes/Form';


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
				element: <MyForm />
			},
		]
	}
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);