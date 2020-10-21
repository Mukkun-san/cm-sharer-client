import React, { useState, useEffect } from "react";
import authenticate from "../Helpers/authenticate";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config";
import Loader from "../../../components/Loader";

export default function Users() {
  const history = useHistory();
  const [users, setUsers] = useState(null);

  useEffect(() => {
    authenticate(history);
    axios
      .get(API_URL + "/users/getAll")
      .then((res) => {
        setTimeout(() => {
          setUsers(res.data.users);
        }, 750);
      })
      .catch((err) => {
      });
  }, []);

  return (
    <div>
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
                    Picture
                  </th>
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
                    <tr>
                      <td className="bg-light">{i + 1}</td>
                      <td className="bg-light">
                        <img src={user.picture} alt="" />
                      </td>
                      <td className="bg-light">{user.username}</td>
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
                          type="reset"
                          className="btn btn-sm ml-2 btn-danger">
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