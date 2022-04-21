import React, { useState, useEffect } from "react";
import { connect } from "react-redux"
import { saveUser } from "../redux/User/user.actions"
import AccountDetail from "./account-detail";
import UpdatePassword from "./update-password";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
const { REACT_APP_API_URL } = process.env;

function Profile(props) {
  const [imgData, setImgData] = useState(props.user.pictures == null ? 'user.png' : `${REACT_APP_API_URL}${props.user.pictures}`);

  // For user 
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
            toast.success('Profile picture updated successfully');
          }
        })
    }
  };
  // For user ends here


  // For cook
  async function uploadPicture2(picture) {
    let formData = new FormData();
    formData.append('picture', picture);
    return fetch(`${REACT_APP_API_URL}api/upload/cook/picture`, {
      method: 'POST',
      headers: {
        'x-access-token': localStorage.getItem('token'),
      },
      body: formData
    });
  }
  const onChangePicture2 = async e => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgData(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);

      await uploadPicture2(e.target.files[0]).then(data => data.json())
        .then(res => {
          if (res.status == true) {
            localStorage.setItem('cuser', JSON.stringify(res.data));
            props.saveUser(res.data);
            toast.success('Profile picture updated successfully');
          }
        })
    }
  };
  // For cook ends here
  return (

    <div>
      <div className="container">
        <ToastContainer />
        <div className="row">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-12">
                <div className="user-profile-wrapper">
                  <div className="profile-section">
                    <div className="profile-image">
                      <div className="inner-shadow">
                        <img className="playerProfilePic_home_tile img-fluid" src={imgData} />
                      </div>
                    </div>
                  </div>
                  <div className="change-profile-icon">
                    <input className="d-none" id="selectImage" type="file" onChange={props.user.role === "user" ? onChangePicture : onChangePicture2} />
                    <Link to="#" onClick={() => document.getElementById("selectImage").click()}>
                      <i className="bi bi-camera-fill"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AccountDetail />
      <UpdatePassword />
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
export default connect(mapStateToProps, mapDispatchToProps)(Profile)