import { Outlet, Link, useNavigate } from "react-router-dom";
import React, { useCallback,useState,useEffect } from "react";
import '../styles/layout.scss';

const API=process.env.REACT_APP_BACKEND

const Layout = () => {
    const[nombre,setNombre]=useState("");
    const Navigate = useNavigate(); 
    const logOUT = useCallback(() => Navigate('/', { replace: true }), [Navigate]);
    const logout=async(e)=>{
        e.preventDefault();
        const res=await fetch(`${API}/logoutAdmin`,{})
        if(res){
          if(sessionStorage.getItem('user') != null){
            sessionStorage.clear();
            logOUT();
          }else{
            
            logOUT();
          }
        }else{
          console.log('false');
        }
        
      }
      useEffect(()=>{
        let l=JSON.parse(sessionStorage.getItem('user'))
        setNombre(l['nombres']+" "+l['apellidos'])
      },[])
      
      
    return (
        <>
            <div id="menu">
                <button id="hidden"></button>
                <button id="DESP"></button>
                <div id="btnss">
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