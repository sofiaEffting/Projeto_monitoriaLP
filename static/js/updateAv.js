$(function(){
    
    var email = sessionStorage.getItem('email');
    var meuip = sessionStorage.getItem('meuip');
    id_av = sessionStorage.getItem('id_av'); 

    if (email != null) {
        var jwt = sessionStorage.getItem('jwt');

        $.ajax({
            url: `http://${meuip}:5000/listar/Avaliacao/${id_av}?email=${email}`,
            method: 'GET',
            dataType: 'json', // os dados são recebidos no formato json
            contentType: 'text/plain',
            headers: {Authorization: 'Bearer ' + jwt},
            success: exibir_form, // chama a função listar para processar o resultado
            error: function () {
                alert("erro ao ler dados, verifique o backend");
            }
        });
        function exibir_form(retorno){
            if (retorno.Resultado == 'ok' && retorno.Detalhes != 0) {
                av = retorno.Detalhes[0]
                $('#desc-update').val(av.descricao);
                $('#dtInicio-update').val(av.dataInicio);
                $('#dtFim-update').val(av.dataFim);
                $('#turmas-update').val(av.turmas);
                //$('#arq-update').val(turma.dataInicio);
            } else {
                alert("Erro ao exibir: " + retorno.detalhes);
            }
        }
    } else {
        alert('Você ainda não está logado, por favor, conecte-se!');
        window.location.assign('/');
    }

    $(document).on('click', '#btAtualizarAv', function() {
        var desc = $('#desc-update').val();
        var dtInicio = $('#dtInicio-update').val();
        var dtFim = $('#dtFim-update').val();
        var turmas = $('#turmas-update').val();

        if (email!=null) {
            var dados = JSON.stringify({descricao: desc, dataInicio: dtInicio, dataFim: dtFim, turma: turmas });

            $.ajax({
                url: `http://${meuip}:5000/atualizar_av/${email}/${id_av}`,
                type: 'PUT',
                dataType: 'json', // os dados são recebidos no formato json
                contentType: 'text/plain', // tipo dos dados enviados
                headers: {Authorization: 'Bearer ' + jwt},
                data: dados, // estes são os dados enviados
                success: atualizarConcluido,
                error: function(retorno){
                    alert('Erro ao atualizar:'+ retorno.Detalhes)
                }
            });

            function atualizarConcluido (retorno){
                if (retorno.Resultado == 'ok'){
                    window.location.assign('/render_av');
                    window.alert('Alteração feita com sucesso');
                } else {
                    alert('Erro ao atualizar: ' + retorno.Detalhes)
                }
            }

        } else {
            alert('Você ainda não está logado, por favor, conecte-se!');
            window.location.assign('/');
        }
    })

    // mapeamento do botão cancelar
    $(document).on('click', '#btcancelar', function(){
        window.location.assign('/render_usuario')
    })
})