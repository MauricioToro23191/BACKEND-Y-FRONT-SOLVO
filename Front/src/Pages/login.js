import React,{useState,useCallback} from "react";
import {useNavigate} from "react-router-dom";
import '../styles/login.scss';
const API=process.env.REACT_APP_BACKEND
const Login = ()=>{

    const [user,setuser] = useState("");
    const [pass,setpass] = useState(""); 
    
    const Navigate = useNavigate();
    const changePageMenu = useCallback(() => Navigate('/Layout',{replace:true}),[Navigate]);
    const changePageState = useCallback(() => Navigate('/states',{replace:true}),[Navigate]);
    const handelSubmit=async (e)=>{
        e.preventDefault();
        if(user!="" || pass!=""){
            const res=await fetch(`${API}/usuario/login`,{
                method: "POST",
                headers: {
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
                if(r['usuario'].perfil==4){
                    console.log('interprete');
                    sessionStorage.setItem("user",JSON.stringify(r['usuario']['id']));
                    changePageState();
                }else{
                    console.log('admin');
                    sessionStorage.setItem("user", r['usuario']['id']);
                    sessionStorage.setItem("perfil",JSON.stringify(r['usuario']));
                    changePageMenu();
                }
            }else{
                document.getElementById('response').textContent=r['response'];
            }
            console.log(r);
        }else{
            document.getElementById('response').textContent="Faltan campos por llenar"
        }
    }
    
    return(
        <>
            <div id="Container">
                <div id="sideL">
                    <p></p>
                </div>
                <div id="sideR">
                    <p id="response"></p>
                    <form onSubmit={handelSubmit}>
                    <input type="email" placeholder="email" id="user" onChange={(e)=>setuser(e.target.value)}></input>
                    <input type="password" id="pass" placeholder="Password" onChange={(e)=>setpass(e.target.value)}></input>
                    <span>{user}</span>
                    <span>{pass}</span>
                    <input type="submit"  value="Ingresar"/>
                    
                    </form>
                </div>
            </div>
        </>
        )
}

export default Login;