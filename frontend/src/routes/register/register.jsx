import "./register.scss";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";

function Register() {
  const [error,setError] = useState("")
  const [IsLoading,setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e)=>{   
    e.preventDefault()  
    setIsLoading(true)
    setError('')
    const formData = new FormData(e.target);

    const username = formData.get("username"); 
    const email = formData.get("email"); 
    const password = formData.get("password"); 

    try{
    const res =await apiRequest.post('auth/register',{
      username,email,password
    }) 
    navigate("/login")
     }catch(err){
      console.log(err)
      setError(err.response.data.messsage)
     }finally{
      setIsLoading(false)
     }
     }
  return (
    <div className="register">
      <div className="formContainer">
        <form onSubmit={handleSubmit}> 
          <h1>Create an Account</h1>
          <input name="username" type="text" placeholder="Username" />
          <input name="email" type="text" placeholder="Email" />
          <input name="password" type="password" placeholder="Password" />
          <button disabled={IsLoading}>Register</button>
          <Link to="/login">Do you have an account?/Login</Link>
          {error && <span>{error}</span>}
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Register;
