import { createBrowserRouter } from "react-router-dom";
import MyListings from "../pages/MyListings"; 
import UpdatePet from '../pages/UpdatePet'; 

const routes = createBrowserRouter([
    {
        path: '/dashboard',
        element: <DashboardLayout />,
        children: [
            {
                path: 'my-listings',
                element: <MyListings />
            },
           
            {
                path: 'update-pet/:id',
                element: <UpdatePet />
            }
        ]
    }
]);

export default routes;
