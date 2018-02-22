"use strict"
const tableau = require('./tableaux.js');
// Peuple une liste de membres aléatoirement.
const peupler_json = () => {
    let listeMembres = []
    let position;
	for(let i=0 ; i<15; i++) {
        // Génère un numéro de téléphone complet et réaliste
        let noTel = "-";
        for (let j = 0; j < 7; j++) {
            if(j == 3){
                noTel += "-";
            }
            let unChiffre = genere_NbAleatoire(10);
            noTel += unChiffre.toString(); 
        }
        // Crée le membre
        let unMembre = {};
        unMembre.nom = tableau.tabNom[genere_NbAleatoire(tableau.tabNom.length)];
        unMembre.prenom = tableau.tabPrenom[genere_NbAleatoire(tableau.tabPrenom.length)];
        unMembre.telephone  = tableau.tabIndicatif[genere_NbAleatoire(tableau.tabIndicatif.length)] + noTel;
        unMembre.courriel = unMembre.nom + "." + unMembre.prenom + "@" + tableau.tabDomaine[genere_NbAleatoire(tableau.tabDomaine.length)];
        // Formatage du courriel
        unMembre.courriel = unMembre.courriel.toLowerCase();
        unMembre.courriel = unMembre.courriel.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        unMembre.courriel = unMembre.courriel.replace("-","");
        // Ajoute le membre dans la liste
        listeMembres.push(unMembre);
	}
	return(listeMembres);
}
// Fonction qui génère un nombre aléatoire
// @param {number} max Chiffre maximum pouvant être généré
let genere_NbAleatoire = (max) => {
    return Math.floor(Math.random()*max)
}

module.exports = peupler_json;