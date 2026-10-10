import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

import {
  Heart,
  ArrowLeft,
  Save,
  Camera,
  Upload,
  UserRound,
  CheckCircle,
  Circle,
  Trash2,
  ImagePlus,
} from "lucide-react";

const API = "http://localhost:5000/api/profile";

const Profile = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Main Profile Photo
  const [profileImage, setProfileImage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [uploading, setUploading] = useState(false);

  // Photo Gallery
  const [photoGallery, setPhotoGallery] = useState([]);
  const [galleryFile, setGalleryFile] = useState(null);
  const [galleryPreview, setGalleryPreview] = useState("");
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [deletingPhoto, setDeletingPhoto] = useState("");

  // Profile Form
  const [formData, setFormData] = useState({
    dateOfBirth: "",
    height: "",
    education: "",
    profession: "",
    annualIncome: "",
    city: "",
    state: "",
    aboutMe: "",
    maritalStatus: "",
  });

  // Profile Completion
  const completionItems = [
    {
      label: "Date of Birth",
      completed: Boolean(formData.dateOfBirth),
    },
    {
      label: "Height",
      completed: Boolean(formData.height),
    },
    {
      label: "Education & Profession",
      completed: Boolean(formData.education && formData.profession),
    },
    {
      label: "Location",
      completed: Boolean(formData.city && formData.state),
    },
    {
      label: "About Me",
      completed: Boolean(formData.aboutMe.trim()),
    },
    {
      label: "Profile Photo",
      completed: Boolean(profileImage),
    },
  ];

  const completedCount = completionItems.filter(
    (item) => item.completed,
  ).length;

  const completionPercentage = Math.round(
    (completedCount / completionItems.length) * 100,
  );

  // ===================================
  // LOAD PROFILE
  // ===================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`${API}/me`, {
          withCredentials: true,
        });

        const user = response.data.user;

        setProfileImage(user.profileImage || "");
        setPreviewImage(user.profileImage || "");
        setPhotoGallery(user.photoGallery || []);

        setFormData({
          dateOfBirth: user.dateOfBirth
            ? new Date(user.dateOfBirth).toISOString().split("T")[0]
            : "",
          height: user.height || "",
          education: user.education || "",
          profession: user.profession || "",
          annualIncome: user.annualIncome || "",
          city: user.city || "",
          state: user.state || "",
          aboutMe: user.aboutMe || "",
          maritalStatus: user.maritalStatus || "",
        });
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error("Please login first");
          navigate("/login");
        } else {
          toast.error(
            error.response?.data?.message || "Unable to load profile",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // ===================================
  // IMAGE VALIDATION
  // ===================================

  const validateImage = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG and WEBP images are allowed");
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5 MB");
      return false;
    }

    return true;
  };

  // ===================================
  // MAIN PROFILE PHOTO
  // ===================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!validateImage(file)) {
      e.target.value = "";
      return;
    }

    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      toast.error("Please select a photo first");
      return;
    }

    try {
      setUploading(true);

      const imageData = new FormData();
      imageData.append("profileImage", selectedImage);

      const response = await axios.post(`${API}/upload-photo`, imageData, {
        withCredentials: true,
      });

      const uploadedUrl = response.data.profileImage;

      setProfileImage(uploadedUrl);
      setPreviewImage(uploadedUrl);
      setSelectedImage(null);

      toast.success(
        response.data.message || "Profile photo uploaded successfully",
      );
    } catch (error) {
      console.error("Photo Upload Error:", error);

      toast.error(error.response?.data?.message || "Photo upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ===================================
  // GALLERY PHOTO SELECT
  // ===================================

  const handleGalleryChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!validateImage(file)) {
      e.target.value = "";
      return;
    }

    if (photoGallery.length >= 6) {
      toast.error("Maximum 6 gallery photos allowed");
      e.target.value = "";
      return;
    }

    setGalleryFile(file);
    setGalleryPreview(URL.createObjectURL(file));
  };

  // ===================================
  // UPLOAD GALLERY PHOTO
  // ===================================

  const handleGalleryUpload = async () => {
    if (!galleryFile) {
      toast.error("Please select a photo first");
      return;
    }

    if (photoGallery.length >= 6) {
      toast.error("Maximum 6 gallery photos allowed");
      return;
    }

    try {
      setGalleryUploading(true);

      const imageData = new FormData();
      imageData.append("profileImage", galleryFile);

      const response = await axios.post(`${API}/upload-gallery`, imageData, {
        withCredentials: true,
      });

      setPhotoGallery(response.data.photoGallery);

      setGalleryFile(null);
      setGalleryPreview("");

      toast.success(
        response.data.message || "Gallery photo uploaded successfully",
      );
    } catch (error) {
      console.error("Gallery Upload Error:", error);

      toast.error(error.response?.data?.message || "Gallery upload failed");
    } finally {
      setGalleryUploading(false);
    }
  };

  // ===================================
  // DELETE GALLERY PHOTO
  // ===================================

  const handleGalleryDelete = async (imageUrl) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this photo from your gallery?",
    );

    if (!confirmed) return;

    try {
      setDeletingPhoto(imageUrl);

      const response = await axios.delete(`${API}/delete-gallery`, {
        data: { imageUrl },
        withCredentials: true,
      });

      setPhotoGallery(response.data.photoGallery);

      toast.success(response.data.message || "Photo removed successfully");
    } catch (error) {
      console.error("Gallery Delete Error:", error);

      toast.error(error.response?.data?.message || "Unable to delete photo");
    } finally {
      setDeletingPhoto("");
    }
  };

  // ===================================
  // FORM CHANGE
  // ===================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ===================================
  // SAVE PROFILE
  // ===================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const response = await axios.put(`${API}/update`, formData, {
        withCredentials: true,
      });

      toast.success(response.data.message || "Profile saved successfully!");

      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  // ===================================
  // LOADING
  // ===================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50">
        <p className="text-rose-600 font-semibold">Loading profile...</p>
      </div>
    );
  }

  // ===================================
  // UI
  // ===================================

  return (
    <div className="min-h-screen bg-rose-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-600 hover:text-rose-600 mb-6"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        {/* Partner Preferences Button */}
        <button
          type="button"
          onClick={() => navigate("/partner-preferences")}
          className="mb-6 flex w-full items-center justify-between rounded-2xl border border-rose-200 bg-white p-5 text-left shadow-sm transition hover:border-rose-400 hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
              <Heart size={24} className="text-rose-600" />
            </div>

            <div>
              <h3 className="font-bold text-gray-800">Partner Preferences</h3>

              <p className="mt-1 text-sm text-gray-500">
                Set your ideal life partner preferences
              </p>
            </div>
          </div>

          <span className="font-semibold text-rose-600">Edit →</span>
        </button>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-rose-600 to-pink-500 p-8 text-white">
            <div className="flex items-center gap-3 mb-3">
              <Heart size={30} fill="currentColor" />

              <h1 className="text-3xl font-bold">My Matrimonial Profile</h1>
            </div>

            <p className="text-rose-100">
              Complete your profile to help others know you better.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            {/* PROFILE COMPLETION */}
            <div className="mb-8 rounded-2xl border border-rose-100 bg-rose-50 p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    Profile Completion
                  </h2>

                  <p className="text-sm text-gray-500">
                    Complete your profile to get noticed.
                  </p>
                </div>

                <span className="text-2xl font-bold text-rose-600">
                  {completionPercentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div
                className="w-full h-3 bg-rose-100 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={completionPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Profile completion"
              >
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${completionPercentage}%`,
                  }}
                />
              </div>

              {/* Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                {completionItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 text-sm"
                  >
                    {item.completed ? (
                      <CheckCircle size={17} className="text-green-600" />
                    ) : (
                      <Circle size={17} className="text-gray-400" />
                    )}

                    <span
                      className={
                        item.completed ? "text-gray-700" : "text-gray-500"
                      }
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {completionPercentage === 100 && (
                <p className="mt-4 text-sm font-semibold text-green-600">
                  🎉 Congratulations! Your profile is complete.
                </p>
              )}
            </div>

            {/* MAIN PROFILE PHOTO */}
            <div className="mb-8 flex flex-col items-center">
              <div
                style={{
                  width: "144px",
                  height: "144px",
                  minWidth: "144px",
                  minHeight: "144px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "4px solid #ffe4e6",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
                  backgroundColor: "#fff1f2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {previewImage || profileImage ? (
                  <img
                    src={previewImage || profileImage}
                    alt="Profile Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center 5%",
                      borderRadius: "50%",
                      display: "block",
                    }}
                  />
                ) : (
                  <UserRound size={65} style={{ color: "#fda4af" }} />
                )}
              </div>

              <h2 className="mt-4 text-lg font-semibold text-gray-800">
                Profile Photo
              </h2>

              <p className="text-sm text-gray-500 mt-1 text-center">
                Upload a clear photo for your matrimonial profile.
              </p>

              <label className="mt-4 cursor-pointer inline-flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-medium px-5 py-3 rounded-xl transition">
                <Camera size={18} />
                Choose Photo
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              <p className="text-xs text-gray-400 mt-2">
                JPG, PNG or WEBP · Maximum 5 MB
              </p>

              {selectedImage && (
                <button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={uploading}
                  className="mt-4 inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl transition"
                >
                  <Upload size={18} />
                  {uploading ? "Uploading Photo..." : "Upload Photo"}
                </button>
              )}

              {profileImage && !selectedImage && (
                <p className="text-xs text-green-600 mt-3">
                  ✓ Profile photo saved
                </p>
              )}
            </div>

            {/* ===================================
                PHOTO GALLERY
            =================================== */}

            <div className="mb-8 border-t border-rose-100 pt-8">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <ImagePlus className="text-rose-600" size={24} />

                  <h2 className="text-xl font-bold text-gray-800">
                    My Photo Gallery
                  </h2>
                </div>

                <span className="text-sm font-semibold text-rose-600">
                  {photoGallery.length}/6
                </span>
              </div>

              <p className="text-sm text-gray-500 mb-5">
                Add more photos to help others know you better.
              </p>

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {photoGallery.map((photo, index) => (
                  <div
                    key={photo}
                    className="relative aspect-square rounded-xl overflow-hidden border border-rose-100 bg-rose-50 group"
                  >
                    <img
                      src={photo}
                      alt={`Gallery photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleGalleryDelete(photo)}
                        disabled={deletingPhoto === photo}
                        title="Delete photo"
                        className="flex items-center gap-1 bg-white text-red-600 hover:bg-red-50 disabled:opacity-50 rounded-lg px-3 py-2 text-xs font-semibold shadow"
                      >
                        <Trash2 size={14} />
                        {deletingPhoto === photo ? "Removing..." : "Delete"}
                      </button>
                    </div>
                  </div>
                ))}

                {/* Selected Preview */}
                {galleryPreview && (
                  <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-dashed border-rose-300">
                    <img
                      src={galleryPreview}
                      alt="Selected gallery preview"
                      className="w-full h-full object-cover"
                    />

                    <span className="absolute bottom-2 left-2 bg-white/90 text-rose-600 text-xs font-semibold px-2 py-1 rounded-md">
                      Preview
                    </span>
                  </div>
                )}

                {/* Empty State */}
                {photoGallery.length === 0 && !galleryPreview && (
                  <div className="col-span-full border-2 border-dashed border-rose-200 rounded-2xl py-10 flex flex-col items-center text-center">
                    <ImagePlus size={38} className="text-rose-300 mb-3" />

                    <p className="text-gray-600 font-medium">
                      Your gallery is empty
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                      Upload your first gallery photo.
                    </p>
                  </div>
                )}
              </div>

              {/* Add Photo */}
              {photoGallery.length < 6 && (
                <div className="mt-5">
                  <label className="cursor-pointer inline-flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold px-5 py-3 rounded-xl transition">
                    <Camera size={18} />
                    Choose Gallery Photo
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleGalleryChange}
                      className="hidden"
                    />
                  </label>

                  {galleryFile && (
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={handleGalleryUpload}
                        disabled={galleryUploading}
                        className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl transition"
                      >
                        <Upload size={18} />
                        {galleryUploading
                          ? "Uploading..."
                          : "Upload Gallery Photo"}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {photoGallery.length >= 6 && (
                <p className="mt-4 text-sm text-rose-600 font-medium">
                  You have reached the maximum limit of 6 gallery photos.
                </p>
              )}

              <p className="text-xs text-gray-400 mt-3">
                JPG, PNG or WEBP · Maximum 5 MB per photo
              </p>
            </div>

            {/* ===================================
                PROFILE DETAILS
            =================================== */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Date of Birth
                </label>

                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full border rounded-xl p-3 outline-none focus:border-rose-500"
                />
              </div>

              {/* Height */}
              <div>
                <label className="block text-sm font-medium mb-2">Height</label>

                <select
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3 outline-none focus:border-rose-500"
                >
                  <option value="">Select Height</option>

                  {[
                    "4'10\"",
                    "4'11\"",
                    "5'0\"",
                    "5'1\"",
                    "5'2\"",
                    "5'3\"",
                    "5'4\"",
                    "5'5\"",
                    "5'6\"",
                    "5'7\"",
                    "5'8\"",
                    "5'9\"",
                    "5'10\"",
                    "5'11\"",
                    "6'0\"",
                    "6'1\"",
                    "6'2\"",
                    "6'3\"",
                    "6'4\"",
                  ].map((height) => (
                    <option key={height} value={height}>
                      {height}
                    </option>
                  ))}
                </select>
              </div>

              {/* Education */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Education
                </label>

                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  placeholder="e.g. B.Tech, MBA"
                  className="w-full border rounded-xl p-3 outline-none focus:border-rose-500"
                />
              </div>

              {/* Profession */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Profession
                </label>

                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  placeholder="e.g. Software Engineer"
                  className="w-full border rounded-xl p-3 outline-none focus:border-rose-500"
                />
              </div>

              {/* Annual Income */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Annual Income
                </label>

                <select
                  name="annualIncome"
                  value={formData.annualIncome}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3 outline-none focus:border-rose-500"
                >
                  <option value="">Select Income</option>
                  <option value="Below ₹2 Lakh">Below ₹2 Lakh</option>
                  <option value="₹2–5 Lakh">₹2–5 Lakh</option>
                  <option value="₹5–10 Lakh">₹5–10 Lakh</option>
                  <option value="₹10–20 Lakh">₹10–20 Lakh</option>
                  <option value="Above ₹20 Lakh">Above ₹20 Lakh</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              {/* Marital Status */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Marital Status
                </label>

                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3 outline-none focus:border-rose-500"
                >
                  <option value="">Select Status</option>
                  <option value="Never Married">Never Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium mb-2">City</label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                  className="w-full border rounded-xl p-3 outline-none focus:border-rose-500"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium mb-2">State</label>

                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter your state"
                  className="w-full border rounded-xl p-3 outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* About Me */}
            <div className="mt-5">
              <label className="block text-sm font-medium mb-2">About Me</label>

              <textarea
                name="aboutMe"
                value={formData.aboutMe}
                onChange={handleChange}
                rows="5"
                maxLength="500"
                placeholder="Tell us something about yourself..."
                className="w-full border rounded-xl p-3 outline-none focus:border-rose-500 resize-none"
              />

              <p className="text-xs text-gray-400 text-right">
                {formData.aboutMe.length}/500
              </p>
            </div>

            {/* Save Profile */}
            <button
              type="submit"
              disabled={saving}
              className="w-full mt-7 flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition"
            >
              <Save size={20} />
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
