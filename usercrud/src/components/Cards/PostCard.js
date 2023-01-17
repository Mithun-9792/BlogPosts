import React from "react";
import Button from "../posts_assets/Button";

export default function PostCard(props) {
  const { title, created_at, description, onClick, buttonTitle, updated_at } =
    props;

  return (
    <>
      <div
        className="card p-2"
        style={{
          width: "20rem",
          height: "26rem",
          backgroundImage: "linear-gradient(350deg, #a1c4fd 0%, #c2e9fb 100%)",
          marginLeft: "5.2rem",
        }}
      >
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">
            Created at <b>{new Date(created_at).toDateString()}</b>{" "}
          </p>
          <p className="card-text">
            Updated at <b>{new Date(updated_at).toDateString()}</b>{" "}
          </p>
          <p
            className="card-text "
            style={{
              display: "-webkit-box",
              WebkitLineClamp: "7",
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
            }}
            dangerouslySetInnerHTML={{
              __html: description,
            }}
          ></p>
        </div>
        <div>
          <Button
            className="btn btn-info"
            title={buttonTitle}
            onClick={onClick}
          />
        </div>
      </div>
    </>
  );
}
