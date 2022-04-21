import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { saveUser, destroyUser } from "../redux/User/user.actions";
import { loader } from "../redux/Loader/loader.actions";
// import { Navigate,  } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
const { REACT_APP_API_URL } = process.env;

async function loginUser(credentials) {
  return fetch(`${REACT_APP_API_URL}api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
}

function Login(props) {
  const { t } = useTranslation();
  let navigate = useNavigate();
  const {
    watch,
    register,
    handleSubmit,
    setError,
    getValues,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const [passwordType, setPasswordType] = useState("password");

  React.useEffect(() => {
    if (window.location.href.indexOf("/?status=email-updated") > -1) {
      toast.success('Please verify your email.');
    }
    if (window.location.href.indexOf("login?status=user-deleted") > -1) {
      localStorage.clear();
      props.destroyUser();
      toast.success('Your account has been deleted by admin.');
    }
    if (window.location.href.indexOf("login?status=password-changed") > -1) {
      localStorage.clear();
      props.destroyUser();
      toast.success('Your password has been changed by admin.');
    }
    window.scrollTo(0, 0)
  }, [])

  const onSubmit = async (e) => {
    props.loader(true);
    const token = await loginUser(getValues())
      .then((data) => data.json())
      .then((res) => {
        if (res.status == false) {
          props.loader(false);
          setError("serverError", { type: "focus", message: res.message });
        } else {
          props.loader(false);
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("cuser", JSON.stringify(res.data));
          props.saveUser(res.data);
          if (res.data.role === "user") {
            navigate("/cookreact/cook-list", { replace: true });
          }
          else {
            navigate("/cookreact/cook-dashboard", { replace: true });
          }
        }
      });
  };
  React.useEffect(() => {
    watch((value, { name, type }) => clearErrors("serverError"));
  }, [watch]);

  return (
    <div>
      <div className="container"><ToastContainer />
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="row justify-content-center">
              <div className="col-md-10">
                <div className="login-wrapper">
                  <h2 className="heading-color fw-bold mb-3">{t("login.login")}</h2>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                      <div className="input-group">
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          placeholder={t("login.email")}
                          aria-label="email"
                          aria-describedby="basic-addon1"
                          {...register("email", {
                            required: true,
                            pattern:
                              /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
                          })}
                        />
                        <span className="input-group-text" id="basic-addon1">
                          <i className="bi bi-envelope-fill text-color"></i>
                        </span>
                      </div>
                      {errors.email && errors.email.type === "required" && (
                        <p className="errorMsg mb-0 mt-2 text-danger">
                          {t("login.validation1")}
                        </p>
                      )}
                      {errors.email && errors.email.type === "pattern" && (
                        <p className="errorMsg mb-0 mt-2 text-danger">
                          {t("login.validation2")}
                        </p>
                      )}
                    </div>

                    <div className="mb-3">
                      <div className="input-group">
                        <input
                          type={passwordType}
                          name="password"
                          id="password"
                          className="form-control"
                          placeholder={t("login.password")}
                          aria-label="password"
                          aria-describedby="basic-addon1"
                          {...register("password", {
                            required: true,
                            minLength: 6,
                          })}
                        />
                        <span className="input-group-text --cursor-pointer" id="basic-addon1" onClick={() => passwordType === "password" ? setPasswordType("text") : setPasswordType("password")}>
                          {passwordType === "password" ? <i className="bi bi-eye-fill text-color"></i> : <i className="bi bi-eye-slash-fill text-color"></i>}
                        </span>
                      </div>
                      {errors.password &&
                        errors.password.type === "required" && (
                          <p className="errorMsg mt-2 mb-0 text-danger">
                            {t("login.validation3")}
                          </p>
                        )}
                      {errors.password &&
                        errors.password.type === "minLength" && (
                          <p className="errorMsg mt-2 mb-0 text-danger">
                            {t("login.validation4")}
                          </p>
                        )}
                      {errors.serverError &&
                        errors.serverError.type === "focus" && (
                          <p className="errorMsg mt-2 mb-0 text-danger">
                            {errors.serverError.message}
                          </p>
                        )}
                    </div>
                    <button
                      type="submit"
                      className="btn btn-success w-100 mt-2"
                    >
                      Login
                    </button>

                    <div className="forgot-password text-center mt-3">
                      <Link to="/cookreact/forgot">{t("login.forgot")}</Link>
                    </div>
                  </form>

                  <div className="text-center mt-4 sign-up-option">
                    <p>
                    {t("login.account")}
                      <Link to="/cookreact/signup">{t("login.signup")}</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
const mapStateToProps = state => {}
const mapDispatchToProps = (dispatch) => {
  return {
    saveUser: (payload) => dispatch(saveUser(payload)),
    destroyUser: () => dispatch(destroyUser()),
    loader: (payload)=> dispatch(loader(payload))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);
// export default Login;
