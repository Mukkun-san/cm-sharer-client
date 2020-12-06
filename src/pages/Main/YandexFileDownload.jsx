import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_URL } from "../../store/consts.js";
import NotFound from "../NotFound/NotFound";
import Loader from "../../components/Loader";
import prettyBytes from "pretty-bytes";
import { Helmet } from "react-helmet";

export default function YandexFileDownload() {
  let { slug } = useParams();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  let [ddlWait, setDdlWait] = useState(3);
  const [limitReached, setLimitReached] = useState(false);
  const [previewImgCompatible, setPreviewImgCompatible] = useState(true);

  function download() {
    axios.post(API_URL + "/links/download", {
      ...file,
      userId: window.gapi.auth2.getAuthInstance().currentUser.get()
        ? window.gapi.auth2
            .getAuthInstance()
            .currentUser.get()
            .getBasicProfile()
            .getId()
        : null,
    });
  }

  useEffect(() => {
    axios
      .get(API_URL + "/links/yandex/" + slug)
      .then((result1) => {
        if (result1.data.linkExists) {
          axios
            .get(
              "https://cloud-api.yandex.net/v1/disk/public/resources?preview_size=XL&public_key=" +
                result1.data.public_key
            )
            .then(async (result) => {
              return { ...result1.data, ...result.data };
            })
            .then((file) => {
              console.log(file);
              setFile(file);
              setLoading(false);
              setDdlWait(ddlWait--);
              const timer = setInterval(() => {
                if (ddlWait < 0) {
                  clearInterval(timer);
                } else {
                  setDdlWait(ddlWait--);
                }
              }, 1000);
            })
            .catch((err) => {
              setFile(result1.data);
              setLimitReached(true);
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        setFile(false);
      });
  }, [slug]);
  return (
    <div>
      <div className="container bg-light w-100 h-100">
        <div className="row">
          <div className="col-11 mx-auto">
            <div className="card card-signin my-5">
              <div className="card-body">
                {loading ? (
                  <div className="col d-flex justify-content-center">
                    <Loader color="warning" />
                  </div>
                ) : file ? (
                  <div className="text-center">
                    <Helmet>
                      <title>CM Sharer - {file.name || file.fileName}</title>
                    </Helmet>
                    <h3>{file.name || file.fileName}</h3>
                    <span className="badge badge-danger mx-2">
                      SIZE:{" "}
                      {prettyBytes(Number(file.size) || 0, { binary: true })}
                    </span>
                    <span className="badge badge-warning mx-2">
                      TYPE: {file.media_type || file.fileType}
                    </span>
                    <br />
                    {previewImgCompatible ? (
                      file.preview ? (
                        <img
                          crossorigin="anonymous"
                          src={file.preview}
                          alt=""
                          className="card my-2 w-50 mx-auto"
                          onLoad={(e) => {
                            if (!e.target.naturalHeight)
                              setPreviewImgCompatible(false);
                          }}
                          onError={(e) => {
                            console.log("error", e);
                          }}
                        />
                      ) : (
                        <img
                          src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/movie-alt2-512.png"
                          alt=""
                          className="w-25"
                        />
                      )
                    ) : (
                      <img
                        src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/movie-alt2-512.png"
                        alt=""
                        className="w-25"
                      />
                    )}
                    <br />
                    <hr />
                    {limitReached ? (
                      <button
                        className="btn btn-warning disabled"
                        disabled={true}
                      >
                        Download is currently unavailable.
                      </button>
                    ) : (
                      <a
                        href={file.file}
                        target="_self"
                        type="button"
                        rel="noreferrer"
                      >
                        <button
                          className="btn btn-lg btn-warning my-0"
                          disabled={ddlWait > 0 ? true : false}
                          type="button"
                          onClick={download}
                        >
                          {ddlWait > 0
                            ? `Please wait ${ddlWait} secs...`
                            : "Download"}
                        </button>
                      </a>
                    )}
                  </div>
                ) : (
                  <NotFound />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
