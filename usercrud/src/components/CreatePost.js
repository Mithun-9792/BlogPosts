import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import JoditEditor from "jodit-react";
import swal from "sweetalert";

const baseURL = "http://localhost:3030/";

export default function CreatePost() {
  //Validation.....
  const editorRef = React.useRef(null);
  const schema = Yup.object().shape({
    title: Yup.string().required("Title is required field!"),
    // text: Yup.string().required("Text Required!"),
  });

  const formresolver = { resolver: yupResolver(schema) };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(formresolver);
  const navigate = useNavigate();
  const [post, setpost] = useState({});
  const token = localStorage.getItem("token");
  const [text, setText] = useState("");

  useEffect(() => {
    fetch(`${baseURL}`)
      .then((res) => {
        res.json();
      })
      .then((data) => {
        setpost(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const handleonchange = (data) => {
    setText(data);
    console.log(data);
  };

  const onsubmit = async (data) => {
    var formdata = new FormData();
    formdata.append("image", data.image[0]);
    formdata.append("title", data.title);
    formdata.append("description", text);

    fetch(`${baseURL}posts`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      if (response.status !== 201) {
        swal("Error!", "Bad Request!", "error");
      } else {
        swal("Success!", "Posted Successfully!", "success");
        navigate("/");
      }
    });
  };
  if (!token) return null;
  return (
    <div
      className="border border-warning"
      style={{
        marginTop: "3.5rem",
        backgroundColor: "#4158D0",
        backgroundImage:
          "linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
      }}
    >
      <form
        noValidate
        onSubmit={handleSubmit(onsubmit)}
        encType="multipart/form-data"
        style={{ marginBottom: "2rem" }}
      >
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-xl-8">
            <h2 className="text-white mb-4"> What 's on your mind?</h2>
            <div className="card" style={{ borderRadius: "15px" }}>
              <div className="card-body">
                <div className="row align-items-center pt-4 pb-3">
                  <div className="col-md-3 ps-5">
                    <h6 className="mb-0"> Title </h6>
                  </div>
                  <div className="col-md-9 pe-5">
                    <input
                      {...register("title")}
                      placeholder="What type of post?"
                      type="text"
                      className={`form-control form-control-lg ${
                        errors.title ? "is-invalid" : ""
                      }`}
                    />
                  </div>
                </div>
                <hr className="mx-n3" />
                <div className="row align-items-center py-3">
                  <div className="col-md-3 ps-5">
                    <h6 className="mb-0"> Text </h6>
                  </div>
                  <div className="col-md-9 pe-5">
                    <JoditEditor
                      {...register("text")}
                      ref={editorRef}
                      value={text}
                      tabIndex={1} // tabIndex of textarea
                      onBlur={(newContent) => setText(newContent)} // preferred to use only this option to update the content for performance reasons
                      onChange={handleonchange}
                    />
                  </div>
                </div>
                <hr className="mx-n3" />
                <div className="row align-items-center py-3">
                  <div className="col-md-3 ps-5">
                    <h6 className="mb-0"> Image </h6>
                  </div>
                  <div className="col-md-9 pe-5">
                    <input
                      {...register("image")}
                      className={`form-control form-control-lg`}
                      type="file"
                    />
                  </div>
                </div>
                <hr className="mx-n3" />
                <div className="px-5 py-4">
                  <button type="submit" className="btn btn-info btn-lg m-2">
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
