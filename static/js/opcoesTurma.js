$(function () { 

    $.ajax({
        url: 'http://localhost:5000/listar_turmas',
        method: 'GET',
        dataType: 'json', // os dados são recebidos no formato json
        success: listar, // chama a função listar para processar o resultado
        error: function () {
            alert("erro ao ler dados, verifique o backend");
        }
    });

    // função executada quando tudo dá certo
    function listar(turmas) {
        // percorrer a lista de pessoas retornadas; 
        for (var i in turmas) { //i vale a posição no vetor
            lin = '<option value="' + turmas[i].nome + '">' + turmas[i].nome + '</option>';
            // adiciona a linha
            $('#add_turma').append(lin);
        }
    }

});
