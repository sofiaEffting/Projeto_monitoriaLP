from modelos.avaliacao import *
from modelos.professor import *
from modelos.turma import *
from config import *

from sqlalchemy.engine import Engine
from sqlalchemy import event

# caso o arquivo já exista ele é excluído
if os.path.exists(arquivobd):
    os.remove(arquivobd)

@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()

# criar tabelas
db.create_all()

print("Banco de dados e tabelas criadas")