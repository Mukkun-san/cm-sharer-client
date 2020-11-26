import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../store/consts.js";
import { Helmet } from "react-helmet";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  async function Login() {
    setLoading(true);
    let res = await axios.post(API_URL + "/admin/login", {
      email,
      password,
    });
    if (res.data.authorized) {
      window.localStorage.setItem("adminToken", res.data.accessToken);
      window.localStorage.setItem("admin", email);
      window.location.reload();
    }
    setLoading(false);
    setMessage(res.data.message);
    setTimeout(() => {
      setMessage("");
    }, 2000);
  }
  return (
    <div>
      <Helmet>
        <title>Admin - Login</title>
      </Helmet>
      <div className="card w-50 bg-light mx-auto mt-5 pt-5">
        <div className="card-header">
          <h1 className="text-center">Admin Login</h1>
        </div>
        <div className=" d-flex justify-content-center">
          <div className="card-body col-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                Login();
              }}
            >
              <div className="form-group">
                <label>Email</label>
                <input
                  required
                  type="email"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
                <small id="emailHelp" className="form-text text-muted"></small>
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  required
                  type="password"
                  className="form-control"
                  id="exampleInputPassword1"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>

              <div className="d-flex justify-content-center">
                {!loading ? (
                  <button type="submit" className="btn btn-primary px-5">
                    Login
                  </button>
                ) : (
                  <button disabled className="btn bg-light px-5">
                    Login
                  </button>
                )}
              </div>

              {message ? (
                <p className="my-3 alert-danger badge-danger text-center p-2">
                  {message}
                </p>
              ) : null}
            </form>
          </div>
        </div>
        <div className="card-footer text-muted"></div>
      </div>
    </div>
  );
}
