import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import CartSummary from "./CartSummary";

function ProtectedCartSummary() {
    const [auth, setAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    async function checkAuthStatus() {
        const response = await axios({
          url: "http://localhost:3000/users/auth-info",
          method: "get",
          withCredentials: true,
        })
    
        setAuth(response.data.authenticated);
        setIsLoading(false);
    }

    useEffect(() => {
        checkAuthStatus();
        
    }, []);

    return isLoading ? (
        <h1>Loading</h1>
      ) : auth ? (
        <CartSummary />
      ) : (
        <Navigate to={'/users/login'} />
      );
}

export default ProtectedCartSummary;