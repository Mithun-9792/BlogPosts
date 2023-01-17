import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostCard from "./Cards/PostCard";

const baseURL = "http://localhost:3030/";
export default function Posts() {
  const [posts, setPosts] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${baseURL}posts`)
      .then((data) => data.json())
      .then((data) => {
        setPosts(data);
      });
  }, []);

  if (!posts) return null;
  return (
    <div
      className="border border-warning"
      style={{
        background: "rgb(2,0,36)",
        backgroundImage:
          "linear-gradient(200deg, rgba(2,0,36,1) 0%, rgba(9,85,121,1) 35%, rgba(0,212,255,1) 100%)",
        padding: "5px",
        marginTop: "3.5rem",
      }}
    >
      <div
        className="container my-3"
        style={{
          background: "rgb(2,0,36)",
          backgroundImage:
            "linear-gradient(200deg, rgba(2,0,36,1) 0%, rgba(9,85,121,1) 35%, rgba(0,212,255,1) 100%)",
          padding: "5px",
        }}
      >
        <h2>Read intresting Posts</h2>
      </div>
      {posts.map((post) => {
        return (
          <div className="d-inline-flex my-2 mx-4" key={post.id}>
            <PostCard
              title={post.title}
              created_at={post.created_at}
              updated_at={post.updated_at}
              buttonTitle={"Read more"}
              description={post.description}
              onClick={() => {
                navigate(`/postview/${post.slug}`);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
