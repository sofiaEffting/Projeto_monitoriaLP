$(function() {

    //Cadastro professor
    $(document).on('click', '#btCadastrarPROF', function(){
        var nome = $('#nome-cadastro').val();
        var email = $('#email-cadastro').val();
        var senha = $('#senha-cadastro').val();
        var meuip = sessionStorage.getItem('meuip'); 

        var dados = JSON.stringify({nome: nome, email: email, senha: senha});

        if (email != null) {
            var jwt = sessionStorage.getItem('jwt');
            
            // chamada ao backend
            $.ajax({
                url: `http://${meuip}:5000/cadastroUsuario`,
                type: 'POST',
                dataType: 'json', // os dados são recebidos no formato json
                contentType: 'text/plain',
                headers: {Authorization: 'Bearer ' + jwt},
                data: dados,
                success: usuarioCadastrado,
                error: anyError
            });

            function usuarioCadastrado (retorno) {

                if (retorno.Resultado == 'ok') {
                    alert('Usuário cadastrado com sucesso!');
                    window.location.assign('/');

                } else {
                    alert(retorno.Resultado + ': ' + retorno.Detalhes);                
                }
            }

            function anyError (retorno) {
                alert('Erro ao contatar back-end: ' + retorno.Resultado + ': ' + retorno.Detalhes);
            }

        } else {
            alert('Erro ao listar dados: ' + retorno.Detalhes);
        }

    });

    $(document).on('click', '#excluirConta', function() {

        var email = sessionStorage.getItem('email');
        var meuip = sessionStorage.getItem('meuip'); 

        if (email != null) {
            var jwt = sessionStorage.getItem('jwt');

            // chamada ao backend
            $.ajax({
                url: `http://${meuip}:5000/excluirUsuario/${email}`,
                type: 'DELETE', 
                dataType: 'json',
                contentType: 'text/plain',
                headers: {Authorization: 'Bearer ' + jwt},
                success: pessoaExcluida, 
                error: erroAoExcluir
            });

            function pessoaExcluida (retorno) {
                if (retorno.Resultado == 'ok') {
                    alert('Usuário removido');
                    $('#mensagem').text('Usuário removido');
                    sessionStorage.clear()
                    window.location.assign('/');

                } else {
                    alert(retorno.Resultado + ': ' + retorno.Detalhes);
                }            
            }

            function erroAoExcluir (retorno) {
                alert('Erro ao excluir conta: ' + retorno.Detalhes);
            }

        } else {
            alert('Erro ao listar dados: ' + retorno.Detalhes);
        }
    });

    $(document).on('click','#atualizar_nome',function(){

        var email = sessionStorage.getItem('email');
        var nome = $('#nome_update').val();
        var meuip = sessionStorage.getItem('meuip'); 

        if (email != null) {
            var jwt = sessionStorage.getItem('jwt');

            var dados = JSON.stringify({ email: email, novo_nome: nome  });

            $.ajax({
                url: `http://${meuip}:5000/atualizar_nome`,
                type: 'POST',
                dataType: 'json',
                contentType: 'text/plain',
                headers: {Authorization: 'Bearer ' + jwt},
                data: dados, 
                success: atualizarConcluido,
                error: erroAtualizar
            });

            function atualizarConcluido(retorno){
                if (retorno.Resultado == 'ok'){
                    sessionStorage.removeItem('nome');
                    sessionStorage.setItem('nome', retorno.nome);
                    window.alert('Alteração feita com sucesso');
                } else{
                    window.alert('Ocorreu um erro durante a atualização.');
            }};

            function erroAtualizar (retorno) {
                alert('Erro ao atualizar conta: ' + retorno.Detalhes);
            };

        } else {
            alert('Erro ao listar dados: ' + retorno.Detalhes);
        }

    });

    $(document).on("click",'#atualizar_email', function(){

        var email = sessionStorage.getItem('email');
        var novo_email = $('#email-update').val();
        var meuip = sessionStorage.getItem('meuip'); 

        if (email != null) {
            var jwt = sessionStorage.getItem('jwt');

            var dados = JSON.stringify({ email: email, novo_email: novo_email  });

            $.ajax({
                url: `http://${meuip}:5000/atualizar_email`,
                type: 'POST',
                dataType: 'json',
                contentType: 'text/plain',
                headers: {Authorization: 'Bearer ' + jwt},
                data: dados, 
                success: atualizarConcluido,
                error: erroAtualizar
            });

            function atualizarConcluido (retorno){
                if (retorno.Resultado == 'ok'){
                    sessionStorage.removeItem('email');
                    sessionStorage.setItem('email', retorno.email);
                    window.alert('Alteração feita com sucesso');
                } else {
                    window.alert('Ocorreu um erro durante a atualização.');
            }};

            function erroAtualizar (retorno) {
                alert('Erro ao atualizar conta: ' + retorno.Detalhes);
            };

        } else {
            alert('Erro ao listar dados: ' + retorno.Detalhes);
        }

    });

    $(document).on("click",'#atualizar_senha', function(){
        var email = sessionStorage.getItem('email');
        var senha = $('#senha-update').val();
        var meuip = sessionStorage.getItem('meuip'); 

        if (email != null) {
            var jwt = sessionStorage.getItem('jwt');

            var dados = JSON.stringify({ email: email, nova_senha: senha });

            $.ajax({
                url: `http://${meuip}:5000/atualizar_senha`,
                type: 'POST',
                dataType: 'json',
                contentType: 'text/plain',
                headers: {Authorization: 'Bearer ' + jwt},
                data: dados, 
                success: atualizarConcluido,
                error: erroAtualizar
            });

            function atualizarConcluido (retorno){
                if (retorno.Resultado == 'ok'){
                    sessionStorage.removeItem('senha');
                    sessionStorage.setItem('senha', retorno.senha);
                    window.alert('Alteração feita com sucesso');
                } else {
                    window.alert('Ocorreu um erro durante a atualização.');
            }};

            function erroAtualizar (retorno) {
                alert('Erro ao atualizar conta: ' + retorno.Detalhes);
            };

        } else {
            alert('Erro ao listar dados: ' + retorno.Detalhes);
        }
    });
});