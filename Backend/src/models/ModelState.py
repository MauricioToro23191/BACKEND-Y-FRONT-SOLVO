from http.client import INSUFFICIENT_STORAGE
from unittest import result
from .entities.State import State
from .entities.Historial import Historial
from .entities.User import User
from models.ModelUser import ModelUser
from datetime import datetime,date


class ModelState():  
    @classmethod 
    def estadoActual(self,db,user):
        try:
            cursor = db.connection.cursor()
            sql = "SELECT h.ID_HISTORIAL,h.ID_USUARIO,h.RESPONSABLE,h.HORA_INICIO,h.ID_ESTADO FROM HISTORIAL as h where h.ID_USUARIO={} AND h.TEMP_BOOLEAN=1".format(user)
            cursor.execute(sql)
            row = cursor.fetchone()
            if row != None:
                user=ModelUser.get_by_id(db,int(row[1]))
                historial = Historial(row[0],user.__dict__,row[2],row[3].strftime('%Y-%m-%d %H:%M:%S'),None,row[4])
                return historial
            else:
                               
                return None
        except Exception as ex:
            raise Exception(ex)
        

        
    @classmethod      
    def listState(self,db):
        try:
            
            lestados=[]
            estados=[]
            cursor = db.connection.cursor()
            sql = "SELECT * FROM estados where NOMBRE_ESTADO<>'Log out' and NOMBRE_ESTADO <> 'New-hire' order by NOMBRE_ESTADO LIMIT 100;"
            cursor.execute(sql)
            estados=list(cursor.fetchall())
            for estado in estados :
                h={'id':estado[0],'nombre':estado[1]}
                lestados.append(h)
            return lestados
        except Exception as ex:
            raise Exception(ex)
       


    @classmethod      
    def listCompania(self,db):
        try:
            lcompanias=[]
            companias=[]
            cursor = db.connection.cursor()
            sql = "SELECT * FROM compania "
            cursor.execute(sql)
            companias=list(cursor.fetchall())
            cursor.close()

            for compania in companias :
                h={'id':compania[0],'nombre':compania[1]}
                lcompanias.append(h)
            
            return lcompanias
        except Exception as ex:

            raise Exception(ex)
        
        
    @classmethod       
    def call_procedure(self,db,idUser,responsable,estado):  
        try:
            today = datetime.now()
            cursor = db.connection.cursor()
            cursor.callproc('UPDATEHISTORIAL', (idUser,responsable,today,estado))
            results = list(cursor.fetchall())
            return results
        except Exception as ex:
            raise Exception(ex)
       

        
    @classmethod       
    def get_by_name(self,db,nombre):
        try:
            
            cursor = db.connection.cursor()
            sql = "SELECT ID_ESTADO,NOMBRE_ESTADO FROM estados WHERE NOMBRE_ESTADO = '{}'".format(nombre)
            cursor.execute(sql)
            row = cursor.fetchone()
            if row != None:
                estado=State(row[0],row[1])
                      
                return estado
            else:
                
                return None
        except Exception as ex:
            raise Exception(ex)
       
        
    @classmethod       
    def get_by_id(self,db,id):
        try:
            
            cursor = db.connection.cursor()
            sql = "SELECT ID_ESTADO,NOMBRE_ESTADO FROM estados WHERE ID_ESTADO = '{}'".format(id)
            cursor.execute(sql)
            row = cursor.fetchone()
            if row != None:
                estado={'id':row[0],'nombre':row[1]}
                return estado
            else:
                return None
        except Exception as ex:
            raise Exception(ex)
       

        
    @classmethod 
    def totalStates(self,db, userid):
        try:
            
            lHistor=[]
            estados=[]
            today = datetime.now() 
            cursor = db.connection.cursor()
            sql = """SELECT ID_HISTORIAL,ID_USUARIO,RESPONSABLE,HORA_INICIO,HORA_FINAL,ID_ESTADO 
                    FROM historial
                    where ID_USUARIO={} and ID_ESTADO <> 1 and HORA_INICIO like '%{}%' and HORA_FINAL <> 'null' order by id_estado  """.format(userid,today.strftime("%Y-%m-%d"))
            cursor.execute(sql)
            estados=list(cursor.fetchall())#
            for estado in estados :
                #user=ModelUser.get_by_id(db,int(estado[1]))
                
                h=Historial(estado[0],estado[1],estado[2],estado[3].strftime('%Y-%m-%d %H:%M:%S'),estado[4].strftime('%Y-%m-%d %H:%M:%S'),estado[5],estado[4]-estado[3])
                lHistor.append(h)
            if not lHistor:
                lState=self.listState(db)
                dic={}
                for s in lState:
                    dic[s['nombre']]='0'
                return dic
            else:
                lState=self.listState(db)
                temp=lHistor[0].id_estado
                dic={}
                for s in lState:
                    dic[s['nombre']]='0'
                estado=self.get_by_id(db,lHistor[0].id_estado)
                suma=lHistor[0].totaltime
                for hist in lHistor:
                    idAct=hist.id_estado
                    if temp!=idAct:
                        dic[estado['nombre']]=str(suma.seconds*1000)
                        temp=idAct
                        estado=self.get_by_id(db,idAct)
                        suma=hist.totaltime
                    else:
                        suma = suma + hist.totaltime
                dic[estado['nombre']]=str(suma.seconds*1000)
                
                return dic
        except Exception as ex:
            raise Exception(ex)
       


        
    @classmethod
    def listRTA(self,db,compania):
        try:
            lHistor=[]
            estados=[]
            cursor = db.connection.cursor()
            sql = """SELECT h.ID_HISTORIAL, h.ID_USUARIO,u.id_solvo,concat(u.nombres,' ',u.apellidos) as nombre,ciu.nombre_ciudad,sup.nombres as supervisor,
                h.ID_ESTADO, es.nombre_estado,h.HORA_INICIO ,comp.id_compania,comp.nombre_compania FROM historial AS h
                INNER JOIN estados AS es ON h.id_estado=ES.id_estado
                INNER JOIN usuario AS u ON h.id_usuario=u.id_usuario
                INNER JOIN ciudad AS ciu ON u.id_ciudad=ciu.id_ciudad
                INNER JOIN compania as comp ON u.id_compania=comp.id_compania
                INNER JOIN usuario AS sup ON u.id_supervisor=sup.id_usuario
                WHERE h.TEMP_BOOLEAN = 1 and h.ID_ESTADO <> 1 and h.ID_ESTADO <> 3 and h.ID_ESTADO <> 4 and comp.id_compania={}""".format(compania)
            cursor.execute(sql)
            estados=list(cursor.fetchall())#
            for estado in estados :
                totest=ModelState.totalStates(db,estado[1])
                Hist={'id':estado[1],'id_solvo':estado[2],'Name':estado[3],'Ciudad':estado[4],'Supervisor':estado[5],'id estado':estado[6],'state':estado[7],'time':"00:00:00",'date':estado[8].strftime('%Y-%m-%d %H:%M:%S'),'totest':totest[estado[7]],'compania':estado[10],'idcompania':estado[9]}
                lHistor.append(Hist) 
            if not lHistor:
                
                return None
            return lHistor
        except Exception as ex:
            raise Exception(ex)
       

        
    @classmethod       
    def reporte1(self,db,fechainicio,fechafin):  
        try:
            if fechainicio=="" and fechafin=="":
                inicio=date.today().strftime('%Y-%m-%d')+" 00:00:00"
                fin=date.today().strftime('%Y-%m-%d')+" 23:59:59"
            else:
                inicio=fechainicio+" 00:00:00"
                fin=fechafin+" 23:59:59"
            dict={}
            li=[]
            cursor = db.connection.cursor()
            cursor.callproc('reporte1',(inicio,fin,1))
            results = list(cursor.fetchall())
            id=0
            user=User(0,None,None,None,None)
            for result in results:
                dict={'Date':result[6].strftime('%Y-%m-%d'),'Solvo id':result[1],'Name':result[2],'Last Name':result[3],'Supervisor':result[4],
                      'By':result[5],'Start Time':result[6].strftime('%Y-%m-%d %H:%M:%S'),'Final Time':result[7].strftime('%Y-%m-%d %H:%M:%S'),'State':result[8],'Time':round(result[9]/60)}
                li.append(dict)
            return li
        except Exception as ex:
            raise Exception(ex)
       

    #definicion del metodo reporte 2(consolidado)
    @classmethod       
    def reporte2(self,db,fechainicio):  
        try:
            #si la fecha esta vacia asigne la fecha actual + el rango de hora
            if fechainicio=="":
                inicio=date.today().strftime('%Y-%m-%d')+" 00:00:00"
                fin=date.today().strftime('%Y-%m-%d')+" 23:59:59"
            else:
            #sino asigne el rango a la de horas a la fecha 
                inicio=fechainicio+" 00:00:00"
                fin=fechainicio+" 23:59:59"
            cursor = db.connection.cursor()
            cursor.callproc('reporte2',(inicio,fin,1))
            result = list(cursor.fetchall())
            id=0
            di={}
            lis=[]
            inicio=True
            for res in result:
                if id!=res[0]:
                    if(inicio==False):
                        lis.append(di)
                        di={}
                    di['Date']=fechainicio
                    di['Solvo id']=res[1]
                    di['Name']=res[2]
                    di['Last Name']=res[3]
                    di['Supervisor']=res[4]
                    di['Available']=0
                    di['Not Available']=0
                    di['Break']=0
                    di['Lunch']=0
                    di['Team Meeting']=0
                    di['Coaching']=0
                    id=res[0]
                    inicio=False
                di[res[6]] =res[7]
            lis.append(di)
            cursor.close()
            return lis
        except Exception as ex:
            raise Exception(ex)
        