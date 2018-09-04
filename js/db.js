var db = openDatabase ("favmobile", "1.0", "FAV Mobile", 65535);
db.transaction (function (transaction)
{
	console.log('Configurando Banco de Dados...');

	//var sql = "DROP TABLE config";
	//transaction.executeSql (sql, undefined, function() { }, error);

	var sql = "CREATE TABLE IF NOT EXISTS config " +
		" (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
		"url_servidor VARCHAR(200), " +
		"id_pessoa INTEGER, " +
		"nome VARCHAR(100), " +
		"grupo VARCHAR(100) " +
		")"
	transaction.executeSql (sql, undefined, function() { }, error);
	//console.log(sql);

	var sql = "INSERT OR IGNORE INTO config (id, url_servidor) VALUES ('1', 'http://www.fav-uninorte.com.br/favmobile/sincronizar.php') ";
	transaction.executeSql (sql, undefined, function() { }, error);
	//console.log(sql);

	//var sql = "DROP TABLE pessoas";
	//transaction.executeSql (sql, undefined, function() { }, error);

	var sql = "CREATE TABLE IF NOT EXISTS pessoas " +
		" (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
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
	//console.log(sql);

	//var sql = "DROP TABLE contas";
	//transaction.executeSql (sql, undefined, function() { }, error);

	var sql = "CREATE TABLE IF NOT EXISTS contas " +
		" (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
		"id_pessoa INTEGER, " +
		"numero VARCHAR(30), " +
		"data_abertura DATE, " +
		"saldo_inicial REAL(10,2), " +
		"obs TEXT " +
		")";
	transaction.executeSql (sql, undefined, function() { }, error);
	//console.log(sql);

	//var sql = "DROP TABLE lancamentos";
	//transaction.executeSql (sql, undefined, function() { }, error);

	var sql = "CREATE TABLE IF NOT EXISTS lancamentos " +
		" (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
		"id_conta INTEGER, " +
		"id_tabela INTEGER, " +
		"data DATE, " +
		"descricao VARCHAR(200), " +
		"dc VARCHAR(1), " +
		"valor REAL(10,2) " +
		")";
	transaction.executeSql (sql, undefined, function() { }, error);
	//console.log(sql);
});

function ok ()
{
}

function error (transaction, err)
{
	console.log("Erro no banco de dados: " + err.message);
	return false;
}
