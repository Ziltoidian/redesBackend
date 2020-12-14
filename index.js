const firebase = require('firebase');
const firestore = require('firebase/firestore');
const express = require('express');//importar la libreria
const bodyParser = require('body-parser');//importar libreria
const port = process.env.PORT || 3500;

const firebaseConfig = {
    //inicio api keys

    //fin api keys
  };

const email = 'px1000.mb@gmail.com';

firebase.initializeApp(firebaseConfig);
db = firebase.firestore()
const archivosRef = db.collection('Usuarios/' + email + '/Archivos');

//delete
//archivosRef.doc('p96DGrVjDYGoxX9E8mAO').delete();

const app = express();//crea el servidor
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/get_documents/',  (req,res) => {
    archivosRef.onSnapshot( snap => {
        var archivos = new Array();
        snap.forEach( snapHijo => {
            archivos.push({
                id: snapHijo.id,
                ...snapHijo.data()
            });
        } )
        console.log(archivos);
        res.json(archivos);
    })
});

app.post('/create_document', (req,res) => {
    let body = req.body;
    const archivo = {
        nombre_archivo: body.name_doc,
        descripcion: body.description,
        fecha_creacion: body.creation_date,
        url: body.url,
        materia: body.subject,
        semestre: body.semester,
        nombre_profesor: body.profesor_name,
        fecha_entrega: body.delivery_date
    }
    archivosRef.add(archivo);
    res.json({ 'creado': true });
} );

app.get('/delete_document/:uid',  (req,res) => {
    var params = req.params;
    archivosRef.doc(params.uid).delete();
    res.json({ 'eliminado': true });
});

app.post('/update_document/:uid',  (req,res) => {
    let params = req.params;
    let body = req.body;
    archivosRef.doc(params.uid).update({
        nombre_archivo: body.name_doc,
        descripcion: body.description,
        fecha_creacion: body.creation_date,
        url: body.url,
        materia: body.subject,
        semestre: body.semester,
        nombre_profesor: body.profesor_name,
        fecha_entrega: body.delivery_date
    });
    res.json({ 'actualizado': true });
});

app.listen(port, () => {
    console.log(`Servidor en ejecución http://localhost:${port}`);
});
