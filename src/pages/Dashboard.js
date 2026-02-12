import React, { useEffect, useState } from "react";
import API from "../services/axios";

function Dashboard() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get("/notifications");
        setNotifications(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Notifications ({notifications.length})</p>
      <ul>
        {notifications.map((n) => (
          <li key={n._id}>{n.message}</li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
