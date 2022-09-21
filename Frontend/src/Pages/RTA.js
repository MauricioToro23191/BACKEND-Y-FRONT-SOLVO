import React,{useState,useEffect,useContext} from "react";
import '../styles/modalRTA.scss'
//import DatatableRTA  from "../Component/DatatableRTA";
import MUIDataTable from "mui-datatables";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteIcon from '@mui/icons-material/Delete';
//import clsx from 'clsx';

import {SocketContext} from "../Context/socketio"

const API=process.env.REACT_APP_BACKEND;




export default function Rta(){
    const socket=useContext(SocketContext);
    const [Lista,setlista]=useState([]);
    const [lstCompania,setlstCompania]=useState([])
    const [cont,setCont]=useState(0);

    const obtenerDatos=async()=>{
        const res = await fetch(`${API}/RTA`,{
          method: "POST",
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body:JSON.stringify({
              compania:sessionStorage.getItem('idComp')
          })
        })

        const data = await res.json();
        console.log('recibido')
        setlista(data.listRTA);
        setlstCompania(data.companiList);
        socket.emit('join',{'room':sessionStorage.getItem('idComp')});
        return data.listRTA
    }
    
    
   useEffect(() => {
        obtenerDatos();
        console.log("Hola")
        return () => {
            socket.off('logoutUser');
            socket.off('Cambio');
        }
    }, [socket]);


    printh();
    socket.on('Cambio',(message)=>{
        let estado=message['estado']
        let esAct=message['estadoactual']
        let user=message['estadoactual']['user']
        let totes=message['totalStates']
        let sup=message['sup']
        var bool=true
        let Lis=Lista
        let l={'Ciudad':user['ciudad']['nombre'],
            'Name': user['nombres']+" "+user['apellidos'],
            'Supervisor':sup,
            'compania':user['compania']['nombre'],
            'date':esAct['hora_inicio'],
            'id':user['id'],
            'id_solvo':user['id_solvo'],
            'idcompania':user['compania']['id'],
            'state':estado['nombre'],
            'time':'00:00:00',
            'totest':totes[estado['nombre']]}
        const newlist=Lis.map((litem)=>{
            if(litem['id']==l['id']){
                bool=false
                return {
                'Ciudad':litem['Ciudad'],
                'Supervisor':litem['Supervisor'],
                'id':litem['id'],
                'compania':litem['compania'],
                'id_solvo':litem['id_solvo'],
                'idcompania':user['compania']['id'],
                'Name':litem['Name'],
                'state':l['state'],
                'totest':l['totest'],
                'time':l['time'],
                'date':l['date']
                }
            }else{
                return litem
            }
            
        })
        if(bool===true){
            setlista([...newlist, l])
            bool=false
        }else{
            setlista(newlist);
        }
        printh;

})
socket.on('logoutUser',(message)=>{
    let logout=message['logout']
    let Lis=getLista()
    let id=message['id']
    let indexRemove=-1
    if(logout){  
        const newlist=Lis.map((litem,index)=>{
            if(litem['id']==id){
                indexRemove=index       
            }else{
                return litem
            }
        })
        if(indexRemove!=-1){
            newlist.pop(indexRemove)
        }    
        setlista(newlist);
    }
    printh

})


const Option ={
    download: false, 
    filter: true,
    filterType: "dropdown",
    print: false,
    searchPlaceholder: "Search..",
    selectableRows: 'multiple',
    fixedHeader: true,
    viewColumns:false,
    fixedSelectColumn:false,
    selectableRowsOnClick: false,
    selectableRowsHideCheckboxes: true,
    rowsPerPage:100,
    responsive:'simple',
    setRowProps: (row) => {
        function calcDif(date){
            let ini=new Date(convertFromStringToDate(date));
            let dif=new Date() - ini.getTime();
            let n = new Date();
            let ti = new Date(n.getTime() - dif);
            let ah = new Date();
            let dif1 = ah.getTime() - ti.getTime();
            return dif1
        }
        if (row[4] === "Lunch") {
            let d=calcDif(row[5])
            if(d>3600000){
                return {
                    style: { backgroundColor: "red"}
                }
            }else{
                return {
                    style: { backgroundColor: "#C8EBFF"}
                }
            }
        }else if(row[4] === "Break"){
            let d=calcDif(row[5])
            if(d>900000){
                return {
                    style: { backgroundColor: "red"}
                }
            }else{
                return {
                    style: { backgroundColor: "#C8EBFF"}
                }
            }
        }else if(row[4]==="Not Available"){
                let d=calcDif(row[5])
                if(d>900000){
                    return {
                        style: { backgroundColor: "red"}
                    }
                }else{
                    return {
                        style: { backgroundColor: "#C8EBFF"}
                    }
                }
        }else if(row[4] === "Personal"){
            let d=calcDif(row[5])
            if(d>900000){
                return {
                    style: { backgroundColor: "red"}
                }
            }else{
                return {
                    style: { backgroundColor: "#C8EBFF"}
                }
            }
        
        }else if(row[4] === row[4] === "Team Meeting"){
            let d=calcDif(row[5])
            if(d>7200000){
                return {
                    style: { backgroundColor: "red"}
                }
            }else{
                return {
                    style: { backgroundColor: "#C8EBFF"}
                }
            }
        
        }else if(row[4] === "Coaching"){
            let d=calcDif(row[5])
            if(d>900000){
                return {
                    style: { backgroundColor: "red"}
                }
            }else{
                return {
                    style: { backgroundColor: "#FFF2B9"}
                }
            }
            
        }else{
            return {
                style: { backgroundColor: "#36FA0F"}
            }

        }
    },
    
}
    function printh(){
        
        if(Lista!=null){
            if(Lista.length!=0){
                if(sessionStorage.getItem('idLista')!=null){
                    clearInterval(sessionStorage.getItem('idLista'))
                }   
                sessionStorage.setItem('idLista',setInterval(() => {
                let newl=Lista.map((litem)=>{
                    return litem
                })
                setlista([...newl])
            }, 5000))
                
                for (const a in Lista){
                    if(Lista[a]['id']!=null){
                        intervalo(Lista[a]['id'])
                        
                    }
                }
            }
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
    function iniciar(data){
        let inicio=new Date(convertFromStringToDate(data));
        let diferencia=new Date() - inicio.getTime();
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
                
            },6000)
            if(a!=null){
                a.value=idin}
        
       
    }
    function updateStateUser(idState){
        
        let a=confirm('Are you sure you want to change the status of this user?')
        if(a){
           socket.emit('ChangeStateSuptoUser',{'message':{'iduser':document.getElementById('id1').value,'newStateid':idState,'responsable':JSON.parse(sessionStorage.getItem('user'))['nombres']},'room':sessionStorage.getItem('idComp')})
            alert('Updated successfully')
            close();
        }else{
            alert('could not update')
        }
    }
    function close() {
        document.getElementsByTagName('th')[0].style.position='sticky';
        document.getElementsByTagName('th')[1].style.position='sticky';
        document.getElementsByTagName('th')[2].style.position='sticky';
        document.getElementsByTagName('th')[3].style.position='sticky';
        document.getElementsByTagName('th')[4].style.position='sticky';
        document.getElementsByTagName('th')[5].style.position='sticky';
        document.getElementsByTagName('th')[6].style.position='sticky';
        document.getElementById("MyModal1").style.display = 'none';
    }
  
    const Columns = [{name:"id_solvo", style:""},
        {name:"Name"},{name:"Supervisor"},
        {name:"Ciudad"},{name:"state",
        },{name:"date",options: {
            display:false
        }},{
            name: "Time",
            label: "",
            options: {
            filter: false,
            customBodyRenderLite: (dataIndex) => {
                var texto="00:00:00"
                if(Lista.length!=0){
                    texto=iniciar(Lista[dataIndex].date)
                }
                
                return(<p id={Lista[dataIndex].id} value={0}>{texto}</p>)},
            }
            
          },{
            name: "ACTION",
            options: {
              filter: false,
              sort: false,
              empty: true,
              customBodyRenderLite: (dataIndex) => {
                
                return (
                    <>
                    <center>
                        <DriveFileRenameOutlineIcon  onClick={() =>{{ document.getElementById('MyModal1').style.display = "block" ;
                        document.getElementById('id1').value=Lista[dataIndex]['id']
                        document.getElementById('titleModal1').innerHTML="Select the state for "+Lista[dataIndex]['Name']+" ?"
                        document.getElementsByTagName('th')[0].style.position='static'
                        document.getElementsByTagName('th')[1].style.position='static'
                        document.getElementsByTagName('th')[2].style.position='static'
                        document.getElementsByTagName('th')[3].style.position='static'
                        document.getElementsByTagName('th')[4].style.position='static'
                        document.getElementsByTagName('th')[5].style.position='static'
                        document.getElementsByTagName('th')[6].style.position='static'
                        }}}/>

                        <div id="MyModal1" className="modalcont1">
                        <div id="modal-cont1">
                        <div id="contm1">
                            <div className="infomodal1">
                                <button style={{float:"right", border:"none", backgroundColor:"white"}} onClick={close}>X</button>
                                <center>
                                <h1 id="titleModal1"></h1>
                                </center>
                                <div className="layoutBtn1">
                                    <div id="btn11" className="btn1"><input id="id1" type="hidden"></input></div>
                                    <div id="btn11" className="btn1"><button className="btns1" id="ava1" onClick={() => updateStateUser(2)} ></button> </div>
                                    <div id="btn21" className="btn1"><button className="btns1" id="unav1" onClick={() => updateStateUser(9)}>PERSONAL</button></div>
                                    <div id='btn31' className="btn1"><button className="btns1" id="lunch1" onClick={() => updateStateUser(6)}>LUNCH</button></div>
                                    <div id="btn41" className="btn1"><button className="btns1" id="break1" onClick={() => updateStateUser(5)}>BREAK</button></div>
                                    <div id="btn51" className="btn1"><button className="btns1" id="meet1" onClick={() => updateStateUser(7)}>MEETING</button></div>
                                    <div id="btn61" className="btn1"><button className="btns1" id="coach1" onClick={() => updateStateUser(8)}>COACHING</button></div>
                                </div>
                            
                            </div>
                            
                        </div>
                        
                        </div>
                        
                    </div>
                    </center>
                    </>
                );
              }
            }
          }]

    function Actualizar(){
        socket.emit('leave',{'room':sessionStorage.getItem('idComp')})
        let id=document.getElementById('lstCompania').value
        sessionStorage.setItem('idComp',id)
        obtenerDatos();
        if(sessionStorage.getItem('idLista')!=null){
            setInterval(sessionStorage.getItem('idLista'))
        }

        //document.getElementById('RT').click()
    }  
    const TitleChange = () =>{
        return(
        <>
        <strong style={{fontSize: "150%"}}>RTA </strong>
        <select id="lstCompania" value={sessionStorage.getItem('idComp')}onChange={Actualizar}>
        {lstCompania.map(comp => 
            <option key={comp['id']} value={comp['id']}>{comp['nombre']}</option>
        )}
        
    </select>
    </>
    )
    }
    
    return(
        <div>
            <div id="eje3">
            
            <MUIDataTable
            title={<TitleChange/> }
            columns={Columns}
            data={Lista}
            options={Option}
            />
            </div>
            
        </div>
    )
}