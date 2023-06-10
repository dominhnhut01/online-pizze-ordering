import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import Order from "./Order";

function ProtectedOrder() {
  const [auth, setAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  async function checkAuthStatus() {
    const response = await axios({
      url: "http://localhost:3000/users/auth-info",
      method: "get",
      withCredentials: true,
    });
    console.log("response auth");
    console.log(response.data.authenticated);
    setAuth(response.data.authenticated);
    setIsLoading(false);
  }

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
  }, [auth])

  return isLoading ? (
    <h1>Loading</h1>
  ) : auth ? (
    <Order />
  ) : (
    <Navigate to={"/users/login"} />
  );
}

export default ProtectedOrder;
