import React,{useState,useEffect,useContext} from "react";
//import DatatableRTA  from "../Component/DatatableRTA";
import MUIDataTable, { ExpandButton } from "mui-datatables";
//import clsx from 'clsx';

import {SocketContext} from "../Context/socketio"

const API=process.env.REACT_APP_BACKEND;


const Option ={
    download: false,
    filterType: "multiselect",
    print: false, 
    searchPlaceholder:"Search..",
    selectableRows:'multiple',
    selectableRowsOnClick:true,
    actionsColumnIndex: -1
    
}

export default function Rta(){
    const socket=useContext(SocketContext);
    const [Compania,setcompania]=useState("");
    const [Lista,setlista]=useState([]);
    const [idComp,setidComp]=useState(1);
    const [lstCompania,setlstCompania]=useState([])
    const obtenerDatos=async(idComp)=>{
        const res = await fetch(`${API}/RTS`,{
          method: "POST",
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body:JSON.stringify({
              compania:idComp
          })
        })

        const data = await res.json();
        setcompania(data.compania);
        setlista(data.listRTS);
        setlstCompania(data.companiList)
        socket.emit('join',{'room':idComp});

    }
   useEffect(() => {
        let id=JSON.parse(sessionStorage.getItem('user'))['compania']
        console.log("Cargado");
        obtenerDatos(id['id']);
        if(Lista.length!=0){
            setTimeout(printh,10000)
        }
        
       
    }, []);
    socket.on('chat',(message)=>{
        let estado=message['estado']
        let esAct=message['estadoactual']
        let user=message['estadoactual']['user']
        let totes=message['totalStates']
        let sup=message['sup']
        var bool=true
        let id=0
        let l={'Ciudad':user['ciudad']['nombre'],
            'Name': user['nombres']+" "+user['apellidos'],
            'Supervisor':sup,
            'date':esAct['hora_inicio'],
            'id':user['id'],
            'id_solvo':user['id_solvo'],
            'state':estado['nombre'],
            'time':'00:00:00',
            'totest':totes[estado['nombre']]}
        const newlist=Lista.map((litem)=>{
            if(litem['id']===l['id']){
                bool=false
                return {...Lista,
                'Ciudad':litem['Ciudad'],
                'Supervisor':litem['Supervisor'],
                'id':litem['id'],
                'id_solvo':litem['id_solvo'],
                'Name':litem['Name'],
                'state':l['state'],
                'totest':l['totest'],
                'time':l['time'],
                'date':l['date']
                }
            }
            return litem
        })
        console.log(newlist)
        setlista(newlist);
        if(bool===true){ 
            setlista([...newlist, l])
            printh();
            bool=false
            console.log(newlist)
        }
    })
    
    
    function printh(){
        console.log("Comenzar")
        for(const a in Lista){
            intervalo(Lista[a]['id']);
        }
        
    }
    function convertFromStringToDate(responseDate) {
        let dateComponents = responseDate.split(' ');
        let datePieces = dateComponents[0].split("-");
        let timePieces = dateComponents[1].split(":");
        return (new Date(datePieces[0], (datePieces[1] - 1), datePieces[2],
            timePieces[0], timePieces[1], timePieces[2]))
    }
    function agregarCeroSiEsNecesario (valor) {
        if (valor < 10) {
            return "0" + valor;
        } else {
            return "" + valor;
        }
    }
    function milisegundosAMinutosYSegundos (milisegundos) {
        const horas = parseInt(milisegundos / 1000 / 60 / 60);
        milisegundos -= horas * 60 * 60 * 1000;
        const minutos = parseInt(milisegundos / 1000 / 60);

        milisegundos -= minutos * 60 * 1000;
        const segundos = (milisegundos / 1000);
        return `${agregarCeroSiEsNecesario(horas)}:${agregarCeroSiEsNecesario(minutos)}:${agregarCeroSiEsNecesario(segundos.toFixed())}`;
    };
    function iniciar(data,tot){
        let inicio=new Date(convertFromStringToDate(data));
        let diferencia=new Date() - inicio.getTime();
        diferencia += Number(tot);
        let now = new Date();
        let tiempoInicio = new Date(now.getTime() - diferencia);
        let ahora1 = new Date();
        let diferencia1 = ahora1.getTime() - tiempoInicio.getTime();
        let res=milisegundosAMinutosYSegundos(diferencia1);
        return res
    }
    function intervalo(id){
        var a=document.getElementById(id)
        if(a!=null){clearInterval(a.value)}
        var idin=setInterval(()=>{
            if(a!=null){
            let t=a.innerHTML
            let tiempo=t.split(":");
            let h=parseInt(tiempo[0])
            let m=parseInt(tiempo[1])
            let s=parseInt(tiempo[2])
            s=s+5
            if(s>=55){
                s=(s-55)
                m++
                if(m==60){
                    m=0
                    h++
                }
            }
            a.innerHTML=agregarCeroSiEsNecesario(h)+":"+agregarCeroSiEsNecesario(m)+":"+agregarCeroSiEsNecesario(s)
        }

        },5000)
        if(a!=null){
            console.log(idin)
            a.value=idin}
    }
  
    const Columns = [{name:"id_solvo"},
        {name:"Name"},{name:"Supervisor"},
        {name:"Ciudad"},{name:"state",
        },{
            name: "Time",
            label: "",
            options: {
            filter: true,
            customBodyRenderLite: (dataIndex) => {
                var texto="00:00:00"+dataIndex
                texto=iniciar(Lista[dataIndex].date,Lista[dataIndex].totest)
                //let idint=intervalo(Lista[dataIndex].id)
                
                return(<p id={Lista[dataIndex].id} value={0}>{texto}</p>)},
           
            }
            
          },]

    function Actualizar(){
        socket.emit('leave',{'room':idComp})
        let id=document.getElementById('lstCompania').value
        setidComp(id)
        obtenerDatos(id);
        setTimeout(printh,10000)
        
    }  
   
    return(
        <div>
            <div id="eje3">
                <select id="lstCompania" onChange={Actualizar} >
                    {lstCompania.map(comp =>
                    <option key={comp['id']} value={comp['id']}>{comp['nombre']}</option>
                    )}
                </select>
                <MUIDataTable
                title={"RTA  "+ Compania}
                columns={Columns}
                data={Lista}
                options={Option}
                />
            </div>
            
        </div>
    )
}