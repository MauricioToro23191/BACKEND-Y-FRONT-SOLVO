import React ,{useCallback, useState,useEffect} from 'react'; 
import Statebtn from '../Component/statebtn';
import { useNavigate } from 'react-router-dom';
import '../styles/states.scss';
const API =process.env.REACT_APP_BACKENT

export default function States() {
  const Navigate = useNavigate();
  const logOUT = useCallback(() => Navigate('/',{replace:true}),[Navigate]); 
  const Response={};
  const [nombre,setNombre]=useState("");
  //const socket=usecontext(SocketContext);
  const logout=async(e)=>{
    e.preventDefault();
    const res=await fetch(`${API}/logout`,{})
    if(res){
      if(sessionStorage.getItem('user') != null){
        console.log(sessionStorage.getItem('user'));
        sessionStorage.removeItem('user');
        console.log(sessionStorage.getItem('user'));
        cambiarestado(1)
        logOUT();
      }else{
        logOUT();
      }
    }else{
      console.log('false');
    }
  }
  const cambiarestado=async(id)=>{
    const res =await fetch(`${API}/estados/changeState`,{
      method: "POST",
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body:JSON.stringify({
          idestado:id,
          user:JSON.stringify(sessionStorage.getItem('user'))
      })
    })
    //const data =await res.json()
    //document.getElementById('demo').textContent=data.estado.nombre;
    //response=data;
    //cambio(response);
    //socket.emit('chat',{'message':response});
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
    Response=response
  }
  useEffect(()=>{
    pedirdatos
    let l=JSON.parse(sessionStorage.getItem('user'))
    setNombre(l['nombres']+" "+l['apellidos'])
  },[])
 
  

  return (
    <div id="contall"> 
      <div id="PerfilUsers">
        <div id="infoUserS">
          <p id="imaUserS"></p>
          <h2>{nombre}</h2>
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
          
            <h2 id="demo" >Log out</h2>
            <div id="crono">  
              <div className='cronometro'style={{ padding:"30%",backgroundColor:"gray", borderRadius:"5%"}}>
                <h1 id="hms" style={{textAlign: "center",borderRadius:"30%",backgroundColor:"white"}} >00:00:00</h1>
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
