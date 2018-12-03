function createDataset(fields, constraints, sortFields) {
	
	log.info("DS_Exemplo.js - INÍCIO");
	
	try {
		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
		var connectionWD = dataSourceWD.getConnection();
	} catch (e) {
		log.info("DS_Exemplo.js - ERRO 1: " + e.message + "(#" + e.lineNumber + ")");
	}
	
	var newDataset = DatasetBuilder.newDataset();
	
	if (fields != null && fields.length > 0) {
		for (var alpha in fields) {
			log.info("DS_Exemplo.js - FIELDS " + alpha + ": " + fields[alpha]);
			newDataset.addColumn(fields[alpha]);
		}
	} else {
		newDataset.addColumn("EMBARCACAO");
		newDataset.addColumn("IDPRD");
		newDataset.addColumn("CODIGOPRD");
		newDataset.addColumn("DESCRICAO");
		newDataset.addColumn("UNIDADE_MEDIDA");
		newDataset.addColumn("QUANTIDADE_MINIMA");
		newDataset.addColumn("QUANTIDADE_ESTOQUE");
		newDataset.addColumn("ATIVO");
		
	}
	
	var opcao = "";
	var embarcacao = "";
	var codigoPrd = "";
	var idPrd = "";
	var descricao = "";
	var unidade_medida = "";
	var quantidade_minima = "";
	var quantidade_estoque = "";
	var ativo = "";
	
	
	for (var i in constraints){
		
		if (constraints[i].getFieldName().toString() == 'OPCAO')
			opcao = constraints[i].initialValue;
		
		if (constraints[i].getFieldName().toString() == 'EMBARCACAO')
			embarcacao = constraints[i].initialValue
			
		if (constraints[i].getFieldName().toString() == 'IDPRD')
			idPrd = constraints[i].initialValue;
		
		if (constraints[i].getFieldName().toString() == 'CODIGOPRD')
			codigoPrd = constraints[i].initialValue;
		
		if (constraints[i].getFieldName().toString() == 'DESCRICAO')
			descricao = constraints[i].initialValue;
		
		if (constraints[i].getFieldName().toString() == 'UNIDADE_MEDIDA')
			unidade_medida = constraints[i].initialValue;
		
		if (constraints[i].getFieldName().toString() == 'QUANTIDADE_MINIMA')
			quantidade_minima = constraints[i].initialValue;

		if (constraints[i].getFieldName().toString() == 'QUANTIDADE_ESTOQUE')
			quantidade_estoque = constraints[i].initialValue;

		if (constraints[i].getFieldName().toString() == 'ATIVO')
			ativo = constraints[i].initialValue;
	
		log.info("DS_Exemplo.js - CONSTRAINTS " + constraints[i].getFieldName().toString().toUpperCase() + ": " + 
				constraints[i].initialValue + " - " + constraints[i].finalValue);
	}
	
	var mensagemErro = "";
	
	if (opcao == "") {
		
		opcao = "CONSULTAR";
	
	} else if (opcao == "CRIAR" || opcao == "EDITAR" || opcao == "REMOVER") {
		
		if (embarcacao == "") {
			mensagemErro = "OPCAO = " + opcao + " E EMBARCACAO EM BRANCO!";
		} 
		
		if (opcao != "REMOVER") {
			log.info(opcao);
			if (codigoPrd == "") {
				mensagemErro = "OPCAO = " + opcao + " E CODIGOPRD EM BRANCO!";
			} else if (descricao == "") {
				mensagemErro = "OPCAO = " + opcao + " E DESCRICAO EM BRANCO!";
			} else if (unidade_medida == "") {
				mensagemErro = "OPCAO = " + opcao + " E UNIDADE_MEDIDA EM BRANCO!";
		
			}
	  
		}
	}

	if (mensagemErro != "") {
		log.info(opcao);
		log.info("DS_Exemplo.js - ERRO 2: " + mensagemErro);
		newDataset = DatasetBuilder.newDataset();
		newDataset.addColumn("ERRO");
		newDataset.addRow(new Array(mensagemErro));
		if (connectionWD != null) {
        	connectionWD.close();
        }
		return newDataset;
	}
	
	var SQL = "";
	
	if (opcao == "CRIAR") {
		
		SQL = "INSERT INTO EXEMPLO " + 
		"(EMBARCACAO ,IDPRD, CODIGOPRD, DESCRICAO, UNIDADE_MEDIDA, QUANTIDADE_ESTOQUE, QUANTIDADE_MINIMA, ATIVO) " + 
		"VALUES ('"+ embarcacao + "','" + idPrd + "','" + codigoPrd + "','" + descricao + "','" + unidade_medida + "','" + quantidade_estoque + "','" + quantidade_minima + "','" + ativo + "')";
		
	}
	
	else if (opcao == "CONSULTAR") {
		
		SQL += "SELECT ";
		
		if ((embarcacao == null || embarcacao == "") && 
			(codigoPrd == null || codigoPrd == "") && 
			(descricao == null || descricao == "")) {
			SQL += "TOP 2000 ";
		}
		log.info("chegou");
		var flagField = "";
		
		if (fields != null && fields.length > 0) {
			for (var alpha in fields) {
				SQL += flagField + " " + fields[alpha] + " ";
				flagField = ",";
			}
		} else {
			SQL += " EMBARCACAO, IDPRD, CODIGOPRD, DESCRICAO, UNIDADE_MEDIDA, QUANTIDADE_ESTOQUE, QUANTIDADE_MINIMA, ATIVO ";
		}
		
		SQL += "FROM EXEMPLO ";
		
		var flagSQL = "WHERE";
		
		if (embarcacao != null && embarcacao != "") {
			SQL += flagSQL + " EMBARCACAO = '%" + embarcacao + "%' ";
			flagSQL = "AND";
		}
		
		if (idPrd != null && idPrd != "") {
			SQL += flagSQL + " IDPRD LIKE '%" + idPrd + "%' ";
			flagSQL = "AND";
		}
		if (codigoPrd != null && codigoPrd != "") {
			SQL += flagSQL + " CODIGOPRD LIKE '%" + codigoPrd + "%' ";
			flagSQL = "AND";
		}
		
		if (descricao != null && descricao != "") {
			SQL += flagSQL + " DESCRICAO LIKE '%" + descricao + "%' ";
			flagSQL = "AND";
		}
		
		if (unidade_medida != null && unidade_medida != "") {
			SQL += flagSQL + " UNIDADE_MEDIDA = " + unidade_medida + " ";
			flagSQL = "AND";
		}
		if (quantidade_estoque != null && quantidade_estoque != "") {
			SQL += flagSQL + " QUANTIDADE_ESTOQUE = " + quantidade_estoque + " ";
			flagSQL = "AND";
		}
		if (quantidade_minima != null && quantidade_minima != "") {
			SQL += flagSQL + " QUANTIDADE_MINIMA = " + quantidade_minima + " ";
			flagSQL = "AND";
		}
		if (ativo != null && ativo != "") {
			SQL += flagSQL + " ATIVO = " + ativo + " ";
			flagSQL = "AND";
		}
	
				
		SQL += "ORDER BY CODIGOPRD";
		
	} else if (opcao == "EDITAR") {
		
		SQL = "UPDATE EXEMPLO SET " +
				"EMBARCACAO = \'" + embarcacao + "\'," +
				"IDPRD = '" + idPrd + "'," +
				"CODIGOPRD = '" + codigoPrd + "\'," +
				"DESCRICAO = \'" + descricao + "\'," +
				"UNIDADE_MEDIDA = '" + unidade_medida + "'," +
				"QUANTIDADE_ESTOQUE = '" + quantidade_estoque + "',"+
				"QUANTIDADE_MINIMA = '" + quantidade_minima + "',"+
				"ATIVO = \'" + ativo + "' "+
				
				"WHERE IDPRD = " + idPrd + " AND" +" EMBARCACAO = \'" + embarcacao +"\'" ;
		
	} else if (opcao == "FAIXA") {
		
		SQL += "SELECT ";
		
		var flagField = "";
		
		if (fields != null && fields.length > 0) {
			for (var alpha in fields) {
				SQL += flagField + " " + fields[alpha] + " ";
				flagField = ",";
			}
		} else {
			SQL += "EMBARCACAO, IDPRD, CODIGOPRD, DESCRICAO, UNIDADE_MEDIDA, QUANTIDADE_ESTOQUE, QUANTIDADE_MINIMA, ATIVO ";
		}
		
		SQL += "FROM EXEMPLO ";
		
		var flagSQL = "WHERE";
		
		if (codigoPrd != null && codigoPrd != "") {
			SQL += flagSQL + " IDPRD > '" + embarcacao + "' ";
			flagSQL = "AND";
		}
		
		SQL += "ORDER BY EMBARCACAO";
		
	} else if (opcao == "REMOVER") {
		
		SQL = "DELETE FROM EXEMPLO WHERE EMBARCACAO = " + embarcacao;
		
	} 
	
	log.info("DS_Exemplo.js - SQL: " + SQL);
	
	try {
		
		var statementWD = connectionWD.prepareStatement(SQL);
		var rsWD = null;
		
		if (opcao == "CONSULTAR" || opcao == "ULTIMO" || opcao == "FAIXA") {
			
			rsWD = statementWD.executeQuery();
			
			while(rsWD.next()) {
				
				var arrayRetorno = new Array();
				
				if (fields != null && fields.length > 0) {
					for (var alpha in fields) {
						arrayRetorno.push(rsWD.getString(fields[alpha]).toUpperCase());
					}
				} else {
					arrayRetorno.push(rsWD.getString("EMBARCACAO").toUpperCase());
					arrayRetorno.push(rsWD.getString("IDPRD").toUpperCase());
					arrayRetorno.push(rsWD.getString("CODIGOPRD").toUpperCase());
					arrayRetorno.push(rsWD.getString("DESCRICAO").toUpperCase());
					arrayRetorno.push(rsWD.getString("UNIDADE_MEDIDA").toUpperCase());
					arrayRetorno.push(rsWD.getString("QUANTIDADE_MINIMA").toUpperCase());
					arrayRetorno.push(rsWD.getString("QUANTIDADE_ESTOQUE").toUpperCase());					
					arrayRetorno.push(rsWD.getString("ATIVO").toUpperCase());
					
				}
				
				newDataset.addRow(arrayRetorno);
			}
			
			if (rsWD != null) {
				rsWD.close();
			}
		} else {
			
			 rsWD = statementWD.executeUpdate();
			
			var arrayRetorno = new Array();
			arrayRetorno.push("COMANDO EXECUTADO COM SUCESSO!");
			newDataset.addRow(arrayRetorno);
		}
	} catch (e) {
		log.info("DS_Exemplo.js - ERRO 3: " + e.message + "(#" + e.lineNumber + ")");
	} finally {
        if (statementWD != null) {
        	statementWD.close();
        }
        if (connectionWD != null) {
        	connectionWD.close();
        }
	}
	
	log.info("DS_Exemplo.js - FIM");
   
	return newDataset;
	
}
