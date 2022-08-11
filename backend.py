from config import *
from modelos.avaliacao import *
from modelos.professor import *
from modelos.turma import *

# USUARIO / PROFESSOR ======================================

@app.route('/cadastroUsuario', methods=['POST'])
@jwt_required()
def cadastroUsuario():

    dados = request.get_json(force=True)

    try:
        if cadastrarProf(**dados):
            resposta = jsonify({'Resultado': 'ok', 'Detalhes': 'ok'})
        else:
            resposta = jsonify({'Resultado': 'Erro', 'Detalhes': 'Usuário já cadastrado!'})
    except Exception as e:
        resposta = jsonify({'Resultado': 'Erro', 'Detalhes': str(e)})

    resposta.headers.add('Access-Control-Allow-Origin', '*')
    return resposta

@app.route('/excluirUsuario/<email>', methods=['DELETE'])
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

# UPDATES ---------------------------------------------

@app.route('/atualizar_nome', methods=['POST'])
@jwt_required()
def atualizar_nome():
    try:
        dados = request.get_json(force=True)
        nome = dados['novo_nome']

        if updateNome(nome, dados['email']):
            resposta = jsonify({'Resultado': 'ok', 'nome': nome})
        else:
            resposta = jsonify({'Resultado': 'Erro', 'Detalhes': 'Erro ao atualizar!'})
        
    except Exception as e:
        resposta = jsonify({'Resultado': 'Erro', 'Detalhes': str(e)}) 

    resposta.headers.add('Access-Control-Allow-Origin', '*')
    return resposta

@app.route('/atualizar_email', methods=['POST'])
@jwt_required()
def atualizar_email():
    try:
        dados = request.get_json(force=True) 
        email_novo = dados['novo_email']
        if updateEmail(dados['email'], email_novo):
            resposta = jsonify({'Resultado': 'ok','email':email_novo})
        else:
            resposta = jsonify({'Resultado': 'Erro', 'Detalhes': 'Erro ao atualizar!'})
    
    except Exception as e:
        resposta = jsonify({'Resultado': 'Erro', 'Detalhes': str(e)})

    resposta.headers.add('Access-Control-Allow-Origin', '*')
    return resposta

@app.route('/atualizar_senha', methods=['POST'])
@jwt_required()
def atualizar_senha():
    try:
        dados = request.get_json(force=True) 
        if updateSenha(dados['nova_senha'], dados['email']):
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

        # transformar em lista
        t = dados['turmas']
        t = t.split(', ')

        # pegando os objetos
        turmas = []
        for i in t:
            turmas.append(getTurma(i)) 

        if cadastrarAvaliacao(desc= dados['descricao'], dataInicio= dados['dataInicio'], 
        dataFim= dados['dataFim'], turmas= turmas, prof_id = prof_id):
            resposta = jsonify({'Resultado': 'ok', 'Detalhes': 'ok'})
        else:
            resposta = jsonify({'Resultado': 'Erro', 'Detalhes': 'backend'})

    except Exception as e:
        resposta = jsonify({'Resultado': 'Erro', 'Detalhes': str(e)})
    
    resposta.headers.add('Access-Control-Allow-Origin', '*')
    return resposta

@app.route('/deleteAv/<email>/<int:av_id>', methods=['DELETE'])
@jwt_required()
def deleteAv(email, id):
    try:
        if deleteAv(email, id):
            resposta = jsonify({'Resultado': 'ok', 'Detalhes': 'ok'})
        else:
            resposta = jsonify({'Resultado': 'Erro', 'Detalhes': 'Avaliação não cadastrada!'})
    except Exception as e:
        resposta = jsonify({'Resultado': 'Erro', 'Detalhes': str(e)})

    resposta.headers.add('Access-Control-Allow-Origin', '*')
    return resposta

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

@app.route('/deleteTurma/<string:email>/<int:turma_id>', methods=['DELETE'])
@jwt_required()
def deleteTurma(email, id):
    try:
        if delete_turma(email, id):
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

@app.route('/render_cadastroAv')
def render_cadastroAv():
    return render_template('cadastroAv.html')

@app.route('/render_cadastroTurma')
def render_cadastroTurma():
    return render_template('cadastroTurma.html')

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

@app.route('/render_deleteAv')
def render_deleteAv():
    return render_template('excluirAv.html')

@app.route('/render_updateTurma')
def render_updateTurma():
    return render_template('updateTurma.html')

# CARREGAR INFOS ===========================================

@app.route('/listar/<string:classe>', methods=['GET'])
@jwt_required()
def listar(classe):
    try:

        email = request.args.get('email')
        resposta = {'Resultado': 'ok'}

        objetos = None
        if classe == 'Avaliacao':
            objetos = getAvs(email) # pega as avs (obj)
        if classe == 'Turma':
            objetos = getTurmas(email) # pega as turmas (obj)

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
    
    app.run(debug=True)