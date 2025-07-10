import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import { fetchMyProfile } from '../features/profileSlice';

const ProfileRequired = () => {
    const dispatch = useDispatch();
    const { data: profile, loading, error } = useSelector((state) => state.profile);
    const { isAuthenticated } = useSelector((state) => state.auth);
    useEffect(() => {
        if (isAuthenticated && !profile) {
            dispatch(fetchMyProfile());
        }
    }, [dispatch, isAuthenticated]);
    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-900 text-white items-center justify-center">
                <div className="flex items-center gap-3">
                    <FaSpinner className="animate-spin text-2xl" />
                    <span>Loading Your Profile...</span>
                </div>
            </div>
        );
    }
    if (profile) {
        return <Outlet />;
    }
    if (error) {
        return <Navigate to="/profile" replace />;
    }
    return null;
};
export default ProfileRequired;