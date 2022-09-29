$(function(){

    let email = sessionStorage.getItem('email');

    if (email != null){
        let meuip = sessionStorage.getItem('meuip');
        let jwt = sessionStorage.getItem('jwt');

        // chamada ao backend
        $.ajax({
            url: `http://${meuip}:5000/listar/Turma/0?email=${email}`,
            method: 'GET',
            dataType: 'json', // os dados são recebidos no formato json
            contentType: 'text/plain',
            headers: { Authorization: 'Bearer ' + jwt },
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
                    lin = `<option id="${retorno.Detalhes[i].id}">${retorno.Detalhes[i].nome}</option>`;
                    // adiciona a linha no select
                    $('#select_turmas').append(lin);
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
})