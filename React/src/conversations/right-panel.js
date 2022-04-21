import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux"
import { useForm } from "react-hook-form"
import Moment from 'moment';
import { setChatUsers } from "../redux/Chatusers/chatusers.actions"
import { Link } from 'react-router-dom'
import { useTranslation } from "react-i18next";
const { REACT_APP_ASSET_URL, REACT_APP_API_URL } = process.env

async function sendMessage(message, id) {
  message['send_to'] = id;
  return fetch(`${REACT_APP_API_URL}api/send/message`, {
    method: 'POST',
    headers: {
      'x-access-token': localStorage.getItem('token'),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(message)
  });
}

function RightPanel(props) {
  const { t } = useTranslation();
  const messageEl = useRef(null);
  const [currentChat, setCurrentChat] = useState([])
  const [currentLoginUser] = useState(JSON.parse(localStorage.getItem('cuser')))
  const [currentChatUser, setCurrentChatUser] = useState([])
  const { register, handleSubmit, getValues, reset, formState: { errors } } = useForm();

  useEffect(() => {
    setCurrentChat(props.currentChat)
    setCurrentChatUser(props.currentChatUser)
    if (messageEl) {
      messageEl.current.addEventListener('DOMNodeInserted', event => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
      });
    }
  }, [props.currentChat])

  const getLastMessageFormat = (formValues) => [{
    cook_id: currentLoginUser.role == 'user' ? currentChatUser._id : currentLoginUser._id,
    created_at: Moment().format(),
    from: currentLoginUser.role,
    is_read: false,
    message: formValues.message,
    updated_at: Moment().format(),
    user_id: currentLoginUser.role == 'user' ? currentLoginUser._id : currentChatUser._id,
    _id: Moment().format()
  }]

  const setChatLastMessage = (formValues) => setCurrentChat([...currentChat, ...getLastMessageFormat(formValues)])
  const updateAllChatUsers = (formValues) => {
    let __allUsers = props.allchatusers
    Object.values(__allUsers).map(_values =>
      _values.map((__values, index) => {
        if (currentChatUser._id == __values._id) {
          if (__values.lastMessage) __values.lastMessage[0].message = formValues.message
          else __values.lastMessage = getLastMessageFormat(formValues)
          _values.splice(0, 0, _values.splice(index, 1)[0])
        }
      })
    )
    props.setChatUsers(__allUsers.allChatUsers)
  }
  const submitMessageForm = async e => {
    await sendMessage(getValues(), currentChatUser._id).then(data => data.json())
      .then(res => {
        if (res.status == true) {
          setChatLastMessage(getValues());
          updateAllChatUsers(getValues())
          reset()
        }
      })
  }
  const getDate = (_) => {
    let time = Moment().diff(Moment(_), 'hours')
    if (time > 24) time = Moment().diff(Moment(_), 'days'); else return `${Moment(_).format('h:mm A')}`
    if (time > 7) time = Moment().diff(Moment(_), 'weeks'); else return `${time} day(s) ago`
    if (time > 4) time = Moment().diff(Moment(_), 'months'); else return `${time} week(s) ago`
    if (time > 12) time = Moment().diff(Moment(_), 'years'); else return `${time} month(s) ago`
    return `${time} years ago`
  }
  return (
    <div className="row">
      <div className="col-md-12">
        <div className="tab-content">
          <div className="tab-pane container active mt-md-4 mt-0 px-0" id="home">
            {currentChat && currentChat.length > 0 && <>
              <span className="heading-color fw-bold mb-0 mt-md-0 mt-2 h4 me-2">{`${currentChatUser.firstname} ${currentChatUser.lastname}`}</span>
              {props.user.role == 'user' &&
              <Link className="h6" to={`/cookreact/cook-details/${currentChatUser._id}`}>{t("dashboard.view_profile")}</Link>}
            </>
            }
            <div className="scroll-messages" ref={messageEl}>
              {currentChat && currentChat.length > 0 ?
                <>
                  {currentChat.map(message =>
                    ((message.from == 'user' && message.cook_id == currentChatUser._id)
                      || (message.from == 'cook' && message.user_id == currentChatUser._id)) ?
                      <div key={message._id} className="row justify-content-end mt-4 custom-width">
                        <div className="col-md-6">
                          <div className="conversation-box-1 d-flex align-items-end justify-content-end text-break">
                            <div className="conversation-msg">
                              <p className="text-color mb-0 --white-space-break-spaces">{message.message}</p>
                            </div>
                            {props.user.pictures ?
                              <img src={`${REACT_APP_ASSET_URL}${props.user.pictures}`} className="chef-profile-img" />
                              :
                              <i className="bi bi-person-circle ms-1 message-sender-icon"></i>
                            }
                          </div>
                          <p className="light-gray text-end pe-4 mt-2 messages-timing">{getDate(message.created_at)}</p>
                        </div>
                      </div>
                      :
                      <div key={message._id} className="row mt-md-2 mt-2 custom-width">
                        <div className="col-md-6">
                          <div className="conversation-box-1 d-flex align-items-end text-break">
                            {currentChatUser.pictures ?
                              <img src={`${REACT_APP_ASSET_URL}${currentChatUser.pictures}`} className="chef-profile-img" />
                              :
                              <i className="bi bi-person-circle ms-1 message-sender-icon"></i>
                            }
                            <div className="conversation-msg-2">
                              <p className="text-color mb-0 --white-space-break-spaces">{message.message}</p>
                            </div>
                          </div>
                          <p className="light-gray ps-4 mt-2 messages-timing">{getDate(message.created_at)}</p>
                        </div>
                      </div>
                  )}
                </>
                : <div>{t("conversations.no_chat")}</div>}
            </div>
            {props.currentChat && props.currentChat.length > 0 &&
              <form onSubmit={handleSubmit(submitMessageForm)}>
                <div className="message-write-section">
                  <div className="d-flex pe-3">
                    <div className={`input-group mb-2 mb-md-3 me-2 write-message-background ${errors.message && 'border border-danger'}`}>
                      <span className="input-group-text border-0" id="basic-addon1"><i
                        className="bi bi-emoji-smile-fill ps-3"></i></span>
                      <textarea name="message" className="form-control pt-2" placeholder="Write your message" aria-label="Username"
                        aria-describedby="basic-addon1" {...register('message', { required: true })}>
                      </textarea>
                    </div>
                    <div>
                      <button type="submit" className="btn btn-success message-send-button">{t("conversations.send")}</button>
                    </div>
                  </div>
                </div>
              </form>
            }
          </div>
        </div>
      </div>
    </div >


  );
}

const mapStateToProps = state => {
  return {
    currentChat: state.currentChat.currentChat,
    currentChatUser: state.currentChatUser.currentChatUser,
    user: state.user.user,
    allchatusers: state.allchatusers
  }
}
const mapDispatchToProps = dispatch => {
  return {
    setChatUsers: (payload) => dispatch(setChatUsers(payload))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(RightPanel)