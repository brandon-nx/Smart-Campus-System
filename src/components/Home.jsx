import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to URoute</h1>
      <p>Select an option:</p>
      <Link to="/signup">
        <button className="home-btn">Sign Up</button>
      </Link>
      <Link to="/login">
        <button className="home-btn">Login</button>
      </Link>
    </div>
  );
}

export default Home;
