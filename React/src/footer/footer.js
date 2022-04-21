import React from "react";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();
  const isConversation = window.location.pathname;
  return (
    <div className={(isConversation === '/conversations') ? 'conversation-footer footer-background' : 'footer-background'}>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
          <img src={`${window.location.origin}/cookreact/logo/book-your-cook-logo-white.png`} className="--logo-image mb-3" />
            <p className="footer-text-color">{t('footer.title')}</p>
          </div>

          <div className="col-md-3 offset-0 offset-md-1 mt-2 mt-md-0">
            <h5 className="text-white">{t('footer.links')}</h5>
            <ul className="ps-0">
              <li><Link to="/cookreact" className="footer-text-color ">{t('footer.home')}</Link></li>
              <li><Link to="/cookreact/about-us#" className="footer-text-color ">{t('footer.about')}</Link></li>
              <li><Link to="/cookreact/help" className="footer-text-color">{t('footer.help')}</Link></li>
              <li><Link to="/cookreact/contact-us" className="footer-text-color">{t('footer.contact')}</Link></li>
            </ul>
          </div>

          <div className="col-md-4">
            <h5 className="text-white mt-2 mt-md-0">{t('footer.contact')}</h5>
            <ul className="footer-text-color ps-0 mb-3">
              <li>{t('footer.call')}: 1800 41 99099</li>
              <li>{t('footer.week')}</li>
              <li> info@websitename.com</li>
            </ul>

            <h5 className="text-white mt-2 mt-md-0">{t('footer.connect')}</h5>
            <div className="d-flex mb-2">
              <div className="facebook-icon d-flex align-items-center justify-content-center me-2">
                <i className="fab fa-facebook text-white fs-7"></i>
              </div>

              <div className="instagram-icon d-flex align-items-center justify-content-center me-2">
                <i className="bi bi-instagram text-white fs-7"></i>
              </div>

              <div className="twitter-icon d-flex align-items-center justify-content-center me-2">
                <i className="bi bi-twitter text-white fs-7"></i>
              </div>

            </div>
          </div>
        </div>
        <hr className="bg-white">
        </hr>

        <div className="row copyright-section">
          <div className="col-md-6">
            <p className="footer-text-color mb-0 d-flex text-md-left text-center">&copy; {t('footer.copyright')}</p>
          </div>

          <div className="col-md-6">
            <ul className="ps-0 d-flex mb-0 justify-content-md-end justify-content-center">
              <li className="me-3"><Link to="/cookreact/privacy-policy" className="footer-text-color">{t('footer.privacy')}</Link></li>
              <li><Link to="/cookreact/terms-and-conditions" className="footer-text-color">{t('footer.terms')}</Link></li>
            </ul>
          </div>

        </div>
      </div>
    </div>


  )
};

export default Footer;