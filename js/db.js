var db = openDatabase ("frpmmobile", "1.0", "FRPM Mobile", 65535);
db.transaction (function (transaction) 
{
	console.log('Configurando Banco de Dados...');

	//var sql = "DROP TABLE config";
	//transaction.executeSql (sql, undefined, function() { }, error);
	
	var sql = "CREATE TABLE IF NOT EXISTS config " +
		" (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
		"url_servidor VARCHAR(200) " +
		")"
	transaction.executeSql (sql, undefined, function() { }, error);
	console.log(sql);
	
	var sql = "INSERT OR REPLACE INTO config (id, url_servidor) VALUES ('1', 'http://www.frpm.com.br/frpmmobile/sincronizar.php') ";
	transaction.executeSql (sql, undefined, function() { }, error);
	console.log(sql);
	
	//var sql = "DROP TABLE pessoas";
	//transaction.executeSql (sql, undefined, function() { }, error);
	
	var sql = "CREATE TABLE IF NOT EXISTS pessoas " +
		" (id_pessoa INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
		"id_grupo INTEGER, " +
		"id_tipo INTEGER, " +
		"id_cargo INTEGER, " +
		"id_funcao INTEGER, " +
		"id_departamento INTEGER, " + 
		"id_estado_lotacao INTEGER, " + 
		"ativo VARCHAR(1), " + 
		"acesso VARCHAR(1), " +
		"nome VARCHAR(100), " + 
		"nascimento DATE, " + 
		"razao_social VARCHAR(100), " + 
		"nome_fantasia VARCHAR(100), " + 
		"cnpj VARCHAR(15), " + 
		"inscricao VARCHAR(20), " + 
		"cpf VARCHAR(15), " + 
		"admissao DATE, " +
		"tempo_servico VARCHAR(2), " +
		"ci VARCHAR(30), " + 
		"site VARCHAR(100), " + 
		"obs TEXT " + 
		")";
	transaction.executeSql (sql, undefined, function() { }, error);
	console.log(sql);
	
	//var sql = "DROP TABLE contas";
	//transaction.executeSql (sql, undefined, function() { }, error);
	
	var sql = "CREATE TABLE IF NOT EXISTS contas " +
		" (id_conta INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
		"id_pessoa INTEGER, " +
		"numero VARCHAR(30), " +
		"data_abertura DATE, " +
		"saldo_inicial REAL(10,2), " +
		"obs TEXT " + 
		")";
	transaction.executeSql (sql, undefined, function() { }, error);
	console.log(sql);
	
	//var sql = "DROP TABLE lancamentos";
	//transaction.executeSql (sql, undefined, function() { }, error);
	
	var sql = "CREATE TABLE IF NOT EXISTS lancamentos " +
		" (id_lancamento INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
		"id_conta INTEGER, " +
		"id_tabela INTEGER, " + 
		"data DATE, " + 
		"descricao VARCHAR(200), " +
		"dc VARCHAR(1), " +
		"valor REAL(10,2) " +
		")";
	transaction.executeSql (sql, undefined, function() { }, error);
	console.log(sql);

	/*var sql = "INSERT INTO evidencia (id, evidencia_tipo_id, re_id, numero_ordem, numero_lacre, data, hora, nome_perito, coordenadas, unidade, obs) VALUES ('1', '1', '1', '1', '12345', '2014-02-23','11:00:00','Fulano de Tal','-18.92424, -48.249893','SBC - São Bernardo do Campo','Arrombamento ocorrido à noite na ausência dos proprietários do imóvel. Encontrados vestígios no local.') ";
	transaction.executeSql (sql, undefined, function() { }, error);
	var sql = "INSERT INTO evidencia (id, evidencia_tipo_id, re_id, numero_ordem, numero_lacre, data, hora, nome_perito, coordenadas, unidade, obs) VALUES ('2', '2', '1', '2', '54321', '2014-02-24','19:00:00','Beltrano da Silva','-18.92424, -48.249893','SBC - São Bernardo do Campo','Roubo a mão armada na Asa Norte. A vítima levou várias coronhadas na cabeça.') ";
	transaction.executeSql (sql, undefined, function() { }, error);
	var sql = "INSERT INTO evidencia (id, evidencia_tipo_id, re_id, numero_ordem, numero_lacre, data, hora, nome_perito, coordenadas, unidade, obs) VALUES ('3', '3', '1', '3', '98765', '2014-02-24','21:00:00','Ciclano de Alcantara','-18.92424, -48.249893','SBC - São Bernardo do Campo','Agressão doméstica. A vítima alega que o esposo a agrediu enquanto ela dormia.') ";
	transaction.executeSql (sql, undefined, function() { }, error);
	var sql = "INSERT INTO evidencia (id, evidencia_tipo_id, re_id, numero_ordem, numero_lacre, data, hora, nome_perito, coordenadas, unidade, obs) VALUES ('4', '4', '2', '1', '56789', '2014-02-25','12:00:00','Jose de Sousa','-18.92424, -48.249893','SBC - São Bernardo do Campo','Furto de veículo em Taguatinga. Vítima alega que havia um malote de tranporte de valores no interior do veículo.') ";
	transaction.executeSql (sql, undefined, function() { }, error);
	var sql = "INSERT INTO evidencia (id, evidencia_tipo_id, re_id, numero_ordem, numero_lacre, data, hora, nome_perito, coordenadas, unidade, obs) VALUES ('5', '1', '2', '2', '56712', '2014-02-25','15:00:00','Joao Francisco','-18.92424, -48.249893','SBC - São Bernardo do Campo','Invasão em estabelecimento comercial. Mercadorias e valores do caixa foram subtraídos.') ";
	transaction.executeSql (sql, undefined, function() { }, error);*/
});

function ok ()
{
}

function error (transaction, err) 
{
	console.log("Erro no banco de dados: " + err.message);
	return false;
}