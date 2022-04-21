import React, { useState, useEffect } from "react"
import "./App.css"
import "./Responsive.css"
import { connect } from "react-redux"
import { BrowserRouter as Router, Routes, Route, useRoutes, Navigate, useNavigate, Outlet } from "react-router-dom";
import Header from "./header/header";
import Footer from "./footer/footer";
import Home from "./home/home";
import CookListing from "./cook-listing/filters";
import CookDetails from "./cook-details/cook-details";
import CookMyProfile from "./cook-my-profile/cook-my-profile";
import MapView from "./map-view/map-view";
import Login from "./login/login";
import Signup from "./signup/signup";
import SignupSuccess from "./signup/success";
import Profile from "./profile/profile";
import Aboutus from "./aboutus/aboutus";
import Contactus from "./contactus/contactus";
import Help from "./help/help";
import Privacypolicy from "./privacypolicy/privacypolicy";
import Termsandconditions from "./termsandconditions/termsandconditions";
import Conversations from "./conversations/conversations";
import CompleteProfile from "./complete-profile/complete-profile";
import AccountEdit from "./account-edit/account-edit";
import CookDashboard from "./cook-dashboard/cook-dashboard";
import AddNewRecipe from "./add-new-recipe/add-new-recipe";
import UpdateRecipe from "./add-new-recipe/update-recipe";
import RecipeDetail from "./recipe-detail/recipe-detail";
import ForgotPassword from "./forgot-password/forgot-password";
import ResetPassword from "./forgot-password/reset-password";
import Preferences from "./complete-profile/preferences";
import { destroyUser, saveUser } from "./redux/User/user.actions";
import TopFeaturedCooks from "./top-featured-cooks/top-featured-cooks";
import jwt_decode from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import './i18n';
import MyComponent from 'react-fullpage-custom-loader';
const { REACT_APP_API_URL } = process.env;
// const UserAfterLoggedIn = () => {
//   let routes = useRoutes([
//     { path: "/cookreact", element: requireLogin(<Home />) },
//     { path: "/cookreact/cook-list", element: <CookListing /> },
//     { path: "/cookreact/cook-details/:cook_id", element: <CookDetails /> },
//     { path: "/cookreact/map-view", element: <MapView /> },
//     { path: "/cookreact/signup-success", element: <SignupSuccess /> },
//     { path: "/cookreact/profile", element: <Profile /> },
//     { path: "/cookreact/conversations", element: <Conversations /> },
//     { path: "/cookreact/about-us", element: <Aboutus /> },
//     { path: "/cookreact/account-edit", element: <AccountEdit /> },
//     { path: "/cookreact/recipe/:id", element: <RecipeDetail /> },
//     { path: "/cookreact/contact-us", element: <Contactus /> },
//     { path: "/cookreact/help", element: <Help /> },
//     { path: "/cookreact/privacy-policy", element: <Privacypolicy /> },
//     { path: "/cookreact/terms-and-conditions", element: <Termsandconditions /> },
//     { path: "*", element: <Home /> }
//   ]);
//   return routes;
// };

const ProtectedRoute = ({ props, redirectPath = '/cookreact/login' }) => {
  const token = localStorage.getItem("token");
  if (jwt_decode(token).exp < Date.now() / 1000) {
    localStorage.clear();
    props.destroyUser();
    return <Navigate to={redirectPath} replace />;
  }
  else {
    return <Outlet />;
  }
};

