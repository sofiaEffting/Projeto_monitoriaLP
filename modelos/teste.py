import os, sys
from xml.dom.minidom import Identified

currentdir = os.path.dirname(os.path.realpath(__file__)) # /home/friend/01-github/dw2ed/fund/python/pacote/ex5/classes
parentdir = os.path.dirname(currentdir) # /home/friend/01-github/dw2ed/fund/python/pacote/ex5
sys.path.append(parentdir) 
from config import *
from modelos.avaliacao import *
from modelos.professor import *
from modelos.turma import *

from sqlalchemy.engine import Engine
from sqlalchemy import event



if __name__ == '__main__':
    if os.path.exists(arquivobd): # se o arquivo já existe... 
        os.remove(arquivobd) # ... o arquivo é removido 
    
    @event.listens_for(Engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

    db.create_all() # criar as tabelas no banco

    #email = 'efftingsofia@gmail.com' # pega email -turma 3
    senha = criptografar_senha('12345678')

    prof1 = Professor(nome='sofia', email='efftingsofia@gmail.com', senha= senha)
    turma1 = Turma(nome='301 info', alunos='aluno1 <a1@gmail.com>, aluno2 <a2@gmail.com>', prof_id=1)
    turma2 = Turma(nome='302 info', alunos='aluno1 <a1@gmail.com>, aluno2 <a2@gmail.com>', prof_id=1)
    av1 = Avaliacao(id=1, descricao='av1', dataInicio='hj', dataFim='amn', turmas=[turma1, turma2], prof_id=1)
    av2 = Avaliacao(id=2, descricao='av2', dataInicio='hj', dataFim='amn', turmas=[turma1], prof_id=1)
    av3 = Avaliacao(id=3, descricao='av3', dataInicio='hj', dataFim='amn', turmas=[turma2], prof_id=1)
    db.session.add(prof1)
    db.session.add(turma1)
    db.session.add(turma2)
    db.session.add(av1)
    db.session.add(av2)
    db.session.add(av3)
    db.session.commit()
    '''print(Avaliacao.query.filter(Avaliacao.turmas.contains(turma1)).all())
    Turma.query.filter(Turma.id == 1).delete()
    db.session.commit()
    Avaliacao.query.filter(Avaliacao.id == 1).delete()
    db.session.commit()
    print(Avaliacao.query.filter(Avaliacao.turmas.contains(turma1)).all())'''
    #print(update_av(email='efftingsofia@gmail.com', desc_av='av1', campos=['descricao', 'dataFim'], dados={'descricao': 'desc alterada', 'dataFim': 'data alterada'}))
