import React, { useEffect, useState } from "react";
import { createOrUpdateProfile } from "../features/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import axios from "axios";
// import apiClient from "../lib/axios";


const ExForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading: isSubmitting, error: submitError } = useSelector((state) => state.profile);

  const [step, setStep] = useState(1);
  const [visiblePlatforms, setVisiblePlatforms] = useState([]);
  const [otherContent, setOtherContent] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  // const [isSubmitting, setIsSubmitting] = useState(false);
  // const [submitError, setSubmitError] = useState("");

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
    if (name === "contentTypes") {
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

  useEffect(() => {
    if (!isSubmitting && submitError) {
      toast.error(submitError);
    }
  }, [isSubmitting, submitError]);
  const togglePlatform = (platform) => {
    setVisiblePlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleNext = () => {
    if (step === 1 && !isStep1Valid()) {
      setSubmitError("Please fill in all required fields for Basic Info.");
      return;
    }
    // setSubmitError("");
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    // setSubmitError("");
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(createOrUpdateProfile(formData))
      .unwrap().then(() => {
        toast.success("Profile created successfully!");
        navigate("/userdashboard");
      })
      .catch((err) => {
        console.error("Failed to create profile:", err);
      });
  };

  const isStep1Valid = () => {
    return formData.firstName.trim() && formData.lastName.trim();
  };

  const isStep2Valid = () => {
    return true;
  };

  const isSubmitEnabled = () => {
    return isStep1Valid();
  };

  return (
    <div className="min-h-screen bg-slate-800 text-white p-6">
      <div className="max-w-3xl mx-auto p-6 bg-slate-900 rounded-lg space-y-6 shadow-lg">
        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-8">
          {["Basic Info", "Content Details", "Finish"].map((label, index) => (
            <div key={index} className="flex flex-col items-center flex-1 relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold z-10 ${step === index + 1 ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300"
                  }`}
              >
                {index + 1}
              </div>
              <span
                className={`mt-2 text-sm ${step === index + 1 ? "text-white" : "text-gray-400"
                  }`}
              >
                {label}
              </span>
              {index < 2 && (
                <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gray-600 -z-10">
                  <div
                    className={`h-full transition-all duration-300 ${step > index + 1 ? "bg-purple-600 w-full" : "w-0"
                      }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Error Display */}
        {submitError && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-200">{submitError}</p>
          </div>
        )}

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name *"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-3 bg-slate-800 border border-gray-700 rounded focus:border-purple-500 focus:outline-none"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name *"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-3 bg-slate-800 border border-gray-700 rounded focus:border-purple-500 focus:outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-slate-800 border border-gray-700 rounded focus:border-purple-500 focus:outline-none"
            />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
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

        {/* Step 2: Content Details */}
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
                    className={`flex items-center gap-2 border px-4 py-2 rounded transition-colors ${visiblePlatforms.includes(name)
                      ? "border-purple-600 bg-purple-700 text-white"
                      : "border-gray-700 hover:border-gray-600"
                      }`}
                  >
                    {icon} {name.charAt(0).toUpperCase() + name.slice(1)}
                  </button>
                ))}
              </div>
            </div>
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
                  placeholder="Please specify other categories "
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
              >
                <option value="">Select main platform</option>
                {["instagram", "twitter", "tiktok", "facebook", "youtube"].map((platform) => (
                  <option key={platform} value={platform}>
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="bestContentLinks" className="block mb-2 font-semibold">
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

        {/* Step 3: Finish */}
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
            />
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1 || isSubmitting}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${step === 1 || isSubmitting
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
              disabled={isSubmitting || !isStep1Valid()}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${isSubmitting || !isStep1Valid()
                ? "bg-gray-600 cursor-not-allowed text-gray-400"
                : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
            >
              Next
            </button>
          )}

          {step === 3 && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isSubmitEnabled || isSubmitting}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${!isSubmitEnabled || isSubmitting
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
