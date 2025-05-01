import React from 'react';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to EventMe</h1>
      <p className="intro-text">
        EventMe helps you find, create, and join amazing events in your community.
      </p>

      <div className="section">
        <h2>How It Works</h2>
        <ul className="info-list">
          <li>Sign up or log in to your account.</li>
          <li>Browse events</li>
          <li>Join events you like and connect with others!</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;