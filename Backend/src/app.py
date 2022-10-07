# Controlador principal de la pagina web
#importaciones necesarias de flask

from flask import redirect, url_for,jsonify,request,redirect,url_for
from flask_cors import CORS
#from flask_json import FlaskJSON
from flask_socketio import SocketIO,emit,join_room,leave_room
from dotenv import load_dotenv
#controlador de Base de datos 

# Models:
from models.ModelState import ModelState
from init import init_app2
#asignacion de variables generales 
app,db=init_app2()
CORS(app)

#csrf = CSRFProtect(app)

def getdb():
    return db
# sockets
socket=SocketIO(app,cors_allowed_origins="*",async_handlers=True)

@app.route('/RTA',methods=['GET', 'POST'])
def RTA():
    compania=0
    listComp=[]
    listRT=[]
    if request.json['compania']!="":
        compania=request.json['compania']
    listComp=ModelState.listCompania(db)
    listRT=ModelState.listRTA(db,compania)
    if listRT==None or listComp==None:
        return jsonify({'compania':listComp[int(compania)-1]['nombre'],'listRTS':[],'companiList':listComp})
    else:
        return jsonify({'compania':listRT[0]['compania'] ,'listRTA':listRT,'companiList':listComp})

@app.route('/reporte1',methods=['GET', 'POST'])
def reporte():
     if request.method == 'POST':
        lista=ModelState.reporte1(db,request.json['FechaInicio'],request.json['Fechafin'],request.json['company'])
        listComp=ModelState.listCompania(db)
        return jsonify({'listExport':lista,'listcomp':listComp})

@app.route('/reporte2',methods=['GET', 'POST'])
def reporte2():
    if request.method == 'POST':
        lista=ModelState.reporte2(db,request.json['FechaInicio'],request.json['company'])
    else:
        lista=ModelState.reporte2(db,"",1)
    listComp=ModelState.listCompania(db)
    return jsonify({'listExport':lista,'listcomp':listComp})
#Respuestas a error por no estar autorizado para acceder a la pagina   
def status_401(error):
    return redirect(url_for('Usuario.login'))

#respuesta cuando no existe la ruta a la que intenta acceder
def status_404(error):
    return "<h1>Página no encontrada</h1>", 404


@socket.on('Cambio')
def chat(message):    
    #print('Chat to room: ',message['room'])
    #print('\n','Cambio', message['message'], 'to= ',message['room'])
    emit('Cambio', message['message'], to=message['room'])


@socket.on('logoutUser')
def chat(message):    
    #print('\n','LogoutUSER', message['message'], 'to= ',message['room'])
    emit('logoutUser', message['message'], to=message['room'])
@socket.on('ChangeStateSuptoUser')
def chat(message):    
    ##print('\n','ChangeStateSuptoUser', message['message'], 'to= ',message['room'])
    emit('ChangeStateSuptoUser', message['message'], to=message['room'])
   
@socket.on('join')
def join(room):
    #print("Join")
    #print (" se unio a la habitacion", room['room'])
    join_room(room['room'])
    emit('join'," se unio a la habitacion", to=room['room'])
    
@socket.on('leave')
def leave(room):
    #print("abandono la habitacion","leave",room['room'])
    leave_room(room['room'])
    emit('leave', " abandono la habitacion", to=room['room'])
 

@socket.on('connect')
def test_connect():
    print ("conectado")
    #emit('my response','Connected')

@socket.on('disconnect')
def test_disconnect():
    print('Client disconnected')
    return True

#Cerrar sesion    
@app.route('/logout',methods=['GET', 'POST'])
def logout():
    u =request.json['user']
    ModelState.call_procedure(db,u['id'],u['Name'],1)
    return jsonify({'logout':True})

@app.route('/logoutAdmin')
def logoutAdmin():
    return jsonify({'logout':True})

#inicio de la pagina 
if __name__ == '__main__':
    try:
        load_dotenv()
        app.register_error_handler(404, status_404)
        app.register_error_handler(401, status_401)
        socket.run(app,host='0.0.0.0',port=5000)
    except EOFError:
        print('Hello user it is EOF exception, please enter something and run me again')
    except KeyboardInterrupt:
        print('Hello user you have pressed ctrl-c button.')
    else:
        print('Hello user there is some format error')

    

    
    

#Consulta estado actual 
#SELECT ID_HISTORIAL,ID_INTERPRETER,ID_SOLVO,RESPONSABLE,HORA_INICIO,ID_ESTADO FROM HISTORIAL WHERE ID_INTERPRETER=2 AND TEMP_BOOLEAN=1
#reporte y sumas 
#SELECT * FROM historial where HORA_INICIO like '%2022-06-13%' and HORA_FINAL <> 'null' order by id_estado ;