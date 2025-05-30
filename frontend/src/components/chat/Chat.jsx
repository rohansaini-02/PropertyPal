import { useContext, useState, useEffect, useRef } from "react";
import {AuthContext} from "../../context/AuthContext"
import {SocketContext} from "../../context/SocketContext"
import "./chat.scss";
import apiRequest from "../../lib/apiRequest"
import {format} from "timeago.js"
import {useNotificationStore} from "../../lib/notificationStore"

function Chat({chats}) {
  const [chat, setChat] = useState(null);
  const {CurrentUser} = useContext(AuthContext)
  const {Socket} = useContext(SocketContext)

  const messageEndRef = useRef()

  const decrease = useNotificationStore(state=>state.decrease)
 
  useEffect(()=>{
    messageEndRef.current?.scrollIntoView({behavior:"smooth"})
  },[chat])

  const handleOpenChat = async(id,receiver)=>{
     try{
      const res = await apiRequest("/chats/"+id)
      if(!res.data.seenBy.includes(CurrentUser.id)){
        decrease()
      }
      setChat({...res.data,receiver})
     }
     catch(err){
      console.log(err)
     }
  }

  // console.log(chats)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target);
    const text = formdata.get('text')

    if(!text) return;
    try{
      const res = await apiRequest.post('/messages/'+chat.id,{ text })
      setChat(prev=>({...prev,messages:[...prev.messages,res.data]}))
      e.target.reset()
      Socket.emit("sendMessage", {
        receiverId : chat.receiver.id,
        data: res.data,
      })
    }catch(err){
      console.log(err)
    }
  }

  useEffect(() => {
const read = async()=>{
   try{
await apiRequest.put("/chats/read/"+chat.id)
   }catch(err){
    console.log(err)
   }
}
    if(chat && Socket){
      Socket.on("getMessage",(data)=>{
        console.log(data)
        if(chat.id === data.chatId){
          setChat((prev)=>({...prev, messages:[...prev.messages,data]}))
          read()
        }
      })
    }
    return () => {
      Socket.off("getMessage");
    };
  }, [Socket, chat]);



  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
      {
        chats?.map((c)=>(
<div className="message" key={c.id}
style={{
  backgroundColor:c.seenBy.includes(CurrentUser.id) || chat?.id == c.id ? "white" : "#fced514e", 
}}
onClick={()=>handleOpenChat(c.id,c.receiver)}
>
          <img
            src={c.receiver.avatar || '/noavatar.png'}
            alt=""
          />
          <span>{c.receiver.username}</span>
          <p>{c.lastMessage}</p>
        </div>
        ))
      }
        
      </div>
      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img
                src={chat.receiver.avatar || '/noavatar.png'}
                alt=""
              />
              {chat.receiver.username}
            </div>
            <span className="close" onClick={()=>setChat(null)}>X</span>
          </div>
          <div className="center">
            {chat.messages.map((message)=>(
            <div className="chatMessage"
            style={{
              alignSelf: message.userId === CurrentUser.id ? "flex-end" : "flex-start",
              textAlign: message.userId === CurrentUser.id ? "right" : "left"
            }}
            key={message.id}>
              <p>{message.text}</p>
              <span>{format(message.createdAt)}</span>
            </div>
            ))}
            <div ref={messageEndRef}></div>
          </div>
          <form onSubmit={handleSubmit} className="bottom">
            <textarea name="text"></textarea>
            <button>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
