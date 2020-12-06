import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL, ADMIN_TOKEN } from "../store/consts.js";

export default function NavBar({ currentUser }) {
  function handleSignout() {
    window.gapi.auth2.getAuthInstance().signOut();
    window.location.reload();
  }
  function handleAuthClick() {
    window.gapi.auth2
      .getAuthInstance()
      .signIn()
      .then(async (user) => {
        let userdata = {
          uid: user.getBasicProfile().getId(),
          username: user.getBasicProfile().getName(),
          email: user.getBasicProfile().getEmail(),
          picture: user.getBasicProfile().getImageUrl(),
        };
        await axios.post(API_URL + "/users/addOne", userdata, {
          headers: { authorization: ADMIN_TOKEN },
        });
        window.location.reload();
      })
      .catch((err) => {});
  }

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark navbar-expand-xl">
        <i className="mr-5"></i>
        <Link className="navbar-brand" to="/">
          <h2>CM Sharer</h2>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item ml-3">
              <Link className="nav-link" to="/page/terms-conditions">
                Terms & Conditions
              </Link>
            </li>
            <li className="nav-item ml-3">
              <Link className="nav-link" to="/page/privacy-policy">
                Privacy Policy
              </Link>
            </li>
            <li className="nav-item ml-3">
              <Link className="nav-link" to="/page/dmca">
                DMCA
              </Link>
            </li>
            <li className="nav-item ml-3">
              <Link className="nav-link" to="/page/contact">
                Contact
              </Link>
            </li>
            {currentUser && currentUser.getBasicProfile() ? (
              <>
                <li className="nav-item ml-3">
                  <Link className="nav-link" to="/page/account">
                    Account
                  </Link>
                </li>
                <i className="mr-5"></i>
                <button
                  className="btn btn-sm btn-outline-secondary ml-2 active"
                  type="button"
                  onClick={() => {
                    handleSignout();
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <div>
                <i className="mr-5"></i>
                <button
                  className="btn btn-sm btn-outline-secondary ml-2 px-3 py-2 active"
                  type="button"
                  onClick={() => {
                    handleAuthClick();
                  }}
                >
                  Login
                </button>
              </div>
            )}
            <i className="mr-5"></i>
          </ul>
        </div>
      </nav>
    </div>
  );
}
