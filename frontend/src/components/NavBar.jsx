import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";
import { SlBasket } from "react-icons/sl";
import axios from "axios";


function NavBar(props) {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState({});
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();

  async function LogOutAPICall() {
    const response = await axios({
      url: "http://localhost:3000/users/logout",
      method: "get",
      withCredentials: true,
    })
  }

  function LogOut() {
    LogOutAPICall();
    checkAuthStatus();
    navigate('/');
  }

  async function checkAuthStatus() {
    const response = await axios({
      url: "http://localhost:3000/users/auth-info",
      method: "get",
      withCredentials: true,
    })

    setAuth(response.data.authenticated);
    setUser(response.data.user);
  }

  async function fetchCartCount() {
    const response = await axios({
      url: "http://localhost:3000/users/cart-info",
      method: "get",
      withCredentials: true,
    })

      setCartCount(response.data.cartCount);
  }

  useEffect(() => {
    fetchCartCount();
    // console.log("trigger!!!!");
  }, [props.renderTrigger]);

  useEffect(() => {
    checkAuthStatus();
    fetchCartCount();
  }, []);
  
  return (
    <div className="container-fluid">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand nav-link" onClick={() => navigate('/')}>
            The Pizza Place
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarText"
            aria-controls="navbarText"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" aria-current="page" onClick={() => navigate('/')}>
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  aria-current="page"
                  onClick={() => 
                    navigate('/order')
                  }
                >
                  Order
                </a>
              </li>
            </ul>
            {auth === true ? (
              <ul className="navbar-nav ms-auto">
                <li className="nav-link mx-50" style={{ display: "flex", alignItems: "center" }} onClick={()=>navigate('/users/cart')}>
                  <SlBasket />
                  <span style={{ margin: "0 1rem"}}> ({cartCount}) </span>
                  <span>{user.name}</span>
                </li>
                <li className="nav-item mx-50">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={LogOut}
                  >
                    Log Out
                  </button>
                </li>
              </ul>
            ) : (
              <ul className="navbar-nav ms-auto">
                <li className="nav-item mx-50">
                  <Link to="/users/login" relative="path">
                    <button type="button" className="btn btn-primary">
                      Login
                    </button>
                  </Link>
                </li>
                <li className="nav-item mx-50">
                  <Link to="/users/signup" relative="path">
                    <button type="button" className="btn btn-primary">
                      Register
                    </button>
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;