import React, { useCallback,useState,useEffect,useContext} from 'react';
import Statebtn from '../Component/statebtn';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from "../Context/socketio";
import jwt_decode from "jwt-decode";
import "../styles/layoutModal.scss"
import mot from"../Data/Motivation.json"
import '../styles/states.scss';
import '../styles/animate.scss'
const API=process.env.REACT_APP_BACKEND


export default function States(props) {
  const {loge}=props

  let number=Math.floor(Math.random()*30)
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
  function getUser(){
    let u =jwt_decode(sessionStorage.getItem('tocken'))
    document.getElementById('idSolvo1').textContent=u['SolID'];
    document.getElementById('Name1').textContent=u['Name'];
    document.getElementById('lastN1').textContent=u['LastN'];
    document.getElementById('Email1').textContent=u['Email'];
    document.getElementById('perfil1').textContent=u['Perfil'];
    document.getElementById('supervisor1').textContent=u['Supervisor'];
    document.getElementById('company1').textContent=u['Company'];
    document.getElementById('city1').textContent=u['City'];
    document.getElementById('Site1').textContent=u['Site'];

  }

  function modal(){
    getUser();
    document.getElementById("Mymodallayout").style.display = 'block';
  }
  function close(){
    document.getElementById("Mymodallayout").style.display = 'none';
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
          <p id='textCustom'>{mot[number]["frase"]}</p>
          <center><strong id="changeState" style={{position:"absolute",top:"0",left:"30%",width:"40%", color:"red"}}></strong></center>
          <div id='OptionsBTN'>
            <button id='PerfilU' onClick={modal}></button>
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
      <div id="Mymodallayout" className="modalcontlayout">
                <div id="modal-contlayout">
                    <div id="contmlayout">
                        <div className="sideRi">
                            <button className="buttonCloselayout" onClick={close} > X </button>
                        </div>
                        <div className="sideLe">
                            <form>
                                <center><h1>My User</h1>
                                <strong><label >SoLvoID</label></strong>
                                <label  name="idSolvo1" id="idSolvo1" className="inputslayout" />
                                <strong><label >First Name</label></strong>
                                <label  name="firstNAme" id="Name1" className="inputslayout" />
                                <strong><label>Last Name</label></strong>
                                <label  name="lastName" id="lastN1" className="inputslayout" />
                                <strong><label>Email</label></strong>
                                <label  name="corpEmail" id="Email1" className="inputslayout" />
                                <strong><label >Perfil</label></strong>
                                <label className="inputslayout" id="perfil1" />
                                <strong><label id="sup">Supervisor</label></strong>
                                <label className="inputslayout" id="supervisor1" />
                                <strong><label >Account</label></strong>
                                <label className="inputslayout" id="company1" />
                                <strong><label >Locaction</label></strong>
                                <label className="inputslayout" id="city1" />
                                <strong><label >Sites</label></strong>
                                <label className="inputslayout" id="Site1"></label>
                                </center>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
    </div>
    
  )
}


