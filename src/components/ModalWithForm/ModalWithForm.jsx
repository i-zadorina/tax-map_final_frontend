import "./ModalWithForm.css";

function ModalWithForm({
  children,
  buttonText,
  titleText,
  isOpen,
  onSubmit,
  onClose,
  validationError,
  validationErrorText,
}) {
  return (
    <div className={`modal ${isOpen && "modal_opened"}`}>
      <div className="modal__content">
        <h2 className="modal__title">{titleText}</h2>
        <button onClick={onClose} className="modal__close" type="button" />
        <form className="modal__form" onSubmit={onSubmit}>
          {children}
          {validationError ? (
            <span className="modal__form_error-span">
              {validationErrorText}
            </span>
          ) : (
            " "
          )}
          <button
            type="submit"
            className="modal__submit modal__submit_disabled"
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}
export default ModalWithForm;
