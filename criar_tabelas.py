from modelos.avaliacao import *
from modelos.professor import *
from modelos.turma import *
from config import *

# caso o arquivo já exista ele é excluído
if os.path.exists(arquivobd):
    os.remove(arquivobd)

# criar tabelas
db.create_all()

print("Banco de dados e tabelas criadas")