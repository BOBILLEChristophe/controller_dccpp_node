//   Controller DCC++ permet de commander de logiciel DCC++ BASE STATION de Gregg E. Berman COPYRIGHT (c) 2013-2016

//   (©) 2016-2018 - Christophe BOBILLE
//   Ce programme est un logiciel libre ; vous pouvez le redistribuer et/ou le modifier
//	 au titre des clauses de la Licence Publique Générale GNU, telle que publiée
//   par la Free Software Foundation ; soit la version 3 de la Licence, 
//   ou (à votre discrétion) une version ultérieure quelconque.

//   Ce programme est distribué dans l'espoir qu'il sera utile,
//   mais SANS AUCUNE GARANTIE ; sans même une garantie implicite de
//   COMMERCIABILITE ou DE CONFORMITE A UNE UTILISATION PARTICULIERE.
//   Voir la Licence Publique Générale GNU pour plus de détails.
//   Vous devriez avoir reçu un exemplaire de la Licence Publique Générale
//   GNU avec ce programme ; si ce n'est pas le cas, voyez http://www.gnu.org/licenses


//   This program is free software: you can redistribute it and/or modify
//   it under the terms of the GNU General Public License as published by
//   the Free Software Foundation, either version 3 of the License, or
//   (at your option) any later version.

//   This program is distributed in the hope that it will be useful,
//   but WITHOUT ANY WARRANTY; without even the implied warranty of
//   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//   GNU General Public License for more details.

//   You should have received a copy of the GNU General Public License
//   along with this program.  If not, see http://www.gnu.org/licenses
//   GNU General Public License:  http://opensource.org/licenses/GPL-3.0



//********* Controller DCC++
//***** v 2.2 			- le 06/09/2016 à 19:03:00
//***** v 2.3 			- le 27/12/2016 à 09:38:00
//***** v 2.4 (release) - le 29/01/2017 à 01:23:00
//***** v 2.5 (release) - le 29/01/2017 à 09:15:00
//***** v 2.6 (release) - le 29/01/2017 à 13:56:00
// 				1° - Ajout d'une fenêtre de confirmation pour annuler la lecture de CV's en cas de problème.
//     			Message reçu de DCC++ Base Station de type "<r123|123|1 -1>" avec -1 en fin.
// 				2° - Arret de la loco si tentative de modifier la CV 1 (adresse) sur la voie principale alors
//      		que la vitesse est > 0.
//***** v 2.7 (release) - le 30/01/2017 à 12:29:00
// 				1° - Ajout de fonctionnalités concernant la gestion des CV's comme l'ajout automatique des noms et labels
// 				2° - Ajout du n° de version en haut de page
// 				3° - Ajout d'une zone rétractable de paramètrage en haut de page
// 				4° - Ajout d'options dans cette zone
//      			* Selection de l'adresse IP de l'Arduino supportant DCC++ Base Station par menu déroulant.
// 					* Choix du nombre de CV's à lire par menu déroulant.
//					* Ajout de plusieurs fonctions liées aux sauvegardes
// 				5° La zone "Noms pour les fonctions :" dans les paramètrages de foncions à été rendue rétractable
//***** v 2.8 (release) - le 02/02/2017 à 19:52:00
//				Ajout de "dccpp" dans les URL's des requêtes destinées à DCC++ Base Station pour être compatible
//***** v 2.8.1 (release) - le 04/02/2017 à 21:23:00
// 				Ajout d'un objet manufacturers contenant les informations relatives au fabricants de décodeurs
//				Ajout d'un objet cvLabels contenant les informations relatives aux labels des CV's
//				********  ATTENTION ******** Le fichier "data.json" a été renommé "locos.json"
//				et se touve maintenant placés dans le répertoire "config".
//***** v 2.8.2 à 2.8.5 (release) - le 21/02/2017 à 08:47:00
//				Nombreuses évolutions liées à la lecture des cv's et à leur programmation
//***** v 3.0 R1 BETA - le 22/02/2017 à 18:21:00 Version on-line démo
//***** v 3.0.1 R1 BETA - le 02/11/2017 à 10:02:00 Version desktop et serveur full
//***** v 4.0 R5 BETA (Version pour Node.js) - le 07/11/2017 à 08:10:00
//
//		Cette version permet de communiquer par TCP avec DCC++ via un serveur Node.js
//      Elle permet de piloter la carte Arduino (DCC++ BaseStation) via le port série ou ethernet.
//		Dans le première cas, les fonctions de lecture de CV's ne sont pas disponibles.
//      Configuration requise :
//      -  NodeJs : dccpp_node.js
//      -  Liaison série USB : Arduino Uno ou Mega
//      -  Liaison ethernet : Arduino Mega + shield ethernet
//      -  DCC++ BaseStation version originale DCCpp_Uno : https://github.com/DccPlusPlus/BaseStation
//		-  Arduino Motor Shield ou Pololu Dual MC33926 Motor Shield
//
//      Documentation DCC++ : https://github.com/DccPlusPlus/BaseStation/wiki/Getting-Started-With-DCC---Hardware
//
//***** v 4.1 (release) (Version pour Node.js) - le 22/11/2017 à 17:31:00
//      		Correction de bugs
//      		Ajout du Full Screen
//      		Version sm pour tablettes et smartphones
//      		Sauvegarde de paramétres sur disque via Node.js
//
//***** v 4.2 (release) (Version pour Node.js) - le 27/11/2017 à 19:32:00
//      		Correction de bugs sur serialPort
//      		Améliorations sur la version smartphone
//      		Affichage d'informations supplémentaires dans le terminal
//			
//*************************************************************************************************************************** 			




