import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

const baseURL = "http://localhost:3030/";

export default function RegistrationForm() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${baseURL}`)
      .then((res) => {
        res.json();
      })
      .then((data) => {
        setUser(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  //Validation.....
  const schema = Yup.object().shape({
    Name: Yup.string().required("Name is required field!"),
    Email: Yup.string()
      .required("Email is required field!")
      .email("Format error"),
    password: Yup.string()
      .required("Password Required!")
      .min(6, "Password must be at least 6 characters"),
    confirmpwd: Yup.string()
      .required("Confirm password is required!")
      .oneOf([Yup.ref("password")], "Confirm password must be same!"),
  });

  const formresolver = { resolver: yupResolver(schema) };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(formresolver);

  const onSubmit = (data) => {
    fetch(`${baseURL}signup`, {
      method: "POST",
      body: JSON.stringify({
        name: data.Name,
        email: data.Email,
        password: data.password,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((res) => {
      if (res.status !== 409) {
        swal(
          "Success",
          "Registration Successful! Enjoy the journey.",
          "success"
        );
        navigate("/login");
      } else {
        swal("Warning", "Email already registred. Please Login!", "warning");
        navigate("/login");
      }
    });
  };
  return (
    <div
      className="border border-warning"
      style={{
        marginTop: "3.5rem",
        backgroundImage: "linear-gradient(to right, #6a11cb 0%, #2575fc 100%)",
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        style={{ padding: "1rem" }}
      >
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-xl-9">
              <h1 className="text-white mb-4">Registration Form</h1>
              <div className="card" style={{ borderRadius: "15px" }}>
                <div className="card-body">
                  <div className="row align-items-center pt-4 pb-3">
                    <div className="col-md-3 ps-5">
                      <h6 className="mb-0">Full name</h6>
                    </div>
                    <div className="col-md-9 pe-5">
                      <input
                        {...register("Name")}
                        type="text"
                        className={`form-control form-control-lg ${
                          errors.Name ? "is-invalid" : ""
                        }`}
                      />
                    </div>
                  </div>
                  <hr className="mx-n3" />
                  <div className="row align-items-center py-3">
                    <div className="col-md-3 ps-5">
                      <h6 className="mb-0">Email address</h6>
                    </div>
                    <div className="col-md-9 pe-5">
                      <input
                        {...register("Email")}
                        type="email"
                        placeholder="example@example.com"
                        className={`form-control form-control-lg ${
                          errors.Email ? "is-invalid" : ""
                        }`}
                      />
                    </div>
                  </div>
                  <hr className="mx-n3" />
                  <div className="row align-items-center py-3">
                    <div className="col-md-3 ps-5">
                      <h6 className="mb-0">Password</h6>
                    </div>
                    <div className="col-md-9 pe-5">
                      <input
                        name="password"
                        {...register("password")}
                        className={`form-control form-control-lg ${
                          errors.password ? "is-invalid" : ""
                        }`}
                        placeholder="Password"
                        type="password"
                      />
                    </div>
                  </div>
                  <div className="row align-items-center py-3">
                    <div className="col-md-3 ps-5">
                      <h6 className="mb-0">Confirm Password</h6>
                    </div>
                    <div className="col-md-9 pe-5">
                      <input
                        {...register("confirmpwd")}
                        className={`form-control form-control-lg ${
                          errors.password ? "is-invalid" : ""
                        }`}
                        placeholder="Confirm Password"
                        type="password"
                        name="confirmpwd"
                      />
                    </div>
                  </div>
                  <hr className="mx-n3" />

                  <div className="px-5 py-4">
                    <button
                      type="submit"
                      className="btn btn-outline-warning btn-lg "
                    >
                      Register
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
