import os, sys
from modelos.avaliacao import Avaliacao, tabela_associacao
from modelos.turma import Turma
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

filtro = ('alert.','<script>','<','>','javascript',';','--',",","=","+",'/',"'",'"',"src=","admin'--"
            ,"or 1=1", "delete from usuario", "document.write","sessionStorage.","Window.","document.",'href=',"]>")

def verifica_injecao(dado: str):
    for f in filtro: # laço de repetição que verifica se não há um texto suspeito de possuir injeção XSS ou SQL.
        if f in dado:
            resposta = dado.replace(f,'')
    if dado == '':
        resposta = None
    return resposta

def verifica_injecao_email(email: str):
    for f in filtro: # laço de repetição que verifica se não há um texto suspeito de possuir injeção XSS ou SQL.
        if f in email:
            resposta = email.replace(f,'')
    if resposta == '' and len(resposta)<=4 or '@' not in resposta:
        resposta = None
    return resposta

def criptografar_senha(senha: str):
    senha = senha.encode('utf-8')
    senha = hashpw(senha, gensalt())
    return senha

def verifica_senha(senha_dig:str, email_dig:str) -> bool:
    try:
        prof = getProfessor(email_dig)
        if prof.senha is not None:
            senha_dig = senha_dig.encode('utf-8')
            if checkpw(senha_dig, prof.senha):
                return True
        return False
    except Exception:
        return False

def getProfessor(email: str):
    return Professor.query.filter(Professor.email == email).first()

def getIdProf(email: str):
    prof = getProfessor(email)
    return prof.id

def getAvs(email: str):
    prof = getProfessor(email)
    return prof.avaliacoes

def getTurmas(email: str):
    prof = getProfessor(email)
    return prof.turmas

def update_prof(email: str, dados):
    try:
        prof = getProfessor(email)
        if prof is not None:
            if 'nome' in dados:
                prof.nome = verifica_injecao(dados['nome']) 
            if 'senha' in dados:
                senha = verifica_injecao(dados['senha']) 
                prof.senha = criptografar_senha(senha) 
            if 'email' in dados:
                prof.email = verifica_injecao_email(dados['email'])
            if dados is None:
                return False
            db.session.commit()
            return True
        return False
    except Exception as e:
        return False

def deleteProf(email: str):
    try: 
        if getProfessor(email) is not None:
            id = getIdProf(email)
            Professor.query.filter(Professor.email == email).delete()
            Avaliacao.query.filter(Avaliacao.prof_id == id).delete()
            Turma.query.filter(Turma.prof_id == id).delete()
            # excluir dados da tabela associação
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