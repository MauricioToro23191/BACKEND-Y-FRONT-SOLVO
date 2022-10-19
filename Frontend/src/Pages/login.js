import React, { useState, useCallback,useContext} from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.scss";
import { SocketContext } from "../Context/socketio";
import jwt_decode from "jwt-decode";
import { useUsuario } from "../Context/ContextUser";

const API=process.env.REACT_APP_BACKEND
const Login = (props) => {
    const {loge}=props;
    const socket=useContext(SocketContext);
    const [user, setuser] = useState("");
    const [pass, setpass] = useState("");
    const [style, setStyle] = useState("sideL");
    var code=false


    const cambiarestado=async(id,user)=>{
    const res =await fetch(`${API}/estados/changeState`,{
      method: "POST",
      headers: {
            Authorization:sessionStorage.getItem('tocken'),
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body:JSON.stringify({
          idestado:id,
          user:user,
          responsable:""
      })
    })
    const data =await res.json()
    socket.emit('Cambio',{'message':data,'room':sessionStorage.getItem('idComp')});
  }
        
    const Navigate = useNavigate();
    const changePageMenu = useCallback(() => Navigate('/Layout', { replace: true }), [Navigate]);
    const changePageState = useCallback(() => Navigate('/states', { replace: true }), [Navigate]);
    const Handlesesion =async (e)=> {
        e.preventDefault();
        if(user!="" || pass!=""){
            const res=await fetch(`${API}/usuario/login`,{
                method: "POST",
                headers: {
                    Authorization:sessionStorage.getItem('tocken'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({
                    user,
                    pass
                })
            })
            const r=await res.json();
            if(r['bool']){
                
                sessionStorage.setItem('tocken',r['tocken'])
                if(r['usuario']['idPerfil']==4){
                    console.log(r)
                    cambiarestado(4,JSON.stringify(r['usuario']));
                    sessionStorage.setItem("perfil",r['usuario']['idPerfil']);
                    sessionStorage.setItem("idComp",r['usuario']['idCompany']);
                    sessionStorage.setItem('tz',r['TZ']['id']);
                    sessionStorage.setItem('diferenciaState',0);
                    setStyle("sideLEX"); 
                    loge(true);
                    setTimeout(changePageState, 1500);
                }else{
                    sessionStorage.setItem("perfil",r['usuario']['idPerfil']);
                    sessionStorage.setItem("idComp",r['usuario']['idCompany']);
                    sessionStorage.setItem('startDate',new Date(Date.now()))
                    sessionStorage.setItem('endDate',new Date(Date.now()))
                    sessionStorage.setItem('reporte',true)
                    sessionStorage.setItem('tz',r['TZ']['id']);
                    setStyle("sideLEX"); 
                    loge(true);
                    setTimeout(changePageMenu, 1500);
                }
            }else{
                alert(r['response'])
            }
        }else{
            alert("Faltan campos por llenar")
        }

    }

    const handleForgot = () => {
        document.getElementById("contForm").style.display = "none";
        document.getElementById("formulario2").style.display = "flex";
        document.getElementById('title').innerHTML="Recovery Password"
        document.getElementById('textTitle').innerHTML="Enter  your Email Adress"
        document.getElementById('Email').value=""
        document.getElementById('Email').placeholder="Email"
        document.getElementById('Email').type="email"
        code=true
        setStyle("sideLA");
    };
    

    const handleLoginS = () => {
        document.getElementById("contForm").style.display = "flex";
        document.getElementById("formulario2").style.display = "none";
        setStyle("sideL");
    }
    const handleCode=()=>{
        if(code){
            document.getElementById('title').innerHTML="Recovery Password"
            document.getElementById('textTitle').innerHTML="Enter  code that was sent to your email "
            document.getElementById('Email').value=""
            document.getElementById('Email').placeholder="Code"
            code=false
        }else{
            document.getElementById('title').innerHTML="Recovery Password"
            document.getElementById('textTitle').innerHTML="Enter  your Email Adress"
            document.getElementById('Email').value=""
            document.getElementById('Email').placeholder="Email"
            document.getElementById('Email').value=""

            code=true
        }
    }
    const validar = async()=>{
        console.log(code)
        if(code==false){
            const res=await fetch(`${API}/usuario/validarUser`,{
                method: "POST",
                headers: {
                    Authorization:sessionStorage.getItem('tocken'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({
                    'Email':document.getElementById('Email').value
                })
            })
            const data=await res.json()
            if(data.send){
                let a=aleatorio(6)
                alert('A verification code has been sent to your email, please check your inbox and spam '+a)
                sessionStorage.setItem('v',a)
                document.getElementById('title').innerHTML="Recovery Password"
                document.getElementById('textTitle').innerHTML="Enter  code that was sent to your email "
                document.getElementById('Email').value=""
                document.getElementById('Email').placeholder="Code"
                document.getElementById('Email').type="number"

                code=true
            }else{
                alert('NO EXIST USER ')
            }
        }else{
            let num=document.getElementById('Email').value
            if(!isNaN(parseInt(num))){
                if(parseInt(num)==parseInt(sessionStorage.getItem('v'))){
                    alert('validada la informacion')
                }else{
                    alert('no es correcto el valor ingresado')
                }
            }else{
                alert('no es correcto el valor ingresado')
            }
        }
    }
    

    const recorder = async()=>{
        const res=await fetch(`${API}/Mail`,{
            method: "POST",
            headers: {
                Authorization:sessionStorage.getItem('tocken'),
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                'Email':document.getElementById('Email').value
            })
        })
        const data=await res.json()
        if(data.send){
            alert('Las credenciales han sido enviadas a su correo ')
            handleLoginS()
        }
    }
    function aleatorio1(longitud){
        let numeros="0123456789";
        let letras="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let simbolos="-+*/}{[].,;:_¡?=)(&%$#!°|@<>";
        let todo=numeros+letras+simbolos
        let pass="";
        for(let x=0;x<longitud;x++){
          let aleatorio=Math.floor(Math.random()*todo.length);
          pass+=todo.charAt(aleatorio);
        }
        return pass
    }
    function aleatorio(longitud){
        let numeros="0123456789";
        let pass="";
        for(let x=0;x<longitud;x++){
          let aleatorio=Math.floor(Math.random()*numeros.length);
          pass+=numeros.charAt(aleatorio);
        }
        return pass
    }
    
    return (
        <>
            <div id="Cont">
                <div id="Container">
                    <div className='formulario2' id="formulario2">
                        <div className='form2' >
                            <label className='backLogin' id="backLogin" onClick={handleLoginS} />
                            <label className='title' id="title">Recovery Password</label>
                            <label className='textTitle' id="textTitle">Enter  your Email Adress</label>
                            <input className='Email' type="email" id="Email"placeholder='Email'></input>
                            <button className='nextStep' onClick={validar}/>
                        </div>
                    </div>
                    <div id={style} >
                        <p></p>
                    </div>
                    <div className="contForm" id="contForm">
                        <form className="Formulario">
                            <label>Log In</label>
                            <input placeholder="User" type="email" id="user" onChange={(e) => setuser(e.target.value)}></input>
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
