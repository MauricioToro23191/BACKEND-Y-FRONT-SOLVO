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
  const [dash,setbooldash]=useState(false)


  useEffect(()=>{
    if(sessionStorage.getItem('tocken')!=null){
      if(sessionStorage.getItem('perfil')!=4){
        seboolinter(false)
        setbooldash(true)
      }else{
        seboolinter(false)
        setbooldash(true)
      }
      setLogueado(true)
    }
},[logueado])
 
  return (
    <SocketContext.Provider value={socket}>
          <BrowserRouter >
              <Routes>
                    {logueado?<>
                      <Route path='*' element={<p>Route is not found</p>}/>
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
  
}
 