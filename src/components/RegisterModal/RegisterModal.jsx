import { useForm } from "../../hooks/UseForm";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./RegisterModal.css";

const Register = ({
  isOpen,
  handleRegistration,
  onClose,
  handleLoginClick,
  activeModal,
  isLoading,
}) => {
  const { values, handleChange } = useForm({
    email: "",
    password: "",
    income: 0,
    status: "",
  });

  const handleChangeNumber = (e) => {
    const { name, value } = e.target;
    handleChange({
      target: {
        name,
        value: name === "income" ? Number(value) || 0 : value,
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegistration(values);
    onClose();
  };

  return (
    <ModalWithForm
      titleText="Sign Up"
      buttonText={isLoading ? "Signing up..." : "Sign Up"}
      onClose={onClose}
      isOpen={isOpen}
      onSubmit={handleSubmit}
      activeModal={activeModal}
    >
      <label className="modal__input_type_email">
        <input
          type="email"
          className="modal__input"
          id="email"
          placeholder="Email*"
          required
          value={values.email}
          onChange={handleChange}
          name="email"
        />
      </label>
      <label className="modal__input_type_password">
        <input
          type="password"
          className="modal__input"
          id="password"
          placeholder="Password*"
          required
          value={values.password}
          onChange={handleChange}
          name="password"
        />
      </label>
      <label className="modal__input_type_name">
        <input
          type="number"
          className="modal__input"
          id="income"
          placeholder="Annual income, $*"
          required
          value={values.income || ""}
          onChange={handleChangeNumber}
          name="income"
        />
      </label>
      <fieldset className="modal__radio-buttons">
        <legend className="modal__legend">Select the status:</legend>
        <label className="modal__label modal__label_type_radio">
          <input
            id="single"
            type="radio"
            name="status"
            className="modal__radio-input"
            value="single"
            required
            checked={values.status === "single"}
            onChange={handleChange}
          />
          <span className="modal__radio-text">Single</span>
        </label>
        <label className="modal__label modal__label_type_radio">
          <input
            id="married"
            type="radio"
            name="status"
            className="modal__radio-input"
            value="married"
            required
            checked={values.status === "married"}
            onChange={handleChange}
          />
          <span className="modal__radio-text">Married</span>
        </label>
      </fieldset>
      <button
        type="button"
        className="modal__or-button"
        onClick={handleLoginClick}
      >
        or Log In
      </button>
    </ModalWithForm>
  );
};

export default Register;
