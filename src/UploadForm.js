import React, { useState } from "react";
import axios from "axios";

const UploadForm = ({ token, onUpload }) => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("caption", caption);

    try {
      await axios.post("http://localhost:9000/api/images/upload", formData, {
        headers: { Authorization: `
