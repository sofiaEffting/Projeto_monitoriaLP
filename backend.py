import shutil
from flask import send_file
from config import *
from modelos.avaliacao import *
from modelos.professor import *
from modelos.turma import *

# USUARIO / PROFESSOR ======================================

'''$ curl -d '{"nome":"sofia_teste","email":"efftingsofia@gmail.com","senha":"12345678"}' 
-X POST -H "Content-Type:application/json" localhost:5000/cadastroUsuario'''
@app.route('/cadastroUsuario', methods=['POST'])
def cadastroUsuario():

    dados = request.get_json()

    try:
        if cadastrarProf(**dados):
            resposta = jsonify({'Resultado': 'ok', 'Detalhes': 'ok'})
        else:
            resposta = jsonify({'Resultado': 'Erro', 'Detalhes': 'Usuário já cadastrado!'})
    except Exception as e:
        resposta = jsonify({'Resultado': 'Erro', 'Detalhes': str(e)})
    resposta.headers.add('Access-Control-Allow-Origin', '*')
    return resposta

@app.route('/excluirUsuario/<string:email>', methods=['DELETE'])
@jwt_required()
def excluirUsuario(email):
    try:
        if deleteProf(email):
            resposta = jsonify({'Resultado': 'ok', 'Detalhes': 'ok'})
        else:
            resposta = jsonify({'Resultado': 'Erro', 'Detalhes': 'Usuário não cadastrado!'})
    except Exception as e:
        resposta = jsonify({'Resultado':'erro', 'Detalhes':str(e)})

    resposta.headers.add('Access-Control-Allow-Origin', '*')
    return resposta

@app.route('/atualizarUsuario/<string:email>', methods=['PUT'])
@jwt_required()
def atualizarUsuario(email):
    try:
        novos_dados = request.get_json(force=True) 
        if update_prof(email, novos_dados):
            resposta = jsonify({'Resultado': 'ok'})
        else:
           resposta = jsonify({'Resultado': 'Erro', 'Detalhes': 'Erro ao atualizar!'})
    except Exception as e:
         resposta = jsonify({'Resultado': 'Erro', 'Detalhes': str(e)})

    resposta.headers.add('Access-Control-Allow-Origin', '*')
    return resposta


# LOGIN -----------------------------------------

# curl -X POST localhost:5000/login -d '{"email": "efftingsofia@gmail.com", "senha": "12345678"}' -H 'Content-Type: application/json'
#{
#  "detalhes": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY1ODMxNTEzOSwianRpIjoiZTVmMGVjMGEtOGZjMC00N2QyLWE4YjItOTMzNTY4MjMwZTM5IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6Impvc2lsdmFAZ21haWwuY29tIiwibmJmIjoxNjU4MzE1MTM5LCJleHAiOjE2NTgzMTYwMzl9.DjTA7h8idYfFpXixYl7gCGtu9rmahlj2IXTtlbkE0nc", 
#  "resultado": "ok"
#}
@app.route('/login', methods= ['POST'])
def login():
    try:  
        dados = request.get_json(force=True)
        email = dados['email']
        login = verifica_senha(dados['senha'], email)
        
        if login: # Deu bom
            user = getProfessor(email)
            nome = user.nome
            turmas = user.turmas
            avs = user.avaliacoes

            # criar a json web token (JWT)
            access_token = create_access_token(identity=email)

            resposta = jsonify({'Resultado': 'ok', 'Detalhes': 'ok', 'email': str(email), 'nome': str(nome), 'turmas': str(turmas), 'avs': str(avs), 'token': access_token})

        else: # Erro
            resposta = jsonify({'Resultado': 'Erro', 'Detalhes': 'Erro ao realizar login!'})

    except Exception:
        resposta = jsonify({'Resultado': 'Erro', 'Detalhes': 'Erro ao realizar login!'})

    # adicionar cabeçalho de liberação de origem
    resposta.headers.add('Access-Control-Allow-Origin', 'true')
    # permitir envio do cookie
    # resposta.headers.add('Access-Control-Allow-Credentials', 'true')

    return resposta

# AVALIACAO ======================================

@app.route('/cadastroAvaliacao', methods=['POST'])
@jwt_required()
def cadastroAvaliacao():
    try: 
        resposta = jsonify({'Resultado': 'ok', 'Detalhes': 'ok'})
        dados = request.get_json(force=True)
        prof_id = getIdProf(dados['email'])
        turmas = []
        for i in dados['turmas']:
            t = getTurmabyID(i)
            turmas.append(t)
        if cadastrarAvaliacao(desc= dados['descricao'], dataInicio= dados['dataInicio'], 
        dataFim= dados['dataFim'], turmas= turmas, prof_id = prof_id, arquivo = dados['arquivo']):
            resposta = jsonify({'Resultado': 'ok', 'Detalhes': 'ok'})
        else:
            resposta = jsonify({'Resultado': 'Erro', 'Detalhes': 'Erro ao cadastrar avaliação!'})

    except Exception as e:
        resposta = jsonify({'Resultado': 'Erro', 'Detalhes': str(e)})
    
    resposta.headers.add('Access-Control-Allow-Origin', '*')
    return resposta


