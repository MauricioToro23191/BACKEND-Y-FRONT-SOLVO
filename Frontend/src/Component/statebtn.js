import React, { useState,useContext,useEffect } from "react";
import { SocketContext } from "../Context/socketio";
import jwt_decode from "jwt-decode";

const API=process.env.REACT_APP_BACKEND

export default function Statebtn() {
  const socket=useContext(SocketContext);
  const [stateS, setstateS] = useState("");
  const [classA, setClassA] = useState("Animation")
  var [response,setResponse]=useState({})
  const{zonedTimeToUtc}=require('date-fns-tz')
  var tiempoInicio = null;
  var tiempoInicioActual=null;
  var tiempoAnterior = 0;
  var diferenciaTemporal = 0;
  

  
  useEffect(()=>{
    getState();
    socket.emit('join',{'room':sessionStorage.getItem('idComp')});
    socket.on('ChangeStateSuptoUser',(message)=>{
      let idUdser=message['iduser']
      if(jwt_decode(sessionStorage.getItem('tocken')).id==parseInt(idUdser)){
        alert( 'the State has been change by '+ message['responsable'] )
        document.getElementById('changeState').innerHTML='the State has been change by '+ message['responsable']
        sessionStorage.setItem('diferenciaState',0)
        getState();
        setTimeout(() => {
          document.getElementById('changeState').innerHTML=''
        }, 15000);
      }
    })
    if(sessionStorage.getItem('AnimateDefault')!=null){
      changeAnimation(sessionStorage.getItem('AnimateDefault'));
    }
    
    return () => {
      socket.off('ChangeStateSuptoUser');
    }
  },[socket])
  
  function enableBtn() {
    const btt = document.querySelectorAll('.btns');
    for (var i = 0; i < btt.length; i++) {
      btt[i].disabled = false;
    }
  }
 
  const cambiarestado=async(id,responsable)=>{
    if(responsable==""){
      responsable=jwt_decode(sessionStorage.getItem('tocken'))['Name']
    }
    const res =await fetch(`${API}/estados/changeState`,{
      method: "POST",
      headers: {
          Authorization:sessionStorage.getItem('tocken'),
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body:JSON.stringify({
          idestado:id,
          'user':jwt_decode(sessionStorage.getItem('tocken')),
          responsable:responsable
      })
    })
    const data =await res.json()
    response=data;
    sessionStorage.setItem('diferenciaState',0)
    cambio(response);
    socket.emit('Cambio',{'message':data,'room':sessionStorage.getItem('idComp')});
  }
  
  

  const getState=async()=>{
    const res =await fetch(`${API}/estados/getState`,{
      method: "POST",
      headers: {
          Authorization:sessionStorage.getItem('tocken'),
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body:JSON.stringify({
          user:jwt_decode(sessionStorage.getItem('tocken'))
      })
    })
    const data =await res.json()
    response=data;

    cambio(response);
    return true

  }

  function OpenModal(btns) {
    setstateS(btns);
    modal(); 
  }
  function changeAnimation(clss) {
    const arrayA = document.querySelectorAll("." + classA + "")
    for (var i = 0; i < arrayA.length; i++) {
      arrayA[i].className = "Animation " + clss;
    }
  }
  function confirm() {
    sessionStorage.setItem('diferenciaState',0)
    if (stateS === "avaA") {
      close();
      enableBtn();
      cambiarestado(2,"");
      document.getElementById("ava").disabled = "true";
      changeAnimation(stateS);
      setClassA("avaA");
      sessionStorage.setItem('AnimateDefault',stateS)
    } else if (stateS === "personalA") {
      close();
      enableBtn()
      cambiarestado(9,"");
      document.getElementById("unav").disabled = "true";
      changeAnimation(stateS);
      setClassA("personalA");
      sessionStorage.setItem('AnimateDefault',stateS)
    } else if (stateS === "breakA") {
      close();
      enableBtn()
      cambiarestado(5,"");
      document.getElementById("break").disabled = "true";
      changeAnimation(stateS);
      setClassA("breakA");
      sessionStorage.setItem('AnimateDefault',stateS)
    } else if (stateS === "lunchA") {
      close();
      enableBtn()
      cambiarestado(6,"");
      document.getElementById("lunch").disabled = "true";
      changeAnimation(stateS);
      setClassA("lunchA");
      sessionStorage.setItem('AnimateDefault',stateS)
    } else if (stateS === "meetA") {
      close();
      enableBtn()
      cambiarestado(7,"");
      document.getElementById("meet").disabled = "true";
      changeAnimation(stateS);
      setClassA("meetA");
      sessionStorage.setItem('AnimateDefault',stateS)
    } else if (stateS === "coachA") {
      close();
      enableBtn()
      cambiarestado(8,"");
      document.getElementById("coach").disabled = "true";
      changeAnimation(stateS);
      setClassA("coachA");
      sessionStorage.setItem('AnimateDefault',stateS)
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
    let  ahora=zonedTimeToUtc(new Date(),sessionStorage.getItem('tz'));
    const diferencia1=ahora.getTime()- tiempoInicioActual.getTime()
    const diferencia = ahora.getTime() - tiempoInicio.getTime();
    document.getElementById('hms').textContent=milisegundosAMinutosYSegundos(diferencia1)
    document.getElementById('hmsAcum').textContent=milisegundosAMinutosYSegundos(diferencia);
    sessionStorage.setItem('diferenciaState',diferencia1)

  };

  function iniciar () {
      diferenciaTemporal += Number(tiempoAnterior);
      let ahora=zonedTimeToUtc(new Date(),sessionStorage.getItem('tz'));
      tiempoInicio = new Date(ahora.getTime() - diferenciaTemporal);
      tiempoInicioActual=new Date(ahora.getTime());
      if(sessionStorage.getItem('diferenciaState')!=null){
        tiempoInicioActual=new Date(ahora.getTime() - parseInt(sessionStorage.getItem('diferenciaState')));
      }
      if(jwt_decode(sessionStorage.getItem('tocken')) != null){
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
        const today=new Date(convertFromStringToDate(actuesta.hora_inicio))
        let timeInBrisbane=today;
        if(sessionStorage.getItem('tz')!=null){
          timeInBrisbane=zonedTimeToUtc(today,sessionStorage.getItem('tz'));
        }
        let date = timeInBrisbane;
        diferenciaTemporal = zonedTimeToUtc(new Date(),sessionStorage.getItem('tz')).getTime() - date.getTime();
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
          <div id="contm">
            <div className="infomodal">
              <h2>Do you want to change your state?</h2>
            </div>
            <div className="btnmodal">
              <button className="conf" id="confirm" onClick={confirm}>Confirmar</button>
              <button className="conf" id="cancel" onClick={close}>cancelar</button>
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
