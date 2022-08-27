from .entities.User import User
from werkzeug.security import generate_password_hash
class ModelUser():

    @classmethod
    def login(self,db,user):
        try:
            cursor = db.connection.cursor()
            sql = """SELECT ID_USUARIO,CORREO_SOLVO,CONTRASENA,ID_SOLVO,NOMBRES,APELLIDOS,perfil,ESTADO,ID_SUPERVISOR,id_compania,id_ciudad FROM usuario 
                    WHERE CORREO_SOLVO = '{}'""".format(user.correo_solvo)
            cursor.execute(sql)
            row = cursor.fetchone()
            if row != None:
                compania=ModelUser.get_by_id_compania(db,row[9])
                ciudad=ModelUser.get_by_id_ciudad(db,row[10])
                
                user = User(row[0], row[1],compania,ciudad, User.check_password(row[2], user.contrasena), row[3],row[4],row[5],row[6],row[7],row[8])
                return user
            else:
                return None
        except Exception as ex: 
            raise Exception(ex)
        
    @classmethod
    def ExistsUser(self,db,user):
        try:
            cursor = db.connection.cursor()
            sql = """SELECT CORREO_SOLVO FROM usuario 
                    WHERE CORREO_SOLVO = '{}'""".format(user.correo_solvo)        
            cursor.execute(sql)
            row = cursor.fetchone()
            if row != None:
                user = User(0,row[0],"")
                return user
            else:
                return None
        except Exception as ex:
            raise Exception(ex)
        

    @classmethod
    def addInterp(self,db,user):
        try:
            cursor = db.connection.cursor()
            sql = """INSERT INTO USUARIO (ID_USUARIO,CORREO_SOLVO,CONTRASENA,ID_SOLVO,NOMBRES,APELLIDOS,ESTADO,ID_SUPERVISOR)
                VALUES (null,%s,%s, %s, %s,%s,%s,%s)"""
            cursor.execute(sql,(user.correo_solvo,generate_password_hash(user.contrasena),user.id_solvo,user.nombres,user.apellidos,user.estado,user.id_supervisor))
            db.commit()
        except Exception as ex:
            raise Exception(ex)
        
        
    @classmethod
    def addSup(self,db,user):
        try:
            cursor = db.connection.cursor()
            sql = """INSERT INTO USUARIO (ID_USUARIO,CORREO_SOLVO,CONTRASENA,ID_SOLVO,NOMBRES,APELLIDOS,ESTADO)
                VALUES (null,%s,%s, %s,%s,%s,%s)"""
            cursor.execute(sql,(user.correo_solvo,generate_password_hash(user.contrasena),user.id_solvo,user.nombres,user.apellidos,user.estado))
            db.commit() 
        except Exception as ex:
            raise Exception(ex)
        

    @classmethod
    def get_by_id(self,db,id):
        try:
            cursor = db.connection.cursor()
            sql = "SELECT ID_USUARIO,CORREO_SOLVO,ID_SOLVO,NOMBRES,APELLIDOS,perfil,ESTADO,ID_SUPERVISOR,id_compania,id_ciudad FROM usuario WHERE ID_USUARIO = {}".format(id)
            cursor.execute(sql)
            row = cursor.fetchone()
            if row != None:
                compania=ModelUser.get_by_id_compania(db,row[8])
                ciudad=ModelUser.get_by_id_ciudad(db,row[9])
                Usuario=User(row[0], row[1],compania,ciudad,None,row[2],row[3],row[4],row[5],row[6],row[7])
                return Usuario
            else:
                db.close()
                return None
        except Exception as ex:
            raise Exception(ex)
    
    @classmethod
    def get_by_id_compania(self,db,id):
        try:
            
            compania={}
            cursor = db.connection.cursor()
            sql = """select * from compania where ID_compania={}""".format(id)
            cursor.execute(sql)
            row = cursor.fetchone()
            if row != None:
                compania={'id':row[0],'nombre':row[1]}
                return compania
            else:
                return compania
        except Exception as ex:
            raise Exception(ex)
    
    @classmethod
    def get_by_id_ciudad(self,db,id):
        try:
            
            ciudad={}
            cursor = db.connection.cursor()
            sql = """select * from ciudad where id_ciudad={}""".format(id)
            cursor.execute(sql)
            row = cursor.fetchone()
            if row != None:
                ciudad={'id':row[0],'nombre':row[1]}
                return ciudad
            else:
                return ciudad
        except Exception as ex:
            raise Exception(ex)
        
   
           
           
    
      
           
