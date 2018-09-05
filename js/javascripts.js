document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	$.mobile.defaultPageTransition = 'none';
	$.mobile.defaultDialogTransition = 'none';
	$.mobile.allowCrossDomainPages = true;
	$.mobile.phonegapNavigationEnabled = true;
	$.support.cors = true;
	//sincronizar();
}

function sairApp() {
	navigator.app.exitApp();
}

$(document).on('click', '.sair_app', function(event) {
	sairApp();
	event.preventDefault();
});

$( document ).on( "pagebeforeshow" , function(e, data) {
	get_config(1, function(config) {
		var id_pessoa = config.id_pessoa;
		sessionStorage.setItem('id_pessoa', config.id_pessoa);
		var toPage = data.toPage[0].id;
		console.log(toPage);
		if(toPage != "login" && (typeof (id_pessoa) == "undefined" || id_pessoa == null || id_pessoa == 0)) {
			$(':mobile-pagecontainer').pagecontainer('change', '#login');
		}
		$('.nome_titular').html(config.nome);
		$('.grupo_titular').html(config.grupo);
	});
});

$( document ).on( "pageinit" , "#inicio", function () {
	get_config(1, function(config) {
		sessionStorage.setItem('id_pessoa', config.id_pessoa);
		calcula_saldo();
	});
});

$( document ).on( "pageinit" , "#analise", function () {
			var saldo_parcial = JSON.parse(sessionStorage.saldo_parcial);
			var maximo = 12;

			var options = { responsive : false, animation : false, bezierCurve : false, scaleFontColor: "#fff", scaleLineColor : "rgba(255,255,255,.20)", scaleGridLineColor : "rgba(255,255,255,.20)" }

			var data1 = {
				labels: saldo_parcial.data.slice(-maximo),
				datasets: [
					{
						label: "Saldo",
						fillColor: "rgba(220,220,220,0.5)",
						strokeColor: "rgba(220,220,220,0.8)",
						highlightFill: "rgba(220,220,220,0.75)",
						highlightStroke: "rgba(220,220,220,1)",
						data: saldo_parcial.subtotal.slice(-maximo)
					}
				]
			};
			var ctx1 = document.getElementById("myChart1").getContext("2d");
			var myLineChart = new Chart(ctx1).Line(data1, options);

			var data2 = [
				{
					value: saldo_parcial.deposito,
					color:"#F7464A",
					highlight: "#FF5A5E",
					label: "DEPÓSITOS"
				},
				{
					value: saldo_parcial.rendimento,
					color: "#FDB45C",
					highlight: "#FFC870",
					label: "RENDIMENTOS"
				}
			]
			var ctx2 = document.getElementById("myChart2").getContext("2d");
			var myPieChart = new Chart(ctx2).Doughnut(data2,options);

			var data3 = {
				labels: saldo_parcial.data.slice(-maximo),
				datasets: [
					{
						label: "Valor",
						fillColor: "rgba(220,220,220,0.5)",
						strokeColor: "rgba(220,220,220,0.8)",
						highlightFill: "rgba(220,220,220,0.75)",
						highlightStroke: "rgba(220,220,220,1)",
						data: saldo_parcial.valor.slice(-maximo)
					}
				]
			};
			var ctx3 = document.getElementById("myChart3").getContext("2d");
			var myBarChart = new Chart(ctx3).Bar(data3, options);
});

$(document).on("touchstart", ".tabela_home tr td", function() {
	$(this).addClass("ativa");
});

$(document).on("touchend", ".tabela_home tr td", function() {
	$(this).removeClass("ativa");
});

$(document).on("click", ".tabela_home tr td", function() {
	var url = $(this).data('url');
	$( ":mobile-pagecontainer" ).pagecontainer( "change", url );
});

$(document).on( "click" , "#btn_sincronizar", function () {
	sincronizar();
});

$(document).on( "submit" , "#formulario_login", function (event) {
	registrar();
	event.preventDefault();
});

function sincronizar() {
	$.mobile.loading( "show", {
		text: "Atualizando...",
		textVisible: true,
		theme: "b",
		html: ""
	});
	get_config(1, function(config) {
		var url_servidor = config.url_servidor;
		var id_pessoa = config.id_pessoa;
		$.ajax({
			url: url_servidor,
			data: {acao: 'sincronizar', dados : {id_pessoa : id_pessoa}},
			dataType: 'jsonp',
			jsonp: 'callback',
			success: function(resultado) {
				//console.log(resultado);
				var contas = resultado.pessoas[0].contas;
				//console.log(contas);
				$.each(contas, function(key, conta) {
					atualizar_contas(conta, function(resultado) {
						//console.log(resultado.mensagem);
					});
				});
				var lancamentos = resultado.pessoas[0].contas[0].lancamentos;
				//console.log(lancamentos);
				$.each(lancamentos, function(key, lancamento) {
					atualizar_lancamentos(lancamento, function(resultado) {
						//console.log(resultado.mensagem);
					});
				});
				$.mobile.loading( "hide" );
			},
			error: function (xhr, textStatus, thrownError) {
				//console.log('textStatus: ' + textStatus + ', thrownError: ' + thrownError);
				alert('textStatus: ' + textStatus + ', thrownError: ' + thrownError);
			}
		});
	});
}

function registrar() {
	var login = $('#form_login').val();
	var senha = $('#form_senha').val();
	if (login == '' || senha == '') {
		alert('Login ou senha inválidos! Por favor tente novamente.');
	} else {
		$.mobile.loading( "show", {
			text: "Registrando...",
			textVisible: true,
			theme: "b",
			html: ""
		});
		get_config(1, function(config) {
			var url_servidor = config.url_servidor;
			var id_pessoa = config.id_pessoa;
			$.ajax({
				url: url_servidor,
				cache: false,
				data: {acao: 'registrar', dados : {login : login, senha : senha}},
				dataType: 'jsonp',
				jsonp: 'callback',
				success: function(resultado) {
					console.log(resultado);
					if (resultado.status == 'ok') {
						config.id_pessoa	= resultado.pessoas[0].id_pessoa;
						config.nome			= resultado.pessoas[0].nome;
						config.grupo		= resultado.pessoas[0].grupo;
						$('.nome_titular').html(config.nome);
						$('.grupo_titular').html(config.grupo);
						salvar_config(config, 'editar', function(resultado) {
							$.mobile.loading( "hide" );
							$( ":mobile-pagecontainer" ).pagecontainer( "change", '#inicio' );
						});
						$.mobile.loading( "hide" );
					} else {
						$.mobile.loading( "hide" );
						toast(resultado.mensagem);
					}
				},
				error: function (xhr, textStatus, thrownError) {
					//console.log('textStatus: ' + textStatus + ', thrownError: ' + thrownError);
					alert('textStatus: ' + textStatus + ', thrownError: ' + thrownError);
				}
			});
		});
	}
}
