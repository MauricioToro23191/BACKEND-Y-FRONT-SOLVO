import MUIDataTable from "mui-datatables";
import { IconButton, Tooltip,Button,ButtonGroup } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React,{useState,useEffect} from "react";
import DatePicker from "./DatePicker";
import subDays from "date-fns/subDays";


import "../styles/tableUsers.scss"
const Columns2 = ["Date","Solvo id","Name","Last Name","Supervisor","Start Time","Final Time","By","State","Time"]
const Columns1 = ["Date","Solvo id","Name","Last Name","Supervisor","Available","Not Available","Break","Lunch","Team Meeting","Coaching"]
const API=process.env.REACT_APP_BACKEND;

export const DataTableE =() => {
    const [data,setdate]=useState("");
    const [listCompany,setlistCompany]=useState([])
    const [Columns,setColumns]=useState(Columns1);       
    const [ChangeStyle, setChangeStyle] = useState(sessionStorage.getItem('reporte'));
    const Option = {
        download: true,
        filter: true,
        filterType: "multiselect",
        print: false,
        searchPlaceholder: "Search..",
        selectableRows: 'multiple',
        selectableRowsOnClick: false,
        selectableRowsHideCheckboxes: true,
        fixedSelectColumn:false,
        viewColumns:false,
        responsive: "simple",
        fixedHeader: false,
        enableNestedDataAccess : ',',
        rowsPerPage:100,
        downloadOptions: {
            filename: 'SOLVO_RTA_REPORT.csv',
            separator: ',',
            filterOptions: {
                useDisplayedColumnsOnly: true,
                useDisplayedRowsOnly: true,
            }
        },setCellProps:() => {
            return {
                style: {
                    backgroundColor: "yellow"
                  }
            }
        }
        
        }
    
    const obtenerDatos=async()=>{
        const res = await fetch(`${API}/reporte1`,{
          method: "POST",
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body:JSON.stringify({
            FechaInicio:new Date(sessionStorage.getItem('startDate')).toISOString().split('T')[0],
            Fechafin:new Date(sessionStorage.getItem('endDate')).toISOString().split('T')[0],
            company:sessionStorage.getItem('idComp')
          })
        })
        const data1 = await res.json();
        setdate(data1)
        setlistCompany(data1['listcomp'])
        sessionStorage.setItem('reporte',false)


    }
    const obtenerDatosR2=async()=>{
        const res = await fetch(`${API}/reporte2`,{
          method: "POST",
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body:JSON.stringify({
            FechaInicio:new Date(sessionStorage.getItem('startDate')).toISOString().split('T')[0],
            company:sessionStorage.getItem('idComp')
          })
        })
        const data1 = await res.json();
        setdate(data1)
        setlistCompany(data1['listcomp'])
        sessionStorage.setItem('reporte',true)

    }
    useEffect(() => {
        cambiarReporte();
    }, []);
    
    function cambiarReporte(){
        if(ChangeStyle){
            setColumns(Columns1);
            obtenerDatosR2();
        }else{
            setColumns(Columns2);
            obtenerDatos();
        }
            
    }
    const cambiComp=()=>{
        sessionStorage.setItem('idComp',document.getElementById('listComp').value)
        if(ChangeStyle){
            setColumns(Columns1);
            obtenerDatosR2();
        }else{
            setColumns(Columns2);
            obtenerDatos();
        }
    } 
      
    const TitleChange = () => {
        const Consolidado = {
            backgroundColor: `${ChangeStyle ? "#F26100" : "#585858"}`,
            color: "white",
            border: "solid 1px black",
            width: "50%",
        };
        const OtroBtn = {
            backgroundColor: `${!ChangeStyle ? "#F26100" : "#585858"}`,
            color: "white",
            border: "solid 1px black",
            width: "50%",
        };
        const handleChange = () => {
            let v=!ChangeStyle
            setChangeStyle(!ChangeStyle); 
            if(v){
                setColumns(Columns1);
                obtenerDatosR2();
                sessionStorage.setItem('reporte',true)
            }else{
                setColumns(Columns2);
                obtenerDatos();
                sessionStorage.setItem('reporte',false)
            }
        };
        return(
            <>
            <Tooltip title="Change Report">
                <ButtonGroup >
                    <Button style={OtroBtn} onClick={handleChange}> Detallado </Button>
                    <Button style={Consolidado} onClick={handleChange}>Consolidado</Button>
                </ButtonGroup>
            </Tooltip>
            </>
        )
    };
        
        const CustomToolbar = () => {
            
            function cambio(){
                let v=ChangeStyle
                if(!v){
                    obtenerDatos();
                }else{
                    obtenerDatosR2();
                }
            }
            if(sessionStorage.getItem('perfil')==1){
                return (
                    <>
                        <div>
                            <br/>
                            <br/>
                            <strong>change company:  </strong>
                            <select value={sessionStorage.getItem('idComp')} id="listComp" onChange={cambiComp}>
                                {listCompany.map(comp => 
                                    <option key={comp['id']} value={comp['id']}>{comp['nombre']}</option>
                                )}
                            </select><br/><br/>
                            <strong >Report:  </strong>
                            <TitleChange/>
                            <br/>
                            <br/>
                            <Button variant="contained" color="primary" style={{float:"left" ,position:"relative",backgroundColor:"#F26100" }}onClick={cambio}> Show </Button>
                            <DatePicker style={{float:"left" ,position:"relative" }} show={ChangeStyle}/><br/>
                        </div>
                    </>
                );
        }else{
            return (
                <>
                    <div>
                        <br/>
                        <br/>
                        <strong >Report:  </strong>
                    <TitleChange/>
                    <br/>
                    <br/>
                    <Button variant="contained" color="primary" style={{float:"left" ,position:"relative",backgroundColor:"#F26100" }}onClick={cambio}> Show </Button>
                    <DatePicker style={{float:"left" ,position:"relative" }} show={ChangeStyle}/><br/>
                    
                </div>
            </>
        );
        }
        
        };


    
    function close() {
        var modal = document.getElementById("Mymodal");
        var body = document.getElementsByTagName("body")[0];
        modal.style.display = "none";
        body.style.position = "inherit";
        body.style.height = "auto";
            body.style.overflow = "visible";
        }
    function modal() {
        var modal = document.getElementById("Mymodal");
        var body = document.getElementsByTagName("body")[0];
        modal.style.display = "block";
        body.style.position = "static";
        body.style.height = "100%";
        body.style.overflow = "hidden";
    }
        
        
    return (
        <>  
            <div id="Mymodal" className="modalcont">
                <div id="modal-cont">
                    <div id="contm">
                        <div className="sideRi">
                            <button className="buttonClose" onClick={close} >hola</button>
                        </div>
                        <div className="sideLe">
                            <form action="">
                                <label >SoLvoID</label>
                                <input type="text" name="SolID" id="SolID" className="inputs" />
                                <label >First Name</label>
                                <input type="text" name="firstNAme" id="firstName" className="inputs" />
                                <label >Last Name</label>
                                <input type="text" name="lastName" id="lastName" className="inputs" />
                                <label >Email</label>
                                <input type="email" name="corpEmail" id="CorpEmail" className="inputs" />
                                <label >Perfil</label>
                                <select name="Perfil" id="perfil" className="inputs">
                                    <option value="">-</option>
                                    <option value="">Interpreter</option>
                                    <option value="">Supervisor</option>
                                    <option value="">Team Leader</option>
                                    <option value="">Administrador</option>
                                </select>

                                <label >Supervisor</label>
                                <select name="supervisor" id="supervisor" className="inputs">
                                    <option value="">N/A</option>
                                    <option value="">Opcion1</option>
                                    <option value="">Opcion2</option>
                                    <option value="">Opcion3</option>
                                </select>
                                <label>Account</label>
                                <select name="account" id="account" className="inputs">
                                    <option value="-">-</option>
                                    <option value="">Cyracom</option>
                                    <option value="">Urgently</option>
                                    <option value="">Emed</option>
                                </select>
                                <a href="#company" className="inputs">do you want add another account?</a>
                                <label >Locaction</label>
                                <select name="location" id="location" className="inputs">
                                    <option value="">-</option>
                                    <option value="">Opcion A</option>
                                    <option value="">Opcion B</option>
                                </select>
                                <input type="button" value="ADD" name="add" id="add" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <MUIDataTable
                title={ <CustomToolbar/>}
                columns={Columns}
                data={data.listExport}
                options={Option} 
                />
        </>
    )
}

export default DataTableE;