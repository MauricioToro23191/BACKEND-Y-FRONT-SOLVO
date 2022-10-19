import React from "react";

export default function ForgotP ({ title, TextCont, func,back,placeH }) {
  return (
    <>
    <div className='formulario2' id="formulario2">
      <div className='form2' >
          <label className='backLogin' id="backLogin" onClick={back} />
          <label className='title' id="title">{title}</label>
          <label className='textTitle' id="textTitle">{TextCont}</label>
          <input className='Email' type="email" id="Email"placeholder={placeH}></input>
          <button className='nextStep' onClick={func}/>
      </div>
    </div>
    </>
  );
  
}

