// LOGIN / LOGOUT ==================
$(function(){
    
    Swal.fire({
    title: "Login",
    text: "Digite seu email:", 
    footer: '<a href="/render_cadastroProf">Ainda não possui cadastro?</a>',
    input: 'email',
    inputPlaceholder: 'Email:',
    inputValidator: (value) => {
        if (!value) {
            return 'Email inválido!'
        }
    },
    allowOutsideClick: false,
    allowEscapeKey: false,
    confirmButtonText: 'Próximo'
    }).then((email) => {
            var email = email
            Swal.fire({
                title: "Login",
                text: "Digite sua senha:", 
                input: 'password',
                inputPlaceholder: 'Senha:',
                inputValidator: (value) => {
                    if (!value) {
                        return 'Senha inválida!'
                    }
                },
                confirmButtonText: 'Entrar',
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then((senha) => {
                    // preparar dados no formato json
                    var dados = JSON.stringify({email: email.value, senha: senha.value});
                    login (dados);
                })   
        });


    function login(dados){
        // pegar dados na tela
        
        meuip = sessionStorage.getItem('meuip')

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
                Swal.fire({
                    title:'Verifique se os dados estão corretos',
                    icon: 'error',
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });
                setTimeout(render_index, 1000)
                
            }
        }

        function render_index(){
            window.location.assign('/')
        }
        
        function erroAoLogar(){
            // informar msg de erro (provável do back-end)
            Swal.fire({
                title: "Erro ao contatar backend!",
                icon: 'error',
                text: "Se o problema persistir entre em contato com o administrador através do email: efftingsofia@gmail.com.",
                showConfirmButton: true,
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then((result) => {
                if (result.isConfirmed) {
                    render_index()
                }
            })
            
        }

    };

});