import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link, useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import OwlCarousel from "react-owl-carousel2";
import "react-toastify/dist/ReactToastify.min.css";
import slideImg1 from "../public/chefs-images-1.png";
import StarRatings from "react-star-ratings";
import slideImg2 from "../public/best-recipe4.jpg";
import { saveUser } from "../redux/User/user.actions";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
const { REACT_APP_API_URL } = process.env;

async function addReply(payload, reviewId) {
  return fetch(`${REACT_APP_API_URL}api/add/review/reply/${reviewId}`, {
    method: "POST",
    headers: {
      "x-access-token": localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

async function deleteReplyComment(id) {
  return fetch(`${REACT_APP_API_URL}api/delete/review/reply/${id}`, {
    method: "DELETE",
    headers: {
      "x-access-token": localStorage.getItem("token"),
    },
    body: JSON.stringify(id),
  });
}
async function uploadCover(cover) {
  let formData = new FormData();
  formData.append("cover", cover);
  return fetch(`${REACT_APP_API_URL}api/upload/cook/cover`, {
    method: "POST",
    headers: {
      "x-access-token": localStorage.getItem("token"),
    },
    body: formData,
  });
}
function CookMyProfile(props) {
  const { t } = useTranslation();
  const profile = JSON.parse(localStorage.getItem("cuser"));
  const { user } = props;
  const [imgData, setImgData] = useState(
    user.cover == null
      ? `${window.location.origin}/cookreact/cook-details-banner.png`
      : `${REACT_APP_API_URL}${user.cover}`
  );
  const [selectedReviewForReply, setSelectedReviewForReply] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [replyIdToDelete, setReplyIdToDelete] = useState(null);
  const [replyForEdit, setReplyForEdit] = useState({});
  const [rating, setRating] = useState(1);
  const [cookDetails, setCookDetails] = useState({});
  const [reviews, setReviews] = useState([]);
  const { cook_id } = useParams();
  let location = useLocation();
  const [active, setActive] = useState("about");
  const bestRecipeRef = useRef();
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm();
  useEffect(() => { window.scrollTo(0, 0) }, [])
  useEffect(() => {
    setTimeout(() => {
      const _target = window.location.hash;
      if (_target) {
        const __target = _target.substring(1);
        document
          .getElementById(__target)
          .scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          });
        setActive(__target);
      }
    }, 100);
  }, []);
  const onSubmit = async (e) => {
    await addReply(getValues(), selectedReviewForReply)
      .then((data) => data.json())
      .then((res) => {
        if (res.status == true) {
          document.getElementById("closeModalButton").click();
          toast.success("Replied successfully.");
          reset();
          getReviews(props.user._id);
          setTimeout(() => {
            document.getElementById("ratings").scrollIntoView({
              behavior: "smooth",
              block: "end",
              inline: "nearest",
            });
          }, 1000);
        }
      });
  };
  const deleteReply = async (id) => {
    const token = await deleteReplyComment(id)
      .then((data) => data.json())
      .then((res) => {
        if (res.status == true) {
          getReviews(props.user._id);
        }
      });
  };
  function getReviews(cook) {
    fetch(`${REACT_APP_API_URL}api/cook/reviews/${cook}?limit=10&page=1`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((data) => data.json())
      .then((res) => {
        setReviews(res);
      });
  }
  // useEffect(() => {}, reviews);
  useEffect(() => {
    fetch(`${REACT_APP_API_URL}api/cook/detail/${props.user._id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
    })
      .then((data) => data.json())
      .then((res) => {
        setCookDetails(res);
      });
    getReviews(props.user._id);
  }, []);
  const options = {
    margin: 0,
    responsiveClass: true,
    nav: false,
    dots: false,
    autoplay: true,
    navText: ["Prev", "Next"],
    smartSpeed: 1000,
    responsive: {
      0: {
        items: 1,
      },
      300: {
        items: 1,
      },
      435: {
        items: 1,
      },
      400: {
        items: 2,
      },
      562: {
        items: 2,
      },
      700: {
        items: 2,
      },
      800: {
        items: 3,
      },
      1000: {
        items: 4,
      },
    },
  };

  const events = {
    onDragged: function (event) {},
    onChanged: function (event) {},
  };
  function scrollToSection(tag) {
    document
      .getElementById(tag)
      .scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    setActive(tag);
  }
  const onChangeCover = async (e) => {
    if (e.target.files[0]) {
      await uploadCover(e.target.files[0])
        .then((data) => data.json())
        .then((res) => {
          if (res.status == true) {
            localStorage.setItem("cuser", JSON.stringify(res.data));
            props.saveUser(res.data);
            toast.success("Cover updated successfully.");
            const reader = new FileReader();
            reader.addEventListener("load", () => {
              setImgData(reader.result);
            });
            reader.readAsDataURL(e.target.files[0]);
          } else {
            toast.error("Something went wrong.");
          }
        });
    }
  };
  let navigate = useNavigate();
  const recipeDetailsPage = (id, ownerName, display) => {
    navigate(
      `/cookreact/recipe-detail?id=${id}&ownerName=${ownerName}&display=${display}`
    );
  };
  const roundOf = (_) => parseFloat(_).toFixed(1);
  return (
    <div className="App">
      <ToastContainer />
      <div
        className="cook-details-banner"
        style={{ backgroundImage: `url(${imgData})` }}
      ></div>
      <div className="container">
        <div className="cook_my_profile">
          <input
            className="d-none"
            id="selectCover"
            type="file"
            onChange={onChangeCover}
          />
          <Link
            to="#"
            onClick={() => document.getElementById("selectCover").click()}
          >
            <i className="bi bi-camera-fill"></i>
            <p>{t("cook_profile.upload_cover")}</p>
          </Link>
        </div>
        <div className="cook-details">
          <div className="row">
            <div className="col-md-4">
              <img
                src={
                  cookDetails.pictures
                    ? `${REACT_APP_API_URL}${cookDetails.pictures}`
                    : slideImg1
                }
                className="img-fluid w-md-auto w-100 chef-details-img"
              />
            </div>
            <div className="col-md-8 p-4">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="heading-color fw-bold mb-0 mt-2 mt-md-0">
                    {cookDetails?.firstname + " " + cookDetails?.lastname}
                  </h4>
                  <p className="text-color mb-1">
                    {" "}
                    <i className="bi bi-geo-alt-fill me-1"></i>
                    {cookDetails?.distance} {t("cooklist.away")}
                  </p>
                </div>
                <div>
                  <h3 className="text-success fw-bold prize mb-0 mt-md-0 mt-2">
                    ${cookDetails.hourly_rate}
                    <span className="light-gray">/{t("dashboard.hour")}</span>
                  </h3>
                </div>
              </div>
              <div className="d-flex align-items-center mt-2">
                <p className="fs-6 heading-color pe-2 mb-0">
                  {parseFloat(cookDetails?.rating).toFixed(1)}
                </p>
                <StarRatings
                  rating={cookDetails?.rating}
                  starRatedColor="rgb(236, 192, 15)"
                  starDimension="22px"
                  starSpacing="2px"
                  numberOfStars={5}
                  name="rating"
                />
              </div>
              <div className="mt-5 d-flex align-items-center justify-content-between cook-details-tabs">
                <ul className="nav">
                  <li className="nav-item heading-color">
                    <Link
                      onClick={() => scrollToSection("about")}
                      className={`nav-link ${active == "about" && "active"}`}
                      to="#about"
                    >
                      {t("header.about")}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      onClick={() => scrollToSection("recipes")}
                      className={`nav-link ${active == "recipes" && "active"}`}
                      to="#recipes"
                    >
                      {t("cook_profile.recipes")}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      onClick={() => scrollToSection("speciality")}
                      className={`nav-link ${
                        active == "speciality" && "active"
                      }`}
                      to="#speciality"
                    >
                      {t("cook_profile.speciality")}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      onClick={() => scrollToSection("ratings")}
                      className={`nav-link ${active == "ratings" && "active"}`}
                      to="#ratings"
                    >
                      {t("cook_profile.ratings")}
                    </Link>
                  </li>
                </ul>
                <Link
                  to={`/cookreact/complete-profile`}
                  className="btn btn-success ms-md-3 ms-0 mb-md-0 mb-3"
                >
                  {t("cook_profile.edit")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

  <section id="about">
				<div className="container">
					<div className="row about-cook-section pb-4">
						<div className="col-md-9">
							<div className="text-start text-color">
								<p>{cookDetails.about_me}</p>
							</div>
						</div>

						<div className="col-md-3 ps-md-5">
							<h6 className="light-gray fs-6 fw-bold ">{t("cooklist.diet")}</h6>
							{cookDetails?.dietary_preference && cookDetails?.dietary_preference?.length > 0 && cookDetails?.dietary_preference[0] !== 'false' ?
								<ul className="ps-0 heading-color">
									{cookDetails?.dietary_preference?.map(_items =>
										<li class="fw-bold" key={_items}>{_items}</li>
									)}
								</ul>
								:
								<span>{t("cook_profile.no_diet")}</span>
							}

							<h6 className="light-gray fs-6 fw-bold ">{t("cooklist.cuisine")}</h6>
							{cookDetails?.cuisine_preference && cookDetails?.cuisine_preference?.length > 0 && cookDetails?.cuisine_preference[0] !== 'false' ?
								<ul className="ps-0 heading-color">
									{cookDetails?.cuisine_preference?.map(_items =>
										<li class="fw-bold" key={_items}>{_items}</li>
									)}
								</ul>
								:
								<span>{t("cook_profile.no_cuisine")}</span>
							}

							<h6 className="light-gray fs-6 fw-bold ">{t("cooklist.meal")}</h6>
							{cookDetails?.meal_type && cookDetails?.meal_type?.length > 0 && cookDetails?.meal_type[0] !== 'false' ?
								<ul className="ps-0 heading-color">
									{cookDetails?.meal_type?.map(_items =>
										<li class="fw-bold" key={_items}>{_items}</li>
									)}
								</ul>
								:
								<span>{t("cook_profile.no_meal")}</span>
							}

							<h6 className="light-gray fs-6 fw-bold ">{t("cook_profile.languages_known")}</h6>
							{cookDetails?.languages && cookDetails?.languages?.length > 0 && cookDetails?.languages[0] !== 'false' ?
								<ul className="ps-0 heading-color">
									{cookDetails?.languages?.map(_items =>
										<li class="fw-bold" key={_items}>{_items}</li>
									)}
								</ul>
								:
								<span>{t("cook_profile.no_language")}</span>
							}

							<h6 className="light-gray fs-6 fw-bold ">{t("cooklist.profession")}</h6>
							{cookDetails?.profession && cookDetails?.profession !== '' ?
								<ul className="ps-0 heading-color">
									<li class="fw-bold text-capitalize">{cookDetails?.profession}</li>
								</ul>
								:
								<span>{t("cook_profile.no_profession")}</span>
							}
						</div>
					</div>
				</div>
			</section >

      <section id="recipes">
        <div className="recipes-background mb-5">
          <div className="container">
            <div className="row align-items-center h-100 pt-3">
              <h2 className="mb-0 fw-bold mt-3 text-success">
              {t("cook_profile.best")} <span className="heading-color">{t("cook_profile.recipes")}</span>
              </h2>

              {cookDetails.best_recipes &&
              cookDetails.best_recipes.length > 0 &&
              cookDetails?.best_recipes[0] !== false ? (
                <div class="cook-my-profile-carousel-arrow">
                  <div class="cook_my_profile_arrow_left">
                    <i
                      onClick={() => bestRecipeRef.current.prev()}
                      class="--cursor-pointer bi bi-chevron-left"
                    ></i>
                  </div>
                  <div class="cook_my_profile_arrow_right">
                    <i
                      onClick={() => bestRecipeRef.current.next()}
                      class="--cursor-pointer bi bi-chevron-right"
                    ></i>
                  </div>
                  <OwlCarousel
                    ref={bestRecipeRef}
                    options={options}
                    events={events}
                  >
                    {cookDetails?.best_recipes.map((_l) => (
                      <div
                        key={_l._id}
                        onClick={() =>
                          recipeDetailsPage(
                            _l._id,
                            cookDetails.firstname + " " + cookDetails.lastname,
                            cookDetails.pictures
                          )
                        }
                        className="pb-4 me-0 me-md-3 --cursor-pointer"
                      >
                        <div className="cook-recipes">
                          <div className="recipe-decription">
                            <div className="d-flex justify-content-center mb-5">
                              <h5>{t("cook_profile.click")}</h5>
                            </div>
                            <h5>{_l.title}</h5>
                            <div class="recipe-decription-inner-content">
                              <h6 class="fw-600 mt-3">{t("cook_profile.ingredients")}</h6>
                              {_l.ingredients && _l.ingredients.length > 0 && (
                                <ul>
                                  {_l.ingredients
                                    .slice(0, 2)
                                    .map((_ing, _ind) => {
                                      return <li key={_ind}>{_ing}</li>;
                                    })}
                                </ul>
                              )}
                            </div>
                          </div>
                          <img
                            src={
                              _l.images[0]
                                ? `${REACT_APP_API_URL}${_l.images[0]}`
                                : slideImg2
                            }
                            className="d-flex justify-content-center w-100 img-fluid "
                          />
                        </div>
                      </div>
                    ))}
                  </OwlCarousel>
                </div>
              ) : (
                <div className="d-md-flex d-block align-items-baseline justify-content-between">
                  <div className="my-md-0 my-3">
                    <p style={{ color: "#555" }}>{t("cook_profile.no_recipe")}</p>
                  </div>

                  <Link
                    to={`/cookreact/add-new-recipe`}
                    className="btn btn-success ms-md-3 ms-0 mb-md-0 mb-3"
                  >
                    {t("cook_profile.add_new")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* <section id="speciality">
    <div className="container mb-md-5 mb-0">
      <div className="row align-items-center h-100 ">
        <h2 className="mb-0 fw-bold  text-success">{cookDetails.firstname + " " + cookDetails.lastname + "'s"} <span
            className="heading-color">Speciality</span></h2>
        {cookDetails.speciality && cookDetails.speciality.length > 0 &&
        <OwlCarousel options={options} events={events}>
          {cookDetails.speciality.map(_l =>
          <div key={_l._id} className="pb-4 me-0 me-md-2">
            <div className="recipe-decription">
              <h5 className=" mt-3">{_l.title}</h5>
            </div>
            <div className="cook-recipes">
              <img src={_l.images[0] ? `${REACT_APP_API_URL}${_l.images[0]}` : slideImg2}
                className="d-flex justify-content-center w-100 img-fluid " />
            </div>
          </div>
          )}
        </OwlCarousel>
        }
      </div>
    </div>
  </section> */}

      <section id="speciality" className="mb-5">
        <div className="container">
          <div className="rating-wrapper">
            <div className="d-block">
              <h2 className="heading-color fw-bold mb-2">{t("cooklist.speciality")}</h2>
              <div className="d-md-flex d-block align-items-baseline">
                {props.user !== null &&
                props.user?.speciality &&
                props.user?.speciality[0] !== false ? (
                  <div className="speciality-section">
                    <div className="d-flex flex-wrap"></div>
                    <div className="d-flex flex-wrap">
                      {props.user?.speciality.map((_sp, index) => (
                        <>
                          <div className="speciality_wrapper">
                            <span>{_sp}</span>
                          </div>
                        </>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p style={{ color: "#555" }}>{t("cook_profile.no_speciality")}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="ratings" className="mb-5">
        <div className="container">
          <div className="rating-wrapper">
            <div className="d-md-flex d-block justify-content-between">
              <h2 className="heading-color fw-bold mb-0">{t("cook_profile.ratings")}</h2>
              <div className="d-md-flex d-block align-items-baseline">
                {/* <div className="Overall-rating my-md-0 my-3">
                <h6 className="fs-6 fw-bold text-success mb-0">
                  Overall rating
                </h6>
                <div className="d-flex justify-content-between mt-2">
                  <p className="mb-0 me-3">
                    {parseFloat(cookDetails?.rating).toFixed(1)} out of 5.0
                  </p>
                  <StarRatings rating={cookDetails?.rating} starRatedColor="rgb(236, 192, 15)" starDimension="18px"
                    starSpacing="1px" numberOfStars={5} name="rating" />
                </div>
                <p className="text-color reviews mb-0">
                  {reviews.length} review(s)
                </p>
              </div> */}
              </div>
            </div>
            <div className="Overall-rating bg-transparent px-0 py-md-5 py-3 my-md-0 my-3">
              <h6 className="display-5 fw-bold text-center text-success mb-0">
                {t("cook_profile.overall_rating")}
              </h6>
              <div className="d-flex justify-content-center text-center align-items-center mt-2 flex-column flex-sm-row">
                <p className="mb-0 me-3 fw-bold me-sm-5 m-0 h1 mb-2 mb-sm-0">
                  {parseFloat(cookDetails.rating).toFixed(1)}
                  /5.0
                </p>
                <StarRatings
                  rating={cookDetails.rating}
                  starRatedColor="rgb(236, 192, 15)"
                  starDimension="30px"
                  starSpacing="2px"
                  numberOfStars={5}
                  name="rating"
                />
                <p className="text-color ms-sm-5 reviews fs-6 m-0 mt-2 mt-sm-0">
                  {reviews.length} {t("cook_profile.reviews")}
                </p>
              </div>
              <div class="detail_rating row mt-4 justify-content-center">
                <div class="col-md-6 col-lg-5 rating d-flex align-items-center mb-2 justify-content-between">
                  <h5 class="text-color rating-name fw-600 col-md-6 col-sm-8 col-5 mb-0">
                  {t("cook_profile.communication")}
                  </h5>
                  <label class="fs-6 fw-normal">
                    {roundOf(
                      cookDetails?.communication
                        ? cookDetails?.communication
                        : 0
                    )}
                    <span class="px-2 align-text-bottom">
                      <StarRatings
                        rating={
                          cookDetails?.communication
                            ? cookDetails?.communication
                            : 0
                        }
                        starRatedColor="rgb(236, 192, 15)"
                        starDimension="20px"
                        starSpacing="2px"
                        numberOfStars={5}
                        name="rating"
                      />
                    </span>
                  </label>
                </div>
                <div class="col-md-6 col-lg-5 rating d-flex align-items-center mb-2 justify-content-between">
                  <h5 class="text-color rating-name fw-600 col-md-6 col-sm-8 col-5 mb-0">
                  {t("cook_profile.presentation")}
                  </h5>
                  <label class="fs-6 fw-normal">
                    {roundOf(
                      cookDetails?.presentation ? cookDetails?.presentation : 0
                    )}
                    <span class="px-2 align-text-bottom">
                      <StarRatings
                        rating={
                          cookDetails?.presentation
                            ? cookDetails?.presentation
                            : 0
                        }
                        starRatedColor="rgb(236, 192, 15)"
                        starDimension="20px"
                        starSpacing="2px"
                        numberOfStars={5}
                        name="rating"
                      />
                    </span>
                  </label>
                </div>
                <div class="col-md-6 col-lg-5 rating d-flex align-items-center mb-2 justify-content-between">
                  <h5 class="text-color rating-name fw-600 col-md-6 col-sm-8 col-5 mb-0">
                  {t("cook_profile.taste")}
                  </h5>
                  <label class="fs-6 fw-normal">
                    {roundOf(cookDetails?.taste ? cookDetails?.taste : 0)}
                    <span class="px-2 align-text-bottom">
                      <StarRatings
                        rating={cookDetails?.taste ? cookDetails?.taste : 0}
                        starRatedColor="rgb(236, 192, 15)"
                        starDimension="20px"
                        starSpacing="2px"
                        numberOfStars={5}
                        name="rating"
                      />
                    </span>
                  </label>
                </div>
                <div class="col-md-6 col-lg-5 rating d-flex align-items-center mb-2 justify-content-between">
                  <h5 class="text-color rating-name fw-600 col-md-6 col-sm-8 col-5 mb-0">
                  {t("cook_profile.punctuality")}
                  </h5>
                  <label class="fs-6 fw-normal">
                    {roundOf(
                      cookDetails?.punctuality ? cookDetails?.punctuality : 0
                    )}
                    <span class="px-2 align-text-bottom">
                      <StarRatings
                        rating={
                          cookDetails?.punctuality
                            ? cookDetails?.punctuality
                            : 0
                        }
                        starRatedColor="rgb(236, 192, 15)"
                        starDimension="20px"
                        starSpacing="2px"
                        numberOfStars={5}
                        name="rating"
                      />
                    </span>
                  </label>
                </div>
                <div class="col-md-6 col-lg-5 rating d-flex align-items-center mb-2 justify-content-between">
                  <h5 class="text-color rating-name fw-600 col-md-6 col-sm-8 col-5 mb-0">
                  {t("cook_profile.cleanliness")}
                  </h5>
                  <label class="fs-6 fw-normal">
                    {roundOf(
                      cookDetails?.cleanliness ? cookDetails?.cleanliness : 0
                    )}
                    <span class="px-2 align-text-bottom">
                      <StarRatings
                        rating={
                          cookDetails?.cleanliness
                            ? cookDetails?.cleanliness
                            : 0
                        }
                        starRatedColor="rgb(236, 192, 15)"
                        starDimension="20px"
                        starSpacing="2px"
                        numberOfStars={5}
                        name="rating"
                      />
                    </span>
                  </label>
                </div>
                <div class="col-md-6 col-lg-5 rating d-flex align-items-center mb-2 justify-content-between">
                  <h5 class="text-color rating-name fw-600 col-md-6 col-sm-8 col-5 mb-0">
                  {t("cook_profile.value")}
                  </h5>
                  <label class="fs-6 fw-normal">
                    {roundOf(cookDetails?.value ? cookDetails?.value : 0)}
                    <span class="px-2 align-text-bottom">
                      <StarRatings
                        rating={cookDetails?.value ? cookDetails?.value : 0}
                        starRatedColor="rgb(236, 192, 15)"
                        starDimension="20px"
                        starSpacing="2px"
                        numberOfStars={5}
                        name="rating"
                      />
                    </span>
                  </label>
                </div>
              </div>
            </div>
            {reviews?.length == 0 ? (
              <p style={{ color: "#555" }}>{t("cook_profile.no_review")}</p>
            ) : (
              reviews.map((_items) => (
                <div key={_items._id} className="row chat-section">
                  <div className="media-img">
                    <img
                      src={
                        _items?.user && _items?.user[0]?.pictures
                          ? `${REACT_APP_API_URL}${_items.user[0].pictures}`
                          : `${window.location.origin}/cookreact/user.png`
                      }
                      className="chat-profile-img img-fluid mb-2 mb-md-0"
                    />
                  </div>
                  <div className="col">
                    <h6 className="heading-color fw-bold">{_items.title}</h6>
                    <StarRatings
                      rating={_items.rate}
                      starRatedColor="rgb(236, 192, 15)"
                      starDimension="22px"
                      starSpacing="2px"
                      numberOfStars={5}
                      name="rating"
                    />
                    <p className="text-color mt-2">{_items.description}</p>
                    <div className="d-flex align-items-center">
                      {_items.user && _items.user.length > 0 ? (
                        <p className="text-color mb-0 me-3 fw-bold">
                          - {_items.user[0].firstname} {_items.user[0].lastname}
                        </p>
                      ) : (
                        <p className="text-color mb-0 me-3 fw-bold">
                          - <i>{t("cook_profile.no_user")}!</i>
                        </p>
                      )}
                      <span className="light-gray msg-timing">
                        {Moment(_items.updated_at).format("DD-MMM-YYYY")}
                      </span>
                      {!_items.cook_comment && (
                        <span
                          onClick={() => setSelectedReviewForReply(_items._id)}
                          className="--cursor-pointer"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          <i className="bi bi-reply-fill text-color mb-0 ms-3 text-success">
                          {t("cook_profile.reply")}
                          </i>
                        </span>
                      )}
                    </div>
                    {_items.cook_comment && (
                      <div className="row mt-3">
                        <div className="media-img">
                          <img
                            className="chat-profile-img img-fluid mb-2 mb-md-0"
                            src={
                              props.user.pictures === null
                                ? "user.png"
                                : `${REACT_APP_API_URL}${props.user.pictures}`
                            }
                          />
                        </div>
                        <div className="col">
                          <p className="text-color mb-1">
                            {_items.cook_comment}
                          </p>
                          <div className="d-flex align-items-center">
                            <p className="text-color mb-0 me-3 fw-bold">
                              - {props.user.firstname} {props.user.lastname}
                            </p>
                            <span className="light-gray msg-timing">
                              {Moment(_items.cook_comment_at).format(
                                "DD-MMM-YYYY"
                              )}
                            </span>
                          </div>
                          <div className="d-flex align-items-center">
                            {/* <span onClick={()=> setReplyForEdit(_items)}
                      className="--cursor-pointer"
                      data-bs-toggle="modal"
                      data-bs-target="#editReplyModal"
                      >
                      <i className="bi bi-pencil-square text-color mb-0 text-primary">
                        {" "}
                        Edit
                      </i>
                    </span> */}
                            <span
                              className="--cursor-pointer"
                              data-bs-toggle="modal"
                              data-bs-target="#deleteModal"
                              onClick={() => setDeleteId(_items._id)}
                            >
                              <i className="bi bi-trash-fill text-color mb-0 ms-3 text-primary">
                                {" "}
                                {t("dashboard.delete")}
                              </i>
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-bottom-0">
              <h5 className="modal-title heading-color" id="exampleModalLabel">
              {t("cook_profile.add_review")}
              </h5>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="modal-body  py-0 pb-1 add-review-popup">
                <div className="mb-3">
                  <label
                    htmlFor="exampleFormControlTextarea1"
                    className="form-label"
                  >
                    {t("cook_profile.reply2")}
                  </label>
                  <textarea
                    className="form-control"
                    id="exampleFormControlTextarea1"
                    rows="5"
                    name="cook_comment"
                    placeholder="Type here"
                    {...register("cook_comment", { required: true })}
                  ></textarea>
                  {errors.cook_comment &&
                    errors.cook_comment.type === "required" && (
                      <p className="errorMsg mb-0 mt-2 text-danger">
                        {t("cook_profile.validation")}
                      </p>
                    )}
                </div>
              </div>
              <div className="modal-footer border-top-0">
                <button
                  type="button"
                  id="closeModalButton"
                  className="btn Cancel-button"
                  data-bs-dismiss="modal"
                >
                  {t("dashboard.cancel")}
                </button>
                <button type="submit" className="btn btn-success post-button">
                {t("cook_profile.reply2")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* <div className="modal fade" id="editReplyModal" tabIndex="-1" aria-labelledby="editReplyModalLabel"
      aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-bottom-0">
            <h5 className="modal-title heading-color" id="editReplyModalLabel">Add Review</h5>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body  py-0 pb-1 add-review-popup">
              <div className="mb-3">
                <label htmlFor="exampleFormControlTextarea1" className="form-label">Reply to the above review
                  here</label>
                <textarea className="form-control" id="exampleFormControlTextarea1" rows="5" name="cook_comment"
                  placeholder="Type here" {...register('cook_comment', { required: true })}></textarea>
                {errors.cook_comment && errors.cook_comment.type === "required" && (
                <p className="errorMsg mb-0 mt-2 text-danger">This field is required.</p>
                )}
              </div>
            </div>
            <div className="modal-footer border-top-0">
              <button type="button" id="closeModalButton" className="btn Cancel-button"
                data-bs-dismiss="modal">Cancel</button>
              <button type="submit" className="btn btn-success post-button">Post</button>
            </div>
          </form>
        </div>
      </div>
    </div> */}

      <div
        className="modal fade"
        id="deleteModal"
        tabIndex="-1"
        aria-labelledby="deleteModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-bottom-0"></div>
            <div className="modal-body  py-0 pb-1 add-review-popup">
              <div className="mb-3 mt-2">
                <p>{t("cook_profile.delete")}</p>
              </div>
            </div>
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
                type="button"
                onClick={() => deleteReply(deleteId)}
                data-bs-dismiss="modal"
                className="btn btn-danger
              post-button"
              >
                {t("dashboard.delete")}
              </button>
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
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CookMyProfile);
