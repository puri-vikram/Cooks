import React from "react";
import { useTranslation } from 'react-i18next';
function Steps() {
    const { t } = useTranslation();
    return (
        <div className="container">
            <div className="steps-wrapper">
                <h2 className="fw-bold heading-color mb-5 mt-md-0 mt-5">{t('home.steps_to_book')}</h2>
                <div className="row justify-content-between">
                    <div className="col-md-3 mb-4 mb-md-0">
                        <div className="search-icon-box">
                            <i className="bi bi-search d-flex align-items-center justify-content-center h-100 text-success"></i>
                        </div>

                        <h5 className="fw-bold heading-color mt-4">{t('home.search_cook_or_chef')}</h5>
                        <p className="text-color fs-6">{t('home.home_step_one')}</p>
                    </div>

                    <div className="col-md-3 mb-md-0 mb-4">
                        <div className="search-icon-box">
                            <i
                                className="bi bi-chat-dots-fill d-flex align-items-center justify-content-center h-100 text-success"></i>
                        </div>

                        <h5 className="fw-bold heading-color mt-4">{t('home.message_and_book')}</h5>
                        <p className="text-color fs-6">{t('home.home_step_two')}</p>
                    </div>

                    <div className="col-md-3 mb-md-0 mb-4">
                        <div className="search-icon-box">
                            <i
                                className="bi bi-emoji-smile-fill d-flex align-items-center justify-content-center h-100 text-success"></i>
                        </div>

                        <h5 className="fw-bold heading-color mt-4">{t('home.have_a_good_time')}</h5>
                        <p className="text-color fs-6">{t('home.home_step_three')}</p>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Steps;