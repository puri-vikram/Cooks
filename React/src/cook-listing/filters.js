import React, { useEffect, useState } from "react";
import Listing from "./cook-listing";
import Map from "../map-view/map-view"
import { connect } from "react-redux";
import { saveCooks } from "../redux/Cooks/cooks.actions";
import { saveFilters } from "../redux/Filters/filters.actions";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import { geocodeByLatLng } from "react-google-places-autocomplete";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { useTranslation } from "react-i18next";
import { loader } from "../redux/Loader/loader.actions";
const { REACT_APP_API_URL } = process.env;
function Filters(props) {
  const { t, i18n } = useTranslation();
  const [view, setView] = useState("list");
  const [priceOrder, setPriceOrder] = useState("ASC");
  const [place, setPlace] = useState(null);
  const a = JSON.parse(localStorage.getItem("cookfilter"));
  const [sliderVals, setSliderVals] = useState(5);
  const [query, setQuery] = useState({
    page: 1,
    limit: 100,
    hourly_rate_min: a?.priceFrom,
    hourly_rate_max: a?.priceTo,
    diet_type: a?.preference,
    meal_type: a?.meal_type,
    cuisine_type: a?.cuisine_type,
    languages: a?.languages,
    profession: a?.profession,
    rating: a?.rating,
    lat: a?.lat,
    lng: a?.lng,
    distance_type: i18n.resolvedLanguage == "en" ? "mile" : "km",
    diet_type_opr: "AND",
    meal_type_opr: "AND",
    cuisine_type_opr: "AND",
    language_opr: "AND",
    priceOrder: 'ASC',
    orderType: (a?.lat && a?.lat != '') ? 'distance' : 'price',
    orderDir: (a?.orderDir && a?.orderDir != '') ? a?.orderDir : 'ASC'
  });
  useEffect(() => {
    setQuery({
      ...query,
      distance_type: i18n.resolvedLanguage == "en" ? "mile" : "km",
    });
  }, [i18n.resolvedLanguage]);
  const [cookFilter, setCookFilter] = useState(
    JSON.parse(localStorage.getItem("cookfilter"))
  );

  const [dietPreferences, setDietPreferences] = useState([
    "Vegetarian",
    "Pescatarian",
    "Vegan",
    "Paleo",
    "Keto",
    "Gluten free",
  ]);
  const [mealTypes, setMealTypes] = useState([
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snacks",
    "Dessert",
  ]);
  const [cuisinePreferences, setCuisinePreferences] = useState([
    "Italian",
    "French",
    "American",
    "Japanese",
    "Korean",
  ]);

  const [languages, setLanguages] = useState([
    "English",
    "Mandarin",
    "Spanish",
    "Dutch",
    "Hindi",
    "Russian",
  ]);

  useEffect(() => {
    setQuery({ ...query, priceOrder: priceOrder });
  }, [priceOrder]);

  useEffect(() => {
    props.loader(true);
    fetch(`${REACT_APP_API_URL}api/cook/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query),
    })
      .then((data) => data.json())
      .then((res) => {
        props.saveCooks(res);
        props.loader(false);
      });
    // props.saveFilters(query)
  }, [query]);

  const handleSearch = (event) => {
    if (event.target.name == "distance") setSliderVals(event.target.value);
    setQuery({ ...query, [event.target.name]: event.target.value });
  };
  const handleDietType = () => {
    var { dietary_preference } = document.forms["filter"];
    const diet_type = Array.from(dietary_preference)
      .filter((e) => e.checked === true)
      .map((e) => e.value);
    cookFilter.preference = diet_type;
    localStorage.setItem("cookfilter", JSON.stringify(cookFilter));
    setQuery({ ...query, diet_type });
  };
  const handleMealType = () => {
    var { mealType } = document.forms["filter"];
    const meal_type = Array.from(mealType)
      .filter((e) => e.checked === true)
      .map((e) => e.value);
    cookFilter.meal_type = meal_type;
    localStorage.setItem("cookfilter", JSON.stringify(cookFilter));
    setQuery({ ...query, meal_type });
  };
  const handleCuisine = () => {
    var { cuisineType } = document.forms["filter"];
    const cuisine_type = Array.from(cuisineType)
      .filter((e) => e.checked === true)
      .map((e) => e.value);
    cookFilter.cuisine_type = cuisine_type;
    localStorage.setItem("cookfilter", JSON.stringify(cookFilter));
    setQuery({ ...query, cuisine_type });
  };
  const handleProfession = () => {
    var { professionType } = document.forms["filter"];
    const profession = professionType.value;
    cookFilter.profession = profession;
    localStorage.setItem("cookfilter", JSON.stringify(cookFilter));
    setQuery({ ...query, profession });
  };
  const handleLanguages = () => {
    var { languagesType } = document.forms["filter"];
    console.log(languagesType);
    const languages = Array.from(languagesType)
      .filter((e) => e.checked === true)
      .map((e) => e.value);
    cookFilter.languages = languages;
    localStorage.setItem("cookfilter", JSON.stringify(cookFilter));
    setQuery({ ...query, languages });
  };
  const handleRating = () => {
    var { ratingType } = document.forms["filter"];
    const rating = ratingType.value;
    cookFilter.rating = rating;
    localStorage.setItem("cookfilter", JSON.stringify(cookFilter));
    setQuery({ ...query, rating });
  };

  useEffect(() => {
    if (place) {
      geocodeByAddress(place?.label)
        .then((results) => getLatLng(results[0]))
        .then(({ lat, lng }) => {
          const orderType = 'distance'
          setQuery({ ...query, lat, lng, orderType })
          cookFilter.lat = lat;
          cookFilter.lng = lng;
          cookFilter.location = place.label
          cookFilter.orderType = orderType
          localStorage.setItem("cookfilter", JSON.stringify(cookFilter));
        }
        );
    } else {
      const lat = ''
      const lng = ''
      const orderType = 'price'
      const location = ''
      setQuery({ ...query, lat, lng, orderType, location })
      if (cookFilter) {
        cookFilter.lat = lat;
        cookFilter.lng = lng;
        cookFilter.location = location
        cookFilter.orderType = orderType
        localStorage.setItem("cookfilter", JSON.stringify(cookFilter));
      } else {
        const myFilter = { lat, lng, location, orderType }
        localStorage.setItem("cookfilter", JSON.stringify(myFilter));
      }
    }
  }, [place]);

  useEffect(() => {
    if (!localStorage.getItem("cookfilter")) {
      localStorage.setItem(
        "cookfilter",
        JSON.stringify({
          preference: [],
          lat: "",
          lng: "",
          location: "",
          priceFrom: "",
          priceTo: "",
          diet_type: [],
          meal_type: [],
          cuisine_type: [],
          languages: [],
          profession: '',
          rating: '',
          diet_type_opr: "AND",
          meal_type_opr: "AND",
          cuisine_type_opr: "AND",
          language_opr: "AND",
          priceOrder: 'ASC',
          orderType: 'price',
          orderDir: 'ASC',
        })
      );
      setCookFilter(JSON.parse(localStorage.getItem("cookfilter")));
    }
  }, []);
  const deleteFilters = () => {
    //const cookFilter = localStorage.removeItem("cookfilter")
    cookFilter.lat = "";
    cookFilter.lng = "";
    cookFilter.location = "";
    cookFilter.priceFrom = "";
    cookFilter.priceTo = "";
    cookFilter.preference = [];
    cookFilter.cuisine_type = []
    cookFilter.languages = []
    cookFilter.meal_type = []
    cookFilter.profession = "chef"
    cookFilter.rating = ""
    cookFilter.orderType = 'price'
    cookFilter.orderDir = 'ASC'

    localStorage.setItem("cookfilter", JSON.stringify(cookFilter));
    document.forms["filter"].reset();
    setQuery({
      page: 1,
      limit: 100,
      hourly_rate_min: "",
      hourly_rate_max: "",
      diet_type: [],
      lat: "",
      lng: "",
      diet_type_opr: "AND",
      meal_type_opr: "AND",
      cuisine_type_opr: "AND",
      language_opr: "AND",
      priceOrder: 'ASC',
      orderType: 'price',
      orderDir: 'ASC',
      distance_type: i18n.resolvedLanguage == "en" ? "mile" : "km"
    });
    document.querySelector(
      "#cheeckid-qq"
    ).children[1].children[0].children[0].innerHTML = "Select your city";
    setSliderVals(5);
  };


  const handleDietTypeOpr = (diet_type_opr) =>
    setQuery({ ...query, diet_type_opr });
  const handleMealTypeOpr = (meal_type_opr) =>
    setQuery({ ...query, meal_type_opr });
  const handleCuisineOpr = (cuisine_type_opr) =>
    setQuery({ ...query, cuisine_type_opr });
  const handleLanguagesOpr = (language_opr) =>
    setQuery({ ...query, language_opr });

  const priceChange = (e) => {
    // setPriceOrder(e.target.value);
    const orderDir = e.target.value;
    cookFilter.orderDir = orderDir;
    localStorage.setItem("cookfilter", JSON.stringify(cookFilter));
    setQuery({ ...query, orderDir });
  };
  return (
    <div>
      <div className="container">
        <hr className="mt-0" />
        <div className="row">
          <div className="col-md-3">
            <div>
              <div className="">
                <div className="row">
                  <div className="col-md-12 ">
                    <div className="row">
                      <div className="d-md-none d-flex align-items-center justify-content-between">
                        <h5 className="heading-color fw-bold my-3">
                          {t("cooklist.filters")}
                        </h5>
                        <Link
                          _ngcontent-ett-c51=""
                          to="#"
                          className="sort show-flters w-100 mr-2 bg-muted text-center d-block d-lg-none text-nowrap heading-color"
                        >
                          <span
                            _ngcontent-ett-c51=""
                            className="h6 text-drukWide-medium"
                          >
                            <i
                              _ngcontent-ett-c51=""
                              className="bi bi-filter"
                            ></i>
                            <span
                              _ngcontent-ett-c51=""
                              className="d-inline-block d-md-none ml-1"
                            >
                              {t("cooklist.view")}
                            </span>{" "}
                            {t("cooklist.filter")}
                          </span>
                        </Link>
                      </div>

                      <form name="filter">
                        <div className="filter-section">
                          <div className="d-flex align-items-center justify-content-between ">
                            <h5 className="heading-color fw-bold my-3 ">
                              {t("cooklist.filters")}
                            </h5>
                            <button
                              type="button"
                              className="close d-block d-md-none"
                              aria-label="Close"
                            >
                              <span aria-hidden="true">&times;</span>
                            </button>
                            <span
                              className="--cursor-pointer-underline  text-primary"
                              onClick={deleteFilters}
                            >
                              {t("cooklist.clear_filter")}
                            </span>
                            {/* <img src="refresh.png" className={rotate} alt="" width="20px" onClick={deleteFilters} /> */}
                          </div>

                          <div className="search_by_city_section">
                            <div className="row">
                              <div className="col-md-12 location-form">
                                <label
                                  htmlFor="location"
                                  className="heading-color"
                                >
                                  {t("cooklist.search_by_city")}
                                </label>
                                {/* <input type="text" className="form-control" placeholder="California" aria-label="location" />
                    <hr /> */}
                                <div className="mb-2">
                                  <GooglePlacesAutocomplete
                                    selectProps={{
                                      id: "cheeckid-qq",
                                      place,
                                      isClearable: true,
                                      onChange: (val) => {
                                        setPlace(val)
                                      },
                                      defaultInputValue: cookFilter?.location,
                                      placeholder: t("form.select"),
                                      noOptionsMessage: () =>
                                        "Please start typing",
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                            <hr />
                          </div>

                          <div className="location_distance mb-3">
                            <div className="row">
                              <div className="col-md-12 location-form">
                                <label
                                  htmlFor="location"
                                  className="heading-color"
                                >
                                  {t("cooklist.distance")}
                                </label>
                                <div className="d-flex justify-content-start">
                                  <Box width="100%">
                                    <Slider
                                      value={sliderVals}
                                      defaultValue={5}
                                      aria-label="Default"
                                      name="distance"
                                      onChange={handleSearch}
                                      valueLabelDisplay="auto"
                                      max={200}
                                    />
                                  </Box>
                                </div>
                              </div>
                            </div>
                            <hr />
                          </div>

                          <div className="hourly-rate-section mb-3">
                            <div className="row">
                              <h5 className="heading-color fw-bold ">
                                {t("cooklist.rate")}
                              </h5>
                              <div className="col-md-6">
                                <label htmlFor="min" className="text-color">
                                  {t("cooklist.min")}
                                </label>
                                <input
                                  type="number"
                                  id="hours"
                                  name="hourly_rate_min"
                                  min="0"
                                  className="form-control"
                                  placeholder="$1"
                                  defaultValue={cookFilter?.priceFrom}
                                  onChange={(event) => {
                                    handleSearch(event);
                                    cookFilter.priceFrom = event.target.value;
                                    localStorage.setItem(
                                      "cookfilter",
                                      JSON.stringify(cookFilter)
                                    );
                                  }}
                                />
                              </div>
                              <div className="col-md-6 mt-3 mt-md-0">
                                <label htmlFor="min" className="text-color">
                                  {t("cooklist.max")}
                                </label>
                                <input
                                  type="number"
                                  id="hours"
                                  name="hourly_rate_max"
                                  className="form-control"
                                  placeholder="$70"
                                  defaultValue={cookFilter?.priceTo}
                                  onChange={(event) => {
                                    handleSearch(event);
                                    cookFilter.priceTo = event.target.value;
                                    localStorage.setItem(
                                      "cookfilter",
                                      JSON.stringify(cookFilter)
                                    );
                                  }}
                                />
                              </div>
                            </div>
                            <hr />
                          </div>

                          <div className="diet-preferences-section mb-3">
                            <div className="row">
                              <div className="col-md-12">
                                <div className="cook_listing_filters_heading align-items-center justify-content-between mb-2">
                                  <h5 className="heading-color fw-bold mb-0">
                                    {t("cooklist.diet")}
                                  </h5>
                                  <div className="dropdown">
                                    <button
                                      className="btn dropdown-toggle form-control text-color"
                                      type="button"
                                      id="dropdownMenu2"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      <span className="d-flex align-items-center justify-content-between">
                                        {query.diet_type_opr == "AND"
                                          ? "All"
                                          : "Any"}
                                        <i className="bi bi-chevron-down"></i>
                                      </span>
                                    </button>
                                    <ul
                                      className="dropdown-menu dropdown-menu-end"
                                      aria-labelledby="dropdownMenu2"
                                    >
                                      <li>
                                        <button
                                          className="dropdown-item"
                                          type="button"
                                          onClick={() => {
                                            handleDietTypeOpr("AND");
                                          }}
                                        >
                                          {t("cooklist.all")}
                                        </button>
                                      </li>
                                      <li>
                                        <button
                                          className="dropdown-item"
                                          type="button"
                                          onClick={() => {
                                            handleDietTypeOpr("OR");
                                          }}
                                        >
                                          {t("cooklist.any")}
                                        </button>
                                      </li>
                                    </ul>
                                  </div>
                                </div>

                                {dietPreferences.map((e, index) => (
                                  <div key={index} className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      name="dietary_preference"
                                      value={e}
                                      id={"diet-" + e}
                                      defaultChecked={
                                        cookFilter
                                          ? cookFilter.preference.includes(e)
                                          : false
                                      }
                                      onClick={handleDietType}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor={"diet-" + e}
                                    >
                                      {e}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <hr />
                          </div>

                          <div className="diet-preferences-section mb-3">
                            <div className="row">
                              <div className="col-md-12">
                                <div className="cook_listing_filters_heading align-items-center justify-content-between mb-2">
                                  <h5 className="heading-color fw-bold mb-0">
                                    {t("cooklist.meal")}
                                  </h5>
                                  <div className="dropdown">
                                    <button
                                      className="btn dropdown-toggle form-control text-color"
                                      type="button"
                                      id="dropdownMenu2"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      <span className="d-flex align-items-center justify-content-between">
                                        {query.meal_type_opr == "AND"
                                          ? "All"
                                          : "Any"}
                                        <i className="bi bi-chevron-down"></i>
                                      </span>
                                    </button>
                                    <ul
                                      className="dropdown-menu dropdown-menu-end"
                                      aria-labelledby="dropdownMenu2"
                                    >
                                      <li>
                                        <button
                                          className="dropdown-item"
                                          type="button"
                                          onClick={() => {
                                            handleMealTypeOpr("AND");
                                          }}
                                        >
                                          All
                                        </button>
                                      </li>
                                      <li>
                                        <button
                                          className="dropdown-item"
                                          type="button"
                                          onClick={() => {
                                            handleMealTypeOpr("OR");
                                          }}
                                        >
                                          Any
                                        </button>
                                      </li>
                                    </ul>
                                  </div>
                                </div>

                                {/* {mealTypes.map((e, index) => (
                          <div key={index} className="form-check">
                            <input className="form-check-input" type="checkbox" value={e} id={"meal-" + e} name="mealType"
                              onChange={handleMealType} />
                            <label className="form-check-label" htmlFor={"meal-" + e}>
                              {e}
                            </label>
                          </div>
                        ))} */}

                                {mealTypes.map((e, index) => (
                                  <div key={index} className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      value={e}
                                      id={"meal-" + e}
                                      name="mealType"
                                      defaultChecked={
                                        cookFilter
                                          ? cookFilter?.meal_type?.includes(e)
                                          : false
                                      }
                                      onClick={handleMealType}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor={"meal-" + e}
                                    >
                                      {e}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <hr />
                          </div>

                          <div className="diet-preferences-section mb-3">
                            <div className="row">
                              <div className="col-md-12">
                                <div className="mb-2 cook_listing_filters_heading align-items-center justify-content-between">
                                  <h5 className="heading-color fw-bold mb-0">
                                    {t("cooklist.cuisine")}
                                  </h5>
                                  <div className="dropdown">
                                    <button
                                      className="btn dropdown-toggle form-control text-color"
                                      type="button"
                                      id="dropdownMenu2"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      <span className="d-flex align-items-center justify-content-between">
                                        {query.cuisine_type_opr == "AND"
                                          ? "All"
                                          : "Any"}
                                        <i className="bi bi-chevron-down"></i>
                                      </span>
                                    </button>
                                    <ul
                                      className="dropdown-menu dropdown-menu-end"
                                      aria-labelledby="dropdownMenu2"
                                    >
                                      <li>
                                        <button
                                          className="dropdown-item"
                                          type="button"
                                          onClick={() => {
                                            handleCuisineOpr("AND");
                                          }}
                                        >
                                          {t("cooklist.all")}
                                        </button>
                                      </li>
                                      <li>
                                        <button
                                          className="dropdown-item"
                                          type="button"
                                          onClick={() => {
                                            handleCuisineOpr("OR");
                                          }}
                                        >
                                          {t("cooklist.any")}
                                        </button>
                                      </li>
                                    </ul>
                                  </div>
                                </div>

                                {cuisinePreferences.map((e, index) => (
                                  <div key={index} className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      value={e}
                                      id={"cuisine-" + e}
                                      name="cuisineType"
                                      defaultChecked={
                                        cookFilter
                                          ? cookFilter?.cuisine_type?.includes(e)
                                          : false
                                      }
                                      onClick={handleCuisine}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor={"cuisine-" + e}
                                    >
                                      {e}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <hr />
                          </div>

                          {/* <div className="row">
                <div className="col-md-12 location-form">
                  <label htmlFor="location" className="heading-color mb-2">
                    Speciality
                  </label>
                  <input type="text" className="form-control" placeholder="Pizza" aria-label="location" />
                  <hr />
                </div>
              </div> */}

                          <div className="diet-preferences-section">
                            <div className="row">
                              <div className="col-md-12">
                                <h5 className="heading-color fw-bold">
                                  {t("cooklist.profession")}
                                </h5>

                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    value=""
                                    id="both-p"
                                    name="professionType"
                                    onChange={handleProfession}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="both-p"
                                  >
                                    Both
                                  </label>
                                </div>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    value="chef"
                                    id="Chef-p"
                                    name="professionType"
                                    checked={cookFilter?.profession == 'chef'}
                                    onChange={handleProfession}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="Chef-p"
                                  >
                                    {t("cooklist.chef")}
                                  </label>
                                </div>

                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    value="cook"
                                    id="Cook-p"
                                    name="professionType"
                                    checked={cookFilter?.profession == 'cook'}
                                    onChange={handleProfession}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="Cook-p"
                                  >
                                    {t("cooklist.cook")}
                                  </label>
                                </div>
                                <hr />
                              </div>
                            </div>
                          </div>

                          <div className="diet-preferences-section mb-3">
                            <div className="row">
                              <div className="col-md-12">
                                <div className="cook_listing_filters_heading align-items-center justify-content-between mb-2">
                                  <h5 className="heading-color fw-bold mb-0">
                                    {t("cooklist.language")}
                                  </h5>
                                  <div className="dropdown">
                                    <button
                                      className="btn dropdown-toggle form-control text-color"
                                      type="button"
                                      id="dropdownMenu2"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      <span className="d-flex align-items-center justify-content-between">
                                        {query.language_opr == "AND"
                                          ? "All"
                                          : "Any"}
                                        <i className="bi bi-chevron-down"></i>
                                      </span>
                                    </button>
                                    <ul
                                      className="dropdown-menu dropdown-menu-end"
                                      aria-labelledby="dropdownMenu2"
                                    >
                                      <li>
                                        <button
                                          className="dropdown-item"
                                          type="button"
                                          onClick={() => {
                                            handleLanguagesOpr("AND");
                                          }}
                                        >
                                          {t("cooklist.all")}
                                        </button>
                                      </li>
                                      <li>
                                        <button
                                          className="dropdown-item"
                                          type="button"
                                          onClick={() => {
                                            handleLanguagesOpr("OR");
                                          }}
                                        >
                                          {t("cooklist.any")}
                                        </button>
                                      </li>
                                    </ul>
                                  </div>
                                </div>

                                {languages.map((e, index) => (
                                  <div key={index} className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      value={e}
                                      id={"language-" + index}
                                      name="languagesType"
                                      defaultChecked={
                                        cookFilter
                                          ? cookFilter?.languages?.includes(e)
                                          : false
                                      }
                                      onClick={handleLanguages}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor={"language-" + index}
                                    >
                                      {e}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <hr />
                          </div>

                          <div className="rating-section mb-5">
                            <h5 className="heading-color fw-bold">
                              {t("cooklist.ratings")}
                            </h5>
                            <div className="row">
                              <div className="col-md-12">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    value="4"
                                    id="rating-4"
                                    name="ratingType"
                                    checked={cookFilter?.rating == 4}
                                    onChange={handleRating}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="rating-4"
                                  >
                                    <i className="bi bi-star-fill gold-color me-1"></i>
                                    <i className="bi bi-star-fill gold-color me-1"></i>
                                    <i className="bi bi-star-fill gold-color me-1"></i>
                                    <i className="bi bi-star-fill gold-color me-1"></i>
                                    <i className="bi bi-star-fill gray-color me-3"></i>
                                    <p className="text-color mb-0 d-md-inline-block">
                                      4 & {t("cooklist.up")}
                                    </p>
                                  </label>
                                </div>
                              </div>

                              <div className="col-md-12">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    value={3}
                                    id="rating-3"
                                    checked={cookFilter?.rating == 3}
                                    name="ratingType"
                                    onChange={handleRating}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="rating-3"
                                  >
                                    <i className="bi bi-star-fill gold-color me-1"></i>
                                    <i className="bi bi-star-fill gold-color me-1"></i>
                                    <i className="bi bi-star-fill gold-color me-1"></i>
                                    <i className="bi bi-star-fill gray-color me-1"></i>
                                    <i className="bi bi-star-fill gray-color me-3"></i>
                                    <p className="text-color mb-0 d-md-inline-block">
                                      3 & {t("cooklist.up")}
                                    </p>
                                  </label>
                                </div>
                              </div>

                              <div className="col-md-12">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    value={2}
                                    id="rating-2"
                                    checked={cookFilter?.rating == 2}
                                    name="ratingType"
                                    onChange={handleRating}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="rating-2"
                                  >
                                    <i className="bi bi-star-fill gold-color me-1"></i>
                                    <i className="bi bi-star-fill gold-color me-1"></i>
                                    <i className="bi bi-star-fill gray-color me-1"></i>
                                    <i className="bi bi-star-fill gray-color me-1"></i>
                                    <i className="bi bi-star-fill gray-color me-3"></i>
                                    <p className="text-color mb-0 d-md-inline-block">
                                      2 & {t("cooklist.up")}
                                    </p>
                                  </label>
                                </div>
                              </div>

                              <div className="col-md-12">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    value={1}
                                    id="rating-1"
                                    checked={cookFilter?.rating == 1}
                                    name="ratingType"
                                    onChange={handleRating}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="rating-1"
                                  >
                                    <i className="bi bi-star-fill gold-color me-1"></i>
                                    <i className="bi bi-star-fill gray-color me-1"></i>
                                    <i className="bi bi-star-fill gray-color me-1"></i>
                                    <i className="bi bi-star-fill gray-color me-1"></i>
                                    <i className="bi bi-star-fill gray-color me-3"></i>
                                    <p className="text-color mb-0 d-md-inline-block">
                                      1 & {t("cooklist.up")}
                                    </p>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                      <div className="col-md-9"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-9">
            <div className="listing-heading d-md-flex d-inline-block align-items-center justify-content-between w-100">
              <div className="d-flex align-items-center justify-content-between my-3 my-md-0">
                <h5 className="heading-color my-3">
                  <span className="fw-bold pe-1">
                    {t("cooklist.search_results")}:
                  </span>
                  <span className="fs-6 text-color">
                    {props?.cooks?.length} {t("cooklist.items_found")}
                  </span>
                </h5>
                <div className="d-flex d-md-none d-block">
                  <Link
                    to="/cookreact/cook-list"
                    className="list-icon me-2 d-flex align-items-center justify-content-center"
                  >
                    <i className="bi bi-list-ul"></i>
                  </Link>
                  <Link
                    to="/cookreact/map-view"
                    className="pin-map-icon d-flex align-items-center justify-content-center"
                  >
                    <i className="bi bi-pin-map-fill text-color"></i>
                  </Link>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <label
                  htmlFor="select"
                  defaultValue=""
                  className="form-label w-100 mb-0 heading-color fw-bold"
                >
                  {t("cooklist.sort_by")}:
                </label>
                <select
                  value={cookFilter?.orderDir}
                  className="form-select me-2 text-color sort-by-list"
                  aria-label="Default select example"
                  id="select"
                  onChange={priceChange}
                >
                  <option value="ASC">{t("cooklist.lowtohigh")}</option>
                  <option value="DESC">{t("cooklist.hightolow")}</option>
                </select>

                <div className="d-md-flex d-none">
                  <Link
                    to=""
                    onClick={() => setView("list")}
                    className={`${view === "list" ? "list-icon" : "pin-map-icon"} me-2 d-flex align-items-center justify-content-center`}
                  >
                    <i className="bi bi-list-ul"></i>
                  </Link>
                  <Link
                    to=""
                    onClick={() => setView("map")}
                    className={`${view === "map" ? "list-icon" : "pin-map-icon"} d-flex align-items-center justify-content-center`}
                  >
                    <i className={`${view === "list" && "text-color"} bi bi-pin-map-fill `}></i>
                  </Link>
                </div>
              </div>
            </div>
            {view === "list" ? <Listing /> : <Map query={query} />}
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    cooks: state.cooks.cooks,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    saveCooks: (payload) => dispatch(saveCooks(payload)),
    loader: (payload) => dispatch(loader(payload))
    // saveFilters: (payload) => dispatch(saveFilters(payload)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Filters);
