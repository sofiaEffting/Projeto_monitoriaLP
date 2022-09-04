import os, sys
currentdir = os.path.dirname(os.path.realpath(__file__)) # /home/friend/01-github/dw2ed/fund/python/pacote/ex5/classes
parentdir = os.path.dirname(currentdir) # /home/friend/01-github/dw2ed/fund/python/pacote/ex5
sys.path.append(parentdir) 
from config import *
from modelos.turma import Turma


class Avaliacao(db.Model):

    __tablename__ = 'avaliacao'
    id = db.Column(db.Integer, primary_key=True)
    descricao = db.Column(db.String(254), nullable=False)
    dataInicio = db.Column(db.String(254), nullable=False)
    dataFim = db.Column(db.String(254))

    turmas = db.relationship("Turma", secondary='tabela_associacao', back_populates= 'avaliacoes', cascade="all, delete")
    
    prof_id = db.Column(db.Integer, db.ForeignKey('professor.id'))
    prof = db.relationship('Professor', back_populates='avaliacoes')

    arquivo = db.Column(db.Text)

    def json(self):
        json = {
            'id': self.id,
            'descricao': self.descricao,
            'dataInicio': self.dataInicio,
            'dataFim': self.dataFim,
            'professor': self.prof.nome
        }
        turmas = ''
        for i in self.turmas:
            turmas += i.nome + ', '
        json.update({'turmas': turmas.removesuffix(", ")})
        return json

    def __str__(self) -> str:
        turmas = ''
        for i in self.turmas:
            turmas += i.nome + ', '
        return f'Id: {self.id} | Descrição: {self.descricao} | Data início: {self.dataInicio} | Data final: {self.dataFim} '\
        f'| Turmas: {turmas.removesuffix(", ")} | Professor: {self.prof.nome} | Arquivo: {self.arquivo}'

def getAvaliacao(desc: str):
    return Avaliacao.query.filter(Avaliacao.descricao == desc).first()
    
def getAvaliacaobyID(id: int):
    return Avaliacao.session.get(id)

def getID(desc: str):
    id = Avaliacao.query(Avaliacao.id).filter(Avaliacao.descricao == desc).first()
    if id is not None:
        id = id[0]
    return id

def getArquivo(id: int):
    arq = Avaliacao.query(Avaliacao.arquivo).filter(Avaliacao.id == id).first()
    if arq is not None:
        arq = arq[0]
    return arq

def update_av(email: str, desc_av: str, dados):
    try:
        av = getAvaliacao(desc_av)
        if av is not None and av.prof.email == email:
            if 'prof' in dados:
                av.prof = dados['prof']
            if 'arquivo' in dados:
                av.arq = dados['arquivo']
            if 'turma' in dados:
                av.turma = dados['turma']
            if 'dataFim' in dados:
                av.dataFim = dados['dataFim']
            if 'dataInicio' in dados:
                av.dataInicio = dados['dataInicio']
            if 'descricao' in dados:
                av.descricao = dados['descricao']
            if dados is None:
                return False
            db.session.commit()
            return True
        return False
    except Exception as e:
        return False

def deleteAvaliacao(id: int, email: str):
    try:
        av = getAvaliacao(id)
        if av is not None and av.prof.email == email:
            Avaliacao.query.filter(Avaliacao.id == id).delete()
            db.session.commit()
            return True
        return False
    except Exception:
        return False

def cadastrarAvaliacao(desc: str, dataInicio: str, dataFim: str, turmas: list, prof_id: int, **kwargs):
    try:
        if getAvaliacao(desc) is None:
            av = Avaliacao(descricao = desc, dataInicio = dataInicio, dataFim = dataFim, turmas = turmas, prof_id = prof_id, **kwargs)
            if av:
                db.session.add(av)
                db.session.commit()
            return True
        return False
    except Exception as e:
        return e

tabela_associacao  = db.Table('tabela_associacao', db.metadata, 
    db.Column('turma.id', db.Integer, db.ForeignKey(Turma.id, ondelete='CASCADE'), primary_key=True),
    db.Column('Avaliacao.id', db.Integer, db.ForeignKey(Avaliacao.id, ondelete='CASCADE'), primary_key=True)
    )