import React, { useState, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.scss";
import { SocketContext } from "../Context/socketio";
import { useUsuario } from "../Context/ContextUser";
import ForgotP from "../Component/forgotP";
import ShowLogin from "../Component/Login";

const API = process.env.REACT_APP_BACKEND;
const Login = () => {
  const socket = useContext(SocketContext);
  const [user, setuser] = useState("");
  const [pass, setpass] = useState("");
  const [style, setStyle] = useState("sideL");
  const [showComponent, setShow] = useState(false);
  const [showlogin, setLogin] = useState(true);
  const [PassChange,setChange] = useState(false);
  const cambiarestado = async (id, user) => {
    const res = await fetch(`${API}/estados/changeState`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idestado: id,
        user: user,
        responsable: "",
      }),
    });
    const data = await res.json();
    console.log(data);
    socket.emit("Cambio", {
      message: data,
      room: sessionStorage.getItem("idComp"),
    });
  };

  const Navigate = useNavigate();
  const changePageMenu = useCallback(
    () => Navigate("/Layout", { replace: true }),
    [Navigate]
  );
  const changePageState = useCallback(
    () => Navigate("/states", { replace: true }),
    [Navigate]
  );
  const Handlesesion = async (e) => {
    e.preventDefault();
    if (user != "" || pass != "") {
      const res = await fetch(`${API}/usuario/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user,
          pass,
        }),
      });
      const r = await res.json();
      if (r["bool"]) {
        if (r["usuario"].perfil == 4) {
          console.log("interprete");
          sessionStorage.setItem("user", JSON.stringify(r["usuario"]));
          sessionStorage.setItem("perfil", r["usuario"].perfil);
          sessionStorage.setItem("idComp", r["usuario"]["compania"]["id"]);
          cambiarestado(4, JSON.stringify(r["usuario"]));
          sessionStorage.setItem("diferenciaState", 0);
          //setStyle("sideLEX");
          setTimeout(changePageState, 1500);
        } else {
          console.log("admin");
          sessionStorage.setItem("user", JSON.stringify(r["usuario"]));
          sessionStorage.setItem("perfil", r["usuario"].perfil);
          sessionStorage.setItem("idComp", r["usuario"]["compania"]["id"]);
          sessionStorage.setItem("startDate", new Date(Date.now()));
          sessionStorage.setItem("endDate", new Date(Date.now()));
          sessionStorage.setItem("reporte", true);
          //setStyle("sideLEX");
          setTimeout(changePageMenu, 1500);
        }
      } else {
        alert(r["response"]);
      }
      console.log(r);
    } else {
      alert("Faltan campos por llenar");
    }
  };

  const handleForgot = () => {
    setLogin(false);
    setChange(false);
    setStyle("sideLA");
  };

  const handleLoginS = () => {
    setShow(false);
    setLogin(true);
    setStyle("sideL");
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setShow(true);
    return 0;
  };
  const changePass = (e) =>{
    e.preventDefault();

  }
  const veriCode=(e)=>{
    e.preventDefault();
    setShow(false);
    setChange(true);
  }
  return (
    <>
      <div id="Cont">
        <div id="Container">
          {showlogin ? (
            <ShowLogin
              handleForgot={handleForgot}
              Handlesesion={Handlesesion}
            />
          ) : (
            ""
          )}
          {!showComponent && !showlogin && !PassChange ? (
            <ForgotP
              title={"Hola"}
              TextCont={"Enter your Email"}
              func={sendEmail}
              back={handleLoginS}
            />
          ) : showComponent ? (
            <ForgotP title={"Verify Code"} TextCont={"Enter the Code"} func={veriCode} back={handleLoginS} />
          ) : (
            ""
          )
          }
          {PassChange ? <ForgotP title={"New Password"} TextCont={"Enter the new PassWord"} func={changePass} back={handleLoginS}/>:""}
          <div id={style}>
            <p></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
