import { Link } from "react-router-dom";
import { useState,useContext } from "react";
import {AuthContext} from '../../context/AuthContext'
import apiRequest from "../../lib/apiRequest";
import "./card.scss";

function Card({ item }) {
  console.log(item)
  const {CurrentUser} = useContext(AuthContext)
  // const [saved, setSaved] =useState(item.savedPosts.find(id=>id === CurrentUser.id)?false:true)
  const [saved, setSaved] =useState( item.savedPosts.some(post => post.userId === CurrentUser.id)?true:false)
  const handleSave = async(id)=>{
    setSaved((prev)=>!prev)
    if(!CurrentUser){
      navigate("/login")
    }
    try{
      await apiRequest.post('/users/save',{postId:id})
    }
    catch(err){
      console.log(err)
      setSaved((prev)=>!prev)
    }
  }

  return (
    <div className="card">
      <Link to={`/${item.id}`} className="imageContainer">
        <img src={item.images[0]} alt="" />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item.id}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="" />
          <span>{item.address}</span>
        </p>
        <p className="price">₹ {item.price}</p>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="" />
              <span>{item.bedroom} bedroom</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>{item.bathroom} bathroom</span>
            </div>
          </div>
          <div className="icons">
            <div className="icon" onClick={()=>{handleSave(item.id)}} style={{
              backgroundColor: saved ? "#fece51" : "white"
            }}>
              <img src="/save.png" alt="" />
              {saved ? "Place Saved" : "Save Place"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
