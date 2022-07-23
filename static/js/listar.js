$(function () { // quando o documento estiver pronto/carregado
        
    var email = sessionStorage.getItem('email');
    var nome = sessionStorage.getItem('nome');
    var meuip = sessionStorage.getItem('meuip');

    if (email != null) {
        jwt = sessionStorage.getItem('jwt');

        $('#nome').append(nome);
        
        // TURMAS

        // chamada ao backend
        $.ajax({
            url: `http://${meuip}:5000/listar/Turma?email=${email}`,
            method: 'GET',
            dataType: 'json', // os dados são recebidos no formato json
            contentType: 'text/plain',
            headers: {Authorization: 'Bearer ' + jwt},
            success: listar_turmas, // chama a função listar para processar o resultado
            error: function () {
                alert("erro ao ler dados, verifique o backend");
            }
        });
        //  curl localhost:5000/listar_turmas?email=efftingsofia@gmail.com
        function listar_turmas(retorno) {
            if (retorno.Resultado === 'ok' && retorno.Detalhes != 0) {
                // percorrer lista de turmas retornadas
                for (var i in retorno.Detalhes) {
                    lin = '<tr>' +
                        '<td>' + retorno.Detalhes[i].nome + '</td>'+
                        '</tr>';
                        // adiciona a linha no corpo da tabela
                    $('#corpoTabelaTurmas').append(lin);
                }
            } else if(retorno.Resultado == 'ok' && retorno.Detalhes == 0) {
                lin = '<tr>' +
                    'Nenhuma turma cadastrada!'+
                    '</tr>';
                $('#corpoTabelaTurmas').append(lin);
        
            } else {
                alert('Erro ao listar dados: ' + retorno.Detalhes);
            }
        };

        // AVALIACOES

        // chamada ao backend
        $.ajax({
            url: `http://${meuip}:5000/listar/Avaliacao?email=${email}`,
            method: 'GET',
            dataType: 'json',
            contentType: 'text/plain',
            headers: {Authorization: 'Bearer ' + jwt},
            success: listar_avs, 
            error: function () {
                alert("Erro ao ler dados, verifique o backend");
            }
        });
        
        function listar_avs(retorno) {
        // percorrer a lista de retorno retornadas; 
            if (retorno.Resultado === 'ok' && retorno.Detalhes != 0){
                // percorrer a lista de avs retornada
                for (var i in retorno.Detalhes) {
                    lin = "<tr>"+
                    "<td>" + retorno.Detalhes[i].descricao + "</td>" +
                    "<td>" + retorno.Detalhes[i].dataInicio + "</td>" +
                    "<td>" + retorno.Detalhes[i].dataFim + "</td>" +
                    "<td>" + retorno.Detalhes[i].turmas + "</td>" +
                    "</tr>";
                    // adiciona a linha no corpo da tabela
                    $('#corpoTabelaAvs').append(lin); 
                }
            } else if(retorno.Resultado === 'ok' && retorno.Detalhes == 0) {
                lin = '<tr>' +
                    '<td> Nenhuma avaliação cadastrada! </td>'+
                    '</tr>';
                $('#corpoTabelaAvs').append(lin);
            } else {
                alert('Erro ao listar dados: ' + retorno.Detalhes);
            }
        };

    } else {
        alert('Você ainda não está logado, por favor, conecte-se!');
        window.location.assign('/');
    }
    
});