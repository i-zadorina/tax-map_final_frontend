import { useEffect } from "react";
import { useForm } from "../../hooks/UseForm";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./LoginModal.css";

const Login = ({
  isOpen,
  handleLogin,
  handleRegisterClick,
  onClose,
  activeModal,
  isLoading,
  validationError,
  setValidationError,
}) => {
  const { values, handleChange, setValues } = useForm({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    handleChange(e);
    if (validationError) {
      setValidationError(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(values);
  };

  useEffect(() => {
    if (isOpen) {
      setValues({ email: "", password: "" });
      setValidationError(false);
    }
  }, [isOpen, setValues, setValidationError]);

  return (
    <ModalWithForm
      titleText="Log In"
      buttonText={isLoading ? "Logging..." : "Log In"}
      onClose={onClose}
      isOpen={isOpen}
      onSubmit={handleSubmit}
      activeModal={activeModal}
      validationError={validationError}
      validationErrorText="The email or password is incorrect"
    >
      <label className="modal__input_type_email">
        <input
          type="email"
          className="modal__input"
          id="email"
          name="email"
          placeholder="Email"
          required
          value={values.email}
          onChange={handleInputChange}
        />
      </label>
      <label className="modal__input_type_password">
        <input
          type="password"
          className="modal__input"
          id="password"
          name="password"
          placeholder="Password"
          required
          value={values.password}
          onChange={handleInputChange}
        />
      </label>
      <button
        type="button"
        onClick={handleRegisterClick}
        className="modal__or-button"
      >
        or Sign Up
      </button>
    </ModalWithForm>
  );
};
export default Login;
