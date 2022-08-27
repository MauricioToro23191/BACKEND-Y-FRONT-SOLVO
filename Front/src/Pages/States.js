import React ,{useCallback, useState,useEffect, useContext} from 'react';
import { CircularProgressbar,buildStyles } from 'react-circular-progressbar';
import Statebtn from '../Component/statebtn';
import { useNavigate } from 'react-router-dom';
import '../styles/states.scss';
import {SocketContext} from '../Context/socketio'
const API =process.env.REACT_APP_BACKENT

export default function States() {
  const btt=document.querySelectorAll('.btns');
  const Navigate = useNavigate();
  const logOUT = useCallback(() => Navigate('/',{replace:true}),[Navigate]);
  const [Response,setdate]=useState("");
  const [bool,setbool]=useState("");
  //const socket=usecontext(SocketContext);
  const logout=async(e)=>{
    e.preventDefault();
    const res=await fetch(`${API}/logout`,{})
    if(res){
      if(sessionStorage.getItem('user') != null){
        console.log(sessionStorage.getItem('user'));
        sessionStorage.removeItem('user');
        console.log(sessionStorage.getItem('user'));
        logOUT();
      }else{
        logOUT();
      }
    }else{
      console.log('false');
    }
  }
  
  const pedirdatos=async()=>{
    const res= await fetch(`${API}/estados/menu`,{
      method: "POST",
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body:JSON.stringify({
          user:sessionStorage.getItem('user')
      })
    })
    const response= await res.json();
    setdate(response);
  }
  useEffect(()=>{
    pedirdatos();
  },[])
 
  

  return (
    <div id="contall"> 
      <div id="PerfilUsers">
        <div id="infoUserS">
          <p id="imaUserS"></p>
          <h2>Juan Jose Fernández Ruiz</h2>
          <p id='textCustom'>Hola Mundo Hola MundoHola Mundo</p>
          <p id='SolvIcon'></p>
        </div>
        <div id='OptionsBTN'>
          <div id='BTNS-Option'>
            <button id='PerfilU'></button>
            <button id='Options'></button>
            <button id='Out' onClick={logout}></button>
          </div>  
        </div>
      </div>
        <div id="PanelState">
          <div id="state">
          
            <h1 id="demo">Log out</h1>
            <div id="crono">  
              <div className='cronometro'>
                <p id="hms">00:00:00</p>
              </div> 
            </div> 
          </div>

          <div id='selectorState'>
            <Statebtn response={Response}/>
          </div>
        </div>
        
    </div>
  
  )
  }
