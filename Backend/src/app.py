# ------------------------Controlador principal de la pagina web----------------
#importaciones necesarias de flask
import zoneinfo
from flask import redirect, url_for,jsonify,request,redirect,url_for,render_template
from flask_cors import CORS
#from flask_json import FlaskJSON
from flask_socketio import SocketIO,emit,join_room,leave_room
#importar variables de entorno 
from dotenv import load_dotenv
#Librerias Usadas para enviar Email para cambio de contraseña
from email.message import EmailMessage
import ssl
from smtplib import SMTP_SSL
#Libreria usada para encryptar passwords
import cryptocode
# Models:
from models.ModelState import ModelState
from models.ModelUser import ModelUser
#Metodos inicializar app
from init import init_app
import random
import os
#asignacion de variables generales 
app,db=init_app()
#Cors for permises from react
CORS(app)
# sockets
socket=SocketIO(app,cors_allowed_origins="*",async_handlers=True)

#funcion que retorna la coneccion con la base de datos 
def getdb():
    return db
#Route que Lista usuarios que estan actualmente en un estado diferente de logout o Not available
@app.route('/RTA',methods=['GET', 'POST'])
def RTA():
    if request.method == 'POST':
        compania=0
        listComp=[]
        listRT=[]
        if request.json['compania']!="":
            compania=request.json['compania']
            listRT=ModelState.listRTA(db,compania)
        listComp=ModelState.listCompania(db)
        if listRT==None or listComp==None:
            return jsonify({'compania':listComp[int(compania)-1]['nombre'],'listRTS':[],'companiList':listComp})
        else:
            return jsonify({'compania':listRT[0]['compania'] ,'listRTA':listRT,'companiList':listComp})

#Route retuna el reporte detallado de los cambios de estado en un rango de fechas determinado
@app.route('/reporte1',methods=['GET', 'POST'])
def reporte():
    if request.method == 'POST':
        lista=ModelState.reporte1(db,request.json['FechaInicio'],request.json['Fechafin'],request.json['company'])
        listComp=ModelState.listCompania(db)
        return jsonify({'listExport':lista,'listcomp':listComp})

#Route retuna el reporte Consolidado de los cambios de estado en una fecha especifica
@app.route('/reporte2',methods=['GET', 'POST'])
def reporte2():
    lista=[]
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
    emit('Cambio', message['message'], to=message['room'])


@socket.on('logoutUser')
def chat(message):    
    emit('logoutUser', message['message'], to=message['room'])

@socket.on('ChangeStateSuptoUser')
def chat(message):    
    emit('ChangeStateSuptoUser', message['message'], to=message['room'])
   
@socket.on('join')
def join(room):
    join_room(room['room'])
    emit('join'," se unio a la habitacion", to=room['room'])
    
@socket.on('leave')
def leave(room):
    leave_room(room['room'])
    emit('leave', " abandono la habitacion", to=room['room'])
 

@socket.on('connect')
def test_connect():
    print ("conectado")

@socket.on('disconnect')
def test_disconnect():
    print('Client disconnected')
    return True

#Cerrar sesion de un interprete
@app.route('/logout',methods=['GET', 'POST'])
def logout():
    u =request.json['user']
    ModelState.call_procedure(db,u['id'],u['Name'],1)
    return jsonify({'logout':True})

#Cerrar sesion de un Admin, Supervisor y Team Lider
@app.route('/logoutAdmin')
def logoutAdmin():
    return jsonify({'logout':True})
    

@app.route('/EmailCode',methods=['GET', 'POST'])
def EmailCode():
    if request.method == 'POST':
        Email=request.json['Email']
        val=ModelUser.ExistsUser(db,Email)
        if(val==True):
            code=request.json['code']
            msg=EmailMessage()
            msg['From']="RTA_SOLVO "
            msg['To']=Email
            msg['Subject']='CODE CHANGE PASSWORD'
            msg.set_content('This should be in the email body')
            msg.add_alternative("Your verification code is as follows: "+ code,subtype='html')
            context=ssl.create_default_context()
            with SMTP_SSL('smtp.gmail.com',465,context=context) as smtp:
                smtp.login(app.config['MAIL_USERNAME'],app.config['MAIL_PASSWORD'])
                smtp.sendmail(app.config['MAIL_USERNAME'],Email,msg.as_bytes())
            return jsonify({'send':True})
        return jsonify({'send':False})


    

#inicio de la pagina 
if __name__ == '__main__':
    try:
        load_dotenv()
        app.register_error_handler(404, status_404)
        app.register_error_handler(401, status_401)
        #inicio de Hilos Socket
        socket.run(app,host='0.0.0.0',port=5000,debug=True)
    except EOFError:
        print('Hello user it is EOF exception, please enter something and run me again')
    except KeyboardInterrupt:
        print('Hello user you have pressed ctrl-c button.')
    else:
        print('Hello user there is some format error')


#Permite enviar correo electronico con las credenciales de inicio de sesion de un usuario determinado 

