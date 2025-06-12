import React, { useState } from 'react';
import SignupForm from './components/SignupPage'; // Adjust path as needed

function App() {
  const [user, setUser] = useState(null);

  const handleSignup = (userData) => {
    setUser(userData); // Save logged-in user info after signup
    console.log("Signed up user:", userData);
  };

  return (
    <div className="App">
      {!user ? (
        <SignupForm onSignup={handleSignup} />
      ) : (
        <div>
          <h1>Welcome, {user.full_name}!</h1>
          {/* Redirect or show dashboard */}
        </div>
      )}
    </div>
  );
}

export default App;
