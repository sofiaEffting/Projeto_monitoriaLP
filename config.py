from flask import Flask, jsonify, request, session, render_template
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
import os
from flask_cors import CORS, cross_origin #permitir back receber json do front

# configs
app = Flask(__name__)
CORS(app)
#meu_servidor = 191.52.6.185 #eduroam

# BD
path = os.path.dirname(os.path.abspath(__file__))
arquivobd = os.path.join(path, 'project.db')
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///"+arquivobd
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# segurança 
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from datetime import timedelta

app.config['JWT_SECRET_KEY'] = 'eUqIOCuW5Dl7g5s3F0yMXILVXPW1Lctqw4AbnmAN'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes= 120)
jwt = JWTManager(app)