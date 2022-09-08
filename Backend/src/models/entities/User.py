from werkzeug.security import check_password_hash,generate_password_hash

class User():

    def __init__(self,id,correo_solvo,compania,ciudad,contrasena="",id_solvo="",nombres="",apellidos="",id_perfil=4,estado="",id_supervisor=0,namesupervisor="") -> None:
        self.id=id
        self.id_solvo=id_solvo
        self.nombres=nombres
        self.apellidos=apellidos
        self.correo_solvo=correo_solvo
        self.estado=estado
        self.perfil=id_perfil
        self.id_supervisor=id_supervisor
        self.namesupervisor=namesupervisor
        self.contrasena=contrasena
        self.compania=compania
        self.ciudad=ciudad
        

    @classmethod
    def check_password(self, hashed_password, password):
        return check_password_hash(hashed_password, password)
    
    def __repr__(self):
       return "id: " + str(self.id) +",contrasena: " + str(self.contrasena) + ",id_solvo: " + str(self.id_solvo) + ", nombres: " + str(self.nombres)  + ", apellidos: " + str(self.apellidos) + ", correo: " + str(self.correo_solvo) + ", estado: " + str(self.estado)+ ", id_supervisor:" + str(self.id_supervisor) +",namesupervisor:"+str(self.namesupervisor)
#print(generate_password_hash('Mauricio')) 