const UserAfterLoggedIn = (props) =>
  <Routes>
    <Route path="/cookreact/login" element={<Login />} />
    <Route path="/cookreact/signup" element={<Signup />} />
    <Route path="/cookreact" element={<Home />} />
    <Route element={<ProtectedRoute props={props} />}>
      <Route path="/cookreact" element={<Home />} />
      <Route path="/cookreact/cook-list" element={<CookListing />} />
      <Route path="/cookreact/top-featured-list" element={<TopFeaturedCooks />} />
      <Route path="/cookreact/cook-details/:cook_id" element={<CookDetails />} />
      <Route path="/cookreact/map-view" element={<MapView />} />
      <Route path="/cookreact/signup-success" element={<SignupSuccess />} />
      <Route path="/cookreact/profile" element={<Profile />} />
      <Route path="/cookreact/conversations" element={<Conversations />} />
      <Route path="/cookreact/about-us" element={<Aboutus />} />
      <Route path="/cookreact/account-edit" element={<AccountEdit />} />
      <Route path="/cookreact/recipe/:id" element={<RecipeDetail />} />
      <Route path="/cookreact/contact-us" element={<Contactus />} />
      <Route path="/cookreact/help" element={<Help />} />
      <Route path="/cookreact/privacy-policy" element={<Privacypolicy />} />
      <Route path="/cookreact/terms-and-conditions" element={<Termsandconditions />} />
      <Route path="/cookreact/recipe-detail" element={<RecipeDetail />} />
    </Route>
    <Route path="/*" element={<Home />} />
  </Routes>

const CookAfterLoggedIn = (props) =>
  <Routes>
    <Route path="/cookreact/login" element={<Login />} />
    <Route path="/cookreact/signup" element={<Signup />} />
    <Route element={<ProtectedRoute props={props} />}>
      <Route path="/cookreact" element={<Home />} />
      <Route path="/cookreact/cook-list" element={<CookListing />} />
      <Route path="/cookreact/top-featured-list" element={<TopFeaturedCooks />} />
      <Route path="/cookreact/cook-details/:cook_id" element={<CookDetails />} />
      <Route path="/cookreact/cook-my-profile" element={<CookMyProfile />} />
      <Route path="/cookreact/map-view" element={<MapView />} />
      <Route path="/cookreact/signup-success" element={<SignupSuccess />} />
      <Route path="/cookreact/profile" element={<Profile />} />
      <Route path="/cookreact/conversations" element={<Conversations />} />
      <Route path="/cookreact/complete-profile" element={<CompleteProfile />} />
      <Route path="/cookreact/preferences" element={<Preferences />} />
      <Route path="/cookreact/about-us" element={<Aboutus />} />
      <Route path="/cookreact/account-edit" element={<AccountEdit />} />
      <Route path="/cookreact/cook-dashboard" element={<CookDashboard />} />
      <Route path="/cookreact/recipe-detail" element={<RecipeDetail />} />
      <Route path="/cookreact/add-new-recipe" element={<AddNewRecipe />} />
      <Route path="/cookreact/update-recipe/:recipe_id" element={<UpdateRecipe />} />
      <Route path="/cookreact/recipe/:id" element={<RecipeDetail />} />
      <Route path="/cookreact/contact-us" element={<Contactus />} />
      <Route path="/cookreact/help" element={<Help />} />
      <Route path="/cookreact/privacy-policy" element={<Privacypolicy />} />
      <Route path="/cookreact/terms-and-conditions" element={<Termsandconditions />} />
    </Route>
    <Route path="/*" element={<Home />} />
  </Routes>

// let routes = useRoutes([
//   { path: "/cookreact", element: <Home /> },
//   { path: "/cookreact/cook-list", element: <CookListing /> },
//   { path: "/cookreact/cook-my-profile", element: <CookMyProfile /> },
//   { path: "/cookreact/map-view", element: <MapView /> },
//   { path: "/cookreact/signup-success", element: <SignupSuccess /> },
//   { path: "/cookreact/profile", element: <Profile /> },
//   { path: "/cookreact/conversations", element: <Conversations /> },
//   { path: "/cookreact/complete-profile", element: <CompleteProfile /> },
//   { path: "/cookreact/preferences", element: <Preferences /> },
//   { path: "/cookreact/about-us", element: <Aboutus /> },
//   { path: "/cookreact/account-edit", element: <AccountEdit /> },
//   { path: "/cookreact/cook-dashboard", element: <CookDashboard /> },
//   { path: "/cookreact/recipe-detail", element: <RecipeDetail /> },
//   { path: "/cookreact/add-new-recipe", element: <AddNewRecipe /> },
//   { path: "/cookreact/update-recipe/:recipe_id", element: <UpdateRecipe /> },
//   { path: "/cookreact/recipe/:id", element: <RecipeDetail /> },
//   { path: "/cookreact/contact-us", element: <Contactus /> },
//   { path: "/cookreact/help", element: <Help /> },
//   { path: "/cookreact/privacy-policy", element: <Privacypolicy /> },
//   { path: "/cookreact/terms-and-conditions", element: <Termsandconditions /> },
//   { path: "*", element: <Home /> }
// ]);
// return routes;


