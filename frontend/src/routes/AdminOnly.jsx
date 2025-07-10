import { Navigate, Outlet } from "react-router-dom";

const AdminOnly = () => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
        return <Navigate to="/userDashboard" replace />;
    }
    return <Outlet />;
};

export default AdminOnly;
