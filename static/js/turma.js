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

    $(document).on('click', '#excluirTurma', function() {

        var email = sessionStorage.getItem('email')

        var meuip = sessionStorage.getItem('meuip');

        if (email != null) {
            jwt = sessionStorage.getItem('jwt');

        $.ajax({
            url: `http://${meuip}:5000/excluirTurma/${email}`,
            type: 'DELETE', 
            dataType: 'json', 
            headers: {Authorization: 'Bearer ' + jwt},
            success: turmaExcluida, 
            error: erroAoExcluir
        });

        function turmaExcluida (retorno) {
            if (retorno.Resultado == 'ok') {
                alert('Usuário removido');
                $('#mensagem').text('Turma removido');
                sessionStorage.clear()
                window.location.assign('/');

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



});