<?php
	header("content-type: text/javascript");
	//header("Content-Type: application/json");
	
	$connection=mysql_connect("localhost","frpm","uninorte102030");
	$db = mysql_select_db("frpm",$connection);
	
	if (isset($_POST['acao'])) {
		$acao = $_POST['acao'];
		$dados = $_POST;
		$callback = '';
	} else if (isset($_GET['acao'])) {
		$acao = $_GET['acao'];
		$dados = $_GET['dados'];
		$callback = $_GET['callback'];
	} else {
		$acao = '';
		$dados = '';
		$callback = '';
	}
	
	if ($acao == 'sincronizar') {
		$resultado = sincronizar($dados);
	}
	
	if ($acao == 'registrar') {
		$resultado = registrar($dados);
	}
	
	if ($callback != '') {
		echo $_GET['callback'].'(' . json_encode($resultado).');';
	} else {
		echo json_encode($resultado);
	}
	
	exit;
	
	function sincronizar($dados) {
		mysql_query('SET CHARACTER SET utf8');
		$resultado = array();
		$resultado['status'] = '';
		$resultado['mensagem'] = '';
		$resultado['dados'] = $dados;
		$s1 = "SELECT * FROM pessoas WHERE id_pessoa = '".$dados['id_pessoa']."' ORDER BY id_pessoa";
		$q1 = mysql_query($s1);
		$pessoas = array();
		$a = 0;
		while ($r1 = mysql_fetch_assoc($q1)) {
			$pessoas[$a] = $r1;
			$s2 = "SELECT * FROM contas WHERE id_pessoa = '".$r1['id_pessoa']."' ORDER BY id_conta";
			$q2 = mysql_query($s2);
			$pessoas[$a]["contas"] = array();
			$b = 0;
			while ($r2 = mysql_fetch_assoc($q2)) {
				$pessoas[$a]["contas"][$b] = $r2;
				$s3 = "SELECT * FROM lancamentos WHERE id_conta = '".$r2['id_conta']."' ORDER BY data, id_lancamento";
				$q3 = mysql_query($s3);
				$pessoas[$a]["contas"][$b]["lancamentos"] = array();
				$c = 0;
				while($r3 = mysql_fetch_assoc($q3)) {
					$pessoas[$a]["contas"][$b]["lancamentos"][$c] = $r3;
					$c++;
				}
				$b++;
			}
			$a++;
		}
		$resultado['pessoas'] = $pessoas;
		return $resultado;
	}
	
	function registrar($dados) {
		mysql_query('SET CHARACTER SET utf8');
		$resultado = array();
		$resultado['status'] = '';
		$resultado['mensagem'] = '';
		//$resultado['dados'] = $dados;
		
		$pessoas = array();
		
		if($dados['login'] != '' and $dados['senha'] != '') {
			$s1 = "	SELECT us.*, pe.nome, pgp.id_grupo AS id_grupo_pessoa, pg.grupo
					FROM usuarios AS us
					LEFT JOIN pessoas AS pe ON us.id_pessoa = pe.id_pessoa
					LEFT JOIN pessoas_grupos_pessoas AS pgp ON pgp.id_pessoa = pe.id_pessoa
					LEFT JOIN pessoas_grupos AS pg ON pg.id_grupo = pgp.id_grupo
					WHERE us.login = '" . $dados['login']. "'
						AND us.senha = '" . $dados['senha'] . "'
						AND us.ativo = 1
					LIMIT 1";
			$q1 = mysql_query($s1);
			if (mysql_num_rows($q1) > 0) {
				$r1 = mysql_fetch_assoc($q1);
				$pessoas[0] = $r1;
				$resultado['status'] = 'ok';
				$resultado['mensagem'] = 'Login efetuado com sucesso';
			} else {
				$resultado['status'] = 'er';
				$resultado['mensagem'] = 'Erro no login! Usuário não encontrado.';
			}
		} else {
				$resultado['status'] = 'er';
				$resultado['mensagem'] = 'Erro no login! Login ou senha inválidos.';
		}
		$resultado['pessoas'] = $pessoas;
		return $resultado;
	}
	
	function sql($tabela, $dados) {
		$resultado = array();
		mysql_query('SET CHARACTER SET utf8');
		if(is_array($dados)) {
			$s = "SELECT * FROM `".$tabela."` WHERE id = '".$dados['id']."' AND re_id='".$dados['re_id']."'";
			$q = mysql_query($s);
			$n = mysql_num_rows($q);
			if ($n <= 0) {
				$campos = implode(", ", array_keys($dados));
				$valores = array_map('mysql_real_escape_string', array_values($dados));
				$valores = "'" . implode("', '", $valores) . "'";
				$sql = "INSERT INTO `".$tabela."` ($campos) VALUES ($valores)";
    			mysql_query($sql);
			} else {
				foreach ($dados as $key => $value) {
					$value = mysql_real_escape_string($value); // this is dedicated to @Jon
					$value = "'$value'";
					$updates[] = "$key = $value";
				}
				$implodeArray = implode(', ', $updates);
				$sql = "UPDATE `".$tabela."` SET $implodeArray WHERE id='".$dados['id']."'";
				mysql_query($sql);
			}
			if (!mysql_error()) {
				$resultado['status'] = 'ok';
				$resultado['mensagem'] = 'Registros gravados com sucesso';
				$resultado['registro'] = $dados;
			} else {
				$resultado['status'] = 'er';
				$resultado['mensagem'] = 'Problema na gravação dos registros: ' . mysql_error() . ', ' . $sql;
				$resultado['registro'] = $dados;
			}
		} else {
			$resultado['status'] = 'er';
			$resultado['mensagem'] = 'Dados inválidos';
			$resultado['registro'] = $dados;
		}
		return $resultado;
	}
	
	function upload_imagem($dados) {
		$arquivo	= $_FILES["arquivo"]["tmp_name"]; 
		$tamanho	= $_FILES["arquivo"]["size"];
		$tipo		= $_FILES["arquivo"]["type"];
		$nome		= $_FILES["arquivo"]["name"];

		$fp = fopen($arquivo, "rb");
		$conteudo = fread($fp, $tamanho);
		$conteudo = addslashes($conteudo);
		fclose($fp);
		$s = "UPDATE ".$dados['tb']." SET ".$dados['cp']." = '".$conteudo."' WHERE id = ".$dados['id'];
		$q = mysql_query($s);
		
		//$resultado['status'] = 'ok';
		//$resultado['mensagem'] = $s;
		//$resultado['registro'] = $dados;
		return $s;
	}
	
	exit;
	
    function formata_data($var_data) {
         $var_dia = substr($var_data, 8, 2);
         $var_mes = substr($var_data, 5, 2);
         $var_ano = substr($var_data, 0, 4);
         $data_formatada = "$var_dia";
         $data_formatada.= "/"; 
         $data_formatada.= "$var_mes";
         $data_formatada.= "/";
         $data_formatada.= "$var_ano";
         return $data_formatada;
    }
		
    function formata_data_bd($var_data) {
         $var_dia = substr($var_data, 0, 2);
         $var_mes = substr($var_data, 3, 2);
         $var_ano = substr($var_data, 6, 4);
         $data_formatada = "$var_ano";
         $data_formatada.= "-"; 
         $data_formatada.= "$var_mes";
         $data_formatada.= "-";
         $data_formatada.= "$var_dia";
         return $data_formatada;
    }
?>