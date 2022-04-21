import React, { useState, useEffect } from "react";
import homeBanner from "./../public/home-banner.png";
import { useForm } from "react-hook-form";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { geocodeByAddress, getLatLng, geocodeByLatLng } from 'react-google-places-autocomplete';
import { Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
function Banner1() {
  const { t } = useTranslation();
  const { REACT_APP_API_URL } = process.env;
  const [place, setPlace] = useState(null);
  const [errorMsg, setErrorMsg] = useState(false);
  const [defaultValue, setDefaultValue] = useState(t('form.select'));

  //   Place Search through keyword
  //   const placeSearch = async (e) => {
  // const keyword = e.target.value;
  // var axios = require("axios");

  // var config = {
  //   method: "get",
  //   url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${keyword}&types=(cities)&key=AIzaSyARGpUdzBWKnyufzqzh6sS2jlB91Grx9Ys`,
  //   headers: {},
  // };

  // axios(config)
  //   .then(function (response) {
  //     console.log(JSON.stringify(response.data));
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   });
  //   };

  // Useform functions
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

  const searchCook = async (input) => {
    // return fetch(`${REACT_APP_API_URL}api/cook/search`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(input),
    // });
  };

  const navigate = useNavigate();

  const findSubmit = async (e) => {
    // const pref = getValues("preference");
    // if (pref === "Diet Preferences" || place === null) {
    //   setErrorMsg(true);
    // } else {
    //   const token = await searchCook()
    //     .then((data) => data.json())
    //     .then((res) => {
    //       if (res.status === false) {
    //         setError("serverError", { type: "focus", message: res.message });
    //       } else {
    //         console.log(res);
    //         navigate("/cookreact/cook-list");
    //       }
    //     });
    // }
    if (place === null) {
      setErrorMsg(true);
    }
    else {
      geocodeByAddress(place.label)
        .then(results => getLatLng(results[0]))
        .then(({ lat, lng }) => {
          setValue("lat", lat);
          setValue("lng", lng);
          setValue("location",place.label);
          localStorage.setItem("cookfilter", JSON.stringify(getValues()));
          navigate("/cookreact/cook-list");
        }
        );
    }
  };

  // useEffect(() => {
  //   if ("geolocation" in navigator) {
  //     navigator.geolocation.getCurrentPosition(function (position) {
  //       geocodeByLatLng({ lat: parseFloat(position.coords.latitude), lng: parseFloat(position.coords.longitude) })
  //         .then(results => {
  //           const address = results[0].formatted_address
  //           let city, state, country = null;
  //           for (let i = 0; i < results[0].address_components.length; i++) {
  //             for (let j = 0; j < results[0].address_components[i].types.length; j++) {
  //               switch (results[0].address_components[i].types[j]) {
  //                 case "locality":
  //                   city = results[0].address_components[i].long_name;
  //                   break;
  //                 case "administrative_area_level_1":
  //                   state = results[0].address_components[i].long_name;
  //                   break;
  //                 case "country":
  //                   country = results[0].address_components[i].long_name;
  //                   break;
  //               }
  //             }
  //           }
  //           if (city != null) setDefaultValue(city)
  //           console.log(city, state, country);
  //         }
  //         );
  //     });
  //   }
  // }, [])

  return (
    <div className="header-background-color">
      <div className="container h-100">
        <div className="banner-wrapper">
          <div className="row align-items-center h-100">
            <div className="col-md-6 ">
              <div className="find-cooks-wrapper">
                <h1 className="fw-bold heading-color">
                  {t('home.find')} <span className="cooks text-success">{t('home.cooks')}</span> {t('home.and')}{" "}
                  <span className="cooks text-success">{t('home.chefs')}</span> {t('home.near')} {t('home.you')}.
                </h1>
                <div className="all-occassions">
                  <p className="text-color">-{t('home.for_all_occassions')}</p>
                </div>
                <form name="findCook" onSubmit={handleSubmit(findSubmit)}>
                  <div className="row mt-md-4 mt-3">
                    <div className="col-xl-6">
                      <div className="form-group">
                        <div className="mb-3">
                          <div className="input-group">
                            <span
                              className="input-group-text"
                              id="basic-addon1"
                            >
                              <i className="bi bi-geo-alt-fill text-color fs-7"></i>
                            </span>
                            <div className="form-control div-child-css">
                              <GooglePlacesAutocomplete
                                selectProps={{
                                  placeholder: t('form.select'),
                                  noOptionsMessage:() => 'Please start typing',
                                  // getOptionLabel: (option) => "dsfdsfdfdsf",
                                  // defaultInputValue: t('form.select'),
                                  place,
                                  onChange: setPlace,
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

                            {/* <input
                              type="search"
                              id="form1"
                              className="form-control"
                              name="loc"
                              onChange={placeSearch}
                              placeholder="Search Location"
                              {...register("location", { required: true })}
                            /> */}
                          </div>
                          {errorMsg ? (
                            <p className="errorMsg text-danger">Enter a valid location</p>
                          ) : (
                            ""
                          )}
                          {/* {errors.location &&
                            errors.location.type === "required" && (
                              <p className="errorMsg mb-0 mt-2 text-danger">
                                Location is required.
                              </p>
                            )} */}
                        </div>
                      </div>
                    </div>

                    <div className="col-xl-6">
                      <div className="form-group">
                        <div className="mb-3">
                          <div className="input-group">
                            <span
                              className="input-group-text"
                              id="basic-addon1"
                            >
                              <i className="fas fa-utensils text-color fs-7"></i>
                            </span>
                            <select
                              className="form-select form-control"
                              aria-label="Default select example"
                              name="pref"
                              placeholder={t('form.diet_prefrences')}
                              {...register("preference")}
                            >
                              <option value="" className="fas fa-utensils">
                                {t('form.diet_prefrences')}
                              </option>
                              <option value="Vegetarian">Vegetarian</option>
                              <option value="Pescatarian">Pescatarian</option>
                              <option value="Vegan">Vegan</option>
                              <option value="Paleo">Paleo</option>
                              <option value="Keto">Keto</option>
                              <option value="Gluten free">Gluten free</option>
                            </select>
                          </div>
                          {errors.preference &&
                            errors.preference.type === "required" && (
                              <p className="errorMsg mb-0 mt-2 text-danger">
                                Choose any preference
                              </p>
                            )}
                        </div>
                      </div>
                    </div>

                    <div className="col-6 col-lg">
                      <div className="form-group">
                        <div className="mb-3">
                          <div className="input-group">
                            <span
                              className="input-group-text"
                              id="basic-addon1"
                            >
                              <i className="bi bi-currency-dollar text-color dollar-icon fs-7"></i>
                            </span>
                            <input
                              type="number"
                              id="hours"
                              name="from"
                              min="0"
                              className="form-control"
                              placeholder={t('form.min/hr')}
                              {...register("priceFrom", {
                                pattern: /^[0-9]+[0-9]*$/,
                              })}
                            />
                          </div>
                          {errors.priceFrom &&
                            errors.priceFrom.type === "required" && (
                              <p className="errorMsg mb-0 mt-2 text-danger">
                                Enter min. price
                              </p>
                            )}
                          {errors.priceFrom &&
                            errors.priceFrom.type === "pattern" && (
                              <p className="errorMsg mb-0 mt-2 text-danger">
                                Enter a valid price
                              </p>
                            )}
                        </div>
                      </div>
                    </div>

                    <div className="col-6 col-lg">
                      <div className="form-group">
                        <div className="mb-3">
                          <div className="input-group">
                            <span
                              className="input-group-text"
                              id="basic-addon1"
                            >
                              <i className="bi bi-currency-dollar text-color dollar-icon fs-7"></i>
                            </span>
                            <input
                              type="number"
                              id="hours"
                              name="to"
                              min="15"
                              className="form-control"
                              placeholder={t('form.max/hr')}
                              {...register("priceTo", {
                                pattern: /^[1-9]+[0-9]*$/,
                              })}
                            />
                          </div>
                          {errors.priceTo &&
                            errors.priceTo.type === "required" && (
                              <p className="errorMsg mb-0 mt-2 text-danger">
                                Enter max. price
                              </p>
                            )}
                          {errors.priceTo &&
                            errors.priceTo.type === "pattern" && (
                              <p className="errorMsg mb-0 mt-2 text-danger">
                                Enter a valid price
                              </p>
                            )}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <button
                        type="submit"
                        className="btn btn-success find-button"
                      >
                        {t('form.find')}
                        <i className="bi bi-arrow-right ms-2"></i>
                      </button>

                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="col-md-6">
              <img src={homeBanner} className="img-fluid home-page-banner" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner1;
