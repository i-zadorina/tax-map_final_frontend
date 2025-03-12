import "./ConfirmLogOutModal.css";

const ConfirmLogOutModal = ({ onClose, isOpen, handleLogOut }) => {
  const buttonConfirmText = "Yes, log out";
  const buttonCancel = "Cancel";

  return (
    <div className={`modal ${isOpen ? "modal_opened" : ""}`}>
      <div className="confirm-logout-modal">
        <button
          className="confirm-logout-modal__close-btn"
          type="button"
          onClick={onClose}
        ></button>
        <div className="confirm-logout-modal__container">
          <p>
            <span className="confirm-logout-modal__text">
              Are you sure you want to logout?
            </span>
            <span className="confirm-logout-modal__text small">
              This action is irreversible.
            </span>
          </p>
          <div className="confirm-logout-modal__buttons">
            <button
              className="confirm-logout-modal__delete"
              type="submit"
              onClick={handleLogOut}
            >
              {buttonConfirmText}
            </button>
            <button
              className="confirm-logout-modal__cancel"
              type="button"
              onClick={onClose}
            >
              {buttonCancel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLogOutModal;
