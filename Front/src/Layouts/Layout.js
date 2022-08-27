import {Outlet,Link,useNavigate} from "react-router-dom";
import React,{useCallback} from "react";
import '../styles/layout.scss';
const API=process.env.REACT_APP_BACKEND;

const Layout = () =>{
    const Navigate = useNavigate();
    const logOUT = useCallback(() => Navigate('/',{replace:true}),[Navigate]);
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
    return(
        <>
        <div id="menu">
            <button id="hidden"></button>
            <button id="DESP"></button>
            <div id="btnss">
                <Link to="/Layout"><button id="USERS" className="querybtn"></button></Link>
                <Link to="/Layout/Export"><button id="REP" className="querybtn"></button></Link>
                <button id="COMPANY" className="querybtn"></button>
                <Link to="/Layout/RTA"><button id="RT" className="querybtn"></button></Link>
            </div>
        </div>
        <div id="ContAll">
        <div id="infoUser">
            <p id="imaUser"></p>
            <h2>Juan José Fernández Ruiz</h2>
            <ul>
                <li>Perfil</li>
                <li onClick={logout}>Out</li>
            </ul>
        </div>
            <Outlet/>
        </div>
        </>
    )
}

export default Layout;