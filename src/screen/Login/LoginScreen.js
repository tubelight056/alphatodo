import React, { useState } from "react";
import "./LoginScreen.css";
import axios from "axios";
import { useHistory } from "react-router-dom";
const Login = () => {
  const [name, setname] = useState("");
  const [password, setpassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const history = useHistory();
  const handleErrorMessage = async (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };
  const onSubmitHandler = async (loginstatus) => {
    await axios
      .post(`https://alphatod0.herokuapp.com/signin?login=${loginstatus}`, {
        name: name,
        password: password,
      })
      .then((data) => {
        if (data.data.message) {
          handleErrorMessage(data.data.message);
        } else {
          sessionStorage.setItem("id", data.data.id);
          history.replace(`/home/${name}`);
        }
      });
  };

  return (
    <div className="loginOuterContainer">
      <div className="whiteScreen">
        <h1 className="whiteScreenH1">Hello world, Take me in desktop view</h1>
      </div>
      <div className="LoginInnerContainer">
        <h1 className="loginH1">Alpha Todo</h1>
        <input
          type="text"
          name="username"
          className="inpt"
          value={name}
          placeholder="Username"
          onChange={(e) => {
            setname(e.target.value);
          }}
        />
        <input
          type="text"
          name="password"
          className="inpt"
          value={password}
          placeholder="Password"
          onChange={(e) => {
            setpassword(e.target.value);
          }}
        />
        <button
          className="btn"
          onClick={() => {
            if (name === "") {
              handleErrorMessage("Name field is required");
            } else if (password.length < 8) {
              handleErrorMessage("password must be more than 8 strings");
            } else {
              onSubmitHandler(true);
            }
          }}
        >
          Login
        </button>
        <button
          className="btn"
          onClick={() => {
            if (name === "") {
              handleErrorMessage("Name field is required");
            } else if (password.length < 8) {
              handleErrorMessage("password must be more than 8 strings");
            } else {
              onSubmitHandler(false);
            }
          }}
        >
          Register
        </button>
      </div>
      {errorMessage != null && (
        <h1 className="errorMessageH1">{errorMessage}</h1>
      )}
    </div>
  );
};

export default Login;
