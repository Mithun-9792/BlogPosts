import "./App.css";
import React from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import UserHome from "./components/UserHome";
import Posts from "./components/Posts";
import PostView from "./components/PostView";
import CreatePost from "./components/CreatePost";
import UserPosts from "./components/UserPosts";
import UpdatePost from "./components/UpdatePost";
import Footer from "./components/Footer";
// import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/registration" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/userhome" element={<UserHome />} />
        <Route path="/" element={<Posts />} />
        <Route path="/postview/:slug" element={<PostView />} />
        <Route path="/createpost" element={<CreatePost />} />
        <Route path="/userposts/:id" element={<UserPosts />} />
        <Route path="/updateposts/:slug" element={<UpdatePost />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
