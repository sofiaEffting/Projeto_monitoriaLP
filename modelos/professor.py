import os, sys
currentdir = os.path.dirname(os.path.realpath(__file__)) # /home/friend/01-github/dw2ed/fund/python/pacote/ex5/classes
parentdir = os.path.dirname(currentdir) # /home/friend/01-github/dw2ed/fund/python/pacote/ex5
sys.path.append(parentdir) 
from config import *
from bcrypt import *

class Professor(db.Model):
    
    __tablename__ = 'professor'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(254), nullable=False)
    email = db.Column(db.String(254), nullable=False)
    senha = db.Column(db.Text, nullable=False)
    avaliacoes = db.relationship("Avaliacao", back_populates="prof")
    turmas = db.relationship("Turma", back_populates="prof")

    def json(self):
        json = {
            'id': self.id,
            'nome': self.nome,
            'email': self.email,
        }
        avs = ''
        turmas = ''
        for i in self.avaliacoes:
            avs += i.descricao + ' | '
        for i in self.turmas:
            turmas += i.nome + ' | '
        json.update({'avaliações': avs, 'turmas': turmas})
        return json

    
    def __str__(self) -> str:
        avs = ''
        turmas = ''
        for i in self.avaliacoes:
            avs += i.descricao + ' | '
        for i in self.turmas:
            turmas += i.nome + ', '
        return f'Id: {self.id} | Nome: {self.nome} | Email: {self.email} | Senha: {self.senha} | Avaliações: {avs}'+\
                    f'Turmas: {turmas.removesuffix(", ")} |'

def criptografar_senha(senha: str):
    senha = senha.encode('utf-8')
    senha = hashpw(senha, gensalt())
    return senha

def verifica_senha(senha_dig:str, email_dig:str) -> bool:
    try:
        senha_bd = getSenha(email_dig)
        if senha_bd is not None:
            senha_dig = senha_dig.encode('utf-8')
            if checkpw(senha_dig, senha_bd):
                return True
        return False
    except Exception:
        return False


def getProfessor(email: str):
    return Professor.query.filter(Professor.email == email).first()

def getIdProf(email: str):
    prof_id = db.session.query(Professor.id).filter(Professor.email == email).first()
    if prof_id is not None:
        prof_id = prof_id[0]
    return prof_id

def getNomeProf(email: str):
    profNome = db.session.query(Professor.nome).filter(Professor.email == email).first()
    if profNome is not None:
        profNome = profNome[0]
    return profNome

def getSenha(email: str):
    profSenha = db.session.query(Professor.senha).filter(Professor.email == email).first()
    if profSenha is not None:
        profSenha = profSenha[0]
    return profSenha

def getAvs(email: str):
    prof = getProfessor(email)
    return prof.avaliacoes

def getTurmas(email: str):
    prof = getProfessor(email)
    return prof.turmas

def updateNome(nome: str, email: str):
    try:
        if getProfessor(nome) is None:
            Professor.query.filter(Professor.email==email).update(dict(nome=nome))
            db.session.commit()
            return True
        return False
    except Exception:
        return False

def updateSenha(senha: str, email: str):
    try:
        if Professor.query.filter(Professor.email==email).update(dict(senha=senha)):
            db.session.commit()
            return True
        return False
    except Exception:
        return False

def updateEmail(email_atual: str, email_novo: str):
    try:
        if getProfessor(email_novo) is None:
            Professor.query.filter(Professor.email==email_atual).update(dict(email=email_novo))
            db.session.commit()
            return True
        return False
    except Exception:
        return False

def deleteProf(email: str):
    try: 
        if getProfessor(email) is not None:
            Professor.query.filter(Professor.email == email).delete()
            db.session.commit()
            return True
        return False
    except Exception:
        return False

def cadastrarProf(nome: str, email: str, senha: str):
    try: 
        if getProfessor(email) is None:
            senha = criptografar_senha(senha)
            prof = Professor(nome = nome, email = email, senha = senha)
            db.session.add(prof)
            db.session.commit()
            return True
        return False
    except Exception:
        return False