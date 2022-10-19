import React from "react";

export default function ForgotP({ title, TextCont, func,back,placeH }) {
  return (
    <div id="formulario2">
      <form className="form2">
        <label className="backLogin" onClick={back}/>
        <label className="title">{title}</label>
        <label className="textTitle">{TextCont}</label>
        <input className="Email" placeholder={placeH}></input>
        <button className="nextStep" onClick={func} />
      </form>
    </div>
  );
}
