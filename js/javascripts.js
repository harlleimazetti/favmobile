document.addEventListener("deviceready", onDeviceReady, false); 
function onDeviceReady() {
	$.mobile.defaultPageTransition = 'none';
	$.mobile.defaultDialogTransition = 'none';
	$.mobile.allowCrossDomainPages = true;
	$.mobile.phonegapNavigationEnabled = true;
	$.support.cors = true;
	//sincronizar();
}

var map;

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

$( document ).on( "pageinit" , "#inicio", function () {

});

$(document).on('click', '.capturar_imagem', function(event)
{
	event.preventDefault();
	//sessionStorage.img_uri = $(this).data('img-uri');
	sessionStorage.img_vis = $(this).data('img-vis');
	navigator.camera.getPicture(onSuccess, onFail, { quality: 50, 
	destinationType: Camera.DestinationType.FILE_URI });
});

function onSuccess(imageURI) {
    //var image = document.getElementById('visualizacao_imagem');
    //image.src = imageURI;
	//var img_uri = '#' + sessionStorage.img_uri;
	var img_vis = '#' + sessionStorage.img_vis; 
	$(img_vis, $.mobile.activePage).attr('src', imageURI);
	//$(img_uri, $.mobile.activePage).val(imageURI);
}

function onFail(message) {
    alert('Falha: ' + message);
}

$(document).on('pageinit', '#reportar', function(event)
{
	event.preventDefault();
	navigator.geolocation.getCurrentPosition(onGPSSuccess, onGPSError, {enableHighAccuracy : true});
});

var onGPSSuccess = function(position) {
	var coordenadas = position.coords.latitude + ', ' + position.coords.longitude;
	$('#coordenadas').val(coordenadas);
    /*alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');*/
};

// onError Callback receives a PositionError object
//
function onGPSError(error) {
    alert('Erro: ' + error.code + ', Descrição: ' + error.message);
}

$(document).on( "click" , "#btn_sincronizar", function () {
	sincronizar();
});

function sincronizar() {
	get_config(1, function(config) {
		var url_servidor = config.url_servidor;
		$.ajax({
			url: url_servidor,
			data: {acao: 'sincronizar', dados : {id_pessoa : 61}},
			dataType: 'jsonp',
			jsonp: 'callback',
			success: function(resultado) {
				var lancamentos = resultado.pessoas[0].contas[0].lancamentos;
				console.log(lancamentos);
				$.each(lancamentos, function(key, lancamento) {
					atualizar_lancamentos(lancamento, function(resultado) {
						console.log(resultado.mensagem);
					});
				});
			},
			error: function (xhr, textStatus, thrownError) {
				//console.log('textStatus: ' + textStatus + ', thrownError: ' + thrownError);
				alert('textStatus: ' + textStatus + ', thrownError: ' + thrownError);
			}
		});
	});
}