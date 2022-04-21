import React, { Suspense } from "react";
import { saveUser, destroyUser } from "../redux/User/user.actions";
import { connect } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import slideImg1 from "../public/header-logo.png";
import slideImg2 from "../public/US-flag.png";
import slideImg3 from "../public/russia.png";
import { useTranslation } from "react-i18next";
const { REACT_APP_API_URL } = process.env;
const lngs = {
  en: { nativeName: "English", flag: slideImg2 },
  ru: { nativeName: "Russian", flag: slideImg3 },
};
function Header(props) {
  const location = useLocation();
  let navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const logout = async (e) => {
    localStorage.clear();
    props.destroyUser();
    navigate("/cookreact/login");
  };
  const detectClick = () => {
    document.getElementById("navbarSupportedContent").classList.remove("show");
  }
  const path = location.pathname
  return (
    <div className="">
      <div className="container header-dropdown">
        <nav className="navbar navbar-expand-lg d-flex custom-border">
          <Link className="navbar-brand me-0" to="/cookreact">
            <img
              src={`${window.location.origin}/cookreact/logo/book-your-cook-logo.png`}
              className="--logo-image img-fluid header-logo"
            />
          </Link>

          <div className="d-flex align-items-center order-lg-2">
            <ul className=" d-flex ps-0 align-items-center mb-0 navbar custom-header">
              {props.user !== null &&
                <li className="nav-item me-1 ">
                  <Link
                    className=" text-color fs-7"
                    aria-current="page"
                    to="/cookreact/conversations"
                  >
                    <i className="bi bi-chat-square-text d-flex aling-items-center">
                      <i className="bi bi-circle-fill chat-notification-icon text-success"></i>
                    </i>
                  </Link>
                </li>
              }
              <div className="dropdown me-md-2">
                <button
                  className="btn dropdown-toggle text-color fs-7 p-0 px-md-2"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={i18n.resolvedLanguage == "en" ? slideImg2 : slideImg3}
                    className="img-fluid us-flag"
                  />{" "}
                  <span className="d-md-inline-block d-none eng-language">
                    {i18n.resolvedLanguage}
                  </span>
                </button>

                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="dropdownMenuButton1"
                >
                  {Object.keys(lngs).map((lng) => (
                    <li
                      key={lng}
                      style={{
                        fontWeight:
                          i18n.resolvedLanguage === lng ? "bold" : "normal",
                      }}
                      className="dropdown-item ps-2 --cursor-pointer"
                      onClick={() => i18n.changeLanguage(lng)}
                    >
                      <img
                        src={lngs[lng].flag}
                        className="img-fluid us-flag me-1"
                      />
                      {lngs[lng].nativeName}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="dropdown d-none">
                <button
                  className="btn dropdown-toggle text-color fs-6 p-0  mx-md-2"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle"></i>{" "}
                  <span className="d-md-inline-block d-none">Mohd</span>
                </button>

                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <li>
                    <Link className="dropdown-item ps-2" to="#">
                      English
                    </Link>
                  </li>

                  <li>
                    <Link className="dropdown-item ps-2" to="#">
                      Russian
                    </Link>
                  </li>
                </ul>
              </div>

              {props.user == null ? (
                <div className="d-flex align-items-center">
                  <li className="nav-item me-3 me-md-4">
                    <Link
                      className=" text-color fs-6 d-md-block d-none"
                      aria-current="page"
                      to="/cookreact/signup"
                    >
                      Sign up
                    </Link>
                  </li>
                  <form className="d-flex">
                    <Link
                      className="btn btn-success fs-6 button-shadow d-md-block d-none"
                      type="submit"
                      to="/cookreact/login"
                    >
                      Sign In
                    </Link>
                    <Link
                      className="text-color fs-7 fs-7 d-md-none d-block"
                      type="submit"
                      to="/cookreact/login"
                    >
                      <i className="bi bi-person-circle sign-in-icon me-3"></i>
                    </Link>
                  </form>
                </div>
              ) : (
                <div className="dropdown admin-dropdown d-flex align-items-center me-md-0 ">
                  <div className="login-user-img">
                    <img
                      src={
                        props.user.pictures === null
                          ? `${window.location.origin}/cookreact/user.png`
                          : `${REACT_APP_API_URL}${props.user.pictures}`
                      }
                      className="img-fluid"
                    />
                  </div>
                  <Link
                    className="btn dropdown-toggle text-capitalize d-flex aling-items-center"
                    to="#"
                    role="button"
                    id="dropdownMenuLink"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <span className="login-user-name d-md-block d-none">
                      {props.user.firstname}
                    </span>
                  </Link>

                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="dropdownMenuLink"
                  >
                    {props.user?.role === "user" ? (
                      <>
                        <li>
                          <Link
                            className="dropdown-item"
                            to="/cookreact/conversations"
                          >
                            Messages
                          </Link>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <Link
                            className="dropdown-item"
                            to="/cookreact/cook-dashboard"
                          >
                            Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            to="/cookreact/conversations"
                          >
                            Messages
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            to="/cookreact/preferences"
                          >
                            Preferences
                          </Link>
                        </li>
                      </>
                    )}
                    <li>
                      <Link className="dropdown-item" to="/cookreact/profile">
                        Account
                      </Link>
                    </li>
                    <li>
                      <Link
                        onClick={() => logout()}
                        className="btn fs-6 pt-0 d-md-inline-block dropdown-item ps-md-3 ps-3"
                        type="button"
                        to="/cookreact/login"
                      >
                        Logout
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </ul>

            <button
              className="navbar-toggler p-0"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon h-100 w-100">
                <i className="bi bi-list"></i>
              </span>
            </button>
          </div>

          <div
            className="collapse navbar-collapse order-md-1"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav me-auto mb-lg-0 ps-xl-5 ps-lg-4 ms-0">

              {props.user == null &&
                <li className="nav-item me-md-2 me-0">
                  <Link className={`nav-link active text-color fs-6 py-1 ${(path == '/' || path == '/cookreact') && 'text-success'}`} aria-current="page" onClick={() => detectClick()} to="/cookreact">{t('header.home')}</Link>
                </li>
              }
              {props.user?.role == 'cook' &&
                <>
                  <li className="nav-item me-md-2 me-0">
                    <Link
                      className={`nav-link active text-color fs-6 py-1 ${(path == '/' || path == '/cookreact') && 'text-success'}`}
                      aria-current="page" onClick={() => detectClick()} to={`${props.user?.role == 'cook' ? '/cookreact/cook-dashboard' : '/cookreact'}`}>
                      {t(props.user?.role == 'cook' ? `header.dashboard` : `header.home`)}
                    </Link>
                  </li>

                  <li className="nav-item me-md-2 me-0">
                    <Link
                      className={`nav-link text-color fs-6 py-1 ${(path == '/cookreact/cook-my-profile') && 'text-success'}`}
                      aria-current="page" onClick={() => detectClick()} to='/cookreact/cook-my-profile'>{t("header.my_profile")}</Link>
                  </li>
                </>
              }
              <li className="nav-item me-md-2 me-0">
                <Link className={`nav-link text-color fs-6 py-1 ${(path == '/cookreact/about-us') && 'text-success'}`} aria-current="page" onClick={() => detectClick()} to="/cookreact/about-us">{t('header.about')}</Link>
              </li>

              {/* {props.user?.role !== "cook" && (
                <> */}
                  <li className="nav-item me-md-2 me-0">
                    <Link className={`nav-link text-color fs-6 py-1 ${(path == '/cookreact/cook-list') && 'text-success'}`} aria-current="page" onClick={() => detectClick()} to="/cookreact/cook-list">{t('header.search_cooks')}</Link>
                  </li>

                  <li className="nav-item me-md-2 me-0">
                    <Link className={`nav-link text-color fs-6 py-1 ${(path == '/cookreact/top-featured-list') && 'text-success'}`} aria-current="page" onClick={() => detectClick()} to="/cookreact/top-featured-list">{t("header.top_cooks")}</Link>
                  </li>
                {/* </> */}
              {/* )} */}
              <li className="nav-item me-md-2 me-0">
                <Link className={`nav-link text-color fs-6 py-1 ${(path == '/cookreact/contact-us') && 'text-success'}`} aria-current="page" onClick={() => detectClick()} to="/cookreact/contact-us">{t('header.contact_us')}</Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    saveUser: (payload) => dispatch(saveUser(payload)),
    destroyUser: () => dispatch(destroyUser()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Header);