@app.route("/salvar_arqs/<string:nome_av>/<turmas>", methods=['POST'])
def salvar_arqs(nome_av: str, turmas):
    try:
        resposta = jsonify({"resultado":"ok", "detalhes": "Arquivo salvo!"})
        file_val = request.files['arqs'] # pega o arquivo
        caminho_pasta = os.path.join(path, 'avaliacoes/'+ str(nome_av)) # definir o caminho da pasta da av
        if os.path.isdir(caminho_pasta) is False: # verifica se a pasta já não existe
            os.mkdir(caminho_pasta) # criar a pasta da avaliação
            caminho_arq = os.path.join(caminho_pasta, file_val.filename) # define o caminho do arquivo
            file_val.save(caminho_arq) # salvar arquivo
            # cria a pasta da turma
            turmas = turmas.split(',')
            for t in turmas: 
                turma = getTurmabyID(t)
                pasta_turma = os.path.join(caminho_pasta, str(turma.nome))
                # cria as pastas dos alunos
                if os.path.isdir(pasta_turma) is False:
                    os.mkdir(pasta_turma)
                    nome_alunos = getNomeAlunos(turma.alunos)
                    for nome in nome_alunos:
                        caminho_pastas_alunos = os.path.join(pasta_turma, str(nome))
                        os.mkdir(caminho_pastas_alunos)
        else:
            resposta = jsonify({"resultado":"erro", "detalhes": "A avaliação já está cadastrada!"})
    except Exception as e:
        resposta = jsonify({"resultado":"erro", "detalhes": str(e)})
    resposta.headers.add("Access-Control-Allow-Origin", "*")
    return resposta

'''@app.route('/gerar_pdf/<int: id_av>', methods=['GET'])
@jwt_required()
def gerar_pdf(id_av: int):
    pass
'''
@app.route('/deleteAv/<string:email>/<int:av_id>', methods=['DELETE'])
@jwt_required()
def deleteAv(email, av_id):
    try:
        av = getAvaliacaobyID(av_id)
        caminho_pasta = os.path.join(path, 'avaliacoes/'+str(av.descricao))
        if deleteAvaliacao(av_id, email):
            shutil.rmtree(str(caminho_pasta)) #exclui a pasta da avaliação e todos os seus componentes
            resposta = jsonify({'Resultado': 'ok', 'Detalhes': 'ok'})
        else:
            resposta = jsonify({'Resultado': 'Erro', 'Detalhes': 'Avaliação não cadastrada!'})
    except Exception as e:
        resposta = jsonify({'Resultado': 'Erro', 'Detalhes': str(e)})

    resposta.headers.add('Access-Control-Allow-Origin', '*')
    return resposta

@app.route('/atualizar_av/<string:email>/<int:id_av>', methods=['PUT'])
@jwt_required()
def atualizar_av(email, id_av):
    try:
        dados = request.get_json(force=True)
        if update_av(email, id_av, dados):
            resposta = jsonify({'Resultado': 'ok', 'Detalhes': 'ok'})
        else:
            resposta = jsonify({'Resultado': 'Erro', 'Detalhes': 'backend'})

    except Exception as e:
        resposta = jsonify({'Resultado': 'Erro', 'Detalhes': str(e)})

    resposta.headers.add('Access-Control-Allow-Origin', '*')
    return resposta

# RESPOSTAS ==================================

@app.route('/salvar_resposta/<string:nome_av>')
def salvar_resposta(nome_av):
    try: 
        resposta = jsonify({'Resultado': 'ok', 'Detalhes': 'ok'})
        dados = request.get_json(force=True)
        prof = dados[0]
        turma = dados[1]
        nome_aluno = dados[2]
        arq = request.files['arq']
        caminho_pasta_aluno = os.path.join(path, 'avaliacoes/' + str(nome_av) + '/' + str(turma) + '/' + str(nome_aluno))
        if os.path.isdir(caminho_pasta_aluno) is True:
            caminho_arq = os.path.join(caminho_pasta_aluno, arq.filename)
            arq.save(caminho_arq)
    except Exception as e:
        resposta = jsonify({'Resultado': 'Erro', 'Detalhes': str(e)})

    resposta.headers.add('Access-Control-Allow-Origin', '*')
    return resposta


@app.route('/excluir_resposta')
def excluir_resposta():
    pass

# TURMA ======================================

