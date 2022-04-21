import React, { useEffect } from "react";

function Help() {
    useEffect(() => { window.scrollTo(0, 0) }, [])
    return (
        <div>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="help-wrapper">
                                    <h2 className="heading-color fw-bold my-5">Help Center</h2>
                                    <div className="accordion mb-5 border-0" id="accordionExample">

                                        <div className="accordion-item mb-3">
                                            <h2 className="accordion-header" id="headingOne">
                                                <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                                    data-bs-target="#collapseOne" aria-expanded="true"
                                                    aria-controls="collapseOne">
                                                    How to Contact the chef?
                                                </button>
                                            </h2>
                                            <div id="collapseOne" className="accordion-collapse collapse show"
                                                aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                                <div className="accordion-body">
                                                    <strong>This is the first item's accordion body.</strong> It is shown by
                                                    default, until the collapse plugin adds the appropriate classes that we use
                                                    to style each element. These classes control the overall appearance, as well
                                                    as the showing and hiding via CSS transitions. You can modify any of this
                                                    with custom CSS or overriding our default variables. It's also worth noting
                                                    that just about any HTML can go within the <code>.accordion-body</code>,
                                                    though the transition does limit overflow.
                                                </div>
                                            </div>
                                        </div>


                                        <div className="accordion-item mb-3">
                                            <h2 className="accordion-header" id="headingTwo">
                                                <button className="accordion-button collapsed" type="button"
                                                    data-bs-toggle="collapse" data-bs-target="#collapseTwo"
                                                    aria-expanded="false" aria-controls="collapseTwo">
                                                    How can I change the chef?
                                                </button>
                                            </h2>
                                            <div id="collapseTwo" className="accordion-collapse collapse"
                                                aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                                <div className="accordion-body">
                                                    <strong>This is the second item's accordion body.</strong> It is hidden by
                                                    default, until the collapse plugin adds the appropriate classes that we use
                                                    to style each element. These classes control the overall appearance, as well
                                                    as the showing and hiding via CSS transitions. You can modify any of this
                                                    with custom CSS or overriding our default variables. It's also worth noting
                                                    that just about any HTML can go within the <code>.accordion-body</code>,
                                                    though the transition does limit overflow.
                                                </div>
                                            </div>
                                        </div>


                                        <div className="accordion-item mb-3">
                                            <h2 className="accordion-header" id="headingThree">
                                                <button className="accordion-button collapsed" type="button"
                                                    data-bs-toggle="collapse" data-bs-target="#collapseThree"
                                                    aria-expanded="false" aria-controls="collapseThree">
                                                    How to give rating to the chef?
                                                </button>
                                            </h2>
                                            <div id="collapseThree" className="accordion-collapse collapse"
                                                aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                                <div className="accordion-body">
                                                    <strong>This is the third item's accordion body.</strong> It is hidden by
                                                    default, until the collapse plugin adds the appropriate classes that we use
                                                    to style each element. These classes control the overall appearance, as well
                                                    as the showing and hiding via CSS transitions. You can modify any of this
                                                    with custom CSS or overriding our default variables. It's also worth noting
                                                    that just about any HTML can go within the <code>.accordion-body</code>,
                                                    though the transition does limit overflow.
                                                </div>
                                            </div>
                                        </div>


                                        <div className="accordion-item mb-3">
                                            <h2 className="accordion-header" id="headingfour">
                                                <button className="accordion-button collapsed" type="button"
                                                    data-bs-toggle="collapse" data-bs-target="#collapsefour"
                                                    aria-expanded="false" aria-controls="collapsefour">
                                                    When and Where will I get Ingredient list?
                                                </button>
                                            </h2>
                                            <div id="collapsefour" className="accordion-collapse collapse"
                                                aria-labelledby="headingfour" data-bs-parent="#accordionExample">
                                                <div className="accordion-body">
                                                    <strong>This is the third item's accordion body.</strong> It is hidden by
                                                    default, until the collapse plugin adds the appropriate classes that we use
                                                    to style each element. These classes control the overall appearance, as well
                                                    as the showing and hiding via CSS transitions. You can modify any of this
                                                    with custom CSS or overriding our default variables. It's also worth noting
                                                    that just about any HTML can go within the <code>.accordion-body</code>,
                                                    though the transition does limit overflow.
                                                </div>
                                            </div>
                                        </div>

                                        <div className="accordion-item mb-3">
                                            <h2 className="accordion-header" id="headingfive">
                                                <button className="accordion-button collapsed" type="button"
                                                    data-bs-toggle="collapse" data-bs-target="#collapsefive"
                                                    aria-expanded="false" aria-controls="collapsefive">
                                                    What are your Charges?
                                                </button>
                                            </h2>
                                            <div id="collapsefive" className="accordion-collapse collapse"
                                                aria-labelledby="headingfive" data-bs-parent="#accordionExample">
                                                <div className="accordion-body">
                                                    <strong>This is the third item's accordion body.</strong> It is hidden by
                                                    default, until the collapse plugin adds the appropriate classes that we use
                                                    to style each element. These classes control the overall appearance, as well
                                                    as the showing and hiding via CSS transitions. You can modify any of this
                                                    with custom CSS or overriding our default variables. It's also worth noting
                                                    that just about any HTML can go within the <code>.accordion-body</code>,
                                                    though the transition does limit overflow.
                                                </div>
                                            </div>
                                        </div>

                                        <div className="accordion-item mb-3">
                                            <h2 className="accordion-header" id="headingsix">
                                                <button className="accordion-button collapsed" type="button"
                                                    data-bs-toggle="collapse" data-bs-target="#collapsesix"
                                                    aria-expanded="false" aria-controls="collapsesix">
                                                    Are there any Discounts?
                                                </button>
                                            </h2>
                                            <div id="collapsesix" className="accordion-collapse collapse"
                                                aria-labelledby="headingsix" data-bs-parent="#accordionExample">
                                                <div className="accordion-body">
                                                    <strong>This is the third item's accordion body.</strong> It is hidden by
                                                    default, until the collapse plugin adds the appropriate classes that we use
                                                    to style each element. These classes control the overall appearance, as well
                                                    as the showing and hiding via CSS transitions. You can modify any of this
                                                    with custom CSS or overriding our default variables. It's also worth noting
                                                    that just about any HTML can go within the <code>.accordion-body</code>,
                                                    though the transition does limit overflow.
                                                </div>
                                            </div>
                                        </div>

                                        <div className="accordion-item mb-3">
                                            <h2 className="accordion-header" id="headingseven">
                                                <button className="accordion-button collapsed" type="button"
                                                    data-bs-toggle="collapse" data-bs-target="#collapseseven"
                                                    aria-expanded="false" aria-controls="collapseseven">
                                                    What forms of payments do you accept?
                                                </button>
                                            </h2>
                                            <div id="collapseseven" className="accordion-collapse collapse"
                                                aria-labelledby="headingseven" data-bs-parent="#accordionExample">
                                                <div className="accordion-body">
                                                    <strong>This is the third item's accordion body.</strong> It is hidden by
                                                    default, until the collapse plugin adds the appropriate classes that we use
                                                    to style each element. These classes control the overall appearance, as well
                                                    as the showing and hiding via CSS transitions. You can modify any of this
                                                    with custom CSS or overriding our default variables. It's also worth noting
                                                    that just about any HTML can go within the <code>.accordion-body</code>,
                                                    though the transition does limit overflow.
                                                </div>
                                            </div>
                                        </div>

                                        <div className="accordion-item mb-3">
                                            <h2 className="accordion-header" id="headingeight">
                                                <button className="accordion-button collapsed" type="button"
                                                    data-bs-toggle="collapse" data-bs-target="#collapseeight"
                                                    aria-expanded="false" aria-controls="collapseeight">
                                                    How can I update my profile?
                                                </button>
                                            </h2>
                                            <div id="collapseeight" className="accordion-collapse collapse"
                                                aria-labelledby="headingeight" data-bs-parent="#accordionExample">
                                                <div className="accordion-body">
                                                    <strong>This is the third item's accordion body.</strong> It is hidden by
                                                    default, until the collapse plugin adds the appropriate classes that we use
                                                    to style each element. These classes control the overall appearance, as well
                                                    as the showing and hiding via CSS transitions. You can modify any of this
                                                    with custom CSS or overriding our default variables. It's also worth noting
                                                    that just about any HTML can go within the <code>.accordion-body</code>,
                                                    though the transition does limit overflow.
                                                </div>
                                            </div>
                                        </div>

                                        <div className="accordion-item mb-3">
                                            <h2 className="accordion-header" id="headingnine">
                                                <button className="accordion-button collapsed" type="button"
                                                    data-bs-toggle="collapse" data-bs-target="#collapsenine"
                                                    aria-expanded="false" aria-controls="collapsenine">
                                                    How can I reset my password?
                                                </button>
                                            </h2>
                                            <div id="collapsenine" className="accordion-collapse collapse"
                                                aria-labelledby="headingnine" data-bs-parent="#accordionExample">
                                                <div className="accordion-body">
                                                    <strong>This is the third item's accordion body.</strong> It is hidden by
                                                    default, until the collapse plugin adds the appropriate classes that we use
                                                    to style each element. These classes control the overall appearance, as well
                                                    as the showing and hiding via CSS transitions. You can modify any of this
                                                    with custom CSS or overriding our default variables. It's also worth noting
                                                    that just about any HTML can go within the <code>.accordion-body</code>,
                                                    though the transition does limit overflow.
                                                </div>
                                            </div>
                                        </div>


                                        <div className="accordion-item mb-3">
                                            <h2 className="accordion-header" id="headingten">
                                                <button className="accordion-button collapsed" type="button"
                                                    data-bs-toggle="collapse" data-bs-target="#collapseten"
                                                    aria-expanded="false" aria-controls="collapseten">
                                                    Where are my saved recipes?
                                                </button>
                                            </h2>
                                            <div id="collapseten" className="accordion-collapse collapse"
                                                aria-labelledby="headingten" data-bs-parent="#accordionExample">
                                                <div className="accordion-body">
                                                    <strong>This is the third item's accordion body.</strong> It is hidden by
                                                    default, until the collapse plugin adds the appropriate classes that we use
                                                    to style each element. These classes control the overall appearance, as well
                                                    as the showing and hiding via CSS transitions. You can modify any of this
                                                    with custom CSS or overriding our default variables. It's also worth noting
                                                    that just about any HTML can go within the <code>.accordion-body</code>,
                                                    though the transition does limit overflow.
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Help;