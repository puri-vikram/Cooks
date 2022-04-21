import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { saveUser } from "../redux/User/user.actions";
import { loader } from "../redux/Loader/loader.actions";
import { connect } from "react-redux";
import AsyncCreatableSelect from 'react-select/async-creatable';
import { ToastContainer, toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
const { REACT_APP_API_URL } = process.env;

function Preferences(props) {
  const { t } = useTranslation();
  const [onChangeLanguageValue, setOnChangeLanguageValue] = useState(null);
  const [onChangeDietValue, setOnChangeDietValue] = useState(null);
  const [onChangeMealValue, setOnChangeMealValue] = useState(null);
  const [onChangeCuisineValue, setOnChangeCuisineValue] = useState(null);

  const [successMessage, setSuccessMessage] = useState(false);
  const [currentProfesstion, setCurrentProfesstion] = useState('');
  const [profile, setProfile] = useState(JSON.parse(localStorage.getItem("cuser")));
  if (successMessage) {
    setTimeout(() => {
      setSuccessMessage(false);
    }, 2000);
  }

  useEffect(() => {
    setCurrentProfesstion(profile?.profession)
  }, [profile])

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
    const _val = getValues2("speciality").trim().replace(/ +(?= )/g, '')
    if (_val === "") {
    } else {
      setSpecialities([...specialities, _val]);
      document.forms["specialityModal"].reset();
    }
  };

  const [languages, setLanguages] = useState(
    ["English", "Mandarin", "Spanish", "Dutch"]
      .concat((profile?.languages
        && profile?.languages.length > 0
        && profile?.languages[0] !== [false]) ? profile.languages : [])
      .unique()
  );

  const [dietPreferences, setDietPreferences] = useState(
    ["Vegetarian", "Pescatarian", "Vegan", "Paleo", "Keto", "Gluten free"]
      .concat((profile?.dietary_preference
        && profile?.dietary_preference.length > 0
        && profile?.dietary_preference[0] !== [false]) ? profile.dietary_preference : [])
      .unique()
  );

  const [mealTypes, setMealTypes] = useState(
    ["Breakfast", "Lunch", "Dinner", "Snacks", "Dessert"]
      .concat((profile?.meal_type
        && profile?.meal_type.length > 0
        && profile?.meal_type[0] !== [false]) ? profile.meal_type : [])
      .unique()
  );

  const [cuisinePreferences, setCuisinePreferences] = useState(
    ["Italian", "French", "American", "Japanese", "Korean"]
      .concat((profile?.cuisine_preference
        && profile?.cuisine_preference.length > 0
        && profile?.cuisine_preference[0] !== [false]) ? profile.cuisine_preference : [])
      .unique()
  );

  const addMoreLanguages = () => {
    if (onChangeLanguageValue !== null && onChangeLanguageValue.value.trim().replace(/ +(?= )/g, '') !== "")
      setLanguages([...languages, onChangeLanguageValue.value].unique());
  };
  const addMoreDietPreferences = () => {
    if (onChangeDietValue !== null && onChangeDietValue.value.trim().replace(/ +(?= )/g, '') !== "")
      setDietPreferences([...dietPreferences, onChangeDietValue.value].unique());
  };
  const addMoreMealTypes = () => {
    if (onChangeMealValue !== null && onChangeMealValue.value.trim().replace(/ +(?= )/g, '') !== "")
      setMealTypes([...mealTypes, onChangeMealValue.value].unique());
  };
  const addMoreCuisinePreferences = () => {
    if (onChangeCuisineValue !== null && onChangeCuisineValue.value.trim().replace(/ +(?= )/g, '') !== "")
      setCuisinePreferences([...cuisinePreferences, onChangeCuisineValue.value].unique());
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
    setValue("speciality", specialities);
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
      if (profile?.speciality[0] === false) {
        setSpecialities([]);
        setValue("speciality", [])
      }
      else {
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

  function removeSpeciality(index) {
    const newArr = specialities.filter((item, i) => i !== index)
    setSpecialities(newArr)
  }

  const mapOptionsToValues = options => options.map(option => ({ value: option.name, label: option.name }))

  const getDietaryOptions = (inputValue, callback) => {
    if (!inputValue) {
      return callback([]);
    }
    fetchOptionsFromBackend(inputValue, 'dietary').then(response => {
      response.json().then(data => {
        if (data.length > 0)
          callback(mapOptionsToValues(data))
        else
          callback([])
      });
    });
  };
  const getLanguageOptions = (inputValue, callback) => {
    if (!inputValue) {
      return callback([]);
    }
    fetchOptionsFromBackend(inputValue, 'language').then(response => {
      response.json().then(data => {
        if (data.length > 0)
          callback(mapOptionsToValues(data))
        else
          callback([])
      });
    });
  };
  const getMealOptions = (inputValue, callback) => {
    if (!inputValue) {
      return callback([]);
    }
    fetchOptionsFromBackend(inputValue, 'meal').then(response => {
      response.json().then(data => {
        if (data.length > 0)
          callback(mapOptionsToValues(data))
        else
          callback([])
      });
    });
  };
  const getCuisineOptions = (inputValue, callback) => {
    if (!inputValue) {
      return callback([]);
    }
    fetchOptionsFromBackend(inputValue, 'cuisine').then(response => {
      response.json().then(data => {
        if (data.length > 0)
          callback(mapOptionsToValues(data))
        else
          callback([])
      });
    });
  };

  const fetchOptionsFromBackend = (value, type) => {
    const { REACT_APP_API_URL } = process.env;
    const fetchURL = `${REACT_APP_API_URL}api/search/preference`;
    const headers = { "Content-Type": "application/json" }
    const body = JSON.stringify({ type, value })
    return fetch(fetchURL, { method: "POST", headers, body })

  }
  async function seggestAddToAdmin(type, value) {
    return fetch(`${REACT_APP_API_URL}api/preference/suggestion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, value }),
    });
  }
  const requestAdd = (type, value) => {
    seggestAddToAdmin(type, value)
      .then((data) => data.json())
      .then((res) => {
        if (res.status == true)
          toast.success('Suggestion sent successfully.');
        else
          toast.success('Something went wrong.');
      })
  }

  return (
    <div className="container"><ToastContainer />
      <div className="complete-profile-wrapper">
        <form name="completeProfile" onSubmit={handleSubmit(onSubmit)}>


          <h2 className="fw-bold heading-color mt-4">{t("preferences.title")}</h2>
          <div className="d-inline-block personal-details-section mb-4">
            <div className="form-group my-2">
              <label
                htmlFor="number"
                className="form-label heading-color fw-bold"
              >
                {t("preferences.min_price")}
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
              <h6 className="heading-color fw-bold mb-0">{t("cook_profile.speciality")}</h6>
              <Link
                to="#"
                data-bs-toggle="modal"
                data-bs-target="#addSpeciality"
                className="text-color"
                onClick={resetModal}
              >
                <i className="bi bi-plus fs-7"></i>{t("add_recipe.add_more")}
              </Link>
            </div>
            <div className="speciality-section1">
              <div className="d-flex flex-wrap"></div>

              {/* Speciality - Getting inputs from user  */}
              <div className="d-flex flex-wrap">
                {specialities.map((e, index) => (
                  <div key={e + Math.floor(Math.random() * 10000000)}>
                    <input
                      type="checkbox"
                      id={"speciality-" + index}
                      name="speciality"
                      disabled={true}
                      value={e}
                    />
                    <label htmlFor={"speciality-" + index}>{e}</label>
                    <i onClick={() => { removeSpeciality(index) }} className="--unselect-icon1 bi bi-x fs-7"></i>
                  </div>
                ))}
              </div>

              {/* Speciality -Getting inputs from user ends here */}
            </div>

            <div className="d-flex align-items-center justify-content-between my-3">
              <h6 className="heading-color fw-bold my-3">{t("cook_profile.languages_known")}</h6>
              <Link
                to=""
                className="text-color"
                data-bs-toggle="modal"
                data-bs-target="#addLanguage"
                onClick={resetModal}
              >
                <i className="bi bi-plus fs-7"></i>{t("add_recipe.add_more")}
              </Link>
            </div>
            <div className="speciality-section">
              {/* Languages - Getting inputs from user  */}
              <div className="d-flex flex-wrap">
                {languages.map((e, index) => (
                  <div key={e + Math.floor(Math.random() * 10000)}>
                    <input
                      type="checkbox"
                      id={"language-" + index}
                      name="languages"
                      value={e}

                      {...register("languages")}
                    />
                    <label htmlFor={"language-" + index}>{e}</label>
                  </div>
                ))}
              </div>

              {/* Languages - Getting inputs from user ends here */}
            </div>

            <div className="d-flex align-items-center justify-content-between my-3">
              <h6 className="heading-color fw-bold mb-0">{t("cooklist.diet")}</h6>
              <Link
                to=""
                className="text-color"
                data-bs-toggle="modal"
                data-bs-target="#addDietPreference"
                onClick={resetModal}
              >
                <i className="bi bi-plus fs-7"></i>{t("add_recipe.add_more")}
              </Link>
            </div>
            <div className="speciality-section">
              {/* Diet Preference - Getting inputs from user  */}
              <div className="d-flex flex-wrap">
                {dietPreferences.map((e, i) => (
                  <div key={e + Math.floor(Math.random() * 10000)}>
                    <input
                      type="checkbox"
                      id={"diet-" + i}
                      name="dietary_preference"
                      value={e}
                      {...register("dietary_preference")}
                    />
                    <label htmlFor={"diet-" + i}>{e}</label>
                  </div>
                ))}
              </div>

              {/* Diet Preference - Getting inputs from user ends here */}
            </div>


            <div className="d-flex align-items-center justify-content-between my-3">
              <h6 className="heading-color fw-bold mb-0">{t("cooklist.meal")}</h6>
              <Link
                to="#"
                className="text-color"
                data-bs-toggle="modal"
                data-bs-target="#addMealType"
                onClick={resetModal}
              >
                <i className="bi bi-plus fs-7"></i>{t("add_recipe.add_more")}
              </Link>
            </div>
            <div className="speciality-section">
              {/* Meal type - Getting inputs from user  */}
              <div className="d-flex flex-wrap">
                {mealTypes.map((e, index) => (
                  <div key={e + Math.floor(Math.random() * 10000)}>
                    <input
                      type="checkbox"
                      id={"meal-" + index}
                      name="meal_type"
                      value={e}
                      {...register("meal_type")}
                    />
                    <label htmlFor={"meal-" + index}>{e}</label>
                  </div>
                ))}
              </div>

              {/* Meal type - Getting inputs from user ends here */}
            </div>

            <div className="d-flex align-items-center justify-content-between my-3">
              <h6 className="heading-color fw-bold mb-0">{t("cooklist.cuisine")}</h6>
              <Link
                to=""
                className="text-color"
                data-bs-toggle="modal"
                data-bs-target="#addCuisinePreference"
                onClick={resetModal}
              >
                <i className="bi bi-plus fs-7"></i>{t("add_recipe.add_more")}
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
                      {...register("cuisine_preference")}
                    />
                    <label htmlFor={"cuisine-" + e}>{e}</label>
                  </div>
                ))}
              </div>

              {/* Cuisine preference - Getting inputs from user ends here */}
            </div>

            <div className="diet-preferences-section my-3">
              <div className="row">
                <div className="col-md-12">
                  <h6 className="heading-color fw-bold">Profession</h6>
                  <div className="d-flex align-items-center">
                    <div className="form-check me-3">
                      <input name="profession" onClick={(e) => { setCurrentProfesstion(e.target.value) }} checked={currentProfesstion == 'cook'} {...register("profession", { required: true })} className="form-check-input" type="radio" value="cook" id="Cook-p"
                      />
                      <label className="form-check-label" htmlFor="Cook-p">
                        Cook
                      </label>
                    </div>
                    <div className="form-check">
                      <input name="profession" onClick={(e) => { setCurrentProfesstion(e.target.value) }} checked={currentProfesstion == 'chef'} {...register("profession", { required: true })} className="form-check-input" type="radio" value="chef" id="Chef-p"
                      />
                      <label className="form-check-label" htmlFor="Chef-p">
                        Chef
                      </label>
                    </div>
                  </div>
                  {errors.profession && errors.profession.type === "required" && (
                    <p className="errorMsg mb-0 mt-2 text-danger">
                      Profession is required
                    </p>
                  )}
                </div>
              </div>
            </div>


            {successMessage ? (
              <p className="text-success">{t("preferences.updated")}</p>
            ) : (
              ""
            )}
            <div className="text-end account-details-save my-md-5 my-3">
              <button type="submit" className="btn btn-success">
                {t("preferences.save")}
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
                    <p>{t("preferences.enter_speciality")}</p>
                    <input
                      type="text"
                      className="form-control"
                      autoFocus
                      {...register2("speciality")}
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
                    {t("dashboard.cancel")}
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success post-button"
                    data-bs-dismiss="modal"
                  >
                    {t("preferences.add")}
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
                    <p>{t("preferences.enter_language")}</p>
                    <AsyncCreatableSelect
                      className="my-1"
                      formatCreateLabel={(inputText) => `Send us your suggestion to add "${inputText}"`}
                      onCreateOption={(_val) => { requestAdd('language', _val) }}
                      onChange={(__value) => { setOnChangeLanguageValue(__value) }}
                      loadOptions={getLanguageOptions}
                      placeholder={'Language'}
                      loadingMessage={() => "Fetching languages list"}
                      isClearable={true}
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
                    {t("dashboard.cancel")}
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success post-button"
                    data-bs-dismiss="modal"
                  >
                    {t("preferences.add")}
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
                    <p>{t("preferences.enter_diet")}</p>

                    <AsyncCreatableSelect
                      className="my-1"
                      formatCreateLabel={(inputText) => `Send us your suggestion to add "${inputText}"`}
                      onCreateOption={(_val) => { requestAdd('dietary', _val) }}
                      // onCreateOption={(_val) => { setSeggestDietPrefrence(_val); document.getElementById('openConfirmDietaryModalButton').click() }}
                      onChange={(__value) => { setOnChangeDietValue(__value) }}
                      // isMulti={true}
                      isRtl={false}
                      loadOptions={getDietaryOptions}
                      placeholder={'Dietary preference'}
                      loadingMessage={() => "Fetching dietary list"}
                      isClearable={true}
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
                    {t("dashboard.cancel")}
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success post-button"
                    data-bs-dismiss="modal"
                  >
                    {t("preferences.add")}
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
                    <p>{t("preferences.enter_meal")}</p>
                    <AsyncCreatableSelect
                      className="my-1"
                      formatCreateLabel={(inputText) => `Send us your suggestion to add "${inputText}"`}
                      onCreateOption={(_val) => { requestAdd('meal', _val) }}
                      onChange={(__value) => { setOnChangeMealValue(__value) }}
                      loadOptions={getMealOptions}
                      placeholder={'Meal type'}
                      loadingMessage={() => "Fetching meals list"}
                      isClearable={true}
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
                    {t("dashboard.cancel")}
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success post-button"
                    data-bs-dismiss="modal"
                  >
                    {t("preferences.add")}
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
                    <p>{t("preferences.enter_cuisine")}</p>
                    <AsyncCreatableSelect
                      className="my-1"
                      formatCreateLabel={(inputText) => `Send us your suggestion to add "${inputText}"`}
                      onCreateOption={(_val) => { requestAdd('cuisine', _val) }}
                      onChange={(__value) => { setOnChangeCuisineValue(__value) }}
                      loadOptions={getCuisineOptions}
                      placeholder={'Cuisine preference'}
                      loadingMessage={() => "Fetching cuisines list"}
                      isClearable={true}
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
                    {t("dashboard.cancel")}
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success post-button"
                    data-bs-dismiss="modal"
                  >
                    {t("preferences.add")}
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
    loader: (payload) => dispatch(loader(payload))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Preferences);
