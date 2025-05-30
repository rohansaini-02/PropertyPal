import User from "../../components/user/User";
import "./contact.scss";
import { useLoaderData, Await } from "react-router-dom";
import { Suspense } from "react";

function Contact() {
  const data = useLoaderData()
  console.log(data)

  return (
    <div className="contactPage">
      <div className="header">Users Contacts</div>
        <div className="wrapper">
          <Suspense fallback={<p>Loading....</p>}>
          <Await
          resolve={data.userResponse}
          errorElement={
            <p>Error loading posts!</p>
          }
          >
          {(userResponse) => <User users={userResponse.data}/>}
          </Await>
          </Suspense>
        
        </div>
    </div>
   );
}

export default Contact;
