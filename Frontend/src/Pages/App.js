import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom';

import Layout from '../Layouts/Layout';
import Login from './login';
import Users from '../Pages/Users';
import Export from './Export';
import States from './States';
import Rta from './RTA';
import {SocketContext,socket} from '../Context/socketio'

export default function App() {
  function confirmar(){
    alert('comfirmado')
  }
  return (
    <SocketContext.Provider value={socket}>
        <BrowserRouter >
            <Routes onunload={confirmar}>
                <Route exact path='/' element={<Login />}/>
                <Route path='/Layout' element={<Layout />}>
                    <Route index element={<Users />}/>
                    <Route path='/Layout/Export' element={<Export/>}/>
                    <Route path='/Layout/RTA' element={<Rta/>}/>
                </Route>
                <Route path='/states' element={<States/>}/>
                </Routes>
        </BrowserRouter>
      </SocketContext.Provider>
  )
}
 