$(function(){
    
    // Cadastro avaliação
    $(document).on('click', '#btCadastrarAV', function(){
        email = sessionStorage.getItem('email');

        if (email != null){
            desc = $('#campoDescricao').val();
            dataInicio = $('#campoDataInicio').val();
            dataFim = $('#campoDataFim').val();
            turmas = $('#campoTurmas').val()

            meuip = sessionStorage.getItem("meuip");
            /*arquivoInput = document.querySelector('#campoArquivo');
            var arquivo = document.getElementById('arquivo').files[0];
            var arquivos = arquivoInput.files;*/
        

            jwt = sessionStorage.getItem('jwt');

            var dados = JSON.stringify({descricao: desc, dataInicio: dataInicio, dataFim: dataFim, email: email, turmas: turmas});
            
            // chamada ao backend
            $.ajax({
                url: `http://${meuip}:5000/cadastroAvaliacao`,
                type: 'POST',
                dataType: 'json', // os dados são recebidos no formato json
                contentType: 'text/plain',
                headers: {Authorization: 'Bearer ' + jwt},
                data: dados,
                success: avCadastrada, // chama a função listar para processar o resultado
                error: anyError
            });
    
            function avCadastrada (retorno) {
    
                if (retorno.Resultado == 'ok') {
                    alert('Avaliação cadastrada com sucesso!');
                    $('#mensagem').text('Avaliação cadastrada com sucesso!');
    
                    $('#campoDescricao').val('');
                    $('#campoDataInicio').val('');
                    $('#campoDataFim').val('');
    
                } else {
                    alert('Erro no cadastro: ' + retorno.Resultado + ': ' + retorno.Detalhes);                
                }
            }
    
            function anyError (retorno) {
                alert('Erro ao contatar back-end: ' + retorno.Detalhes);
            }
        } else {
            alert('Você ainda não está logado, por favor, conecte-se!');
            window.location.assign('/');
        }

    });
});