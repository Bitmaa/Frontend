import React, { useState } from "react";
import API from "../services/axios";

function Upload() {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");

  // Get token from localStorage
  const token = localStorage.getItem("token");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", caption);

    try {
      const res = await API.post("/media", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // ✅ send token
        },
      });

      alert("Upload successful!");
      setFile(null);
      setCaption("");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed. Make sure you are logged in.");
    }
  };

  return (
    <div className="upload-form">
      <h2>Upload Media</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <input
          type="text"
          placeholder="Caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default Upload;
