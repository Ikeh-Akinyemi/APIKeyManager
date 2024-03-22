import { useEffect, useState } from "react";
import "./Modal.css";
import { trpc } from "../../utils/trpc";
import { saveAuthTokenToCookie } from "../../utils/helper";

interface CreateAPIKeyModalProps {
  closeModal: () => void;
}

interface FormData {
  name: string;
  websiteUrl: string;
}

const CreateAPIKeyModal: React.FC<CreateAPIKeyModalProps> = ({
  closeModal,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    websiteUrl: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const mutation = trpc.apikeys.createAPIKey.useMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate({
      websiteUrl: formData.websiteUrl,
      name: formData.name,
    });
    closeModal(); // Close the modal upon submission
  };

  useEffect(() => {
    if (mutation.isSuccess) {
      window.location.reload();
    }
  }, [mutation.isSuccess]);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            value={formData.name}
            onChange={handleInputChange}
          />
          <input
            type="url"
            name="websiteUrl"
            placeholder="Website URL"
            required
            value={formData.websiteUrl}
            onChange={handleInputChange}
          />

          <button type="submit" className="submit-btn">
            Submit
          </button>
          <button type="button" onClick={closeModal} className="cancel-btn">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

interface SignupModalProps {
  onClose: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const mutation = trpc.users.create.useMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.password,
    });
    onClose(); // Close the modal upon submission
  };

  return (
    <div className="sp_modal">
      <div className="sp_modal-content">
        <span className="sp_close" onClick={onClose}>
          &times;
        </span>
        <h2>Signup</h2>
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <input
            required
            value={formData.username}
            type="text"
            placeholder="Username"
            name="username"
            onChange={handleInputChange}
          />
          <input
            required
            value={formData.email}
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleInputChange}
          />
          <input
            required
            value={formData.password}
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleInputChange}
          />
          <button type="submit">Signup</button>
        </form>
      </div>
    </div>
  );
};

const LoginModal: React.FC<SignupModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    password: "",
    username: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const mutation = trpc.auth.login.useMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate({
      username: formData.username,
      password: formData.password,
    });
  };

  useEffect(() => {
    if (mutation.isSuccess) {
      const accessToken = mutation.data?.data.accessToken;
      if (accessToken) {
        saveAuthTokenToCookie({
          token: accessToken.token,
          expiryTime: accessToken.expiryTime,
        });
      }
      onClose(); // Close the modal upon successful submission
    }
  }, [mutation.isSuccess, mutation.data, onClose]);

  return (
    <div className="sp_modal">
      <div className="sp_modal-content">
        <span className="sp_close" onClick={onClose}>
          &times;
        </span>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <input
            required
            value={formData.username}
            name="username"
            type="text"
            placeholder="Username"
            onChange={handleInputChange}
          />
          <input
            required
            value={formData.password}
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleInputChange}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export { CreateAPIKeyModal, SignupModal, LoginModal };
