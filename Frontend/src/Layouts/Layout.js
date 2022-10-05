import { Outlet, Link, useNavigate } from "react-router-dom";
import React, { useCallback,useState,useEffect } from "react";
import '../styles/layout.scss';

const API=process.env.REACT_APP_BACKEND

const Layout = (props) => {
    const {loge}=props
    const {logueado}=props

    const[nombre,setNombre]=useState("");
    const Navigate = useNavigate(); 
    const logOUT = useCallback(() => Navigate('/', { replace: true }), [Navigate]);
    const logout=async(e)=>{
        e.preventDefault();
        const res=await fetch(`${API}/logoutAdmin`,{})
        if(res){
          if(sessionStorage.getItem('user') != null){
            sessionStorage.clear();
            loge(false)
            logOUT();
          }else{
            loge(false)
            logOUT();
          }
        }else{
          console.log('false');
        }
        
      }
      useEffect(()=>{
        let l=JSON.parse(sessionStorage.getItem('user'))
        setNombre(l['Name']+" "+l['LastN'])
      },[])
      function onhiden(){
        if(document.getElementById('btnss').style.display=='block'){
          document.getElementById('btnss').style.display='none'
        }else{ 
          document.getElementById('btnss').style.display='block'
        }
      }

      
    return (
        <>
            <div id="menu" onClick={onhiden}>
                <button id="hidden"  ></button>
                <button id="DESP"></button>
                <div id="btnss" style={{display:"none"}}>
                    <Link to="/Layout"><button id="USERS" className="querybtn"></button></Link>
                    <Link to="/Layout/Export"><button id="REP" className="querybtn"></button></Link>
                    <Link to="/Layout/RTA" id="RT1"><button id="RT" className="querybtn"></button></Link>
                </div>
            </div>
            <div id="ContAll">
                <div id="infoUser">
                    <p id="imaUser"></p>
                    <h2>{nombre}</h2>
                    <ul>
                        <li>Perfil</li>
                        <li onClick={logout}>Log Out</li>
                    </ul>
                </div>
                <Outlet />
            </div>
        </>
    )
}

export default Layout;