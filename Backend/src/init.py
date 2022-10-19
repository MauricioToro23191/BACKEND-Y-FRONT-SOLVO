from http.client import NotConnected
from flask import Flask 
from estados import estados
from Usuario import usuarios
from flask_mysqldb import MySQL
import os

 

def init_app():
    app=Flask(__name__)
    #configuracion de la app 
    app.secret_key='SOLVORWEDASDaasd'
    #configuracion de la Base de datos 
    app.config['MYSQL_HOST']='localhost'
    app.config['MYSQL_USER']='root'
    app.config['MYSQL_PASSWORD']=''
    app.config['MYSQL_DB']='solvo1'
    app.config['MAIL_SERVER']='smtp.gmail.com'
    app.config['MAIL_PORT']=465
    app.config['MAIL_USE_SSL']=False
    app.config['MAIL_USE_TLS']=True
    app.config['MAIL_USERNAME']='pruebaappsolvo@gmail.com'
    app.config['MAIL_PASSWORD']='kptpspqespgnnnrd'

    #se agregan los blueprints para segmentar las rutas de la pagina web 
    app.register_blueprint(estados)
    app.register_blueprint(usuarios)
    db=MySQL(app)
    return app,db
 
def init_app2():
    app=Flask(__name__)
    #configuracion de la app 
    app.secret_key='mysecretkey'
    #configuracion de la Base de datos 
    app.config['MYSQL_HOST']='us-cdbr-east-06.cleardb.net'
    app.config['MYSQL_USER']='b7afd7e00fe41f'
    app.config['MYSQL_PASSWORD']='c73be9e7'
    app.config['MYSQL_DB']='heroku_1a91a1f56846f6f'
    #Agregando servidor de correo 
    app.config['MAIL_SERVER']='smtp.gmail.com'
    app.config['MAIL_PORT']=25
    app.config['MAIL_USE_SSL']=False
    app.config['MAIL_USE_TLS']=True
    app.config['MAIL_USERNAME']='pruebaappsolvo@gmail.com'
    app.config['MAIL_PASSWORD']=os.environ.get('PASSWORD_EMAIL_CF')
    #se agregan los blueprints para segmentar las rutas de la pagina web 
    app.register_blueprint(estados)
    app.register_blueprint(usuarios)
    db=MySQL(app)
    return app,db