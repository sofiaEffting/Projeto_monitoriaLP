
import email
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

def getDescricao(id: int):
    desc = Avaliacao.query(Avaliacao.descricao).filter(Avaliacao.id == id).first()
    if desc is not None:
        desc = desc[0]
    return desc

def getDataInicio(id: int):
    data = Avaliacao.query(Avaliacao.dataInicio).filter(Avaliacao.id == id).first()
    if data is not None:
        data = data[0]
    return data

def getDataFim(id: int):
    data = Avaliacao.query(Avaliacao.dataFim).filter(Avaliacao.id == id).first()
    if data is not None:
        data = data[0]
    return data

def getID(desc: str):
    id = Avaliacao.query(Avaliacao.id).filter(Avaliacao.descricao == desc).first()
    if id is not None:
        id = id[0]
    return id

def getProf(id: int):
    prof = Avaliacao.query(Avaliacao.prof_id).filter(Avaliacao.id == id).first()
    if prof is not None:
        prof = prof[0]
    return prof

def getArquivo(id: int):
    arq = Avaliacao.query(Avaliacao.arquivo).filter(Avaliacao.id == id).first()
    if arq is not None:
        arq = arq[0]
    return arq

def update_av(email: str, desc_av: str, campos: list, dados):
    try:
        av = getAvaliacao(desc_av)
        if av is not None and av.prof.email == email:
            if 'prof' in campos:
                Avaliacao.query.filter(Avaliacao.descricao == desc_av).update(dict(prof_id = dados['prof']))
            if 'arquivo' in campos:
                Avaliacao.query.filter(Avaliacao.descricao == desc_av).update(dict(arquivo = dados['arquivo']))
            if 'turma' in campos:
                Avaliacao.query.filter(Avaliacao.descricao == desc_av).update(dict(turma_id = dados['turma']))
            if 'dataFim' in campos:
                Avaliacao.query.filter(Avaliacao.descricao == desc_av).update(dict(dataFim = dados['dataFim']))
            if 'dataInicio' in campos:
                Avaliacao.query.filter(Avaliacao.descricao == desc_av).update(dict(dataInicio = dados['dataInicio']))
            if 'descricao' in campos:
                Avaliacao.query.filter(Avaliacao.descricao == desc_av).update(dict(descricao = dados['descricao']))
            else:
                raise Exception
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