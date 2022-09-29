$(function () { // quando o documento estiver pronto/carregado

    var email = sessionStorage.getItem('email');
    var nome = sessionStorage.getItem('nome');
    var meuip = sessionStorage.getItem('meuip'); 

    if (email != null) {
        var jwt = sessionStorage.getItem('jwt');

        $('#nome').append(nome);

        // TURMAS

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
                    text: "Caso o erro persista entre em contato com o administrador através do email: efftingsofia@gmail.com.",
                    icon: "error",
                    showConfirmButton: true,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });
            }
        });
        //  curl localhost:5000/listar/Turma/0?email=efftingsofia@gmail.com
        function listar_turmas(retorno) {
            if (retorno.Resultado === 'ok' && retorno.Detalhes != 0) {
                // percorrer lista de turmas retornadas
                for (var i in retorno.Detalhes) {
                    lin = `<tr id="${retorno.Detalhes[i].id}" class='link_selecionar_turma'>
                        <td> ${retorno.Detalhes[i].nome} </td>
                        </tr>`;
                    // adiciona a linha no corpo da tabela
                    $('#tabelaTurmasUsuario').append(lin);
                }
            } else if(retorno.Resultado == 'ok' && retorno.Detalhes == 0) {
                lin = `<tr> <td>
                    Nenhuma turma cadastrada!
                    </td> </tr>`;
                $('#tabelaTurmasUsuario').append(lin);
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
        };

        // código para mapear link de seleção de turma
        $(document).on("click", ".link_selecionar_turma", function () {
            id_turma = $(this).attr('id'); // obter id do elemento clicado
            sessionStorage.setItem('id_turma', id_turma); // guardar o id na sessão
            window.location.assign('/render_turma'); // encaminhar para a página da turma
        });

        $(document).on('click', '.link_selecionar_av', function(){
            id_av = $(this).attr('id');
            sessionStorage.setItem('id_av', id_av);
            window.location.assign('/render_av')
        });

        // AVALIACOES
        // chamada ao backend
        $.ajax({
            url: `http://${meuip}:5000/listar/Avaliacao/0?email=${email}`,
            method: 'GET',
            dataType: 'json',
            contentType: 'text/plain',
            headers: {Authorization: 'Bearer ' + jwt},
            success: listar_avs, 
            error: function () {
                Swal.fire({
                    title: "Erro ao contatar backendee!",
                    text: "Caso o erro persista entre em contato com o administrador através do email: efftingsofia@gmail.com.",
                    icon: "error",
                    showConfirmButton: true,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });
            }
        });
        
        function listar_avs(retorno) {
        // percorrer a lista de retorno retornadas; 
            if (retorno.Resultado === 'ok' && retorno.Detalhes != 0){
                // percorrer a lista de avs retornada
                for (var i in retorno.Detalhes) {
                    lin = `<tr id="${retorno.Detalhes[i].id}" class='link_selecionar_av'> 
                    <td> ${retorno.Detalhes[i].descricao} </td>
                    <td> ${retorno.Detalhes[i].turmas} </td>
                    </tr>`;
                    // adiciona a linha no corpo da tabela
                    $('#corpoTabelaAvs').append(lin); 
                }
            } else if(retorno.Resultado === 'ok' && retorno.Detalhes == 0) {
                lin = `<tr><td> Nenhuma avaliação cadastrada! </td></tr>`;
                $('#corpoTabelaAvs').append(lin);
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
        };

    } else {
        Swal.fire({
            title: "Você ainda não está logado!",
            icon: 'error'
        });
        setTimeout(render_index(), 1000)
        
    }

    function render_index(){
        window.location.assign('/');
    }

    $(document).on('click', '#cadastrarTurma', function(){
        window.location.assign('/render_cadastroTurma');
    })

    $(document).on('click', '#cadastrarAv', function() {
        window.location.assign('/render_cadastroAv');
    })

    
    
});