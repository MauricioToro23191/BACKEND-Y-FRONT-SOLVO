
from datetime import timedelta,datetime
from models.ModelUser import ModelUser
from models.ModelState import ModelState
from jwt import encode,decode,exceptions
from os import  getenv
from flask import jsonify 

def authenticate(db,user):
    logged_user = ModelUser.login(db,user)
    if logged_user != None:
        if logged_user['pass']:
            ModelState.call_procedure(db,logged_user,"",4)
            tocken=write_tocken(logged_user)
            return {'bool':True,'response':'Login succesfully','usuario':logged_user,'tocken':tocken.decode("utf-8")}
        else:
            #contraseña incorrecta
            return {'bool':False,'response':'Invalid password...','usuario':None,'tocken':None}
    else:
        #usuario no existe
        return {'bool':False,'response':'User not found...','usuario':None,'tocken':None}

def identity (payload):
    print("identity")
    user_id=payload['identity']
    user=ModelUser.get_by_id(user_id)
    return user
def expire_date(days:int):
    now=datetime.now()
    new_date=now +timedelta(days)
    return new_date

def write_tocken(data:dict):
    tocken=encode(payload={**data,"exp":expire_date(2)},key=getenv("SECRET"),algorithm="HS256")
    return tocken

def validate_tocken(tocken,output=False):
    try:
        if(output):
            return decode(tocken,key=getenv("SECRET"),algorithms=["HS256"])
        decode(tocken,key=getenv("SECRET"),algorithms=["HS256"])
    except exceptions.DecodeError:
        response=jsonify({'message':'invalid Tocken'})
        response.status_code=401
        return response
    except exceptions.ExpiredSignatureError:
        response=jsonify({'message':'Tocken Expired'})
        response.status_code=401
        return response