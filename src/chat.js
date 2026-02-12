// src/components/Chat.js
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

// Backend URL
const SOCKET_URL = "http://localhost:9000";

let socket;

const Chat = ({ token }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    // Connect to Socket.IO server
    socket = io(SOCKET_URL, {
      auth: { token },
    });

    // Listen for incoming messages
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input && !file) return;

    let messageData = {
      user: "Me", // Replace with username from token if needed
      text: input,
      timestamp: new Date().toISOString(),
    };

    // Handle file upload
    if (file) {
      const formData = new FormData();
      formData.append("media", file);

      try {
        // Send to backend upload route
        const res = await fetch("http://localhost:9000/api/media/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await res.json();
        if (data.url) {
          messageData.media = data.url; // media file URL
          messageData.mediaType = file.type.split("/")[0]; // image, video, audio
        }
      } catch (err) {
        alert("File upload failed.");
      }
    }

    // Emit message
    socket.emit("sendMessage", messageData);
    setMessages((prev) => [...prev, messageData]);

    setInput("");
    setFile(null);
  };

  return (
    <div style={styles.chatBox}>
      <h2>Chat Room</h2>
      <div style={styles.messages}>
        {messages.map((msg, i) => (
          <div key={i} style={styles.message}>
            <strong>{msg.user}: </strong>
            {msg.text && <span>{msg.text}</span>}
            {msg.media && msg.mediaType === "image" && (
              <img src={msg.media} alt="media" style={styles.media} />
            )}
            {msg.media && msg.mediaType === "video" && (
              <video src={msg.media} controls style={styles.media} />
            )}
            {msg.media && msg.mediaType === "audio" && (
              <audio src={msg.media} controls style={styles.media} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} style={styles.form}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={styles.input}
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={styles.fileInput}
        />
        <button type="submit" style={styles.button}>
          Send
        </button>
      </form>
    </div>
  );
};

const styles = {
  chatBox: {
    border: "1px solid #ccc",
    padding: "10px",
    maxWidth: "600px",
    margin: "20px auto",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
  messages: {
    height: "300px",
    overflowY: "auto",
    marginBottom: "10px",
    padding: "5px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    backgroundColor: "#fff",
  },
  message: {
    marginBottom: "10px",
  },
  form: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  input: {
    flex: 1,
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  fileInput: {
    flex: 0.5,
  },
  button: {
    padding: "8px 12px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
  },
  media: {
    maxWidth: "100%",
    marginTop: "5px",
    borderRadius: "4px",
  },
};

export default Chat;