@app.route('/cadastroTurma', methods=['POST'])
@jwt_required()
def cadastroTurma():
    try:
        dados = request.get_json(force=True)  
        id = getIdProf(dados['email'])
        if cadastrarTurma(nome= dados['nome'], alunos = dados['alunos'], prof_id = id):
            resposta = jsonify({'Resultado': 'ok', 'Detalhes': 'ok'})
        else:
            resposta = jsonify({'Resultado': 'Erro', 'Detalhes': 'Turma já cadastrada!'})

    except Exception as e:
        resposta = jsonify({'Resultado': 'Erro', 'Detalhes': str(e)})
    
    resposta.headers.add('Access-Control-Allow-Origin', '*')
    return resposta

@app.route('/atualizar_turma/<string:email>/<int:id_turma>', methods=['PUT'])
@jwt_required()
def atualizar_turma(email, id_turma):
    try:
        dados = request.get_json(force=True)
        if update_turma(email, id_turma, dados):
            resposta = jsonify({'Resultado': 'ok', 'Detalhes': 'ok'})
        else:
            resposta = jsonify({'Resultado': 'Erro', 'Detalhes': 'backend'})

    except Exception as e:
        resposta = jsonify({'Resultado': 'Erro', 'Detalhes': str(e)})

    resposta.headers.add('Access-Control-Allow-Origin', '*')
    return resposta

@app.route('/deleteTurma/<string:email>/<int:turma_id>', methods=['DELETE'])
@jwt_required()
def deleteTurma(email, turma_id):
    try:
        if delete_turma(email, turma_id):
            resposta = jsonify({'Resultado': 'ok', 'Detalhes': 'ok'})
        else:
            resposta = jsonify({'Resultado': 'Erro', 'Detalhes': 'Turma não cadastrada!'})
    except Exception as e:
        resposta = jsonify({'Resultado': 'Erro', 'Detalhes': str(e)})

    resposta.headers.add('Access-Control-Allow-Origin', '*')
    return resposta

# RENDERIZAÇÃO DE PÁGINAS ===============================

@app.route('/render_cadastroProf')
def render_cadastro():
    return render_template('cadastroProf.html')

@app.route('/render_usuario')
def render_usuario():
    return render_template('usuario.html')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/render_excluirUsuario')
def render_excluirUsuario():
    return render_template('excluirUsuario.html')

@app.route('/render_update')
def render_update():
    return render_template('alterar_dados.html')

@app.route('/render_deleteTurma')
def render_deleteTurma():
    return render_template('excluirTurma.html')

@app.route('/render_updateTurma')
def render_updateTurma():
    return render_template('editarTurma.html')

@app.route('/render_cadastroTurma')
def render_cadastroTurma():
    return render_template('cadastroTurma.html')

@app.route('/render_turma')
def render_turma():
    return render_template('turma.html')

@app.route('/render_cadastroAv')
def render_cadastroAv():
    return render_template('cadastroAv.html')

@app.route('/render_deleteAv')
def render_deleteAv():
    return render_template('excluirAv.html')

@app.route('/render_av')
def render_av():
    return render_template('av.html')

@app.route('/render_updateAv')
def render_updateAv():
    return render_template('editarAv.html')

@app.route('/submeter_resposta')
def render_submeter_resposta():
    return render_template('submeter_resposta.html')

# CARREGAR INFOS ===========================================

#@app.route('/get_arquivo', methods=['GET'])
@app.route('/get_arquivo/<int:id_av>', methods=['GET'])
def get_arquivo(id_av):
    try:
        av = getAvaliacaobyID(id_av)
        caminho = os.path.dirname(os.path.abspath(__file__))
        caminho += '/avaliacoes/'+ str(av.descricao) + '/' + str(av.arquivo)
        return send_file(caminho, mimetype='application/pdf')

    except Exception as e:
        resposta = jsonify({"resultado": "erro", "detalhes": str(e)})

@app.route('/listar/<string:classe>/<int:id>', methods=['GET'])
@jwt_required()
def listar(classe, id):
    try:

        email = request.args.get('email')
        resposta = {'Resultado': 'ok'}

        objetos = None
        if classe == 'Avaliacao' and id == 0:
            objetos = getAvs(email) # pega as avs (obj)
        if classe == 'Avaliacao' and id != 0:
            obj = getAvaliacaobyID(id) # pega uma avaliação específica pelo id
            objetos = [obj]
        if classe == 'Turma' and id == 0:
            objetos = getTurmas(email) # pega as turmas (obj)
        if classe == 'Turma' and id != 0:
            obj = getTurmabyID(id) # pega uma turma específica pelo id
            objetos = [obj]
        if objetos is not None:
            lista_jsons = [ x.json() for x in objetos ] # transforma cada obj em json
            resposta.update({'Detalhes': lista_jsons})
        else:
            resposta.update({'Detalhes': 0})
        resposta = jsonify(resposta)

    except Exception as e:
        resposta = jsonify({'Resultado': 'Erro', 'Detalhes': str(e)})

    # adicionar cabeçalho de liberação de origem
    resposta.headers.add("Access-Control-Allow-Origin", "*")
    return resposta

if __name__ == '__main__':
    
    app.run(host='0.0.0.0', port=5000, debug=True)
    #app.run()