import { useEffect, useState } from "react";
import axios from "axios";
import { Heart, Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const API = "http://localhost:5000/api/profile";

const PartnerPreferences = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [preferences, setPreferences] = useState({
    minAge: 21,
    maxAge: 30,
    minHeight: "",
    maxHeight: "",
    education: "",
    profession: "",
    city: "",
    state: "",
    maritalStatus: "Any",
  });

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await axios.get(`${API}/me`, {
          withCredentials: true,
        });

        if (response.data.user?.partnerPreferences) {
          setPreferences((prev) => ({
            ...prev,
            ...response.data.user.partnerPreferences,
          }));
        }
      } catch (error) {
        toast.error("Preferences load nahi ho payi");
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPreferences((prev) => ({
      ...prev,
      [name]:
        name === "minAge" || name === "maxAge"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (preferences.minAge > preferences.maxAge) {
      toast.error("Minimum age maximum age se kam honi chahiye");
      return;
    }

    try {
      setSaving(true);

      await axios.put(
        `${API}/partner-preferences`,
        preferences,
        { withCredentials: true }
      );

      toast.success("Partner preferences saved successfully ❤️");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Preferences save nahi hui"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading preferences...</div>;
  }

  return (
    <div className="min-h-screen bg-pink-50 px-4 py-8">
      <div className="mx-auto max-w-3xl">

        {/* Back Button */}
        <button
          onClick={() => navigate("/profile")}
          className="mb-5 flex items-center gap-2 text-pink-700"
        >
          <ArrowLeft size={20} />
          Back to Profile
        </button>

        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">

          {/* Header */}
          <div className="bg-gradient-to-r from-pink-600 to-rose-400 p-8 text-center text-white">
            <Heart size={40} className="mx-auto mb-3" />

            <h1 className="text-3xl font-bold">
              Partner Preferences
            </h1>

            <p className="mt-2 text-pink-100">
              Tell us what you are looking for ❤️
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6">

            {/* Age */}
            <section>
              <h2 className="mb-3 text-lg font-bold text-gray-800">
                Preferred Age
              </h2>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="mb-2 block text-sm text-gray-600">
                    Minimum Age
                  </label>

                  <input
                    type="number"
                    name="minAge"
                    min="18"
                    max="100"
                    value={preferences.minAge}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border p-3 outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-600">
                    Maximum Age
                  </label>

                  <input
                    type="number"
                    name="maxAge"
                    min="18"
                    max="100"
                    value={preferences.maxAge}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border p-3 outline-none focus:border-pink-500"
                  />
                </div>

              </div>
            </section>

            <hr />

            {/* Height */}
            <section>
              <h2 className="mb-3 text-lg font-bold text-gray-800">
                Preferred Height
              </h2>

              <div className="grid grid-cols-2 gap-4">

                {/* Minimum Height */}
                <div>
                  <label className="mb-2 block text-sm text-gray-600">
                    Minimum Height
                  </label>

                  <select
                    name="minHeight"
                    value={preferences.minHeight}
                    onChange={handleChange}
                    className="w-full rounded-lg border p-3"
                  >
                    <option value="">Any Height</option>

                    {[
                      "4'8\"",
                      "4'9\"",
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
                    ].map((height) => (
                      <option key={height} value={height}>
                        {height}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Maximum Height */}
                <div>
                  <label className="mb-2 block text-sm text-gray-600">
                    Maximum Height
                  </label>

                  <select
                    name="maxHeight"
                    value={preferences.maxHeight}
                    onChange={handleChange}
                    className="w-full rounded-lg border p-3"
                  >
                    <option value="">Any Height</option>

                    {[
                      "4'8\"",
                      "4'9\"",
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
                    ].map((height) => (
                      <option key={height} value={height}>
                        {height}
                      </option>
                    ))}
                  </select>
                </div>

              </div>
            </section>

            <hr />

            {/* Education */}
            <section>
              <label className="mb-2 block font-bold text-gray-800">
                Preferred Education
              </label>

              <select
                name="education"
                value={preferences.education}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              >
                <option value="">Any Education</option>

                <option value="10th">10th</option>
                <option value="12th">12th</option>
                <option value="Graduate">Graduate</option>
                <option value="B.Tech">B.Tech</option>
                <option value="B.E">B.E</option>
                <option value="M.Tech">M.Tech</option>
                <option value="MBA">MBA</option>
                <option value="Post Graduate">Post Graduate</option>
                <option value="Doctorate">Doctorate</option>
                <option value="Professional Degree">
                  Professional Degree
                </option>
              </select>
            </section>

            {/* Profession */}
            <section>
              <label className="mb-2 block font-bold text-gray-800">
                Preferred Profession
              </label>

              <input
                type="text"
                name="profession"
                placeholder="e.g. Software Engineer"
                value={preferences.profession}
                onChange={handleChange}
                className="w-full rounded-lg border p-3 outline-none focus:border-pink-500"
              />
            </section>

            {/* Location */}
            <section>
              <h2 className="mb-3 font-bold text-gray-800">
                Preferred Location
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={preferences.city}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3"
                />

                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={preferences.state}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3"
                />

              </div>
            </section>

            {/* Marital Status */}
            <section>
              <label className="mb-2 block font-bold text-gray-800">
                Marital Status
              </label>

              <select
                name="maritalStatus"
                value={preferences.maritalStatus}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              >
                <option value="Any">Any</option>
                <option value="Never Married">
                  Never Married
                </option>
                <option value="Divorced">
                  Divorced
                </option>
                <option value="Widowed">
                  Widowed
                </option>
              </select>
            </section>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 py-3 font-semibold text-white transition hover:bg-pink-700 disabled:opacity-60"
            >
              <Save size={20} />

              {saving
                ? "Saving..."
                : "Save Preferences"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default PartnerPreferences;