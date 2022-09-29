$(function() {
    // código para mapear click do botão logout
    $(document).on('click', '#logout', function(){
        logado = VerificarLogin();
        if (logado){
            // remove itens da sessão
            sessionStorage.clear();
            // atualiza a tela
            window.location.assign('/')
        } else {
            alert('Você não está logado!');
            window.location.assign('/')
            
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

    $(document).on('click', '#excluir_conta', function(){
        Swal.fire({
            icon: 'warning',
            showConfirmButton: true,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Excluir',
            title: 'Você tem certeza?',
            text: 'Depois de apagada sua conta não poderá ser recuperada.'
        }).then((result) => {
            if (result.isConfirmed) {
                excluirConta();
            }
        })
    })

    function excluirConta() {

        if (VerificarLogin()) {
            let meuip = sessionStorage.getItem('meuip');
            var jwt = sessionStorage.getItem('jwt');

            // chamada ao backend
            $.ajax({
                url: `http://${meuip}:5000/excluirUsuario/${email}`,
                type: 'DELETE', 
                dataType: 'json',
                contentType: 'text/plain',
                headers: {Authorization: 'Bearer ' + jwt},
                success: pessoaExcluida, 
                error: erroAoExcluir
            });

            function pessoaExcluida (retorno) {
                if (retorno.Resultado == 'ok') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Conta excluída!',
                        showConfirmButton: true
                    }).then((result) => {
                        if (result.isConfirmed){
                            sessionStorage.clear();
                            render_index();
                        }
                    })
                } else {
                    Swal.fire({
                        title: "Erro ao listar dados!",
                        text: "Caso o erro persista entre em contato com o administrador através do email: efftingsofia@gmail.com.",
                        icon: "error",
                        showConfirmButton: true,
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    });
                }            
            }

            function erroAoExcluir (retorno) {
                Swal.fire({
                    title: "Erro ao contatar backend!",
                    text: "Caso o erro persista entre em contato com o administrador através do email: efftingsofia@gmail.com.",
                    icon: "error",
                    showConfirmButton: true,
                    allowOutsideClick: false,
                    allowEscapeKey: false
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

    function render_index(){
        window.location.assign('/');
    }
})