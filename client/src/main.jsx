import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from './providers/AuthProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Adopt from './pages/Adopt';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import AllPets from './pages/AllPets';
import PetDetails from './pages/PetDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import MyRequests from './pages/MyRequests';
import AddPet from './pages/AddPet';
import MyListings from './pages/MyListings';
import NotFound from './pages/NotFound';
import PrivateRoute from './routes/PrivateRoute';
import UpdatePet from './pages/UpdatePet';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
     
      { path: "/", element: <Home /> },
      { path: "/all-pets", element: <AllPets /> },
      { path: "/pets/:id", element: <PrivateRoute><PetDetails /></PrivateRoute> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
        { path: "/adopt", element: <Adopt /> },  
    ]
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      { path: "my-requests", element: <MyRequests /> },
      { path: "add-pet", element: <AddPet /> },
      { path: "my-listings", element: <MyListings /> },
       { path: "update-pet/:id", element: <UpdatePet /> },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </AuthProvider>
  </React.StrictMode>,
)
