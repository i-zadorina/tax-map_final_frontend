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
  validationErrorText,
  setValidationErrorText,
}) => {
  const { values, handleChange, setValues } = useForm({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(values);
  };

  useEffect(() => {
    if (isOpen) {
      setValues({ email: "", password: "" });
      setValidationErrorText("");
    }
  }, [isOpen, setValues, setValidationErrorText]);

  return (
    <ModalWithForm
      titleText="Log In"
      buttonText={isLoading ? "Logging..." : "Log In"}
      onClose={onClose}
      isOpen={isOpen}
      onSubmit={handleSubmit}
      activeModal={activeModal}
      validationError={!!validationErrorText}
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
          onChange={handleChange}
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
          onChange={handleChange}
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
