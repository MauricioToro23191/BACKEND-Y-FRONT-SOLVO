import flask 
from flask import  request,jsonify
from models.ModelState import ModelState
import function_jwt
estados=flask.Blueprint('menu',__name__,url_prefix='/estados')

#consulta Cual es es estado actual de un usuario determinado 
@estados.route('/getState',methods=['POST'])
def menu():
    from app import getdb
    db=getdb()
    response=None
    if request.method == 'POST':
        tocken=request.headers['Authorization']
        u=function_jwt.validate_tocken(tocken,True)
        estadoactual=ModelState.estadoActual(db,u['id'])
        if(estadoactual!=None):
            state1=ModelState.get_by_id(db,estadoactual.id_estado)
        else:
            ModelState.call_procedure(db,u,"",4)   
            estadoactual=ModelState.estadoActual(db,u['id'])
            state1=ModelState.get_by_id(db,estadoactual.id_estado)
        totalStates=ModelState.totalStates(db,u['id'])  
        response={
            'estado':state1,
            'estadoactual':estadoactual.__dict__,
            'totalStates':totalStates,
            'logout': False,
            'room':u['idCompany'],
            'id':0,
            'sup':u['Supervisor']
            }  

        return jsonify(response)
    return None
#Cambios de estado
@estados.route('/changeState',methods=['POST'])
def changeState():
    from app import getdb
    db=getdb()
    response=""
    if request.method == 'POST':
        state=request.json['idestado'] 
        responsable=request.json['responsable'] 
        tocken=request.headers['Authorization']
        u=function_jwt.validate_tocken(tocken,True)
        if responsable=="":
            responsable=u['Name']
        ModelState.call_procedure(db,u['id'],responsable,state)
        estadoactual=ModelState.estadoActual(db,u['id'])
        if(estadoactual!=None):
            state1=ModelState.get_by_id(db,estadoactual.id_estado)
        totalStates=ModelState.totalStates(db,u['id'])  
        response={
            'estado':state1,
            'estadoactual':estadoactual.__dict__,
            'totalStates':totalStates,
            'logout': False,
            'room':u['idCompany'],
            'id':0,
            'sup':u['Supervisor']
            }  
        return jsonify(response)
    return None
#Cambio de estado desde La ventana del RTA
@estados.route('/changeStateRTA',methods=['POST'])
def changeStateRTA():
    from app import getdb
    db=getdb()
    response=""
    if request.method == 'POST':
        idUser=request.json['idUser']
        state=request.json['idestado'] 
        responsable=request.json['responsable'] 
        bool=ModelState.call_procedure(db,idUser,responsable,state)
        return jsonify({'changeState':bool})
    return None