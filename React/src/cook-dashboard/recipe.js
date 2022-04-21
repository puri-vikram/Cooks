import React, { useState } from "react";
import { useForm } from "react-hook-form";
import slideImg2 from "../public/best-recipe2.jpg";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
const Recipe = (props) => {
  const { t } = useTranslation();
  const { REACT_APP_API_URL } = process.env;
  const [successMessage, setSuccessMessage] = useState(false);
  if (successMessage) {
    setTimeout(() => {
      setSuccessMessage(false);
    }, 2000);
  }


  let navigate = useNavigate();
  const recipeDetailsPage = (id) => {
    navigate(`/cookreact/recipe-detail?id=${id}`)
  }
  return (
    <>
      <tr>
        <th scope="row" className="text-color best-recipes-number">
          {props.index}
        </th>
        <td className="best-recipes-img-section --cursor-pointer" onClick={() => recipeDetailsPage(props.id)} >
          <div className="best-recipes-img-div">
            <img src={props.recipe.images[0] ? `${REACT_APP_API_URL}${props.recipe.images[0]}` : slideImg2} className="img-fluid best-recipes-img" />
          </div>
        </td>
        <td className="text-color --cursor-pointer" onClick={() => recipeDetailsPage(props.id)}>
          <span className="recipe-table-content">{props.recipe.title}</span>
        </td>
        <td className="text-color">
          <span className="recipe-table-content">
            <i className="bi bi-stopwatch me-1"></i>
            {props.recipe.recipe_hours} {t("dashboard.hour")} :{('0' + props.recipe.recipe_minute).slice(-2)} {t("dashboard.min")}
          </span>
        </td>
        <td>
          <div className="d-flex align-items-center --cursor-pointer">
            <Link to={`/cookreact/update-recipe/${props.id}`}>
              <div
                className="recipe-edit-icon me-2"
              >
                <i className="bi bi-pencil-square text-color"></i>
              </div>
            </Link>
            <div
              className="recipe-delete-icon --cursor-pointer"
              data-bs-toggle="modal"
              data-bs-target="#deleteModal"
              onClick={() => props.sendDeleteId(props.id)}
            >
              <i className="bi bi-trash text-color"></i>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
};

export default Recipe;
