import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, ADMIN_TOKEN } from "../../../store/consts";
import Loader from "../../../components/Loader";
import {
  toastError,
  toastWarning,
  toastSuccess,
} from "../../../Helpers/toasts";
import { Helmet } from "react-helmet";

export default function Account() {
  const [admin, setAdmin] = useState({
    email: window.localStorage.getItem("admin"),
  });

  const emptyInfo = {
    username: "",
    oldPassw: "",
    newPassw: "",
    newPassw2: "",
  };
  const [updateInfo, setUpdateInfo] = useState(emptyInfo);

  useEffect(() => {
    axios
      .post(
        API_URL + "/admin/getProfile",
        { email: admin.email },
        { headers: { authorization: ADMIN_TOKEN } }
      )
      .then((res) => {
        setAdmin(res.data);
      })
      .catch((err) => {});
  }, []);

  async function updateUsername() {
    let res = await axios.post(
      API_URL + "/admin/update/username",
      {
        email: admin.email,
        username: updateInfo.username,
      },
      { headers: { authorization: ADMIN_TOKEN } }
    );
    console.log(res);
    if (res.data === "OK") {
      setAdmin({ ...admin, username: updateInfo.username });
      toastSuccess("Username updated to '" + updateInfo.username + "'");
    } else {
      toastWarning(
        <p className="mx-auto" style={{ color: "black" }}>
          {res.data.error}
        </p>,
        "bottom-right"
      );
    }
    setUpdateInfo({ ...updateInfo, username: "" });
  }
  async function updatePassword() {
    if (validForm()) {
      await axios
        .post(
          API_URL + "/admin/update/password",
          {
            email: admin.email,
            oldPassw: updateInfo.oldPassw,
            newPassw: updateInfo.newPassw,
          },
          { headers: { authorization: ADMIN_TOKEN } }
        )
        .then((res) => {
          if (res.data.error) {
            toastError(res.data.error);
          } else if (res.data === "OK") {
            toastSuccess("Password Was Updated", "bottom-right");
            setUpdateInfo(emptyInfo);
          } else {
            toastError("Internal Server Error", "bottom-right");
          }
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    function validForm() {
      if (!updateInfo.oldPassw) {
        toastWarning(
          <p className="mx-auto" style={{ color: "black" }}>
            Enter your current password.
          </p>,
          "bottom-right"
        );
        return false;
      } else if (!updateInfo.newPassw) {
        toastWarning(
          <p className="mx-auto" style={{ color: "black" }}>
            Enter your New Password.
          </p>,
          "bottom-right"
        );
        return false;
      } else if (updateInfo.newPassw.length < 5) {
        toastWarning(
          <p className="mx-auto" style={{ color: "black" }}>
            Password must have at least 5 chars.
          </p>,
          "bottom-right"
        );
        return false;
      } else if (!updateInfo.newPassw2) {
        toastWarning(
          <p className="mx-auto" style={{ color: "black" }}>
            Confirm New Password
          </p>,
          "bottom-right"
        );
        return false;
      } else if (updateInfo.newPassw !== updateInfo.newPassw2) {
        toastWarning(
          <p className="mx-auto" style={{ color: "black" }}>
            Passwords Don't match.
          </p>,
          "bottom-right"
        );
        return false;
      }
      return true;
    }
  }

  const AddNewAdmin = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setmessage] = useState("");
    const [pass1, setPass1] = useState("");
    const [pass2, setPass2] = useState("");

    async function createAdmin() {
      if (pass1 === pass2) {
        setLoading(true);
        try {
          let res = await axios.post(
            API_URL + "/admin/addaccount",
            {
              email,
              password: pass1,
            },
            { headers: { authorization: ADMIN_TOKEN } }
          );
          alert(res.data.message);
        } catch (error) {
          setLoading(false);
        }
      } else {
        setmessage("Passwords don't match.");
        setTimeout(() => {
          setmessage("");
        }, 1500);
      }
    }
    return (
      <div className="d-flex justify-content-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createAdmin();
          }}
        >
          <div className="mx-auto form-group">
            <h3 className="mx-auto text-info"> Add new admin</h3>
            <br />

            <label>Email</label>
            <input
              required
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <label>Password</label>
            <input
              required
              type="text"
              className="form-control"
              value={pass1}
              onChange={(e) => {
                setPass1(e.target.value);
              }}
            />
            <label>Confirm Password</label>
            <input
              required
              type="text"
              className="form-control"
              value={pass2}
              onChange={(e) => {
                setPass2(e.target.value);
              }}
            />
          </div>
          <button type="submit" className="btn btn-warning d-flex mx-auto px-5">
            Create new admin
          </button>
          <br />
          <p className="text-warning mx-auto"> {message} </p>
        </form>
      </div>
    );
  };
  return (
    <div>
      <Helmet>
        <title>Dashboard - Account</title>
      </Helmet>
      {admin && admin._id ? (
        <div className="card bg-light mx-auto w-75">
          <div className="card-header">
            <h1 className="text-center">Account Details</h1>
          </div>
          <div className="text-center mt-3">
            <h4 className="font-weight-normal">
              Email: <small>{admin.email}</small>
            </h4>
            <h4 className="font-weight-normal">
              Username: <small>{admin.username}</small>
            </h4>
          </div>
          <div className="card-body d-flex justify-content-center">
            <div style={{ width: "80%" }}>
              <div className="card">
                <div className="card-body">
                  <br />
                  <h3>Update Information</h3>
                  <br />
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      updateUsername();
                    }}
                  >
                    <label>Username</label>
                    <input
                      type="text"
                      className="form-control"
                      value={updateInfo.username}
                      onChange={(e) => {
                        console.log(e.target.value);
                        setUpdateInfo({
                          ...updateInfo,
                          username: e.target.value,
                        });
                      }}
                    />
                    <br />
                    <button
                      type="submit"
                      className="btn btn-warning d-flex mx-auto px-5"
                    >
                      Update Username
                    </button>
                  </form>
                  <br />
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      updatePassword();
                    }}
                  >
                    <div className="form-group">
                      <label>Current Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={updateInfo.oldPassw}
                        onChange={(e) =>
                          setUpdateInfo({
                            ...updateInfo,
                            oldPassw: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={updateInfo.newPassw}
                        onChange={(e) =>
                          setUpdateInfo({
                            ...updateInfo,
                            newPassw: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={updateInfo.newPassw2}
                        onChange={(e) =>
                          setUpdateInfo({
                            ...updateInfo,
                            newPassw2: e.target.value,
                          })
                        }
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-warning d-flex mx-auto px-5"
                    >
                      Update Password
                    </button>
                  </form>
                </div>
              </div>
              {admin && admin.role == "super" ? (
                <div className="card mt-3 pt-5">
                  <AddNewAdmin />
                </div>
              ) : null}
            </div>
          </div>
          <div className="text-center card-footer text-muted">
            {admin && admin.addedOn ? (
              <p className="card-text">
                Joined on: {admin.addedOn.toString().substring(0, 10)} at{" "}
                {admin.addedOn.toString().substring(11, 19)}
              </p>
            ) : null}
          </div>
        </div>
      ) : (
        <Loader color="warning" />
      )}
    </div>
  );
}
