import React, { useEffect } from "react";
import slideImg1 from '../public/cart-3.jpg';
import slideImg2 from '../public/our-vision-img.jpg';
import slideImg3 from '../public/cart-1.jpg';
import slideImg4 from '../public/cart-2.jpg';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Aboutus() {
    const { t } = useTranslation();
useEffect(() => { window.scrollTo(0, 0) }, [])
return (
<div>
    <div className="about-us-banner">
        <div className="about-us-heading d-flex align-items-center justify-content-center h-100">
            <h1 className="text-white fw-bold">
                {t('about.title')}
            </h1>
        </div>
    </div>
    <div className="about-us-wrapper">
        <div className="container h-100">
            <div className="my-5 text-center">
                <h2 className=" heading-color fw-bold mb-3">{t('about.title2')}</h2>
                <p className="text-color mb-5">
                {t('about.desc')}
                </p>
            </div>

            <div className="our-vision-section">
                <div className="my-4 text-center">
                    <h2 className=" heading-color fw-bold mb-3">{t('about.title2')}</h2>
                    <p className="heading-color my-2">
                    {t('about.tagline')}
                    </p>
                    <p className="heading-color">
                    {t('about.tagline2')}
                    </p>
                </div>

                <div className="row align-items-center">
                    <div className="col-md-6">
                        <img src={slideImg2} className="img-fluid rounded" />
                    </div>

                    <div className="col-md-6 mt-md-0 mt-4">
                        <p className="our-vision-info text-color">
                        {t('about.desc2')}</p>

                        <p className="our-vision-info text-color">{t('about.desc3')}</p>

                    </div>
                </div>
            </div>


            <div className="foodies-Love-Us-wrapper">
                <h2 className="heading-color fw-bold mt-5 mb-4 text-center">{t('about.title4')}</h2>
                <div className="row mb-5">

                    <div className="col-md-4 text-center">
                        <div className="foodies-love-card-1">
                            <div className="about-us-img-card mb-3">
                                <img src={slideImg3} className="img-fluid" />
                            </div>
                            <div className="foodies-love-card-1-info">
                                <h5 className="heading-color fw-bold">{t('about.title5')}</h5>
                                <p className="text-color">{t('about.desc4')}
                                </p>
                                <span className="text-success">-{t('about.author1')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 text-center my-5 my-md-0">
                        <div className="foodies-love-card-1 ">
                            <div className="about-us-img-card mb-3">
                                <img src={slideImg3} className="img-fluid" />
                            </div>
                            <div className="foodies-love-card-1-info">
                                <h5 className="heading-color fw-bold">{t('about.title6')}</h5>
                                <p className="text-color">{t('about.desc5')}
                                </p>
                                <span className="text-success">-{t('about.author2')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 text-center">
                        <div className="foodies-love-card-1">
                            <div className="about-us-img-card mb-3">
                                <img src={slideImg1} className="img-fluid" />
                            </div>
                            <div className="foodies-love-card-1-info">
                                <h5 className="heading-color fw-bold">{t('about.title7')}</h5>
                                <p className="text-color">{t('about.desc6')}
                                </p>
                                <span className="text-success">-{t('about.author3')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-5">
                        <Link className="btn btn-success fs-6 py-2" type="submit" to="#">{t('about.button')}</Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div className="book-now-wrapper">
        <h2 className="mb-0 text-center fw-bold heading-color">{t('about.title8')}</h2>
    </div>
</div>
);
}

export default Aboutus;