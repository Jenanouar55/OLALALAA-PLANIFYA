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
      <div className="w-64 bg-gray-800 p-6 space-y-4">
        {[
          { label: "Edit Profile", key: "edit" },
          { label: "Update Password", key: "password" },
          { label: "Delete Account", key: "delete" },
        ].map(({ label, key }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`w-full text-left px-4 py-2 rounded-md transition ${activeTab === key ? "bg-purple-600" : "hover:bg-gray-700"
              }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex-1 p-10">
        {activeTab === "edit" && (
          <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Edit Profile</h2>
              <button
                onClick={toggleEdit}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md text-sm"
              >
                {isEditing ? "Save" : "Edit Profile"}
              </button>
            </div>
          </div>)}
      </div>

      {/* Navigation */}
      <div className="flex space-x-2 mb-8">
        {[
          { id: 'profile', label: 'Profile', icon: FaUserCircle },
          { id: 'security', label: 'Security', icon: FaLock },
          { id: 'danger', label: 'Danger Zone', icon: FaExclamationTriangle }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${activeTab === tab.id
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
              : 'bg-gray-800/30 text-gray-300 hover:bg-gray-700/50 hover:text-white backdrop-blur-xl border border-gray-700/50'
              }`}
          >
            <tab.icon className="text-lg" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8">
        {activeTab === 'profile' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Profile Settings</h2>
                <p className="text-gray-400">Manage your personal information and preferences</p>
              </div>
              <button
                onClick={toggleEdit}
                disabled={loading}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${isEditing
                  ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/25'
                  : 'bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/25'
                  } text-white hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <FaSpinner className="animate-spin" />
                ) : isEditing ? (
                  <FaSave />
                ) : (
                  <FaEdit />
                )}
                <span>{loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <FaUser className="mr-2 text-purple-400" />
                  Personal Information
                </h3>

                {[
                  { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'Enter your first name' },
                  { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Enter your last name' },
                  { name: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: '+1 (555) 123-4567' },
                  { name: 'age', label: 'Age', type: 'number', placeholder: '25' }
                ].map(field => (
                  <div key={field.name} className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center">
                      {field.label}
                      {field.name === 'firstName' || field.name === 'lastName' ? (
                        <span className="ml-1 text-red-400">*</span>
                      ) : null}
                    </label>
                    {isEditing ? (
                      <input
                        name={field.name}
                        type={field.type}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className="w-full p-4 bg-gray-700/50 backdrop-blur-xl border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-all duration-300 focus:shadow-lg focus:shadow-purple-500/10"
                      />
                    ) : (
                      <div className="p-4 bg-gray-700/30 rounded-2xl border border-gray-600/30">
                        <span className="text-gray-300">
                          {user[field.name] || <span className="text-gray-500 italic">Not provided</span>}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <FaUserCircle className="mr-2 text-purple-400" />
                  Additional Details
                </h3>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Email Address</label>
                  <div className="p-4 bg-gray-700/20 rounded-2xl border border-gray-600/30">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">{user.email}</span>
                      <span className="text-xs text-gray-500 bg-gray-600/50 px-2 py-1 rounded-lg">Protected</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Gender</label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full p-4 bg-gray-700/50 backdrop-blur-xl border border-gray-600/50 rounded-2xl text-white focus:border-purple-500 focus:outline-none transition-all duration-300 focus:shadow-lg focus:shadow-purple-500/10"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  ) : (
                    <div className="p-4 bg-gray-700/30 rounded-2xl border border-gray-600/30">
                      <span className="text-gray-300">
                        {user.gender || <span className="text-gray-500 italic">Not specified</span>}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">City</label>
                  {isEditing ? (
                    <input
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="ex: Rabat"
                      className="w-full p-4 bg-gray-700/50 backdrop-blur-xl border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-all duration-300 focus:shadow-lg focus:shadow-purple-500/10"
                    />
                  ) : (
                    <div className="p-4 bg-gray-700/30 rounded-2xl border border-gray-600/30">
                      <span className="text-gray-300">
                        {user.city || <span className="text-gray-500 italic">Not provided</span>}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Country</label>
                  {isEditing ? (
                    <input
                      name="country"
                      type="text"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="ex: Morocco"
                      className="w-full p-4 bg-gray-700/50 backdrop-blur-xl border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-all duration-300 focus:shadow-lg focus:shadow-purple-500/10"
                    />
                  ) : (
                    <div className="p-4 bg-gray-700/30 rounded-2xl border border-gray-600/30">
                      <span className="text-gray-300">
                        {user.country || <span className="text-gray-500 italic">Not provided</span>}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-2">
              <label className="text-sm font-medium text-gray-300">About Me</label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself, your interests, and what makes you unique..."
                  rows={4}
                  className="w-full p-4 bg-gray-700/50 backdrop-blur-xl border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-all duration-300 focus:shadow-lg focus:shadow-purple-500/10 resize-none"
                />
              ) : (
                <div className="p-4 bg-gray-700/30 rounded-2xl border border-gray-600/30 min-h-[120px]">
                  <span className="text-gray-300">
                    {user.bio || <span className="text-gray-500 italic">No bio added yet</span>}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLock className="text-purple-400 text-3xl" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Security Settings</h2>
              <p className="text-gray-400">Keep your account secure with a strong password</p>
            </div>

            <div className="bg-gray-700/30 backdrop-blur-xl border border-gray-600/50 rounded-3xl p-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter your current password"
                    className="w-full p-4 bg-gray-700/50 backdrop-blur-xl border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-all duration-300 focus:shadow-lg focus:shadow-purple-500/10"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter a strong new password"
                    className="w-full p-4 bg-gray-700/50 backdrop-blur-xl border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-all duration-300 focus:shadow-lg focus:shadow-purple-500/10"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Confirm your new password"
                    className="w-full p-4 bg-gray-700/50 backdrop-blur-xl border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-all duration-300 focus:shadow-lg focus:shadow-purple-500/10"
                  />
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
                  <h4 className="font-medium text-blue-300 mb-2">Password Requirements</h4>
                  <ul className="text-sm text-blue-200/80 space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• Contains uppercase and lowercase letters</li>
                    <li>• Includes at least one number</li>
                    <li>• Has at least one special character</li>
                  </ul>
                </div>

                <button className="w-full bg-purple-600 hover:bg-purple-700 px-6 py-4 rounded-2xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 text-white">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'danger' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaExclamationTriangle className="text-red-400 text-3xl" />
              </div>
              <h2 className="text-3xl font-bold text-red-400 mb-2">Danger Zone</h2>
              <p className="text-gray-400">These actions cannot be undone. Please be careful.</p>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8">
              <div className="space-y-6">
                <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-red-300 mb-3">Delete Account</h3>
                  <p className="text-red-200/80 mb-4">
                    Once you delete your account, there is no going back. This will permanently delete your
                    profile, posts, and all associated data.
                  </p>
                  <ul className="text-sm text-red-200/70 space-y-2 mb-6">
                    <li>• All your personal information will be removed</li>
                    <li>• Your posts and comments will be deleted</li>
                    <li>• You will lose access to premium features</li>
                    <li>• This action cannot be reversed</li>
                  </ul>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 text-white"
                  >
                    Delete My Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-3xl w-full max-w-md p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaExclamationTriangle className="text-red-400 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-red-400 mb-2">Final Confirmation</h2>
              <p className="text-gray-300">This action cannot be undone. Please enter your password to confirm.</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full p-4 bg-gray-700/50 backdrop-blur-xl border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-all duration-300"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-2xl font-medium transition-all duration-300 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-2xl font-medium transition-all duration-300 text-white hover:scale-105"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}