import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostInfo from "./posts_assets/PostInfo";
import Comments from "./posts_assets/Comments";
import AddComment from "./posts_assets/AddComment";
import Button from "./posts_assets/Button";
import swal from "sweetalert";
import { useSelector } from "react-redux";
import { get_auth } from "../redux/reducer";

const baseURL = "http://localhost:3030/";
export default function PostView() {
  const [posts, setPosts] = useState(null);
  const [user, setUser] = useState();
  const [addedCommentToken, setAddedCommentToken] = useState("");
  const auth = useSelector(get_auth);
  const { slug } = useParams();
  const navigate = useNavigate();
  const token = auth?.token;

  const fetchingPost = async () => {
    await fetch(`${baseURL}posts/${slug}`)
      .then((data) => data.json())
      .then((data) => {
        setPosts(data);
      });
  };
  const userdata = async () => {
    await fetch(`${baseURL}me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((data) => data.json())
      .then((data) => {
        setUser(data);
      });
  };

  //user commenting on post

  async function postcomment(comment) {
    if (posts.length) {
      let id = posts[0].id;
      if (token) {
        await fetch(`${baseURL}comments/${id}`, {
          method: "POST",
          body: JSON.stringify({
            comment: comment,
            username: user.name,
            // author_id: data.authorid
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${token}`,
          },
        }).then((res) => {
          setAddedCommentToken(new Date().getTime().toString());
          // get_comments(posts)
        });
      } else {
        // setShow(true);
        swal("Warning!", "You must Login!", "warning");
      }
    }
  }

  //Delete Post
  // const deletepost = (id) => {
  //   fetch(`${baseURL}posts/${id}`, {
  //     method: "DELETE",
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   }).then((data) => {
  //     console.log(data);
  //   });
  //   setPosts(
  //     posts.filter((post) => {
  //       // console.log(post.id);
  //       return post.id !== id;
  //     })
  //   );
  //   // toast.error("Deleted Successfully!")
  //   swal("Deleted", "Post Deleted", "error");
  // };

  useEffect(() => {
    fetchingPost();
    userdata();
  }, []);

  const backButton = () => {
    navigate("/");
  };

  // console.log(show);
  if (!posts) return null;
  return (
    <div
      style={{
        background: "rgb(2,0,36)",
        backgroundImage:
          "linear-gradient(200deg, rgba(2,0,36,1) 0%, rgba(9,85,121,1) 35%, rgba(0,212,255,1) 100%)",
        padding: "5px",
        color: "white",
        marginTop: "3.5rem",
      }}
      className="border border-warning"
    >
      <div className="d-flex card-body" style={{ marginTop: "1rem" }}>
        <Button className="btn btn-warning" onClick={backButton} title="Back" />
      </div>
      {
        <div className="d-flex justify-content-center">
          <div className="d-inline-flex" style={{ width: "40rem" }}>
            <div className="card-body p-2">
              {/* Parent to child */}
              <PostInfo
                title={posts[0].title}
                postimage={posts[0].image}
                date={posts[0].created_at}
                updateddate={posts[0].updated_at}
                name={posts[0].name}
                description={posts[0].description}
              />
              {/* <Button
                className="btn btn-danger btn-md mx-3"
                onClick={() => {
                  deletepost(posts[0].id);
                }}
                title={"Delete Post"}
              /> */}
              <Comments
                postId={posts[0].id}
                addedCommentToken={addedCommentToken}
                authorID={posts[0].author_id}
              />

              {/* child to parent */}
              <AddComment
                postcomment={(comment) => postcomment(comment)}
                addedCommentToken={addedCommentToken}
              />
            </div>
          </div>
        </div>
      }
    </div>
  );
}
