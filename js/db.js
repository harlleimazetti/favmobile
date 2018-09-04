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
		"ativo VARCHAR(1), " +
		"acesso VARCHAR(1), " +
		"nome VARCHAR(100), " +
		"nascimento DATE, " +
		"cpf VARCHAR(15), " +
		"admissao DATE, " +
		"tempo_servico VARCHAR(2), " +
		"ci VARCHAR(30), " +
		"ci_emissao DATE, " +
		"logradouro VARCHAR(200), " +
		"numero VARCHAR(10), " +
		"complemento VARCHAR(50), " +
		"cidade VARCHAR(50), " +
		"uf VARCHAR(2), " +
		"telefone_celular VARCHAR(16), " +
		"telefone_fixo VARCHAR(16), " +
		"telefone_recado VARCHAR(16), " +
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
