import React, { useRef } from "react";
import OwlCarousel from 'react-owl-carousel2';
import slideImg1 from '../public/testimonial-img-1.png';
import slideImg2 from '../public/testimonial-img-2.png';
import { useTranslation } from "react-i18next";
function Testimonials() {
    const { t } = useTranslation();
const testimonialRef = useRef();
const options = {
items: 2,
nav: false,
rewind: true,
autoplay: true,
// dots:true
};
return (
<div className="container">
    <div className="testimonials-wrapper my-md-5 my-0">

        <div class="testimonial_carousel_arrow_left">
            <i onClick={()=> testimonialRef.current.prev()} class="--cursor-pointer bi bi-chevron-left"></i>
        </div>
        <div class="testimonial_carousel_arrow_right">
            <i onClick={()=> testimonialRef.current.next()} class="--cursor-pointer bi bi-chevron-right"></i>
        </div>

        <h3 className="heading-color fw-bold testimonials-heading mt-4">{t("home.testimonials")}</h3>
        <OwlCarousel ref={testimonialRef} options={options}>
            <div className="testimonial-carousel me-1 pb-4 d-lg-flex d-block align-items-center justify-content-center">
                <div className="testimonial-img-section">
                    <img src={slideImg1} className="testimonial-img me-0 me-md-2" />
                </div>
                <div class="testimonial_slider_discription">
                    <i className="fas fa-quote-left text-color"></i>
                    <p className="fs-6 text-color mb-0 pe-md-1 pe-0">The site really helps us to find good properties in
                        the least amount
                        of time without any headache of brokerage. I was so scared in Pune due to the issues of high
                        deposit as well as brokerage.</p>
                    <i className="fas fa-quote-right d-flex justify-content-end text-color"></i>
                    <h5 className="text-success fw-bold">- Mike Joseph</h5>
                </div>
            </div>


            <div className="testimonial-carousel pb-4 d-lg-flex d-block align-items-center justify-content-center">
                <div className="testimonial-img-section">
                    <img src={slideImg2} className="testimonial-img me-0 me-md-2" />
                </div>
                <div class="testimonial_slider_discription">
                    <i className="fas fa-quote-left text-color"></i>
                    <p className="fs-6 text-color mb-0  pe-md-1 pe-0">The site really helps us to find good properties
                        in the least amount
                        of time without any headache of brokerage. I was so scared in Pune due to the issues of high
                        deposit as well as brokerage.</p>
                    <i className="fas fa-quote-right d-flex justify-content-end text-color"></i>
                    <h5 className="text-success fw-bold">- Estelle Leonard</h5>
                </div>
            </div>


            <div className="testimonial-carousel ms-1 pb-4 d-lg-flex d-block align-items-center justify-content-center">
                <div className="testimonial-img-section">
                    <img src={slideImg1} className="testimonial-img me-0 me-md-2" />
                </div>
                <div class="testimonial_slider_discription">
                    <i className="fas fa-quote-left text-color"></i>
                    <p className="fs-6 text-color mb-0  pe-md-1 pe-0">The site really helps us to find good properties
                        in the least amount
                        of time without any headache of brokerage. I was so scared in Pune due to the issues of high
                        deposit as well as brokerage.</p>
                    <i className="fas fa-quote-right d-flex justify-content-end text-color"></i>
                    <h5 className="text-success fw-bold">- Mike Joseph</h5>
                </div>
            </div>
        </OwlCarousel>

        <div class="testimonial_dash_sliders text-center pt-4">
            <i class="bi bi-dash-lg me-1"></i>
            <i class="bi bi-dash-lg"></i>
        </div>
    </div>
</div>




);
}

export default Testimonials;