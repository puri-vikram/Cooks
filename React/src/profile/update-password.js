import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { loader } from "../redux/Loader/loader.actions";
import { connect } from "react-redux";
function UpdatePassword(props) {
  const { t } = useTranslation();
  const { REACT_APP_API_URL } = process.env;
  const [successMessage, setSuccessMessage] = useState(false);
  if (successMessage) {
    setTimeout(() => {
      setSuccessMessage(false);
    }, 2000);
  }
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

  const removeDisable=()=>{
    setTimeout(()=>{document.getElementById("deleteButton").removeAttribute("disabled","")},4000)
  }

  const new_password = useRef({});
  new_password.current = watch("new_password", "");

  async function resetPassword(credentials) {
    return fetch(`${REACT_APP_API_URL}api/update/password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify(credentials),
    });
  }
  const onSubmit = async () => {
    setValue("login_as", "user", { shouldValidate: false, shouldDirty: false });
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
          document.getElementById("deleteButton").setAttribute("disabled","");
          document.forms["resetPass"].reset();
          removeDisable();
        }
      });
  };


  React.useEffect(() => {
    watch((value, { name, type }) => clearErrors("serverError"));
  }, [watch]);

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <hr className="light-gray mt-3" />
            <h2 className="heading-color fw-bold mt-4">{t("profile.update_password")}</h2>
            <form name="resetPass" onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-md-4">
                  <div className="my-3">
                    <label
                      htmlFor="password"
                      className="form-label heading-color fw-bold"
                    >
                      {t("profile.current_password")}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Old Password"
                      name="password"
                      {...register("old_password", { required: true })}
                    />
                  </div>
                  {errors.old_password &&
                    errors.old_password.type === "required" && (
                      <p className="errorMsg mb-0 mt-2 text-danger">
                        {t("profile.validation1")}
                      </p>
                    )}
                </div>

                <div className="col-md-4">
                  <div className="my-3">
                    <label
                      htmlFor="new-password"
                      className="form-label heading-color fw-bold"
                    >
                      {t("profile.new_password")}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="new-password"
                      placeholder="New Password"
                      name="password"
                      
                      {...register("new_password", {
                        required: true,
                        minLength: 6,
                      })}
                    />
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

                <div className="col-md-4">
                  <div className="my-3">
                    <label
                      htmlFor="confirm-password"
                      className="form-label heading-color fw-bold"
                    >
                      {t("profile.confirm_password")}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirm-password"
                      placeholder="Confirm Password"
                      name="password"
                      {...register("confirm_password", {
                        validate: (value) => value === new_password.current,
                        required: true,
                        minLength: 6,
                      })}
                    />
                  </div>
                  {errors.confirm_password &&
                    errors.confirm_password.type === "validate" && (
                      <p className="errorMsg mt-2 mb-0 text-danger">
                        {t("profile.validation4")}
                      </p>
                    )}
                  {errors.confirm_password &&
                    errors.confirm_password.type === "required" && (
                      <p className="errorMsg mt-2 mb-0 text-danger">
                        {t("profile.validation5")}
                      </p>
                    )}
                </div>
                {errors.serverError && errors.serverError.type === "focus" && (
                  <p className="errorMsg mt-2 mb-0 text-danger">
                    {errors.serverError.message}
                  </p>
                )}
                {successMessage ? (
                  <p className="text-success">{t("profile.updated_password")}</p>
                ) : (
                  ""
                )}
                <div className="text-end account-details-save mb-5 mt-3">
                  <button id="deleteButton" type="submit" className="btn btn-success">
                    {t("preferences.save")}
                  </button>
                </div>
              </div>
            </form>
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
export default connect(mapStateToProps, mapDispatchToProps)(UpdatePassword);
