import React from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="AdminLogoDiv">
        <img className="AdminLogoDiv-logo" src={assets.logo} alt="" />
        <p className="AdminLogoDiv-logoText">उत्तम स्वाद और गुणवत्ता की पहचान</p>
      </div>
      <img className="profile" src={assets.profile_image} alt="" />
    </div>
  );
};

export default Navbar;
