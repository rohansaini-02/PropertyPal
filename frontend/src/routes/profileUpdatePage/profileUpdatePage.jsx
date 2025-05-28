import "./profileUpdatePage.scss";
import { AuthContext } from '../../context/AuthContext'
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from '../../lib/apiRequest'
import UploadWidget from "../../components/uploadWidget/UploadWidget";


function ProfileUpdatePage() {
  const {updateUser,  CurrentUser} = useContext(AuthContext)
  const [error, setError] = useState('')
  const [avatar, setAvatar] = useState([])
  const navigate = useNavigate()

  const handleSubmit = async (e) =>{
    e.preventDefault()
    const formData = new FormData(e.target)

    const {username,email,password} = Object.fromEntries(formData)
    try{
      const res = await apiRequest.put(`users/${CurrentUser.id}`,{username,email,password,avatar:avatar[0]})
      updateUser(res.data)
      navigate(`/profile/${CurrentUser.id}`)
    }
    catch(err){
      console.log(err)
      setError(err.response.data.message)
    }
  }
  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Update Profile</h1>
          <div className="item">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={CurrentUser.username}
            />
          </div>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={CurrentUser.email}
            />
          </div>
          <div className="item">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" />
          </div>
          <button>Update</button>
          {error && <span>error</span>}
        </form>
      </div>
      <div className="sideContainer">
        <img src={avatar[0] || CurrentUser.avatar || '/noavatar.png'} alt="" className="avatar" />
      </div>
      <UploadWidget 
      uwConfig={{
        cloudName:"dfformrpw",
        uploadPreset:"realEstate",
        multiple:false,
        maxImageSize:2000000,
        folder:"avatars",
      }}
      setState={setAvatar}
      /> 
    </div>
  );
}

export default ProfileUpdatePage;
