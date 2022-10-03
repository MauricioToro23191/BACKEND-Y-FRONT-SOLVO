import MUIDataTable from "mui-datatables";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import Data from "../Dates/UsersTable.json";
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import React, {useState, useEffect} from 'react';
import{ IconButton,Tooltip }from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import "../styles/tableUsers.scss"

const API=process.env.REACT_APP_BACKEND

export const DataTable = (props) => {
    const {listUser}=props
    const {listSup}=props
    const {listAdmin}=props
    const {listTeam}=props
    const {listPerfil}=props
    const {listCitys}=props
    const {listCompanys}=props
    const {listCitycompanys}=props

    const [Id, setId] = useState(0)
    const [SolId, setSolId] = useState("")
    const [Name, setName] = useState("")
    const [LastN, setLastN] = useState("")
    const [Email, setEmail] = useState("")
    const [Perfil, setPerfil] = useState(4)
    const [ListaSupervisor, setListSupervisor] = useState([])
    const [Supervisor, setSupervisor] = useState(0)
    const [Company, setCompany] = useState(1)

    const [city, setCity] = useState(1)


    const Columns = ["SolID", "Name", "LastN", "Email", "Perfil", "Supervisor", "Company", "City", 
    {
        name: "ACTION",
        options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRenderLite: (dataIndex) => {
            return (
                <>
                <center>
                    <DriveFileRenameOutlineIcon  onClick={() =>{
                    setId(listUser[dataIndex]['id'])
                    document.getElementById('idSolvo').value=listUser[dataIndex]['SolID']
                    setSolId(listUser[dataIndex]['SolID'])
                    document.getElementById('Name').value=listUser[dataIndex]['Name']
                    setName(listUser[dataIndex]['Name'])
                    document.getElementById('lastN').value=listUser[dataIndex]['LastN']
                    setLastN(listUser[dataIndex]['LastN'])
                    document.getElementById('Email').value=listUser[dataIndex]['Email']
                    setEmail(listUser[dataIndex]['Email'])
                    document.getElementById('perfil').value=listUser[dataIndex]['idPerfil']
                    setPerfil(listUser[dataIndex]['idPerfil'])
                    document.getElementById('supervisor').value=listUser[dataIndex]['idSupervisor']
                    setSupervisor(listUser[dataIndex]['idSupervisor'])
                    document.getElementById('company').value=listUser[dataIndex]['idCompany']
                    setCompany(listUser[dataIndex]['idCompany'])
                    document.getElementById('city').value=listUser[dataIndex]['idCity']
                    setCity(listUser[dataIndex]['idCity'])
                        
                    document.getElementById('add').style.display='none'
                    document.getElementById('update').style.display='block'
                    modal()
    }}/>
                    <DeleteOutlineTwoToneIcon onClick={()=>{
                        const res = confirm("¿Seguro que desea Inactivar este Usuario?")
                        if (res == true){
                            Inactivate(listUser[dataIndex]['id'])
                        }
                    }}/>
                    
                </center>
                </>
            );
        }
        }
    }];

    const cambiComp = () =>{
        const id =document.getElementById('listComp').value
        sessionStorage.setItem('idComp', id)
        props.obtenerDatos()
    }

    const TitleChange = () =>{
        if(sessionStorage.getItem('perfil')==1){
            console.log(true)
            return(
                <><br/>
                <strong style={{fontSize: "150%"}} > List Users </strong> <br/><br/>
                <select value={sessionStorage.getItem('idComp')} id="listComp" onChange={cambiComp}>
                    {listCompanys.map(comp => 
                        <option key={comp['id']} value={comp['id']}>{comp['nombre']}</option>
                    )}
                </select>
            </>)
        }else{
            console.log(false)

            return (<><strong style={{fontSize: "150%"}} > List Users </strong> <br/><br/></>)
        }
       
    }

    const Inactivate = async(Id)=>{
        const respuesta = await fetch(`${API}/usuario/inactive`,{
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                'id':Id
            })}
            )
            const data = await respuesta.json();
            props.obtenerDatos()
    }

    function close() {
        document.getElementsByTagName('th')[0].style.position='sticky';
        document.getElementsByTagName('th')[1].style.position='sticky';
        document.getElementsByTagName('th')[2].style.position='sticky';
        document.getElementsByTagName('th')[3].style.position='sticky';
        document.getElementsByTagName('th')[4].style.position='sticky';
        document.getElementsByTagName('th')[5].style.position='sticky';
        document.getElementsByTagName('th')[6].style.position='sticky';
        document.getElementsByTagName('th')[7].style.position='sticky';
        document.getElementsByTagName('th')[8].style.position='sticky';
        document.getElementById("Mymodal").style.display = 'none';
        
        document.getElementById('idSolvo').value="";
        setSolId("")
        document.getElementById('Name').value="";
        setName("")
        document.getElementById('lastN').value="";
        setLastN("")
        document.getElementById('Email').value="";
        setEmail("")
        document.getElementById('perfil').value=Perfil;
        setListSupervisor(listTeam)
        document.getElementById('sup').value='Team Leader'
        setPerfil(listPerfil[0]['id'])
        setSupervisor(0)
        document.getElementById('company').value=1;
        setCompany(listCompanys[0]['id'])
        document.getElementById('city').value=1;
        setCity(listCitys[0]['id'])
    }

    const Option = {
        download: false,
        filterType: "multiselect",
        print: false,
        searchPlaceholder: "Search..",
        selectableRows: 'multiple',
        selectableRowsOnClick: false,
        fixedSelectColumn: false,
        selectableRowsHideCheckboxes: true,
        responsive:'simple',

        customToolbar: () => {
            return (
                <CustomToolbar />
            )
        }
    }

    const CustomToolbar = () => {
        const handleClick = () =>{
            document.getElementById('add').style.display='block'
            document.getElementById('update').style.display='none'
            modal()
        }
        return (
            <React.Fragment>
                <Tooltip title={"Custom Icon"}>
                    <IconButton onClick={handleClick}>
                        Add <PersonAddAltRoundedIcon/>
                    </IconButton>
                </Tooltip>
            </React.Fragment>
        )
    }

    const Add = async ()=>{
        const respuesta = await fetch(`${API}/usuario/addUser`,{
        method: "POST",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({
            user:{'id':Id, 'SolID':SolId,'Name':Name, 'LastN':LastN, 'Email':Email, 'Perfil':Perfil, 'Supervisor':Supervisor, 'City':City, 'Company':Company},
            perfil:Perfil
        })}
        )
        const data = await respuesta.json();
        props.obtenerDatos()
        close()
    }

    const Update = async ()=>{
        const respuesta = await fetch(`${API}/usuario/Update`,{
        method: "POST",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({
            user:{'id':Id, 'SolID':SolId,'Name':Name, 'LastN':LastN, 'Email':Email, 'Perfil':Perfil, 'Supervisor':Supervisor, 'City':City, 'Company':Company},
            perfil:Perfil
        })}
        )
        const data = await respuesta.json();
        props.obtenerDatos()
        close()
    }

    function perfilValidator() {
        if (Perfil==1){
            document.getElementById('sup').style.display='None'
            document.getElementById('supervisor').style.display='None'
            setSupervisor(0)
        } else {
            document.getElementById('sup').style.display='block'
            document.getElementById('supervisor').style.display='block'
        }
        if (Perfil==2){
            document.getElementById('sup').innerHTML="Administrador"
            console.log(listAdmin)
            setListSupervisor(listAdmin)
        }else if(Perfil==3){
            document.getElementById('sup').innerHTML="Supervisor"
            console.log(listSup)

            setListSupervisor(listSup)
        }else if(Perfil==4){
            document.getElementById('sup').innerHTML="Team Leader"
            console.log(listTeam)

            setListSupervisor(listTeam)
        }
        document.getElementById('perfil').value=Perfil
    }

    function modal() {
        console.log(Perfil)
        perfilValidator();
        document.getElementsByTagName('th')[0].style.position='static';
        document.getElementsByTagName('th')[1].style.position='static';
        document.getElementsByTagName('th')[2].style.position='static';
        document.getElementsByTagName('th')[3].style.position='static';
        document.getElementsByTagName('th')[4].style.position='static';
        document.getElementsByTagName('th')[5].style.position='static';
        document.getElementsByTagName('th')[6].style.position='static';
        document.getElementsByTagName('th')[7].style.position='static';
        document.getElementsByTagName('th')[8].style.position='static';
        document.getElementById("Mymodal").style.display = 'block';
    }

    return (
        <>
                <div id="Mymodal" className="modalcont">
                <div id="modal-cont">
                    <div id="contm">
                        <div className="sideRi">
                            <button className="buttonClose" onClick={close} > X </button>
                        </div>
                        <div className="sideLe">
                            <form action="">
                                <label >SoLvoID</label>
                                <input type="text" name="idSolvo" id="idSolvo" className="inputs" onChange={(e) => setSolId(e.target.value)}/>
                                <label >First Name</label>
                                <input type="text" name="firstNAme" id="Name" className="inputs" onChange={(e) => setName(e.target.value)}/>
                                <label >Last Name</label>
                                <input type="text" name="lastName" id="lastN" className="inputs" onChange={(e) => setLastN(e.target.value)}/>
                                <label >Email</label>
                                <input type="email" name="corpEmail" id="Email" className="inputs" onChange={(e) => setEmail(e.target.value)}/>
                                <label >Perfil</label>
                                <select className="inputs" id="perfil" onClick={perfilValidator} onChange={(e) => setPerfil(e.target.value)}>
                                    {listPerfil.map(perfil =>
                                        <option key={perfil['id']} value={perfil['id']}>{perfil['nombre']}</option>
                                    )}
                                </select>

                                <label id="sup">Supervisor</label>
                                <select className="inputs" id="supervisor" onChange={(e) => setSupervisor(e.target.value)}>
                                    {ListaSupervisor.map(sup =>
                                        <option key={sup['id']} value={sup['id']}>{sup['nombre']}</option>
                                    )}
                                </select>

                                <label >Account</label>
                                <select className="inputs" id="company" onChange={(e) => setCompany(e.target.value)}>
                                    {listCompanys.map(comps =>
                                        <option key={comps['id']} value={comps['id']}>{comps['nombre']}</option>
                                    )}
                                </select>

                                <a href="#company" className="inputs">do you want add another account?</a>
                                <label >Locaction</label>
                                <select className="inputs" id="city" onChange={(e) => setCity(e.target.value)}>
                                    {listCitycompanys.map(Citycompanys =>{
                                        if (Citycompanys['compania']['id'] == Company){
                                            return (
                                                <option key={Citycompanys['ciudad']['id']} value={Citycompanys['ciudad']['id']}>{Citycompanys['ciudad']['nombre']}</option>
                                            )}
                                        }
                                    )}
                                </select>
                                <input type="button" value="UPDATE" name="update" id="update" onClick={Update}/>
                                <input type="button" value="ADD" name="add" id="add" onClick={Add}/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="contTable">
                <MUIDataTable
                    title={<TitleChange/>}
                    columns={Columns}
                    data={listUser}
                    options={Option} />
            </div>
        </>
    )
}