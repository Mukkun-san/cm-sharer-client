import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL, ADMIN_TOKEN } from "../../store/consts.js";
import Loader from "../../components/Loader";
import { toastError, toastSuccess } from "../../Helpers/toasts";
import { Helmet } from "react-helmet";

export default function Users() {
  const [users, setUsers] = useState(null);
  const [admins, setAdmins] = useState(null);
  const [showUsers, setShowUsers] = useState(true);

  useEffect(() => {
    axios
      .get(API_URL + "/users/all", {
        headers: { authorization: ADMIN_TOKEN },
      })
      .then((res) => {
        setUsers(res.data.users);
      })
      .catch((err) => {});
    axios
      .get(API_URL + "/admin/all", {
        headers: { authorization: ADMIN_TOKEN },
      })
      .then((res) => {
        setAdmins(res.data.admins);
      })
      .catch((err) => {});
  }, []);

  function removeUser(_id) {
    axios
      .delete(API_URL + "/users/" + _id, {
        headers: { authorization: ADMIN_TOKEN },
      })
      .then((result) => {
        setUsers(users.filter((user) => user._id !== _id));
        toastSuccess("User was successfully removed");
      })
      .catch((err) => {
        toastError("User could not be removed");
      });
  }
  function removeAdmin(_id) {
    axios
      .delete(API_URL + "/admin/" + _id, {
        headers: { authorization: ADMIN_TOKEN },
      })
      .then((result) => {
        setAdmins(admins.filter((admin) => admin._id !== _id));
        toastSuccess("Admin was successfully removed");
      })
      .catch((err) => {
        toastError("Admin could not be removed");
      });
  }
  console.log(users, admins);
  return (
    <div>
      <Helmet>
        <title>Dashboard - Users</title>
      </Helmet>
      <br />
      <br />
      <div className="row col-12">
        <button
          className="btn btn-dark mx-auto"
          onClick={() => {
            setShowUsers(!showUsers);
          }}
        >
          {showUsers ? "Show Admins" : "Show Users"}
        </button>
      </div>
      <br />
      {users === null || admins == null ? (
        <div className="col d-flex justify-content-center">
          <Loader color="warning" />
        </div>
      ) : showUsers ? (
        users.length ? (
          <div className="row mx-5">
            <div className="col">
              <table className="table table-hover">
                <thead className="thead-dark">
                  <tr>
                    <th className="text-center border border-light m-2">#</th>
                    <th className="text-center border border-light m-2">
                      Username
                    </th>
                    <th className="text-center border border-light m-2">
                      Email
                    </th>
                    <th className="text-center border border-light m-2">
                      Joined on Date
                    </th>
                    <th className="text-center border border-light m-2">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, i) => {
                    return (
                      <tr key={user.guid}>
                        <td className="bg-light">{i + 1}</td>
                        <td className="bg-light">
                          <img
                            className="my-auto mr-3"
                            style={{
                              verticalAlign: "middle",
                              width: "50px",
                              height: "50px",
                              borderRadius: "50%",
                            }}
                            src={user.picture}
                            alt=""
                          />
                          <p className="my-auto d-inline">{user.username} </p>
                        </td>
                        <td className="bg-light">{user.email}</td>
                        <td className="bg-light">
                          {user.joinedOn.toString().substring(0, 10)} at{" "}
                          {user.joinedOn.toString().substring(11, 16)}
                        </td>
                        <td className="bg-light">
                          {/* <button type="reset" className="btn btn-sm btn-dark">
                            Blacklist
                          </button> */}
                          <button
                            value={user._id}
                            type="button"
                            className="btn btn-sm ml-2 btn-danger"
                            onClick={(e) => removeUser(e.target.value)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <h1 className="text-danger text-center">No users found.</h1>
        )
      ) : admins.length ? (
        <div className="row mx-5">
          <div className="col">
            <table className="table table-hover">
              <thead className="thead-dark">
                <tr>
                  <th className="text-center border border-light m-2">#</th>
                  <th className="text-center border border-light m-2">Email</th>
                  <th className="text-center border border-light m-2">
                    Added on Date
                  </th>
                  <th className="text-center border border-light m-2">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin, i) => {
                  return (
                    <tr key={admin.guid}>
                      <td className="bg-light">{i + 1}</td>
                      <td className="bg-light">{admin.email}</td>
                      <td className="bg-light">
                        {admin.addedOn.toString().substring(0, 10)} at{" "}
                        {admin.addedOn.toString().substring(11, 16)}
                      </td>
                      <td className="bg-light">
                        {admin.role === "super" &&
                        window.localStorage.getItem("admin") === admin.email ? (
                          ""
                        ) : (
                          <button
                            value={admin._id}
                            type="button"
                            className="btn btn-sm ml-2 btn-danger"
                            onClick={(e) => removeAdmin(e.target.value)}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <h1 className="text-danger text-center">No admins found.</h1>
      )}
    </div>
  );
}
