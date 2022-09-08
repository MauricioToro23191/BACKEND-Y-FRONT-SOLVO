import flask 
from flask import  request,jsonify
from models.ModelState import ModelState
from models.entities.User import User
estados=flask.Blueprint('menu',__name__,url_prefix='/estados')
import json

#direccionamiento a Pagina de estados 
"""@estados.route('/menu',methods=['POST'])
def menu():
    from app import getdb
    db=getdb()
    id=request.json['user']
    print('this menu') 
    usuario=ModelUser.get_by_id(db,id)
    estadoactual=ModelState.estadoActual(db,usuario)
    state1=ModelState.get_by_id(db,estadoactual.id_estado)
    totalStates=ModelState.totalStates(db,usuario)
    sup=ModelUser.get_by_id(db,estadoactual.user['id_supervisor']).nombres
    response={
        'estado':state1.__dict__,
        'estadoactual':estadoactual.__dict__,
        'totalStates':totalStates,
        'logout':False,
        'id': 0,
        'sup':sup
    }
    return jsonify(response)"""
#Cambios de estado
@estados.route('/changeState',methods=['POST'])
def changeState():
    from app import getdb
    db=getdb()
    response=None
    if request.method == 'POST':
        state=request.json['idestado']  
        u = json.loads(request.json['user'])
        usuario=User(int(u['id']),u['correo_solvo'],u['compania'],u['ciudad'],None,u['id_solvo'],u['nombres'],u['apellidos'],int(u['perfil']),u['estado'],int(u['id_supervisor']),u['namesupervisor'])
        ModelState.call_procedure(db,usuario,usuario,state)
        estadoactual=ModelState.estadoActual(db,usuario.id)
        if(estadoactual!=None):
            state1=ModelState.get_by_id(db,estadoactual.id_estado)
        totalStates=ModelState.totalStates(db,usuario.id)  
        response={
            'estado':state1.__dict__,
            'estadoactual':estadoactual.__dict__,
            'totalStates':totalStates,
            'logout': False,
            'id':0,
            'sup':usuario.namesupervisor
            }  
        return jsonify(response)
    return None