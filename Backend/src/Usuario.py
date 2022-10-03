from flask import render_template, request,jsonify
#from flask_json import FlaskJSON
import flask
#controlador de configuracion 
# Models:
from models.ModelUser import ModelUser
from models.ModelState import ModelState
from models.ModelCompanyCity import ModelCompanyCity
# Entities:
#ruta raiz de la pagina
usuarios=flask.Blueprint('Usuario',__name__,url_prefix="/usuario")
    
#Validacion de Inicio de sesion
@usuarios.route('/login',methods=['GET', 'POST'])
def login():
    from app import getdb
    db=getdb()
    print("aaaaaaaaaaaaaaaaaaaaaaaaaa")
    if request.method == 'POST':
        # user = User(0, request.json['user'],None,None, request.json['pass'])
        user = {'email':request.json['user'], 'pass':request.json['pass']}
        logged_user = ModelUser.login(db,user)
        if logged_user != None:
            if logged_user['pass']:
                ModelState.call_procedure(db,logged_user,"",4)
                return jsonify({'bool':True,'response':'Login succesfully','usuario':logged_user})
            else:
                #contraseña incorrecta
                return jsonify({'bool':False,'response':'Invalid password...','usuario':None})
        else:
            #usuario no existe
            return jsonify({'bool':False,'response':'User not found...','usuario':None})
    else:
        return render_template('proto_Solvo.html')


@usuarios.route('/ListUser', methods=['GET', 'POST'])
def listUser():
    from app import getdb
    db=getdb()
    if request.method == 'POST':
        idCompania = request.json['company']
        users=ModelUser.ListUser(db, idCompania)
        admins = ModelUser.ListAdmin(db)
        perfils = ModelUser.perfil(db)
        sups = ModelUser.ListSup(db)
        teams = ModelUser.ListTeam(db)
        citys = ModelCompanyCity.ListCity(db)
        companys = ModelCompanyCity.ListCompany(db)
        citycompanys = ModelUser.getCompCiuTodos(db)
        if None==users:
            users=[]
        return jsonify({'LisUser':users, 'Admins':admins, 'Perfils':perfils, 'Sups':sups, 'Teams':teams, 'Citys':citys, 'Companys':companys, 'Citycompanys':citycompanys})
    
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
        #validacion si intenta crear un interpreete o supervisor    
        # if request.form['perfil']== "1":
            # user = User(0,u['email'],u['comp'],u['ciu'],u['pass'],u['solvoid'],u['name']
            #         ,u['lastname'],u['perfil'],"ACTIVO",0)
            #Validacion si exite el Admin
            # logged_user = ModelUser.ExistsUser(db, u['email'])
            # relacion = compciu(u['comp'],u['ciu'])
        #si existe el usuario, si no existe lo crea
        if logged_user == True:
            print("exists User")         
            return jsonify({'AddUser':False})
            # return redirect(url_for('Show'))
        else:
            print(type(u['Perfil']))
            #valida si el desea crear administrador, supervisor, team leader o interprete
            if u['Perfil']==1 :
                #crea el administrador
                ModelUser.addAdmin(db, u) 
                #envia mensaje de confirmacion
                print('Administrator created successfully')             
                return jsonify({'AddUser':True})
            elif u['Perfil']==2 or u['Perfil']==3 or u['Perfil']==4:
                #crea el supervisor
                ModelUser.addSup(db, u) 
                #envia mensaje de confirmacion
                print('Supervisor created successfully')             
                return jsonify({'AddUser':True})
            else: 
                print('Error with profile or selected city with company')
                return jsonify({'AddUser':False})
    else:
        return jsonify({'AddUser':False})

#Lleva a la vista de editar usuario
@usuarios.route('/editUsers', methods=['GET', 'POST'])
def editUsers(id): 
    from app import getdb
    db=getdb()
    users = ModelUser.get_by_id(db, id)
    ListSup = ModelUser.ListSup(db)
    ListAdmin = ModelUser.ListAdmin(db)
    ListTeam = ModelUser.ListTeam(db)
    ListPerfil = ModelUser.perfil(db)
    citys = ModelCompanyCity.ListCity(db)
    companys = ModelCompanyCity.ListCompany(db)
    return jsonify({'citys':citys, 'companys':companys, 'ListAdmin':ListAdmin, 'ListTeam':ListTeam, 'ListSup':ListSup, 'ListPerfil':ListPerfil, 'users':users})
    
#Edita el usuario seleccionado en la vista



@usuarios.route('/Update', methods=['GET', 'POST'])
def Update():
    from app import getdb
    db=getdb()
    if request.method == 'POST':
        u = request.json['user']
        perfil = request.json['perfil']
        if u!=None:
            ModelUser.UpdateSup(db, u)
            print('User Interpreter edit successfuly')
            return jsonify({'bool':True})
        else:
            return jsonify({'bool':False})
    else:
        return jsonify({'bool':False})

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
