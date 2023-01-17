import React from "react";

export default function Footer() {
  return (
    <div>
      <footer className="bg-light text-center text-lg-start">
        <div
          className="text-center p-3"
          style={{
            backgroundImage:
              "linear-gradient( 178.6deg,  rgba(20,36,50,1) 11.8%, rgba(124,143,161,1) 83.8% )",
            color: "white",
          }}
        >
          © 2023 Copyright :
          <a className="text-light" href="/" style={{ textDecoration: "none" }}>
            {" "}
            CRUD.com
          </a>
        </div>
      </footer>
    </div>
  );
}
