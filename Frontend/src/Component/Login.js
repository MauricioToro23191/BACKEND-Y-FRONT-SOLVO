import React from "react";

export default function Login({handleForgot,Handlesesion,setpass,setuser}) {

  const pensioneenter=(e)=>{
    if(e==="Enter" || e=="Intro"){
      Handlesesion();
    }
    
  }
  return (
    <div className="contForm" id="contForm">
      <div className="Formulario">
        <label>Log In</label>
        <input placeholder="User" type="email" id="user" onKeyDown={(e) =>pensioneenter(e.key)} onChange={(e) => setuser(e.target.value)}></input>
        <input type="password" id="pass" placeholder="Pass" onKeyDown={(e) =>pensioneenter(e.key)} onChange={(e) => setpass(e.target.value)} ></input>
        <label id="forgePass" onClick={handleForgot}>Forgot your Password?</label>
        <input onClick={Handlesesion} className="buttonEx" value="Login"/>
      </div>
    </div>
  );
}