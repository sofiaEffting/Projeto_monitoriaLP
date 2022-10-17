$(function() {

    // Cadastro Turma
    $(document).on('click', '#btCadastrarTurma', function(){
        
        var nome = $('#campoNomeTurma').val();
        var alunos = $('#campoAlunos').val();
        var email = sessionStorage.getItem('email');
        var meuip = sessionStorage.getItem('meuip');

        if (email != null) {
            jwt = sessionStorage.getItem('jwt');

            var dados = JSON.stringify({nome: nome, alunos: alunos, email: email});

            $.ajax({
                url: `http://${meuip}:5000/cadastroTurma`,
                type: 'POST',
                dataType: 'json',
                contentType: 'text/plain',
                headers: {Authorization: 'Bearer ' + jwt},
                data: dados,
                success: turmaCadastrada,
                error: anyError
            });

            function turmaCadastrada (retorno) {
                if (retorno.Resultado == 'ok') {
                    Swal.fire({
                        title: "Turma cadastrada com sucesso!",
                        icon: "success",
                        showConfirmButton: true
                    });

                    $('#campoNomeTurma').val('');
                    $('#campoAlunos').val('');

                } else {
                    Swal.fire({
                        title: "Erro ao cadastrar turma!",
                        text: "Caso o erro persista entre em contato com o administrador através do email: efftingsofia@gmail.com.",
                        icon: "error",
                        showConfirmButton: true
                    });               
                }}
            function anyError () {
                Swal.fire({
                    title: "Erro ao contatar back-end!",
                    text: "Caso o erro persista entre em contato com o administrador através do email: efftingsofia@gmail.com.",
                    icon: "error",
                    showConfirmButton: true
                });
            }

        } else {
            Swal.fire({
                title: "Você ainda não está logado!",
                icon: 'error'
            });
            setTimeout(render_index(), 1000);
            
        }

    });

    function excluir_turma() {
        var email = sessionStorage.getItem('email');
        var meuip = sessionStorage.getItem('meuip');
        var id_turma = sessionStorage.getItem('id_turma'); 

        if (email != null) {
            var jwt = sessionStorage.getItem('jwt');

            $.ajax({
                url: `http://${meuip}:5000/deleteTurma/${email}/${id_turma}`,
                type: 'DELETE', 
                dataType: 'json', 
                headers: {Authorization: 'Bearer ' + jwt},
                success: turmaExcluida, 
                error: erroAoExcluir
            });
            
            function turmaExcluida (retorno) {
                if (retorno.Resultado == 'ok') {
                    window.location.assign('/render_usuario')
                    Swal.fire({
                        title: "Turma excluída com sucesso!",
                        icon: "success",
                        showConfirmButton: true
                    });
                    
                }        
            }
            function erroAoExcluir () {
                Swal.fire({
                    title: "Erro ao excluir turma!",
                    text: "Caso o erro persista entre em contato com o administrador através do email: efftingsofia@gmail.com.",
                    icon: "error",
                    showConfirmButton: true
                });
            }    
        } else {
            window.location.assign('/');
            Swal.fire("Você ainda não está logado!", {
                icon: "error"
            });
            
        }

    };

    var email = sessionStorage.getItem('email');
    var nome = sessionStorage.getItem('nome');
    var meuip = sessionStorage.getItem('meuip'); 
    
    $(document).on('click', '#editar_turma', function() {
        if (email != null) {
            window.location.assign('/render_updateTurma');
        } else {
            Swal.fire({
                title: "Você ainda não está logado!",
                icon: 'error'
            });
            setTimeout(render_index(), 1000)
            
        }
        
    })   

    $(document).on('click', '#excluir_turma', function() {
        Swal.fire({
            title: "Você tem certeza?",
            text: "Uma vez deletada, ela não poderá ser recuperada!",
            icon: "warning",
            showConfirmButton: true,
            showCancelButton: true,
            cancelButtonText: 'Cancelar'
          })
        .then((willDelete) => {
            if (willDelete) {
                excluir_turma()
            }
        });
    });

    function render_index(){
        window.location.assign('/');
    }

});