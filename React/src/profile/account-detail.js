import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveUser, destroyUser } from "../redux/User/user.actions";
import { Country, State, City } from "country-state-city";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import { useTranslation } from "react-i18next";
import { loader } from "../redux/Loader/loader.actions";
const { REACT_APP_API_URL } = process.env;

function AccountDetail(props) {
  const { t } = useTranslation();
  let navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);
  if (successMessage) {
    setTimeout(() => {
      setSuccessMessage(false);
    }, 2000);
  }

  const profile = JSON.parse(localStorage.getItem("cuser"));
  const [selectedCountry, setSelectedCountry] = useState(profile?.country);
  const [selectedState, setSelectedState] = useState(profile?.state);

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

  const removeDisable = () => {
    setTimeout(() => { document.getElementById("profileButton").removeAttribute("disabled", "") }, 4000)
  }

  // Updating user 
  async function updateUser(formData) {
    return fetch(`${REACT_APP_API_URL}api/update/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify(formData),
    });
  }

  const onSubmit = async (e) => {
    setValue("country", selectedCountry, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("state", selectedState, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("city", place?.label, {
      shouldValidate: true,
      shouldDirty: true
    });
    props.loader(true);
    const token = await updateUser(getValues())
      .then((data) => data.json())
      .then((res) => {
        if (res.status == false) {
          props.loader(false);
          setError("serverError", { type: "focus", message: res.message });
        } else {
          props.loader(false);
          if (res.isEmailUpdated == true) {
            localStorage.clear();
            props.destroyUser();
            navigate("/cookreact/login/?status=email-updated");
          } else {
            localStorage.setItem("cuser", JSON.stringify(res.data));
            props.saveUser(res.data);
            setSuccessMessage(true);
            document.getElementById("profileButton").setAttribute("disabled", "");
            removeDisable();
          }
        }
      });
  };
  // Updating user ends here

  // Updating cook 
  async function updateCook(formData) {
    return fetch(`${REACT_APP_API_URL}api/update/cook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify(formData),
    });
  }
  const onSubmit2 = async (e) => {
    setValue("country", selectedCountry, {
      shouldValidate: true,
      shouldDirty: true,

    });
    setValue("state", selectedState, {
      shouldValidate: true,
      shouldDirty: true
    });
    setValue("city", place?.label, {
      shouldValidate: true,
      shouldDirty: true
    });
    props.loader(true);
    const token = await updateCook(getValues())
      .then((data) => data.json())
      .then((res) => {
        if (res.status == false) {
          props.loader(false);
          setError("serverError", { type: "focus", message: res.message });
        } else {
          props.loader(false);
          if (res.isEmailUpdated == true) {
            localStorage.clear();
            props.destroyUser();
            navigate("/cookreact/login/?status=email-updated");
          } else {
            localStorage.setItem("cuser", JSON.stringify(res.data));
            props.saveUser(res.data);
            setSuccessMessage(true);
          }
        }
      });
  };
  // Updating cook ends here

  React.useEffect(() => {
    if (props.user != null) {
      setValue("firstname", props.user.firstname);
      setValue("lastname", props.user.lastname);
      setValue("email", props.user.email);
    }
  }, [props.user]);

  useEffect(() => {
    if (place !== null) {
      geocodeByAddress(place?.label)
        .then(results => getLatLng(results[0]))
        .then(({ lat, lng }) => {
          setValue("lat", lat, {
            shouldValidate: true,
            shouldDirty: true,
          });
          setValue("lng", lng, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
        );
    }
  }, [place])
  return (
    <div>
      <div className="container">
        <div className="account-details-wrapper">
          <div className="row">
            <div className="col-md-12">
              <h2 className="heading-color fw-bold">{t("profile.title")}</h2>
            </div>
            <form onSubmit={props.user.role === "user" ? handleSubmit(onSubmit) : handleSubmit(onSubmit2)}>
              <div className="row">
                <div className="col-md-4">
                  <div className="my-3">
                    <label
                      htmlFor="fname"
                      className="form-label heading-color fw-bold"
                    >
                      {t("signup.firstname")}
                    </label>
                    <input
                      type="text"
                      name="firstname"
                      className="form-control"
                      id="fname"
                      placeholder="Enter first name"
                      onKeyUp={e => e.target.value = e.target.value.split(" ").join("")}
                      {...register("firstname", { required: true })}
                    />
                  </div>
                  {errors.firstname && errors.firstname.type === "required" && (
                    <p className="errorMsg mb-0 mt-2 text-danger">
                      {t("signup.validation1")}
                    </p>
                  )}
                </div>

                <div className="col-md-4">
                  <div className="my-3">
                    <label
                      htmlFor="lname"
                      className="form-label heading-color fw-bold"
                    >
                      {t("signup.lastname")}
                    </label>
                    <input
                      type="text"
                      name="lastname"
                      className="form-control"
                      id="lname"
                      placeholder="Enter last name"
                      onKeyUp={e => e.target.value = e.target.value.split(" ").join("")}
                      {...register("lastname", { required: true })}
                    />
                  </div>
                  {errors.lastname && errors.lastname.type === "required" && (
                    <p className="errorMsg mb-0 mt-2 text-danger">
                      {t("signup.validation2")}
                    </p>
                  )}
                </div>

                <div className="col-md-4">
                  <div className="my-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <label
                        htmlFor="email"
                        className="form-label heading-color fw-bold"
                      >
                        {t("signup.email")}
                      </label>
                      {props.user.is_verify && props.user.is_verify &&
                        <div className="d-flex align-items-center text-success">
                          <i className="bi bi-check2-circle me-1"></i>
                          <p className="mb-0">{t("profile.verified")}</p>
                        </div>
                      }
                    </div>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder={props.user.email}
                      name="email"
                      {...register("email", {
                        required: true,
                        pattern:
                          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
                      })}
                    />
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
                </div>

                <div className="col-md-4">
                  <div className="my-3">
                    <label
                      htmlFor="Country"
                      className="form-label heading-color fw-bold"
                    >
                      {t("profile.country")}
                    </label>
                    <select
                      className="form-control"
                      aria-label="Default select example"
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                    >
                      <option value="">{t("profile.select_country")}</option>
                      {Country.getAllCountries().map((e, key) => (
                        <option key={key} id={e.isoCode} value={e.isoCode}>
                          {e.name}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

                <div className="col-md-4">
                  <div className="my-3">
                    <label
                      htmlFor="State"
                      className="form-label heading-color fw-bold"
                    >
                      {t("profile.state")}
                    </label>
                    <select
                      className="form-control"
                      aria-label="Default select example"
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                    >
                      <option value="">{t("profile.select_state")}</option>
                      {State.getAllStates()
                        .filter((e) => e.countryCode === selectedCountry)
                        .map((e, key) => (
                          <option key={key} value={e.isoCode}>
                            {e.name}
                          </option>
                        ))}
                    </select>
                  </div>

                </div>

                <div className="col-md-4">
                  <div className="my-3">

                    <label
                      htmlFor="City"
                      className="form-label heading-color fw-bold"
                    >
                      {t("profile.location")}
                    </label>
                    <GooglePlacesAutocomplete
                      selectProps={{
                        place,
                        onChange: setPlace,
                        placeholder: t("profile.location"),
                        defaultInputValue: profile?.city,
                        noOptionsMessage: () => 'Please start typing',
                        styles: {
                          input: (provided) => ({
                            ...provided,
                            color: '#B8C2CE',
                          }),
                          option: (provided) => ({
                            ...provided,
                            color: '#B8C2CE',
                          }),
                          singleValue: (provided) => ({
                            ...provided,
                            color: '#B8C2CE',
                          }),
                        },
                      }}
                    />
                  </div>

                </div>



                <div className="col-md-8">
                  <div className="my-3">
                    <label
                      htmlFor="address"
                      className="form-label heading-color fw-bold"
                    >
                      {t("profile.address")}
                    </label>
                    <input
                      type="text"
                      name="address"
                      className="form-control"
                      id="address"
                      placeholder={t("profile.enter_address")}
                      defaultValue={profile?.address || ""}
                      {...register("address")}
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="my-3">
                    <label
                      htmlFor="zcode"
                      className="form-label heading-color fw-bold"
                    >
                      {t("profile.zipcode")}
                    </label>
                    <input
                      type="number"
                      name="zipcode"
                      className="form-control"
                      id="zcode"
                      placeholder={t("profile.enter_zipcode")}
                      defaultValue={profile?.zipcode || ""}
                      {...register("zipcode")}
                    />
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="my-3 text-area">
                    <label
                      htmlFor="exampleFormControlTextarea1"
                      className="form-label heading-color fw-bold"
                    >
                      {t("profile.about_you")}
                    </label>
                    <textarea
                      className="form-control"
                      name="about"
                      id="exampleFormControlTextarea1"
                      rows="4"
                      placeholder={t("profile.about")}
                      defaultValue={profile?.about_me || ""}
                      {...register("about_me")}
                    ></textarea>
                  </div>
                </div>
              </div>
              {errors.serverError &&
                errors.serverError.type === "focus" && (
                  <p className="errorMsg mt-2 mb-0 text-danger">
                    {errors.serverError.message}
                  </p>
                )}
              {successMessage ? (
                <p className="text-success">{t("preferences.updated")}</p>
              ) : (
                ""
              )}
              <div className="text-end account-details-save mt-3">
                <button id="profileButton" type="submit" className="btn btn-success">
                {t("preferences.save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div >
    </div >
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
    loader: (payload)=> dispatch(loader(payload))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AccountDetail);
