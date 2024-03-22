import React, { useEffect, useState } from "react";
import Key, { KeyProps } from "./Key";
import "./Keys.css";
import { CreateAPIKeyModal } from "../Modal/Modals";
import { trpc } from "../../utils/trpc";

const KeysSection: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal((prevShowModal) => !prevShowModal);

  const [keys, setKeys] = useState<KeyProps[]>([]);
  const { data: { data: resp } = {} } = trpc.apikeys.getAPIKeys.useQuery();

  useEffect(() => {
    if (resp?.apiKeys) {
      setKeys(resp.apiKeys as KeyProps[]);
    }
  }, [resp]);

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
        {keys.map((key) => (
          <Key
            key={`${key.id}-${key.token}`}
            id={key.id}
            userId={key.userId}
            token={key.token}
            websiteUrl={key.websiteUrl}
            name={key.name}
            permissions={key.permissions}
            expiryDate={key.expiryDate}
            isActive={key.isActive}
            createdAt={key.createdAt}
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
