import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from "./posts_assets/Button";
import { useDispatch } from "react-redux";
import { logout } from "../redux/reducer";
import { useSelector } from "react-redux";
import { get_auth } from "../redux/reducer";

const baseURL = "http://localhost:3030/";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setuser] = useState();
  const dispatch = useDispatch();
  const auth = useSelector(get_auth);
  const token = auth?.token;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const logindata = async (token) => {
    let data = await me(token);
    setuser(data);
    // console.log(data, 'user data');
  };

  async function me(token1) {
    return await fetch(`${baseURL}me`, {
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${token1}`,
      },
    }).then((data) => data.json());
  }

  useEffect(() => {
    logindata(token);
  }, [token]);

  if (token && user) {
    return (
      <div>
        <nav
          className="navbar fixed-top navbar-expand-lg navbar-dark"
          style={{
            backgroundImage:
              "linear-gradient( 178.6deg,  rgba(20,36,50,1) 11.8%, rgba(124,143,161,1) 83.8% )",
          }}
        >
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              BLOG
            </Link>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to={"/userhome"}
                  >
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link active"
                    to={`/userposts/${user.id}`}
                  >
                    My Posts
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" to={`/createpost`}>
                    Add Post
                  </Link>
                </li>
              </ul>
              <div className="d-flex">
                <Button
                  className="btn btn-outline-warning"
                  onClick={() => handleLogout()}
                  title="Logout"
                />
              </div>
            </div>
          </div>
        </nav>
      </div>
    );
  } else {
    return (
      <div className="mb-4">
        <nav
          className="navbar fixed-top navbar-expand-lg navbar-dark "
          style={{
            backgroundImage:
              "linear-gradient( 178.6deg,  rgba(20,36,50,1) 11.8%, rgba(124,143,161,1) 83.8% )",
          }}
        >
          <div className="container-fluid">
            <Link className="navbar-brand" to={"/"}>
              BLOG
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to={"/"}
                  >
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" to={"/registration"}>
                    Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" to={"/login"}>
                    LogIn
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}
