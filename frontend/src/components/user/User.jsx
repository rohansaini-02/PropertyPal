import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext"
import "./user.scss";
import apiRequest from "../../lib/apiRequest"
import { useNavigate } from "react-router-dom"

function User({ users}) {
  const { CurrentUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleNewChat = async (id) => {
    try {
      await apiRequest.post("/chats", { receiverId: id })
      navigate(`/profile/${CurrentUser.id}`)
    }
    catch (err) {
      console.log(err)
    }
  }

  return (

      <div className="users">
        {
          users?.map((c) => (
            <div className="contact" key={c.id}
              style={{ display: c.id.includes(CurrentUser.id) ? "none" : "" }}
              onClick={() => handleNewChat(c.id)}>
              <img
                src={c.avatar || '/noavatar.png'}
                alt=""
              />
              <span>Name: {c.username}</span>
              <span>Email: {c.email}</span>
            </div>
          ))
        }

      </div>

  );
}

export default User;
