import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import { loader } from "../redux/Loader/loader.actions";
import { connect } from "react-redux";
function AddNewRecipe(props) {
  const { t } = useTranslation();
  const { REACT_APP_API_URL } = process.env;
  const user_id = JSON.parse(localStorage.getItem("cuser"))._id;
  const [recipeId, setRecipeId] = useState();
  const [successMessage, setSuccessMessage] = useState(false);
  if (successMessage) {
    setTimeout(() => {
      setSuccessMessage(false);
    }, 2000);
  }
  const {
    register,
    handleSubmit,
    setError,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    getValues: getValues2,
    setValue: setValue2,
  } = useForm();

  const [ingredient, setIngredient] = useState([]);

  const addMoreIngredients = () => {
    const _val = getValues2("ingredients").trim().replace(/ +(?= )/g, '')
    if (_val === "") {
    } else {
      setIngredient([...ingredient, _val]);
      document.forms["ingredientModal"].reset();
      setValue2("ingredients", "")
    }
  };

  const [dietPreferences, setDietPreferences] = useState([
    "Vegetarian",
    "Pescatarian",
    "Vegan",
    "Paleo",
    "Keto",
    "Gluten free",
  ]);
  const addMoreDietPreferences = () => {
    const _val = getValues2("diet_type").trim().replace(/ +(?= )/g, '')
    if (_val === "") {
    } else {
      setDietPreferences([...dietPreferences, _val]);
      document.forms["dietModal"].reset();
      setValue2("diet_type", "")
    }
  };
  const [mealTypes, setMealTypes] = useState(
    ["Breakfast", "Lunch", "Dinner", "Snacks", "Dessert"]
  );

  const addMoreMealTypes = () => {
    const _val = getValues2("mealType").trim().replace(/ +(?= )/g, '')
    if (_val === "") {
    } else {
      setMealTypes([...mealTypes, _val]);
      document.forms["mealModal"].reset();
      setValue2("mealType", "")
    }
  };

  const [cuisinePreferences, setCuisinePreferences] = useState(
    ["Italian", "French", "American", "Japanese", "Korean"]
  );

  const addMoreCuisinePreferences = () => {
    const _val = getValues2("cuisinePreference").trim().replace(/ +(?= )/g, '')
    if (_val === "") {
    } else {
      setCuisinePreferences([
        ...cuisinePreferences,
        _val,
      ]);
      document.forms["cuisineModal"].reset();
      setValue2("cuisinePreference", "")
    }
  };
  //Adding new recipe

  async function postValues(formData) {
    return fetch(`${REACT_APP_API_URL}api/add/recipe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify(formData),
    });
  }

  const onSubmit = async (e) => {
    setValue("user_id", user_id, { shouldValidate: false, shouldDirty: false });
    setValue("ingredients", ingredient);
    // setValue("diet_type",dietPreferences);
    props.loader(true);
    const token = await postValues(getValues())
      .then((data) => data.json())
      .then((res) => {
        if (res.status == false) {
          props.loader(false);
          setError("serverError", { type: "focus", message: res.message });
        } else {
          props.loader(false);
          setSuccessMessage(true);
          document.forms["addRecipe"].reset();
          setRecipeId(res.data._id);
          document.getElementById("recipe-add-form").style.display = "none";
          document.getElementById("recipe-image-div").style.display = "block";
          // toast.success('Recipe created successfully');
        }
      });
  };
  //Adding new recipe ends here

  // Adding cover photo
  async function uploadPicture(picture) {
    let formData = new FormData();
    formData.append("images", picture);
    return fetch(`${REACT_APP_API_URL}api/upload/recipe/images/${recipeId}`, {
      method: "POST",
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
      body: formData,
    });
  }

  const [imgData, setImgData] = useState();

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
            document.getElementById("imageSubmitButton").style.display = "";
          }
        });
    }
  };

  // Adding cover photo ends here

  const resetModal = () => {
    document.forms["ingredientModal"].reset();
    document.forms["dietModal"].reset();
  }



  let navigate = useNavigate();
  const afterSubmit = () => {
    toast.success('Recipe created successfully');
    setTimeout(() => {
      navigate("/cookreact/cook-dashboard");
    }, 1000);
  };

  function removeIng(index) {
    const newArr = ingredient.filter((item, i) => i !== index)
    setIngredient(newArr)

  }
  function removeDiet(index) {
    const newArr = dietPreferences.filter((item, i) => i !== index)
    setDietPreferences(newArr)

  }

  return (
    <div className="container"><ToastContainer />
      <div className="row justify-content-center">
        <div className="col-sm-9 col-lg-7">
          <div className="row">
            <div className="col-md-12">
              <div className="add-new-recipes-wrapper">
                <h4 className="heading-color fw-bold my-4">{t("add_recipe.add_new_recipe")}</h4>

                <div id="recipe-add-form">
                  <form
                    className="add-new-recipes-form"
                    name="addRecipe"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="row mt-5">
                      <div className="col-12 my-md-3 my-2">
                        <label
                          htmlFor="Rname"
                          className="form-label heading-color fw-bold"
                        >
                          {t("add_recipe.name")}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="Rname"
                          placeholder="Enter recipe"
                          {...register("title", { required: true, pattern: /^[A-Za-z0-9]|[A-Za-z][A-Za-z\s]|[A-Za-z0-9]$/ })}
                        />
                        {errors.title && errors.title.type === "required" && (
                          <p className="errorMsg mb-0 mt-2 text-danger">
                            {t("add_recipe.validation1")}
                          </p>
                        )}
                        {errors.title && errors.title.type === "pattern" && (
                          <p className="errorMsg mb-0 mt-2 text-danger">
                            {t("add_recipe.validation2")}
                          </p>
                        )}
                      </div>
                      <div className="col-12 my-md-3 my-2">
                        <label
                          htmlFor="Rname"
                          className="form-label heading-color fw-bold"
                        >
                          {t("add_recipe.desc")}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="Rname"
                          placeholder="Enter recipe"
                          {...register("description", { required: true, pattern: /^[A-Za-z0-9]|[A-Za-z][A-Za-z\s]|[A-Za-z0-9]$/ })}
                        />
                        {errors.description &&
                          errors.description.type === "required" && (
                            <p className="errorMsg mb-0 mt-2 text-danger">
                              {t("add_recipe.validation3")}
                            </p>
                          )}
                        {errors.description &&
                          errors.description.type === "pattern" && (
                            <p className="errorMsg mb-0 mt-2 text-danger">
                              {t("add_recipe.validation4")}
                            </p>
                          )}
                      </div>

                      {/* <div className="col-12 my-md-3 my-2">
                        <label
                          htmlFor="Rname"
                          className="form-label heading-color fw-bold"
                        >
                          Recipe category
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="Rname"
                          placeholder="Enter category"
                          {...register("categories", { pattern: /^[A-Za-z0-9]|[A-Za-z][A-Za-z\s]|[A-Za-z0-9]$/ })}
                        />
                        {errors.categories &&
                          errors.categories.type === "required" && (
                            <p className="errorMsg mb-0 mt-2 text-danger">
                              Category is required
                            </p>
                          )}
                      </div> */}

                      <div className="col-12 mt-md-3 mt-2">
                        <label
                          htmlFor="Rname"
                          className="form-label heading-color fw-bold"
                        >
                          {t("add_recipe.time")}
                        </label>
                      </div>
                      <div className="col-md-6 mb-md-3 mb-2 mobile-recipe-time-view">
                        <label
                          htmlFor="number"
                          className="form-label heading-color"
                        >
                          {t("add_recipe.hour")}
                        </label>
                        <input
                          type="number"
                          className="form-control "
                          id="hr"
                          min="0"
                          max="12"
                          placeholder={t("add_recipe.hour")}
                          {...register("recipe_hours", { required: true })}
                        />
                        {errors.recipe_hours &&
                          errors.recipe_hours.type === "required" && (
                            <p className="errorMsg mb-0 mt-2 text-danger">
                              {t("add_recipe.validation5")}
                            </p>
                          )}
                      </div>

                      <div className="col-md-6 mb-md-4 mb-3 mobile-recipe-time-view">
                        <label
                          htmlFor="number"
                          className="form-label heading-color"
                        >{t("add_recipe.min")}</label>
                        <input
                          type="number"
                          className="form-control "
                          id="min"
                          min="1"
                          max="60"
                          placeholder={t("add_recipe.min")}
                          {...register("recipe_minute", { required: true })}
                        />
                        {errors.recipe_minute &&
                          errors.recipe_minute.type === "required" && (
                            <p className="errorMsg mb-0 mt-2 text-danger">
                              {t("add_recipe.validation6")}
                            </p>
                          )}
                      </div>

                      <div className="col-md-12 my-md-3 my-2">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <h6 className="heading-color fw-bold mb-0">
                          {t("cook_profile.ingredients")}
                          </h6>
                          <Link
                            to=""
                            data-bs-toggle="modal"
                            data-bs-target="#addIngredient"
                            className="text-color"
                            onClick={resetModal}
                          >
                            <i className="bi bi-plus fs-7"></i>{t("add_recipe.add_more")}
                          </Link>
                        </div>



                        <div className="speciality-section1">
                          <div className="d-flex flex-wrap">
                            {ingredient.map((e, index) => (
                              <div key={e + Math.floor(Math.random() * 10000)}>
                                <input
                                  type="checkbox"
                                  id={"ingredient-" + e}
                                  name="ingredient"
                                  disabled={true}
                                  value={e}

                                // {...register("ingredients", { required: true })}
                                />
                                <label htmlFor={"ingredient-" + e}>{e}</label>
                                <i onClick={() => { removeIng(index) }} className="--unselect-icon bi bi-x fs-7"></i>
                              </div>
                            ))}
                          </div>
                        </div>
                        {errors.ingredients &&
                          errors.ingredients.type === "required" && (
                            <p className="errorMsg mb-0 mt-2 text-danger">
                              {t("add_recipe.validation7")}
                            </p>
                          )}
                      </div>

                      <div className="col-md-12 my-md-3 my-2">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <h6 className="heading-color fw-bold mb-0">
                            {t("cooklist.diet")}
                          </h6>
                          <Link
                            data-bs-toggle="modal"
                            data-bs-target="#addDietPreference"
                            className="text-color"
                            to=""
                            onClick={resetModal}
                          >
                            <i className="bi bi-plus fs-7"></i>{t("add_recipe.add_more")}
                          </Link>
                        </div>

                        <div className="speciality-section">
                          <div className="d-flex flex-wrap">
                            {dietPreferences.map((e, index) => (
                              <div key={e + Math.floor(Math.random() * 10000)}>
                                <input
                                  type="checkbox"
                                  id={"dietpreference-" + e}
                                  name="dietpreference"
                                  value={e}
                                  {...register("diet_type")}
                                />
                                <label htmlFor={"dietpreference-" + e}>{e}</label>
                                {/* <i onClick={() => { removeDiet(index) }} className="--unselect-icon bi bi-x fs-7"></i> */}
                              </div>
                            ))}
                          </div>
                        </div>
                        {errors.diet_type &&
                          errors.diet_type.type === "required" && (
                            <p className="errorMsg mb-0 mt-2 text-danger">
                              {t("add_recipe.validation8")}
                            </p>
                          )}
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
                          {mealTypes.map((e) => (
                            <div key={e + Math.floor(Math.random() * 10000)}>
                              <input
                                type="checkbox"
                                id={"meal-" + e}
                                name="meal_type"
                                value={e}
                                {...register("meal_type")}
                              />
                              <label htmlFor={"meal-" + e}>{e}</label>
                            </div>
                          ))}
                        </div>
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
                                name="cuisine_type"
                                value={e}
                                {...register("cuisine_type")}
                              />
                              <label htmlFor={"cuisine-" + e}>{e}</label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="col-12 mt-md-3 mt-2">
                        <div className="form-check form-switch">
                          <label className="form-label heading-color fw-bold" htmlFor="bestrecipe">{t("add_recipe.best_recipe")}</label>
                          <input className="form-check-input" type="checkbox" role="switch" id="bestrecipe" {...register("best_recipes")} />
                        </div>
                      </div>
                      {/* <div className="col-12 my-md-3 my-2">
                        <div className="form-check form-switch">
                          <label className="form-label heading-color fw-bold" htmlFor="speciality">Check, if this is your speciality?</label>
                          <input className="form-check-input" type="checkbox" role="switch" id="speciality" {...register("speciality")} />
                        </div>
                      </div> */}


                      {successMessage ? (
                        <p className="text-success">
                          {t("add_recipe.updated")}
                        </p>
                      ) : (
                        ""
                      )}
                      <div className="text-end mb-5">
                        <button type="submit" className="btn btn-success">
                        {t("add_recipe.next")}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                <div id="recipe-image-div" style={{ display: "none" }}>
                  <div className="col-md-12 my-md-3 my-2">
                    <h6 className="heading-color fw-bold mb-3">
                    {t("add_recipe.add_image")}
                    </h6>
                    <div className="row">
                      <div className="col-md-6">
                        <div
                          className="cover-photo-section-dummy"
                          style={{ overflow: "hidden" }}
                        >
                          <img src={imgData} style={{ width: "100%" }} />
                          <div className="add-cover-photo">
                            <input
                              className="d-none"
                              id="selectImage"
                              type="file"
                              accept="image/jpg,image/jpeg,image/png"
                              onChange={onChangePicture}
                            />
                            <Link
                              to="#"
                              onClick={() =>
                                document.getElementById("selectImage").click()
                              }
                            >
                              <i className="bi bi-camera-fill d-flex align-items-center justify-content-center h-100"></i>
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-3">
                            {/* <img src={imgData} height="200" /> */}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-end mb-5">
                      <button
                        onClick={() => afterSubmit()}
                        className="btn btn-success"
                        id="imageSubmitButton"
                        style={{ display: 'none' }}
                      >
                        {t("add_recipe.submit")}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Ingredients modal starts here */}
                <div
                  className="modal fade"
                  id="addIngredient"
                  tabIndex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <form name="ingredientModal" onSubmit={handleSubmit2(addMoreIngredients)}>
                        <div className="modal-header border-bottom-0"></div>
                        <div className="modal-body py-0 pb-1 add-review-popup">
                          <div className="mb-3 mt-2">
                            <p>{t("add_recipe.new_ingredient")}</p>
                            <input
                              type="text"
                              className="form-control"
                              autoFocus
                              {...register2("ingredients")}
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
                            data-bs-dismiss="modal"
                            className="btn btn-success post-button"
                          >
                            {t("add_recipe.add")}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                {/* Ingredients modal ends here */}

                {/* Dietery Preference modal */}
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
                        <div className="modal-body py-0 pb-1 add-review-popup">
                          <div className="mb-3 mt-2">
                            <p>{t("add_recipe.new_diet")}</p>
                            <input
                              type="text"
                              className="form-control"
                              autoFocus
                              {...register2("diet_type")}
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
                            data-bs-dismiss="modal"
                            className="btn btn-success post-button"
                          >
                            {t("add_recipe.add")}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

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
                            <p>{t("add_recipe.add_meal")}</p>
                            <input
                              type="text"
                              className="form-control"
                              autoFocus
                              {...register2("mealType")}
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
                            {t("add_recipe.add")}
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
                            <p>{t("add_recipe.new_cuisine")}</p>
                            <input
                              type="text"
                              className="form-control"
                              autoFocus
                              {...register2("cuisinePreference")}
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
                            {t("add_recipe.add")}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                {/* Modal ends here */}
              
                {/* Dietery Preference modal ends here */}
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
export default connect(mapStateToProps, mapDispatchToProps)(AddNewRecipe);

