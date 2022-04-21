import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { saveUser } from "../redux/User/user.actions";
import { connect } from "react-redux";
import { Country, State, City } from "country-state-city";


function AccountEdit(props) {
  const { REACT_APP_API_URL } = process.env;
  
  const id = localStorage.getItem("token");
  
  const profile=JSON.parse(localStorage.getItem("cuser"));
  const [selectedCountry, setSelectedCountry] = useState(profile.country);
  const [selectedState, setSelectedState] = useState(profile.state);

  const [successMessage, setSuccessMessage] = useState(false);
  if (successMessage) {
    setTimeout(() => {
      setSuccessMessage(false);
    }, 2000);
  }
  
  //Sending the updated inputs to api
  async function updateProfile(details) {
    return fetch(`${REACT_APP_API_URL}api/update/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": `${id}`,
      },
      body: JSON.stringify(details)
    });
  }
  

  async function uploadPicture(picture) {
    let formData = new FormData();
    formData.append('picture', picture);
    return fetch(`${REACT_APP_API_URL}api/upload/user/picture`, {
      method: 'POST',
      headers: {
        'x-access-token': localStorage.getItem('token'),
      },
      body: formData
    });
  }

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



  const [imgData, setImgData] = useState(props.user.pictures == null ? 'user.png': `${REACT_APP_API_URL}${props.user.pictures}`);
  const onChangePicture = async e => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgData(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);

      await uploadPicture(e.target.files[0]).then(data => data.json())
        .then(res => {
          if (res.status == true) {
            localStorage.setItem('cuser', JSON.stringify(res.data));
            props.saveUser(res.data);
          }
        })
    }
  };


//Profile update on submit
  const editProfile = async (e) => {
    setValue("country", selectedCountry, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("state", selectedState, {
      shouldValidate: true,
      shouldDirty: true,
    });
    const token = await updateProfile(getValues())
      .then((data) => data.json())
      .then((res) => {
        if (res.status === false) {
          setError("serverError", { type: "focus", message: res.message });
        } else {
          localStorage.setItem("cuser", JSON.stringify(res.data));
          props.saveUser(res.data);
          setSuccessMessage(true);
        }
      });
  };
  React.useEffect(() => {
    watch((value, { name, type }) => clearErrors("serverError"));
  }, [watch]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-12">
              <h2 className="heading-color fw-bold mt-md-5 mt-3">
                Edit your profile
              </h2>
              <form onSubmit={handleSubmit(editProfile)}>
              <div className="row">
                <div className="col-md-12">
                  <div className="user-profile-wrapper">
                    <div className="profile-section">
                      <div className="profile-image mt-3">
                        <div className="inner-shadow">
                        <img className="playerProfilePic_home_tile img-fluid" src={imgData} />
                      </div>
                      </div>
                    </div>
                    <div className="change-profile-icon">
                    <input className="d-none" id="selectImage" type="file" onChange={onChangePicture} />
                    <Link to="#" onClick={() => document.getElementById("selectImage").click()}>
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
                          defaultValue={profile.firstname||""}
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
                          defaultValue={profile.lastname||""}
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
                          className="form-select"
                          aria-label="Default select example"
                          value={selectedCountry}
                          onChange={(e) => setSelectedCountry(e.target.value)}
                        >
                          <option disabled>Select country</option>
                          {Country.getAllCountries().map((e, key) => (
                            <option key={key} id={e.isoCode} value={e.isoCode}>
                              {e.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    {errors.country && errors.country.type === "required" && (
                      <p className="errorMsg mb-0 mt-2 text-danger">
                        Country is required.
                      </p>
                    )}
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
                          className="form-select"
                          aria-label="Default select example"
                          value={selectedState}
                          onChange={(e) => setSelectedState(e.target.value)}
                        >
                          <option>Select state</option>
                          {State.getAllStates()
                            .filter((e) => e.countryCode === selectedCountry)
                            .map((e, key) => (
                              <option key={key} value={e.isoCode}>
                                {e.name}
                              </option>
                            ))}
                        </select>
                      </div>
                      {errors.state && errors.state.type === "required" && (
                      <p className="errorMsg mb-0 mt-2 text-danger">
                        State is required.
                      </p>
                    )}
                    </div>

                    <div className="col-md-4">
                      <div className="my-2 my-md-3">
                      <label
                          htmlFor="City"
                          className="form-label heading-color fw-bold"
                        >
                          City
                        </label>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          defaultValue={profile.city || "Select city"}
                          {...register("city", { required: true })}
                        >
                          <option>Select city</option>
                          {City.getAllCities()
                            .filter((e) => e.stateCode === selectedState)
                            .map((e, key) => (
                              <option key={key} value={e.name}>
                                {e.name}
                              </option>
                            ))}
                        </select>
                      </div>
                      {errors.city && errors.city.type === "required" && (
                      <p className="errorMsg mb-0 mt-2 text-danger">
                        City is required.
                      </p>
                    )}
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
                          defaultValue={profile.zipcode||""}
                          placeholder="Enter zipcode"
                          {...register("zipcode", { required: true })}
                        />
                      </div>
                      {errors.zipcode && errors.zipcode.type === "required" && (
                        <p className="errorMsg mb-0 mt-2 text-danger">
                          Zipcode is required.
                        </p>
                      )}
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
                          defaultValue={profile.address||""}
                          placeholder="Enter address"
                          {...register("address", { required: true })}
                        />
                      </div>
                      {errors.address && errors.address.type === "required" && (
                        <p className="errorMsg mb-0 mt-2 text-danger">
                          Address is required.
                        </p>
                      )}
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
                          defaultValue={profile.about_me||""}
                          placeholder="Type something about you, experience, hobbies etc..."
                          {...register("about_me")}
                        ></textarea>
                      </div>
                    </div>
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
              </div>
              </form>
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
    saveUser: (payload) => dispatch(saveUser(payload))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(AccountEdit);
