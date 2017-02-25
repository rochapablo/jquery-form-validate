var App = (function($) {

  $(function() {

    requiredspan();

    $('.validate').find('[name="nome"]').val('Pablo Ricardo Rocha');
    $('.validate').find('[name="cpf"]').val('152.982.155-05');
    $('.validate').find('[name="rg"]').val('9878548-9');
    $('.validate').find('[name="data_nascimento"]').val('21/04/1989');
    $('.validate').find('[name="data_cadastro"]').val(moment().format('YYYY-MM-DD'));
    $('.validate').find('[name="sexo"]').val('M');

    // On change, if male show reservista field
    $('[name="sexo"]').change(function() {
      var field = $('[name="reservista"]');
      if(this.value === 'M') {
        field.prop('disabled', false);
        field.parent().removeClass('hide');
      } else {
        field.prop('disabled', true);
        field.parent().addClass('hide');
      }
    });

    $('#btnCancelar').click(function(){
      limparCampos();
    });

    $('#btnSalvar').click(function(){
      validarCamposObrigatorios();
    });

  });

  function requiredspan() {
    // Adding `p span` automatically to the required fields
    var required = $('.validate').find('.required').parent();
    if(required.find('p span').length === 0) {
      required.append('<p><span></span></p>');
    }
  }

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

  function calcAge(birth_year, birth_month, birth_day) {
      today_date = new Date();
      today_year = today_date.getFullYear();
      today_month = today_date.getMonth();
      today_day = today_date.getDate();
      age = today_year - birth_year;
      if (today_month < (birth_month - 1)) {
          age--;
      }
      if (((birth_month - 1) == today_month) && (today_day < birth_day)) {
          age--;
      }
      return age;
  };

  function calcDays(date) {
    var a = new Date();
    var utc2 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc1 = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    return Math.floor((utc2 - utc1) / (1000 * 3600 * 24));
  }

  var App = function() {

    this.config = {
      data_cadastro: {
        max: function() {
          return moment().subtract(365, 'days').format('YYYY-MM-DD');
        },
        min: function() {
          return moment().subtract(1, 'days').format('YYYY-MM-DD');
        }
      }
    };

    // @TODO: need improve this
    this.addPhone = function(element) {
      var $div = $(element).parent().find('[id^="telefone_tipo-"]');
      var num = parseInt( $div.prop("id").match(/\d+/g), 10 ) +1;
      var clone = $(element).parent().clone();

      clone.find('[id^="telefone_tipo-"]')
      .prop('id', 'telefone_tipo-' + num)
      .prop('value', '');

      clone.find('[id^="telefone-"]')
      .prop('id', 'telefone-' + num)
      .prop('value', '');

      clone.insertAfter($(element).parent());
      clone.find('[id^="telefone-"]').focus();
      $div.parent().find('button').remove();

      // need reload the mask
      //$('head').append('<script src="js/jquery.mask.js" type="text/javascript"></script>');
      $('.fone').mask('(99)9999-9999');
    };

    this.validate = function(form) {
      var messages = [];

      // Nome validate
      if(form.nome.value.length < 10 || form.nome.value.length > 40) {
        messages.push('O nome deve conter somente letras maiúsculas, mínimo de 10 e máximo de 40 caracteres');
      }
      form.nome.value = form.nome.value.toUpperCase();

      // CPF validate
      var numbers = form.cpf.value.match(/\d+/g);
      if(!numbers || numbers.length !== 4 || numbers.join('').length !== 11) {
        messages.push('O CPF deve conter apenas números, exatamente 11 posições');
      }

      // Data Nascimento validate
      var numbers = form.data_nascimento.value.split('/');
      var age = calcAge(numbers[2], numbers[1], numbers[0]);
      if(age < 16) {
        messages.push('Data de nascimento, somente de pessoas que possuam 16 anos completos ou mais');
      }

      // Data Cadastro validate
      var days = calcDays(new Date(form.data_cadastro.value));
      if(days <= 0 || days > 365) {
        messages.push('A data de cadastro não deve ser superior a data atual e inferior a 365 dias');
      }

      // Reservista validate
      var numbers = form.data_nascimento.value.split('/');
      if(form.sexo.value === 'M' && age > 18) {
        var field = $('[name="reservista"]');
        field.prop('required', true);
        field.addClass('required');
        // @TODO: not working
        requiredspan();
        messages.push('O campo reservista é obrigatório');
      }

      // Telefone validate
      var mgs1 = false;
      var aux = 0;
      $.each($('[name^="telefone_tipo"]'), function(index, value) {
        if($(this).val().length <= 0 && $(this).next().val().length <= 0) {
          $(this).addClass('required invalid');
          $(this).next().addClass('required invalid');
          mgs1 = true;
        } else {
          $(this).removeClass('required invalid');
          $(this).next().removeClass('required invalid');
        }
        if($(this).next().val().length <= 0) {
          aux++;
        }
      });
      if(mgs1) {
        messages.push('Para cada telefone informe se é "Fixo" ou "Celular"');
      }
      if(aux === $('[id^="telefone-"]').length) {
        messages.push('É obrigatório informar pelo menos um telefone.');
      }

      var error = messages.length > 0;

      if(error) {
        $('.messages').show();
        $('.messages').html(messages.join('<br />'));
      } else {
        $('.messages').hide();
      }

      return error;
    };

  };

  return new App();

})(jQuery);
