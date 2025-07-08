import { Navigate, Outlet } from "react-router-dom";

const ConnectedOnly = ({ children }) => {
    const token = localStorage.getItem("token");
    if (!token) {
        // const role = localStorage.getItem("role");
        // if (role in ["user", "admin"]) {
        return <Navigate to="/login" replace />;
    }
    // }

    return <Outlet />;
};

export default ConnectedOnly;
