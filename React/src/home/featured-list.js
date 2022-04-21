import React, { useEffect, useState, useRef } from "react";
import OwlCarousel from 'react-owl-carousel2';
import StarRatings from 'react-star-ratings';
import slideImg2 from '../public/chefs-images-1.png';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
const { REACT_APP_API_URL } = process.env;

function FeaturedList() {
    const { t } = useTranslation();
    const [list, setList] = useState([])
    const featuredRef = useRef();
    const topRef = useRef();
    useEffect(() => {
        fetch(`${REACT_APP_API_URL}api/get/featuredchefsandcooks`).then(data => data.json())
            .then(res => {
                setList(res)
            })
    }, [])
    const options = {
        //items: 4,
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
    return (
        <div className="container my-md-5 my-0">
            <div className="featured-cook-wrapper">

                <div class="featured_cook_arrow_left">
                    <i onClick={() => featuredRef.current.prev()} class="--cursor-pointer bi bi-chevron-left"></i>
                </div>
                <div class="featured_cook_arrow_right">
                    <i onClick={() => featuredRef.current.next()} class="--cursor-pointer bi bi-chevron-right"></i>
                </div>

                <h3 className="Featured-cooks-heading fw-bold heading-color"><span
                    className="text-success">{t('home.featured')}{' '}
                </span>{t('home.chefs_and_cooks')}</h3>
                {list.featured && list.featured.length > 0 &&

                    <OwlCarousel ref={featuredRef} options={options} events={events}>
                        {list.featured.map(_l =>
                            <div key={_l._id}>
                                <Link to={`/cookreact/cook-details/${_l._id}`}>
                                    <div className="pb-4 me-0 me-md-2">
                                        <div className="featured-box-1">
                                            <img src={slideImg2} className="d-flex justify-content-center w-100" />
                                            <h5 className="heading-color fw-bold mt-3">{_l.firstname + ' ' + _l.lastname}</h5>
                                            <p className="text-color mb-1"> <i className="bi bi-geo-alt-fill me-1"></i>0.5 km away</p>

                                            <div className="d-md-flex d-block align-items-center justify-content-between mb-1">
                                                <div className="d-flex align-items-center mb-2 mb-md-0">
                                                    <p className="fw-bold fs-6 heading-color pe-2 mb-0">{parseFloat(_l.rating).toFixed(1)}
                                                    </p>
                                                    <StarRatings rating={_l.rating} starRatedColor='rgb(236, 192, 16)' starDimension="22px"
                                                        starSpacing="2px" numberOfStars={5} name='rating' />
                                                </div>
                                                <div>
                                                    <h5 className="text-success fw-bold mb-0">${_l.hourly_rate}<span
                                                        className="light-gray fw-normal fs-6">/hr</span>
                                                    </h5>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="light-gray"><i className="bi bi-translate me-2 fs-7"></i>English, Spanish</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}
                    </OwlCarousel>

                }
            </div>
            <div className="featured-cook-wrapper">

                <div class="featured_cook_arrow_left">
                    <i onClick={() => topRef.current.prev()} class="--cursor-pointer bi bi-chevron-left"></i>
                </div>
                <div class="featured_cook_arrow_right">
                    <i onClick={() => topRef.current.next()} class="--cursor-pointer bi bi-chevron-right"></i>
                </div>

                <h3 className="Featured-cooks-heading fw-bold heading-color"><span className="text-success">{t('home.top')}
                    {' '}</span>{t('home.chefs_and_cooks')}</h3>
                {list.top && list.top.length > 0 &&

                    <OwlCarousel ref={topRef} options={options} events={events}>
                        {list.top.map(_l =>
                            <div key={_l._id}>
                                <Link to={`/cookreact/cook-details/${_l._id}`}>
                                    <div className="pb-4 me-0 me-md-2 ">
                                        <div className="featured-box-1">
                                            <img src={slideImg2} className="d-flex justify-content-center w-100" />
                                            <h5 className="heading-color fw-bold mt-3">{_l.firstname + ' ' + _l.lastname}</h5>
                                            <p className="text-color mb-1"> <i className="bi bi-geo-alt-fill me-1"></i>0.5 km away</p>

                                            <div className="d-md-flex d-block align-items-center justify-content-between mb-1">
                                                <div className="d-flex align-items-center mb-2 mb-md-0">
                                                    <p className="fw-bold fs-6 heading-color pe-2 mb-0">{parseFloat(_l.rating).toFixed(1)}
                                                    </p>
                                                    <StarRatings rating={_l.rating} starRatedColor='rgb(236, 192, 16)' starDimension="22px"
                                                        starSpacing="2px" numberOfStars={5} name='rating' />
                                                </div>
                                                <div>
                                                    <h5 className="text-success fw-bold mb-0">${_l.hourly_rate}<span
                                                        className="light-gray fw-normal fs-6">/hr</span>
                                                    </h5>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="light-gray"><i className="bi bi-translate me-2 fs-7"></i>English, Spanish</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}
                    </OwlCarousel>

                }
            </div>
        </div>

    );
}

export default FeaturedList;