import React,{useEffect,useState} from "react";
import '../styles/Users.scss';
import { DataTable } from "../Component/DataTable";
const API=process.env.REACT_APP_BACKEND;

export default function Users(){
    const [listUser,setListUSer]=useState([])
    const [listSup,setListSup]=useState([])
    const [listAdmin,setListAdmin]=useState([])
    const [listTeam,setListTeam]=useState([])
    const [listPerfil,setListPerfil]=useState([])
    const [listCitys,setListCitys]=useState([])
    const [listSites,setListSites]=useState([])

    const [listCompanys,setListCompanys]=useState([])
    const [listCitycompanys,setListCitycompanys]=useState([])
    const obtenerDatos=async()=>{
        const res = await fetch(`${API}//usuario/ListUser`,{
            method: "POST",
            headers: {
                Authorization:sessionStorage.getItem('tocken'),
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                'company': sessionStorage.getItem('idComp'),
                'perfil':sessionStorage.getItem('perfil')
            })}
        )
        const data = await res.json();
        setListUSer(data.LisUser)
        setListSup(data.Sups)
        setListAdmin(data.Admins)
        setListTeam(data.Teams)
        setListPerfil(data.Perfils)
        setListCitys(data.Citys)
        setListSites(data.Sites)
        setListCompanys(data.Companys)
        setListCitycompanys(data.Citycompanys)
    }
    
    useEffect(() => {
        obtenerDatos()
    }, []);
    return(
        <div id="eje3">
                <DataTable listUser={listUser} listSup={listSup} listAdmin={listAdmin} listTeam={listTeam} listPerfil={listPerfil} listCitys={listCitys} listCompanys={listCompanys} listCitycompanys={listCitycompanys} listSites={listSites} obtenerDatos={obtenerDatos}/>
        </div>
    )
}