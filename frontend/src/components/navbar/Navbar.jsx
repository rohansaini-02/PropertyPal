import { useState,  useContext } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext'
import {useNotificationStore} from "../../lib/notificationStore"

function Navbar() {
  const [open, setOpen] = useState(false);

  const {CurrentUser} = useContext(AuthContext);

  const fetch = useNotificationStore(state=>state.fetch)
  const number = useNotificationStore(state=>state.number)
  if(CurrentUser) fetch();

  return (
    <nav>
      <div className="left">
        <a className="logo">
          <img src="/re-logo-design_731343-252.avif" alt="" />
          <span>PropertyPal</span>
        </a>
        <a href="/">Home</a>
        <a href="/list">Search</a>
        <a href="/contact">Contact</a>
        <a href="/about">About</a>
      </div>
      <div className="right">
        {CurrentUser ? (
          <div className="user">
            <img
              src={CurrentUser.avatar || "noavatar.png"}
              alt=""
            />
            <span>{CurrentUser.username}</span>
            <Link to={`/profile/${CurrentUser.id}`} className="profile">
              {number>0 && <div className="notification">{number}</div>}
              <span>Profile</span>
            </Link>
          </div>
        ) : (
          <div className="user">
            <a href="/login">Sign in</a>
            <a href="/register" className="register" style={{height: "40px"}}>Sign up</a>
          </div>
        )}
        <div className="menuIcon">
          <img
            src="/menu.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>
        <div className={open ? "menu active" : "menu"}>
          <a href="/">Home</a>
          <a href="/">About</a>
          <a href="/">Contact</a>
          <a href="/">Agents</a>
          <a href="/">Sign in</a>
          <a href="/">Sign up</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
