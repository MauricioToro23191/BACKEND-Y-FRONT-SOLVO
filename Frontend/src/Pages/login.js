import React, { useState, useCallback,useContext} from "react";
import { useNavigate } from "react-router-dom";
import '../styles/login.scss';
import { SocketContext } from "../Context/socketio";
import { useUsuario } from "../Context/ContextUser";

const API=process.env.REACT_APP_BACKEND
const Login = () => {
    const socket=useContext(SocketContext);
    const [Email, setEmail] = useState("");
    const [pass, setpass] = useState("");
    const [style, setStyle] = useState("sideL");
    const cambiarestado=async(id,u)=>{
    const res =await fetch(`${API}/estados/changeState`,{
      method: "POST",
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body:JSON.stringify({
          idestado:id,
          user:u,
          responsable:""
      })
    })
    const data =await res.json()
    console.log(data)
    socket.emit('Cambio',{'message':data,'room':sessionStorage.getItem('idComp')});
  }
        
    const Navigate = useNavigate();
    const changePageMenu = useCallback(() => Navigate('/Layout', { replace: true }), [Navigate]);
    const changePageState = useCallback(() => Navigate('/states', { replace: true }), [Navigate]);
    const Handlesesion =async (e)=> {
        e.preventDefault();
        if(Email!="" || pass!=""){
            const r= await login(Email,pass)
            if(r['bool']){
                if(r['usuario']['idPerfil']==4){
                    console.log('interprete');
                    sessionStorage.setItem("user",JSON.stringify(r['usuario']));
                    setUser(JSON.stringify(r['usuario']))
                    sessionStorage.setItem("perfil",r['usuario']['idPerfil']);
                    sessionStorage.setItem("idComp",r['usuario']['idCompany']);
                    cambiarestado(4,JSON.stringify(r['usuario']));
                    sessionStorage.setItem('diferenciaState',0);
                    //setStyle("sideLEX"); 
                    setTimeout(changePageState, 1500);
                }else{
                    console.log('admin');
                    sessionStorage.setItem("user", JSON.stringify(r['usuario']));
                    sessionStorage.setItem("perfil",r['usuario']['idPerfil']);
                    sessionStorage.setItem("idComp",r['usuario']['idCompany']);
                    sessionStorage.setItem('startDate',new Date(Date.now()))
                    sessionStorage.setItem('endDate',new Date(Date.now()))
                    sessionStorage.setItem('reporte',true)
                    //setStyle("sideLEX"); 
                    setTimeout(changePageMenu, 1500);
                }
            }else{
                alert(r['response'])
            }
            console.log(r);
        }else{
            alert("Faltan campos por llenar")
        }


    }

    const handleForgot = () => {
        document.getElementById("contForm").style.display = "none";
        document.getElementById("formulario2").style.display = "flex";
        setStyle("sideLA");
    }

    const handleLoginS = () => {
        document.getElementById("contForm").style.display = "flex";
        document.getElementById("formulario2").style.display = "none";
        setStyle("sideL");
    }
    const login = async(email,pass)=>{
        const res=await fetch(`${API}/usuario/login`,{
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                user:email,
                pass
            })
           
        })
        const data=await res.json()
        return data

    }

    return (
        <>
            <div id="Cont">
                <div id="Container">
                    <div className='formulario2' id="formulario2">
                        <form className='form2'>
                            <label className='backLogin' onClick={handleLoginS} />
                            <label className='title'>Recovery Password</label>
                            <label className='textTitle'>Enter  your Email Adress</label>
                            <input className='Email' placeholder='Email'></input>
                            <button className='nextStep' />
                        </form>
                    </div>
                    <div id={style} >
                        <p></p>
                    </div>
                    <div className="contForm" id="contForm">
                        <form className="Formulario">
                            <label>Log In</label>
                            <input placeholder="User" type="email" id="user" onChange={(e) => setEmail(e.target.value)}></input>
                            <input type="password" id="pass" placeholder="Pass" onChange={(e) => setpass(e.target.value)}></input>
                            <label id="forgePass" onClick={handleForgot}>Forgot your Password?</label>
                            <input type="submit"onClick={Handlesesion} className="buttonEx" value="Login" />
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;