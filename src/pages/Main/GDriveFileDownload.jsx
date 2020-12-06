import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_URL, DRIVE_FOLDER_NAME } from "../../store/consts.js";
import NotFound from "../NotFound/NotFound";
import Loader from "../../components/Loader";
import prettyBytes from "pretty-bytes";
import { Helmet } from "react-helmet";

export default function GDriveFileDownload({ user, handleAuthClick }) {
  let { slug } = useParams();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  let [ddlWait, setDdlWait] = useState(5);
  const [driveInfo, setDriveInfo] = useState(null);

  useEffect(() => {
    setLoading(true);
    if (slug) {
      getFile();
    }
    async function getFile() {
      axios
        .get(API_URL + "/links/gdrive/" + slug)
        .then((res) => {
          if (res.data.linkExists) {
            window.gapi.client.drive.files
              .get({
                fileId: res.data.fileId,
                fields: "id, name, size, mimeType, hasThumbnail,thumbnailLink",
              })
              .then((drive) => {
                setFile({ ...drive.result, ...res.data });
                var request = window.gapi.client.drive.about.get({
                  fields: "storageQuota",
                });
                request.execute(function (resp) {
                  setDriveInfo(resp.storageQuota);
                  setLoading(false);
                  setDdlWait(ddlWait--);
                  const timer = setInterval(() => {
                    if (ddlWait < 0) {
                      clearInterval(timer);
                    } else {
                      setDdlWait(ddlWait--);
                    }
                  }, 1000);
                });
              })
              .catch((error) => {
                setFile(false);
                setLoading(false);
              });
          } else {
            setFile(false);
            setLoading(false);
          }
        })
        .catch((err) => {
          setFile(false);
          setLoading(false);
        });
    }
  }, [slug]);

  function DownloadFile() {
    function DownloadBtn({ downloading }) {
      if (downloading) {
        return (
          <button
            disabled
            className="btn btn-info d-flex"
            onClick={() => download()}
          >
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <div className="d-inline ml-3">Downloading...</div>
          </button>
        );
      }
      return (
        <button
          className="btn btn-info"
          onClick={() => download()}
          disabled={ddlWait > 0 ? true : false}
        >
          {ddlWait > 0 ? (
            `Please wait ${ddlWait} secs...`
          ) : (
            <p className="p-0 m-0">
              <i className="fa fa-download mr-3"></i>
              Download Now{" "}
            </p>
          )}
        </button>
      );
    }

    function download() {
      async function ddl(folderId) {
        try {
          let response = await window.gapi.client.drive.files.copy({
            fileId: file.fileId,
            fields: "parents, id",
          });
          const previousParents = response.result.parents.join(",");
          response = await window.gapi.client.drive.files.update({
            fileId: response.result.id,
            addParents: folderId,
            removeParents: previousParents,
            fields: "id, parents",
          });
          await window.gapi.client.drive.permissions.create({
            resource: { role: "reader", type: "anyone" },
            fileId: response.result.id,
          });
          // const geoBytes = await axios.get(
          //   "http://gd.geobytes.com/GetCityDetails"
          // );
          // console.log(geoBytes);
          await axios.post(API_URL + "/links/download", {
            ...file,
            userId: window.gapi.auth2
              .getAuthInstance()
              .currentUser.get()
              .getBasicProfile()
              .getId(),
          });
          document.getElementById("DDL").href =
            "https://drive.google.com/uc?export=download&id=" +
            response.result.id;
          console.log(
            "file available at : https://drive.google.com/uc?export=download&id=" +
              response.result.id
          );
          document.getElementById("DDL").click();
          setDownloading(false);
        } catch (error) {
          setDownloading(false);
        }
      }
      setDownloading(true);
      window.gapi.client.drive.files
        .list({
          q: `mimeType='application/vnd.google-apps.folder' and name='${DRIVE_FOLDER_NAME}'`,
          fields: "nextPageToken, files(id, name, trashed)",
        })
        .then((resp) => {
          if (resp.result.files.length && !resp.result.files[0].trashed) {
            const folderId = resp.result.files[0].id;
            ddl(folderId);
          } else {
            const folderMetadata = {
              name: DRIVE_FOLDER_NAME,
              mimeType: "application/vnd.google-apps.folder",
              folderColorRgb: "#ff7537",
            };
            window.gapi.client.drive.files
              .create({
                resource: folderMetadata,
                fields: "id",
              })
              .then((resp) => {
                const folderId = resp.result.id;
                ddl(folderId);
              })
              .catch((err) => {
                setDownloading(false);
              });
          }
        })
        .catch((err) => {
          setDownloading(false);
        });
    }
    return (
      <div className="row">
        <div className="col text-center">
          <div className="d-flex justify-content-center">
            <DownloadBtn downloading={downloading} />
          </div>
        </div>
      </div>
    );
  }

  function LoginToDownload() {
    return (
      <div className="row">
        <div className="col text-center">
          <h5 className="text-info font-weight-light">
            Just Login to your Google Drive to download this file.
          </h5>
          <div
            className="d-flex justify-content-center d-inline"
            onClick={() => {
              handleAuthClick();
            }}
          >
            <div className="w-auto pr-5 pl-5 d-flex btn btn-light">
              <img
                style={{ height: "2.5rem" }}
                alt=""
                src="https://img.icons8.com/plasticine/100/000000/google-logo.png"
              />
              <p className="ml-4 mt-2">Login With Google</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="container bg-light w-100 h-100">
        <div className="row">
          <div className="col-12 col-md-8 mx-auto">
            <div className="card card-signin my-5">
              <div className="card-body">
                {loading || file === null || !user ? (
                  <div className="col d-flex justify-content-center">
                    <Loader color="warning" />
                  </div>
                ) : file ? (
                  <div className="text-center">
                    <Helmet>
                      <title>CM Sharer - {file.name}</title>
                    </Helmet>
                    <h3 className="card-title font-weight-regular">
                      {file.name}
                    </h3>
                    <span className="badge badge-danger mx-2">
                      Size:{" "}
                      {prettyBytes(Number(file.size) || 0, { binary: true })}
                    </span>
                    <span className="badge badge-warning">
                      Type: {file.mimeType}
                    </span>
                    <br /> <br />
                    {!(user && user.getBasicProfile()) ? (
                      <LoginToDownload />
                    ) : (
                      <DownloadFile />
                    )}
                    <div className="col mt-5 d-flex justify-content-center">
                      <img
                        style={{ width: file.hasThumbnail ? "50%" : "15%" }}
                        src={
                          file.hasThumbnail
                            ? file.thumbnailLink
                            : "https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png"
                        }
                        alt="Google_Drive_logo"
                      />
                    </div>
                    <hr />
                    {driveInfo ? (
                      <div id="driveInfo">
                        <p className="float-left p-0 m-0 font-smaller">
                          Free Space:{" "}
                          {prettyBytes(
                            Number(driveInfo.limit) - Number(driveInfo.usage)
                          )}
                        </p>
                        <div
                          className="progress"
                          style={{ width: "100%", height: "18px" }}
                        >
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{
                              width:
                                Math.floor(
                                  (Number(driveInfo.usage) /
                                    Number(driveInfo.limit)) *
                                    100
                                ) + "%",
                              height: "18px",
                            }}
                          >
                            {/* {prettyBytes(Number(driveInfo.usage))} used */}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <NotFound />
                )}
                <a href="" id="DDL" style={{ visibility: "hidden", height: 0 }}>
                  download link placeholder
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
