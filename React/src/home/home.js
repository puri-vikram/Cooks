import React, { useEffect } from "react";
import Banner1 from "./banner1";
import Steps from "./steps";
import FeaturedList from "./featured-list";
import Testimonials from "./testimonials";
import { ToastContainer, toast } from 'react-toastify';
// import { useHistory } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// var History = require('react-router').History;
function Home() {
    const navigate = useNavigate();
    useEffect(() => {
        if (window.location.href.indexOf("/?status=verifyed") > -1) {
            navigate('/cookreact', { replace: true })
            toast.success('Your account is verified successfully');
        }
        window.scrollTo(0, 0)
    }, [])
    return (
        <div><ToastContainer />
            <Banner1 />
            <Steps />
            <FeaturedList />
            <Testimonials />
        </div>
    );
}

export default Home;