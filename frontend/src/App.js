import React, { useState } from 'react';
import SignupForm from './components/SignupForm';
import UserDashboard from './components/userDashboard';

function App() {
  const [isSignedUp, setIsSignedUp] = useState(false);

  const handleSignUp = () => {
    // Simulate successful signup
    setIsSignedUp(true);
  };

  return (
    <div className="App">
      {!isSignedUp ? (
        <>
          <h1>Welcome to StuChama</h1>
          <SignupForm onSignUp={handleSignUp} />
        </>
      ) : (
        <UserDashboard />
      )}
    </div>
  );
}

export default App;
