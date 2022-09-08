$(function() {


    // Cadastro Turma
    $(document).on('click', '#btCadastrarTurma', function(){
        
        var nome = $('#campoNomeTurma').val();
        var alunos = $('#campoAlunos').val();
        var email = sessionStorage.getItem('email');
        var meuip = sessionStorage.getItem('meuip');

        if (email != null) {
            jwt = sessionStorage.getItem('jwt');

            var dados = JSON.stringify({nome: nome, alunos: alunos, email: email});

            $.ajax({
                url: `http://${meuip}:5000/cadastroTurma`,
                type: 'POST',
                dataType: 'json',
                contentType: 'text/plain',
                headers: {Authorization: 'Bearer ' + jwt},
                data: dados,
                success: turmaCadastrada,
                error: anyError
            });

            function turmaCadastrada (retorno) {

                if (retorno.Resultado == 'ok') {
                    alert('Turma cadastrada com sucesso!');

                    $('#campoNomeTurma').val('');
                    $('#campoAlunos').val('');

                } else {
                    alert('Erro no cadastro: ' + retorno.Resultado + ': ' + retorno.Detalhes);                
                }
            }

            function anyError (retorno) {
                alert('Erro ao contatar back-end: ' + retorno.Resultado + ': ' + retorno.Detalhes);
            }

        } else {
            alert('Você ainda não está logado, por favor, conecte-se!');
            window.location.assign('/');
        }

    });

    $(document).on('click', '#excluir_turma', function() {

        var email = sessionStorage.getItem('email');
        var meuip = sessionStorage.getItem('meuip');
        var id_turma = sessionStorage.getItem('id_turma'); 

        if (email != null) {
            var jwt = sessionStorage.getItem('jwt');

        $.ajax({
            url: `http://${meuip}:5000/deleteTurma/${email}/${id_turma}`,
            type: 'DELETE', 
            dataType: 'json', 
            headers: {Authorization: 'Bearer ' + jwt},
            success: turmaExcluida, 
            error: erroAoExcluir
        });

        function turmaExcluida (retorno) {
            if (retorno.Resultado == 'ok') {
                alert('Turma removida com sucesso!');
                window.location.assign('/render_usuario');
            } else {
                alert(retorno.Resultado + ': ' + retorno.Detalhes);
            }            
        }

        function erroAoExcluir (retorno) {
            alert('Erro ao excluir turma: ' + retorno.Detalhes);
        }

    } else {
        alert('Você ainda não está logado, por favor, conecte-se!');
        window.location.assign('/');
    }
    });

    var email = sessionStorage.getItem('email');
    var nome = sessionStorage.getItem('nome');
    var meuip = sessionStorage.getItem('meuip'); 

    if (email != null) {
        var jwt = sessionStorage.getItem('jwt');
        id_turma = sessionStorage.getItem('id_turma'); 

        // chamada ao backend
        $.ajax({
            url: `http://${meuip}:5000/listar/Turma/${id_turma}?email=${email}`,
            method: 'GET',
            dataType: 'json', // os dados são recebidos no formato json
            contentType: 'text/plain',
            headers: {Authorization: 'Bearer ' + jwt},
            success: listar_turma, // chama a função listar para processar o resultado
            error: function () {
                alert("erro ao ler dados, verifique o backend");
            }
        });
        function listar_turma(retorno) {
            if (retorno.Resultado === 'ok' && retorno.Detalhes != 0) {
                // percorrer lista de turmas retornadas
                for (var i in retorno.Detalhes) {
                    var alunos = retorno.Detalhes[i].alunos // pega a lista de alunos da turma
                    $('#nome_turma').append(retorno.Detalhes[i].nome) // adiciona o nome da turma na página 
                    alunos = alunos.split(',') // separa os alunos
                    for (var i in alunos) {
                        divisao = alunos[i].split('<') // separa o nome e email de cada aluno
                        nome = divisao[0] // pega o nome
                        email = divisao[1] // pega o email
                        nome = nome.replace('>', '').trim() // tira as coisas desnecessárias
                        email = email.replace('>', '').trim()
                        lin = `<tr>
                        <td> ${nome}</td>
                        <td> ${email}
                        </tr>`;
                    $('#tabelaTurma').append(lin); // adiciona a linha no corpo da tabela
                    }  
                }
            } else if(retorno.Resultado == 'ok' && retorno.Detalhes == 0) {
                lin = `<tr> <td>
                    Turma não cadastrada!
                    </td> </tr>`;
                $('#tabelaTurma').append(lin);
            } else {
                alert('Erro ao listar dados: ' + retorno.Detalhes);
            }
        };
    } else {
        alert('Você ainda não está logado, por favor, conecte-se!');
        window.location.assign('/');
    }

    $(document).on('click', '#editar_turma', function() {
        if (email != null) {
            window.location.assign('/render_updateTurma')
        } else {
            alert('Você ainda não está logado, por favor, conecte-se!');
            window.location.assign('/');
        }
        
    })   

     
});