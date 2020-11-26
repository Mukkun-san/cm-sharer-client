import React from "react";

function DashboardCard({ icon, title, count }) {
  return (
    <div className="card text-center p-4 bg-light">
      <div className="card-content">
        <img
          style={{ opacity: 0.85 }}
          src={"https://img.icons8.com/material-outlined/35/000000/" + icon}
          alt=""
        />
        <span className="card-title">
          <h4 className="mt-3">{title}</h4>
        </span>
        <h4>{count}</h4>
      </div>
    </div>
  );
}

function LinkLoader() {
  return (
    <div className="spinner-border" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export { DashboardCard, LinkLoader };
