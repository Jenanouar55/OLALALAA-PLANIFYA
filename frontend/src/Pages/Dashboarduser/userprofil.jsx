import React, { useState, useEffect } from "react";
import { FiCamera } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("edit");
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const defaultUser = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    age: "",
    gender: "",
    city: "",
    country: "",
    bio: "",
    profilePic: null,
    platforms: [],
    mainPlatform: "",
    contentTypes: [],
    contentCategories: [],
    monetizationMethod: "",
    bestContentLinks: [],
    additionalInfo: "",
    plan: "free",
    tokens: 15
  };

  const [user, setUser] = useState(defaultUser);
  const [formData, setFormData] = useState(defaultUser);
  const [previewPic, setPreviewPic] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }
      const response = await fetch('http://localhost:5000/api/profile/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Response is not JSON:', textResponse);
        setError('Server returned invalid response format. Make sure your backend server is running on port 5000.');
        setLoading(false);
        return;
      }

      if (response.ok) {
        const profileData = await response.json();
        const userData = {
          ...defaultUser,
          firstName: profileData.firstName || "",
          lastName: profileData.lastName || "",
          email: profileData.email || "", 
          phoneNumber: profileData.phoneNumber || "",
          age: profileData.age || "",
          gender: profileData.gender || "",
          city: profileData.city || "",
          country: profileData.country || "",
          bio: profileData.additionalInfo || "", 
          platforms: profileData.platforms || [],
          mainPlatform: profileData.mainPlatform || "",
          contentTypes: profileData.contentTypes || [],
          contentCategories: profileData.contentCategories || [],
          monetizationMethod: profileData.monetizationMethod || "",
          bestContentLinks: profileData.bestContentLinks || [],
          additionalInfo: profileData.additionalInfo || "",
          plan: profileData.plan || "free",
          tokens: profileData.tokens || 15
        };

        setUser(userData);
        setFormData(userData);
      } else if (response.status === 404) {
        setError("Profile not found");
      } else {
        const errorData = await response.json();
        setError(errorData.message || `Server error: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setFormData((prev) => ({ ...prev, profilePic: base64 }));
        setPreviewPic(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleEdit = async () => {
    if (isEditing) {

      try {
        const token = localStorage.getItem('token');
        const updateData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          age: formData.age ? parseInt(formData.age) : undefined,
          gender: formData.gender,
          city: formData.city,
          country: formData.country,
          additionalInfo: formData.bio,
        };
        Object.keys(updateData).forEach(key => {
          if (updateData[key] === undefined || updateData[key] === "") {
            delete updateData[key];
          }
        });
        const response = await fetch('http://localhost:5000/api/profile/me', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Profile updated successfully:", result);
          
          const updatedUser = {
            ...formData,
            profilePic: formData.profilePic || user.profilePic,
          };
          setUser(updatedUser);
          setPreviewPic(null);
          setError("");
        } else {
          const result = await response.json();
          setError(result.message || "Failed to update profile");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        setError("Network error.");
      }
    } else {
      setFormData(user);
    }
    setIsEditing(!isEditing);
  };

  const handleDeleteAccount = () => {
    if (confirmPassword === "password") {
      alert("Account deleted successfully");
      setShowDeleteModal(false);
      setUser(defaultUser);
      setFormData(defaultUser);
      setActiveTab("edit");
      setIsEditing(false);
      setConfirmPassword("");
    } else {
      alert("Incorrect password.");
    }
  };

  const displayPic = previewPic || user.profilePic || "/profile.jpg";
  const fullName = `${user.firstName} ${user.lastName}`.trim() || "User";
  const location = `${user.city}${user.city && user.country ? ', ' : ''}${user.country}`.trim();

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-900 text-white items-center justify-center">
        <div className="flex items-center gap-3">
          <FaSpinner className="animate-spin text-2xl" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-900 text-white items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={fetchUserProfile}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md"
          >
            Retry
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
            className={`w-full text-left px-4 py-2 rounded-md transition ${
              activeTab === key ? "bg-purple-600" : "hover:bg-gray-700"
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

            <div className="flex items-center gap-6 mb-6">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-purple-500">
                <img
                  src={displayPic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                {isEditing && (
                  <>
                    <label
                      htmlFor="profilePicInput"
                      className="absolute bottom-1 right-1 bg-purple-600 p-1 rounded-full cursor-pointer hover:bg-purple-700"
                      title="Change Profile Picture"
                    >
                      <FiCamera className="text-white" size={20} />
                    </label>
                    <input
                      id="profilePicInput"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">First Name</label>
                {isEditing ? (
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                  />
                ) : (
                  <p>{user.firstName}</p>
                )}
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-1 block">Last Name</label>
                {isEditing ? (
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                  />
                ) : (
                  <p>{user.lastName}</p>
                )}
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-1 block">Email</label>
                <p className="text-gray-500">{user.email} (Cannot be changed)</p>
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-1 block">Phone Number</label>
                {isEditing ? (
                  <input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                  />
                ) : (
                  <p>{user.phoneNumber}</p>
                )}
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-1 block">Age</label>
                {isEditing ? (
                  <input
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                  />
                ) : (
                  <p>{user.age}</p>
                )}
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-1 block">Gender</label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <p>{user.gender}</p>
                )}
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-1 block">City</label>
                {isEditing ? (
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                  />
                ) : (
                  <p>{user.city}</p>
                )}
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-1 block">Country</label>
                {isEditing ? (
                  <input
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                  />
                ) : (
                  <p>{user.country}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="text-gray-400 text-sm mb-1 block">Bio</label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                    rows={3}
                  />
                ) : (
                  <p>{user.bio}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "password" && (
          <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Update Password</h2>
            <form className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                className="w-full p-2 bg-gray-700 rounded border border-gray-600"
              />
              <input
                type="password"
                placeholder="New Password"
                className="w-full p-2 bg-gray-700 rounded border border-gray-600"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full p-2 bg-gray-700 rounded border border-gray-600"
              />
              <button className="bg-purple-600 px-4 py-2 rounded-md hover:bg-purple-700">
                Update
              </button>
            </form>
          </div>
        )}

        {activeTab === "delete" && (
          <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-red-400">Danger Zone</h2>
            <p className="mb-4">Are you sure you want to delete your account?</p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md"
            >
              Delete My Account
            </button>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
              <h2 className="text-xl font-bold text-red-500 mb-4">
                Confirm Deletion
              </h2>
              <p className="mb-3">Enter your password to confirm deletion:</p>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Your password"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded mb-4"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}