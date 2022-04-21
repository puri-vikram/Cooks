import React, { useState, useEffect } from "react";
import slideImg1 from '../public/chat-img2.png';
import { Link } from 'react-router-dom';
import { connect } from "react-redux"
import Moment from 'moment';
import { setCurrentChat } from "../redux/CurrentChat/current-chat.actions"
import { setCurrentChatUser } from "../redux/CurrentChatUser/current-chat-user.actions"
import { setChatUsers } from "../redux/Chatusers/chatusers.actions"
import { useTranslation } from "react-i18next";
const { REACT_APP_ASSET_URL, REACT_APP_API_URL } = process.env

function LeftPanel(props) {
  const { t } = useTranslation();
  const [usersList, setUsersList] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [currentUserId, setCurrentUserId] = useState(null)

  useEffect(() => {
    fetch(`${REACT_APP_API_URL}api/unread/message/count`, {
      method: 'GET',
      headers: {
        'x-access-token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
    }).then(fromBacked => fromBacked.json())
      .then(resBacked => {
        if (resBacked.status) {
          setUnreadCount(resBacked.count)
        }
      })
  }, [])

  useEffect(() => {
    const _allUsersList = Object.values(props.allchatusers)[0]
    setUsersList(_allUsersList)
    if (currentUserId == null && _allUsersList.length > 0 && _allUsersList[0]) {
      fetchMessages(_allUsersList[0]._id)
    }
  }, [props.allchatusers])

  const fetchMessages = (uid) => {
    fetch(`${REACT_APP_API_URL}api/get/allmessage/${uid}`, {
      method: 'GET',
      headers: {
        'x-access-token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
    }).then(fromBacked => fromBacked.json())
      .then(resBacked => {
        if (resBacked.status) {
          props.setCurrentChat(resBacked.data)
        }
      })
  }
  const setChatAsRead = (threadId, index) => {
    if (usersList[index].lastMessage && usersList[index].lastMessage[0] && usersList[index].lastMessage[0].is_read == false) {
      fetch(`${REACT_APP_API_URL}api/mark/read/message`, {
        method: 'POST',
        headers: {
          'x-access-token': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ chat_with: threadId }),
      }).then(fromBacked => fromBacked.json())
        .then(resBacked => {
          if (resBacked.status == true) {
            const _usersToSet = usersList
            _usersToSet[index].lastMessage[0].is_read = true
            props.setChatUsers(_usersToSet)
          }
        })
    }
  }

  const getDate = (_) => {
    let time = Moment().diff(Moment(_), 'seconds')
    if (time > 60) time = Moment().diff(Moment(_), 'minutes'); else return `${time} second(s) ago`
    if (time > 60) time = Moment().diff(Moment(_), 'hours'); else return `${time} minute(s) ago`
    if (time > 24) time = Moment().diff(Moment(_), 'days'); else return `${time} hour(s) ago`
    if (time > 7) time = Moment().diff(Moment(_), 'weeks'); else return `${time} day(s) ago`
    if (time > 4) time = Moment().diff(Moment(_), 'months'); else return `${time} week(s) ago`
    if (time > 12) time = Moment().diff(Moment(_), 'years'); else return `${time} month(s) ago`
    return `${time} years ago`
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="chat-wrapper">
          <div className="chat-list d-flex align-items-center justify-content-between my-md-4 my-3 pe-2">
            <h4 className="heading-color fw-bold mb-0">{t("conversations.messages")}</h4>
            <p className="text-color mb-0">{t("conversations.unread")} ({unreadCount})</p>
          </div>
          <div className="scroll-chat">
            <ul className="nav nav-tabs d-block border-bottom-0">
              {usersList.length > 0 ? usersList.map((threads, _) =>
                <li key={threads._id} className="nav-item">
                  <Link onClick={() => { setChatAsRead(threads._id, _); setCurrentUserId(threads._id); props.setCurrentChatUser(threads); fetchMessages(threads._id) }} className={`nav-link ${(currentUserId == null || currentUserId == threads._id) && _ == 0 && 'active'}`} data-bs-toggle="tab" to="#home">
                    <div className="d-md-none d-block text-center">
                      {threads.pictures ?
                        <img src={`${REACT_APP_ASSET_URL}${threads.pictures}`} className="mobile-profile-view" />
                        :
                        <img src={`${window.location.origin}/cookreact/user.png`} className="mobile-profile-view" />
                      }
                      <h6 className="heading-color fw-bold mb-0 mobile-profile-user-name">{`${threads.firstname} ${threads.lastname}`}</h6>
                    </div>

                    <div className="row w-100 d-md-flex d-none">
                      <div className="col-md-3">
                        {threads.pictures ?
                          <img src={`${REACT_APP_ASSET_URL}${threads.pictures}`} className="user-chat-profile img-fluid" />
                          :
                          <img src={`${window.location.origin}/cookreact/user.png`} className="user-chat-profile img-fluid" />

                        }
                      </div>

                      <div className="col-md-9 ps-0">
                        <div className="d-lg-flex align-items-center justify-content-between user-chat-profile-details mb-2">
                          <h6 className="heading-color fw-bold mb-0">{`${threads.firstname} ${threads.lastname}`}<i className="bi bi-circle-fill online-show-circle text-success"></i></h6>
                          <p className="light-gray mb-0">
                            {threads?.lastMessage && getDate(threads?.lastMessage[0].updated_at)}
                          </p>
                        </div>

                        {

                          ((threads?.lastMessage && threads?.lastMessage[0])
                            && ((threads?.lastMessage[0].from == 'user' && threads?.lastMessage[0].cook_id == threads._id)
                              || (threads?.lastMessage[0].from == 'cook' && threads?.lastMessage[0].user_id == threads._id)))
                            ?
                            <p className={`--last-message-class chat-discription mb-0 text-color`}>
                              {threads?.lastMessage && threads?.lastMessage[0].message}
                              <i className="bi bi-check-all"></i>
                            </p>
                            :
                            <p className={`--last-message-class chat-discription mb-0
                              ${(threads?.lastMessage && threads?.lastMessage[0].is_read)
                                ? 'text-color' :
                                'text-black fw-bold'
                              }`}>
                              {threads?.lastMessage && threads?.lastMessage[0].message}
                            </p>
                        }

                      </div>
                    </div>

                  </Link>
                </li>
              ) : <li>{t("conversations.no_user")}</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    allchatusers: state.allchatusers,
    user: state.user.user
  }
}
const mapDispatchToProps = dispatch => {
  return {
    setChatUsers: (payload) => dispatch(setChatUsers(payload)),
    setCurrentChat: (payload) => dispatch(setCurrentChat(payload)),
    setCurrentChatUser: (payload) => dispatch(setCurrentChatUser(payload))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(LeftPanel)