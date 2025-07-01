import { Navigate, Outlet } from "react-router-dom";

const AlreadyConnected = () => {
    const token = localStorage.getItem("token");
    if (token) {
        const role = localStorage.getItem("role");
        if (role in ["user", "admin"]) {
            return <Navigate to="/userDashboard" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default AlreadyConnected;
