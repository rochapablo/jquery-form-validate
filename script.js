(function(window, $) {

  var Pessoa = function(data) {

    var _this = this;
    _this.idade = -1;
    _this.telefones = [];
    _this.errors = [];

    this.setNome = function(value) {
      if(value.length < 10 || value.length > 40) {
        _this.errors.push('O nome deve conter somente letras maiúsculas, mínimo de 10 e máximo de 40 caracteres');
        return false;
      }
      return _this.nome = value.toUpperCase();
    };

    this.setCpf = function(value) {
      var numbers = value.match(/\d+/g);
      if(!numbers || numbers.length !== 4 || numbers.join('').length !== 11) {
        _this.errors.push('O CPF deve conter apenas números, exatamente 11 posições');
        return false;
      }
      return _this.cpf = value;
    };

    this.setRg = function(value) {
      if(value.length < 8) {
        _this.errors.push('O RG é um campo obrigatório');
        return false;
      }
      return _this.rg = value;
    };

    this.setDataNascimento = function(value) {
      _this.idade = moment().diff(moment(value, 'DD/MM/YYYY'), 'years');
      if(_this.idade < 16) {
        _this.errors.push('Data de nascimento, somente de pessoas que possuam 16 anos completos ou mais');
        return false;
      }
      return _this.data_nascimento = moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD');
    };

    this.setDataCadastro = function(value) {
      var days = moment().diff(moment(value), 'days');
      if(days <= 0 || days > 365) {
        _this.errors.push('A data de cadastro não deve ser superior a data atual e inferior a 365 dias');
        return false;
      }
      return _this.data_cadastro = value;
    };

    this.setSexo = function(value) {
      if(value.length < 1) {
        _this.errors.push('O campo sexo é um campo obrigatório');
        return false;
      }
      return _this.sexo = value;
    };

    this.setReservista = function(value) {
      if(_this.sexo === 'M' && _this.idade > 18 && value.length < 1) {
        _this.errors.push('O campo reservista é obrigatório');
        return false;
      }
      return _this.reservista = value;
    };

    this.setTelefones = function(data) {
      var error = false;
      data.telefone_tipo.forEach(function(current, index) {
        var val1 = data.telefone[index].value;
        var val2 = data.telefone[index].value;
        var numbers = val2.match(/\d+/g);
        if(!numbers || numbers.join('').length < 10 || val1.length < 1) {
          error = true;
          return false;
        }
        _this.telefones.push({
          telefone_tipo: val1,
          telefone: val2
        });
      });
      if(error) {
        _this.errors.push('Para cada telefone informe se é "Fixo" ou "Celular"');
        return false;
      }
      return _this.telefones;
    };

    this.getErrors = function() {
      return _this.errors;
    };

    this.isValid = function() {
      return _this.errors.length <= 0;
    };

    this.save = function() {
      console.log({
        nome: _this.nome,
        cpf: _this.cpf,
        rg: _this.rg,
        data_nascimento: _this.data_nascimento,
        data_cadastro: _this.data_cadastro,
        sexo: _this.sexo,
        reservista: _this.reservista,
        telefones: _this.telefones
      });
    };

    _this.nome = (data && data.nome ? this.setNome(data.nome.value) : '');
    _this.cpf = (data && data.cpf ? this.setCpf(data.cpf.value) : '');
    _this.rg = (data && data.rg ? this.setRg(data.rg.value) : '');
    _this.data_nascimento = (data && data.data_nascimento ? this.setDataNascimento(data.data_nascimento.value) : '');
    _this.data_cadastro = (data && data.data_cadastro ? this.setDataCadastro(data.data_cadastro.value) : '');
    _this.sexo = (data && data.sexo ? this.setSexo(data.sexo.value) : '');
    _this.reservista = (data && data.reservista ? this.setReservista(data.reservista.value) : '');

  };

  window.Pessoa = Pessoa;

  return window.Pessoa;

})(window, $);

