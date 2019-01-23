from flask import Flask
from flask_ini import FlaskIni

app = Flask(__name__)
app.iniconfig = FlaskIni()
with app.app_context():
    app.iniconfig.read('config/askomics.ini')

app.secret_key = app.iniconfig.get('flask', 'secret_key')

import askomics.routes.view
import askomics.routes.api
import askomics.routes.catch_url