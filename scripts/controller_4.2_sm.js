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
	$scope.socket = io.connect('http://192.168.200.41:8080/');
	// Création de l'objet locomotives qui est vide pour l'instant
	$scope.locomotives = null;
	// Création de l'objet locoSelectionnee qui est vide pour l'instant
	$scope.locoSelectionnee = null;
	// Création de l'objet param qui est vide pour l'instant
	$scope.param = null;
	// Etat de l'alimentation du réseau
	$scope.powerStatus = false;


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

	

	document.getElementById('btn_eStop').addEventListener('click', function() {
	    $scope.$apply(function() {
	    	$scope.eStop();
	    });
	});



	//*******************************************************************************************//
	//*************************** Selection locos et affichage locos ****************************//
	//*******************************************************************************************//


	// La méthode "selectionLoco" affecte à l'objet "locoSelectionnee" les informations de la locomotive sélectionnée
	$scope.selectionLoco = function (loco) { 
		$scope.locoSelectionnee = loco;
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
	//****************************** Requêtes httpReq et sockets ********************************//
	//*******************************************************************************************//


	//Préparation de la requette
	$scope.setParamLocos = function(data) {
		if($scope.locoSelectionnee == null) 
			alert('Sélectionnez une locomotive.');
		else {
			data = 	"<"
				+data
				+">";
		$scope.sendReq(data); //... et on appele la fonction qui va envoyer l'information à DCC++	
		}
		
	}

	// Affichage de la réponse pour les requettes
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
		//for(var i = 0; i < $scope.locomotives.length; i++) {
		for (var i in $scope.locomotives) {
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
	
	
	//********************************** à partir du localstorage ***************************************************//

	$scope.loadLocalStorage = function () {
		$scope.locomotives = JSON.parse(localStorage.getItem("locomotives"));
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
			 	}).
			  	error(function(data, status, headers, config) {
			  		reject(data, status, headers, config);
			});
		});	
	}




	//*******************************************************************************************//
	//********************************** Demarrage de l'appli ***********************************//
	//*******************************************************************************************//



	$scope.startCtrl = function () {

		// Chargement des fichiers à partir du localStorage...
		$scope.loadLocalStorage();
		//... ou si non disponble, depuis le HD
		if($scope.locomotives == null) { 
			$scope.loadLocosHd();
		}
	}
	$scope.startCtrl();
	
});  // ->







