import React,{useState,useEffect} from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom';

import Layout from '../Layouts/Layout';
import Login from './login';
import Users from '../Pages/Users';
import Export from './Export';
import States from './States';
import Rta from './RTA';
import {SocketContext,socket} from '../Context/socketio'

export default function App() {
  const [logueado,setLogueado]=useState(false)
  const [inter,seboolinter]=useState(true)
  const [movil,setMovil]=useState(false)


  useEffect(()=>{
    let navegador = navigator.userAgent;
    if (navegador.match(/Android/i) || navegador.match(/webOS/i) || navegador.match(/iPhone/i) || navegador.match(/iPad/i) || navegador.match(/iPod/i) || navegador.match(/BlackBerry/i) || navegador.match(/Windows Phone/i)) {
        console.log("Estás usando un dispositivo móvil!!");
        setMovil(false)
        alert ("Do't is posible access to page")

    } else {
        console.log("No estás usando un móvil");
        setMovil(true)
    }
    if(sessionStorage.getItem('tocken')!=null){
      if(sessionStorage.getItem('perfil')!=4){
        seboolinter(false)
      }else{
        seboolinter(false)
      }
      setLogueado(true)
      
    }
  },[logueado])
  if(movil){
    return (
      <SocketContext.Provider value={socket}>
            <BrowserRouter >
                <Routes>
                      {logueado?<>
                        <Route path='*' element={<center><h1>404 Page not found</h1></center>}/>
                        <Route path='/' element={<Login loge={setLogueado}/>}/>

                        {inter? <Route path='/states' element={<States loge={setLogueado}/>}/>:
                            <Route path='/Layout' element={<Layout loge={setLogueado} logueado={logueado}/>}>
                            <Route index element={<Users />}/>
                            <Route path='/Layout/Export' element={<Export/>}/>
                            <Route path='/Layout/RTA' element={<Rta/>}/>
                          </Route>
                        } </> :<Route path='*' element={<Login loge={setLogueado}/>}/>
                      }
                    </Routes>
            </BrowserRouter>
        </SocketContext.Provider>
    )
  }else{
    document.getElementsByTagName('body').backgroundColor= "rgb(255, 255, 255)";
    return(<center><h1>404 Page not found</h1></center>)
  }
}
 