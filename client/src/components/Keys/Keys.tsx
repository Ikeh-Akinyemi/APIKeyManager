import React, { useState } from "react";
import Key from "./Key";
import "./Keys.css";
import {CreateAPIKeyModal} from "../Modal/Modals";

// Example keys data with all properties
const keysData = [
  {
    id: "1",
    userId: "User1",
    key: "abc123",
    websiteUrl: "https://example.com",
    name: "API Key 1",
    permissions: ["read", "write"],
    expiryDate: "2023-07-01",
    isActive: true,
    creationDate: "2021-07-01",
  },
  {
    id: "2",
    userId: "User2",
    key: "def456",
    websiteUrl: "https://example.net",
    name: "API Key 2",
    permissions: ["read"],
    expiryDate: "2023-08-15",
    isActive: false,
    creationDate: "2021-08-15",
  },
  // Add more keys as needed
];

const KeysSection: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => setShowModal(!showModal);

  return (
    <>
      <div className="keys-section">
        <div className="keys-header">
          {" "}
          {/* Add this line for the header */}
          <span>Name</span>
          <span>Website</span>
          <span>Owner ID</span>
          <span>Expiry Date</span>
        </div>
        <div className="keys-detail-header">
          <span>↓Key Value</span>
          <span>↓Permissions</span>
          <span>↓Status</span>
          <span>↓Creation Date</span>
        </div>
        {keysData.map((key) => (
          <Key
            key={key.id}
            id={key.id}
            userId={key.userId}
            keyVal={key.key}
            websiteUrl={key.websiteUrl}
            name={key.name}
            permissions={key.permissions}
            expiryDate={key.expiryDate}
            isActive={key.isActive}
            creationDate={key.creationDate}
          />
        ))}
      </div>
      <button className="floating-action-button" onClick={toggleModal}>
        +
      </button>
      {showModal && <CreateAPIKeyModal closeModal={toggleModal} />}
    </>
  );
};

export default KeysSection;
