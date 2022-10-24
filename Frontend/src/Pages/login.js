import React, { useState, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.scss";
import { SocketContext } from "../Context/socketio";
import ForgotP from "../Component/forgotP";
import ShowLogin from "../Component/Login";
import jwt_encode from 'jwt-encode';
import jwt_decode from "jwt-decode";

const API=process.env.REACT_APP_BACKEND
const Login = (props) => {
    const {loge}=props;
    const socket=useContext(SocketContext);
    const [user, setuser] = useState("");
    const [pass, setpass] = useState("");
    const [style, setStyle] = useState("sideL");
    const [showForgot, setForgot] = useState(false);
    const [showLogin, setShow] = useState(true);
    const [showChange, setChange] = useState(false);

    const cambiarestado=async(id,user)=>{
    const res =await fetch(`${API}/estados/changeState`,{
      method: "POST",
      headers: {
        Authorization:sessionStorage.getItem('tocken'),
        Accept: "application/json",
        "Content-Type": "application/json",
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
    const Handlesesion =async ()=> {
        console.log()
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
        setShow(false);
        setStyle("sideLA");
    };
    

    const handleLoginS = () => {
        setShow(true);
        setForgot(false);
        setChange(false);
        setStyle("sideL");
      };
      
      const veriCode =async () => {
        let num=document.getElementById('Email').value
        if(!isNaN(parseInt(num))){
            if(parseInt(num)==parseInt(jwt_decode(sessionStorage.getItem('v')))){
                setForgot(false);
                setChange(true);
            }else{
                alert('no es correcto el valor ingresado')
            }
        }else{
            alert('no es correcto el valor ingresado')
        }
      }
      const changePass = async() => {
        let conf=confirm('sure you want to change your password');
        if(conf){
            const res=await fetch(`${API}/usuario/ChangePassword`,{
                method: "POST",
                headers: {
                    Authorization:sessionStorage.getItem('tocken'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({
                    'Email':sessionStorage.getItem('Email'),
                    'password':document.getElementById('Email').value
                })
            })
            const data=await res.json()
            if(data.send){
                alert('Password changed succesfully ')
                handleLoginS()
            }else{
                alert('Password not changed')
                
            }
            
        }
      };
      const validar = async()=>{
        sessionStorage.setItem('Email',document.getElementById('Email').value)
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
            sessionStorage.setItem('v',jwt_encode(a,(process.env.SECRET_KEY+"")))
            const res1=await fetch(`${API}/EmailCode`,{
                method: "POST",
                headers: {
                    Authorization:sessionStorage.getItem('tocken'),
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({
                    'Email':sessionStorage.getItem('Email'),
                    'code':a
                })
            })
            const data1=await res1.json()
            if(data1.send){
                alert('A verification code has been sent to your email, please check your inbox and spam ')
                document.getElementById('Email').value=''
                setShow(false)
                setForgot(true);
                setChange(false);
            }
        }else{
            alert('NO EXIST USER ')
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
              {showLogin ? (
                <ShowLogin setuser={setuser}setpass={setpass} handleForgot={handleForgot}  Handlesesion={Handlesesion}
                />
              ) : (
                ""
              )}
              {!showLogin && !showForgot && !showChange ? (
                <ForgotP
                  title={"Recovery PassWord"}
                  TextCont={"Enter Your Email"}
                  func={validar}
                  back={handleLoginS}
                  type={"email"}
                  placeH={"Email"}
                />
              ) : showForgot ? (
                <ForgotP
                  title={"Verify Code"}
                  TextCont={"enter the code sent to your email"}
                  func={veriCode}
                  back={handleLoginS}
                  type={"number"}
                  placeH={"Code"}
                />
              ) : (
                ""
              )}
              {showChange ? (
                <ForgotP
                  title={"New PassWord"}
                  TextCont={"enter the new Password"}
                  func={changePass}
                  back={handleLoginS}
                  type={"password"}
                  placeH={"New Password"}
                />
              ) : (
                ""
              )}
              <div id={style}>
                <p></p>
              </div>
            </div>
          </div>
        </>
      );
}

export default Login;