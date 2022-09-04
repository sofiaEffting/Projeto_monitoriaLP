// LOGIN / LOGOUT ==================
$(function(){
    
    // código para mapear click do botão logout
    $(document).on('click', '#logout', function(){
        logado = VerificarLogin();
        if (logado){
            // remove itens da sessão
            sessionStorage.clear();
            // atualiza a tela
        } else {
            alert('Você não está logado!');
            
        }
    });
    
    function VerificarLogin (){
        email = sessionStorage.getItem('email');
        logado = email != null;
        if (logado) {
            return true
        } else { 
            return false}
    }  


    $(document).on('click','#btnLogin',function(){
        // pegar dados na tela
        email = $('#email-login').val();
        senha = $('#senha-login').val();
        meuip = sessionStorage.getItem('meuip')

        // preparar dados no formato json
        var dados = JSON.stringify({ email: email, senha: senha  });

        // fazer requisição para o back-end
        $.ajax({
            url: `http://${meuip}:5000/login`,
            type: 'POST',
            dataType: 'json', // os dados são recebidos no formato json
            contentType: 'text/plain', // tipo de dados enviados
            data: dados, // dados enviados
            success: loginConcluido, // chama a função 
            error: erroAoLogar
        });

        function loginConcluido (retorno){
            if (retorno.Resultado === 'ok'){ //operação deu certo?
                // guarda as infos na sessão
                sessionStorage.setItem('email',retorno.email);
                sessionStorage.setItem('nome',retorno.nome);
                sessionStorage.setItem('jwt',retorno.token)
                window.location.assign('/render_usuario');
            } else {
                // informar msg de erro
                alert('Verifique se os dados estão corretos');
            }
        }
        
        function erroAoLogar(retorno){
            // informar msg de erro (provável do back-end)
            alert(retorno.Resultado + retorno.Detalhes);
        }
    });

});