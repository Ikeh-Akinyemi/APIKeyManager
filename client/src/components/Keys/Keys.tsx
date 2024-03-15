import React, { useState } from "react";
import "./Keys.css";
import {CreateAPIKeyModal} from "../Modal/Modals";

const KeysSection: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => setShowModal(!showModal);

  return (
    <>
      <div className="keys-section">
        <div className="keys-header">
          {" "}
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
        {/* {keysData.map((key) => (
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
        ))} */}
      </div>
      <button className="floating-action-button" onClick={toggleModal}>
        +
      </button>
      {showModal && <CreateAPIKeyModal closeModal={toggleModal} />}
    </>
  );
};

export default KeysSection;
