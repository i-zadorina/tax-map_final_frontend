import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <p className="footer__text">*According to the data from </p>
      <a
        href="https://taxsummaries.pwc.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="footer__link"
      >
        PWC website
      </a>
      <p className="footer__text"> and </p>
      <a
        href="https://www.ey.com/content/dam/ey-unified-site/ey-com/en-gl/technical/tax/documents/ey-worldwide-personal-tax-and-immigration-guide-april-2024-v1.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="footer__link"
      >
        Worldwide Personal Tax and Immigration Guide 2023-2024
      </a>
    </footer>
  );
}

export default Footer;
