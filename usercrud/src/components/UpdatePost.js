import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import JoditEditor from "jodit-react";
import * as Yup from "yup";
import swal from "sweetalert";
import { useSelector } from "react-redux";
import { get_auth } from "../redux/reducer";

const baseURL = "http://localhost:3030/";

export default function UpdatePost() {
  const { slug } = useParams();
  const editorRef = React.useRef(null);
  const auth = useSelector(get_auth);
  //Validation.....
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
  const [post, setpost] = useState([]);
  const token = auth?.token;
  const [text, setText] = useState("");

  useEffect(() => {
    userpost();
  }, []);

  const userpost = async () => {
    await fetch(`${baseURL}posts/${slug}`)
      .then((response) => response.json())
      .then((data) => setpost(data));
  };

  const handleonchange = (data) => {
    setText(data);
    // console.log(data);
  };

  ///UpdatePost/////////
  const onSubmit = async (data) => {
    let post_id = post[0].id;

    var formdata = new FormData();
    formdata.append("image", data.image[0]);
    formdata.append("title", data.title);
    formdata.append("description", text);

    await fetch(`${baseURL}posts/${post_id}`, {
      method: "PUT",
      body: formdata,
      headers: {
        // "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setpost(response.data);
      if (response.status === 200) {
        swal("Success!", "Update Successfully!", "success");
        navigate("/");
      } else {
        swal(
          "Warning!",
          "You are not valid user to midify this post!",
          "warning"
        );
        navigate("/");
      }
    });
  };

  // if (!post) return null;
  return (
    <div
      className="border border-warning"
      style={{ backgroundColor: "#2779e2" }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        style={{ marginBottom: "2rem" }}
      >
        {post &&
          post.map((p, index) => {
            return (
              <div className="container h-100" key={index}>
                <div className="row d-flex justify-content-center align-items-center h-100">
                  <div className="col-xl-9">
                    <h2 className="text-white" style={{ marginTop: "4rem" }}>
                      Update Your thoughts!
                    </h2>
                    <div className="card" style={{ borderRadius: "15px" }}>
                      <div className="card-body">
                        <div className="row align-items-center pt-4 pb-3">
                          <div className="col-md-3 ps-5">
                            <h6 className="mb-0">Title</h6>
                          </div>
                          <div className="col-md-9 pe-5">
                            <input
                              {...register("title")}
                              placeholder="What type of post?"
                              type="text"
                              className={`form-control form-control-lg ${
                                errors.title ? "is-invalid" : ""
                              }`}
                              defaultValue={p.title}
                            />
                          </div>
                        </div>
                        <hr className="mx-n3" />
                        <div className="row align-items-center py-3">
                          <div className="col-md-3 ps-5">
                            <h6 className="mb-0">Text</h6>
                          </div>
                          <div className="col-md-9 pe-5">
                            <JoditEditor
                              {...register("text")}
                              ref={editorRef}
                              value={p.description}
                              tabIndex={1} // tabIndex of textarea
                              onBlur={(newContent) => setText(newContent)} // preferred to use only this option to update the content for performance reasons
                              onChange={handleonchange}
                            />
                          </div>
                        </div>
                        <hr className="mx-n3" />
                        <div className="row align-items-center py-3">
                          <div className="col-md-3 ps-5">
                            <h6 className="mb-0">Image</h6>
                          </div>
                          <div className="col-md-9 pe-5">
                            <input
                              {...register("image")}
                              className={`form-control form-control-lg`}
                              type="file"
                              // defaultValue={p.image}
                            />
                          </div>
                        </div>
                        <hr className="mx-n3" />
                        <div className="px-5 py-4">
                          <button
                            type="submit"
                            className="btn btn-success btn-lg m-2"
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </form>
    </div>
  );
}
