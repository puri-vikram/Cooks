import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import { loader } from "../redux/Loader/loader.actions";
import { connect } from "react-redux";
const { REACT_APP_API_URL } = process.env;

async function reset(detail) {
  return fetch(`${REACT_APP_API_URL}api/forgot/password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(detail)
  });
};

function ForgotPassword(props) {
  const { t } = useTranslation();
  const [serverError, setServerError] = useState(null);
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

  const forgotFunc = async e => {
    setValue('login_as', 'user', { shouldValidate: false, shouldDirty: false })
    props.loader(true);
    const token = await reset(getValues())
      .then(data => data.json())
      .then(res => {
        if (res.status == false) {
          props.loader(false);
          setServerError(res.message)
        }
        else {
          props.loader(false);
          document.forms["forgot"].reset();
          toast.success('Please check your email');
          // setModal("modal")
        }
      })
  };


  return (
    <div>
      <div className="container">
        <ToastContainer />
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="row justify-content-center">
              <div className="col-md-10">
                <div className="forgot-password-wrapper">
                  <h3 className="heading-color fw-bold mt-5">
                    {t("forgot_password.title")}
                  </h3>
                  <form name="forgot" onSubmit={handleSubmit(forgotFunc)}>
                    <div className="mb-3 mt-4">
                      <div className="input-group">
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          placeholder={t("login.email")}
                          aria-label="email"
                          aria-describedby="basic-addon1"
                          onKeyDown={() => serverError !== null && setServerError(null)}
                          {...register("email", {
                            required: true, pattern:
                              /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/
                          })}
                        />

                        <span className="input-group-text" id="basic-addon1">
                          <i className="bi bi-envelope-fill text-color"></i>
                        </span>
                      </div>
                      {errors.email && errors.email.type === "pattern" && (
                        <p className="errorMsg mb-0 mt-2 text-danger">
                          {t("login.validation2")}
                        </p>
                      )}
                      {errors.email && errors.email.type === "required" && (
                        <p className="errorMsg mb-0 mt-2 text-danger">{t("login.validation1")}</p>
                      )}
                      {serverError !== null && (
                        <p className="errorMsg mb-0 mt-2 text-danger">{serverError}</p>
                      )}
                    </div>

                    <div className="reset-password-alert">
                      <button
                        type="submit"
                        className="btn btn-success w-100 mt-2 mb-5 py-2"
                      >
                        {t("forgot_password.send_link")}
                      </button>

                      <div
                        className="modal fade"
                        id="exampleModal"
                        tabIndex="-1"
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header border-0 alert alert-success mb-0">
                              <h6
                                className="modal-title "
                                id="exampleModalLabel"
                              >
                                <i className="bi bi-check-circle-fill"></i>{" "}
                                {t("forgot_password.validation1")}
                              </h6>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              ></button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
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
export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
