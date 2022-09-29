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
                    Swal.fire({
                        title: "Avaliação cadastrada com sucesso!",
                        icon: "success",
                        showConfirmButton: true
                    });
                    $('#campoDescricao').val('');
                    $('#campoDataInicio').val('');
                    $('#campoDataFim').val('');
                } else {
                    Swal.fire({
                        title: "Erro ao cadastrar avaliação!", 
                        icon: "error", 
                        showConfirmButton: true
                    });              
                }}
            function anyError () {
                Swal.fire({
                    title: "Erro ao contatar back-end!",
                    text: "Por favor, entre em contato com o administrador.",
                    icon: "error",
                });
            }
        } else {
            Swal.fire({ title: "Você ainda não está logado!", 
                icon: "error"
            });
            window.location.assign('/');
        }
    });

    $(document).on('click', '#excluir_av', function() {
        Swal.fire({
            title: "Você tem certeza?",
            text: "Uma vez deletada, ela não poderá ser recuperada!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
        .then((willDelete) => {
            if (willDelete) {
                excluir_av()
            }
        });

        function excluir_av() {
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
                        window.location.assign('/render_usuario');
                        Swal.fire({
                            title: "Avaliação excluida com sucesso!",
                            icon: "success",
                        });
                        
                    } else {
                        Swal.fire({
                            title: "Erro ao excluir avaliação!",
                            text: "Por favor, entre em contato com o administrador.",
                            icon: "error",
                            showConfirmButton: true
                        });
                    }            
                }
                function erroAoExcluir () {
                    Swal.fire({
                        title: "Erro ao excluir avaliação!",
                        icon: "error",
                        showConfirmButton: true
                    });
                }
            } else {
                Swal.fire({
                    title: "Você ainda não está logado!",
                    icon: 'error'
                });
                setTimeout(render_index(), 1000)
            }
        }  
    })

    $(document).on('click', '#editar_av', function() {
        var email = sessionStorage.getItem('email');
        if (email != null) {
            window.location.assign('/render_updateAv')
        } else {
            Swal.fire({
                title: "Você ainda não está logado!",
                icon: 'error'
            });
            setTimeout(render_index(), 1000)
            
        }
    })

    var email = sessionStorage.getItem('email');
    var meuip = sessionStorage.getItem('meuip');

    /*if (email != null) {
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
                Swal.fire({
                    title: "Erro ao listar dados!",
                    text: "Caso o problema persista entre em contato com o administrador através do email: efftingsofia@gmail.com.",
                    icon: "error",
                    showConfirmButton: true
                });
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
                Swal.fire({
                    title: "Erro ao listar dados!",
                    text: "Caso o problema persista entre em contato com o administrador através do email: efftingsofia@gmail.com.",
                    icon: "error",
                    showConfirmButton: true
                });
            }
        }
    } else {
        Swal.fire({
            title: "Você ainda não está logado!",
            icon: 'error'
        });
        setTimeout(render_index(), 1000)
        
    }*/

    $(document).on('click', '#btAtualizarTurma', function() {
        var email = sessionStorage.getItem('email');

    })
});