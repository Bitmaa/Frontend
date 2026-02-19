// src/pages/Upload.js
import React, { useState } from "react";
import API from "../services/axios";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState(""); // optional, if you want
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (caption) formData.append("caption", caption);

      const res = await API.post("/media", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Upload successful!");
      setFile(null);
      setCaption("");
      console.log(res.data);
    } catch (err) {
      console.error("Upload error:", err.response?.data);
      setMessage(
        err.response?.data?.message || "Upload failed. Are you logged in?"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Media</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} required />
        <input
          type="text"
          placeholder="Caption (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default Upload;
