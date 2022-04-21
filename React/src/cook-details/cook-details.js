import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link, useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import Moment from 'moment';
import { connect } from "react-redux"
import { ToastContainer, toast } from 'react-toastify';
import OwlCarousel from 'react-owl-carousel2';
import 'react-toastify/dist/ReactToastify.min.css';
import StarRatings from 'react-star-ratings';
import slideImg2 from "../public/best-recipe2.jpg";
import MyComponent from 'react-fullpage-custom-loader';
import { useTranslation } from 'react-i18next';
const { REACT_APP_API_URL } = process.env;

async function addReview(
	credentials,
	communicationRating,
	presentationRating,
	tasteRating,
	punctualityRating,
	cleanlinessRating,
	valueRating,
	cook_id) {
	credentials['communication'] = communicationRating;
	credentials['presentation'] = presentationRating;
	credentials['taste'] = tasteRating;
	credentials['punctuality'] = punctualityRating;
	credentials['cleanliness'] = cleanlinessRating;
	credentials['value'] = valueRating;
	credentials['cook_id'] = cook_id;
	return fetch(`${REACT_APP_API_URL}api/add/review`, {
		method: 'POST',
		headers: {
			'x-access-token': localStorage.getItem('token'),
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(credentials)
	});
}
async function updateReview(
	credentials,
	communicationRating,
	presentationRating,
	tasteRating,
	punctualityRating,
	cleanlinessRating,
	valueRating,
	cook_id,
	editReviewId) {
	credentials['communication'] = communicationRating;
	credentials['presentation'] = presentationRating;
	credentials['taste'] = tasteRating;
	credentials['punctuality'] = punctualityRating;
	credentials['cleanliness'] = cleanlinessRating;
	credentials['value'] = valueRating;
	credentials['cook_id'] = cook_id;
	return fetch(`${REACT_APP_API_URL}api/edit/review/${editReviewId}`, {
		method: 'POST',
		headers: {
			'x-access-token': localStorage.getItem('token'),
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(credentials)
	});
}
async function sendMessage(cook_id) {
	let message = { message: 'Hello there, Greetings of the day.', send_to: cook_id }
	return fetch(`${REACT_APP_API_URL}api/send/message`, {
		method: 'POST',
		headers: {
			'x-access-token': localStorage.getItem('token'),
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(message)
	});
}

function CookDetails(props) {
	const { t } = useTranslation();
	let navigate = useNavigate();
	const [sendingMessage, setSendingMessage] = useState(false);
	const [communicationRating, setCommunicationRating] = useState(1);
	const [presentationRating, setPresentationRating] = useState(1);
	const [tasteRating, setTasteRating] = useState(1);
	const [punctualityRating, setPunctualityRating] = useState(1);
	const [cleanlinessRating, setCleanlinessRating] = useState(1);
	const [valueRating, setValueRating] = useState(1);

	const [communicationRatingEdit, setCommunicationRatingEdit] = useState(1);
	const [presentationRatingEdit, setPresentationRatingEdit] = useState(1);
	const [tasteRatingEdit, setTasteRatingEdit] = useState(1);
	const [punctualityRatingEdit, setPunctualityRatingEdit] = useState(1);
	const [cleanlinessRatingEdit, setCleanlinessRatingEdit] = useState(1);
	const [valueRatingEdit, setValueRatingEdit] = useState(1);

	const [editReviewId, setEditReviewId] = useState(null);
	const [active, setActive] = useState('about');
	const [cookDetails, setCookDetails] = useState({});
	const [reviews, setReviews] = useState([]);
	const { cook_id } = useParams();
	let location = useLocation();
	const { register, handleSubmit, getValues, clearErrors, reset, formState: { errors } } = useForm();
	const bestRecipeRef = useRef();
	const {
		reset: reset2,
		register: register2,
		getValues: getValues2,
		clearErrors: clearErrors2,
		formState: { errors: errors2 },
		handleSubmit: handleSubmit2,
	} = useForm();

	const {
		reset: reset3,
		register: register3,
		getValues: getValues3,
		setValue,
		clearErrors: clearErrors3,
		formState: { errors: errors3 },
		handleSubmit: handleSubmit3,
	} = useForm();

	const onSubmit = async e => {
		await addReview(
			getValues(),
			communicationRating,
			presentationRating,
			tasteRating,
			punctualityRating,
			cleanlinessRating,
			valueRating,
			cookDetails._id
		).then(data => data.json())
			.then(res => {
				if (res.status == false) {
					// setError("serverError", { type: "focus", message: res.message });
				} else {
					getCookDetails()
					document.getElementById("closeModalButton").click()
					reset()
					setCommunicationRating(1)
					setPresentationRating(1)
					setTasteRating(1)
					setPunctualityRating(1)
					setCleanlinessRating(1)
					setValueRating(1)
					getReviews(cookDetails._id);
					toast.success('Review added successfully.');
					setTimeout(() => {
						document.getElementById('ratings').scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
					}, 1000);
				}
			})
	}
	const onEditSubmit = async e => {
		await updateReview(
			getValues3(),
			communicationRatingEdit,
			presentationRatingEdit,
			tasteRatingEdit,
			punctualityRatingEdit,
			cleanlinessRatingEdit,
			valueRatingEdit,
			cookDetails._id,
			editReviewId
		).then(data => data.json())
			.then(res => {
				if (res.status == false) {
					// setError("serverError", { type: "focus", message: res.message });
				} else {
					getCookDetails()
					document.getElementById("closeEditModalButton").click()
					reset3()
					setCommunicationRatingEdit(1);
					setPresentationRatingEdit(1);
					setTasteRatingEdit(1);
					setPunctualityRatingEdit(1);
					setCleanlinessRatingEdit(1);
					setValueRatingEdit(1);
					getReviews(cookDetails._id);
					toast.success('Review updated successfully.');
					setTimeout(() => {
						document.getElementById('ratings').scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
					}, 1000);
				}
			})
	}
	const submitMessageForm = async e => {
		setSendingMessage(true)
		await sendMessage(cookDetails._id).then(data => data.json())
			.then(res => {
				setTimeout(() => {
					setSendingMessage(false)
					if (res.status == true) {
						navigate("/cookreact/conversations", { replace: true });
					}
				}, 300);
			})
	}
	function getReviews(cook) {
		fetch(`${REACT_APP_API_URL}api/cook/reviews/${cook}?limit=10&page=1`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(data => data.json())
			.then(res => {
				setReviews(res)
			})
	}
	useEffect(() => {

	}, [reviews])
	useEffect(() => {
		setTimeout(() => {
			const _target = window.location.hash
			if (_target) {
				const __target = _target.substring(1)
				document.getElementById(__target).scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
				setActive(__target)
			}
		}, 100);
	}, [])
	useEffect(() => {
		window.scrollTo(0, 0)
		getCookDetails();
		getReviews(cook_id);
	}, [])
	const getCookDetails = () => {
		fetch(`${REACT_APP_API_URL}api/cook/detail/${cook_id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.getItem('token')
			}
		}).then(data => data.json())
			.then(res => {
				setCookDetails(res);
			})
	}
	
	const options = {
        nav: false,
        rewind: true,
        autoplay: true,
        responsive: {
            0: {
                items: 2
            },
            600: {
                items: 3
            },
            800: {
                items: 4
            }
        },
    };
	const events = {
		onDragged: function (event) { },
		onChanged: function (event) { }
	};

	function scrollToSection(tag) {
		document.getElementById(tag).scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
		setActive(tag)
	}
	function setReviewForEdit(item) {
		setEditReviewId(item._id)
		setCommunicationRatingEdit(item.communication);
		setPresentationRatingEdit(item.presentation);
		setTasteRatingEdit(item.taste);
		setPunctualityRatingEdit(item.punctuality);
		setCleanlinessRatingEdit(item.cleanliness);
		setValueRatingEdit(item.value);
		setValue("title", item.title)
		setValue("description", item.description)
	}

	const recipeDetailsPage = (id, ownerName, display) => {
		navigate(`/cookreact/recipe-detail?id=${id}&ownerName=${ownerName}&display=${display}`)
	}
	const roundOf = _ => parseFloat(_).toFixed(1)
	return (
		<div className="App">
			{sendingMessage && <MyComponent sentences={['']} />}
			<ToastContainer />
			<div className="cook-details-banner" style={{
				backgroundImage:
					`url(${cookDetails.cover == null ? window.location.origin + '/cookreact/cook-details-banner.png' : REACT_APP_API_URL + '' + cookDetails.cover})`
			}}></div>
			<div className="container">
				<div className="cook-details">
					<div className="row">
						<div className="col-md-4">
							<img src={cookDetails.pictures ? `${REACT_APP_API_URL}${cookDetails.pictures}` : `${window.location.origin}/cookreact/user.png`}
								className="img-fluid w-md-auto w-100 chef-details-img" />
						</div>

						<div className="col-md-8 p-4">

							<div className="d-flex justify-content-between">
								<div>
									<h4 className="heading-color fw-bold mb-0 mt-2 mt-md-0">{cookDetails.firstname + " " + cookDetails.lastname}</h4>
									<p className="text-color mb-1"> <i className="bi bi-geo-alt-fill me-1"></i>{cookDetails.distance} {t("cooklist.away")}</p>
								</div>
								<div>
									<h3 className="text-success fw-bold prize mb-0 mt-md-0 mt-2">${cookDetails.hourly_rate}<span
										className="light-gray">/{t("dashboard.hour")}</span>
									</h3>
								</div>
							</div>

							<div className="d-flex align-items-center mt-2">
								<p className="fs-6 heading-color pe-2 mb-0">{parseFloat(cookDetails.rating).toFixed(1)}</p>
								<StarRatings
									rating={cookDetails.rating}
									starRatedColor='rgb(236, 192, 15)'
									starDimension="22px"
									starSpacing="2px"
									numberOfStars={5}
									name='rating'
								/>
							</div>


							<div className="mt-5 d-flex align-items-center justify-content-between cook-details-tabs">
								<ul className="nav">
									<li className="nav-item heading-color">
										<Link onClick={() => scrollToSection('about')} className={`nav-link ${active == 'about' && 'active'}`} to="#about">{t("header.about")}</Link>
									</li>
									<li className="nav-item">
										<Link onClick={() => scrollToSection('recipes')} className={`nav-link ${active == 'recipes' && 'active'}`} to="#recipes">{t("cook_profile.recipes")}</Link>
									</li>
									{/* <li className="nav-item">
										<Link onClick={() => scrollToSection('speciality')} className={`nav-link ${active == 'speciality' && 'active'}`} to="#speciality">Speciality</Link>
									</li> */}
									<li className="nav-item">
										<Link onClick={() => scrollToSection('ratings')} className={`nav-link ${active == 'ratings' && 'active'}`} to="#ratings">{t("cooklist.ratings")}</Link>
									</li>
								</ul>
								{/* <Link
									className="btn btn-success ms-md-3 ms-0 mb-md-0 mb-3"
									aria-current="page"
									to="/cookreact/conversations"
								>Message</Link> */}
								{props.user.role == 'user' &&
									<button type="button" onClick={() => submitMessageForm()} className="btn btn-success ms-md-3 ms-0 mb-md-0 mb-3">{t("contact.message")}</button>
								}
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
							<h2 className="fw-bold my-3 text-success">
								{t("cook_profile.best")} <span className="heading-color">{t("cook_profile.recipes")}</span>
							</h2>

							{cookDetails.best_recipes && cookDetails.best_recipes.length > 0
								&& cookDetails?.best_recipes[0] !== false ?

								<div class="cook-details-carousel-arrows">
									<div class="cook_my_profile_arrow_left">
										<i onClick={() => bestRecipeRef.current.prev()} class="--cursor-pointer bi bi-chevron-left"></i>
									</div>
									<div class="cook_my_profile_arrow_right">
										<i onClick={() => bestRecipeRef.current.next()} class="--cursor-pointer bi bi-chevron-right"></i>
									</div>
									<OwlCarousel ref={bestRecipeRef} options={options} events={events} >
										{cookDetails?.best_recipes.map((_l) => (
											<div key={_l._id} onClick={() => recipeDetailsPage(_l._id, cookDetails.firstname + ' ' + cookDetails.lastname, cookDetails.pictures)} className="pb-4 me-0 me-md-3 --cursor-pointer">
												<div className="cook-recipes">
													<div className="recipe-decription">
														<div className="d-flex justify-content-center mb-5">
															<h5>{t("cook_profile.click")}</h5>
														</div>
														<h5>{_l.title}</h5>
														<div class="recipe-decription-inner-content">
															<h6 class="fw-600 mt-3">{t("cook_profile.ingredients")}</h6>
															{_l.ingredients && _l.ingredients.length > 0 &&
																<ul>
																	{_l.ingredients.slice(0, 2).map((_ing, _ind) => {
																		return <li key={_ind}>{_ing}</li>
																	})
																	}
																</ul>
															}
														</div>
													</div>
													<img
														src={_l.images[0] ? `${REACT_APP_API_URL}${_l.images[0]}` : slideImg2}
														className="d-flex justify-content-center w-100 img-fluid "
													/>
												</div>
											</div>
										))}
									</OwlCarousel>
								</div>

								:

								<div className="d-md-flex d-block align-items-baseline justify-content-between">
									<div className="my-md-0 my-3">
										<p style={{ color: "#555" }}>{t("cook_profile.no_recipe")}</p>
									</div>
								</div>
							}


						</div>
					</div>
				</div>
			</section>

			{/* 
			<section id="speciality">
				<div className="container mb-md-5 mb-0">
					<div className="row align-items-center h-100 ">
						<h2 className="mb-0 fw-bold  text-success">{cookDetails.firstname + " " + cookDetails.lastname + "'s"} <span className="heading-color">Speciality</span></h2>
						{cookDetails.speciality && cookDetails.speciality.length > 0 &&
							<OwlCarousel options={options} events={events} >
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
							<h2 className="heading-color fw-bold mb-2">{t("cook_profile.speciality")}</h2>
							<div className="d-md-flex d-block align-items-baseline">
								{cookDetails !== null &&
									cookDetails?.speciality &&
									cookDetails?.speciality[0] !== false ?
									<div className="speciality-section">
										<div className="d-flex flex-wrap"></div>
										<div className="d-flex flex-wrap">
											{cookDetails?.speciality.map((_sp, index) =>
												<>
													<div className="speciality_wrapper">
														<span>{_sp}</span>
													</div>
												</>
											)}
										</div>
									</div>
									:
									<p style={{ color: "#555" }}>{t("cook_profile.no_speciality")}</p>
								}
							</div>
						</div>
					</div>
				</div>
			</section>

			<section id="ratings">
				<div className="container">
					<div className="rating-wrapper">
						{cookDetails?.isAlreadyReview == 0 && props.user.role == 'user' &&
							<div className="d-flex justify-content-between">
								<h2 className="heading-color fw-bold mb-0">{t("cook_profile.ratings")}</h2>
								<div className="d-md-flex d-block align-items-baseline">
									<button type="button" className="btn btn-success ms-md-3 ms-0 mb-md-0 mb-3" data-bs-toggle="modal"
										data-bs-target="#exampleModal">
										{t("cook_profile.write")}
									</button>
								</div>
							</div>
						}
						<div className="Overall-rating bg-transparent px-0 py-md-5 py-3 my-md-0 my-3">
							<h6 className="display-5 fw-bold text-center text-success mb-0">{t("cook_profile.overall_rating")}</h6>
							<div className="d-flex justify-content-center text-center align-items-center mt-2 flex-column flex-sm-row">
								<p className="mb-0 me-3 fw-bold me-sm-5 m-0 h1 mb-2 mb-sm-0">{parseFloat(cookDetails.rating).toFixed(1)} /5.0</p>
								<StarRatings
									rating={cookDetails?.rating}
									starRatedColor='rgb(236, 192, 15)'
									starDimension="30px"
									starSpacing="2px"
									numberOfStars={5}
									name='rating'
								/>
								<p className="text-color ms-sm-5 reviews fs-6 m-0 mt-2 mt-sm-0">{reviews.length} {t("cook_profile.reviews")}</p>
							</div>
							<div class="detail_rating row mt-4 justify-content-center">
								<div class="col-md-6 col-lg-5 rating d-flex align-items-center mb-2 justify-content-between">
									<h5 class="text-color rating-name fw-600 col-md-6 col-sm-8 col-5 mb-0">{t("cook_profile.communication")}</h5>
									<label class="fs-6 fw-normal">
										{roundOf(cookDetails?.communication ? cookDetails?.communication : 0)}
										<span class="px-2 align-text-bottom"><StarRatings
											rating={cookDetails?.communication ? cookDetails?.communication : 0}
											starRatedColor='rgb(236, 192, 15)'
											starDimension="20px"
											starSpacing="2px"
											numberOfStars={5}
											name='rating'
										/></span></label>
								</div>
								<div class="col-md-6 col-lg-5 rating d-flex align-items-center mb-2 justify-content-between">
									<h5 class="text-color rating-name fw-600 col-md-6 col-sm-8 col-5 mb-0">{t("cook_profile.presentation")}</h5>
									<label class="fs-6 fw-normal">
										{roundOf(cookDetails?.presentation ? cookDetails?.presentation : 0)}
										<span class="px-2 align-text-bottom"><StarRatings
											rating={cookDetails?.presentation ? cookDetails?.presentation : 0}
											starRatedColor='rgb(236, 192, 15)'
											starDimension="20px"
											starSpacing="2px"
											numberOfStars={5}
											name='rating'
										/></span></label>
								</div>
								<div class="col-md-6 col-lg-5 rating d-flex align-items-center mb-2 justify-content-between">
									<h5 class="text-color rating-name fw-600 col-md-6 col-sm-8 col-5 mb-0">{t("cook_profile.taste")}</h5>
									<label class="fs-6 fw-normal">
										{roundOf(cookDetails?.taste ? cookDetails?.taste : 0)}
										<span class="px-2 align-text-bottom"><StarRatings
											rating={cookDetails?.taste ? cookDetails?.taste : 0}
											starRatedColor='rgb(236, 192, 15)'
											starDimension="20px"
											starSpacing="2px"
											numberOfStars={5}
											name='rating'
										/></span></label>
								</div>
								<div class="col-md-6 col-lg-5 rating d-flex align-items-center mb-2 justify-content-between">
									<h5 class="text-color rating-name fw-600 col-md-6 col-sm-8 col-5 mb-0">{t("cook_profile.punctuality")}</h5>
									<label class="fs-6 fw-normal">
										{roundOf(cookDetails?.punctuality ? cookDetails?.punctuality : 0)}
										<span class="px-2 align-text-bottom"><StarRatings
											rating={cookDetails?.punctuality ? cookDetails?.punctuality : 0}
											starRatedColor='rgb(236, 192, 15)'
											starDimension="20px"
											starSpacing="2px"
											numberOfStars={5}
											name='rating'
										/></span></label>
								</div>
								<div class="col-md-6 col-lg-5 rating d-flex align-items-center mb-2 justify-content-between">
									<h5 class="text-color rating-name fw-600 col-md-6 col-sm-8 col-5 mb-0">{t("cook_profile.cleanliness")}</h5>
									<label class="fs-6 fw-normal">
										{roundOf(cookDetails?.cleanliness ? cookDetails?.cleanliness : 0)}
										<span class="px-2 align-text-bottom"><StarRatings
											rating={cookDetails?.cleanliness ? cookDetails?.cleanliness : 0}
											starRatedColor='rgb(236, 192, 15)'
											starDimension="20px"
											starSpacing="2px"
											numberOfStars={5}
											name='rating'
										/></span></label>
								</div>
								<div class="col-md-6 col-lg-5 rating d-flex align-items-center mb-2 justify-content-between">
									<h5 class="text-color rating-name fw-600 col-md-6 col-sm-8 col-5 mb-0">{t("cook_profile.value")}</h5>
									<label class="fs-6 fw-normal">
										{roundOf(cookDetails?.value ? cookDetails?.value : 0)}
										<span class="px-2 align-text-bottom"><StarRatings
											rating={cookDetails?.value ? cookDetails?.value : 0}
											starRatedColor='rgb(236, 192, 15)'
											starDimension="20px"
											starSpacing="2px"
											numberOfStars={5}
											name='rating'
										/></span></label>
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
											src={_items?.user && _items?.user[0].pictures ? `${REACT_APP_API_URL}${_items.user[0].pictures}` : `${window.location.origin}/cookreact/user.png`}
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
													- {_items.user[0].firstname}{" "}
													{_items.user[0].lastname}
												</p>
											) : (
												<p className="text-color mb-0 me-3 fw-bold">
													- <i>{t("cook_profile.no_user")}</i>
												</p>
											)}
											<span className="light-gray msg-timing">
												{Moment(_items.updated_at).format("DD-MMM-YYYY")}
											</span>
											{_items.user_id == props.user._id &&
												<span
													onClick={() => setReviewForEdit(_items)}
													className="--cursor-pointer"
													data-bs-toggle="modal"
													data-bs-target="#editReviewModal"
												>
													<i className="bi bi-pencil-square text-color mb-0 text-primary ms-1">
														{' '}{t("cook_profile.edit")}
													</i>
												</span>
											}
										</div>
										{_items.cook_comment && (
											<div className="row mt-3">
												<div className="col-md-1">
													<img
														className="chat-profile-img img-fluid mb-2 mb-md-0"
														src={cookDetails.pictures ? `${REACT_APP_API_URL}${cookDetails.pictures}` : `${window.location.origin}/cookreact/user.png`}
													/>
												</div>
												<div className="col-md-11">
													<p className="text-color mb-1">
														{_items.cook_comment}
													</p>
													<div className="d-flex align-items-center">
														<p className="text-color mb-0 me-3 fw-bold">
															- {cookDetails.firstname + " " + cookDetails.lastname}
														</p>
														<span className="light-gray msg-timing">
															{Moment(_items.cook_comment_at).format(
																"DD-MMM-YYYY"
															)}
														</span>
													</div>
												</div>
											</div>
										)}
									</div>
								</div>
							))
						)}



						{/* <div className="row pb-3">
							<div className="col-md-1">
								<img src={slideImg12} className="chat-profile-img img-fluid" />
							</div>

							<div className="col-md-11">
								<h6 className="heading-color fw-bold mt-2 mt-md-0">Amazing Experience</h6>
								<div className="d-flex mt-2">
									<p className="mb-0 me-3 heading-color">4.5</p>
									<i className="bi bi-star-fill gold-color"></i>
									<i className="bi bi-star-fill gold-color"></i>
									<i className="bi bi-star-fill gold-color"></i>
									<i className="bi bi-star-fill gold-color"></i>
									<i className="bi bi-star-half gold-color"></i>
								</div>

								<p className="text-color mt-2 ">Hired a Chef for our party and it was the best decision ever during
									these pandemic times. So professional. Everyone must try them for sure. Great job, website
									name.</p>

								<div className="d-flex align-items-center">
									<p className="text-color mb-0 me-3 fw-bold">- Maria franandez</p>
									<span className="light-gray msg-timing">15 Oct 2019</span>
								</div>

								<div className="row align-items-center mt-2">
									<div className="col-md-1">
										<img src={slideImg11} className="chat-profile-img img-fluid mt-3" />
									</div>

									<div className="col-md-11">
										<p className="text-color mb-0 mt-2 mt-md-0">Thank you so much for the review Maja, your
											words motivate
											us.</p>
										<div className="d-flex align-items-center">
											<p className="text-color mb-0 me-3 fw-bold">- Jane smith</p>
											<span className="light-gray msg-timing">15 Oct 2019</span>
										</div>
									</div>
								</div>

							</div>
						</div> */}


					</div>
				</div>

			</section>

			<div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header border-bottom-0">
							<h5 className="modal-title heading-color" id="exampleModalLabel">{t("cook_profile.add_review")}</h5>
						</div>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="modal-body  py-0 pb-1 add-review-popup">
								<div className="mb-3 mt-2 row">
									<div class="rating_coustom d-flex align-items-center justify-content-between mb-2 col-md-12">
										<label for="communication">{t("cook_profile.communication")}</label>
										<StarRatings
											rating={communicationRating}
											starRatedColor='rgb(71, 182, 26)'
											starHoverColor='rgb(0, 38, 76)'
											changeRating={(v) => { setCommunicationRating(v); clearErrors('rate'); }}
											starDimension="25px"
											starSpacing="5px"
											numberOfStars={5}
											name='rate' />
										{errors.rate && errors.rate.type === "required" && (
											<p className="errorMsg mb-0 mt-2 text-danger">{t("cook_profile.rate")}</p>
										)}
									</div>
									<div class="rating_coustom d-flex align-items-center justify-content-between mb-2 col-md-12">
										<label for="presentation">{t("cook_profile.presentation")}</label>
										<StarRatings
											rating={presentationRating}
											starRatedColor='rgb(71, 182, 26)'
											starHoverColor='rgb(0, 38, 76)'
											changeRating={(v) => { setPresentationRating(v); clearErrors('rate'); }}
											starDimension="25px"
											starSpacing="5px"
											numberOfStars={5}
											name='rate' />
										{errors.rate && errors.rate.type === "required" && (
											<p className="errorMsg mb-0 mt-2 text-danger">{t("cook_profile.rate")}</p>
										)}
									</div>
									<div class="rating_coustom d-flex align-items-center justify-content-between mb-2 col-md-12">
										<label for="taste">{t("cook_profile.taste")}</label>
										<StarRatings
											rating={tasteRating}
											starRatedColor='rgb(71, 182, 26)'
											starHoverColor='rgb(0, 38, 76)'
											changeRating={(v) => { setTasteRating(v); clearErrors('rate'); }}
											starDimension="25px"
											starSpacing="5px"
											numberOfStars={5}
											name='rate' />
										{errors.rate && errors.rate.type === "required" && (
											<p className="errorMsg mb-0 mt-2 text-danger">{t("cook_profile.rate")}</p>
										)}
									</div>
									<div class="rating_coustom d-flex align-items-center justify-content-between mb-2 col-md-12">
										<label for="punctuality">{t("cook_profile.punctuality")}</label>
										<StarRatings
											rating={punctualityRating}
											starRatedColor='rgb(71, 182, 26)'
											starHoverColor='rgb(0, 38, 76)'
											changeRating={(v) => { setPunctualityRating(v); clearErrors('rate'); }}
											starDimension="25px"
											starSpacing="5px"
											numberOfStars={5}
											name='rate' />
										{errors.rate && errors.rate.type === "required" && (
											<p className="errorMsg mb-0 mt-2 text-danger">{t("cook_profile.rate")}</p>
										)}
									</div>
									<div class="rating_coustom d-flex align-items-center justify-content-between mb-2 col-md-12">
										<label for="cleanliness">{t("cook_profile.cleanliness")}</label>
										<StarRatings
											rating={cleanlinessRating}
											starRatedColor='rgb(71, 182, 26)'
											starHoverColor='rgb(0, 38, 76)'
											changeRating={(v) => { setCleanlinessRating(v); clearErrors('rate'); }}
											starDimension="25px"
											starSpacing="5px"
											numberOfStars={5}
											name='rate' />
										{errors.rate && errors.rate.type === "required" && (
											<p className="errorMsg mb-0 mt-2 text-danger">{t("cook_profile.rate")}</p>
										)}
									</div>
									<div class="rating_coustom d-flex align-items-center justify-content-between mb-2 col-md-12">
										<label for="value">{t("cook_profile.value")}</label>
										<StarRatings
											rating={valueRating}
											starRatedColor='rgb(71, 182, 26)'
											starHoverColor='rgb(0, 38, 76)'
											changeRating={(v) => { setValueRating(v); clearErrors('rate'); }}
											starDimension="25px"
											starSpacing="5px"
											numberOfStars={5}
											name='rate' />
										{errors.rate && errors.rate.type === "required" && (
											<p className="errorMsg mb-0 mt-2 text-danger">{t("cook_profile.rate")}</p>
										)}
									</div>
									<label htmlFor="exampleFormControlInput1" className="form-label pt-3 mt-3 border-top">{t("cook_profile.title")}</label>
									<input type="text" name="title" className="form-control"
										id="exampleFormControlInput1" placeholder="Enter title"
										{...register('title', { required: true })} />
									{errors.title && errors.title.type === "required" && (
										<p className="errorMsg mb-0 mt-2 text-danger">{t("cook_profile.title_required")}</p>
									)}
								</div>
								<div className="mb-3">
									<label htmlFor="exampleFormControlTextarea1" className="form-label">{t("cook_profile.share_details")}</label>
									<textarea className="form-control" id="exampleFormControlTextarea1" rows="3" name="description"
										placeholder="Enter description" {...register('description', { required: true })}></textarea>
									{errors.description && errors.description.type === "required" && (
										<p className="errorMsg mb-0 mt-2 text-danger">{t("cook_profile.description_required")}</p>
									)}
								</div>
							</div>
							<div className="modal-footer border-top-0">
								<button type="button" id="closeModalButton" className="btn Cancel-button" data-bs-dismiss="modal">{t("dashboard.cancel")}</button>
								<button type="submit" className="btn btn-success post-button">{t("cook_profile.post")}</button>
							</div>
						</form>
					</div>
				</div>
			</div>
			<div className="modal fade" id="editReviewModal" tabIndex="-1" aria-labelledby="editReviewModalLabel" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header border-bottom-0">
							<h5 className="modal-title heading-color" id="editReviewModalLabel">{t("cook_profile.edit_review")}</h5>
						</div>
						<form onSubmit={handleSubmit3(onEditSubmit)}>
							<div className="modal-body  py-0 pb-1 add-review-popup">
								<div className="mb-3 mt-2 row">
									<div class="rating_coustom d-flex align-items-center justify-content-between mb-2 col-md-12">
										<label for="communication">{t("cook_profile.communication")}</label>
										<StarRatings
											rating={communicationRatingEdit}
											starRatedColor='rgb(71, 182, 26)'
											starHoverColor='rgb(0, 38, 76)'
											changeRating={(v) => { setCommunicationRatingEdit(v); clearErrors3('rate'); }}
											starDimension="30px"
											starSpacing="5px"
											numberOfStars={5}
											name='rate' />
									</div>
									<div class="rating_coustom d-flex align-items-center justify-content-between mb-2 col-md-12">
										<label for="communication">{t("cook_profile.presentation")}</label>
										<StarRatings
											rating={presentationRatingEdit}
											starRatedColor='rgb(71, 182, 26)'
											starHoverColor='rgb(0, 38, 76)'
											changeRating={(v) => { setPresentationRatingEdit(v); clearErrors3('rate'); }}
											starDimension="30px"
											starSpacing="5px"
											numberOfStars={5}
											name='rate' />
									</div>
									<div class="rating_coustom d-flex align-items-center justify-content-between mb-2 col-md-12">
										<label for="communication">{t("cook_profile.taste")}</label>
										<StarRatings
											rating={tasteRatingEdit}
											starRatedColor='rgb(71, 182, 26)'
											starHoverColor='rgb(0, 38, 76)'
											changeRating={(v) => { setTasteRatingEdit(v); clearErrors3('rate'); }}
											starDimension="30px"
											starSpacing="5px"
											numberOfStars={5}
											name='rate' />
									</div>
									<div class="rating_coustom d-flex align-items-center justify-content-between mb-2 col-md-12">
										<label for="communication">{t("cook_profile.punctuality")}</label>
										<StarRatings
											rating={punctualityRatingEdit}
											starRatedColor='rgb(71, 182, 26)'
											starHoverColor='rgb(0, 38, 76)'
											changeRating={(v) => { setPunctualityRatingEdit(v); clearErrors3('rate'); }}
											starDimension="30px"
											starSpacing="5px"
											numberOfStars={5}
											name='rate' />
									</div>
									<div class="rating_coustom d-flex align-items-center justify-content-between mb-2 col-md-12">
										<label for="communication">{t("cook_profile.cleanliness")}</label>
										<StarRatings
											rating={cleanlinessRatingEdit}
											starRatedColor='rgb(71, 182, 26)'
											starHoverColor='rgb(0, 38, 76)'
											changeRating={(v) => { setCleanlinessRatingEdit(v); clearErrors3('rate'); }}
											starDimension="30px"
											starSpacing="5px"
											numberOfStars={5}
											name='rate' />
									</div>
									<div class="rating_coustom d-flex align-items-center justify-content-between mb-2 col-md-12">
										<label for="communication">{t("cook_profile.value")}</label>
										<StarRatings
											rating={valueRatingEdit}
											starRatedColor='rgb(71, 182, 26)'
											starHoverColor='rgb(0, 38, 76)'
											changeRating={(v) => { setValueRatingEdit(v); clearErrors3('rate'); }}
											starDimension="30px"
											starSpacing="5px"
											numberOfStars={5}
											name='rate' />
									</div>
									<div className="mb-3 mt-2">
										<label htmlFor="exampleFormControlInput1" className="form-label">{t("cook_profile.title")}</label>
										<input type="text" name="title" className="form-control"
											id="exampleFormControlInput1" placeholder="Enter title"
											{...register3('title', { required: true })} />
										{errors3.title && errors3.title.type === "required" && (
											<p className="errorMsg mb-0 mt-2 text-danger">{t("cook_profile.title_required")}</p>
										)}
									</div>
									<div className="mb-3">
										<label htmlFor="exampleFormControlTextarea1" className="form-label">{t("cook_profile.share_details")}</label>
										<textarea className="form-control" id="exampleFormControlTextarea1" rows="3" name="description"
											placeholder="Enter description" {...register3('description', { required: true })}></textarea>
										{errors3.description && errors3.description.type === "required" && (
											<p className="errorMsg mb-0 mt-2 text-danger">{t("cook_profile.description_required")}</p>
										)}
									</div>
								</div>
							</div>
							<div className="modal-footer border-top-0">
								<button type="button" id="closeEditModalButton" className="btn Cancel-button" data-bs-dismiss="modal">{t("dashboard.cancel")}</button>
								<button type="submit" className="btn btn-success post-button">{t("cook_profile.post")}</button>
							</div>
						</form>
					</div>
				</div>
			</div>

			<div className="modal fade" id="messageModal" tabIndex="-1" aria-labelledby="messageModalLabel" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header border-bottom-0">
							<h5 className="modal-title heading-color" id="messageModalLabel">{t("cook_profile.send_message")}</h5>
						</div>
						<form onSubmit={handleSubmit2(submitMessageForm)}>
							<div className="modal-body  py-0 pb-1 add-review-popup">
								<div className="mb-3 mt-2">
									<input type="text" name="message" className="form-control"
										id="exampleFormControlInput1" placeholder="Enter message"
										{...register2('message', { required: true })} />
									{errors2.message && errors2.message.type === "required" && (
										<p className="errorMsg mb-0 mt-2 text-danger">{t("cook_profile.message_required")}</p>
									)}
								</div>
							</div>
							<div className="modal-footer border-top-0">
								<button type="button" id="closeMessageModalButton" className="btn Cancel-button" data-bs-dismiss="modal">{t("dashboard.cancel")}</button>
								<button type="submit" className="btn btn-success post-button">{t("conversations.send")}</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div >
	);
}
// }

const mapStateToProps = state => {
	return {
		user: state.user.user
	}
}
export default connect(mapStateToProps)(CookDetails)