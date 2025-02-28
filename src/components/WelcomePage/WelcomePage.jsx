import "./WelcomePage.css";

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
      <button onClick={handleStartClick} className="welcome-btn btn-start">
        <span>Click!</span>
        <span>Let's get started!</span>
      </button>
    </div>
  );
};

export default WelcomePage;
