$(function() {

    //Cadastro professor
    $(document).on('click', '#btCadastrarPROF', function(){
        nome = $('#nome-cadastro').val();
        email = $('#email-cadastro').val();
        senha = $('#senha-cadastro').val();

        var dados = JSON.stringify({nome: nome, email: email, senha: senha});

        $.ajax({
            url: 'http://localhost:5000/cadastroUsuario',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
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

    });

    $(document).on('click', '#excluirConta', function() {

        var email = sessionStorage.getItem('email')

        $.ajax({
            url: 'http://localhost:5000/excluirUsuario/' + email,
            type: 'DELETE', 
            dataType: 'json', 
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
    });

    $(document).on('click','#atualizar_nome',function(){
        email = sessionStorage.getItem('email');
        nome = $('#nome_update').val();

        var dados = JSON.stringify({ email: email, novo_nome: nome  });

        $.ajax({
            url: 'http://localhost:5000/atualizar_nome',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
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

    });

    $(document).on("click",'#atualizar_email', function(){
        email = sessionStorage.getItem('email');
        novo_email = $('#email-update').val();

        var dados = JSON.stringify({ email: email, novo_email: novo_email  });

        $.ajax({
            url: 'http://localhost:5000/atualizar_email',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
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

    });

    $(document).on("click",'#atualizar_senha', function(){
        email = sessionStorage.getItem('email');
        senha = $('#senha-update').val();

        var dados = JSON.stringify({ email: email, nova_senha: senha });

        $.ajax({
            url: 'http://localhost:5000/atualizar_senha',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
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
    });
});