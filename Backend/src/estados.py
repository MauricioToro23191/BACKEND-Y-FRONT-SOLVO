import flask 
from flask import  request,jsonify
from models.ModelUser import ModelUser
from models.ModelState import ModelState
from flask_login import current_user
estados=flask.Blueprint('menu',__name__,url_prefix='/estados')

#direccionamiento a Pagina de estados 
@estados.route('/menu',methods=['POST'])
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
    return jsonify(response)
#Cambios de estado
@estados.route('/changeState',methods=['POST'])
def changeState():
    from app import getdb
    db=getdb()
    response=None
    if request.method == 'POST':
        state=request.json['idestado']  
        id=request.json['user']
        
        usuario=ModelUser.get_by_id(db,id)
        state1=ModelState.get_by_id(db,state)
        ModelState.call_procedure(db,usuario,usuario,state1.id)
        estadoactual=ModelState.estadoActual(db,usuario)
        if(estadoactual!=None):
            state1=ModelState.get_by_id(db,estadoactual.id_estado)
        totalStates=ModelState.totalStates(db,usuario)  
        print(totalStates)
        response={
            'estado':state1.__dict__,
            'estadoactual':estadoactual.__dict__,
            'totalStates':totalStates,
            'logout': False,
            'id':0,
            }  
        return jsonify(response)
    return None