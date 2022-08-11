$(function () {

    $(document).on('click', '#link_excluirTurma', function(){
        var turma = $(this).attr('id'); //obter o id do elemento clicado
        var id = turma.split('_')[2]; // editar_pessoa_N => obter id da pessoa
        var meuip = sessionStorage.getItem('meuip');
        var email = sessionStorage.getItem('email')

        $.ajax({
            url: `http://${meuip}:5000/deleteTurma/${email}/${id}`,
            method: DELETE,
            dataType: 'json', // os dados são recebidos no formato json
            headers: {Authorization: 'Bearer ' + jwt},
            success:   
        })
    })
})