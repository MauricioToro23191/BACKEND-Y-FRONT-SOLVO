import { Outlet, Link, useNavigate } from "react-router-dom";
import React, { useCallback,useState,useEffect } from "react";
import '../styles/layout.scss';
import jwt_decode from "jwt-decode";

const API=process.env.REACT_APP_BACKEND

const Layout = (props) => {
    const {loge}=props
    const {logueado}=props

    const[nombre,setNombre]=useState("");
    const Navigate = useNavigate(); 
    const logOUT = useCallback(() => Navigate('/', { replace: true }), [Navigate]);
    const logout=async(e)=>{
        e.preventDefault();
        const res=await fetch(`${API}/    console.log('logout is true')
        `,{})
        if(res){
          if(jwt_decode(sessionStorage.getItem('tocken'))!= ''){
            sessionStorage.clear();
            loge(false)
            logOUT();
          }else{
            loge(false)
            logOUT();
          }
        }else{
          console.log(' false');
        }
        
      }
      useEffect(()=>{
        let l = jwt_decode(sessionStorage.getItem('tocken'));
        setNombre(l['Name']+" "+l['LastN'])
      },[])
      
     
    return (
        <>
            <div id="menu" >
                <button id="hidden"  ></button>
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
                        <li><a>Perfil</a></li>
                        <li><a onClick={logout} style={{textDecoration:'none'}}>logout</a></li>
                    </ul>
                </div>
                <Outlet />
            </div>
        </>
    )
}

export default Layout;