import React, { useState } from "react";
import axios from "axios";


const ExForm = () => {
  const [step, setStep] = useState(1);
  const [visiblePlatforms, setVisiblePlatforms] = useState([]);
  const [otherContent, setOtherContent] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    age: "",
    gender: "",
    city: "",
    country: "",

    instagram: { url: "", followers: "", remarks: "" },
    twitter: { url: "", followers: "", remarks: "" },
    tiktok: { url: "", followers: "", remarks: "" },
    facebook: { url: "", followers: "", remarks: "" },
    youtube: { url: "", followers: "", remarks: "" },

    contentTypes: [],
    contentCategories: [],
    monetizationMethod: "",
    mainPlatform: "",
    bestContentLinks: "",
    additionalInfo: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const [social, field] = name.split(".");

    if (["instagram", "twitter", "tiktok", "facebook", "youtube"].includes(social) && field) {
      setFormData((prev) => ({
        ...prev,
        [social]: {
          ...prev[social],
          [field]: value,
        },
      }));
    } else if (name === "contentTypes") {
      const updated = checked
        ? [...formData.contentTypes, value]
        : formData.contentTypes.filter((v) => v !== value);
      setFormData((prev) => ({ ...prev, contentTypes: updated }));
    } else if (name === "contentCategories") {
      const updated = checked
        ? [...formData.contentCategories, value]
        : formData.contentCategories.filter((v) => v !== value);
      setFormData((prev) => ({ ...prev, contentCategories: updated }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const togglePlatform = (platform) => {
    setVisiblePlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        age: formData.age ? parseInt(formData.age) : undefined,
        gender: formData.gender,
        city: formData.city,
        country: formData.country,

        platforms: visiblePlatforms
          .filter((platform) => formData[platform]?.url?.trim())
          .map((platform) => ({
            platform,
            url: formData[platform].url,
            followers: formData[platform].followers ? parseInt(formData[platform].followers) : undefined,
            remarks: formData[platform].remarks,
          })),

        contentTypes:
          formData.contentTypes.includes("other") && otherContent.trim()
            ? [...formData.contentTypes.filter((v) => v !== "other"), otherContent.toLowerCase()]
            : formData.contentTypes,

        contentCategories:
          formData.contentCategories.includes("other") && otherCategory.trim()
            ? [...formData.contentCategories.filter((v) => v !== "other"), otherCategory.toLowerCase()]
            : formData.contentCategories,

        monetizationMethod: formData.monetizationMethod,
        bestContentLinks: formData.bestContentLinks
          .split("\n")
          .map((link) => link.trim())
          .filter((link) => link !== ""),
        additionalInfo: formData.additionalInfo,
      };

      Object.keys(profileData).forEach((key) => {
        if (
          profileData[key] === undefined ||
          profileData[key] === "" ||
          (Array.isArray(profileData[key]) && profileData[key].length === 0)
        ) {
          delete profileData[key];
        }
      });

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in.");
        return;
      }

      const response = await axios.post("http://localhost:5000/api/profile", profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Profile created successfully!");
      window.location.href = "/userdashboard";
    } catch (error) {
      console.error("Error submitting profile:", error);
      alert(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitEnabled =
    formData.additionalInfo.trim() !== "" &&
    (!formData.contentTypes.includes("other") || otherContent.trim() !== "") &&
    (!formData.contentCategories.includes("other") || otherCategory.trim() !== "");

  return (
    <div className="min-h-screen bg-slate-800 text-white p-6">
      <div
        className="max-w-3xl mx-auto p-6 bg-slate-900 rounded-lg space-y-6 shadow-lg"
      >
        <div className="flex justify-between items-center mb-8">
          {["Basic Info", "Content Details", "Finish"].map((label, index) => (
            <div key={index} className="flex flex-col items-center flex-1 relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold z-10
                ${step === index + 1 ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300"}`}
              >
                {index + 1}
              </div>
              <span
                className={`mt-2 text-sm ${
                  step === index + 1 ? "text-white" : "text-gray-400"
                }`}
              >
                {label}
              </span>
              {index < 2 && (
                <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gray-600 -z-10">
                  <div
                    className={`h-full transition-all duration-300 ${
                      step > index + 1 ? "bg-purple-600 w-full" : "w-0"
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        {step === 1 && (
          <div className="space-y-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-3 bg-slate-800 border border-gray-700 rounded focus:border-purple-500 focus:outline-none"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-3 bg-slate-800 border border-gray-700 rounded focus:border-purple-500 focus:outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-slate-800 border border-gray-700 rounded focus:border-purple-500 focus:outline-none"
            />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              required
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-3 bg-slate-800 border border-gray-700 rounded focus:border-purple-500 focus:outline-none"
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              className="w-full p-3 bg-slate-800 border border-gray-700 rounded focus:border-purple-500 focus:outline-none"
            />
            <div className="flex gap-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Male
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Female
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  checked={formData.gender === "other"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Other
              </label>
            </div>
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-3 bg-slate-800 border border-gray-700 rounded focus:border-purple-500 focus:outline-none"
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
              className="w-full p-3 bg-slate-800 border border-gray-700 rounded focus:border-purple-500 focus:outline-none"
            />
          </div>
        )}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 font-semibold text-lg">Select Social Media Platforms:</h3>
              <div className="flex flex-wrap gap-3">
                {[
                  { name: "instagram", icon: "📷" },
                  { name: "twitter", icon: "🐦" },
                  { name: "tiktok", icon: "🎵" },
                  { name: "facebook", icon: "👥" },
                  { name: "youtube", icon: "▶️" },
                ].map(({ name, icon }) => (
                  <button
                    type="button"
                    key={name}
                    onClick={() => togglePlatform(name)}
                    className={`flex items-center gap-2 border px-4 py-2 rounded transition-colors ${
                      visiblePlatforms.includes(name)
                        ? "border-purple-600 bg-purple-700 text-white"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    {icon} {name.charAt(0).toUpperCase() + name.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            {visiblePlatforms.length > 0 && (
              <div className="space-y-4">
                {visiblePlatforms.map((platform) => (
                  <div key={platform} className="p-4 bg-slate-800 rounded-lg">
                    <h4 className="mb-3 font-semibold capitalize text-purple-400">{platform}</h4>
                    <div className="space-y-3">
                      <input
                        type="url"
                        name={`${platform}.url`}
                        placeholder={`${platform} URL`}
                        value={formData[platform]?.url || ""}
                        onChange={handleChange}
                        className="w-full p-2 bg-slate-700 border border-gray-600 rounded focus:border-purple-500 focus:outline-none"
                      />
                      <input
                        type="number"
                        name={`${platform}.followers`}
                        placeholder="Followers"
                        value={formData[platform]?.followers || ""}
                        onChange={handleChange}
                        className="w-full p-2 bg-slate-700 border border-gray-600 rounded focus:border-purple-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        name={`${platform}.remarks`}
                        placeholder="Remarks"
                        value={formData[platform]?.remarks || ""}
                        onChange={handleChange}
                        className="w-full p-2 bg-slate-700 border border-gray-600 rounded focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div>
              <h3 className="mb-3 font-semibold text-lg">Content Types (select all that apply):</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["photography", "creative writing", "video", "other"]
                .map((type) => (
                  <label key={type} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="contentTypes"
                      value={type.toLowerCase()}
                      checked={formData.contentTypes.includes(type.toLowerCase())}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>
              {formData.contentTypes.includes("other") && (
              <input
                type="text"
                placeholder="Please specify other content types"
                value={otherContent}
                onChange={(e) => setOtherContent(e.target.value)}
                className="mt-3 p-2 w-full bg-slate-800 border border-gray-700 rounded focus:border-purple-500 focus:outline-none"
              />
            )}
            </div>

            <div>
              <h3 className="mb-3 font-semibold text-lg">Content Categories (select all that apply):</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["art", "technology", "beauty and fashion", "gadgets", "events", "gaming", "other"]
                .map((cat) => (
                  <label key={cat} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="contentCategories"
                      value={cat.toLowerCase()}
                      checked={formData.contentCategories.includes(cat.toLowerCase())}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-sm">{cat}</span>
                  </label>
                ))}
              </div>
              {formData.contentCategories.includes("other") && (
                <input
                  type="text"
                  placeholder="Please specify other categories"
                  value={otherCategory}
                  onChange={(e) => setOtherCategory(e.target.value)}
                  className="mt-3 p-2 w-full bg-slate-800 border border-gray-700 rounded focus:border-purple-500 focus:outline-none"
                />
              )}
            </div>

            <div>
              <label className="block mb-2 font-semibold" htmlFor="monetizationMethod">
                Monetization Method
              </label>
              <select
                id="monetizationMethod"
                name="monetizationMethod"
                value={formData.monetizationMethod}
                onChange={handleChange}
                className="w-full p-3 bg-slate-800 border border-gray-700 rounded focus:border-purple-500 focus:outline-none"
                required
              >
                <option value="">Select a method</option>
                <option value="brand sponsorships">Brand Sponsorships</option>
                <option value="affiliate marketing">Affiliate Marketing</option>
                <option value="merchandise">Merchandise</option>
                <option value="youtube ads">YouTube Ads</option>
                <option value="patreon">Patreon</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-semibold" htmlFor="mainPlatform">
                Main Platform
              </label>
              <select
                id="mainPlatform"
                name="mainPlatform"
                value={formData.mainPlatform}
                onChange={handleChange}
                className="w-full p-3 bg-slate-800 border border-gray-700 rounded focus:border-purple-500 focus:outline-none"
                required
              >
                <option value="">Select main platform</option>
                {visiblePlatforms.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="bestContentLinks"
                className="block mb-2 font-semibold"
              >
                Best Content Links (one URL per line)
              </label>
              <textarea
                id="bestContentLinks"
                name="bestContentLinks"
                value={formData.bestContentLinks}
                onChange={handleChange}
                placeholder="Paste your best content links, one per line"
                rows={5}
                className="w-full p-3 bg-slate-800 border border-gray-700 rounded focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <label htmlFor="additionalInfo" className="block mb-2 font-semibold text-lg">
              Additional Information / Comments
            </label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              rows={6}
              placeholder="Write any additional info here..."
              className="w-full p-3 bg-slate-800 border border-gray-700 rounded focus:border-purple-500 focus:outline-none"
              required
            />
          </div>
        )}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1 || isSubmitting}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              step === 1 || isSubmitting
                ? "bg-gray-600 cursor-not-allowed text-gray-400"
                : "bg-gray-700 hover:bg-gray-600 text-white"
            }`}
          >
            Back
          </button>

          {step < 3 && (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
              disabled={isSubmitting}
            >
              Next
            </button>
          )}

          {step === 3 && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isSubmitEnabled || isSubmitting}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                !isSubmitEnabled || isSubmitting
                  ? "bg-gray-600 cursor-not-allowed text-gray-400"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExForm;