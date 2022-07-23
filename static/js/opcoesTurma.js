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


function carregarCombo(combo_id, nome_classe) {
    $.ajax({
        url: 'http://localhost:5000/listar/'+nome_classe,
        method: 'GET',
        dataType: 'json', // os dados são recebidos no formato json
        success: carregar, // chama a função listar para processar o resultado
        error: function(problema) {
            alert("erro ao ler dados, verifique o backend: ");
        }
    });
    function carregar (dados) {
        // esvaziar o combo
        $('#'+combo_id).empty();
        // mostra ícone carregando...
        $('#loading_'+combo_id).removeClass('d-none');
        // percorrer a lista de dados
        for (var i in dados) { //i vale a posição no vetor
            $('#'+combo_id).append(
                $('<option></option>').attr("value", 
                    dados[i].id).text(dados[i].nome));
        }
        // espera um pouco, para ver o ícone "carregando"
        setTimeout(() => { 
            $('#loading_'+combo_id).addClass('d-none');
         }, 1000);
    }
}

$('#modalIncluirExameRealizado').on('shown.bs.modal', function (e) {
    // carregar as listas de pessoas e exames
    carregarCombo("campoPessoaId", "Pessoa");
    carregarCombo("campoExameId", "Exame");
})