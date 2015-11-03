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
var data1 = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul"],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.5)",
            strokeColor: "rgba(151,187,205,0.8)",
            highlightFill: "rgba(151,187,205,0.75)",
            highlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
};
	var options = { responsive : true, animation : false, scaleFontColor: "#fff", scaleLineColor : "rgba(255,255,255,.20)", scaleGridLineColor : "rgba(255,255,255,.20)" }
	var ctx1 = document.getElementById("myChart1").getContext("2d");
	var myBarChart = new Chart(ctx1).Bar(data1, options);
	
var data2 = [
    {
        value: 890,
        color:"#F7464A",
        highlight: "#FF5A5E",
        label: "Red"
    },
    {
        value: 412,
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Yellow"
    }
]

var ctx2 = document.getElementById("myChart2").getContext("2d");
var myPieChart = new Chart(ctx2).Doughnut(data2,options);
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
	$.mobile.loading( "show", {
		text: "Atualizando...",
		textVisible: true,
		theme: "b",
		html: ""
	});
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
				$.mobile.loading( "hide" );
			},
			error: function (xhr, textStatus, thrownError) {
				//console.log('textStatus: ' + textStatus + ', thrownError: ' + thrownError);
				alert('textStatus: ' + textStatus + ', thrownError: ' + thrownError);
			}
		});
	});
}