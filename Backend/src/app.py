# Controlador principal de la pagina web
#importaciones necesarias de flask

from flask import redirect, url_for,jsonify,request
from flask_cors import CORS
#from flask_json import FlaskJSON
from flask_socketio import SocketIO,emit,join_room,leave_room
import json
#controlador de Base de datos 

# Models:
from models.ModelState import ModelState
from models.entities.User import User
from init import init_app
#asignacion de variables generales 
app,db=init_app()
CORS(app)
#csrf = CSRFProtect(app)

def getdb():
    return db
# sockets
socket=SocketIO(app,cors_allowed_origins="*",async_handlers=True)

@app.route('/RTS',methods=['GET', 'POST'])
def RTS():
    compania=0
    if request.json['compania']!="":
        compania=request.json['compania']
    listComp=ModelState.listCompania(db)
    #u = json.loads(request.json['user'])
    #usuario=User(int(u['id']),u['correo_solvo'],u['compania'],u['ciudad'],None,u['id_solvo'],u['nombres'],u['apellidos'],int(u['perfil']),u['estado'],int(u['id_supervisor']),u['namesupervisor'])
    listRT=ModelState.listRTS(db,compania)
    
    return jsonify({'compania':listRT[0]['compania'] ,'listRTS':listRT,'companiList':listComp})

@app.route('/reporte1',methods=['GET', 'POST'])
def reporte():
    lista=ModelState.reporte1(db,request.json['FechaInicio'],request.json['Fechafin'])
    return jsonify({'listRTS':lista})

@app.route('/reporte2',methods=['GET', 'POST'])
def reporte2():
    #request.json['FechaInicio']
    lista=ModelState.reporte2(db,request.json['FechaInicio'])
    return jsonify({'listRTS':lista})
#Respuestas a error por no estar autorizado para acceder a la pagina   
def status_401(error):
    return redirect(url_for('Usuario.login'))

#respuesta cuando no existe la ruta a la que intenta acceder
def status_404(error):
    return "<h1>Página no encontrada</h1>", 404


@socket.on('chat')
def chat(message):    
    print(message['room'])
    #print("chat "+str(message['message']))
    emit('chat', message['message'], to=message['room'])
   
@socket.on('join')
def join(room):
    
    #print(room)
    print("Join")
    print (room['room'])
    join_room(room['room'])
    emit('join'," se unio a la habitacion", to=room['room'])
    
@socket.on('leave')
def leave(room):
    username="mauro"   
    print("leave")
    leave_room(room['room'])
    emit('leave', username+" abandono la habitacion", to=room['room'])
 
@socket.on('event')
def event(json):
    #print ('estamos en evento',json)
    emit('event',json,broadcast=True)

@socket.on('connect')
def test_connect():
    print ("conectado")
    #emit('my response','Connected')

@socket.on('disconnect')
def test_disconnect():
    print('Client disconnected')
    return True

#Cerrar sesion    
@app.route('/logout')
def logout():
    #user=request.json('user')
    #c={'room': user.compania['nombre']}
    #ModelState.call_procedure(db,user,user,1)
    #join(c)
    #message=dict({'message':{'logout':True,'id':user.id}})
    #socket.emit('chat',json.dumps(message['message']),to =c['room'])    #elimina la sesion iniciada 
    #leave(c)
    #logout_user()
    return jsonify({'logout':True})

#inicio de la pagina 
if __name__ == '__main__':
    socket.run(app,host='0.0.0.0',port=5000)
    app.register_error_handler(401, status_401)
    app.register_error_handler(404, status_404)
    

    
    

#Consulta estado actual 
#SELECT ID_HISTORIAL,ID_INTERPRETER,ID_SOLVO,RESPONSABLE,HORA_INICIO,ID_ESTADO FROM HISTORIAL WHERE ID_INTERPRETER=2 AND TEMP_BOOLEAN=1
#reporte y sumas 
#SELECT * FROM historial where HORA_INICIO like '%2022-06-13%' and HORA_FINAL <> 'null' order by id_estado ;