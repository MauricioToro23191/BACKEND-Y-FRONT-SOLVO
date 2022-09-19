import flask 
from flask import  request,jsonify
from models.ModelState import ModelState
from models.entities.User import User
estados=flask.Blueprint('menu',__name__,url_prefix='/estados')
import json

#direccionamiento a Pagina de estados 
@estados.route('/getState',methods=['POST'])
def menu():
    from app import getdb
    db=getdb()
    response=None
    if request.method == 'POST':
        u = json.loads(request.json['user'])
        usuario=User(int(u['id']),u['correo_solvo'],u['compania'],u['ciudad'],None,u['id_solvo'],u['nombres'],u['apellidos'],int(u['perfil']),u['estado'],int(u['id_supervisor']),u['namesupervisor'])
        estadoactual=ModelState.estadoActual(db,usuario.id)
        if(estadoactual!=None):
            state1=ModelState.get_by_id(db,estadoactual.id_estado)
        else:
            ModelState.call_procedure(db,usuario,usuario.nombres,4)   
            estadoactual=ModelState.estadoActual(db,usuario.id)
            state1=ModelState.get_by_id(db,estadoactual.id_estado)
        totalStates=ModelState.totalStates(db,usuario.id)  
        response={
            'estado':state1.__dict__,
            'estadoactual':estadoactual.__dict__,
            'totalStates':totalStates,
            'logout': False,
            'room':usuario.compania['id'],
            'id':0,
            'sup':usuario.namesupervisor
            }  

        return jsonify(response)
    return None
#Cambios de estado
@estados.route('/changeState',methods=['POST'])
def changeState():
    from app import getdb
    db=getdb()
    response=None
    if request.method == 'POST':
        state=request.json['idestado'] 
        responsable=request.json['responsable'] 
        u = json.loads(request.json['user'])
        usuario=User(int(u['id']),u['correo_solvo'],u['compania'],u['ciudad'],None,u['id_solvo'],u['nombres'],u['apellidos'],int(u['perfil']),u['estado'],int(u['id_supervisor']),u['namesupervisor'])
        ModelState.call_procedure(db,usuario,responsable,state)
        estadoactual=ModelState.estadoActual(db,usuario.id)
        if(estadoactual!=None):
            state1=ModelState.get_by_id(db,estadoactual.id_estado)
        totalStates=ModelState.totalStates(db,usuario.id)  
        response={
            'estado':state1.__dict__,
            'estadoactual':estadoactual.__dict__,
            'totalStates':totalStates,
            'logout': False,
            'room':usuario.compania['id'],
            'id':0,
            'sup':usuario.namesupervisor
            }  
        return jsonify(response)
    return None