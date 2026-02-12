import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Connect to backend socket
const socket = io("http://localhost:9000");

function Feed() {
  const [mediaList, setMediaList] = useState([]);
  const [commentText, setCommentText] = useState("");

  // Replace this with the token from login
  const token = localStorage.getItem("token"); // or hardcode if needed

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await fetch("http://localhost:9000/api/media", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setMediaList(Array.isArray(data) ? data : []); // ensure array
      } catch (err) {
        console.error("Fetch media error:", err);
        setMediaList([]); // fallback
      }
    };

    fetchMedia();

    // Socket listeners
    socket.on("mediaUpdate", (media) => {
      setMediaList((prev) => [media, ...prev]);
    });

    socket.on("mediaLiked", ({ mediaId, likes }) => {
      setMediaList((prev) =>
        prev.map((m) => (m._id === mediaId ? { ...m, likes } : m))
      );
    });

    socket.on("mediaCommented", ({ mediaId, comments }) => {
      setMediaList((prev) =>
        prev.map((m) => (m._id === mediaId ? { ...m, comments } : m))
      );
    });

    return () => {
      socket.off("mediaUpdate");
      socket.off("mediaLiked");
      socket.off("mediaCommented");
    };
  }, [token]);

  const handleLike = (mediaId) => {
    socket.emit("likeMedia", { mediaId });
  };

  const handleComment = (mediaId) => {
    if (!commentText.trim()) return;
    socket.emit("commentMedia", { mediaId, text: commentText });
    setCommentText("");
  };

  return (
    <div className="feed-container">
      <h2>Media Feed</h2>

      {mediaList.length === 0 && <p>No media yet.</p>}

      {Array.isArray(mediaList) &&
        mediaList.map((media) => (
          <div key={media._id} className="feed-card">
            <p><strong>User:</strong> {media.user}</p>
            <p><strong>Caption:</strong> {media.caption}</p>

            {media.type === "image" ? (
              <img src={media.url} alt={media.caption} />
            ) : (
              <video src={media.url} controls />
            )}

            <div className="feed-actions">
              <button onClick={() => handleLike(media._id)}>
                ❤️ Like ({media.likes.length})
              </button>
            </div>

            <div className="feed-actions">
              <input
                type="text"
                placeholder="Add comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                style={{ flex: 1 }}
              />
              <button onClick={() => handleComment(media._id)}>
                💬 Comment
              </button>
            </div>

            <div style={{ marginTop: 10 }}>
              {media.comments.map((c, idx) => (
                <p key={idx}>
                  <strong>{c.user}:</strong> {c.text}
                </p>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}

export default Feed;
