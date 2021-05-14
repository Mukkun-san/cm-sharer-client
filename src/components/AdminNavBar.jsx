import React from "react";
import { Link } from "react-router-dom";

export default function AdminNavBar({ adminIsLoggedin }) {
  return (
    <div>
      <nav className="navbar navbar-dark bg-dark navbar-expand-xl">
        <i className="mr-5"></i>
        <Link className="navbar-brand" to="/admin/dashboard">
          <h2 className="text-warning">CM Admin</h2>
        </Link>

        {adminIsLoggedin ? (
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
        ) : null}

        {adminIsLoggedin ? (
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              <li className="my-auto ml-4">
                <Link className="btn btn-link" to="/admin/dashboard/users">
                  <img src="https://img.icons8.com/material-rounded/26/ffffff/user-group-man-woman.png" />{" "}
                  <h5
                    className="font-weight-normal text-white mt-1"
                    style={{ fontSize: "1rem" }}
                  >
                    Users
                  </h5>
                </Link>
              </li>
              <li className="my-auto ml-4">
                <Link
                  className="btn btn-link"
                  to="/admin/dashboard/links/drive"
                >
                  <img src="https://img.icons8.com/android/26/ffffff/google-drive.png" />
                  <h5
                    className="font-weight-normal text-white mt-1"
                    style={{ fontSize: "1rem" }}
                  >
                    GDrive
                  </h5>
                </Link>
              </li>
              <li className="my-auto ml-4">
                <Link
                  className="btn btn-link"
                  to="/admin/dashboard/links/opendrive"
                >
                  <img src="https://img.icons8.com/ios-filled/26/ffffff/o.png" />
                  <h5
                    className="font-weight-normal text-white mt-1"
                    style={{ fontSize: "1rem" }}
                  >
                    OpenDrive
                  </h5>
                </Link>
              </li>
              <li className="my-auto ml-4">
                <Link
                  className="btn btn-link"
                  to="/admin/dashboard/links/yandex"
                >
                  <img src="https://img.icons8.com/windows/26/ffffff/yandex-international.png" />
                  <h5
                    className="font-weight-normal text-white mt-1"
                    style={{ fontSize: "1rem" }}
                  >
                    Yandex
                  </h5>
                </Link>
              </li>
              <li className="my-auto ml-4">
                <Link
                  className="btn btn-link"
                  to="/admin/dashboard/links/streamtape"
                >
                  <img
                    src={require("../assets/Logo_streamtape_white.png")}
                    alt=""
                    style={{ width: "32px" }}
                  />
                  <h5
                    className="font-weight-normal text-white mt-1"
                    style={{ fontSize: "1rem" }}
                  >
                    StreamTape
                  </h5>
                </Link>
              </li>
              <li className="my-auto ml-4">
                <Link className="btn btn-link" to="/admin/add-links">
                  <img src="https://img.icons8.com/fluent-systems-filled/26/ffffff/link.png" />
                  <h5
                    className="font-weight-normal text-white mt-1"
                    style={{ fontSize: "1rem" }}
                  >
                    Generator
                  </h5>
                </Link>
              </li>
              <li className="my-auto ml-4">
                <Link className="btn btn-link my-auto" to="/admin/account">
                  <img
                    alt="logout"
                    src="https://img.icons8.com/material-outlined/26/ffffff/guest-male.png"
                  ></img>
                  <h5
                    className="font-weight-normal text-white mt-1"
                    style={{ fontSize: "1rem" }}
                  >
                    Account
                  </h5>
                </Link>
              </li>
              <li className="my-auto ml-4">
                <div
                  className="mr-5 btn btn-link my-auto"
                  onClick={() => {
                    window.localStorage.removeItem("adminToken");
                    window.localStorage.removeItem("admin");
                    window.location.reload();
                  }}
                >
                  <img
                    alt="logout"
                    src="https://img.icons8.com/material-outlined/26/ffffff/lock-2.png"
                  ></img>
                  <h5
                    className="font-weight-normal text-white mt-1 ml-1"
                    style={{ fontSize: "1rem" }}
                  >
                    Logout
                  </h5>
                </div>
              </li>
            </ul>
          </div>
        ) : null}
      </nav>
    </div>
  );
}
