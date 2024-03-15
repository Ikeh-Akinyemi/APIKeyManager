import React, {useState} from "react";
import "./Modal.css";

interface CreateAPIKeyModalProps {
  closeModal: () => void;
}

interface FormData {
  name: string;
  userId: string;
  websiteUrl: string;
  permissions: string;
  expiryDate: string;
  isActive: boolean;
}


const CreateAPIKeyModal: React.FC<CreateAPIKeyModalProps> = ({ closeModal }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    userId: '',
    websiteUrl: '',
    permissions: '',
    expiryDate: '',
    isActive: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Implement your form submission logic here
    closeModal(); 
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name" required value={formData.name} onChange={handleInputChange} />
          <input type="text" name="userId" placeholder="User ID" required value={formData.userId} onChange={handleInputChange} />
          <input type="url" name="websiteUrl" placeholder="Website URL" required value={formData.websiteUrl} onChange={handleInputChange} />
          <input type="text" name="permissions" placeholder="Permissions (comma-separated)" required value={formData.permissions} onChange={handleInputChange} />
          <input type="date" name="expiryDate" placeholder="Expiry Date" required value={formData.expiryDate} onChange={handleInputChange} />
          <div className="checkbox-container">
            <input type="checkbox" name="isActive" id="isActive" checked={formData.isActive} onChange={handleInputChange} />
            <label htmlFor="isActive">Active</label>
          </div>
          <button type="submit" className="submit-btn">Submit</button>
          <button type="button" onClick={closeModal} className="cancel-btn">Cancel</button>
        </form>
      </div>
    </div>
  );
};


interface SignupModalProps {
  onClose: () => void;
}

const SignupModal: React.FC<SignupModalProps>  = ({ onClose }) => {
  return (
    <div className="sp_modal">
      <div className="sp_modal-content">
        <span className="sp_close" onClick={onClose}>&times;</span>
        <h2>Signup</h2>
        <form>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit">Signup</button>
        </form>
      </div>
    </div>
  );
};

const LoginModal: React.FC<SignupModalProps>  = ({ onClose }) => {
  return (
    <div className="sp_modal">
      <div className="sp_modal-content">
        <span className="sp_close" onClick={onClose}>&times;</span>
        <h2>Login</h2>
        <form>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export {
  CreateAPIKeyModal,
  SignupModal,
  LoginModal
};

