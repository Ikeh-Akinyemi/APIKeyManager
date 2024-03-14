import React, { useState } from "react";
import "./Key.css"; // Confirm the CSS file path is correct

interface KeyProps {
  id: string;
  userId: string;
  keyVal: string;
  websiteUrl: string;
  name: string;
  permissions: string[];
  expiryDate: string;
  isActive: boolean;
  creationDate: string;
}

const Key: React.FC<KeyProps> = ({
  id,
  userId,
  keyVal,
  websiteUrl,
  name,
  permissions,
  expiryDate,
  isActive,
  creationDate,
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
        <p>{expiryDate}</p>
      </div>
      {showDetails && (
        <div className={`key-details ${showDetails ? "show" : ""}`}>
          <p>{keyVal}</p>
          <p>{permissions.join(", ")}</p>
          <p>{isActive ? "Active" : "Inactive"}</p>
          <p> {creationDate}</p>
        </div>
      )}
    </div>
  );
};

export default Key;
