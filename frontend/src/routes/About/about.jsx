import "./about.scss";


function About() {

  return (
    <div className="homePage">
      <div className="textContainer">
        <div className="wrapper">
          <p>
          <h2>Property Search Functionality</h2>
           Real estate apps offer a robust property search function allowing users to filter their searches based on location, price, size, and other specific criteria, making it easier to find properties that meet their requirements.
          </p>
          <p>
          <h2>Integration of Mapping Technology </h2>
          These apps integrate mapping technology, enabling users to visualize properties on a map and gain insights into the surrounding neighborhood. This feature helps users assess factors such as proximity to schools, public transportation, shopping centers, and other essential amenities, providing a comprehensive view of each property's location.
          </p>
          <p>
          <h2>User-Friendly Interface</h2>
           With intuitive user interfaces, real estate apps are designed to be user-friendly and accessible to individuals with varying levels of technological proficiency. This ensures that users can navigate the app smoothly and efficiently, regardless of their familiarity with technology.
          </p>
          <p>
          <h2>Notifications and Alerts</h2>
          Users can set up notifications to stay informed about new listings that match their preferences or receive updates on properties they're interested in. This ensures that users never miss out on relevant opportunities and allows them to act quickly in a competitive market.
          </p>
        </div>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default About;
