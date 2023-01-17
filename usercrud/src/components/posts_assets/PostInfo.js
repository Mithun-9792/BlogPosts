import React from "react";

export default function PostInfo(props) {
  const { title, name, date, description, updateddate, postimage } = props;
  const baseURL = "http://localhost:3030/";
  // console.log(postimage);
  return (
    <>
      <div id="postview">
        <h5 className="card-title"> {title} </h5>
        <p className="card-text">
          <b> {name} </b> created this post at {new Date(date).toDateString()}
        </p>
        <p className="card-text">
          <b> UpdatedAt </b> {new Date(updateddate).toDateString()}
        </p>
        {postimage ? (
          <img
            className="card-title"
            style={{ width: "40rem", height: "25rem" }}
            src={`${baseURL}${postimage}`}
            alt="postimage"
          />
        ) : (
          ""
        )}
        <p
          className="card-text my-2"
          dangerouslySetInnerHTML={{ __html: description }}
        ></p>
      </div>
    </>
  );
}
