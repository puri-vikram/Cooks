import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { loader } from "../redux/Loader/loader.actions";
import { connect } from "react-redux";
function Contactus(props) {
  const { t } = useTranslation();
  const [alert, setAlert] = useState(false);
  const { REACT_APP_API_URL } = process.env;

  if (alert) {
    setTimeout(() => {
      setAlert(false);
    }, 2000);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const sendContact = async (detail) => {
    return fetch(`${REACT_APP_API_URL}api/contact-us`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(detail),
    });
  };
  const contactSubmit = async () => {
    props.loader(true);
    const token = await sendContact(getValues())
      .then((data) => data.json())
      .then((res) => {
        if (res.status === false) {
          props.loader(false);
          setError("serverError", { type: "focus", message: res.message });
        } else {
          props.loader(false);
          setAlert(true);
          document.forms["contact"].reset();
          setValue("fullname", "");
          setValue("email", "");
          setValue("subject", "");
          setValue("message", "");
        }
      });
  };

  return (
    <div>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="row">
              <div className="col-md-12">
                <div className="contact-us-wrapper">
                  <h2 className="heading-color fw-bold my-5">
                    {t("contact.title")}
                  </h2>
                </div>
                <form name="contact" onSubmit={handleSubmit(contactSubmit)}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label
                          htmlFor="name"
                          className="form-label heading-color fw-bold"
                        >
                          {t("contact.name")}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={t("contact.enter_name")}
                          id="name"
                          name="nameC"
                          {...register("fullname", {
                            required: true,
                            pattern: /^[A-Za-z]|[A-Za-z][A-Za-z\s]*[A-Za-z]$/,
                          })}
                        />
                        {errors.fullname &&
                          errors.fullname.type === "required" && (
                            <p className="errorMsg mb-0 mt-2 text-danger">
                              {t("contact.validation1")}
                            </p>
                          )}
                        {errors.fullname &&
                          errors.fullname.type === "pattern" && (
                            <p className="errorMsg mb-0 mt-2 text-danger">
                              {t("contact.validation2")}
                            </p>
                          )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label
                          htmlFor="exampleInputEmail1"
                          className="form-label heading-color fw-bold"
                        >
                          {t("contact.email")}
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder={t("contact.enter_email")}
                          id="exampleInputEmail1"
                          name="emailC"
                          {...register("email", {
                            required: true,
                            pattern:
                              /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
                          })}
                        />
                        {errors.email && errors.email.type === "required" && (
                          <p className="errorMsg mb-0 mt-2 text-danger">
                            {t("contact.validation3")}
                          </p>
                        )}
                        {errors.email && errors.email.type === "pattern" && (
                          <p className="errorMsg mb-0 mt-2 text-danger">
                            {t("contact.validation4")}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="mb-3">
                        <label
                          htmlFor="subject"
                          className="form-label heading-color fw-bold"
                        >
                          {t("contact.subject")}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={t("contact.enter_subject")}
                          id="subject"
                          name="subjectC"
                          {...register("subject", {
                            required: true,
                            pattern: /^[A-Za-z]|[A-Za-z][A-Za-z\s]*[A-Za-z]$/,
                          })}
                        />
                        {errors.subject &&
                          errors.subject.type === "required" && (
                            <p className="errorMsg mb-0 mt-2 text-danger">
                              {t("contact.validation5")}
                            </p>
                          )}
                        {errors.subject &&
                          errors.subject.type === "pattern" && (
                            <p className="errorMsg mb-0 mt-2 text-danger">
                              {t("contact.validation6")}
                            </p>
                          )}
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="mb-3">
                        <label
                          htmlFor="exampleFormControlTextarea1"
                          className="form-label heading-color fw-bold"
                        >
                          {t("contact.message")}
                        </label>
                        <textarea
                          className="form-control"
                          id="exampleFormControlTextarea1"
                          name="messageC"
                          placeholder={t("contact.enter_message")}
                          rows="8"
                          {...register("message", {
                            required: true,
                            pattern: /^[A-Za-z]|[A-Za-z][A-Za-z\s]*[A-Za-z]$/,
                          })}
                        />
                        {errors.message &&
                          errors.message.type === "required" && (
                            <p className="errorMsg mb-0 mt-2 text-danger">
                              {t("contact.validation7")}
                            </p>
                          )}
                        {errors.message &&
                          errors.message.type === "pattern" && (
                            <p className="errorMsg mb-0 mt-2 text-danger">
                              {t("contact.validation8")}
                            </p>
                          )}
                      </div>
                    </div>

                    {alert ? (
                      <p className="errorMsg mb-0 mt-2 text-success">
                        {t("contact.success")}
                      </p>
                    ) : (
                      ""
                    )}

                    <div className="text-end mb-5 mt-4">
                      <button type="submit" className="btn btn-success">
                        {t("contact.submit")}
                      </button>
                    </div>
                  </div>
                </form>
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
export default connect(mapStateToProps, mapDispatchToProps)(Contactus);
