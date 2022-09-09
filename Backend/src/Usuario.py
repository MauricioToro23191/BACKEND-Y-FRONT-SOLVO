
from flask import render_template, request,jsonify
#from flask_json import FlaskJSON
import flask
#from flask_cors import CORS
#controlador de configuracion 
# Models:
from models.ModelUser import ModelUser
from models.ModelState import ModelState
# Entities:
from models.entities.User import User
#ruta raiz de la pagina
usuarios=flask.Blueprint('Usuario',__name__,url_prefix="/usuario")
#Direccionamiento a pagina de pagina de administracion de usuarios 
@usuarios.route('/AdminUser',methods=['GET', 'POST'])
def AdminUser():
    from app import getdb
    db=getdb()
    return render_template('AddUsers.html',ListSup=ModelUser.ListSup(db))
    #creacion de usuario interprete y supervisor

    
#Validacion de Inicio de sesion
@usuarios.route('/login',methods=['GET', 'POST'])
def login():
    from app import getdb
    db=getdb()
    if request.method == 'POST':
        user = User(0, request.json['user'],None,None, request.json['pass'])
        logged_user = ModelUser.login(db,user)
        if logged_user != None:
            if logged_user.contrasena:
                ModelState.call_procedure(db,logged_user,logged_user,4)
                return jsonify({'bool':True,'response':'Login succesfully','usuario':logged_user.__dict__})
            else:
                #contraseña incorrecta
                return jsonify({'bool':False,'response':'Invalid password...','usuario':None})
        else:
            #usuario no existe
            return jsonify({'bool':False,'response':'User not found...','usuario':None})
    else:
        return render_template('proto_Solvo.html')


@usuarios.route('/ListUser')
def listUser():
    from app import getdb
    db=getdb()
    l=ModelUser.ListUser(db)
    return jsonify({'LisUser':l})
 
