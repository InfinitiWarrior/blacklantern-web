import './App.css'; // Import the CSS file to style the components

import React, { useState, useEffect } from 'react';
import { auth } from './firebaseConfig';  // Import Firebase auth
import { signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const db = getFirestore();  // Firestore reference

function App() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState(null);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, 'daaxa001@gmail.com', 'test123');
      setUser(userCredential.user);
    } catch (error) {
      console.error("Error logging in: ", error.code, error.message);
      alert("Login failed: " + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Google login error: ", error.message);
      alert("Google login failed: " + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null); // Reset error if file is selected
    }
  };

  const handleSubmitFile = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    try {
      // Read the file content as text
      const reader = new FileReader();
      reader.onload = async () => {
        const fileContent = reader.result;
        let parsedContent = null;

        // Try to parse as JSON, otherwise keep as plain text
        try {
          parsedContent = JSON.parse(fileContent);
        } catch (error) {
          console.log("File is not JSON, saving as plain text.");
          parsedContent = fileContent; // Save as plain text if it's not JSON
        }

        // Save to Firestore under the user's document
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, { fileContent: parsedContent }, { merge: true });

        // Set state to display the uploaded content
        setJsonData(parsedContent);

        alert("File content saved successfully to Firestore!");
      };

      reader.readAsText(file); // Read the file as text
    } catch (error) {
      console.error("Error uploading file: ", error.message);
      setError("There was an error processing the file.");
    }
  };

  // Function to assign background color based on severity
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return '#ff4d4d'; // Red for high severity
      case 'medium':
        return '#ffcc00'; // Yellow for medium severity
      case 'low':
        return '#80e0a7'; // Green for low severity
      default:
        return '#d3d3d3'; // Gray for unknown severity
    }
  };

  return (
    <div className="App">
      <h1>Firebase Authentication Example</h1>

      {user ? (
        <div>
          <h2>Welcome, {user.email}</h2>
          <button onClick={handleLogout}>Log Out</button>

          {/* File upload section */}
          <div className="upload-section">
            <input
              type="file"
              id="file-upload"
              onChange={handleFileUpload}
              accept="application/json"
            />
            <label htmlFor="file-upload">Upload JSON File</label>
            <button onClick={handleSubmitFile}>Submit File</button>

            {error && <p>{error}</p>}
          </div>

          {/* IP Sections Display */}
          {jsonData && (
            <div className="ip-sections">
              <h3>IP Sections:</h3>
              {jsonData.map((ipData, index) => (
                <div
                  key={index}
                  className="ip-card"
                  style={{ backgroundColor: getSeverityColor(ipData.severity) }}
                >
                  <h4>IP: {ipData.ip}</h4>
                  <p>Hostname: {ipData.hostname}</p>
                  <p>Open Ports: {ipData.open_ports.join(', ')}</p>
                  <p>Severity: {ipData.severity}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <button onClick={handleLogin}>Log In</button>
          <button onClick={handleGoogleLogin}>Login with Google</button>
        </div>
      )}
    </div>
  );
}

export default App;
