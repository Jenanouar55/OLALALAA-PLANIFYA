import React, { useState } from "react";

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("edit");
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const [user, setUser] = useState({
    name: "haroual",
    username: "king",
    email: "yassir@example.com",
    bio: "Passionate about tech reviews and travel vlogs.",
    location: "tata, MA",
    profilePic: null,
  });

  const [formData, setFormData] = useState(user);
  const [previewPic, setPreviewPic] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profilePic: file }));
      setPreviewPic(URL.createObjectURL(file));
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      setUser((prev) => ({
        ...formData,
        profilePic: previewPic || prev.profilePic,
      }));
      setPreviewPic(null);
    } else {
      setFormData(user);
    }
    setIsEditing(!isEditing);
  };

  const handleDeleteAccount = () => {
    if (confirmPassword === "password123") {
      alert("Account deleted successfully.");
      setShowDeleteModal(false);
    } else {
      alert("Incorrect password.");
    }
  };

  const displayPic = previewPic || user.profilePic || "/default-profile.png";

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

      {/* Main Content */}
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

            {/* Profile Picture */}
            <div className="flex items-center gap-6 mb-6">
              <img
                src={displayPic}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-purple-500"
              />
              {isEditing && (
                <div>
                  <label className="block text-sm mb-1 text-gray-400">
                    Change Profile Picture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-sm"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["name", "username", "email", "location"].map((name) => (
                <div key={name}>
                  <label className="text-gray-400 text-sm mb-1 block">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </label>
                  {isEditing ? (
                    <input
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                    />
                  ) : (
                    <p>{user[name]}</p>
                  )}
                </div>
              ))}

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
              <input type="password" placeholder="Current Password" className="w-full p-2 bg-gray-700 rounded border border-gray-600" />
              <input type="password" placeholder="New Password" className="w-full p-2 bg-gray-700 rounded border border-gray-600" />
              <input type="password" placeholder="Confirm New Password" className="w-full p-2 bg-gray-700 rounded border border-gray-600" />
              <button className="bg-purple-600 px-4 py-2 rounded-md hover:bg-purple-700">Update</button>
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

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
              <h2 className="text-xl font-bold text-red-500 mb-4">Confirm Deletion</h2>
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