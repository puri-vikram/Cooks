import React, { useEffect } from "react"
import LeftPanel from "./left-panel"
import RightPanel from "./right-panel"
import { connect } from "react-redux"
import { setChatUsers } from "../redux/Chatusers/chatusers.actions"
import { setCurrentChatUser } from "../redux/CurrentChatUser/current-chat-user.actions"
const { REACT_APP_API_URL } = process.env
function Conversations(props) {
  useEffect(() => {
    fetch(`${REACT_APP_API_URL}api/get/allchatusers`, {
      method: 'GET',
      headers: {
        'x-access-token': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
    }).then(data => data.json())
      .then(res => {
        if (res.status) {
          props.setCurrentChatUser(res.data[0])
          props.setChatUsers(res.data)
        }
      })
  }, [])
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-4"><LeftPanel /></div>
        <div className="col-md-8"><RightPanel /></div>
      </div>
    </div>
  );
}
const mapStateToProps = () => ({});
const mapDispatchToProps = dispatch => {
  return {
    setChatUsers: (payload) => dispatch(setChatUsers(payload)),
    setCurrentChatUser: (payload) => dispatch(setCurrentChatUser(payload))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Conversations)