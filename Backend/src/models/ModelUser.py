import cryptocode

from .entities.User import User
class ModelUser():

    @classmethod
    def login(self,db,user):
        print(user)
        try:
            cursor = db.connection.cursor()
            sql = """SELECT u.ID_USUARIO, u.ID_SOLVO, u.NOMBRES, u.APELLIDOS, u.CORREO_SOLVO, u.ESTADO, 
                    p.id_perfil, p.nombre_perfil, comp.id_compania, comp.nombre_compania, 
                    ciu.ID_CIUDAD, ciu.nombre_ciudad, sup.ID_USUARIO, sup.nombres, u.CONTRASENA ,SITE.ID_SITE,SITE.NOMBRE_SITE
                    FROM usuario as u
                    INNER JOIN perfiles as p ON u.PERFIL=p.ID_PERFIL
                    INNER JOIN compania as comp ON u.ID_COMPANIA=comp.ID_COMPANIA
                    INNER JOIN ciudad as ciu ON u.ID_CIUDAD=ciu.ID_CIUDAD
                    INNER JOIN SITE as SITE ON u.ID_SITE=SITE.ID_SITE

                    INNER JOIN usuario as sup ON u.id_supervisor=sup.ID_USUARIO
                    WHERE u.CORREO_SOLVO='{}'""".format(user['email'])
            cursor.execute(sql) 
            row = cursor.fetchone()
            cursor.close()
            if row != None:
                u={'id':row[0], 'SolID':row[1], 'Name':row[2], 'LastN':row[3], 'Email':row[4], 'estado':row[5], 'idPerfil':row[6], 'Perfil':row[7], 'idCompany':row[8],
                    'Company':row[9],'idCity':row[10],'City':row[11],'idSupervisor':row[12], 'Supervisor':row[13], 'pass':User.check_password(row[14],user['pass']),'idSite':row[15],'Site':row[16]}
                return u
            else:
                sql = """SELECT u.ID_USUARIO, u.ID_SOLVO, u.NOMBRES, u.APELLIDOS, u.CORREO_SOLVO, u.ESTADO, 
                        p.id_perfil, p.nombre_perfil, comp.id_compania, comp.nombre_compania, 
                        ciu.id_ciudad, ciu.nombre_ciudad, u.CONTRASENA,,SITE.ID_SITE,SITE.NOMBRE_SITE FROM usuario as u
                        INNER JOIN perfiles as p ON u.PERFIL=p.ID_PERFIL
                        INNER JOIN compania as comp ON u.ID_COMPANIA=comp.ID_COMPANIA
                        INNER JOIN ciudad as ciu ON u.ID_CIUDAD=ciu.ID_CIUDAD
                        INNER JOIN SITE as SITE ON u.ID_SITE=SITE.ID_SITE
                        WHERE u.CORREO_SOLVO='{}'""".format(user['email'])
                cursor.execute(sql)
                row = cursor.fetchone()
                cursor.close()
                if row != None:
                    u={'id':row[0], 'SolID':row[1], 'Name':row[2], 'LastN':row[3], 'Email':row[4], 'estado':row[5], 'idPerfil':row[6], 'Perfil':row[7], 'idCompany':row[8],
                        'Company':row[9],'idCity':row[10],'City':row[11], 'pass':User.check_password(row[12],user['pass']),'idSite':row[13],'Site':row[14]}
                    return u
        except Exception as ex: 
            db.connection.close()
            raise Exception(ex)

        
    @classmethod
    def ExistsUser(self,db,correo_solvo):
        try:
            cursor = db.connection.cursor()
            sql = """SELECT CORREO_SOLVO FROM usuario 
                    WHERE CORREO_SOLVO = '{}'""".format(correo_solvo)        
            cursor.execute(sql)
            row = cursor.fetchone()
            cursor.close()
            if row != None:
                return True
            else:
                return False
        except Exception as ex:
            raise Exception(ex)
    @classmethod
    def getPassword(self,db,correo_solvo):
        try:
            cursor = db.connection.cursor()
            sql = """SELECT contrasena FROM usuario 
                    WHERE CORREO_SOLVO = '{}'""".format(correo_solvo)        
            cursor.execute(sql)
            row = cursor.fetchone()
            cursor.close()
            if row != None:
                return row[0]
            else:
                return ''
        except Exception as ex:
            raise Exception(ex)
       
        

    @classmethod
    def addAdmin(self, db, user):
        try:
            cursor = db.connection.cursor()
            sql = """INSERT INTO USUARIO (ID_USUARIO,CORREO_SOLVO,ID_COMPANIA,ID_CIUDAD,CONTRASENA,ID_SOLVO,NOMBRES,APELLIDOS,PERFIL,ID_SITE,ESTADO)
                VALUES (null,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"""
            cursor.execute(sql,(user['Email'],user['Company'],user['City'],cryptocode.encrypt("password","Solvo#1056$?"),user['SolID'],user['Name'],user['LastN'],user['Perfil'],user['site'],1))
            db.connection.commit()
            cursor.close()

        except Exception as ex:
            raise Exception(ex)
        
        
    @classmethod
    def addSup(self, db, user):
        try:
            print(user)
            cursor = db.connection.cursor()
            sql = """INSERT INTO USUARIO (ID_USUARIO,CORREO_SOLVO,ID_COMPANIA,ID_CIUDAD,CONTRASENA,ID_SOLVO,NOMBRES,APELLIDOS,PERFIL,ID_SITE,ESTADO,ID_SUPERVISOR)
                VALUES (null,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"""
            cursor.execute(sql,(user['Email'],user['Company'],user['City'],cryptocode.encrypt("password",'Solvo#1056$?'),user['SolID'],user['Name'],user['LastN'],user['Perfil'],user['site'],1,int(user['Supervisor'])))
            db.connection.commit() 
            cursor.close()

        except Exception as ex:
            raise Exception(ex)
    

    @classmethod
    def showUser(self,db,id):
        try:
            cursor = db.connection.cursor()
            sql = """SELECT u.ID_USUARIO, u.ID_SOLVO, u.NOMBRES, u.APELLIDOS, u.CORREO_SOLVO, u.ESTADO, 
                    p.id_perfil, p.nombre_perfil, comp.id_compania, comp.nombre_compania, 
                    ciu.id_ciudad, ciu.nombre_ciudad, sup.id_usuario, sup.nombres 
                    FROM usuario as u
                    INNER JOIN perfiles as p ON u.PERFIL=p.ID_PERFIL
                    INNER JOIN compania as comp ON u.ID_COMPANIA=comp.ID_COMPANIA
                    INNER JOIN ciudad as ciu ON u.ID_CIUDAD=ciu.ID_CIUDAD
                    INNER JOIN usuario as sup ON u.id_supervisor=sup.ID_USUARIO
                    WHERE u.ID_USUARIO = {}""".format(id)
            cursor.execute(sql)
            row = cursor.fetchone()
            cursor.close()
            if row != None:
                Usuario={'id':row[0], 'SolID':row[1], 'Name':row[2], 'LastN':row[3], 'Email':row[4], 'estado':row[5], 'idPerfil':row[6], 'Perfil':row[7], 'idCompany':row[8],
                'Company':row[9],'idCity':row[10],'City':row[11],'idSupervisor':row[12], 'Supervisor':row[13]}
                return Usuario
            else:
                return None
        except Exception as ex:
            raise Exception(ex)
      
    @classmethod
    def get_by_id(self,db,id):
        try:
            cursor = db.connection.cursor()
            sql = """SELECT u1.ID_USUARIO,u1.CORREO_SOLVO,u1.ID_SOLVO,u1.NOMBRES,u1.APELLIDOS,u1.perfil,u1.ESTADO,u1.ID_SUPERVISOR,u1.id_compania,u1.id_ciudad,u2.NOMBRES FROM usuario 
             as u1 INNER JOIN usuario as u2 on u1.id_supervisor=u2.ID_USUARIO WHERE u1.ID_USUARIO = {}""".format(id)
            cursor.execute(sql)
            row = cursor.fetchone()
            cursor.close()
            if row != None:
                compania=ModelUser.get_by_id_compania(db,row[8])
                ciudad=ModelUser.get_by_id_ciudad(db,row[9])
                Usuario=User(row[0], row[1],compania,ciudad,None,row[2],row[3],row[4],row[5],row[6],row[7],row[10])
                return Usuario
            else:
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
     
    @classmethod
    def perfil(self, db):
        try:
            perfil = []
            cursor = db.connection.cursor()
            sql = "SELECT ID_PERFIL, NOMBRE_PERFIL FROM perfiles"
            cursor.execute(sql)
            lista = cursor.fetchall()
            cursor.close()
            for item in lista:
                p = {"id": item[0], "nombre":item[1]}
                perfil.append(p)
            return perfil
        except Exception as ex:
            raise Exception(ex)
      
    @classmethod
    def ListAdmin(self,db):
        try:
            admins = []
            cursor = db.connection.cursor()
            sql = "SELECT ID_USUARIO, NOMBRES, APELLIDOS,ID_COMPANIA FROM usuario WHERE PERFIL = 1 and ESTADO = 1"
            cursor.execute(sql)
            lista = cursor.fetchall()
            cursor.close()
            for item in lista:
                p = {"id": item[0], "nombre":item[1]+" "+item[2],"company":item[3]}
                admins.append(p)
            return admins
        except Exception as ex:
            raise Exception(ex)
        

    @classmethod
    def ListSup(self,db):
        try:
            Sups =[]
            cursor = db.connection.cursor()
            sql = "SELECT ID_USUARIO, NOMBRES, APELLIDOS, ID_COMPANIA FROM usuario WHERE PERFIL = 2 and ESTADO = 1"
            cursor.execute(sql)
            lista = cursor.fetchall()
            cursor.close()
            for item in lista:
                p = {"id": item[0], "nombre":item[1]+" "+item[2],"company":item[3]}
                Sups.append(p)
            return Sups
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def ListTeam(self,db):
        try:
            Teams = []
            cursor = db.connection.cursor()
            sql = "SELECT ID_USUARIO, NOMBRES, APELLIDOS, ID_COMPANIA FROM usuario WHERE PERFIL = 3 and ESTADO = 1"
            cursor.execute(sql)
            lista = cursor.fetchall()
            cursor.close()
            for item in lista:
                p = {"id": item[0], "nombre":item[1]+" "+item[2],"company":item[3]}
                Teams.append(p)
            return Teams
        except Exception as ex:
            raise Exception(ex)
        
    @classmethod
    def UpdateAdmin(self, db, user):
        try:
            cursor = db.connection.cursor()
            sql = "UPDATE usuario SET ID_SOLVO=%s, NOMBRES=%s, APELLIDOS=%s, CORREO_SOLVO=%s, ID_COMPANIA=%s, ID_CIUDAD=%s, PERFIL=%s WHERE ID_USUARIO=%s"
            cursor.execute(sql,(user['SolID'],user['Name'],user['LastN'],user['Email'],user['Company'],user['City'],user['Perfil'],user['id']))
            db.connection.commit()
            cursor.close()

        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def UpdateSup(self, db, user):
        try:

            cursor = db.connection.cursor()
            print(user)
            if int(user['Supervisor'])==0:
                sql = "UPDATE usuario SET ID_SOLVO=%s, NOMBRES=%s, APELLIDOS=%s, CORREO_SOLVO=%s, ID_SUPERVISOR=NULL, ID_COMPANIA=%s, ID_CIUDAD=%s, PERFIL=%s ,ID_SITE=%s WHERE ID_USUARIO=%s"
                cursor.execute(sql,(user['SolID'],user['Name'],user['LastN'],user['Email'],user['Company'],user['City'],user['Perfil'],int(user['site']),user['id']))
            else:
                sql = "UPDATE usuario SET ID_SOLVO=%s, NOMBRES=%s, APELLIDOS=%s, CORREO_SOLVO=%s, ID_SUPERVISOR=%s, ID_COMPANIA=%s, ID_CIUDAD=%s, PERFIL=%s  ,ID_SITE=%s WHERE ID_USUARIO=%s"
                cursor.execute(sql,(user['SolID'],user['Name'],user['LastN'],user['Email'],int(user['Supervisor']),user['Company'],user['City'],user['Perfil'],int(user['site']),user['id']))
            db.connection.commit()
            cursor.close()

        except Exception as ex:
            raise Exception(ex)
        
    @classmethod
    def traerEstado(self, db, id):
        try: 
            cursor = db.connection.cursor()
            sql = "SELECT ESTADO FROM usuario WHERE ID_USUARIO={}".format(id)
            cursor.execute(sql)
            estado=cursor.fetchone()
            cursor.close()
            return estado

        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def State(self, db, id):
        try:
            cursor = db.connection.cursor()
            sql  = "UPDATE usuario SET ESTADO=0 WHERE ID_USUARIO={}".format(id)
            cursor.execute(sql)
            db.connection.commit()
            cursor.close()

        except Exception as ex:
            raise Exception(ex)
        
    @classmethod
    def getCompCiuTodos(self,db):
        try:
            lista = []
            cursor = db.connection.cursor()
            sql = """select CC.ID_COMCIU, com.id_compania, com.NOMBRE_COMPANIA, ciu.id_ciudad, ciu.nombre_ciudad 
                    from companiaciudad as CC
                    inner join compania as com on CC.ID_COMPANIA = com.id_compania 
                    inner join ciudad as ciu on CC.ID_CIUDAD=ciu.id_ciudad"""
            cursor.execute(sql)
            compCiu=list(cursor.fetchall())
            cursor.close()

            for row in compCiu :
                lista.append({'id':row[0],'compania':{'id':row[1],'nombre':row[2]},'ciudad':{'id':row[3],'nombre':row[4]}})
            return lista
        except Exception as ex:
            raise Exception(ex)
        
    @classmethod
    def ListUser(self,db, idComp,perfil):
        try:
            lUser=[]
            usuarios=[]
            cursor = db.connection.cursor()

            if int(perfil)==1:
                sql = """SELECT u.ID_USUARIO, u.ID_SOLVO, u.NOMBRES, u.APELLIDOS, u.CORREO_SOLVO, u.ESTADO, 
                        p.id_perfil, p.nombre_perfil, comp.id_compania, comp.nombre_compania, 
                        ciu.id_ciudad, ciu.nombre_ciudad,site.id_site,site.nombre_site
                        FROM usuario as u
                        INNER JOIN perfiles as p ON u.PERFIL=p.ID_PERFIL
                        INNER JOIN compania as comp ON u.ID_COMPANIA=comp.ID_COMPANIA
                        INNER JOIN ciudad as ciu ON u.ID_CIUDAD=ciu.ID_CIUDAD
                        INNER JOIN site as site on u.ID_SITE=site.id_site
                        WHERE u.PERFIL=1 and u.estado=1 and u.id_compania = {}""".format(idComp)
                cursor.execute(sql)
                usuarios=list(cursor.fetchall())#
                for row in usuarios :
                    u={'id':row[0], 'SolID':row[1], 'Name':row[2], 'LastN':row[3], 'Email':row[4], 'estado':row[5], 'idPerfil':row[6], 'Perfil':row[7], 'idCompany':row[8],
                    'Company':row[9],'idCity':row[10],'City':row[11],'idSite':row[12],'Site':row[13]}
                    lUser.append(u) 
            sql = """SELECT u.ID_USUARIO, u.ID_SOLVO, u.NOMBRES, u.APELLIDOS, u.CORREO_SOLVO, u.ESTADO, 
                    p.id_perfil, p.nombre_perfil, comp.id_compania, comp.nombre_compania, 
                    ciu.id_ciudad, ciu.nombre_ciudad, sup.id_usuario, sup.nombres ,site.id_site,site.nombre_site
                    FROM usuario as u
                    INNER JOIN perfiles as p ON u.PERFIL=p.ID_PERFIL
                    INNER JOIN compania as comp ON u.ID_COMPANIA=comp.ID_COMPANIA
                    INNER JOIN ciudad as ciu ON u.ID_CIUDAD=ciu.ID_CIUDAD
                    INNER JOIN site as site on u.ID_SITE=site.id_site
                    INNER JOIN usuario as sup ON u.id_supervisor=sup.ID_USUARIO
                    WHERE u.PERFIL<>1 and u.estado=1 and u.id_compania = {}""".format(idComp)
            cursor.execute(sql)
            usuarios=list(cursor.fetchall())#
            cursor.close()
            for row in usuarios :
                u={'id':row[0], 'SolID':row[1], 'Name':row[2], 'LastN':row[3], 'Email':row[4], 'estado':row[5], 'idPerfil':row[6], 'Perfil':row[7], 'idCompany':row[8],
                'Company':row[9],'idCity':row[10],'City':row[11], 'idSupervisor':row[12], 'Supervisor':row[13],'idSite':row[14],'Site':row[15]}
                lUser.append(u) 
            return lUser
        except Exception as ex:
            db.connection.close()
            raise Exception(ex)
       
           
    
      
           
