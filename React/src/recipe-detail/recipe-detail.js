import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { saveUser } from "../redux/User/user.actions";
import { connect } from "react-redux";
import slideImg2 from "../public/best-recipe1.jpg";
import { useTranslation } from "react-i18next";
import { loader } from "../redux/Loader/loader.actions";

function RecipeDetail(props) {
  const { t } = useTranslation();
  const { REACT_APP_API_URL } = process.env;
  const [searchParams] = useSearchParams();
  const recipe_id = searchParams.get("id");
  const ownerName = searchParams.get("ownerName");
  const display = searchParams.get("display");
  const [recipe, setRecipe] = useState();
  const [imgData, setImgData] = useState();
  const [recipeImg, setRecipeImg] = useState(slideImg2);
  const profile = JSON.parse(localStorage.getItem("cuser"));

  useEffect(() => {
    setImgData(
      (display == 'null' || display == "" || display == undefined)
        ? `${window.location.origin}/cookreact/user.png`
        : `${REACT_APP_API_URL}${display}`
    )
  }, [display])

  const fetchRecipes = async (id) => {
    props.loader(true);
    const res = await fetch(
      `${REACT_APP_API_URL}api/recipe/detail/${recipe_id}`,
      {
        method: "GET",
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );
    props.loader(false);
    const data = await res.json();
    return data;
  };
  const getRecipes = async (id) => {
    const recipeFromServer = await fetchRecipes();
    setRecipe(recipeFromServer);
    recipe?.images && setRecipeImg(`${REACT_APP_API_URL}${recipe?.images[0]}`);
  };
  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getRecipes();
  }, []);
  // Displaying Recipes ends here
  const { user } = props;
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-8 order-lg-1 order-2">
          <h4 className="heading-color fw-bold mt-4 mb-3">{recipe?.title}</h4>
          <div className="d-flex align-items-center mb-5">
            <div className="recipe-details-chef me-2">
              <img src={imgData} className="img-fluid" />
            </div>
            <p className="mb-0 text-color fw-bold">
              By{" "}
              {ownerName != null && ownerName != "" && ownerName != undefined
                ? ownerName
                : user.firstname + user.lastname}
            </p>
          </div>

          <div class="why_this_recipes_works">
            <h4 className="heading-color fw-bold mb-0">
              {t("recipe_detail.why_recipe")}
            </h4>
            <hr className="text-success" />
            {/* <p className="text-color">{recipe?.why_work}</p> */}
            <p className="text-color">{recipe?.description}</p>
          </div>

          <div className="mt-5 Ingredients-wrapper">
            <h5 className="heading-color fw-bold mb-0">
              {t("recipe_detail.ingredients")}
            </h5>
            <hr className="text-success" />
            <div className="row">
              <div className="col-md-6">
                <ul>
                  {recipe?.ingredients?.map((e, key) => (
                    <li key={key}>{e}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 order-lg-2 order-1 recipe-detail-img-section">
          <img
            src={
              recipe?.images[0]
                ? `${REACT_APP_API_URL}${recipe?.images[0]}`
                : slideImg2
            }
            className="img-fluid recipe-detail-img"
          />

          <div className="my-5 cooking-timing d-flex align-items-center justify-content-center">
            <div className="Cook-recipes-details-description">
              <p className="fw-bold">
                {t("recipe_detail.time")}:{" "}
                <span className="fw-normal">
                  {" "}
                  {recipe?.recipe_hours} {t("recipe_detail.hrs")} {recipe?.recipe_minute} {t("recipe_detail.mins")}
                </span>
              </p>
              <p className="fw-bold">
                {t("cooklist.diet")}:{" "}
                <span className="fw-normal">
                  {" "}
                  {recipe?.diet_type?.join(", ")}
                </span>
              </p>
              <p className="fw-bold">
                {t("cooklist.meal")}:{" "}
                <span className="fw-normal">
                  {" "}
                  {recipe?.meal_type?.join(", ")}
                </span>
              </p>
              <p className="fw-bold">
                {t("cooklist.cuisine")}:{" "}
                <span className="fw-normal">
                  {" "}
                  {recipe?.cuisine_type?.join(", ")}
                </span>
              </p>
              {/* <p className="fw-bold mb-0">Recipe category: <span className="fw-normal"> {recipe?.categories} </span></p> */}
            </div>
          </div>
        </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(RecipeDetail);
