$(function() {
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
        
    }

    function render_index(){
        window.location.assign('/');
    }
})