import os
from flask import render_template
import cryptocode
from  models.ModelUser import ModelUser
from email.message import EmailMessage
import ssl
from smtplib import SMTP_SSL
def send_Mail(db,Email,To):
        val=ModelUser.ExistsUser(db,Email)
        if(val==True):
            passw=ModelUser.getPassword(db,Email)
            if(passw!=''):
                passw=cryptocode.decrypt(passw, "Solvo#1056$?")
                msg=EmailMessage()
                msg['From']="RTA_SOLVO "
                msg['To']=To
                msg['Subject']='RECORDER PASSWORD'
                msg.set_content('This should be in the email body')
                msg.add_alternative(render_template('email.html',user=Email, Password=passw),subtype='html')
                context=ssl.create_default_context()
                with SMTP_SSL('smtp.gmail.com',465,context=context) as smtp:
                    smtp.login(os.environ.get('USER_EMAIL'),os.environ.get('PASSWORD_EMAIL'))
                    smtp.sendmail(os.environ.get('USER_EMAIL'),To,msg.as_bytes())
                return True
        return False