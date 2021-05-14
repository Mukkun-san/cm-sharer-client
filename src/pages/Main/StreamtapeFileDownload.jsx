import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_URL } from "../../store/consts.js";
import NotFound from "../NotFound/NotFound";
import Loader from "../../components/Loader";
import prettyBytes from "pretty-bytes";
import { Helmet } from "react-helmet";
import { toastWarning, toastError } from "../../Helpers/toasts";

export default function StreamtapeFileDownload() {
  let { slug } = useParams();
  const [fileInfo, setFileInfo] = useState({
    btnAction: getDownloadLink,
    btnText: "Get download link",
    btnColor: "btn-warning",
  });
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  let [waitCounter, setWaitCounter] = useState(0);

  useEffect(() => {
    axios
      .get(API_URL + "/links/fileinfo/streamtape/" + slug)
      .then((result) => {
        if (result.data.linkExists) {
          setFileInfo({ ...fileInfo, ...result.data });
          setLoading(false);
          const timer = setInterval(function () {
            if (waitCounter === 0) {
              clearInterval(timer);
            } else {
              setWaitCounter(--waitCounter);
            }
          }, 1000);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        setFileInfo(false);
      });
  }, [slug]);

  function getDownloadLink(fileInfo) {
    console.log(fileInfo);

    setBtnLoading(true);
    axios
      .post(API_URL + "/links/ddl/streamtape/", {
        fileId: fileInfo.id,
        ticket: fileInfo.ticket,
        _id: fileInfo._id,
      })
      .then((result) => {
        console.log(result);
        if (result.data.status === 200) {
          setFileInfo({
            ...fileInfo,
            btnText: "Download now",
            btnColor: "btn-success",
            btnAction: "",
            ddl: result.data.ddl,
          });
        } else {
          toastWarning(result.data.streamTapeMsg || result.data.msg);
        }
        setBtnLoading(false);
      })
      .catch((err) => {
        toastError("Could not get download link");
        setBtnLoading(false);
      });
  }

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
                ) : fileInfo ? (
                  <div className="text-center">
                    <Helmet>
                      <title>{`CM Sharer - ${fileInfo.name}`}</title>
                    </Helmet>

                    <h3>{fileInfo.name}</h3>
                    <br />

                    <div className="row">
                      <div className="col-8 mx-auto">
                        <img
                          className="img-fluid w-75"
                          src={fileInfo.thumb}
                          alt="yandex icon"
                          srcset=""
                        />
                      </div>
                    </div>
                    <span className="badge badge-danger mx-2">
                      SIZE:{" "}
                      {prettyBytes(Number(fileInfo.size) || 0, {
                        binary: true,
                      })}
                    </span>
                    <br />
                    <br />
                    <hr />
                    <a
                      href={fileInfo.ddl}
                      target="_self"
                      type="button"
                      rel="noreferrer"
                    >
                      <button
                        className={"btn btn-lg " + fileInfo.btnColor + " my-0"}
                        disabled={waitCounter > 0 || btnLoading ? true : false}
                        type="button"
                        onClick={() => {
                          fileInfo.btnAction(fileInfo);
                        }}
                      >
                        {btnLoading ? (
                          <div
                            className="d-flex justify-content-center"
                            style={{ margin: 0, padding: 0 }}
                          >
                            <div
                              className="spinner-border"
                              style={{ width: "2rem", height: "2rem" }}
                              role="status"
                            >
                              <span className="sr-only">Loading...</span>
                            </div>
                            <p className="py-0 my-0 ml-3">
                              Getting Download Link...
                            </p>
                          </div>
                        ) : waitCounter > 0 ? (
                          `Please wait ${waitCounter} secs...`
                        ) : (
                          fileInfo.btnText
                        )}
                      </button>
                    </a>
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