var trainsApp = angular.module('trainsApp', []);
trainsApp.controller('pilotLocosCtrl', function ($scope, $http, $filter, $timeout, $rootScope, $window, $q) {


	//*******************************************************************************************//
	//*********** Déclaration et initialisation de variables globales et parametrages ***********//
	//*******************************************************************************************//


	// Num version
	$scope.numVersion = "4.2";
	// Url du serveur NodeJs
	$scope.socket = io.connect('http://192.168.1.101:8080/');
	// Création de l'objet locomotives qui est vide pour l'instant
	$scope.locomotives = null;
	// Création de l'objet locoSelectionnee qui est vide pour l'instant
	$scope.locoSelectionnee = null;
	// Création de l'objet manufacturers qui est vide pour l'instant
	$scope.manufacturers = null;
	// Création de l'objet cvLabels qui est vide pour l'instant
	$scope.cvLabels = null;
	// Création de l'objet param qui est vide pour l'instant
	$scope.param = null;
	// Valeurs par défaut de l'adresse (cv 1)
	$scope.numNewAdress = 3;
	// Initialisation de la variable keyOfLastId (dernière Id attribuée )
	$scope.keyOfLastId = 0;
	// Etat de l'alimentation du réseau
	$scope.powerStatus = false;


	// Initialisation des fenêtres
	$scope.showLocomotives = true;
	$scope.showLocosIcons = true;
	$scope.showLocosListe = false;
	$scope.showLocoSelectionnee = false;
	$scope.showParametrages = false;

	// ********* Paramètres par défaut *********************************************************************//
	
	
	// Path des fichiers de config
	$scope.tab_pathConfigFiles = ['config/locos.json', 
									'config/manufacturers.json', 
									'config/cvLabels.json', 
									'config/param.json'
								];						


	//*******************************************************************************************//
	//************************************** Ecouteurs ******************************************//
	//*******************************************************************************************//


	document.getElementById('btn_power').addEventListener('click', function() {
	    $scope.$apply(function() {
	    	$scope.power();
	    });
	});

	document.getElementById('btn_fullScreen').addEventListener('click', function() {
	    $scope.$apply(function() {
	    	var el = document.documentElement,
		      rfs = el.requestFullscreen
		        || el.webkitRequestFullScreen
		        || el.mozRequestFullScreen
		        || el.msRequestFullscreen 
		    ;
		    rfs.call(el);
	    });
	});

	document.getElementById('btn_eStop').addEventListener('click', function() {
	    $scope.$apply(function() {
	    	$scope.eStop();
	    });
	});

	document.getElementById('btn_readCv').addEventListener('click', function() {
	    $scope.$apply(function() {
	    	$scope.readCv($scope.scanCvStart, $scope.scanCvEnd);
	    });
	});

	document.getElementById('btn_localStorageActive').addEventListener('click', function() {
	    $scope.$apply(function() {
	    	$scope.param.localStorageActive = !$scope.param.localStorageActive;
	    });
	});

	document.getElementById('input_cvVolSon').addEventListener('change', function() {
	    $scope.$apply(function() {
	    	let cv = $scope.locoSelectionnee.cvVolSon;
	    	if(cv != undefined && cv > 46) {
		    	function trouveCv(objLoco) {
					return objLoco.key == $scope.locoSelectionnee.cvVolSon;
				}
				var obj = null;
				obj = $scope.locoSelectionnee.cv.find(trouveCv);

				if(obj === undefined) { 
					if(confirm("La CV "+cv+" n'existe pas, voulez-vous la créer ?")) {
						let end = $scope.locomotives.length
						for (let i = 0; i < end; i++) {
							//let test = $scope.locomotives[i].id;
							//if(test == $scope.locoSelectionnee.id) {
							if($scope.locomotives[i].id == $scope.locoSelectionnee.id) {
								$scope.createCv(i, cv, cv);
								i = end;
								$scope.locoSelectionnee.volumeSon = 0;
							}
						}
					}
				}
				if($scope.locoSelectionnee.cv[cv]['label'] == "")
					$scope.locoSelectionnee.cv[cv]['label'] ="Volume son général";
	    	}
	    	else
	    		alert("Valeur de CV invalide.");
	    });
	});


	document.getElementById('slider_volumeSon').addEventListener('change', function() {
	    $scope.$apply(function() {
	     	$scope.setVolumeSon();
	    });
	});


	document.getElementById('btn_setOtherParam').addEventListener('click', function() {
	    $scope.$apply(function() {
	     	$scope.setOtherParam($scope.cvOtherParam, $scope.labelOtherParam, $scope.valueOtherParam);
	    });
	});


	
	for (let i = 0; i < 6; i++) {
		document.getElementById('cv29bit'+i).addEventListener('change', function() {
		    $scope.$apply(function() {
		    	$scope.setCv29();
		    });
		});
	}


	document.getElementById('input_newLongAddress').addEventListener('change', function() {
	    $scope.$apply(function() {
	     	$scope.newLongAddress();
	    });
	});

	document.getElementById('addLoco').addEventListener('click', function() {
	    $scope.$apply(function() {
	     	$scope.addLoco();
	    });
	});
	
	document.getElementById('ipNodeJs').addEventListener('change', function() {
	    $scope.$apply(function() {
	     	$scope.newIpNodeJs();
	    });
	});



	//*******************************************************************************************//
	//******************************** Affichage de l'heure *************************************//
	//*******************************************************************************************//


	// $scope.setInterval(function () {
 //    	document.getElementById('clock').value = new Date();
	// }, 1000);
	

	

	//*******************************************************************************************//
	//*************************** Selection locos et affichage locos ****************************//
	//*******************************************************************************************//


	// La méthode "selectionLoco" affecte à l'objet "locoSelectionnee" les informations de la locomotive sélectionnée
	$scope.selectionLoco = function (loco) { 
		$scope.locoSelectionnee = loco;
		$scope.showLocoSelectionnee = true;
		$scope.showParametrages = true;
	}


	// La méthode showLocos permet de choisir le mode d'affichage des locos
	$scope.showLocos = function(origin) {
		if(origin == "icons") {
			if($scope.showLocosListe) {
				$scope.showLocosIcons = true;
				$scope.showLocosListe = false;
			}
		}
		else {
			if($scope.showLocosIcons) {
				$scope.showLocosIcons = false;
				$scope.showLocosListe = true;
			}
		}
	}



	//*******************************************************************************************//
	//******************************** Pilotage des locos ***************************************//
	//*******************************************************************************************//


	// Fonctions traction
	$scope.setTraction = function() {
		var data = "t ";
		data += $scope.locoSelectionnee.id;
		data += " ";
		data += $scope.locoSelectionnee.address;
		data += " ";
		data += $scope.locoSelectionnee.vitesse;
		data += " ";
		data += $scope.locoSelectionnee.sens;
		$scope.setParamLocos(data);
	}
	
	// Bouton arret
	$scope.stopLoco = function () {
		$scope.locoSelectionnee.vitesse = 0;
		$scope.setTraction();
		$("#speedSlider").focus();
	}
	
	// Bouton marche AR
	$scope.goAr = function () {
		if($scope.locoSelectionnee.sens == 1) {
			$scope.locoSelectionnee.sens = 0;
			$scope.setTraction();
			$("#speedSlider").focus();
		}
	}
	
	// Bouton marche AV
	$scope.goAv = function () {
		if($scope.locoSelectionnee.sens == 0) {
			$scope.locoSelectionnee.sens = 1;
			$scope.setTraction();
			$("#speedSlider").focus();
		}
	}




	//*******************************************************************************************//
	//******************* Activation ou désactivation des fonctions *****************************//
	//*******************************************************************************************//


	$scope.setFn = function (n) { // OPERATE ENGINE DECODER FUNCTIONS F0-F28
		var res = 0;
		var arg = 0;
		var data = "f"; // <f CAB BYTE1 [BYTE2]>
		data += " ";
		data += $scope.locoSelectionnee.address;
		data += " ";

		for( var i = 0; i < arguments.length; i++) {
			$scope.locoSelectionnee.fn[arguments[i]] = $scope.locoSelectionnee.btn_fn[arguments[i]] ? Math.pow(2, i) : 0;
			res += $scope.locoSelectionnee.fn[arguments[i]];
		}
		switch (n) {
			case 0:
				data += 128 + res;
				break;
			case 5:
				data += 176 + res;
				break;
			case 9:
				data += 160 + res;
				break;
			case 13:
				data += 222;
				data += " ";
				data += res;
				break;
			case 21:
				data += 223;
				data += " ";
				data += res;
				break;
		}
		$scope.setParamLocos(data);
	}




	//*******************************************************************************************//
	//******************* Création et suppression de locos *****************************//
	//*******************************************************************************************//

	// Création d'une nouvelle loco
	$scope.nouvelleLoco = null; 
	$scope.addLoco = function(x) {
		return $q(function() {
			if(x == undefined)
				x = 3;
			$scope.keyOfLastId++;
			var newId = $scope.keyOfLastId;
			$scope.nouvelleLoco = {
				id: newId,
				address: x,
				nomCourt: "Nouvelle loco",
				nomLong: "",
				urlImg: "",
				vitesse:0,
				cvVolSon:0,
				volumeSon:0,
				cv29bit:[],
				cv29bit5:0,
				newCV17val:0,
				newCV18val:0,
				newLongAddressVal:0,
				sens:1,
				fn:[],
				btn_fn:[],
				btn_fn_label:["","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
				"fn0to4": 0,
	  			"fn5to8": 0,
				"fn9to12": 0,
				"fn13to20": 0,
				"fn21to28": 0,
				cv:[
					{"key":0,"name":"","label":"","value": 0,"valHex":"","valBin":""},
					{"key":1,"name":"Adresse","label":"Adresse","value": x, "valHex":"", "valBin":""}
				]
			}
			$scope.locomotives.push($scope.nouvelleLoco);
			$scope.createCv($scope.locomotives.length-1, 0, 511);
			$scope.showLocosIcons = false;
			$scope.showLocosListe = true;
		});
	}


	// Supprimer une loco
	$scope.deleteLoco = function(obj, loco) {
		$scope.selectionLoco(obj);
		if(confirm("Voulez-vous supprimer la loco : \"" + loco +"\" ?")) {
				$scope.locomotives.splice($scope.locomotives.indexOf(obj), 1);
				$scope.locoSelectionnee = null;
		}
	}


	//*******************************************************************************************//
	//********************************************* CV's ****************************************//
	//*******************************************************************************************//

	$scope.parseCv = function (response) {

		var indexTabLocos = null;
		let temp = response.substring(10);
		temp = temp.substr(0, temp.length - 1);
		let spaceIndex = temp.indexOf(" ");
		let cv = Number(temp.substring(0, spaceIndex));
		let value = Number(temp.substring(spaceIndex+1));
		if(value < 0) {// La valeur renvoyée est négative, problème de lecture
			$scope.afficheReponse("Lecture cv "+cv+" erronée !");
			return;
		}
		else {
			if(cv === 1) 
				cv1 = value;

			function trouveCv(objLoco) {
				return objLoco.cv[1].value == cv1;
			}
				// Création d'un objet vide
			var obj = null;
			// Chercher dans obj locomotives si la CV existe
			obj = $scope.locomotives.find(trouveCv);
			if(obj === undefined || obj === null) {
				var promise = $scope.addLoco(cv1); // Création de la loco
				obj = $scope.locomotives.find(trouveCv);
			}
				
			obj.cv[cv].value = value;
			obj.cv[cv].valHex = $scope.convertHex(value);;
			obj.cv[cv].valBin = $scope.convertBin(value);

			if(obj.cv[cv]['label'] == "") {
				if($scope.cvLabels[cv] != undefined)
					obj.cv[cv]['label'] = $scope.cvLabels[cv]["label"];
			}

			switch(cv) {
				case 8:
					obj.cv[8]['label'] = "Manufacturer ID : "+$scope.getManufacturers(value);	
				break;
				case 17:
					obj.newCV17val = obj.cv[17].value;
				break;
				case 18:
					obj.newCV18val = obj.cv[18].value;
				break;
				case 29:
					obj.newLongAddressVal = 0;
					for(let i = 0; i < 8; i++) {
						if(obj.cv[29].valBin.substring(i,i+1) == 1)
							obj.cv29bit[7-i] = true;
						else
							obj.cv29bit[7-i] = false;
					}
					if(obj.cv29bit[5] == true) {
						obj.address = ((obj.cv[17].value - 192) * 256) + obj.cv[18].value;
						obj.newLongAddressVal = obj.address;
					}
				break;
			}// End switch	
		}
	}


	var cv1 = 0;
	$scope.readCv = function(start, end) {
		if(start > 0 && end >= start) {
			if($scope.powerStatus === true) {
				// On lit en premier les cv's 1, 17, 18, et 29 pour savoir s'il s'agit d'une adresse
				// courte ou longue et connaitre la valeur de l'adresse
				$scope.sendReq('<R 1 123 123>');
				$scope.sendReq('<R 17 123 123>');
				$scope.sendReq('<R 18 123 123>');
				$scope.sendReq('<R 29 123 123>');
				
				if (start == 1) // La cv 1 a déjà été scanée
					start = 2;

				for (let i = start; i <= end; i++) {
					var data = 	"<R "+i+" 123 123>";
					$scope.sendReq(data);
					//$timeout($scope.sendReq(data), 2000);
				} // End for
			}
			else
				$scope.afficheReponse("Alimentation coupée !");	
			//End if($scope.powerStatus === true)
		}
		else
			$scope.afficheReponse("cv's non renseignées !");
		// End if(start > 0 && end > 0) 
	}


	
	// Recherche du constructeur du décodeur pour MAJ CV 8
	$scope.getManufacturers = function (x) {	

		function searchManufacturer(manufacturerId) {
			return manufacturerId.id == x;
		}
		// création d'un objet vide
		var obj = null;
		// chercher dans obj si la key existe
		obj = $scope.manufacturers.find(searchManufacturer);
		if(obj === undefined) return "";
		else return obj.manufacturer;

	}


	$scope.createCv = function(x, start, end) {
		// Création des CVs qui n'existent pas pour chaque loco
		for( let i = start; i <= end; i++ ) {
			function trouveCv(objLoco) {
				return objLoco.key == i;
			}
			// Création d'un objet vide
			var obj = null;
			// Chercher dans obj locomotives si la CV existe
			obj = $scope.locomotives[x].cv.find(trouveCv);
			if(obj === undefined) {  // La CV n'existe pas
				$scope.newCv = {
					key: i,
					name: "",
					label: "",
					value: 0,
					valHex: "",
					valBin: ""
				}
				$scope.locomotives[x].cv.push($scope.newCv);
			} // -> if
		}
	}




	//*******************************************************************************************//
	//***************************** Modification des CV's ***************************************//
	//*******************************************************************************************//



	// Fonctions param CV's
	$scope.setCv = function(cv, value) {
		switch ($scope.param.cvPgmType) {
			case "main": // WRITE CONFIGURATION VARIABLE BYTE TO ENGINE DECODER ON MAIN OPERATIONS TRACK
			//<w CAB CV VALUE>
				// Mettre la loco à l'arrêt si ça n'est pas le cas pour réglage CV adresse
				if($scope.locoSelectionnee.vitesse > 0 &&  cv == 1)
					$scope.locoSelectionnee.vitesse = -1;
				var data = "w";
				data += " ";
				data += $scope.locoSelectionnee.address;
				data += " ";
				data += cv;
				data += " ";
				data += value;
				break;
			case "prog": // WRITE CONFIGURATION VARIABLE BYTE TO ENGINE DECODER ON PROGRAMMING TRACK 
			//<W CV VALUE CALLBACKNUM CALLBACKSUB>
				var data = "W";
				data += " ";
				data += cv;
				data += " ";
				data += value;
				data += " ";
				data += "123";
				data += " ";
				data += "123";
				break;
		}
		$scope.setParamLocos(data);
	}


		// Changement d'adresse
	$scope.setNewAdressCourte = function() {
		$scope.setCv(1, $scope.numNewAdress);
		$scope.locoSelectionnee.address = $scope.numNewAdress;
		
		$scope.locoSelectionnee.cv[1]['value'] = $scope.numNewAdress;
		$scope.locoSelectionnee.cv[1]['valHex'] = $scope.convertHex($scope.numNewAdress);
		$scope.locoSelectionnee.cv[1]['valBin'] = $scope.convertBin($scope.numNewAdress);
		if($scope.locoSelectionnee.cv[1].label == "")
			$scope.locoSelectionnee.cv[1].label = "Adresse";

		// Désactiver adresse longue dans CV 29
		$scope.locoSelectionnee.cv29bit[5] = false;
		$scope.setCv29();
		$scope.cvOtherParam = 0;
		$scope.labelOtherParam = "";
		$scope.valueOtherParam = 0;
	}


	// Volume son	
	$scope.setVolumeSon = function() {
		let cvNum = $scope.locoSelectionnee.cvVolSon;
		let value = $scope.locoSelectionnee.volumeSon;
		$scope.setCv(cvNum, value);
		$scope.locoSelectionnee.cv[cvNum]['value'] = value;
		$scope.locoSelectionnee.cv[cvNum]['valHex'] = $scope.convertHex(value);
		$scope.locoSelectionnee.cv[cvNum]['valBin'] = $scope.convertBin(value);
		if($scope.locoSelectionnee.cv[cvNum]['label'] == "")
			$scope.locoSelectionnee.cv[cvNum]['label'] ="Volume son général";
		$scope.cvOtherParam = 0;
		$scope.labelOtherParam = "";
		$scope.valueOtherParam = 0;
	}	
		

	// Envoi aux locos de toutes les autres modifications sur les cv	
	$scope.setOtherParam = function(cv, newLabel, newValue) {
		$scope.setCv(cv, newValue);
		if(cv == 8 &&  newValue == 8) {
			$scope.locoSelectionnee.cv[1].value = 3;
			$scope.locoSelectionnee.address = 3;
			$scope.locoSelectionnee.cv29bit[5] = false;
		}
		if(cv == $scope.locoSelectionnee.cvVolSon )
			$scope.locoSelectionnee.volumeSon = newValue;
		
		$scope.locoSelectionnee.cv[cv]['label'] = newLabel;
		$scope.locoSelectionnee.cv[cv]['value'] = newValue;
		$scope.locoSelectionnee.cv[cv]['valHex'] = $scope.convertHex(newValue);
		$scope.locoSelectionnee.cv[cv]['valBin'] = $scope.convertBin(newValue);

		$scope.cvOtherParam = "";
		$scope.labelOtherParam = "";
		$scope.valueOtherParam = "";
	}
	
	
	// methode de recherche pour "modif OtherParam"
	$scope.searchInfosCv = function (cvOtherParam) {

		function searchCv(element, index, array) {
			if (element.key == $scope.cvOtherParam)
				return "ok";
		}

		var indexOfCv = $scope.locoSelectionnee.cv.findIndex(searchCv);  
		if ( indexOfCv > -1) {
			$scope.labelOtherParam = $scope.locoSelectionnee.cv[indexOfCv].label;
			if($scope.labelOtherParam == "" )
				$scope.labelOtherParam = $scope.cvLabels[indexOfCv]["label"];
			$scope.valueOtherParam = Number($scope.locoSelectionnee.cv[indexOfCv].value);
		}
		else {
			$scope.labelOtherParam = "( Créez ce paramètre - Entrez un libellé et une valeur)";
			$scope.valueOtherParam = "";
		}
	}


	// Long address
	$scope.newLongAddress = function () {
		let longAddress = Number($scope.locoSelectionnee.newLongAddressVal);
		let cv17 = Number($scope.locoSelectionnee.newCV17val);
		let cv18 = Number($scope.locoSelectionnee.newCV18val);

		let quotien = Math.floor(longAddress / 256);
		cv17 = Number(192 + quotien);
		cv18 = Number(longAddress % 256);

		$scope.locoSelectionnee.newCV17val = cv17;
		$scope.locoSelectionnee.newCV18val = cv18;
	}


	$scope.setNewLongAddress = function() {
		$scope.locoSelectionnee.cv[17]['value'] = $scope.locoSelectionnee.newCV17val;
		$scope.locoSelectionnee.cv[18]['value'] = $scope.locoSelectionnee.newCV18val;
		$scope.locoSelectionnee.cv[17]['valHex'] = $scope.convertHex($scope.locoSelectionnee.newCV17val);
		$scope.locoSelectionnee.cv[18]['valHex'] = $scope.convertHex($scope.locoSelectionnee.newCV18val);
		$scope.locoSelectionnee.cv[17]['valBin'] = $scope.convertBin($scope.locoSelectionnee.newCV17val);
		$scope.locoSelectionnee.cv[18]['valBin'] = $scope.convertBin($scope.locoSelectionnee.newCV18val);
		$scope.locoSelectionnee.cv29bit[5] = true;
		$scope.setCv(17, $scope.locoSelectionnee.newCV17val);
		$scope.setCv(18, $scope.locoSelectionnee.newCV18val); 
		$scope.setCv29();
	}


	// CV 29
	$scope.setCv29 = function () {
		$scope.param.cvPgmType = "prog";
		$scope.locoSelectionnee.cv[29]['value'] = 0;
		for(let i = 0; i < 6; i++)
			$scope.locoSelectionnee.cv[29]['value'] += $scope.locoSelectionnee.cv29bit[i] ? Math.pow(2, i) : 0;
		
		$scope.locoSelectionnee.cv[29]['valHex'] = $scope.convertHex($scope.locoSelectionnee.cv[29]['value']);
		$scope.locoSelectionnee.cv[29]['valBin'] = $scope.convertBin($scope.locoSelectionnee.cv[29]['value']);

		if($scope.locoSelectionnee.cv29bit[5] && $scope.locoSelectionnee.newLongAddressVal != "")
			$scope.locoSelectionnee.address = $scope.locoSelectionnee.newLongAddressVal;
		else
			$scope.locoSelectionnee.address = $scope.locoSelectionnee.cv[1]['value'];

		$scope.setCv(29, $scope.locoSelectionnee.cv[29]['value']);
	}



	// Conversion en Hexadécimal
	$scope.convertHex = function(val) {
		val = Number(val);
		let hex = val.toString(16);
		if(hex.length == 1) { hex = "0x0"+hex }
		else { hex = "0x"+hex }
		return hex;
	}

	// Conversion en Binaire
	$scope.convertBin = function(val) {
		val = Number(val);
		let bin = val.toString(2);
		for( let i = bin.length; i < 8; i++)
			bin = "0" + bin;
		return bin;
	}
		



	//*******************************************************************************************//
	//****************************** Requêtes httpReq et sockets ********************************//
	//*******************************************************************************************//


	//Préparation de la requette
	$scope.setParamLocos = function(data) {
		data = 	"<"
				+data
				+">";
		$scope.sendReq(data); //... et on appele la fonction qui va envoyer l'information à DCC++	
	}

	// Affichage de la réponse pour les requettes http
	$scope.afficheReponse = function (response) {
		$scope.responseServer = response;
		if(null != $scope.param) {
			$timeout($scope.clearAfficheResponse, $scope.param.responseDislayTimeout);   // ... pendant x secondes
		}
		else {
			$timeout($scope.clearAfficheResponse, 3000);
		}
	}


	// Affichage de la réponse pour les requettes Node.js
	$scope.afficheReponseServ = function (response) {

		if(response.indexOf("<r123|123|") === 0)
			$scope.parseCv(response);
		else
			$scope.parseMsg(response);

		$scope.$apply(function() {
			$scope.responseServer = response;
		});
		if(null != $scope.param) {
			$timeout($scope.clearAfficheResponse, $scope.param.responseDislayTimeout);   // ... pendant x secondes
		}
		else {
			$timeout($scope.clearAfficheResponse, 3000);
		}
	}

	$scope.parseMsg = function (response) {
		switch (response) {
			case "<p0>":
			$scope.powerStatus = false;
			break;
			case "<p1>":
			$scope.powerStatus = true;
			break;
		}
	}

	
	$scope.clearAfficheResponse = function () {
		$scope.responseServer = "";
	}


	//***************************** Requette http *************************************************//

	// $scope.httpReq = function (method, url, data) {
	//   return $q(function(resolve, reject) {
	// 			$http({
	// 			method: method,
	// 			url: url,
	// 			data: data,
	// 			headers: {'Content-Type': 'text/plain'}
	// 		  }).
	// 		  success(function(response) {
	// 		  	$scope.afficheReponse(response);
	// 		  	$scope.suitePgm = true;
	// 		  	resolve(response);
	// 		  }).
	// 		  error(function(data, status, headers, config) {
	// 		  	reject(data, status, headers, config)
	// 		  	$scope.afficheReponse("error");
	// 		  });
	//   });
	// }

	//***************************** Requette Node.js *************************************************//

	
	// Modification de l'IP du serveur Node, deconnexion puis reconnexion avec la nouvelle adresse
	$scope.newIpNodeJs = function (data) {
		$scope.socket = io.disconnect();
		$scope.socket = io.connect(param.ipNodeJs);
	}


	// Envoi de requette
	$scope.sendReq = function (data) {
		$scope.socket.emit('message', data);
	}

	//  Ecouteur pour la réponse
	$scope.socket.on('response', function (response) {
  		$scope.afficheReponseServ(response);
	});

	

	//*******************************************************************************************//
	//*************************************** eStop ********************************************//
	//*******************************************************************************************//


	// Arret immediat de la locomotive
	$scope.eStop = function() {
		if($scope.locoSelectionnee != null) {
			$scope.locoSelectionnee.vitesse = -1;
			$scope.setTraction ();
		}
	}


	//*******************************************************************************************//
	//******* Initialisation de certaines valeurs de l'objet "locomotives" au chargement ********//
	//*******************************************************************************************//


	$scope.initLoco = function() {
		for (var x in $scope.locomotives) {
			$scope.locomotives[x].vitesse = 0;
			$scope.locomotives[x].sens = 1;
			$scope.locomotives[x].id = Number(x)+1;
			$scope.createCv(x, 0, 511);
		}

		if (x > -1)
			$scope.keyOfLastId = $scope.locomotives[x].id;

		if(x > 11)
			alert("Le nombre de registres dans DCC++ est de 12 par défaut.\r\rPensez à modifier votre programme DCC++.");
	}
	
	

	//*******************************************************************************************//
	//************************* Mise sous tension ou coupure du réseau **************************//
	//*******************************************************************************************//


	// Methode pour mettre le réseau sous tension...
	$scope.power = function() {
		var tempValue = !$scope.powerStatus;
		var data = "<" + Number(tempValue) + ">";

		if(tempValue === true) {
			$scope.sendReq(data); // Power on..
			$scope.setUpLocos(); // ...puis toutes les locos sont mises à l'arret.
		}
		else
		 	$scope.sendReq(data); //... et power off
	}

	

	$scope.setUpLocos = function () {
		// On met toutes les locos à l'arrêt
		for(var i = 0; i < $scope.locomotives.length; i++) {
			$scope.locomotives[i].vitesse = -1;
			$scope.locomotives[i].sens = 1;
			var data = "t ";
			data += $scope.locomotives[i].id;
			data += " ";
			data += $scope.locomotives[i].address;
			data += " ";
			data += $scope.locomotives[i].vitesse;
			data += " ";
			data += $scope.locomotives[i].sens;	
			data = "<" + data + ">";
			$scope.sendReq(data);
			$scope.locomotives[i].vitesse = 0;
		}
	}



	

	//***************************************************************************************************************//
	//********************************** Chargement des données *****************************************************//
	//***************************************************************************************************************//


	//**************************** Chargement du fichier locomotives à partir du menu paramètres *********************//
	
	$scope.loadLocosHd2 = function () {	
		if(confirm("Vous allez effacer les données actuelles de vos locomotives, voulez-vous poursuivre ?")) {
			var promise = $scope.loadLocosHd();
			promise.then(
	  		function(resolve) {
				$scope.afficheReponse("Success import file \"locos.json\" from HD.");
				$scope.initLoco();
			});
		}
	}
	
	
	//********************************** à partir du localstorage ***************************************************//

	$scope.loadLocalStorage = function () {
		$scope.locomotives = JSON.parse(localStorage.getItem("locomotives"));
		$scope.param = JSON.parse(localStorage.getItem("param"));
		$scope.manufacturers = JSON.parse(localStorage.getItem("manufacturers"));
		$scope.cvLabels = JSON.parse(localStorage.getItem("cvLabels"));
		$scope.localStorageLength = localStorage.length;
	}

	//********************************** à partir du HD ***************************************************//
	


	// Chargement de l'objet "locomotives" (qui contient toutes les infos sur les locos) à partir du HD
	$scope.loadLocosHd = function () {	
		return $q(function(resolve, reject) {
			$http({
					method: 'GET',
					url: './'+$scope.tab_pathConfigFiles[0]
				}).
			  	success(function(response) {
	  				$scope.locomotives = response;
			  		resolve(response);
			  		//$scope.afficheReponse("Success import file "+$scope.tab_pathConfigFiles[0]+" from HD.");
			 	}).
			  	error(function(data, status, headers, config) {
			  		reject(data, status, headers, config);
			});
		});	
	}


	// Chargement du fichier des constructeurs de décodeurs à partir du HD
	$scope.loadManufacturersHd = function () {
		return $q(function(resolve, reject) {
			$http({
					method: 'GET',
					url: './'+$scope.tab_pathConfigFiles[1]
				}).
			  	success(function(response) {
	  				$scope.manufacturers = response;
	  				resolve(response);
			  		//$scope.afficheReponse("Fichier des constructeurs sur disque chargé.");
			 	}).
			  	error(function(data, status, headers, config) {
			  		reject(data, status, headers, config);
		  			console.log(data);
			});
		});	  	
	}

	// Chargement du fichier des labels pour les CV's de décodeurs à partir du HD
	$scope.loadCvLabelsHd = function () {	
		return $q(function(resolve, reject) {
			$http({
					method: 'GET',
					url: './'+$scope.tab_pathConfigFiles[2]
				}).
			  	success(function(response) {
	  				$scope.cvLabels = response;
	  				resolve(response);
			  		//$scope.afficheReponse("Fichier des labels de CV's sur disque chargé.");
			 	}).
			  	error(function(data, status, headers, config) {
			  		reject(data, status, headers, config);
			  		console.log(data);
			});
		});
	}		

	// Chargement du fichier des labels pour les CV's de décodeurs à partir du HD
	$scope.loadParamHd = function () {	
		return $q(function(resolve, reject) {
			$http({
					method: 'GET',
					url: './'+$scope.tab_pathConfigFiles[3]
				}).
			  	success(function(response) {
	  				$scope.param = response;
	  				resolve(response);
			  		//$scope.afficheReponse("Fichier des paramètres sur disque chargé.");
			 	}).
			  	error(function(data, status, headers, config) {
			  		reject(data, status, headers, config);
			  		console.log(data);
			});
		});	
	}


	//*******************************************************************************************//
	//****************************** Sauvegarde des données *************************************//
	//*******************************************************************************************//



	$scope.hdSave = function () {
		for(let i = 0; i < $scope.tab_pathConfigFiles.length; i++) {
			let path = 'controller_dccpp_node/'+$scope.tab_pathConfigFiles[i];

			switch (i) {
				case 0:
					data = JSON.stringify($scope.locomotives);
					break;
				case 1:
					data = JSON.stringify($scope.manufacturers);
					break;
				case 2:
					data = JSON.stringify($scope.cvLabels);
					break;
				case 3:
					data = JSON.stringify($scope.param);
					break;
			}
			$scope.socket.emit('hdSave', data, path);
		}
	}


	//************************************* LocalStorage ***************************************//


	$scope.recLocalstorage = function() {
		localStorage.setItem("locomotives",JSON.stringify($scope.locomotives));
		localStorage.setItem("param",JSON.stringify($scope.param));
		localStorage.setItem("manufacturers",JSON.stringify($scope.manufacturers));
		localStorage.setItem("cvLabels",JSON.stringify($scope.cvLabels));
		$scope.localStorageLength = localStorage.length;
	}


	$scope.removeLocalstorage = function() {
		localStorage.removeItem("locomotives");
		localStorage.removeItem("param");
		localStorage.removeItem("manufacturers",JSON.stringify($scope.manufacturers));
		localStorage.removeItem("cvLabels",JSON.stringify($scope.cvLabels));
		$scope.localStorageLength = localStorage.length;
	}

	//******************* Sauvegarde automatique quand on quitte l'application ****************//


	window.onbeforeunload = function (e) {
		console.log("End of session.");
	   	// on enregistre aussi toutes les données dans le "localStorage" du navigateur avant de quitter
	   	if($scope.param.localStorageActive)
	   		$scope.recLocalstorage();
	   	// ... et sur le disque.
	   	$scope.saveHD();
	}



	//*******************************************************************************************//
	//********************************** Demarrage de l'appli ***********************************//
	//*******************************************************************************************//



	$scope.startCtrl = function () {

		// Chargement des fichiers à partir du localStorage
		$scope.loadLocalStorage();

		// ...ou sur le disque s'il n'y avait pas de données dans le local storage
		if($scope.param == null)
			$scope.loadParamHd();
		
		if($scope.locomotives == null)
			$scope.loadLocosHd();
		
		if($scope.manufacturers == null) 
			$scope.loadManufacturersHd();
		
		if($scope.cvLabels == null) 
			$scope.loadCvLabelsHd();

		$scope.initLoco();
	}
	$scope.startCtrl();
	
});  // ->







