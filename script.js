$(document).ready(function(){
	$('#btnCancelar').click(function(){
		limparCampos();
	});

	$('#btnSalvar').click(function(){
		validarCamposObrigatorios();
	});
});
function limparCampos() {
	$('#txtNome').val('');
	$('#txtCpf').val('');
	$('#txtRg').val('');
	$('#txtDataNascimento').val('');
	$('#txtDataCadastro').val('');
	$('#comboSexo').val('');
	$('#txtReservista').val('');
	$('#comboTelefone').val('');
	$('#txtNumero').val('');

}
function validarCamposObrigatorios() {
	if ($('#txtCpf').val() == "") {
		$('#txtCpf').marcarIvalido();
	} else {
		$('#txtCpf').removerInvalido();
	}

	if ($('#txtNome').val() == "") {
		$('#txtNome').marcarIvalido();
	} else {
		$('#txtNome').removerInvalido();
	}

	if ($('#txtRg').val() == "") {
		$('#txtRg').marcarIvalido();
	} else {
		$('#txtRg').removerInvalido();
	}

	if ($('#txtDataNascimento').val() == "") {
		$('#txtDataNascimento').marcarIvalido();
	} else {
		$('#txtDataNascimento').removerInvalido();
	}

	if ($('#txtDataCadastro').val() == "") {
		$('#txtDataCadastro').marcarIvalido();
	} else {
		$('#txtDataCadastro').removerInvalido();
	}
	if ($('#comboSexo').val() == "") {
		$('#comboSexo').marcarIvalido();
	} else {
		$('#comboSexo').removerInvalido();
	}
}
