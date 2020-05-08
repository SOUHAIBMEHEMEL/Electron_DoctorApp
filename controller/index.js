var menuElement= document.getElementsByClassName('menuItem')
var element = document.getElementsByClassName('element')
var supprimerRdvBtn= document.getElementsByClassName('supprimerRDV')
var supprimerRdvBtn1= document.getElementsByClassName('supprimerRDV1')
var supprimerRdvBtn2= document.getElementsByClassName('supprimerRDV2')
var rowRDV = document.getElementsByClassName('afficherRDV')
var rowRDV1 = document.getElementsByClassName('afficherRDV1')
var rowRDV2 = document.getElementsByClassName('afficherRDV2')


function convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat)
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/')
}

function Dateformat(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

for(let j=0; j<menuElement.length;j++){
    menuElement[j].onclick = function () {
        for (let i = 0; i < element.length; i++){
            element[i].style.display = "none";
            menuElement[i].style.borderBottom = '3px solid transparent';
        }
        //menu_element[j].style.background= "rgba(240,240,240,.2)";
        element[j].style.display = "block";
        menuElement[j].style.borderBottom = '3px solid #2b579a';
    };
    
}


//database test
var mysql = require('mysql');

function el(selector) {
    return document.getElementById(selector);
}

el('action-btn').addEventListener('click', function(){
    // Get the mysql service
    getRows(function(rows){
        var html = '';
        html += '<tr>';
        html += '<td>'; html += 'Patient' ; html += '</td>';
        html += '<td>'; html += 'Heure de visite'; html += '</td>';
        html += '<td>'; html += 'Objet de visite'; html += '</td>';
        html += '<td>'; html += 'Afficher'; html += '</td>';
        html += '<td>'; html += 'Supprimer'; html += '</td>';
        html += '</tr>';

        rows.forEach(function(row){
            html += '<tr>'; 
            html += '<td>'; html += row.nom+' '+row.prenom ; html += '</td>';
            html += '<td>'; html += row.heure; html += '</td>';
            html += '<td>'; html += row.objet; html += '</td>';
            html += '<td><button class="afficherRDV" value="'+row.id_rdv+'">Afficher</button></td>';
            html += '<td><button class="supprimerRDV" value="'+row.id_rdv+'">Supprimer</button></td>';
            html += '</tr>';
            console.log(row);
        });

        document.querySelector('#table > tbody').innerHTML = html;

        //afficher un rendez-vous
        for(let j=0; j<rowRDV.length;j++){
            rowRDV[j].onclick = function () {
                var idRDV= rowRDV[j].value;
                afficherRdvPatient(idRDV);
                console.log(idRDV);
                //document.getElementById('inputAddress').value='dddd';
            };
            
        }

        //supprimer un rendez-vous
        for(let j=0; j<supprimerRdvBtn.length;j++){
            supprimerRdvBtn[j].onclick = function () {
                var idRDV= supprimerRdvBtn[j].value;
                deleteRDV(idRDV);
            };
            
        }
    });
},false);

function getRows(callback){
    var mysql = require('mysql');

    // Add the credentials to access your database
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : null,
        database : 'gestionrdvdb'
    });

    // connect to mysql
    connection.connect(function(err) {
        // in case of error
        if(err){
            console.log(err.code);
            console.log(err.fatal);
        }
    });

    // Perform a query
    $query = 'select * FROM rdv A JOIN patient B ON A.patient = B.id_patient where A.date= CURDATE()';

    connection.query($query, function(err, rows, fields) {
        if(err){
            console.log("An error ocurred performing the query.");
            console.log(err);
            return;
        }

        callback(rows);

        console.log("Query succesfully executed");
    });

    // Close the connection
    connection.end(function(){
        // The connection has been closed
    });
}

function deleteRDV(idRDV){
    var mysql = require('mysql');

    // Add the credentials to access your database
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : null,
        database : 'gestionrdvdb'
    });

    // connect to mysql
    connection.connect(function(err) {
        // in case of error
        if(err){
            console.log(err.code);
            console.log(err.fatal);
        }
    });

    // Perform a query
    $query = 'DELETE FROM rdv WHERE rdv.id_rdv = '+idRDV;

    connection.query($query, function(err) {
        if(err){
            console.log("An error ocurred performing the query.");
            console.log(err);
            return;
        }

        console.log("Query succesfully executed");
    });

    // Close the connection
    connection.end(function(){
        // The connection has been closed
    });
}

