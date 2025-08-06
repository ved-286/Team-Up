import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

// GET /api/users/me
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");
  res.status(200).json(user);
};

// PUT /api/users/update-profile
export const updateProfile = async (req, res) => {
  const { name, avatar, status } = req.body;

  const user = await User.findById(req.user.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = name || user.name;
  user.avatar = avatar || user.avatar;
  user.status = status || user.status;

  await user.save();
  res.json({ message: "Profile updated", user });
};

// PUT /api/users/change-password
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

  user.password = newPassword;
  await user.save();
  res.json({ message: "Password changed successfully" });
};
