import os

from config import *

os.path.join(path, 'oi/oi2')
import subprocess

#subprocess.run(["touch", "teste_txt.txt"])
'''subprocess.run(['ls'])
subprocess.run(['dd', 'if=teste_txt.txt', 'of=teste_txt.pdf'])
subprocess.run(['ls'])
subprocess.run(['cat', 'teste_txt.pdf'])'''

nome_av = 'nome_av'
alunos = ['aluno1', 'aluno2', 'aluno3']

def add_av(nome_av: str, alunos: list, av_arq: str):
    subprocess.run(['mkdir', str(nome_av)])
    for aluno in alunos:
        arq = str(nome_av)+'/'+str(aluno)
        subprocess.run(['mkdir', str(arq)])

def add_resposta(nome_av: str, nome_aluno: str, arquivos):
    subprocess.run(['cd', f'{str(nome_av)}/{str(nome_aluno)}'])
    subprocess.run([''])

def gerar_pdf():
    subprocess.run(['ls'])
    #subprocess.run(['dd', 'if=teste_txt.txt', 'of=teste_txt.pdf'])
    os.system('lp -d PDF teste_txt.txt')
    subprocess.run(['ls'])
    subprocess.run(['cat', 'teste_txt.pdf'])

'''add_av(nome_av, alunos)'''

if __name__ == '__main__':
    gerar_pdf()


