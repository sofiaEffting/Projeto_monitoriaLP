$(function() {

    var meuip = sessionStorage.getItem('meuip'); 
    var email = sessionStorage.getItem('email');

    //Cadastro professor
    $(document).on('click', '#btCadastrarPROF', function(){
        var nome = $('#nome-cadastro').val();
        var email = $('#email-cadastro').val();
        var senha = $('#senha-cadastro').val();

        var dados = JSON.stringify({nome: nome, email: email, senha: senha});
        console.log(dados);

        if (email != null) {
            
            // chamada ao backend
            $.ajax({
                url: `http://${meuip}:5000/cadastroUsuario`,
                type: 'POST',
                dataType: 'json', // os dados são recebidos no formato json
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

        } else {
            alert('Erro ao listar dados: ' + retorno.Detalhes);
        }

    });

   

    $(document).on('click', '#btAtualizarProf', function(){
        // pegar dados na tela
        var nova_senha = $('#senha-update').val();
        var novo_nome = $('#nome-update').val();
        var novo_email = $('#email-update').val();


        if (email != null) {
            // pegar token
            var jwt = sessionStorage.getItem('jwt');
            // preparar dados em json
            var dados = JSON.stringify({ senha: nova_senha, email: novo_email, nome: novo_nome });

            $.ajax({
                url: `http://${meuip}:5000/atualizarUsuario/${email}`,
                type: 'PUT',
                dataType: 'json', // os dados são recebidos no formato json
                contentType: 'text/plain', // tipo dos dados enviados
                headers: {Authorization: 'Bearer ' + jwt},
                data: dados, // estes são os dados enviados
                success: atualizarConcluido,
                error: erroAtualizar
            });

            function atualizarConcluido (retorno){
                if (retorno.Resultado == 'ok'){
                    sessionStorage.removeItem('nome');
                    sessionStorage.removeItem('email');
                    sessionStorage.setItem('nome', novo_nome);
                    sessionStorage.setItem('email', novo_email)
                    window.location.assign('/render_usuario')
                    window.alert('Alteração feita com sucesso');
                } else {
                    window.alert('Ocorreu um erro durante a atualização.');
            }};

            function erroAtualizar (retorno) {
                alert('Erro ao atualizar conta: ' + retorno.Detalhes);
            };

        } else {
            alert('Você ainda não está logado, por favor, conecte-se!');
            window.location.assign('/');
        }

    })

    // carregar infos pro form de update
    var email = sessionStorage.getItem('email');
    var senha = sessionStorage.getItem('senha');
    var nome = sessionStorage.getItem('nome');
    $('#nome-update').val(nome);
    $('#email-update').val(email);
    $('#senha_update').val(senha);
    

});