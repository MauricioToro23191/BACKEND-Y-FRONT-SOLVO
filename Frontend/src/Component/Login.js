import React from "react";

export default function Login({handleForgot,Handlesesion,setpass,setuser}) {
  return (
    <div className="contForm" id="contForm">
      <div className="Formulario">
        <label>Log In</label>
        <input placeholder="User" type="email" id="user" onChange={(e) => setuser(e.target.value)}></input>
        <input type="password" id="pass" placeholder="Pass" onChange={(e) => setpass(e.target.value)} ></input>
        <label id="forgePass" onClick={handleForgot}>Forgot your Password?</label>
        <input type="submit" onClick={Handlesesion} className="buttonEx" value="Login"/>
      </div>
    </div>
  );
}