function afficherRdvPatient(idRDV){
    var mysql = require('mysql');

    // Add the credentials to access your database
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : null,
        database : 'gestionrdvdb'
    });

    // connect to mysql
    connection.connect(function(err) {
        // in case of error
        if(err){
            console.log(err.code);
            console.log(err.fatal);
        }
    });

    // Perform a query
    $query = 'select * FROM rdv A JOIN patient B ON A.patient = B.id_patient WHERE A.id_rdv = '+idRDV;

    connection.query($query, function(err,rows) {
        if(err){
            console.log("An error ocurred performing the query.");
            console.log(err);
            return;
        }

        
        rows.forEach(function(row){
            document.getElementById('date').value=Dateformat(row.date);
            document.getElementById('heure').value=row.heure;
            document.getElementById('objet').value=row.objet;
            document.getElementById('nom').value=row.nom;
            document.getElementById('prenom').value=row.prenom;
            document.getElementById('mail').value=row.mail;
            document.getElementById('telephone').value=row.telephone;
            document.getElementById('adresse').value=row.adresse;
            document.getElementById('infosmed').value=row.infosmed;
            
            document.getElementById('enregistrer').onclick=function(){
               // ModifierRdvPatient(idRDV)
               var date = document.getElementById('date').value;
               var heure = document.getElementById('heure').value;
               var objet = document.getElementById('objet').value;
               var nom = document.getElementById('nom').value;
               var prenom = document.getElementById('prenom').value;
               var mail = document.getElementById('mail').value;
               var telephone = document.getElementById('telephone').value;
               var adresse = document.getElementById('adresse').value;
               var infosmed = document.getElementById('infosmed').value;

               $query = 'UPDATE rdv SET date ="'+date+'", heure ="'+heure+'", objet ="'+objet+'" WHERE rdv.id_rdv = '+idRDV;
               connection.query($query, function(err) {
                   if(err){
                       console.log("An error ocurred performing the query.");
                       console.log(err);
                       return;
                   }
               });

               $query1 = 'UPDATE patient SET nom ="'+nom+'", prenom ="'+prenom+'", mail ="'+mail+
               +'", telephone ="'+telephone+'", adresse ="'+adresse+'", infosmed ="'+infosmed+'" WHERE patient.id_patient = '+row.id_patient;
               connection.query($query1, function(err) {
                   if(err){
                       console.log("An error ocurred performing the query.");
                       console.log(err);
                       return;
                   }
               });
            }


            document.getElementById('ajouter').onclick=function(){
                // AjouterRdvPatient(idRDV)
                var date = document.getElementById('date').value;
                var heure = document.getElementById('heure').value;
                var objet = document.getElementById('objet').value;
                var nom = document.getElementById('nom').value;
                var prenom = document.getElementById('prenom').value;
                var mail = document.getElementById('mail').value;
                var telephone = document.getElementById('telephone').value;
                var adresse = document.getElementById('adresse').value;
                var infosmed = document.getElementById('infosmed').value;
 
                $query = 'INSERT INTO rdv (date,heure,objet) VALUES ("'+date+'","'+heure+'","'+objet+'")';
                connection.query($query, function(err) {
                    if(err){
                        console.log("An error ocurred performing the query.");
                        console.log(err);
                        return;
                    }
                });
 
                $query1 = 'INSERT INTO patient (nom,prenom,mail,telephone,adresse,infosmed) VALUES ("'+nom+'","'+prenom+'","'+mail+'","'+telephone+'","'+adresse+'","'+infosmed+'")';
                connection.query($query1, function(err) {
                    if(err){
                        console.log("An error ocurred performing the query.");
                        console.log(err);
                        return;
                    }
                });
            }

        });
    });

    // Close the connection
    
}











//Gestion des RDV

