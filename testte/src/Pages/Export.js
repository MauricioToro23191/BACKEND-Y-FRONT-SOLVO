import React,{useState,useEffect} from "react";
import DataTableE  from "../Component/DataTableE";
const API=process.env.REACT_APP_BACKEND;

export default function Export(){
    const Columns1 = ["solvoid","name","Lastname","Responsable","supervisor","HORA_INICIO","HORA_FINAL","ID_ESTADO","time"]
    const Columns2 = ["Solvo id","Nombre","Apellidos","Supervisor","Available","Not Available","Break","Lunch","Team Meeting","Coaching"]
    const [data,setdate]=useState("");
    const [FechaInicio,setFechaInicio]=useState("");
    const [Fechafin,setFechafin]=useState(""); 
    const [Columns,setColumns]=useState(Columns1);
    const [Title,setTitle]=useState("");

   
    
    const obtenerDatos=async()=>{
        const res = await fetch(`${API}/reporte1`,{
          method: "POST",
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body:JSON.stringify({
            FechaInicio,
            Fechafin
          })
        })
        const data = await res.json();
        setdate(data)

    }
    const obtenerDatosR2=async()=>{
        const res = await fetch(`${API}/reporte2`,{
          method: "POST",
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body:JSON.stringify({
            FechaInicio
          })
        })
        const data = await res.json();
        setdate(data)

    }
    useEffect(() => {
        let today=new Date().toISOString().slice(0, 10);
        document.getElementById("FechaInicio").value=today;
        document.getElementById("FechaFin").value=today;
        setFechaInicio(today);
        setFechafin(today);
        cambiarReporte();
                   
    }, []);
    
    function cambiarReporte(){
        
        if(document.getElementById('select').value==1){
            setTitle("Reporte detallado")
            document.getElementById('lbFechaFin').style.display='';
            document.getElementById('FechaFin').style.display='';
            setColumns(Columns1);
            obtenerDatos();
        }else{
            setTitle("Reporte Consolidado")
            document.getElementById('FechaFin').style.display='none';
            document.getElementById('lbFechaFin').style.display='none';
            setColumns(Columns2);
            obtenerDatosR2();
        } 
    }
      
    
    return(
        <div>
            <div id="eje3">
                <label>Seleccionar reporte</label>
                <select id="select" onChange={cambiarReporte}>
                    <option value="1">Report1</option>
                    <option value="2">Report2</option>
                </select>
                <label>Fecha inicio</label>
                <input type="date"  id="FechaInicio" onChange={(e)=>setFechaInicio(e.target.value)}/>
                <label id="lbFechaFin">Fecha inicio</label>
                <input type="date" id ="FechaFin"onChange={(e)=>setFechafin(e.target.value)}/>
                <button onClick={cambiarReporte}>Actualizar</button>
                <DataTableE Name={data} Columns={Columns} Title={Title}/>
            </div>
        </div>
        
    )
}