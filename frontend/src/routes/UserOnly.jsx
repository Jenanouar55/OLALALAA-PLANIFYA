import { Navigate, Outlet } from "react-router-dom";

const UserOnly = () => {
    const role = localStorage.getItem("role");
    if (role !== "user") {
        return <Navigate to="/dashboard" replace />;
    }
    return <Outlet />;
};

export default UserOnly;
