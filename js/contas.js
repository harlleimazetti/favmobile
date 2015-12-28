function get_all_contas(fn) 
{
	var id_conta = sessionStorage.id_conta;
	db.transaction(function (tx)
	{
		var sql = "SELECT * FROM contas WHERE id_conta = '" + id_conta + "' ORDER BY data_abertura, id_conta";
		tx.executeSql (sql, undefined, function (tx, result)
		{
			if (result.rows.length)
			{
				var contas = new Array;
				for (var i = 0; i < result.rows.length; i++) 
				{
					var row = result.rows.item(i);
					contas[i] = new Object();
					contas[i].id_conta		= row.id_conta;
					contas[i].id_pessoa		= row.id_pessoa;
					contas[i].numero		= row.numero;
					contas[i].data_abertura	= row.data_abertura;
					contas[i].saldo_inicial	= row.saldo_inicial;
					contas[i].obs			= row.obs;
				}
				fn(contas);
			}
		});
	});
}

function get_contas(id, fn)
{
	db.transaction(function (tx)
	{
		var sql = "SELECT * FROM contas WHERE id_conta = " + id;
		tx.executeSql (sql, undefined, function (tx, result)
		{
			if (result.rows.length)
			{
				var contas = new Object();
				var row = result.rows.item(0);
				contas.id_conta			= row.id_conta;
				contas.id_pessoa		= row.id_pessoa;
				contas.numero			= row.numero;
				contas.data_abertura	= row.data_abertura;
				contas.saldo_inicial	= row.saldo_inicial;
				contas.obs				= row.obs;
				fn(contas);
			}
		});
	});
}

function get_contas_pessoa(id_pessoa, fn)
{
	db.transaction(function (tx)
	{
		var sql = "SELECT * FROM contas WHERE id_pessoa = " + id_pessoa;
		tx.executeSql (sql, undefined, function (tx, result)
		{
			if (result.rows.length)
			{
				var contas = new Object();
				var row = result.rows.item(0);
				contas.id_conta			= row.id_conta;
				contas.id_pessoa		= row.id_pessoa;
				contas.numero			= row.numero;
				contas.data_abertura	= row.data_abertura;
				contas.saldo_inicial	= row.saldo_inicial;
				contas.obs				= row.obs;
				fn(contas);
			}
		});
	});
}

function get_last_contas(fn)
{
	db.transaction(function (tx)
	{
		var sql = "SELECT * FROM contas ORDER BY id_conta DESC LIMIT 1";
		tx.executeSql (sql, undefined, function (tx, result)
		{
			if (result.rows.length)
			{
				var contas = new Object();
				var row = result.rows.item(0);
				contas.id_conta = row.id_conta;
				fn(contas);
			}
		});
	});
}

function salvar_contas(contas, operacao_bd, fn)
{
	db.transaction(function (tx)
	{
		if (operacao_bd == 'novo')
		{
			var sql = "INSERT INTO contas (" +
					"id_pessoa, " + 
					"numero, " + 
					"data_abertura, " + 
					"saldo_inicial, " + 
					"obs " + 
				") VALUES ( " +
					"'" + contas.id_pessoa + "', " + 
					"'" + contas.numero + "', " + 
					"'" + formata_data_db(contas.data_abertura) + "', " + 
					"'" + contas.saldo_inicial + "', " + 
					"'" + contas.obs + "' " + 
				")";
		} else {
			var sql = "UPDATE contas SET " +
						"id_pessoa = '" + contas.id_pessoa + "', " + 
						"numero = '" + contas.numero + "', " + 
						"data_abertura = '" + formata_data_db(contas.data_abertura) + "', " + 
						"saldo_inicial = '" + contas.saldo_inicial + "', " + 
						"obs = '" + contas.obs + "' " + 
					" WHERE id_conta = " + contas.id_conta;
		}
		tx.executeSql(sql);
		var resultado = new Object();
		resultado.status = 1;
		resultado.mensagem = 'Registro salvo com sucesso';	
		fn(resultado);
	});
}

function atualizar_contas(contas, fn)
{
	db.transaction(function (tx)
	{
		var sql = "INSERT OR REPLACE INTO contas (" +
					"id_conta, " + 
					"id_pessoa, " + 
					"numero, " + 
					"data_abertura, " + 
					"saldo_inicial, " + 
					"obs " + 
				") VALUES ( " +
					"'" + contas.id_conta + "', " + 
					"'" + contas.id_pessoa + "', " + 
					"'" + contas.numero + "', " + 
					"'" + contas.data_abertura + "', " + 
					"'" + contas.saldo_inicial + "', " + 
					"'" + contas.obs + "' " + 
				")";
		tx.executeSql(sql);
		var resultado = new Object();
		resultado.status = 1;
		resultado.mensagem = 'Registro salvo com sucesso';	
		fn(resultado);
	});
}

function excluir_contas(id, fn)
{
	db.transaction(function (tx)
	{
		var sql = "DELETE FROM contas WHERE id_conta = " + id;
		tx.executeSql (sql, undefined, function (tx, result)
		{
			var resultado = new Object();
			resultado.status = 1;
			resultado.mensagem = 'Registro excluído com sucesso';
			fn(resultado);
		});
	});
}

///////// CONTAS FIM