import React,{useState,useEffect,useContext} from "react";
import MUIDataTable from "mui-datatables";
import DatatableRTA  from "../Component/DatatableRTA";
import {SocketContext} from "../Context/socketio"

const API=process.env.REACT_APP_BACKEND;

export default function Rta(){
    const socket=useContext(SocketContext);
    //const [data,setdate]=useState("");
    const [Compania,setcompania]=useState("");
    const [Lista,setlista]=useState([]);
    
    const obtenerDatos=async()=>{
        const res = await fetch(`${API}/RTS`,{
          method: "POST",
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body:JSON.stringify({
              user:sessionStorage.getItem('user')
          })
        })
        const data = await res.json();
        console.log(data)
        setcompania(data.compania);
        setlista(data.listRTS);

    }
    useEffect(() => {
        obtenerDatos();
        //socket.emit('chat',"   desde React")
        //socket.on('chat',(mensaje) => {
        //    console.log(mensaje); // 1
    //});

    }, []);
    const print= ()=>{
        Lista[0]['Ciudad']="Cali"
        setlista(Lista)
        console.log(Lista)
            
    }
   
    return(
        <div>
            <div id="eje3">
                <button onClick={print}>Cambiar</button>
                <button onClick={obtenerDatos}>Actualizar</button>
                <DatatableRTA Compania={Compania} Lista={Lista}/>
            </div>
        </div>
        
    )
}