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

    $(document).on('click', '#excluir_av', function() {

        var email = sessionStorage.getItem('email');
        var meuip = sessionStorage.getItem('meuip');
        var id_av = sessionStorage.getItem('id_av');

        if (email != null) {
            var jwt = sessionStorage.getItem('jwt');

            $.ajax({
                url: `http://${meuip}:5000/deleteAv/${email}/${id_av}`,
                type: 'DELETE', 
                dataType: 'json', 
                headers: {Authorization: 'Bearer ' + jwt},
                success: avExcluida, 
                error: erroAoExcluir
            });

            function avExcluida (retorno) {
                if (retorno.Resultado == 'ok') {
                    alert('Avaliação removida com sucesso!');
                    window.location.assign('/render_usuario');
                } else {
                    alert(retorno.Resultado + ': ' + retorno.Detalhes);
                }            
            }

            function erroAoExcluir (retorno) {
                alert('Erro ao excluir avaliação: ' + retorno.Detalhes);
            }
    
        } else {
            alert('Você ainda não está logado, por favor, conecte-se!');
            window.location.assign('/');
        }
        
    })

    $(document).on('click', '#editar_av', function() {
        var email = sessionStorage.getItem('email');
        if (email != null) {
            window.location.assign('/render_updateAv')
        } else {
            alert('Você ainda não está logado, por favor, conecte-se!');
            window.location.assign('/');
        }
    })

    var email = sessionStorage.getItem('email');
    var meuip = sessionStorage.getItem('meuip');

    if (email != null) {
        var jwt = sessionStorage.getItem('jwt');
        id_av = sessionStorage.getItem('id_av'); 

        $.ajax({
            url: `http://${meuip}:5000/listar/Avaliacao/${id_av}?email=${email}`,
            method: 'GET',
            dataType: 'json', // os dados são recebidos no formato json
            contentType: 'text/plain',
            headers: {Authorization: 'Bearer ' + jwt},
            success: listar_av, // chama a função listar para processar o resultado
            error: function () {
                alert("erro ao ler dados, verifique o backend");
            }
        });
        function listar_av(retorno){
            if (retorno.Resultado == 'ok' && retorno.Detalhes != 0) {
                av = retorno.Detalhes[0]
                lin = `<tr> 
                    <td> ${av.dataInicio} </td>
                    <td> ${av.dataFim} </td>
                    <td> ${av.turmas} </td>
                    </tr>`;
                    $('#desc_av').append(av.descricao);
                    $('#tabelaAv').append(lin); // adiciona a linha no corpo da tabela
            } else if(retorno.Resultado == 'ok' && retorno.Detalhes == 0) {
                lin = `<tr> <td>
                    Avaliação não cadastrada!
                    </td> </tr>`;
                $('#tabelaAv').append(lin);
            } else {
                alert('Erro ao listar dados: ' + retorno.Detalhes);
            }
        }
    } else {
        alert('Você ainda não está logado, por favor, conecte-se!');
        window.location.assign('/');
    }

    $(document).on('click', '#btAtualizarTurma', function() {
        var email = sessionStorage.getItem('email');

    })
});