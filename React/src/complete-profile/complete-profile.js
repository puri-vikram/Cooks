import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { saveUser } from "../redux/User/user.actions";
import { connect } from "react-redux";
import { Country, State, City } from "country-state-city";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import { loader } from "../redux/Loader/loader.actions";
const { REACT_APP_API_URL } = process.env;

function CompleteProfile(props) {
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

  const {
    register: register2,
    resetField: resetField2,
    handleSubmit: handleSubmit2,
    setError: setError2,
    getValues: getValues2,
    setValue: setValue2,
    clearErrors: clearErrors2,
    formState: { errors: errors2 },
  } = useForm();

  Array.prototype.unique = function () {
    var a = this.concat();
    for (var i = 0; i < a.length; ++i) {
      for (var j = i + 1; j < a.length; ++j) {
        if (a[i] === a[j]) a.splice(j--, 1);
      }
    }

    return a;
  };

  const [specialities, setSpecialities] = useState([]);

  const addMoreSpecialities = () => {
    if (getValues2("speciality") === "") {}
    else{
      setSpecialities([...specialities, getValues2("speciality")]);
      document.forms["specialityModal"].reset();
    }
  };

  const [languages, setLanguages] = useState(
    ["English", "Mandarin", "Spanish", "Dutch"]
      .concat(profile?.languages === [false] ? profile.languages : [])
      .unique()
  );

  const addMoreLanguages = () => {
    if (getValues2("language") === "") {
    } else {
      setLanguages([...languages, getValues2("language")]);
      document.forms["languageModal"].reset();
    }
  };

  const [dietPreferences, setDietPreferences] = useState(
    ["Vegetarian", "Pescatarian", "Vegan", "Paleo", "Keto", "Gluten free"]
      .concat(profile?.dietary_preference === [false] ? profile.dietary_preference : [])
      .unique()
  );

  const addMoreDietPreferences = () => {
    if (getValues2("dietPreference") === "") {
    } else {
      setDietPreferences([...dietPreferences, getValues2("dietPreference")]);
      document.forms["dietModal"].reset();
    }
  };

  const [mealTypes, setMealTypes] = useState(
    ["Breakfast", "Lunch", "Dinner", "Snacks", "Dessert"]
      .concat(profile?.meal_type === [false] ? profile.meal_type : [])
      .unique()
  );

  const addMoreMealTypes = () => {
    if (getValues2("mealType") === "") {
    } else {
      setMealTypes([...mealTypes, getValues2("mealType")]);
      document.forms["mealModal"].reset();
    }
  };

  const [cuisinePreferences, setCuisinePreferences] = useState(
    ["Italian", "French", "American", "Japanese", "Korean"]
      .concat(profile?.cuisine_preference === [false] ? profile.cuisine_preference : [])
      .unique()
  );

  const addMoreCuisinePreferences = () => {
    if (getValues2("cuisinePreference") === "") {
    } else {
      setCuisinePreferences([
        ...cuisinePreferences,
        getValues2("cuisinePreference"),
      ]);
      document.forms["cuisineModal"].reset();
    }
  };

  async function uploadPicture(picture) {
    let formData = new FormData();
    formData.append("picture", picture);
    return fetch(`${REACT_APP_API_URL}api/upload/cook/picture`, {
      method: "POST",
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
      body: formData,
    });
  }

  const [imgData, setImgData] = useState(
    props.user.pictures == null
      ? "user.png"
      : `${REACT_APP_API_URL}${props.user.pictures}`
  );
  // const [imgData, setImgData] = useState();

  const onChangePicture = async (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgData(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);

      await uploadPicture(e.target.files[0])
        .then((data) => data.json())
        .then((res) => {
          if (res.status == true) {
            localStorage.setItem("cuser", JSON.stringify(res.data));
            props.saveUser(res.data);
          }
        });
    }
  };

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
  const onSubmit = async (e) => {
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

    setValue("speciality",specialities);
    props.loader(true);
    const token = await updateCook(getValues())
      .then((data) => data.json())
      .then((res) => {
        if (res.status == false) {
          props.loader(false);
          setError("serverError", { type: "focus", message: res.message });
        } else {
          props.loader(false);
          localStorage.setItem("cuser", JSON.stringify(res.data));
          props.saveUser(res.data);
          setSuccessMessage(true);
          // document.getElementById("profileButton").setAttribute("disabled","");
          // removeDisable();
        }
      });

  };
  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    if (profile.speciality && profile.speciality.length > 0) {
      if(profile?.speciality[0] === false){
        setSpecialities([]);
        setValue("speciality",[])
      }
      else{
      setValue("speciality", profile.speciality);
      setSpecialities(profile.speciality)
      }
    }
    if (profile.languages && profile.languages.length > 0) {
      setValue("languages", profile.languages);
    }
    if (profile.dietary_preference && profile.dietary_preference.length > 0) {
      setValue("dietary_preference", profile.dietary_preference);
    }
    if (profile.meal_type && profile.meal_type.length > 0) {
      setValue("meal_type", profile.meal_type);
    }
    if (profile.cuisine_preference && profile.cuisine_preference.length > 0) {
      setValue("cuisine_preference", profile.cuisine_preference);
    }
  }, []);

  const resetModal = () => {
    document.forms["specialityModal"].reset();
    document.forms["languageModal"].reset();
    document.forms["dietModal"].reset();
    document.forms["mealModal"].reset();
    document.forms["cuisineModal"].reset();
    setValue2("speciality", "");
    setValue2("language", "");
    setValue2("dietPreference", "");
    setValue2("mealType", "");
    setValue2("cuisinePreference", "");
  }

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


  function removeSpeciality(index) {
    const newArr = specialities.filter((item, i) => i !== index )
    setSpecialities(newArr)
  }
  return (
    <div className="container">
      <div className="complete-profile-wrapper">
        <form name="completeProfile" onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-md-12">
              <h2 className="heading-color fw-bold mt-md-5 mt-3">
                Add more about you
              </h2>
              <p className="text-color">Please complete you profile</p>
              <div className="row">
                <div className="col-md-12">
                  <div className="user-profile-wrapper">
                    <div className="profile-section">
                      <div className="profile-image mt-3">
                        <div className="inner-shadow">
                          <img src={imgData} className="img-fluid" />
                        </div>
                      </div>
                    </div>
                    <div className="change-profile-icon">
                      <input
                        className="d-none"
                        id="selectImage"
                        type="file"
                        onChange={onChangePicture}
                      />
                      <Link
                        to="#"
                        onClick={() =>
                          document.getElementById("selectImage").click()
                        }
                      >
                        <i className="bi bi-camera-fill"></i>
                      </Link>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="my-2 my-md-3">
                        <label
                          htmlFor="fname"
                          className="form-label heading-color fw-bold"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="fname"
                          defaultValue={profile.firstname || ""}
                          placeholder="Enter first name"
                          {...register("firstname", { required: true })}
                        />
                      </div>
                      {errors.firstname &&
                        errors.firstname.type === "required" && (
                          <p className="errorMsg mb-0 mt-2 text-danger">
                            First name is required.
                          </p>
                        )}
                    </div>
                    <div className="col-md-6">
                      <div className="my-2 my-md-3">
                        <label
                          htmlFor="lname"
                          className="form-label heading-color fw-bold"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="lname"
                          defaultValue={profile.lastname || ""}
                          placeholder="Enter last name"
                          {...register("lastname", { required: true })}
                        />
                      </div>
                      {errors.lastname &&
                        errors.lastname.type === "required" && (
                          <p className="errorMsg mb-0 mt-2 text-danger">
                            Last name is required.
                          </p>
                        )}
                    </div>
                    <div className="col-md-4">
                      <div className="my-2 my-md-3">
                        <label
                          htmlFor="Country"
                          className="form-label heading-color fw-bold"
                        >
                          Country
                        </label>
                        <select
                          className="form-control"
                          aria-label="Default select example"
                          value={selectedCountry}
                          onChange={(e) => setSelectedCountry(e.target.value)}
                        >
                          <option value="">Select country</option>
                          {Country.getAllCountries().map((e, key) => (
                            <option key={key} id={e.isoCode} value={e.isoCode}>
                              {e.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="my-2 my-md-3">
                        <label
                          htmlFor="State"
                          className="form-label heading-color fw-bold"
                        >
                          State
                        </label>
                        <select
                          className="form-control"
                          aria-label="Default select example"
                          value={selectedState}
                          onChange={(e) => setSelectedState(e.target.value)}
                        >
                          <option value="">Select state</option>
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
                      <div className="my-2 my-md-3">
                        <label
                          htmlFor="City"
                          className="form-label heading-color fw-bold"
                        >
                          Location
                        </label>
                        <GooglePlacesAutocomplete

                          selectProps={{
                            place,
                            onChange: setPlace,
                            placeholder: 'Location',
                            defaultInputValue: profile?.city,
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
                            }
                          }}
                        />
                      </div>

                    </div>


                    <div className="col-md-8">
                      <div className="my-2 my-md-3">
                        <label
                          htmlFor="address"
                          className="form-label heading-color fw-bold"
                        >
                          Address
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="address"
                          defaultValue={profile.address || ""}
                          placeholder="Enter address"
                          {...register("address")}
                        />
                      </div>

                    </div>

                    <div className="col-md-4">
                      <div className="my-2 my-md-3">
                        <label
                          htmlFor="zcode"
                          className="form-label heading-color fw-bold"
                        >
                          Zip code
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="zcode"
                          defaultValue={profile.zipcode || ""}
                          placeholder="Enter zip code"
                          {...register("zipcode")}
                        />
                      </div>

                    </div>
                    <div className="col-md-12">
                      <div className="my-2 my-md-3 text-area">
                        <label
                          htmlFor="exampleFormControlTextarea1"
                          className="form-label heading-color fw-bold"
                        >
                          About you
                        </label>
                        <textarea
                          className="form-control"
                          id="exampleFormControlTextarea1"
                          rows="4"
                          defaultValue={profile.about_me || ""}
                          placeholder="Type something about you, experience, hobbies etc..."
                          {...register("about_me")}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h2 className="fw-bold heading-color mt-4">Preferences</h2>
          <div className="d-inline-block personal-details-section mb-4">
            <div className="form-group my-2">
              <label
                htmlFor="number"
                className="form-label heading-color fw-bold"
              >
                Min cook price/hr
              </label>
              <div className="input-group w-50">
                <span className="input-group-text" id="basic-addon1">
                  <i className="bi bi-currency-dollar text-color dollar-icon"></i>
                </span>
                <input
                  type="number"
                  id="hours"
                  name="hours"
                  className="form-control"
                  placeholder="0.00"
                  min="0"
                  defaultValue={profile.hourly_rate || ""}
                  {...register("hourly_rate")}
                />
              </div>

            </div>
          </div>

          <div>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="heading-color fw-bold mb-0">Speciality</h6>
              <Link
                to="#"
                data-bs-toggle="modal"
                data-bs-target="#addSpeciality"
                className="text-color"
                onClick={resetModal}
              >
                <i className="bi bi-plus fs-7"></i>Add more
              </Link>
            </div>
            <div className="speciality-section1">
              <div className="d-flex flex-wrap"></div>

              {/* Speciality - Getting inputs from user  */}
              <div className="d-flex flex-wrap">
                {specialities.map((e,index) => (
                  <div key={e + Math.floor(Math.random() * 10000000)}>
                    <input
                      type="checkbox"
                      id={"speciality-" + e}
                      name="speciality"
                      disabled={true}
                      value={e}
                      />
                    <label htmlFor={"speciality-" + e}>{e}</label>
                    <i onClick={() => { removeSpeciality(index) }} className="--unselect-icon1 bi bi-x fs-7"></i>
                  </div>
                ))}
              </div>

              {/* Speciality -Getting inputs from user ends here */}
            </div>

            <div className="d-flex align-items-center justify-content-between my-3">
              <h6 className="heading-color fw-bold my-3">Languages known</h6>
              <Link
                to=""
                className="text-color"
                data-bs-toggle="modal"
                data-bs-target="#addLanguage"
                onClick={resetModal}
              >
                <i className="bi bi-plus fs-7"></i>Add more
              </Link>
            </div>
            <div className="speciality-section">
              {/* Languages - Getting inputs from user  */}
              <div className="d-flex flex-wrap">
                {languages.map((e) => (
                  <div key={e + Math.floor(Math.random() * 10000)}>
                    <input
                      type="checkbox"
                      id={"language-" + e}
                      name="languages"
                      value={e}
                      // checked={checkedValues.includes(e)}
                      // onClick={(e) => handleSelect(e.target.value)}
                      {...register("languages")}
                    />
                    <label htmlFor={"language-" + e}>{e}</label>
                  </div>
                ))}
              </div>

              {/* Languages - Getting inputs from user ends here */}
            </div>

            <div className="d-flex align-items-center justify-content-between my-3">
              <h6 className="heading-color fw-bold mb-0">Dietary preference</h6>
              <Link
                to=""
                className="text-color"
                data-bs-toggle="modal"
                data-bs-target="#addDietPreference"
                onClick={resetModal}
              >
                <i className="bi bi-plus fs-7"></i>Add more
              </Link>
            </div>
            <div className="speciality-section">
              {/* Diet Preference - Getting inputs from user  */}
              <div className="d-flex flex-wrap">
                {dietPreferences.map((e) => (
                  <div key={e + Math.floor(Math.random() * 10000)}>
                    <input
                      type="checkbox"
                      id={"diet-" + e}
                      name="dietary_preference"
                      value={e}
                      // checked={checkedValues.includes(e)}
                      // onClick={(e) => handleSelect(e.target.value)}
                      {...register("dietary_preference")}
                    />
                    <label htmlFor={"diet-" + e}>{e}</label>
                  </div>
                ))}
              </div>

              {/* Diet Preference - Getting inputs from user ends here */}
            </div>

            <div className="d-flex align-items-center justify-content-between my-3">
              <h6 className="heading-color fw-bold mb-0">Meal types</h6>
              <Link
                to="#"
                className="text-color"
                data-bs-toggle="modal"
                data-bs-target="#addMealType"
                onClick={resetModal}
              >
                <i className="bi bi-plus fs-7"></i>Add more
              </Link>
            </div>
            <div className="speciality-section">
              {/* Meal type - Getting inputs from user  */}
              <div className="d-flex flex-wrap">
                {mealTypes.map((e) => (
                  <div key={e + Math.floor(Math.random() * 10000)}>
                    <input
                      type="checkbox"
                      id={"meal-" + e}
                      name="meal_type"
                      value={e}
                      // checked={checkedValues.includes(e)}
                      // onClick={(e) => handleSelect(e.target.value)}
                      {...register("meal_type")}
                    />
                    <label htmlFor={"meal-" + e}>{e}</label>
                  </div>
                ))}
              </div>

              {/* Meal type - Getting inputs from user ends here */}
            </div>

            <div className="d-flex align-items-center justify-content-between my-3">
              <h6 className="heading-color fw-bold mb-0">Cuisine preference</h6>
              <Link
                to=""
                className="text-color"
                data-bs-toggle="modal"
                data-bs-target="#addCuisinePreference"
                onClick={resetModal}
              >
                <i className="bi bi-plus fs-7"></i>Add more
              </Link>
            </div>
            <div className="speciality-section">
              {/* Cuisine preference - Getting inputs from user  */}
              <div className="d-flex flex-wrap">
                {cuisinePreferences.map((e) => (
                  <div key={e + Math.floor(Math.random() * 100000)}>
                    <input
                      type="checkbox"
                      id={"cuisine-" + e}
                      name="cuisine_preference"
                      value={e}
                      // defaultChecked={checkedValues.includes(e)}
                      // onClick={(e) => handleSelect(e.target.value)}
                      {...register("cuisine_preference")}
                    />
                    <label htmlFor={"cuisine-" + e}>{e}</label>
                  </div>
                ))}
              </div>

              {/* Cuisine preference - Getting inputs from user ends here */}
            </div>

            {successMessage ? (
              <p className="text-success">Your profile has been updated</p>
            ) : (
              ""
            )}
            <div className="text-end account-details-save my-md-5 my-3">
              <button type="submit" className="btn btn-success">
                Save
              </button>
            </div>
          </div>
        </form>

        {/* Speciality modal */}
        <div
          className="modal fade"
          id="addSpeciality"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form name="specialityModal" onSubmit={handleSubmit2(addMoreSpecialities)}>
                <div className="modal-header border-bottom-0"></div>
                <div className="modal-body  py-0 pb-1 add-review-popup">
                  <div className="mb-3 mt-2">
                    <p>Enter any recipe</p>
                    <input
                      type="text"
                      className="form-control"
                      autoFocus
                      {...register2("speciality", { pattern: /^[a-zA-Z\d]+/ })}
                    />
                  </div>
                </div>
                <div className="modal-footer border-top-0">
                  <button
                    type="button"
                    className="btn Cancel-button"
                    data-bs-dismiss="modal"
                    id="cancelModal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success post-button"
                    data-bs-dismiss="modal"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Speciality modal ends here*/}

        {/* Modal starts here */}

        <div
          className="modal fade"
          id="addLanguage"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form name="languageModal" onSubmit={handleSubmit2(addMoreLanguages)}>
                <div className="modal-header border-bottom-0"></div>
                <div className="modal-body  py-0 pb-1 add-review-popup">
                  <div className="mb-3 mt-2">
                    <p>Enter new language</p>
                    <input
                      type="text"
                      className="form-control"
                      autoFocus
                      {...register2("language", { pattern: /^[a-zA-Z\d]+/ })}
                    />
                  </div>
                </div>
                <div className="modal-footer border-top-0">
                  <button
                    type="button"
                    className="btn Cancel-button"
                    data-bs-dismiss="modal"
                    id="cancelModal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success post-button"
                    data-bs-dismiss="modal"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Modal ends here */}
        {/* Modal starts here */}

        <div
          className="modal fade"
          id="addDietPreference"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form name="dietModal" onSubmit={handleSubmit2(addMoreDietPreferences)}>
                <div className="modal-header border-bottom-0"></div>
                <div className="modal-body  py-0 pb-1 add-review-popup">
                  <div className="mb-3 mt-2">
                    <p>Enter new dietery preference</p>
                    <input
                      type="text"
                      className="form-control"
                      autoFocus
                      {...register2("dietPreference", { pattern: /^[a-zA-Z\d]+/ })}
                    />
                  </div>
                </div>
                <div className="modal-footer border-top-0">
                  <button
                    type="button"
                    className="btn Cancel-button"
                    data-bs-dismiss="modal"
                    id="cancelModal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success post-button"
                    data-bs-dismiss="modal"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Modal ends here */}
        {/* Modal starts here */}

        <div
          className="modal fade"
          id="addMealType"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form name="mealModal" onSubmit={handleSubmit2(addMoreMealTypes)}>
                <div className="modal-header border-bottom-0"></div>
                <div className="modal-body  py-0 pb-1 add-review-popup">
                  <div className="mb-3 mt-2">
                    <p>Enter new Meal type</p>
                    <input
                      type="text"
                      className="form-control"
                      autoFocus
                      {...register2("mealType", { pattern: /^[a-zA-Z\d]+/ })}
                    />
                  </div>
                </div>
                <div className="modal-footer border-top-0">
                  <button
                    type="button"
                    className="btn Cancel-button"
                    data-bs-dismiss="modal"
                    id="cancelModal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success post-button"
                    data-bs-dismiss="modal"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Modal ends here */}
        {/* Modal starts here */}

        <div
          className="modal fade"
          id="addCuisinePreference"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form name="cuisineModal" onSubmit={handleSubmit2(addMoreCuisinePreferences)}>
                <div className="modal-header border-bottom-0"></div>
                <div className="modal-body  py-0 pb-1 add-review-popup">
                  <div className="mb-3 mt-2">
                    <p>Enter new Cuisine Preference</p>
                    <input
                      type="text"
                      className="form-control"
                      autoFocus
                      {...register2("cuisinePreference", { pattern: /^[a-zA-Z\d]+/ })}
                    />
                  </div>
                </div>
                <div className="modal-footer border-top-0">
                  <button
                    type="button"
                    className="btn Cancel-button"
                    data-bs-dismiss="modal"
                    id="cancelModal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success post-button"
                    data-bs-dismiss="modal"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Modal ends here */}
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
    loader: (payload)=> dispatch(loader(payload))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CompleteProfile);
