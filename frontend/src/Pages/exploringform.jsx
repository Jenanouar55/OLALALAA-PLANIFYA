import React, { useState } from "react";
import {
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaFacebook,
  FaYoutube,
} from "react-icons/fa";

const ExForm = () => {
  const [step, setStep] = useState(1);
  const [visiblePlatforms, setVisiblePlatforms] = useState([]);
  const [otherContent, setOtherContent] = useState("");
  const [otherCategory, setOtherCategory] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    role: "",
    position: "",
    company: "",
    location: "",
    instagram: { url: "", followers: "", remarks: "" },
    twitter: { url: "", followers: "", remarks: "" },
    tiktok: { url: "", followers: "", remarks: "" },
    facebook: { url: "", followers: "", remarks: "" },
    youtube: { url: "", followers: "", remarks: "" },
    contentTypes: [],
    categories: [],
    monetize: "",
    frequentPlatform: "",
    bestContentLinks: "",
    languages: [],
    mainLink: "",
    bio: "",
    termsAccepted: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    const [social, field] = name.split(".");
    if (
      ["instagram", "twitter", "tiktok", "facebook", "youtube"].includes(social) &&
      field
    ) {
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
    } else if (name === "categories") {
      const updated = checked
        ? [...formData.categories, value]
        : formData.categories.filter((v) => v !== value);
      setFormData((prev) => ({ ...prev, categories: updated }));
    } else if (name === "languages") {
      const updated = checked
        ? [...formData.languages, value]
        : formData.languages.filter((v) => v !== value);
      setFormData((prev) => ({ ...prev, languages: updated }));
    } else if (name === "termsAccepted") {
      setFormData((prev) => ({ ...prev, termsAccepted: checked }));
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalData = { ...formData };

    if (formData.contentTypes.includes("other") && otherContent.trim()) {
      finalData.contentTypes = [
        ...formData.contentTypes.filter((v) => v !== "other"),
        otherContent,
      ];
    }

    if (formData.categories.includes("other") && otherCategory.trim()) {
      finalData.categories = [
        ...formData.categories.filter((v) => v !== "other"),
        otherCategory,
      ];
    }

    console.log("Submitted:", finalData);
  };

  const isSubmitEnabled =
    formData.bio.trim() !== "" &&
    formData.termsAccepted &&
    (!formData.contentTypes.includes("other") || otherContent.trim() !== "") &&
    (!formData.categories.includes("other") || otherCategory.trim() !== "");

  return (
    <div className="min-h-screen bg-[#1E293B] text-white p-6">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-[#0F172A] rounded-lg space-y-6 shadow-lg">
        {/* Step Indicator */}
        <div className="flex justify-between items-center mb-8">
          {["Basic Info", "Content Details", "Finish"].map((label, index) => (
            <div key={index} className="flex flex-col items-center w-full relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold
                ${step === index + 1 ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300"}`}>
                {index + 1}
              </div>
              <span className={`mt-2 text-sm ${step === index + 1 ? "text-white" : "text-gray-400"}`}>
                {label}
              </span>
              {index < 2 && (
                <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gray-600 z-[-1] transform translate-x-1/2">
                  <div className={`h-full transition-all duration-300 ${step > index + 1 ? "bg-purple-600 w-full" : "w-0"}`} />
                </div>
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
          <>
            <input type="text" name="firstName" placeholder="First Name" required value={formData.firstName} onChange={handleChange} className="w-full p-3 bg-[#1E293B] border border-gray-700 rounded" />
            <input type="text" name="lastName" placeholder="Last Name" required value={formData.lastName} onChange={handleChange} className="w-full p-3 bg-[#1E293B] border border-gray-700 rounded" />
            <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange} className="w-full p-3 bg-[#1E293B] border border-gray-700 rounded" />
            <input type="tel" name="phone" placeholder="Phone Number" required value={formData.phone} onChange={handleChange} className="w-full p-3 bg-[#1E293B] border border-gray-700 rounded" />
            <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} className="w-full p-3 bg-[#1E293B] border border-gray-700 rounded" />
            <div className="flex gap-6">
              <label><input type="radio" name="gender" value="male" checked={formData.gender === "male"} onChange={handleChange} /> Male</label>
              <label><input type="radio" name="gender" value="female" checked={formData.gender === "female"} onChange={handleChange} /> Female</label>
            </div>
            <input type="text" name="location" placeholder="City, Country" value={formData.location} onChange={handleChange} className="w-full p-3 bg-[#1E293B] border border-gray-700 rounded" />
          </>
        )}

        {step === 2 && (
          <>
            <p className="mb-2 font-semibold">Select Platforms:</p>
            <div className="flex gap-4 text-2xl mb-4">
              {[["instagram", <FaInstagram />], ["twitter", <FaTwitter />], ["tiktok", <FaTiktok />], ["facebook", <FaFacebook />], ["youtube", <FaYoutube />]].map(([name, icon]) => (
                <button key={name} type="button" onClick={() => togglePlatform(name)} className={`p-2 rounded-full ${visiblePlatforms.includes(name) ? "bg-purple-600" : "bg-gray-700"}`}>
                  {icon}
                </button>
              ))}
            </div>

            {visiblePlatforms.map((platform) => (
              <div key={platform} className="mb-4">
                <p className="capitalize mb-1">{platform}</p>
                <input type="url" name={`${platform}.url`} value={formData[platform].url} placeholder="Profile URL" onChange={handleChange} className="w-full p-2 bg-[#1E293B] border border-gray-700 rounded mb-1" />
                <input type="text" name={`${platform}.followers`} value={formData[platform].followers} placeholder="Followers" onChange={handleChange} className="w-full p-2 bg-[#1E293B] border border-gray-700 rounded mb-1" />
                <input type="text" name={`${platform}.remarks`} value={formData[platform].remarks} placeholder="Remarks" onChange={handleChange} className="w-full p-2 bg-[#1E293B] border border-gray-700 rounded" />
              </div>
            ))}

            <fieldset>
              <legend className="font-semibold mb-1">Content Types</legend>
              {["Photography", "Creative Writing", "Video", "Other"].map((type) => (
                <label key={type} className="mr-4 block">
                  <input type="checkbox" name="contentTypes" value={type.toLowerCase()} checked={formData.contentTypes.includes(type.toLowerCase())} onChange={handleChange} className="mr-2" />
                  {type}
                </label>
              ))}
              {formData.contentTypes.includes("other") && (
                <input type="text" placeholder="Specify other content type" value={otherContent} onChange={(e) => setOtherContent(e.target.value)} className="w-full p-2 mt-2 bg-[#1E293B] border border-gray-700 rounded" />
              )}
            </fieldset>

            <fieldset>
              <legend className="font-semibold mt-4 mb-1">Content Categories</legend>
              {["Art", "Technology", "Beauty and fashion", "Gadgets", "Events", "Gaming", "Other"].map((cat) => (
                <label key={cat} className="mr-4 block">
                  <input type="checkbox" name="categories" value={cat.toLowerCase()} checked={formData.categories.includes(cat.toLowerCase())} onChange={handleChange} className="mr-2" />
                  {cat}
                </label>
              ))}
              {formData.categories.includes("other") && (
                <input type="text" placeholder="Specify other category" value={otherCategory} onChange={(e) => setOtherCategory(e.target.value)} className="w-full p-2 mt-2 bg-[#1E293B] border border-gray-700 rounded" />
              )}
            </fieldset>

            <input type="text" name="monetize" placeholder="How do you monetize?" value={formData.monetize} onChange={handleChange} className="w-full p-3 mt-4 bg-[#1E293B] border border-gray-700 rounded" />
            <input type="text" name="frequentPlatform" placeholder="Your main platform?" value={formData.frequentPlatform} onChange={handleChange} className="w-full p-3 mt-2 bg-[#1E293B] border border-gray-700 rounded" />
            <textarea name="bestContentLinks" placeholder="Share best content links" value={formData.bestContentLinks} onChange={handleChange} className="w-full p-3 mt-2 bg-[#1E293B] border border-gray-700 rounded" rows={3}></textarea>
          </>
        )}

        {step === 3 && (
          <>
            <textarea name="bio" placeholder="Anything you want to add?" value={formData.bio} onChange={handleChange} className="w-full p-3 bg-[#1E293B] border border-gray-700 rounded" rows={4}></textarea>
            <label className="block mt-3">
              <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleChange} className="mr-2" />
              I accept the terms of use.
            </label>
            <button type="submit" disabled={!isSubmitEnabled} className={`w-full py-3 mt-4 rounded ${isSubmitEnabled ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-700 cursor-not-allowed"}`}>
              Start Creating
            </button>
          </>
        )}

        <div className="flex justify-between mt-6">
          {step > 1 && <button type="button" onClick={handleBack} className="text-gray-300 hover:text-white">← Back</button>}
          {step < 3 && <button type="button" onClick={handleNext} className="ml-auto bg-purple-600 text-white py-2 px-6 rounded hover:bg-purple-700">Next →</button>}
        </div>
      </form>
    </div>
  );
};

export default ExForm;
