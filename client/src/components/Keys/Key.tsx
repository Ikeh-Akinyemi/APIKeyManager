import React, { useState } from "react";
import "./Key.css"; // Confirm the CSS file path is correct

export interface KeyProps {
  id: string;
  userId: string;
  token: string;
  websiteUrl: string;
  name: string;
  permissions: string[];
  expiryDate: string;
  isActive: boolean;
  createdAt: string;
}

const Key: React.FC<KeyProps> = ({
  userId,
  token,
  websiteUrl,
  name,
  permissions,
  expiryDate,
  isActive,
  createdAt,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="key" onClick={toggleDetails}>
      <div className="key-summary">
        <p>{name}</p>
        <p>{websiteUrl}</p>
        <p>{userId}</p>
        <p>{expiryDate.substring(0, 10)}</p>
      </div>
      {showDetails && (
        <div className={`key-details ${showDetails ? "show" : ""}`}>
          <p className="token">{token}</p>
          <p>{permissions.join(", ")}</p>
          <p>{isActive ? "Active" : "Inactive"}</p>
          <p> {createdAt.substring(0, 10)}</p>
        </div>
      )}
    </div>
  );
};

export default Key;