const BeforeLoggedIn = () => {
  let routes = useRoutes([
    { path: "/cookreact/", element: <Home /> },
    { path: "/cookreact/cook-list", element: <CookListing /> },
    { path: "/cookreact/top-featured-list", element: <TopFeaturedCooks /> },
    { path: "/cookreact/map-view", element: <MapView /> },
    { path: "/cookreact/login", element: <Login /> },
    { path: "/cookreact/about-us", element: <Aboutus /> },
    { path: "/cookreact/signup", element: <Signup /> },
    { path: "/cookreact/signup-success", element: <SignupSuccess /> },
    { path: "/cookreact/forgot", element: <ForgotPassword /> },
    { path: "/cookreact/reset-password", element: <ResetPassword /> },
    { path: "/cookreact/contact-us", element: <Contactus /> },
    { path: "/cookreact/help", element: <Help /> },
    { path: "/cookreact/privacy-policy", element: <Privacypolicy /> },
    { path: "/cookreact/terms-and-conditions", element: <Termsandconditions /> },
    { path: "*", element: <Login /> },

  ]);
  return routes;
};


// const useEventSource = (url) => {
//   const [data, updateData] = useState(null);

//   useEffect(() => {
//     const source = new EventSource(url);
//     source.onmessage = function logEvents(event) {
//       updateData(JSON.parse(event.data));
//     }
//   }, [])

//   return data;
// }



const AppWrapper = (props) => {
  let navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null)
  useEffect(() => { setCurrentUser(props.user) }, [props.user])

  useEffect(() => {
    const { user } = props
    const url = `https://server.visionvivante.com:5050/events/${user !== null ? user._id : null}`
    const source = new EventSource(url);
    source.onmessage = function logEvents(event) {
      const data = JSON.parse(event.data)
      if (user !== null) {
        if (data !== null && data.event && data.event == "DELETE" && data.user_id == user._id) {
          source.close()
          navigate("/cookreact/login?status=user-deleted", { replace: true });
        }
        else if (data !== null && data.event && data.event == "PASSWORDUPDATED" && data.user_id == user._id) {
          source.close()
          navigate("/cookreact/login?status=password-changed", { replace: true });
        }
        else if (data !== null && data.event && data.event == "UPDATED" && data.user_id == user._id) {
          fetch(`${REACT_APP_API_URL}api/refresh/token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": localStorage.getItem("token"),
            }
          }).then((data) => data.json())
            .then((res) => {
              if (res.status == true) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("cuser", JSON.stringify(res.data));
                props.saveUser(res.data);
                source.close()
              }
            });
        }
      }
    }
  }, [props.user])
  return (
    <>
      {props.loader && <MyComponent sentences={['']} />}
      <Header />
      {currentUser === null
        ?
        <BeforeLoggedIn />
        :
        (currentUser.role === "user"
          ?
          <UserAfterLoggedIn {...props} />
          :
          <CookAfterLoggedIn {...props} />)}
      <Footer />
    </>
  );
};


const mapStateToProps = state => {
  return {
    user: state.user.user,
    loader: state.loader.status
  }
}

const mapDispatchToProps = dispatch => {
  return {
    saveUser: (payload) => dispatch(saveUser(payload)),
    destroyUser: () => dispatch(destroyUser()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppWrapper)