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
                //$('#arq-update').val(av.arquivo);
                console.log(av.turmas);
                listarOpTurmas(av.turmas);
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

    function listarOpTurmas(turmas){
        var email = sessionStorage.getItem('email');

        if (email != null){
            var meuip = sessionStorage.getItem('meuip');
            var jwt = sessionStorage.getItem('jwt');

            // chamada ao backend
            $.ajax({
                url: `http://${meuip}:5000/listar/Turma/0?email=${email}`,
                method: 'GET',
                dataType: 'json', // os dados são recebidos no formato json
                contentType: 'text/plain',
                headers: {Authorization: 'Bearer ' + jwt},
                success: listar_turmas, // chama a função listar para processar o resultado
                error: function () {
                    Swal.fire({
                        title: "Erro ao contatar backend!",
                        text: "Por favor, entre em contato com o administrador através do email efftingsofia@gmail.com.",
                        icon: "error",
                        showConfirmButton: true,
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    });
                }
            });
            //  curl localhost:5000/listar_turmas?email=efftingsofia@gmail.com
            function listar_turmas(retorno) {
                if (retorno.Resultado === 'ok' && retorno.Detalhes != 0) {
                    // percorrer lista de turmas retornadas
                    for (var i in retorno.Detalhes) {
                        nome = retorno.Detalhes[i].nome
                        console.log(nome);
                        turmas = turmas.split(',');
                        console.log(turmas);
                        for (var t in turmas) {
                            console.log(t);
                            if (turmas[t] == nome) {
                                lin = `<input class="turmas" checked type="checkbox" id="${nome}" name="${nome}" value="${retorno.Detalhes[i].id}">
                                <label for="${nome}">${nome}</label>`;
                            } else {
                                lin = `<input class="turmas" type="checkbox" id="${nome}" name="${nome}" value="${retorno.Detalhes[i].id}">
                                        <label for="${nome}">${nome}</label>`;
                            }
                        }
                        console.log(lin);
                        // adiciona a linha no select
                        $('#turmas').append(lin);
                    }
                } else if (retorno.Resultado == 'ok' && retorno.Detalhes == 0) {
                    lin = `<option>Nenhuma turma cadastrada!</option>`;
                    $('#select_turmas').append(lin);
                } else {
                    Swal.fire({
                        title: "Erro ao listar dados!",
                        text: "Por favor, entre em contato com o administrador através do email efftingsofia@gmail.com.",
                        icon: "error",
                        showConfirmButton: true,
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    });
                }
            }
        }
    }
})