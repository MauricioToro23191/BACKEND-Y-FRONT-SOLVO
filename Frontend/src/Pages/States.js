import React, { useCallback,useState,useEffect,useContext} from 'react';
import Statebtn from '../Component/statebtn';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from "../Context/socketio";
import jwt_decode from "jwt-decode";

import '../styles/states.scss';
import '../styles/animate.scss'
const API=process.env.REACT_APP_BACKEND

export default function States(props) {
  const {loge}=props

  const socket=useContext(SocketContext);
  const Navigate = useNavigate();
  const logOUT = useCallback(() => Navigate('/', { replace: true }), [Navigate]);
  const [nombre,setNombre]=useState("");
  const logout=async(e)=>{
    e.preventDefault();
    let rest=confirm('Are you sure you want to log out?')
    if(rest){
      const res=await fetch(`${API}/logout`,{
        method: "POST",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({
            user:jwt_decode(sessionStorage.getItem('tocken'))
        })
  })
  const data =await res.json()
  if(data['logout']){
    socket.emit('logoutUser',{'message':{'logout':true,'id':jwt_decode(sessionStorage.getItem('tocken'))['id']},'room':sessionStorage.getItem('idComp')});
    clearInterval(sessionStorage.getItem('idinterval'))
   if(jwt_decode(sessionStorage.getItem('tocken')) != ''){
      sessionStorage.clear();
      loge(false)
      logOUT();
    }else{
      sessionStorage.clear();
      loge(false)
      logOUT();
    }
  }else{
    alert("no fue posible cerrar la session")
  }
    }
    
  }
 
  useEffect(()=>{
    let l = jwt_decode(sessionStorage.getItem('tocken'));
    setNombre(l['Name']+" "+l['LastN'])
  },[])
  
  return (
    <div className='background'>
      <div id="contall">
        <div id="PerfilUsers">
          <p id='SolvIcon'></p>
          <h2>{nombre}</h2>
          <p id='textCustom'>Time is Money Money Money Money</p>
          <center><strong id="changeState" style={{position:"absolute",top:"0",left:"30%",width:"40%", color:"red"}}></strong></center>
          <div id='OptionsBTN'>
            <button id='PerfilU'></button>
            <button id='Options'></button>
            <button id='Out' onClick={logout}></button>
          </div>
        </div>

        <div id="PanelState">
          <div id="state">
            <h1 id="demo" ></h1>
            <div id="crono">
              <p id="hms">00:00:00</p>
              <label id="hmsAcum" >00:00:00</label>
              <div className='animationTest'>
                <div className='Animation'></div>
                <div className='Animation'></div>
                <div className='Animation'></div>
                <div className='Animation'></div>
              </div>
            </div>
          </div>
          <div id='selectorState'>
            <Statebtn  />
          </div>
        </div>

      </div>
    </div>
  )
}


