import React, { useState, useContext } from "react";
import API from "../services/api"; // ← updated
import { AuthContext } from "../context/AuthContext";

function Upload() {
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) return setError("Please select a file.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError("");

      const res = await API.post("/media", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload successful:", res.data);
      setFile(null);
      alert("Upload successful!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Upload Media</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}

export default Upload;