el('actualiser').addEventListener('click', function(){
    // Get the mysql service
    getRows1(function(rows){
        var html = '';
        html += '<tr>';
        html += '<td>'; html += 'Date du RDV' ; html += '</td>';
        html += '<td>'; html += 'Heure de visite'; html += '</td>';
        html += '<td>'; html += 'Objet'; html += '</td>';
        html += '<td>'; html += 'Afficher'; html += '</td>';
        html += '<td>'; html += 'Supprimer'; html += '</td>';
        html += '</tr>';

        rows.forEach(function(row){
            html += '<tr>'; 
            html += '<td>'; html += Dateformat(row.date) ; html += '</td>';
            html += '<td>'; html += row.heure; html += '</td>';
            html += '<td>'; html += row.objet; html += '</td>';
            html += '<td><button class="afficherRDV1" value="'+row.id_rdv+'">Afficher</button></td>';
            html += '<td><button class="supprimerRDV1" value="'+row.id_rdv+'">Supprimer</button></td>';
            html += '</tr>';
            console.log(row);
        });

        document.querySelector('#tableRDV > tbody').innerHTML = html;

        //afficher un rendez-vous
        for(let j=0; j<rowRDV1.length;j++){
            rowRDV1[j].onclick = function () {
                var idRDV= rowRDV1[j].value;
                afficherRdv(idRDV);
                console.log(idRDV);
                //document.getElementById('inputAddress').value='dddd';
            };
            
        }

        //supprimer un rendez-vous
        for(let j=0; j<supprimerRdvBtn1.length;j++){
            supprimerRdvBtn1[j].onclick = function () {
                var idRDV= supprimerRdvBtn1[j].value;
                suppRDV(idRDV);
            };
            
        }
    });
},false);

function getRows1(callback){
    var mysql = require('mysql');

    // Add the credentials to access your database
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : null,
        database : 'gestionrdvdb'
    });

    // connect to mysql
    connection.connect(function(err) {
        // in case of error
        if(err){
            console.log(err.code);
            console.log(err.fatal);
        }
    });

    // Perform a query
    $query = 'select * FROM rdv';

    connection.query($query, function(err, rows, fields) {
        if(err){
            console.log("An error ocurred performing the query.");
            console.log(err);
            return;
        }

        callback(rows);

        console.log("Query succesfully executed");
    });

    // Close the connection
    connection.end(function(){
        // The connection has been closed
    });
}


function suppRDV(idRDV){
    var mysql = require('mysql');

    // Add the credentials to access your database
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : null,
        database : 'gestionrdvdb'
    });

    // connect to mysql
    connection.connect(function(err) {
        // in case of error
        if(err){
            console.log(err.code);
            console.log(err.fatal);
        }
    });

    // Perform a query
    $query = 'DELETE FROM rdv WHERE rdv.id_rdv = '+idRDV;

    connection.query($query, function(err) {
        if(err){
            console.log("An error ocurred performing the query.");
            console.log(err);
            return;
        }

        console.log("Query succesfully executed");
    });

    // Close the connection
    connection.end(function(){
        // The connection has been closed
    });
}

function afficherRdv(idRDV){
    var mysql = require('mysql');

    // Add the credentials to access your database
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : null,
        database : 'gestionrdvdb'
    });

    // connect to mysql
    connection.connect(function(err) {
        // in case of error
        if(err){
            console.log(err.code);
            console.log(err.fatal);
        }
    });

    // Perform a query
    $query = 'select * FROM rdv WHERE rdv.id_rdv = '+idRDV;

    connection.query($query, function(err,rows) {
        if(err){
            console.log("An error ocurred performing the query.");
            console.log(err);
            return;
        }

        
        rows.forEach(function(row){
            document.getElementById('date1').value=Dateformat(row.date);
            document.getElementById('heure1').value=row.heure;
            document.getElementById('objet1').value=row.objet;
            
            document.getElementById('enregistrer1').onclick=function(){
               // ModifierRdvPatient(idRDV)
               var date = document.getElementById('date1').value;
               var heure = document.getElementById('heure1').value;
               var objet = document.getElementById('objet1').value;
               

               $query = 'UPDATE rdv SET date ="'+date+'", heure ="'+heure+'", objet ="'+objet+'" WHERE rdv.id_rdv = '+idRDV;
               connection.query($query, function(err) {
                   if(err){
                       console.log("An error ocurred performing the query.");
                       console.log(err);
                       return;
                   }
               });

            }
        });
    });

    // Close the connection
    
}





//Gestion des PATIENTS

