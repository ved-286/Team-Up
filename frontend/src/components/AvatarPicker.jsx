// components/AvatarPicker.jsx
import React, { useState } from "react";

const AVATAR_OPTIONS = [
  "avatar1",
  "avatar2",
  "avatar3",
  "avatar4",
  "avatar5",
];

const AvatarPicker = ({ currentAvatar, onSelect }) => {
  const [selected, setSelected] = useState(currentAvatar);

  const handleSelect = (avatarName) => {
    const url = `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarName}.svg`;
    setSelected(url);
    onSelect(url);
  };

  return (
    <div>
      <h4 className="font-semibold mb-2">Select an Avatar</h4>
      <div className="flex gap-4 flex-wrap">
        {AVATAR_OPTIONS.map((avatar) => {
          const url = `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatar}.svg`;
          return (
            <div
              key={avatar}
              className={`border rounded-full p-1 cursor-pointer transition hover:scale-105 ${
                selected === url ? "ring-4 ring-blue-400" : ""
              }`}
              onClick={() => handleSelect(avatar)}
            >
              <img src={url} alt={avatar} className="w-16 h-16 rounded-full" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AvatarPicker;
