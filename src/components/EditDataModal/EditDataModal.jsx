import { useEffect, useContext } from "react";
import { useForm } from "../../hooks/UseForm";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

function EditDataModal({
  isOpen,
  onClose,
  updateData,
  activeModal,
  isLoading,
}) {
  const { currentUser } = useContext(CurrentUserContext);

  const { values, handleChange, setValues } = useForm({
    income: currentUser.income || "",
    status: currentUser.status || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateData(values);
    onClose();
  };

  useEffect(() => {
    setValues({
      income: currentUser.income || "",
      status: currentUser.status || "",
    });
  }, [currentUser, setValues]);

  return (
    <ModalWithForm
      title="Change Data"
      name={"edit-data"}
      buttonText={isLoading ? "Saving..." : "Save changes"}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      activeModal={activeModal}
    >
      <label className="modal__label">
        Annual Income *{" "}
        <input
          className="modal__input"
          id="edit-income"
          type="text"
          name="income"
          placeholder="Annual Income"
          minLength="2"
          maxLength="40"
          required
          value={values.income}
          onChange={handleChange}
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
            checked={values.status === "single"}
            onChange={handleStatus}
          />{" "}
          Single
        </label>
        <label className="modal__label modal__label_type_radio">
          <input
            id="married"
            type="radio"
            name="status"
            className="modal__radio-input"
            value="married"
            checked={values.status === "married"}
            onChange={handleStatus}
          />{" "}
          Married
        </label>
      </fieldset>
    </ModalWithForm>
  );
}

export default EditDataModal;