el('actualiser2').addEventListener('click', function(){
    // Get the mysql service
    getRows2(function(rows){
        var html = '';
        html += '<tr>';
        html += '<td>'; html += 'Patient' ; html += '</td>';
        html += '<td>'; html += 'Telephone'; html += '</td>';
        html += '<td>'; html += 'Email'; html += '</td>';
        html += '<td>'; html += 'Informations Medicales'; html += '</td>';
        html += '<td>'; html += 'Afficher'; html += '</td>';
        html += '<td>'; html += 'Supprimer'; html += '</td>';
        html += '</tr>';

        rows.forEach(function(row){
            html += '<tr>'; 
            html += '<td>'; html += row.nom+' '+row.prenom ; html += '</td>';
            html += '<td>'; html += row.telephone; html += '</td>';
            html += '<td>'; html += row.mail; html += '</td>';
            html += '<td>'; html += row.infosmed; html += '</td>';
            html += '<td><button class="afficherRDV2" value="'+row.id_patient+'">Afficher</button></td>';
            html += '<td><button class="supprimerRDV2" value="'+row.id_patient+'">Supprimer</button></td>';
            html += '</tr>';
            console.log(row);
        });

        document.querySelector('#table2 > tbody').innerHTML = html;

        //afficher un rendez-vous
        for(let j=0; j<rowRDV2.length;j++){
            rowRDV2[j].onclick = function () {
                var idRDV= rowRDV2[j].value;
                afficherPatient(idRDV);
                console.log('id=    ',idRDV);
                //document.getElementById('inputAddress').value='dddd';
            };
            
        }

        //supprimer un rendez-vous
        for(let j=0; j<supprimerRdvBtn2.length;j++){
            supprimerRdvBtn2[j].onclick = function () {
                var idRDV= supprimerRdvBtn2[j].value;
                suppPatient(idRDV);
            };
            
        }
    });
},false);

function getRows2(callback){
    var mysql = require('mysql');

    // Add the credentials to access your database
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : null,
        database : 'gestionrdvdb'
    });

    // connect to mysql
    connection.connect(function(err) {
        // in case of error
        if(err){
            console.log(err.code);
            console.log(err.fatal);
        }
    });

    // Perform a query
    $query = 'select * FROM patient';

    connection.query($query, function(err, rows, fields) {
        if(err){
            console.log("An error ocurred performing the query.");
            console.log(err);
            return;
        }

        callback(rows);

        console.log("Query succesfully executed");
    });

    // Close the connection
    connection.end(function(){
        // The connection has been closed
    });
}


function suppPatient(idRDV){
    var mysql = require('mysql');

    // Add the credentials to access your database
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : null,
        database : 'gestionrdvdb'
    });

    // connect to mysql
    connection.connect(function(err) {
        // in case of error
        if(err){
            console.log(err.code);
            console.log(err.fatal);
        }
    });

    // Perform a query
    $query = 'DELETE FROM patient WHERE patient.id_patient = '+idRDV;

    connection.query($query, function(err) {
        if(err){
            console.log("An error ocurred performing the query.");
            console.log(err);
            return;
        }

        console.log("Query succesfully executed");
    });

    // Close the connection
    connection.end(function(){
        // The connection has been closed
    });
}

function afficherPatient(idRDV){
    var mysql = require('mysql');

    // Add the credentials to access your database
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : null,
        database : 'gestionrdvdb'
    });

    // connect to mysql
    connection.connect(function(err) {
        // in case of error
        if(err){
            console.log(err.code);
            console.log(err.fatal);
        }
    });

    // Perform a query
    $query = 'select * FROM patient WHERE patient.id_patient = '+idRDV;

    connection.query($query, function(err,rows) {
        if(err){
            console.log("An error ocurred performing the query.");
            console.log(err);
            return;
        }

        
        rows.forEach(function(row){
            document.getElementById('nom2').value=row.nom;
            document.getElementById('prenom2').value=row.prenom;
            document.getElementById('mail2').value=row.mail;
            document.getElementById('telephone2').value=row.telephone;
            document.getElementById('adresse2').value=row.adresse;
            document.getElementById('infosmed2').value=row.infosmed;
            
            document.getElementById('enregistrer2').onclick=function(){
                // ModifierPatient(idRDV)
                var nom = document.getElementById('nom2').value;
                var prenom = document.getElementById('prenom2').value;
                var mail = document.getElementById('mail2').value;
                var telephone = document.getElementById('telephone2').value;
                var adresse = document.getElementById('adresse2').value;
                var infosmed = document.getElementById('infosmed2').value;
 
                $query1 = 'UPDATE patient SET nom ="'+nom+'", prenom ="'+prenom+'", mail ="'+mail+''
                +'", telephone ="'+telephone+'", adresse ="'+adresse+'", infosmed ="'+infosmed+'" WHERE patient.id_patient = '+row.id_patient;
                connection.query($query1, function(err) {
                    if(err){
                        console.log("An error ocurred performing the query.");
                        console.log(err);
                        return;
                    }
                });
            }
        });
    });

    // Close the connection
    
}