import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { saveUser } from "../redux/User/user.actions";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { loader } from "../redux/Loader/loader.actions";
const { REACT_APP_API_URL } = process.env;

// Sending details for user registration 
async function registerUser(details) {
  return fetch(`${REACT_APP_API_URL}api/register/${details.type}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(details),
  });
}
// Sending details for cook registration 
async function registerCook(details) {
  return fetch(`${REACT_APP_API_URL}api/register/cook/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(details),
  });
}
function Signup(props) {
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

  const [passwordType,setPasswordType]=useState("password");

  //  Register function
  const onSubmit = async (e) => {
    const submittedData = getValues();
    if (submittedData.type === "user") {    // If it's a user 
      setValue("lat", "-104.9903", { shouldValidate: false, shouldDirty: false });
      setValue("lng", "39.7392", { shouldValidate: false, shouldDirty: false });
      props.loader(true);
      const token = await registerUser(getValues())
        .then((data) => data.json())
        .then((res) => {
          if (res.status == false) {
            props.loader(false);
            setError("serverError", { type: "focus", message: res.message });
          } else {
            // localStorage.setItem("token", res.token);
            // localStorage.setItem("cuser", JSON.stringify(res));
            // props.saveUser(res);
            props.loader(false);
            navigate("/cookreact/signup-success");
          }
        });
    }
    else {   //If it's a cook
      setValue("lat", "-104.9903", { shouldValidate: false, shouldDirty: false });
      setValue("lng", "39.7392", { shouldValidate: false, shouldDirty: false });
      props.loader(true);
      const token = await registerCook(getValues())
        .then((data) => data.json())
        .then((res) => {
          if (res.status == false) {
            props.loader(false);
            setError("serverError", { type: "focus", message: res.message });
          } else {
            // localStorage.setItem("token", res.token);
            // localStorage.setItem("cuser", JSON.stringify(res));
            // props.saveUser(res);
            props.loader(false);
            navigate("/cookreact/signup-success");
          }
        });
    }
  };
  React.useEffect(() => {
    watch((value, { name, type }) => clearErrors("serverError"));
  }, [watch]);
  return (
    <div>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="row justify-content-center">
              <div className="col-md-10">
                <div className="signup-wrapper">
                  <h2 className="heading-color fw-bold mb-3">{t("signup.signup")}</h2>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <div className="input-group">
                            <input
                              type="text"
                              name="firstname"
                              className="form-control"
                              placeholder={t("signup.firstname")}
                              aria-label="fname"
                              aria-describedby="basic-addon1"
                              onKeyUp={e => e.target.value = e.target.value.split(" ").join("")}
                              {...register("firstname", { required: true })}
                            />
                            <span
                              className="input-group-text"
                              id="basic-addon1"
                            >
                              <i className="bi bi-person-circle text-color"></i>
                            </span>
                          </div>
                          {errors.firstname &&
                            errors.firstname.type === "required" && (
                              <p className="errorMsg mb-0 mt-2 text-danger">
                                {t("signup.validation1")}
                              </p>
                            )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <div className="input-group">
                            <input
                              type="text"
                              name="lastname"
                              className="form-control"
                              placeholder={t("signup.lastname")}
                              aria-label="lname"
                              aria-describedby="basic-addon1"
                              onKeyUp={e => e.target.value = e.target.value.split(" ").join("")}
                              {...register("lastname", { required: true })}
                            />
                            <span
                              className="input-group-text"
                              id="basic-addon1"
                            >
                              <i className="bi bi-person-circle text-color"></i>
                            </span>
                          </div>
                          {errors.lastname &&
                            errors.lastname.type === "required" && (
                              <p className="errorMsg mb-0 mt-2 text-danger">
                                {t("signup.validation2")}
                              </p>
                            )}
                        </div>
                      </div>
                    </div>
                    <select
                      className="form-select form-select"
                      name="type"
                      defaultValue=""
                      aria-label="Default select example"
                      {...register("type", { required: true })}
                    >
                      <option disabled value="">
                      {t("signup.account")}
                      </option>
                      <option value="user">{t("signup.user")}</option>
                      <option value="cook">{t("signup.cook")}</option>
                    </select>
                    {errors.type && errors.type.type === "required" && (
                      <p className="errorMsg mb-0 mt-2 text-danger">
                        {t("signup.validation3")}
                      </p>
                    )}
                    <div className="my-3">
                      <div className="input-group">
                        <input
                          type="email"
                          className="form-control"
                          placeholder={t("signup.email")}
                          aria-label="email"
                          aria-describedby="basic-addon1"
                          name="email"
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
                          {t("signup.validation4")}
                        </p>
                      )}
                      {errors.email && errors.email.type === "pattern" && (
                        <p className="errorMsg mb-0 mt-2 text-danger">
                          {t("signup.validation5")}
                        </p>
                      )}
                    </div>
                    <div className="my-3">
                      <div className="input-group">
                        <input
                          type={passwordType}
                          name="password"
                          className="form-control"
                          placeholder={t("signup.password")}
                          aria-label="password"
                          aria-describedby="basic-addon1"
                          id="password"
                          {...register("password", {
                            required: true,
                            minLength: 6,
                          })}
                        />
                        <span className="input-group-text --cursor-pointer" id="basic-addon1" onClick={()=>passwordType==="password"?setPasswordType("text"):setPasswordType("password")}>
                          {passwordType==="password"?<i className="bi bi-eye-fill text-color"></i>:<i className="bi bi-eye-slash-fill text-color"></i>}
                        </span>
                      </div>
                      {errors.password &&
                        errors.password.type === "required" && (
                          <p className="errorMsg mt-2 mb-0 text-danger">
                            {t("signup.validation6")}
                          </p>
                        )}
                      {errors.password &&
                        errors.password.type === "minLength" && (
                          <p className="errorMsg mt-2 mb-0 text-danger">
                            {t("signup.validation7")}
                          </p>
                        )}
                      {errors.serverError &&
                        errors.serverError.type === "focus" && (
                          <p className="errorMsg mt-2 mb-0 text-danger">
                            {errors.serverError.message}
                          </p>
                        )}
                    </div>

                    <div className="Signup-button">
                      <button type="submit" className="btn btn-success w-100">
                        {t("signup.signup")}
                      </button>
                    </div>
                  </form>
                  <div className="text-center mt-4 sign-up-option">
                    <p>
                    {t("signup.already_account")}
                      <Link to="/cookreact/login">{t("login.login")}</Link>
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

const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch) => {
  return {
    saveUser: (payload) => dispatch(saveUser(payload)),
    loader: (payload)=> dispatch(loader(payload))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Signup);
