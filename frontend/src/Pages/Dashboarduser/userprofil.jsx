import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaEdit, FaSave, FaSpinner, FaUserCircle, FaLock, FaExclamationTriangle } from "react-icons/fa";
import { createOrUpdateProfile } from "../../features/profileSlice"; // Adjust path if needed

const UserProfile = () => {
  const dispatch = useDispatch();

  // 1. Select data and status directly from the Redux store.
  // No need to fetch here; the ProfileRequired guard has already done it.
  const { data: profile, loading, error } = useSelector((state) => state.profile);

  // 2. Use local state ONLY for managing the form inputs and UI mode.
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState("profile");

  // 3. Populate the form state ONLY when the profile data from Redux is available.
  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  // 4. Display any errors that might occur during an UPDATE.
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    dispatch(createOrUpdateProfile(formData))
      .unwrap()
      .then(() => {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      })
      .catch((err) => {
        toast.error(err.message || "Failed to update profile.");
      });
  };

  const handleCancelEdit = () => {
    setFormData(profile); // Reset form changes
    setIsEditing(false);
  };

  // This is a fallback loading state. In practice, the ProfileRequired
  // guard should prevent this from showing for more than a split second.
  if (!profile) {
    return (
      <div className="flex justify-center items-center p-10">
        <FaSpinner className="animate-spin text-2xl text-purple-400" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Tab Navigation */}
      <nav className="flex justify-center space-x-4 mb-8">
        {[
          { id: "profile", label: "Profile", icon: FaUserCircle },
          { id: "security", label: "Security", icon: FaLock },
          { id: "danger", label: "Danger Zone", icon: FaExclamationTriangle },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${activeTab === tab.id
              ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700/80 hover:text-white"
              }`}
          >
            <tab.icon />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <section className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8">
        {activeTab === 'profile' && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white">Profile Settings</h2>
                <p className="text-gray-400 mt-1">Manage your personal information.</p>
              </div>
              <div className="flex gap-3 mt-4 sm:mt-0">
                {isEditing && (
                  <button onClick={handleCancelEdit} className="bg-gray-600 hover:bg-gray-700 px-5 py-2.5 rounded-full text-sm font-semibold">
                    Cancel
                  </button>
                )}
                <button
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  disabled={loading}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'} disabled:bg-gray-500`}
                >
                  {loading ? <FaSpinner className="animate-spin" /> : (isEditing ? <FaSave /> : <FaEdit />)}
                  {loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Edit Profile')}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form Fields */}
              {[
                { name: "firstName", label: "First Name", type: "text" },
                { name: "lastName", label: "Last Name", type: "text" },
                { name: "phoneNumber", label: "Phone Number", type: "tel" },
                { name: "age", label: "Age", type: "number" },
                { name: "city", label: "City", type: "text" },
                { name: "country", label: "Country", type: "text" },
              ].map(field => (
                <div key={field.name}>
                  <label className="text-sm font-medium text-gray-400">{field.label}</label>
                  {isEditing ? (
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      className="mt-1 w-full p-3 bg-gray-700/60 border border-gray-600/60 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    />
                  ) : (
                    <p className="mt-1 w-full p-3 bg-gray-700/30 rounded-lg text-gray-300 min-h-[48px]">
                      {profile[field.name] || <span className="italic text-gray-500">Not provided</span>}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
        {activeTab === 'security' && <div className="text-center py-20 text-gray-400">Security settings are under construction.</div>}
        {activeTab === 'danger' && <div className="text-center py-20 text-red-400">Danger Zone is under construction.</div>}
      </section>
    </div>
  );
}
export default UserProfile