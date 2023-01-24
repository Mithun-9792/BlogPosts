import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import Button from "./posts_assets/Button";
import Comments from "./posts_assets/Comments";
import PostInfo from "./posts_assets/PostInfo";
import { useSelector } from "react-redux";
import { get_auth } from "../redux/reducer";

const baseURL = "http://localhost:3030/";

export default function UserPosts() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setpost] = useState([]);
  const auth = useSelector(get_auth);
  const token = auth?.token;

  const logindata = async (token) => {
    let data = await me(token);
    setpost(data);
  };

  async function me(token1) {
    return await fetch(`${baseURL}me/${id}`, {
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${token1}`,
      },
    }).then((data) => data.json());
  }

  //Delete Post
  const deletepost = (id) => {
    fetch(`${baseURL}posts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((data) => {
      console.log(data);
    });
    setpost(
      post.filter((post) => {
        // console.log(post.id);
        return post.id !== id;
      })
    );
    // toast.error("Deleted Successfully!")
    swal("Deleted", "Post Deleted", "error");
  };

  useEffect(() => {
    logindata(token);
  }, [token]);

  if (!post) return null;
  return (
    <div
      className="border border-warning"
      style={{
        background: "rgb(2,0,36)",
        backgroundImage:
          "linear-gradient(200deg, rgba(2,0,36,1) 0%, rgba(9,85,121,1) 35%, rgba(0,212,255,1) 100%)",
        color: "white",
        marginTop: "3.5rem",
      }}
    >
      {post.map((p) => {
        return (
          <div key={p.id} className="d-flex justify-content-center ">
            <div className="d-inline-flex" style={{ width: "40rem" }}>
              <div className="card-body p-2">
                <PostInfo
                  title={p.title}
                  name={p.name}
                  date={p.created_at}
                  description={p.description}
                  updateddate={p.updated_at}
                  postimage={p.image}
                />
                <Comments postId={p.id} authorID={p.author_id} />
                <Button
                  className="btn btn-warning btn-md"
                  onClick={() => {
                    navigate(`/updateposts/${p.slug}`);
                  }}
                  title={"Update Post"}
                />
                <Button
                  className="btn btn-danger btn-md mx-3"
                  onClick={() => {
                    deletepost(p.id);
                  }}
                  title={"Delete Post"}
                />
                <hr className="mx-n3" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
