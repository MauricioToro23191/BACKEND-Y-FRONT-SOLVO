import { Outlet, Link, useNavigate } from "react-router-dom";
import React, { useCallback,useState,useEffect } from "react";
import '../styles/layout.scss';
import jwt_decode from "jwt-decode";
import "../styles/layoutModal.scss"


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
      function getUser(){
        let u =jwt_decode(sessionStorage.getItem('tocken'))
        console.log(u);
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
        document.getElementsByTagName('th')[0].style.position='static';
        document.getElementsByTagName('th')[1].style.position='static';
        document.getElementsByTagName('th')[2].style.position='static';
        document.getElementsByTagName('th')[3].style.position='static';
        document.getElementsByTagName('th')[4].style.position='static';
        document.getElementsByTagName('th')[5].style.position='static';
        document.getElementsByTagName('th')[6].style.position='static';
        document.getElementsByTagName('th')[7].style.position='static';
        document.getElementsByTagName('th')[8].style.position='static';
        document.getElementsByTagName('th')[9].style.position='static';
        document.getElementById("Mymodallayout").style.display = 'block';
      }
      function close(){
        document.getElementsByTagName('th')[0].style.position='static';
        document.getElementsByTagName('th')[1].style.position='static';
        document.getElementsByTagName('th')[2].style.position='static';
        document.getElementsByTagName('th')[3].style.position='static';
        document.getElementsByTagName('th')[4].style.position='static';
        document.getElementsByTagName('th')[5].style.position='static';
        document.getElementsByTagName('th')[6].style.position='static';
        document.getElementsByTagName('th')[7].style.position='static';
        document.getElementsByTagName('th')[8].style.position='static';
        document.getElementsByTagName('th')[9].style.position='static';
        document.getElementById("Mymodallayout").style.display = 'none';
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
                        <li><a onClick={modal}>Perfil</a></li>
                        <li><a onClick={logout} style={{textDecoration:'none'}}>logout</a></li>
                    </ul>
                </div>
                <Outlet />
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
                                <label  name="idSolvo" id="idSolvo1" className="inputslayout"  />
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
            
        </>
    )
}

export default Layout;