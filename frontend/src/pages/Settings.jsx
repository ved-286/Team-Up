import React, { useEffect, useState } from "react";
import AvatarPicker from "../components/AvatarPicker";
import { getProfile, updateProfile } from "../services/userService";

const SettingsPage = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getProfile();
        setUser(res.user);
        setUsername(res.username);
        setAvatar(res.avatar);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    try {
      const res = await updateProfile({
        username,
        avatar,
      });
      setUser(res.user);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-8">{error}</div>;

  return (
    <div className="max-w-md mx-auto mt-8 space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>

      <div>
        <label className="block font-semibold mb-1">Username</label>
        <input
          className="border p-2 w-full rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div>
        <AvatarPicker currentAvatar={avatar} onSelect={setAvatar} />
      </div>

      <div>
        <h4 className="font-semibold mb-2">Current Avatar Preview</h4>
        <img src={avatar} alt="Selected Avatar" className="w-20 h-20 rounded-full border" />
      </div>

      <button
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        onClick={handleSave}
      >
        Save Settings
      </button>
    </div>
  );
};

export default SettingsPage;
