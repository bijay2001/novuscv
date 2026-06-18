import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import LoadingScreen from "./components/Loadingscreen";

const App = () => {
  // Synchronously check sessionStorage on initial load
  const [isLoading, setIsLoading] = useState(() => {
    return !sessionStorage.getItem("hasAppLoadedBefore");
  });

  useEffect(() => {
    if (isLoading) {
      const loadTimer = setTimeout(() => {
        sessionStorage.setItem("hasAppLoadedBefore", "true");
        setIsLoading(false);
      }, 2500);

      return () => clearTimeout(loadTimer);
    }
  }, [isLoading]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;