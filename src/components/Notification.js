import React from "react";

function Notification({ message }) {
  return (
    <div style={{ padding: 10, margin: "10px 0", backgroundColor: "#FFD700", borderRadius: 5 }}>
      {message}
    </div>
  );
}

export default Notification;
