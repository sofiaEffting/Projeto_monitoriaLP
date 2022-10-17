$(function(){
    
    // Cadastro avaliação
    $(document).on('click', '#btCadastrarAV', function(){
        email = sessionStorage.getItem('email');

        if (email != null){
            var desc = $('#campoDescricao').val();
            var dataInicio = $('#campoDataInicio').val();
            var dataFim = $('#campoDataFim').val();
            var turmas = $('.turmas:checked').val();
            var arqs = new FormData($('#form_av')[0]);
            console.log(arqs.values());

            meuip = sessionStorage.getItem("meuip");
            jwt = sessionStorage.getItem('jwt');
            var dados = JSON.stringify({descricao: desc, dataInicio: dataInicio, dataFim: dataFim, email: email, turmas: turmas});

            $.ajax({
                url: `http://${meuip}:5000/salvar_arqs/${desc}/${turmas}`,
                method: 'POST',
                data: arqs, // dados serão enviados em formato normal, para upload da foto
                contentType: false,
                cache: false,
                processData: false,
                success: avCadastrada,
                error: anyError
            });
            
            function avCadastrada (retorno) {
                if (retorno.resultado == 'ok') {
                    // chamada ao backend
                    $.ajax({
                        url: `http://${meuip}:5000/cadastroAvaliacao`,
                        type: 'POST',
                        dataType: 'json', // os dados são recebidos no formato json
                        contentType: 'text/plain',
                        headers: {Authorization: 'Bearer ' + jwt},
                        data: dados,
                        success: function () {
                            Swal.fire({
                                title: "Avaliação cadastrada com sucesso!",
                                icon: "success",
                                showConfirmButton: true
                            });
                            $('#campoDescricao').val('');
                            $('#campoDataInicio').val('');
                            $('#campoDataFim').val('');
                        },
                        error: function () {
                            Swal.fire({
                                title: "Erro ao cadastrar avaliação!1", 
                                icon: "error", 
                                showConfirmButton: true
                            });   
                        }
                    });
                } else {
                    Swal.fire({
                        title: "Erro ao cadastrar avaliação!2", 
                        text: `${retorno.detalhes}`,
                        icon: "error", 
                        showConfirmButton: true
                    });              
                }}

            function anyError () {
                Swal.fire({
                    title: "Erro ao contatar back-end!3",
                    text: "Por favor, entre em contato com o administrador.",
                    icon: "error",
                });
            }

        } else {
            Swal.fire({ title: "Você ainda não está logado!", 
                icon: "error"
            });
            setTimeout(render_index()), 1000;
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

    function render_index(){
        window.location.assign('/');
    }
});