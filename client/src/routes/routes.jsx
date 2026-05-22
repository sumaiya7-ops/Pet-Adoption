import { createBrowserRouter } from "react-router-dom";
// আগে থেকে থাকা ইমপোর্টগুলো থাকবে...
import MyListings from "../pages/MyListings"; 
import UpdatePet from '../pages/UpdatePet'; // 👈 শুধু এই নতুন লাইনটি ওপরে যোগ করবেন

const routes = createBrowserRouter([
    // আপনার মেইন রাউটগুলো থাকবে...
    {
        path: '/dashboard',
        element: <DashboardLayout />,
        children: [
            {
                path: 'my-listings',
                element: <MyListings />
            },
            // 👇 আগের রাউটগুলোর ঠিক নিচে কমা দিয়ে এটি যোগ করবেন
            {
                path: 'update-pet/:id',
                element: <UpdatePet />
            }
        ]
    }
]);

export default routes;
