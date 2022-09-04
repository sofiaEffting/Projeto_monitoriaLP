$(function() {

    var email = sessionStorage.getItem('email');

    if (email != null){
        var meuip = sessionStorage.getItem('meuip'); 
        var jwt = sessionStorage.getItem('jwt');
        var id_turma = sessionStorage.getItem('id_turma'); 

        // chamada ao backend
        $.ajax({
            url: `http://${meuip}:5000/listar/Turma/${id_turma}?email=${email}`,
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
                turma = retorno.Detalhes[0]
                $('#nome-update').val(turma.nome);
                $('#alunos-update').val(turma.alunos);
            
            } else {
                alert("ERRO: " + retorno.detalhes);
            }
        }
    } else {
        alert('Você ainda não está logado, por favor, conecte-se!');
        window.location.assign('/');
    }
    

    $(document).on('click', '#btAtualizarTurma', function(){
        var nome = $('#nome-update').val();
        var alunos = $('#alunos-update').val();

        if (email!=null){
            var dados = JSON.stringify({nome: nome, alunos: alunos});

            $.ajax({
                url: `http://${meuip}:5000/atualizar_turma/${email}/${id_turma}`,
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
                    window.location.assign('/render_turma');
                    window.alert('Alteração feita com sucesso');
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

    

})