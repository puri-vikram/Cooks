import React, { useState, useEffect } from "react";
import slideImg1 from "../public/chefs-images-1.png";
import Filters from "./filters";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import StarRatings from "react-star-ratings";
import ReactPaginate from "react-paginate";
import { useTranslation } from 'react-i18next';
function CookListing(props) {
  const { t } = useTranslation();
  const { REACT_APP_API_URL } = process.env;
  const [priceOrder, setPriceOrder] = useState('');

  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(props.cooks.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(props.cooks.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, props.cooks]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % props.cooks.length;
    setItemOffset(newOffset)
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100);
  };

  useEffect(() => { sortItems() }, [priceOrder])

  const sortItems = () => {
    const _sortCooks = props.cooks.slice(itemOffset, itemOffset + itemsPerPage)
    if (priceOrder == "DESC") {
      _sortCooks.sort((a, b) => parseFloat(b.hourly_rate) - parseFloat(a.hourly_rate));
    } else {
      _sortCooks.sort((a, b) => parseFloat(a.hourly_rate) - parseFloat(b.hourly_rate));
    }
    setCurrentItems(_sortCooks)
  }
  const currentData = (
    <>
      {currentItems &&
        currentItems.map((cooks) => (
          <div key={cooks.email} className="list-view mb-3">
            <div className="row">
              <div className="col-md-4 h-auto" style={{ overflow: "hidden", height: "200px" }}>
                <img src={cooks.pictures ? `${REACT_APP_API_URL}${cooks.pictures}` : `${window.location.origin}/cookreact/user.png`}
                  className="img-fluid w-md-auto w-100 chef-details-img" />
              </div>

              <div className="col-md-8">
                <Link to={`/cookreact/cook-details/${cooks._id}`}>
                  <h4 className="heading-color fw-bold mb-0 mt-2 mt-md-0 mb-2">
                    {cooks.firstname + " " + cooks.lastname}
                  </h4>
                </Link>
                <p className="text-color mb-1">
                  {" "}
                  {
                    ((cooks.city !== '' && cooks.city != null)
                      || (cooks.country !== '' && cooks.country != null)
                      || (cooks.distance !== '' && cooks.distance != null))
                    && <i className="bi bi-geo-alt-fill me-1"></i>
                  }

                  {cooks.city !== '' && cooks.city != null && <span>{cooks.city}, </span>}
                  {cooks.country !== '' && cooks.country != null && <span>{cooks.country} </span>}
                  {cooks.distance && cooks.distance != null
                    && cooks.distance != '' && <>
                      ({cooks.distance} {cooks.distance_type} {t("cooklist.away")})
                    </>}
                </p>
                <div className="d-flex align-items-center mt-2">
                  <p className="fs-6 heading-color pe-2 mb-0">
                    {parseFloat(cooks.rating).toFixed(1)}
                  </p>
                  <StarRatings rating={cooks.rating} starRatedColor="rgb(236, 192, 15)" starDimension="18px" starSpacing="1px"
                    numberOfStars={5} name="rating" />
                </div>
                <div className="d-md-flex d-inline-block align-items-center justify-content-between">
                  <p className="text-color mt-1 list-view-info mb-0">
                    {cooks.profession &&
                      <>
                        <span className="heading-color pe-1 fw-bold">{t("cooklist.profession")}:</span>
                        {cooks.profession}
                      </>
                    }
                  </p>
                </div>
                <div className="d-md-flex d-inline-block align-items-center justify-content-between">

                  <p className="text-color mt-1 list-view-info mb-0">
                    {cooks.speciality &&
                      <>
                        <span className="heading-color pe-1 fw-bold">{t("cooklist.speciality")}:</span>
                        {cooks.speciality.join(", ")}
                      </>
                    }
                  </p>


                </div>

                <div className="d-md-flex d-inline-block align-items-center justify-content-between">

                  <p className="text-color mt-1 list-view-info mb-0">
                    {cooks.dietary_preference &&
                      <>
                        <span className="heading-color fw-bold pe-1">{t("cooklist.diet")}:</span>
                        {cooks.dietary_preference.join(", ")}

                      </>
                    }
                  </p>

                </div>
                <div className="d-md-flex d-inline-block align-items-center justify-content-between">

                  <p className="text-color mt-1 list-view-info mb-0">
                    {cooks.cuisine_preference &&
                      <>
                        <span className="heading-color fw-bold pe-1">{t("cooklist.cuisine")}:</span>
                        {cooks.cuisine_preference.join(", ")}
                      </>
                    }
                  </p>

                </div>
                <div className="d-md-flex d-inline-block align-items-center justify-content-between">
                  <p className="text-color mt-1 list-view-info mb-0">
                    {cooks.meal_type &&
                      <>
                        <span className="heading-color fw-bold pe-1">{t("cooklist.meal")}:</span>
                        {cooks.meal_type.join(", ")}
                      </>
                    }
                  </p>
                </div>

                <div className="mt-md-1 mt-1 d-md-flex d-block align-items-center justify-content-between">
                  <p className="light-gray mb-0">
                    <i className="bi bi-translate me-2 fs-7"></i>
                    {cooks.languages && cooks.languages.join(", ")}
                  </p>
                  {/*
          <Link to="#" className="btn btn-success cook-book-button">
          Book now
          </Link> */}
                  <h3 className="text-success fw-bold prize mb-0 mt-md-0 mt-2">
                    {
                      cooks.hourly_rate == 0 || cooks.hourly_rate == ''
                        ?
                        <span className="text-color">{t("cooklist.no_min")}</span>
                        : <>
                          {cooks.hourly_rate}
                          <span className="light-gray">/{t("dashboard.hour")}</span>
                        </>
                    }
                  </h3>
                </div>
              </div>
            </div>
          </div>
        ))
      }
    </>
  );

  return (
    <div>
      <div className="row mt-3">
        <div className="col-md-12 cook-listing-view">
          {props?.cooks && props?.cooks?.length > 0 && (
            <>
              {currentData}
              {
                props?.cooks?.length > itemsPerPage &&
                <ReactPaginate breakLabel="..." previousLabel={" ← Previous "}
                  nextLabel={" Next → "}
                  pageCount={pageCount}
                  onPageChange={handlePageClick}
                  pageClassName=" page-item" pageLinkClassName="page-link" previousClassName="page-item"
                  previousLinkClassName="page-link" nextClassName="page-item" nextLinkClassName="page-link"
                  breakClassName="page-item" breakLinkClassName="page-link" containerClassName="pagination"
                  activeClassName="active" renderOnZeroPageCount={null} />
              }
            </>
          )}
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
export default connect(mapStateToProps)(CookListing);