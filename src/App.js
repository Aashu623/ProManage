import React, { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Home from "./components/Home/Home";
import Auth from "./components/Auth/Auth";
import { auth, getUserFromDatabase } from "./firebase";
import Account from './components/Account/Account';
function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [userDetails, setUserDetails] = useState({});

  const fetchUserDetails = async (uid) => {
    const userDetails = await getUserFromDatabase(uid);
    setUserDetails(userDetails);
  }
  useEffect(() => {
    const listener = auth.onAuthStateChanged((user) => {
      if (!user) {
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);
      fetchUserDetails(user.uid);
    });

    return () => listener();
  }, []);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home auth={isAuthenticated} />
    },
    {
      path: '/*',
      element: <Home auth={isAuthenticated} />
    },
    {
      path: '/account',
      element: <Account userDetails={userDetails} auth={isAuthenticated} />
    },
    {
      path: '/signup',
      element: <Auth signup />
    },
    {
      path: '/login',
      element: <Auth />
    },
  ])
  return (
    <RouterProvider router={router} />
  );
}

export default App;
