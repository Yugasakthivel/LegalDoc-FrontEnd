import React from "react";
import "./ProfileCard.css";

function ProfileCard({ names, emails, phones, orgs, dates }) {
  return (
    <div className="profile-card">
      <h2>{names[0] || "Unknown Name"}</h2>
      <p><strong>Email:</strong> {emails.join(", ") || "N/A"}</p>
      <p><strong>Phone:</strong> {phones.join(", ") || "N/A"}</p>
      <p><strong>Organization:</strong> {orgs.join(", ") || "N/A"}</p>
      <p><strong>Dates:</strong> {dates.join(", ") || "N/A"}</p>
    </div>
  );
}

export default ProfileCard;
