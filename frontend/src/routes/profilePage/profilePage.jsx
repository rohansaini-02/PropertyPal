import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import "./profilePage.scss";
import apiRequest from "../../lib/apiRequest"
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from '../../context/AuthContext'
import { useLoaderData, Await } from "react-router-dom";
import { Suspense } from "react";

function ProfilePage() {
  const data = useLoaderData()
  console.log(data)
  const {updateUser,  CurrentUser} = useContext(AuthContext)
  const navigate = useNavigate()


const handleLogout =async()=>{
  try{
await apiRequest.post("/auth/logout")
updateUser(null)
navigate('/')
  }catch(err){
console.log(err)
  }
}

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <button onClick={()=>{navigate('/profile/update')}}>Update Profile</button>
          </div>
          <div className="info">
            <span>
              Avatar:
              <img
                src={CurrentUser.avatar || '/noavatar.png'} 
                alt=""
              />
            </span>
            <span>
              Username: <b>{CurrentUser.username}</b>
            </span>
            <span>
              E-mail: <b>{CurrentUser.email}</b>
            </span>
            <button onClick={handleLogout}>Logout</button>
          </div>
          <div className="title">
            <h1>My List</h1>
            <Link to='/add'>
            <button>Create New Post</button>
            </Link>
          </div>
          <Suspense fallback={<p>Loading....</p>}>
          <Await
          resolve={data.postResponse}
          errorElement={
            <p>Error loading posts!</p>
          }
          >
          {(postResponse) => <List posts={postResponse.data.userPosts}/>}
          </Await>
          </Suspense>
          
          <div className="title">
            <h1>Saved List</h1>
          </div>
          <Suspense fallback={<p>Loading....</p>}>
          <Await
          resolve={data.postResponse}
          errorElement={
            <p>Error loading posts!</p>
          }
          >
          {(postResponse) => <List posts={postResponse.data.savedPosts}/>}
          </Await>
          </Suspense>
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
        <Suspense fallback={<p>Loading....</p>}>
          <Await
          resolve={data.chatResponse}
          errorElement={
            <p>Error loading chats!</p>
          }
          >
          {(chatResponse) => <Chat chats={chatResponse.data}/>}
          </Await>
          </Suspense>
          
        </div>
      </div>
    </div>
   );
}

export default ProfilePage;
