// src/components/Avatar.jsx

const Avatar = ({ email, size = 40 }) => {
  const url = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`;

  return (
    <img
      src={url}
      alt="User Avatar"
      width={size}
      height={size}
      className="rounded-full border border-white/10 shadow-md"
    />
  );
};

export default Avatar;
