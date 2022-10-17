$(function() {

    var email = sessionStorage.getItem('email');
    var nome = sessionStorage.getItem('nome');
    var meuip = sessionStorage.getItem('meuip'); 

    if (email != null) {
        var jwt = sessionStorage.getItem('jwt');
        id_turma = sessionStorage.getItem('id_turma'); 

        // chamada ao backend
        $.ajax({
            url: `http://${meuip}:5000/listar/Turma/${id_turma}?email=${email}`,
            method: 'GET',
            dataType: 'json', // os dados são recebidos no formato json
            contentType: 'text/plain',
            headers: {Authorization: 'Bearer ' + jwt},
            success: listar_turma, // chama a função listar para processar o resultado
            error: function () {
                Swal.fire({
                    title: "Erro ao listar dados!",
                    text: "Por favor, entre em contato com o administrador.",
                    icon: "error",
                    showConfirmButton: true
                });
            }
        });
        function listar_turma(retorno) {
            if (retorno.Resultado === 'ok' && retorno.Detalhes != 0) {
                // percorrer lista de turmas retornadas
                for (var i in retorno.Detalhes) {
                    var alunos = retorno.Detalhes[i].alunos // pega a lista de alunos da turma
                    $('#nome_turma').append(retorno.Detalhes[i].nome) // adiciona o nome da turma na página 
                    alunos = alunos.split(',') // separa os alunos
                    for (var i in alunos) {
                        divisao = alunos[i].split('<') // separa o nome e email de cada aluno
                        nome = divisao[0] // pega o nome
                        email = divisao[1] // pega o email
                        nome = nome.replace('>', '').trim() // tira as coisas desnecessárias
                        email = email.replace('>', '').trim()
                        lin = `<tr>
                        <td> ${nome}</td>
                        <td> ${email}
                        </tr>`;
                    $('#tabelaTurma').append(lin); // adiciona a linha no corpo da tabela
                    }  
                }
            } else if(retorno.Resultado == 'ok' && retorno.Detalhes == 0) {
                lin = `<tr> <td>
                    Turma não cadastrada!
                    </td> </tr>`;
                $('#tabelaTurma').append(lin);
            } else {
                Swal.fire({
                    title: "Erro ao listar dados!",
                    text: "Caso o erro persista entre em contato com o administrador através do email: efftingsofia@gmail.com.",
                    icon: "error",
                    showConfirmButton: true
                });
            }
        };
    } else {
        Swal.fire({
            title: "Você ainda não está logado!",
            icon: 'error'
        });
        setTimeout(render_index(), 1000);
    }
})