import React, { useState, useEffect } from "react";
import { FiCamera } from "react-icons/fi";
import { FaEdit, FaExclamationTriangle, FaLock, FaSave, FaSpinner, FaUser, FaUserCircle } from "react-icons/fa";
import axios from "axios";
import apiClient from "../../lib/axios";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrUpdateProfile, fetchMyProfile } from "../../features/profileSlice";
export default function UserProfile() {

  const dispatch = useDispatch();
  const { data: profile, loading, error } = useSelector((state) => state.profile);

  const [activeTab, setActiveTab] = useState("edit");
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState("");

  const defaultUser = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    age: "",
    gender: "",
    city: "",
    country: "",
    bio: ""
  };

  const [user, setUser] = useState(defaultUser);
  const [formData, setFormData] = useState(defaultUser);

  useEffect(() => {
    dispatch(fetchMyProfile());
    setFormData(profile);
    setUser(profile)
  }, [dispatch]);


  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEdit = async () => {
    if (isEditing) {
      dispatch(createOrUpdateProfile(formData));
    }
    setIsEditing(!isEditing);
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await apiClient.delete('/users/delete-account', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          password: confirmPassword,
        },
      });

      alert(response.data.message);
      setShowDeleteModal(false);
      setUser(defaultUser);
      setFormData(defaultUser);
      setActiveTab("edit");
      setIsEditing(false);
      setConfirmPassword("");
      localStorage.removeItem('token');
      window.location.href = '/';
    } catch (error) {
      console.error('Delete account error:', error);
      alert("Something went wrong.");
    }
  };

  const fullName = `${user.firstName} ${user.lastName}`.trim() || "Anonymous User";
  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'AU';

  if (loading && !user.email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-12 text-center">
          <FaSpinner className="animate-spin text-4xl text-purple-400 mb-4 mx-auto" />
          <p className="text-xl text-gray-300">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error && !user.email) {
    return (
      <div className="flex min-h-screen bg-gray-900 text-white items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            // onClick={fetchUserProfile}
            className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <nav className="w-64 bg-gray-800 p-6 flex flex-col space-y-6">
        <h1 className="text-2xl font-bold mb-8 text-purple-500">Settings</h1>
        {[
          { label: "Edit Profile", key: "profile" },
          { label: "Update Password", key: "security" },
          { label: "Delete Account", key: "danger" },
        ].map(({ label, key }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`w-full text-left px-5 py-3 rounded-lg font-semibold transition-colors duration-300 ${
              activeTab === key ? "bg-purple-600 shadow-md" : "hover:bg-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Main content */}
      <main className="flex-1 p-12 overflow-auto">
        {/* Navigation buttons on top */}
        <nav className="flex justify-center space-x-6 mb-12">
          {[
            { id: "profile", label: "Profile", icon: FaUserCircle },
            { id: "security", label: "Security", icon: FaLock },
            { id: "danger", label: "Danger Zone", icon: FaExclamationTriangle },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-3 px-8 py-3 rounded-3xl font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                  : "bg-gray-800/30 text-gray-300 hover:bg-gray-700/50 hover:text-white backdrop-blur-xl border border-gray-700/50"
              }`}
            >
              <tab.icon className="text-xl" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Content area */}
        <section className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-10 max-w-5xl mx-auto">
          {/* Profile tab content */}
          {activeTab === "profile" && (
            <>
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-4xl font-bold mb-2">Profile Settings</h2>
                  <p className="text-gray-400 max-w-xl">
                    Manage your personal information and preferences.
                  </p>
                </div>
                <button
                  onClick={toggleEdit}
                  disabled={loading}
                  className={`flex items-center space-x-3 px-8 py-3 rounded-3xl font-semibold transition-all duration-300 ${
                    isEditing
                      ? "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/30"
                      : "bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/30"
                  } text-white hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? (
                    <FaSpinner className="animate-spin text-lg" />
                  ) : isEditing ? (
                    <FaSave className="text-lg" />
                  ) : (
                    <FaEdit className="text-lg" />
                  )}
                  <span>
                    {loading
                      ? "Saving..."
                      : isEditing
                      ? "Save Changes"
                      : "Edit Profile"}
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left side - Personal Info */}
                <div className="space-y-8">
                  <h3 className="text-2xl font-semibold flex items-center text-white mb-6">
                    <FaUser className="mr-3 text-purple-400" />
                    Personal Information
                  </h3>

                  {[
                    {
                      name: "firstName",
                      label: "First Name",
                      type: "text",
                      placeholder: "Enter your first name",
                    },
                    {
                      name: "lastName",
                      label: "Last Name",
                      type: "text",
                      placeholder: "Enter your last name",
                    },
                    {
                      name: "phoneNumber",
                      label: "Phone Number",
                      type: "tel",
                      placeholder: "+1 (555) 123-4567",
                    },
                    { name: "age", label: "Age", type: "number", placeholder: "25" },
                  ].map((field) => (
                    <div key={field.name} className="space-y-2">
                      <label className="text-sm font-medium text-gray-300 flex items-center">
                        {field.label}
                        {(field.name === "firstName" || field.name === "lastName") && (
                          <span className="ml-1 text-red-400">*</span>
                        )}
                      </label>
                      {isEditing ? (
                        <input
                          name={field.name}
                          type={field.type}
                          value={formData[field.name]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          className="w-full p-4 bg-gray-700/60 backdrop-blur-xl border border-gray-600/60 rounded-3xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition duration-300 focus:shadow-lg focus:shadow-purple-500/20"
                        />
                      ) : (
                        <div className="p-4 bg-gray-700/40 rounded-3xl border border-gray-600/40">
                          <span className="text-gray-300">
                            {user[field.name] || (
                              <span className="italic text-gray-500">Not provided</span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Right side - Additional Details */}
                <div className="space-y-8">
                  <h3 className="text-2xl font-semibold flex items-center text-white mb-6">
                    <FaUserCircle className="mr-3 text-purple-400" />
                    Additional Details
                  </h3>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Email Address
                    </label>
                    <div className="p-4 bg-gray-700/30 rounded-3xl border border-gray-600/40 flex justify-between items-center">
                      <span className="text-gray-300">{user.email}</span>
                      <span className="text-xs text-gray-500 bg-gray-600/50 px-3 py-1 rounded-lg">
                        Protected
                      </span>
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Gender</label>
                    {isEditing ? (
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full p-4 bg-gray-700/60 backdrop-blur-xl border border-gray-600/60 rounded-3xl text-white focus:border-purple-500 focus:outline-none transition duration-300 focus:shadow-lg focus:shadow-purple-500/20"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    ) : (
                      <div className="p-4 bg-gray-700/40 rounded-3xl border border-gray-600/40">
                        <span className="text-gray-300">
                          {user.gender || (
                            <span className="italic text-gray-500">Not specified</span>
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">City</label>
                    {isEditing ? (
                      <input
                        name="city"
                        type="text"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="ex: Rabat"
                        className="w-full p-4 bg-gray-700/60 backdrop-blur-xl border border-gray-600/60 rounded-3xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition duration-300 focus:shadow-lg focus:shadow-purple-500/20"
                      />
                    ) : (
                      <div className="p-4 bg-gray-700/40 rounded-3xl border border-gray-600/40">
                        <span className="text-gray-300">
                          {user.city || (
                            <span className="italic text-gray-500">Not specified</span>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Security Tab Placeholder */}
          {activeTab === "security" && (
            <div className="text-center text-gray-400 text-xl py-20">
              Security settings under construction.
            </div>
          )}

          {/* Danger Zone Tab Placeholder */}
          {activeTab === "danger" && (
            <div className="text-center text-red-500 text-xl py-20">
              Danger zone under construction.
            </div>
          )}
        </section>
      </main>
    </div>

  );
}