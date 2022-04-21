import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { loader } from "../redux/Loader/loader.actions";
import { connect } from "react-redux";
function ResetPassword(props) {
  const { t } = useTranslation();
  const { REACT_APP_API_URL } = process.env;
  const [successMessage, setSuccessMessage] = useState(false);
  if (successMessage) {
    setTimeout(() => {
      setSuccessMessage(false);
    }, 2000);
  }
  // Show Password
  const [newPassType, setNewPassType] = useState("password");
  const [confirmPassType, setConfirmPassType] = useState("password");
  // Show Password ends here

  // Fetching otp
  const [searchParams] = useSearchParams();
  const otp = searchParams.get("otp");
  const email = searchParams.get("email");
  // Fetching otp ends here

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

  // Matching new password with confirm password
  const new_password = useRef({});
  new_password.current = watch("new_password", "");
  // Matching new password with confirm password ends here

  async function resetPassword(credentials) {
    return fetch(`${REACT_APP_API_URL}api/reset/password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify(credentials),
    });
  }
  const onSubmit = async () => {
    setValue("email", email, {
      shouldValidate: false,
      shouldDirty: false,
    });
    setValue("reset_code", otp, {
      shouldValidate: false,
      shouldDirty: false,
    });
    props.loader(true);
    const token = await resetPassword(getValues())
      .then((data) => data.json())
      .then((res) => {
        if (res.status == false) {
          props.loader(false);
          setError("serverError", { type: "focus", message: res.message });
        } else {
          props.loader(false);
          setSuccessMessage(true);
          document.forms["resetPass"].reset();
        }
      });
  };

  return (
    <div>
      <div className="container">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="row justify-content-center">
                <div className="col-md-10">
                  <div className="forgot-password-wrapper">
                    <h3 className="heading-color fw-bold mt-5">
                      {t("reset_password.title")}
                    </h3>
                    <form name="resetPass" onSubmit={handleSubmit(onSubmit)}>
                      <div className="mb-3">
                        <div className="input-group">
                          <input
                            type={newPassType}
                            name="password"
                            className="form-control"
                            placeholder={t("profile.new_password")}
                            aria-label="password"
                            aria-describedby="basic-addon1"
                            {...register("new_password", {
                              required: true,
                              minLength: 6,
                            })}
                          />
                          <span
                            className="input-group-text"
                            id="basic-addon1"
                            onClick={() =>
                              newPassType === "password"
                                ? setNewPassType("text")
                                : setNewPassType("password")
                            }
                          >
                            <i className="bi bi-eye-slash-fill text-color"></i>
                          </span>
                        </div>
                        {errors.new_password &&
                          errors.new_password.type === "required" && (
                            <p className="errorMsg mb-0 mt-2 text-danger">
                              {t("profile.validation2")}
                            </p>
                          )}
                        {errors.new_password &&
                          errors.new_password.type === "minLength" && (
                            <p className="errorMsg mt-2 mb-0 text-danger">
                              {t("profile.validation3")}
                            </p>
                          )}
                      </div>

                      <div className="mb-3">
                        <div className="input-group">
                          <input
                            type={confirmPassType}
                            name="password"
                            className="form-control"
                            placeholder={t("profile.confirm_password")}
                            aria-label="password"
                            aria-describedby="basic-addon1"
                            {...register("confirm_password", {
                              validate: (value) =>
                                value === new_password.current,
                              required: true,
                              minLength: 6,
                            })}
                          />

                          <span
                            className="input-group-text"
                            id="basic-addon1"
                            onClick={() =>
                              confirmPassType === "password"
                                ? setConfirmPassType("text")
                                : setConfirmPassType("password")
                            }
                          >
                            <i className="bi bi-eye-slash-fill text-color"></i>
                          </span>
                        </div>
                        {errors.confirm_password &&
                          errors.confirm_password.type === "validate" && (
                            <p className="errorMsg mt-2 mb-0 text-danger">
                              {t("profile.validation4")}
                            </p>
                          )}
                          {errors.confirm_password &&
                          errors.confirm_password.type === "minLength" && (
                            <p className="errorMsg mt-2 mb-0 text-danger">
                              {t("profile.validation3")}
                            </p>
                          )}
                        {errors.confirm_password &&
                          errors.confirm_password.type === "required" && (
                            <p className="errorMsg mt-2 mb-0 text-danger">
                              {t("reset_password.validation")}
                            </p>
                          )}
                      </div>
                      {errors.serverError &&
                        errors.serverError.type === "focus" && (
                          <p className="errorMsg mt-2 mb-0 text-danger">
                            {errors.serverError.message}
                          </p>
                        )}
                      {successMessage ? (
                        <p className="text-success">
                          {t("profile.updated_password")}
                        </p>
                      ) : (
                        ""
                      )}
                      <button
                        type="submit"
                        className="btn btn-success w-100 mt-2 mb-5 py-2"
                      >
                        {t("preferences.save")}
                      </button>
                    </form>
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
    loader: (payload)=> dispatch(loader(payload))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
