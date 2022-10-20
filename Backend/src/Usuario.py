from flask import  request,jsonify
import flask
# Models:
from models.ModelUser import ModelUser
from models.ModelCompanyCity import ModelCompanyCity
from models.email import send_Mail
#importar Validador de JWT
import function_jwt
import os
#ruta raiz de la pagina
usuarios=flask.Blueprint('Usuario',__name__,url_prefix="/usuario")
    
#Validacion de Inicio de sesion
@usuarios.route('/login',methods=['GET', 'POST'])
def login():
    
    from app import getdb
    db=getdb()
    if request.method == 'POST':
        # user = User(0, request.json['user'],None,None, request.json['pass'])
        user = {'email':request.json['user'], 'pass':request.json['pass']}
        json=function_jwt.authenticate(db,user)
        return jsonify(json)
    else:
        return jsonify({'bool':False,'response':'Is not posible connect','usuario':None})


@usuarios.before_request
def veryfy_tocken_middleware():
    if request.method=='POST':
        if request.headers['Authorization']!=None:
            tocken=request.headers['Authorization']
            function_jwt.validate_tocken(tocken,False)
        else:
            return jsonify({'response': 'Not fue Posible Conectar con el BAckend'})

@usuarios.route('/ListUser', methods=['GET', 'POST'])
def listUser():
    from app import getdb
    db=getdb()
    if request.method == 'POST':
        users=[]
        if request.headers['Authorization']!=None:
            tocken=request.headers['Authorization']
            json=function_jwt.validate_tocken(tocken,True)
            idCompania = request.json['company']
            users=ModelUser.ListUser(db, idCompania,json['idPerfil'])
        admins = ModelUser.ListAdmin(db)
        perfils = ModelUser.perfil(db)
        sups = ModelUser.ListSup(db)
        teams = ModelUser.ListTeam(db)
        citys = ModelCompanyCity.ListCity(db)
        Sites =ModelCompanyCity.ListSites(db)
        companys = ModelCompanyCity.ListCompany(db)
        citycompanys = ModelUser.getCompCiuTodos(db)
        if None==users:
            users=[]
        return jsonify({'LisUser':users, 'Admins':admins, 'Perfils':perfils, 'Sups':sups, 'Teams':teams, 'Citys':citys, 'Companys':companys, 'Citycompanys':citycompanys,'Sites':Sites})
  

@usuarios.route('/AdminUser',methods=['GET', 'POST'])
def AdminUser():
    from app import getdb
    db=getdb()
    
    sups = ModelUser.ListSup(db)
    admins = ModelUser.ListAdmin(db)
    teams = ModelUser.ListTeam(db)
    perfils = ModelUser.perfil(db)
    citys = ModelCompanyCity.ListCity(db)
    companys = ModelCompanyCity.ListCompany(db)
    citycompanys = ModelUser.getCompCiuTodos(db)
    return jsonify({'Sups':sups,'Admins':admins, 'Teams':teams, 'Perfils':perfils, 'Citys':citys, 'Companys':companys, 'Citycompanys':citycompanys})
 
    #creacion de usuario interprete y supervisor
@usuarios.route('/addUser',methods=['GET', 'POST'])
def addUser():
    from app import getdb
    db=getdb()
    if request.method == 'POST':   
        u = request.json['user'] 
        logged_user = ModelUser.ExistsUser(db, u['Email'])
        if logged_user == True:
            print("exists User")         
            return jsonify({'AddUser':False,'message':'exists User'})
        else:
            print(int(u['Perfil']))
            #valida si el desea crear administrador, supervisor, team leader o interprete
            if int(u['Perfil'])==1 :
                #crea el administrador
                ModelUser.addAdmin(db, u) 
                #envia mensaje de confirmacion
                print('Administrator created successfully')   
                #send_Mail(db,u['Email'],"edwin.toro@solvoglobal.com")          
                return jsonify({'AddUser':True,'message':'Administrator created successfully'})
            elif int(u['Perfil'])==2 or int(u['Perfil'])==3 or int(u['Perfil'])==4:
                #crea el supervisor
                ModelUser.addSup(db, u) 
                #envia mensaje de confirmacion
                print('User created successfully')   
                #send_Mail(db,u['Email'],"edwin.toro@solvoglobal.com")          
                return jsonify({'AddUser':True,'message':'User created successfully'})
            else: 
                print('Error with profile or selected city with company')
                return jsonify({'AddUser':False,'message':'Error with profile or selected city with company'})
    else:
        return jsonify({'AddUser':False,'message':''})


@usuarios.route('/validarUser',methods=['GET', 'POST'])
def validarUser():
    if request.method=="POST":
        from app import getdb
        db=getdb()
        Email=request.json['Email']
        val=ModelUser.ExistsUser(db,Email)
        return jsonify({'send':val})
    else: 
        return jsonify({'send':False})

@usuarios.route('/ChangePassword',methods=['GET', 'POST'])
def ChangePassword():
    if request.method=="POST":
        from app import getdb
        db=getdb()
        Email=request.json['Email']
        password=request.json['password']
        res=ModelUser.setPassword(db,Email,password)
        return jsonify({'send':res})
    else: 
        return jsonify({'send':False})

#Edita el usuario seleccionado en la vista
@usuarios.route('/Update', methods=['GET', 'POST'])
def Update():
    if request.method == 'POST':
        from app import getdb
        db=getdb()
        u = request.json['user']
        if u!=None:
            ModelUser.UpdateSup(db, u)
            print('User Interpreter edit successfuly')
            return jsonify({'bool':True,'message':'User edit successfuly'})
        else:
            return jsonify({'bool':False,'message':'User not updated'})
    else:
        return jsonify({'bool':False,'message':'User not updated'})

#Valida que la compañía y ciudad estén relacionadas(Verifica que x compañía exista en x ciudad)
def compciu(comp, ciu):
    from app import getdb
    db=getdb()
    lista = ModelUser.getCompCiuTodos(db)
    for listacc in lista:
        if listacc['id'] >=0 and listacc['ciudad']['id']==int(ciu) and listacc['compania']['id']==int(comp):
            return True
    return False

#Visualizar la información del usuario seleccionado
@usuarios.route('/ShowUser', methods=['GET', 'POST'])
def ShowUser():
    from app import getdb
    db=getdb()
    id = 34
    Usuario = ModelUser.showUser(db, id)
    return jsonify({'Usuario':Usuario})

#Poner inactivo al usuario
@usuarios.route('/inactive', methods=['GET', 'POST'])
def inactive():
    from app import getdb
    db=getdb()
    id = request.json['id']
    ModelUser.State(db, id)
    return jsonify({'Inactivate':True})