(function(window, $) {

  var App = function() {

    var _this = this;

    this.load = function() {
      $(function() {
        // console.clear();
        _this.addRequiredMessageTags();
        _this.onSexoFieldChange();
        // _this.fillForTestPurpose();
      });
    };

    // Adding `p span` automatically to the required fields
    this.addRequiredMessageTags = function() {
      var required = $('.validate').find('.required').parent();
      if(required.find('p span').length === 0) {
        required.append('<p><span></span></p>');
      }
    };

    this.fillForTestPurpose = function() {
      var form = $('.validate');
      form.find('[name="nome"]').val('Pablo Ricardo Rocha');
      form.find('[name="cpf"]').val('152.982.155-05');
      form.find('[name="rg"]').val('9878548-9');
      form.find('[name="data_nascimento"]').val('21/04/1989');
      form.find('[name="data_cadastro"]').val(moment().format('YYYY-MM-DD'));
      form.find('[name="sexo"]').val('M');
      form.find('[name="sexo"]').change();
      form.find('[name="reservista"]').prop('disabled', false);
      form.find('[name="reservista"]').val('999');
      form.find('[name="telefone_tipo[]"]').eq(0).val('fixo');
      form.find('[name="telefone[]"]').eq(0).val('(44)3325-9874');
    };

    this.onSexoFieldChange = function() {
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
    };

    // @TODO: need improve this
    this.addTelefoneFields = function(element) {
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

    this.validateToggle = function(isvalid, field) {
      setTimeout(function() {
        var element = $('[name="' + field + '"]');
        if(isvalid && !element.hasClass('invalid')) {
            element.removeClass('invalid');
            element.addClass('valid');
        } else {
            element.removeClass('valid');
            element.addClass('invalid');
        }
      }, 0);
    };

    this.validate = function(form) {

      var pessoa = new window.Pessoa();

      _this.validateToggle(pessoa.setNome(form.nome.value), 'nome');
      _this.validateToggle(pessoa.setCpf(form.cpf.value), 'cpf');
      _this.validateToggle(pessoa.setRg(form.rg.value), 'rg');
      _this.validateToggle(pessoa.setDataNascimento(form.data_nascimento.value), 'data_nascimento');
      _this.validateToggle(pessoa.setDataCadastro(form.data_cadastro.value), 'data_cadastro');
      _this.validateToggle(pessoa.setSexo(form.sexo.value), 'sexo');

      var isReservistaValid = pessoa.setReservista(form.reservista.value);
      _this.validateToggle(isReservistaValid, 'reservista');
      if(!isReservistaValid) {
        var field = $('[name="reservista"]');
        field.prop('required', true);
        field.addClass('required');
        // @TODO: not working
        _this.addRequiredMessageTags();
      }

      var telefones = pessoa.setTelefones({
         telefone_tipo: $('[name^="telefone_tipo[]"]').serializeArray(),
         telefone: $('[name^="telefone[]"]').serializeArray()
      });

      if(!telefones) {
        $.each($('[name^="telefone_tipo"]'), function(index, value) {
          if($(this).val().length <= 0 || $(this).next().val().length <= 0) {
            $(this).addClass('required invalid');
            $(this).prop('required', true);
            $(this).next().addClass('required invalid');
            $(this).next().prop('required', true);
          } else {
            $(this).removeClass('required invalid');
            $(this).prop('required', false);
            $(this).next().removeClass('required invalid');
            $(this).next().prop('required', false);
          }
        });
      }

      var isvalid = pessoa.isValid();
      if(!isvalid) {
        $('.messages').show();
        $('.messages').html(pessoa.getErrors().join('<br />'));
      } else {
        $('.messages').hide();
        // checking for others pluggins that also validate the form like $('.cpf')
        // if valid, you can save the object
        setTimeout(function() {
          if($('.invalid').length === 0) {
            pessoa.save();
          }
        }, 0);
        // returning false for test purpose
        return false;
      }
      return isvalid;

    };

    this.reset = function(form) {
      $('.invalid').remove();
      $('.messages').hide();
      $('.messages').html('');
      form.reset();
      // hiding the reservista field
      $('[name="sexo"]').change();
    };

  };

  window.App = new App();

  return window.App;

})(window, jQuery).load();
