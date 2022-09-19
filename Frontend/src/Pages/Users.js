import React,{useEffect,useState} from "react";
import '../styles/Users.scss';
import { DataTable } from "../Component/DataTable";
const API=process.env.REACT_APP_BACKEND;

export default function Users(){
    const [listUser,setListUSer]=useState([])
    const obtenerDatos=async()=>{
        const res = await fetch(`${API}//usuario/ListUser`,{})
        const data = await res.json();
        setListUSer(data.LisUser)
       console.log(data)
    }
    useEffect(() => {
        obtenerDatos()
    }, []);
    return(
        <div id="eje3">
                <DataTable listUser={listUser}/>
        </div>
    )
}