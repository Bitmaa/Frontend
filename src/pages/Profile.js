import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/axios";

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    bio: "",
    avatar: ""
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        avatar: user.avatar || ""
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, avatar: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("email", form.email);
      data.append("bio", form.bio);
      if (form.avatar) data.append("avatar", form.avatar);

      const res = await API.put("/auth/profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(res.data.user);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>My Profile</h2>
      {message && <p className="success">{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="bio"
          placeholder="Bio"
          value={form.bio}
          onChange={handleChange}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
        />
        <button>Update Profile</button>
      </form>
    </div>
  );
}
