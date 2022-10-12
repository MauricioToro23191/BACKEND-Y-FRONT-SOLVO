import React,{useState,useEffect,useMemo} from 'react';
const UsuarioContex=React.createContext();

const API=process.env.REACT_APP_BACKEND

export function Usuarioprovider(props){
    const [User,setUser]=useState(null);
    const [perfil,setPerfil]=useState(0)
    const [loadingUser,setLoadingUser]=useState(true);
    
    
    
    const value=useMemo(()=>{
        return(
            {
                User,
                Login,
                perfil,
                loadingUser
            }
        )
    })
    
    return <UsuarioContex.Provider value={value} {...props}/>
}
export function useUsuario(){
    const contex=React.useContext(UsuarioContex)
    if(!contex){
        throw new error('useUsuario debe estar dentro del proveedor Usuario Context')
    }
    return contex
}
