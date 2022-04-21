import React from "react";
import slideImg1 from '../public/signup-success.png';

function SignupSuccess() {
return (

<div>
    <div className="container">
        <div className="row justify-content-center">
            <div className="col-md-6">
                <div className="row justify-content-center">
                    <div className="col-md-10">
                        <div className="signup-success-message text-center">
                            <img src={slideImg1} />
                            <h4 className="fw-bold heading-color mt-3">Your account created successfully</h4>
                            <h5 className="text-color mt-3">Please verify you mail to login.</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
);
}

export default SignupSuccess;