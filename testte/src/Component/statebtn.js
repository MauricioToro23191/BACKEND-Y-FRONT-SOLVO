import React, { useState,useContext,useEffect } from "react";
import { SocketContext } from "../Context/socketio";

const API=process.env.REACT_APP_BACKEND

export default function Statebtn(props) {
  const {socket}=props
  const [stateS, setstateS] = useState("");
  const [classA, setClassA] = useState("Animation")
  const [newClass, setNewClass] = useState("");
  var [response,setResponse]=useState({})
  var tiempoInicio = null;
  var tiempoAnterior = 0;
  var diferenciaTemporal = 0;
  function enableBtn() {
    const btt = document.querySelectorAll('.btns');
    for (var i = 0; i < btt.length; i++) {
      btt[i].disabled = false;
    }
  }
  useEffect(()=>{
    cambiarestado(4);
  },[])
  const cambiarestado=async(id)=>{
    const res =await fetch(`${API}/estados/changeState`,{
      method: "POST",
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body:JSON.stringify({
          idestado:id,
          user:sessionStorage.getItem('user')
      })
    })
    const data =await res.json()
    console.log(data)
    response=data;
    cambio(response);
    socket.emit('chat',{'message':data,'room':sessionStorage.getItem('idComp')});
  }


  function OpenModal(btns) {
    setstateS(btns);
    modal(); 
    setNewClass(btns);
    
  }
  function changeAnimation() {
    const arrayA = document.querySelectorAll("." + classA + "")
    for (var i = 0; i < arrayA.length; i++) {
      arrayA[i].className = "Animation " + newClass;
    }
  }
  function confirm() {
    if (stateS === "avaA") {
      close();
      enableBtn();
      cambiarestado(2);
      document.getElementById("ava").disabled = "true";
      changeAnimation();
      setClassA("avaA");
    } else if (stateS === "personalA") {
      close();
      enableBtn()
      cambiarestado(9);
      document.getElementById("unav").disabled = "true";
      changeAnimation();
      setClassA("personalA");
    } else if (stateS === "breakA") {
      close();
      enableBtn()
      cambiarestado(5);
      document.getElementById("break").disabled = "true";
      changeAnimation();
      setClassA("breakA");
    } else if (stateS === "lunchA") {
      close();
      enableBtn()
      cambiarestado(6);
      document.getElementById("lunch").disabled = "true";
      changeAnimation();
      setClassA("lunchA");
    } else if (stateS === "meetA") {
      close();
      enableBtn()
      cambiarestado(7);
      document.getElementById("meet").disabled = "true";
      changeAnimation();
      setClassA("meetA");
    } else if (stateS === "coachA") {
      close();
      enableBtn()
      cambiarestado(8);
      document.getElementById("coach").disabled = "true";
      changeAnimation();
      setClassA("coachA");
    }
  }


  function modal() {
    var modal = document.getElementById("Mymodal");
    var body = document.getElementsByTagName("body")[0];
    modal.style.display = "block";
    body.style.position = "static";
    body.style.height = "100%";
    body.style.overflow = "hidden";
  }
  function close() {
    var modal = document.getElementById("Mymodal");
    var body = document.getElementsByTagName("body")[0];
    modal.style.display = "none";
    body.style.position = "inherit";
    body.style.height = "auto";
    body.style.overflow = "visible";
  }
  const agregarCeroSiEsNecesario = valor => {
    if (valor < 10) {
        return "0" + valor; 
    } else {
        return "" + valor;
    }
  }
  function milisegundosAMinutosYSegundos(milisegundos) {
    const horas = parseInt(milisegundos / 1000 / 60 / 60);
    milisegundos -= horas * 60 * 60 * 1000;
    const minutos = parseInt(milisegundos / 1000 / 60);

    milisegundos -= minutos * 60 * 1000;
    const segundos = (milisegundos / 1000);
    return `${agregarCeroSiEsNecesario(horas)}:${agregarCeroSiEsNecesario(minutos)}:${agregarCeroSiEsNecesario(segundos.toFixed())}`;
  };
  function refrescarTiempo () {
    const ahora = new Date();
    const diferencia = ahora.getTime() - tiempoInicio.getTime();
    document.getElementById('hms').textContent=milisegundosAMinutosYSegundos(diferencia);
  };

  function iniciar () {
      diferenciaTemporal += Number(tiempoAnterior);
      const ahora = new Date();
      tiempoInicio = new Date(ahora.getTime() - diferenciaTemporal);
      if(sessionStorage.getItem('user') != null){
        clearInterval(sessionStorage.getItem('idinterval'))}
      var idint=setInterval(refrescarTiempo, 1000);
      sessionStorage.setItem("idinterval",idint);

  };

  function convertFromStringToDate(responseDate) {
    let dateComponents = responseDate.split(' ');
    let datePieces = dateComponents[0].split("-");
    let timePieces = dateComponents[1].split(":");
    return (new Date(datePieces[0], (datePieces[1] - 1), datePieces[2],
        timePieces[0], timePieces[1], timePieces[2]))
  }
  function cambio(response) {
    diferenciaTemporal = null;
    tiempoAnterior = 0;
    let totalStates = 0;
    let esta;
    tiempoInicio = null;
    document.querySelector('#demo').textContent = '';
    if (response.estado != null) {
        esta = response.estado;
    } else {
        esta = {
            'id': '1',
            'nombre': 'Logout'
        }
    }
    if (response.estadoactual != null) {
        let actuesta = response.estadoactual;
        let date = new Date(convertFromStringToDate(actuesta.hora_inicio));
        diferenciaTemporal = new Date() - date.getTime();
    }
    if (response.totalStates === null) {
      totalStates = null;
        tiempoAnterior = 0;
        console.log('no existen totales')
    } else {
        totalStates = response.totalStates
        if (totalStates[esta.nombre] === null) {
            console.log('estado No existe')
            tiempoAnterior = 0
        } else {
            tiempoAnterior = totalStates[esta.nombre]
        }
    }
    document.querySelector('#demo').innerHTML = esta.nombre;
    iniciar();
  }

  return (
    <>
      <div id="Mymodal" className="modalcont">
        <div id="modal-cont">
          <div id="contm">
            <div className="infomodal">
              <h2>¿Desea Cambiar de estado?</h2>
            </div>
            <div className="btnmodal">
              <button className="conf" id="confirm" onClick={confirm}>Confirmar</button>
              <button className="conf" id="cancel" onClick={close}>cancelar</button>
            </div>
          </div>
        </div>
      </div>
      <div className="layoutBtn">
        <div id="btn1" className="btn"><button className="btns" id="ava" onClick={() => OpenModal("avaA")} ></button></div>
        <div id="btn2" className="btn"><button className="btns" id="unav" onClick={() => OpenModal("personalA")}>PERSONAL</button></div>
        <div id='btn3' className="btn"><button className="btns" id="lunch" onClick={() => OpenModal("lunchA")}>LUNCH</button></div>
        <div id="btn4" className="btn"><button className="btns" id="break" onClick={() => OpenModal("breakA")}>BREAK</button></div>
        <div id="btn5" className="btn"><button className="btns" id="meet" onClick={() => OpenModal("meetA")}>MEETING</button></div>
        <div id="btn6" className="btn"><button className="btns" id="coach" onClick={() => OpenModal("coachA")}>COACHING</button></div>
      </div>
    </>

  )
}
