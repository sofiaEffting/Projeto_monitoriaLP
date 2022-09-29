import os, sys
currentdir = os.path.dirname(os.path.realpath(__file__)) # /home/friend/01-github/dw2ed/fund/python/pacote/ex5/classes
parentdir = os.path.dirname(currentdir) # /home/friend/01-github/dw2ed/fund/python/pacote/ex5
sys.path.append(parentdir) 
from config import *

class Turma(db.Model):
    
    __tablename__ = 'turma'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(254), nullable=False)
    alunos = db.Column(db.Text)
    prof_id = db.Column(db.Integer, db.ForeignKey('professor.id'))
    prof = db.relationship('Professor', back_populates='turmas')
    avaliacoes = db.relationship('Avaliacao', secondary='tabela_associacao', back_populates="turmas", cascade="all, delete")

    def json(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'alunos': self.alunos
        }

    def __str__(self) -> str:
        return f'Id: {self.id} | Nome: {self.nome} | Alunos: {self.alunos}'

def getListAlunos(alunos: str):
    # retorna lista de aluno com email
    lista = alunos.split(',')
    return lista

def getNomeAlunos(alunos: str):
    # retorna lista dos nomes dos alunos
    lista = getListAlunos(alunos)
    nomes = []
    for i in lista:
        divisao = i.split('<')
        nome = divisao[0]
        nome = nome.replace('>', '').strip()
        nomes.append(nome)
    return nomes

def getEmails(alunos: str):
    # retorna uma lista dos emails
    lista = getListAlunos(alunos)
    emails = []
    for i in lista:
        divisao = i.split('<')
        email = divisao[1]
        email = email.replace('>', '')
        emails.append(email)
    return emails

def getAlunos(nome: str):
    t = getTurma(nome)
    return t.alunos

def getTurmabyID(id: int):
    return Turma.query.filter(Turma.id == id).first()

def getTurma(nome: str):
    return Turma.query.filter(Turma.nome == nome).first()

def getID(nome: str):
    id = Turma.query(Turma.id).filter(Turma.nome == nome).first()
    if id is not None:
        id = id[0]
    return id

def delete_turma(email: str, id: int):
    try:
        turma = getTurmabyID(id)
        if turma is not None and turma.prof.email == email:
            db.session.execute(f'DELETE FROM tabela_associacao WHERE turma_id = {id}')  
            Turma.query.filter(Turma.id == id).delete()
            db.session.commit()
            return True
        return False
    except Exception as e:
        print(e)
        return False

def cadastrarTurma(nome: str, alunos: str, prof_id: int):
    try:
        if getTurma(nome) is None:
            turma = Turma(nome = nome, alunos = alunos, prof_id = prof_id)
            db.session.add(turma)
            db.session.commit()
            return True
        return False
    except Exception:
        return False

def update_turma(email: str, id_turma: str, dados):
    try:
        turma = getTurmabyID(id_turma)
        if turma is not None and turma.prof.email == email:
            if 'nome' in dados:
                turma.nome = dados['nome']
            if 'alunos' in dados:
                turma.alunos = dados['alunos']
            if 'avaliacoes' in dados:
                turma.avaliacoes = dados['avaliacoes']
            if dados == {}: 
                return False
            db.session.commit()
            return True
        return False
    except Exception as e:
        return False

