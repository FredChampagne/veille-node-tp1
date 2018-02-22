// Éléments qui permettent le fonctionnement de l'application
"use strict";
const express = require('express');
const app = express();
app.use(express.static('public'));
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;
const peupler = require("./mes_modules/peupler");

// Associe le moteur de vue au module «ejs» 
app.set('view engine', 'ejs'); // Générateur de template 
app.use(bodyParser.urlencoded({ extended: true }));
let util = require("util");

// Affichage de l'accueil (root)
app.get('/', function (req, res) {
	res.render('accueil.ejs');
})

// Affichage de la liste
app.get('/list', function (req, res) {
	let cursor = db.collection('adresse')
	.find().toArray(function (err, resultat) {
		if (err) return console.log(err)
		// console.log('util = ' + util.inspect(resultat));
		// transfert du contenu vers la vue index.ejs (renders)
		// affiche le contenu de la BD
		res.render('adresses.ejs', { adresses: resultat })
	})
})

// Traite le formulaire
app.post('/modifier', function (req, res) {
	console.log('req.body' + req.body);
	if (req.body['_id'] != ""){ 
		console.log('sauvegarde') 
		var oModif = {
			"_id": ObjectID(req.body['_id']), 
			nom: req.body.nom,
			prenom:req.body.prenom, 
			telephone:req.body.telephone,
			courriel:req.body.courriel
		}
		var util = require("util");
		console.log('util = ' + util.inspect(oModif));
	}
	else {
		console.log('insert');
		console.log(req.body);
		var oModif = {
		nom: req.body.nom,
		prenom:req.body.prenom, 
		telephone:req.body.telephone,
		courriel:req.body.courriel,
		}
	}
	db.collection('adresse').save(oModif, (err, result) => {
		if (err) return console.log(err)
		console.log('sauvegarder dans la BD')
		res.redirect('/list')
	})
});

// Ajoute un membre vide
app.get('/ajouter/', (req, res) => {
	db.collection('adresse').save(req.body, (err, result) => {
		if (err) return console.log(err)
		console.log('ajout vide dans la BD')
		res.redirect('/list')
	})
});

// Supprime une adresse
app.get('/detruire/:id', (req, res) => {
	var id = req.params.id;
	//console.log(id);
	// var critere = ObjectID.createFromHexString(id)
	var critere = ObjectID(id);
	//console.log(critere);
	db.collection('adresse').findOneAndDelete({"_id": critere}, (err, resultat) => {
		if (err) return console.log(err)
		res.redirect('/list');
	})
});

// Tri les adresses
app.get('/trier/:cle/:ordre', (req, res) => {
	let cle = req.params.cle
	let ordre = (req.params.ordre == 'asc' ? 1 : -1)
	console.log(ordre);
	let cursor = db.collection('adresse').find().sort(cle,ordre).toArray(function(err, resultat){
	ordre = (ordre == 1 ? "desc" : "asc");
	res.render('adresses.ejs', {adresses: resultat, ordre:ordre, cle:cle})
	});
});

// Peupler la base de données de membres
app.get('/peupler', function (req, res) {
	let peupler = require('./mes_modules/peupler/');
    let listeMembres = peupler();
    db.collection('adresse').insert(listeMembres, (err, resultat) => {
		if (err) return console.log(err)
		console.log(listeMembres);
		listeMembres = [];
        res.redirect('/list');
    });
})

// Vide la base de données
app.get('/vider', (req, res) => {
    db.collection('adresse').drop((err, resultat) => {
        if (err) return console.log(err)
        res.redirect('/list');
    });
})

let db // variable qui contiendra le lien sur la BD
// Connection à la BD
MongoClient.connect('mongodb://127.0.0.1:27017', (err, database) => {
	if (err) return console.log(err)
	db = database.db('carnet_adresse')
	// lancement du serveur Express sur le port 8081
	app.listen(8081, () => {
		console.log('connexion à la BD et on écoute sur le port 8081')
	})
})