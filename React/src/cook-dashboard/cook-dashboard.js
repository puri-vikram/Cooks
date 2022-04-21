import React, { useEffect, useState } from "react";
import Recipe from "./recipe";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { saveUser } from "../redux/User/user.actions";
import { connect } from "react-redux";
import StarRatings from 'react-star-ratings';
import ReactPaginate from "react-paginate";
import { ToastContainer, toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { loader } from "../redux/Loader/loader.actions";
function CookDashboard(props) {
  const { t } = useTranslation();
  const { REACT_APP_API_URL } = process.env;
  const [recipes, setRecipes] = useState([]);
  const [updateValue, setUpdateValue] = useState([]);
  const [successMessage, setSuccessMessage] = useState(false);
  if (successMessage) {
    setTimeout(() => {
      setSuccessMessage(false);
    }, 2000);
  }

  let navigate = useNavigate();
  const {
    watch,
    register,
    resetField,
    handleSubmit,
    setError,
    getValues,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();


  const addRecipe = () => {
    navigate("/cookreact/add-new-recipe");
  }

  const fetchDeleteId = (id) => {
    setValue("_id", id);
  };

  async function deleteValue(formData) {
    return fetch(`${REACT_APP_API_URL}api/delete/recipe/${formData}`, {
      method: "DELETE",
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify(formData),
    });
  }

  const deleteRecipe = async () => {
    const token = await deleteValue(getValues("_id"))
      .then((data) => data.json())
      .then((res) => {
        if (res.status == false) {
          setError("serverError", { type: "focus", message: res.message });
        } else {
          getRecipes(user_id);
          toast.success('Recipe deleted successfully');
        }
      });
    document.getElementById("hideDeleteModal").click();
  };
  // Delete Recipe ends here

  // Displaying Recipes
  const user_id = JSON.parse(localStorage.getItem("cuser"))._id;

  const fetchRecipes = async (id) => {
    props.loader(true);
    const res = await fetch(
      `${REACT_APP_API_URL}api/cookrecipe/list?page=1&limit=100`, {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("token"),
      }
    }
    );
    props.loader(false);
    const data = await res.json();
    return data;
  };
  const getRecipes = async (id) => {
    const recipesFromServer = await fetchRecipes();
    setRecipes(recipesFromServer);
  };
  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    getRecipes();
  }, []);
  // Displaying Recipes ends here


  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(recipes?.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(recipes?.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, recipes]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % recipes?.length;
    setItemOffset(newOffset);
  };

  const currentData = (
    <>
      {currentItems &&
        currentItems?.map((recipe, index) => (
          <Recipe
            recipe={recipe}
            key={recipe._id + index}
            id={recipe._id}
            index={itemOffset + index + 1}
            // sendRecipeDetails={fetchRecipeDetails}
            sendDeleteId={fetchDeleteId}
          />
        ))
      }
    </>
  )



  return (
    <div className="container">
      <ToastContainer />
      <div className="row mt-5">
        <div className="col-md-3">
          <div className="cook-dashboard">
            <img
              src={(props.user.pictures === null) ? `${window.location.origin}/cookreact/user.png` : `${REACT_APP_API_URL}${props.user.pictures}`}
              className="d-flex justify-content-center w-100"
            />

            <h4 className="heading-color fw-bold text-center mt-3 mb-0">
              {props.user.firstname}
            </h4>
            <div className="d-flex align-items-center justify-content-center mb-4">
              <p className="heading-color mb-0 me-1">{parseFloat(props.user.rating).toFixed(1)}</p>
              <StarRatings
                rating={props.user.rating}
                starRatedColor='rgb(236, 192, 15)'
                starDimension="18px"
                starSpacing="1px"
                numberOfStars={5}
                name='rating'
              />
            </div>
            <h5 className="text-success fw-bold text-center">
              ${props.user.hourly_rate ? props.user.hourly_rate : 0}<span className="light-gray fw-normal fs-6">/{t("dashboard.hour")}</span>
            </h5>
            <p className="light-gray text-center">
              <i className="bi bi-translate me-2 fs-7"></i>{props.user.languages.join(", ")}
            </p>

            <div className="text-center view-profile-link fw-bold mb-2">
              <Link to={`/cookreact/cook-my-profile`}>
              {t("dashboard.view_profile")} <i className="bi bi-arrow-right fs-7"></i>
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-9">
          <div className="dashboard-best-recipes offset-0 offset-lg-1 mb-5">
            <div className="d-flex align-items-center justify-content-between">
              <h4 className="heading-color fw-bold mb-0">{t("dashboard.my_recipes")} - {recipes.length} {t("dashboard.items")}
              </h4>
              <button
                type="button"
                className="btn btn-success ms-md-3 ms-0 mb-md-0 mb-3"
                // data-bs-toggle="modal"
                // data-bs-target="#exampleModal"
                onClick={addRecipe}
              >
                {t("dashboard.add_new")}
              </button>
            </div>



            <div className="mt-4 best-recipes-table">
              {recipes && recipes?.length > 0 &&
                <>
                  <table className="table">
                    <tbody>
                      {currentData}
                    </tbody>
                  </table>
                  {
                    recipes?.length > itemsPerPage &&
                    <ReactPaginate
                      breakLabel="..."
                      previousLabel={" ← Previous "}
                      nextLabel={" Next → "}
                      pageCount={pageCount}
                      onPageChange={handlePageClick}
                      pageClassName="page-item"
                      pageLinkClassName="page-link"
                      previousClassName="page-item"
                      previousLinkClassName="page-link"
                      nextClassName="page-item"
                      nextLinkClassName="page-link"
                      breakClassName="page-item"
                      breakLinkClassName="page-link"
                      containerClassName="pagination"
                      activeClassName="active"
                      renderOnZeroPageCount={null}
                    />
                  }
                </>
              }
              {recipes?.length < 1 &&
                <h5 className="my-4 text-center" style={{ color: '#555' }}>{t("dashboard.no_recipes")}</h5>
              }
            </div>


            {/* Delete modal  */}
            <div
              className="modal fade"
              id="deleteModal"
              tabIndex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header border-bottom-0"></div>
                  <div className="modal-body  py-0 pb-1 add-review-popup">
                    <div className="mb-3 mt-2">
                      <p>{t("dashboard.delete_modal")}</p>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit(deleteRecipe)}>
                    <input type="hidden" {...register("_id")} />
                    <div className="modal-footer border-top-0">
                      <button
                        type="button"
                        className="btn Cancel-button"
                        data-bs-dismiss="modal"
                        id="hideDeleteModal"
                      >
                        {t("dashboard.cancel")}
                      </button>
                      <button
                        type="submit"
                        className="btn btn-danger post-button"
                      >
                        {t("dashboard.delete")}
                      </button>
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

const mapStateToProps = state => {
  return {
    user: state.user.user
  }
}
const mapDispatchToProps = dispatch => {
  return {
    saveUser: (payload) => dispatch(saveUser(payload)),
    loader: (payload)=> dispatch(loader(payload))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CookDashboard);
