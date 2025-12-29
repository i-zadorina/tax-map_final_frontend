import './WelcomePage.css';

const WelcomePage = ({ handleStartClick }) => {
  return (
    <div className="welcome">
      <h2 className="welcome__title">
        Thinking about changing your residency?
      </h2>
      <h3 className="welcome__subtitle">
        Use our TaxMap to check how much personal income tax&nbsp;(PIT) you will
        pay in your next country*
      </h3>
      <button
        onClick={handleStartClick}
        className="welcome-btn btn-start flip-btn"
      >
        <span className="flip" aria-hidden="true">
          <span className="face front">Let's get started!</span>
          <span className="face back">Click!</span>
        </span>
        <span className="sr-only">Let's get started!</span>
      </button>
    </div>
  );
};

export default WelcomePage;
