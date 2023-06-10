import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [userInput, setUserInput] = useState({});
  const [errorMsgs, setErrorMsgs] = useState("");

  const navigate = useNavigate();

  function updateUserInput(evt) {
    const fieldName = evt.target.name;
    const fieldValue = evt.target.value;

    setUserInput((prevUserInput) => {
      return {
        ...prevUserInput,
        [fieldName]: fieldValue,
      };
    });
  }

  function submitForm() {
    axios({
      method: "post",
      url: "http://localhost:3000/users/register",
      data: userInput,
    }).then((res) => {
      if (!res.data.succeed) {
        setErrorMsgs(res.data.msg);
      } else {
        navigate("/users/login");
      }
    });
  }

  return (
    <section className="vh-100" style={{ backgroundColor: "#eee" }}>
      <div className="container h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-12 col-xl-11">
            <div className="card text-black" style={{ borderRadius: 25 }}>
              <div className="card-body p-md-5">
                <div className="row justify-content-center">
                  <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                      Sign up
                    </p>
                    <form className="mx-1 mx-md-4">
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-lock fa-lg me-3 fa-fw" />
                        {errorMsgs.length != 0 && (
                          <div className="alert alert-danger">
                            <ul>
                              {errorMsgs.map((errorMsg) => {
                                return (
                                  <li>{errorMsg}</li>
                                )
                              })}
                            </ul>
                          </div>
                        )}
                      </div>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-user fa-lg me-3 fa-fw" />
                        <div className="form-outline flex-fill mb-0">
                          <label
                            className="form-label"
                            htmlFor="form3Example1c"
                          >
                            Your Name
                          </label>
                          <input
                            type="text"
                            id="form3Example1c"
                            className="form-control"
                            name="name"
                            onChange={updateUserInput}
                          />
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-envelope fa-lg me-3 fa-fw" />
                        <div className="form-outline flex-fill mb-0">
                          <label
                            className="form-label"
                            htmlFor="form3Example2c"
                          >
                            Your Email
                          </label>                          
                          <input
                            type="email"
                            id="form3Example2c"
                            className="form-control"
                            name="email"
                            onChange={updateUserInput}
                          />
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-envelope fa-lg me-3 fa-fw" />
                        <div className="form-outline flex-fill mb-0">
                          <label
                            className="form-label"
                            htmlFor="form3Example3c"
                          >
                            Username
                          </label>
                          
                          <input
                            type="text"
                            id="form3Example3c"
                            className="form-control"
                            name="username"
                            onChange={updateUserInput}
                          />
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-lock fa-lg me-3 fa-fw" />
                        <div className="form-outline flex-fill mb-0">
                          <label
                            className="form-label"
                            htmlFor="form3Example4c"
                          >
                            Password
                          </label>
                          <input
                            type="password"
                            id="form3Example4c"
                            className="form-control"
                            name="password"
                            onChange={updateUserInput}
                          />
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-key fa-lg me-3 fa-fw" />
                        <div className="form-outline flex-fill mb-0">
                          <label
                            className="form-label"
                            htmlFor="form3Example4cd"
                          >
                            Repeat your password
                          </label>
                          <input
                            type="password"
                            id="form3Example4cd"
                            className="form-control"
                            name="passwordRepeat"
                            onChange={updateUserInput}
                          />
                        </div>
                      </div>
                      <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                        <button
                          type="button"
                          className="btn btn-primary btn-lg"
                          onClick={submitForm}
                        >
                          Sign Up
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                    <img
                      src="https://img1.wsimg.com/isteam/ip/3c94c74b-e9bd-4552-8a0c-3482568cdc3f/fullsizeoutput_1.jpeg/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:1240,h:620,cg:true"
                      className="img-fluid"
                      alt="Sample image"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignUp;