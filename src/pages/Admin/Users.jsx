import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL, ADMIN_TOKEN } from "../../store/consts.js";
import Loader from "../../components/Loader";
import { toastError, toastSuccess } from "../../Helpers/toasts";
import { Helmet } from "react-helmet";

export default function Users() {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    axios
      .get(API_URL + "/users/getAll", {
        headers: { authorization: ADMIN_TOKEN },
      })
      .then((res) => {
        setUsers(res.data.users);
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

  return (
    <div>
      <Helmet>
        <title>Dashboard - Users</title>
      </Helmet>
      <br />
      <br />
      {users ? (
        <div className="row mx-5">
          <div className="col">
            <table className="table table-hover">
              <thead className="thead-dark">
                <tr>
                  <th className="text-center border border-light m-2">#</th>
                  <th className="text-center border border-light m-2">
                    Username
                  </th>
                  <th className="text-center border border-light m-2">Email</th>
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
                        {user.joinedOn.toString().substring(11, 19)}
                      </td>
                      <td className="bg-light">
                        <button type="reset" className="btn btn-sm btn-dark">
                          Blacklist
                        </button>
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
        <div className="col d-flex justify-content-center">
          <Loader color="warning" />
        </div>
      )}
    </div>
  );
}
