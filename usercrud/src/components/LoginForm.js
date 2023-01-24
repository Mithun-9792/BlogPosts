import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { get_auth, login } from "../redux/reducer";
import swal from "sweetalert";

const baseURL = "http://localhost:3030/";
export default function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector(get_auth);
  const [logindata, setlogindata] = useState({});

  useEffect(() => {
    fetch(`${baseURL}`)
      .then((res) => {
        res.json();
      })
      .then((data) => {
        setlogindata(data);
        console.log(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  console.log(auth?.token, "auth token");
  ///Form Validation
  const schema = Yup.object().shape({
    Email: Yup.string().required("Email required!").email("Format Error!"),
    password: Yup.string().required("Password required!"),
  });

  const formresolver = { resolver: yupResolver(schema) };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(formresolver);

  const onSubmit = async (data) => {
    let data1 = await loginUser(data);
    // console.log(data1.token);
    let Token = data1.token;
    if (Token) {
      dispatch(login(data1));
      // auth?.token;
      navigate(`/userhome`);
    } else {
      swal("Warning!", "Wrong E-mail or Password", "warning");
      // toast.error("Wrong mail or password")
    }
  };

  async function loginUser(credentials) {
    return await fetch(`${baseURL}login`, {
      method: "POST",
      body: JSON.stringify({
        email: credentials.Email,
        password: credentials.password,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((data) => data.json());
  }

  return (
    <div
      style={{
        backgroundColor: "#4158D0",
        backgroundImage:
          "linear-gradient(90deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="border border-warning"
        style={{ padding: "4.35rem", marginTop: "3.5rem" }}
      >
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-xl-9">
              <h1 className="text-white mb-4">LogIn Form</h1>
              <div className="card" style={{ borderRadius: "15px" }}>
                <div className="card-body">
                  <hr className="mx-n3" />
                  <div className="row align-items-center py-3">
                    <div className="col-md-3 ps-5">
                      <h6 className="mb-0">Email address</h6>
                    </div>
                    <div className="col-md-9 pe-5">
                      <input
                        {...register("Email")}
                        type="email"
                        // className="form-control form-control-lg"
                        placeholder="example@example.com"
                        className={`form-control form-control-lg ${
                          errors.Email ? "is-invalid" : ""
                        }`}
                      />
                    </div>
                    {/* <div className="invalid-feedback">
                                                {errors.Email?.message}
                                            </div> */}
                  </div>
                  <hr className="mx-n3" />
                  <div className="row align-items-center py-3">
                    <div className="col-md-3 ps-5">
                      <h6 className="mb-0">Password</h6>
                    </div>
                    <div className="col-md-9 pe-5">
                      <input
                        name="password"
                        // className="form-control form-control-lg"
                        {...register("password")}
                        className={`form-control form-control-lg ${
                          errors.password ? "is-invalid" : ""
                        }`}
                        placeholder="Password"
                        type="password"
                      />
                      {/* <div className="invalid-feedback">
                                                    {errors.password?.message}
                                                </div> */}
                    </div>
                  </div>
                  <hr className="mx-n3" />
                  <div className="px-5 py-4">
                    <button
                      type="submit"
                      className="btn btn-outline-success btn-lg m-3"
                    >
                      LogIn
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
