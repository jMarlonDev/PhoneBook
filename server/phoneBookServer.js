
const express = require("express"); // importa el framework de exprees para contruir el servidor web
// que permita poder recibir solicitudes como get , post , put , delete y procesarla

const cors = require("cors");// importa el Middleware CORS para permitir hacer peticiones de diferentes urls
const mongoose = require("mongoose"); //Importa el modulo de mongoose para poder conectarse a la base de datos de MongoDB
// y crear el esquema de como  se van a guardar los datos en la base de datos

require("dotenv").config(); // importa y configura dotenv que me permite leer
// variables de entorno desde el archivo .env

const urlMongo = process.env.MONGODB_URI;

const app = express();
const Contact = require("./models/contact.js")
const path = require('path'); // Importa el módulo path para manejar archivos de los directorios del computador

/* 
 * Middlewares:
 * - json() para poder cuando se haga la solicitud al servidor este envíe la respuesta en formato JSON 
 * - cors() para poder solucionar el problema de intentar hacer peticiones de Origen Cruzado con 
 *   este Middlewar podremos hacer solicitudes desde cualquier parte a nuestro servidor 
*/
app.use(express.json())

app.use(cors({
  origin: "*", // Permitir cualquier dominio
}));

mongoose.connect(urlMongo)
  .then(() => {
    console.log("conectado a mongodb")
  })

/* Rutas definidas para poder obtener y manipular los datos de la base de datos MongoDB*/

/* 
 * Solicitud Get:
 * Indicamos la url donde se van a cargar los datos que provienen de la base de datos 
 * luego con el esquema de Contact definido como modelo buscamos todos los datos con find()
 * y envíamos como respuesta todos los datos en formato JSON
*/

app.get("/api/contacts", async (request, response) => {
  try {
    const contacts = await Contact.find();
    response.json(contacts)
  } catch (error) {
    response.status(500).json({ error: "Error al obtener los contactos" });
  }
})

/* Solicitud Post
 * Para crear un nuevo elemento: debemos primero usar el metodo post y hacer la solicitud a la url api/contacts
 * siempre para hacer este tipo de solicitud se debe crear un nuevo elemento con 
 * los datos enviados en la solicitud request.body
 * luego con el modelo Contact utilizamos el metodo de create para crear el nuevo contacto que
 * se envía en el cuerpo de la solicitud y envíamos como respuesta ese nuevo dato o elemento 
 * en formato JSON
*/

app.post("/api/contacts", async (request, response) => {
  const newContact = request.body;
  try {
    const createContact = await Contact.create(newContact);
    response.json(createContact);

  } catch (error) {
    response.status(500).json({ error: 'error al crear el contacto' });
  }
})


/* 
 * Solicitud Delete:
 * Para poder hacer una solicitud delete primero debemos indicar la url api/contacts que es la 
 * que contiene los datos que se van a mostrar en la interfaz
 * aquí le indicamos que necesitamos recibir un parametro en la solicitud (request ) que es el ID. 
 * Luego verificamos que el id que se ha pasado en la solicitud no este vacío de ser así 
 * vamos a mostrar un error en la consola 
 * luego de verificar si el id no esta vacío entonces vamos a buscar el dato y lo vamos a eliminar
 * con findByIdAndDelete , y si no existe el dato entonces mandamos un error desde el servidor
*/

app.delete("/api/contacts/:id", async (request, response) => {

  const id = request.params.id;
  if (id == null) {
    response.status(403).json({
      error: 'The id cant be null'
    })
    return;
  }

  try {
    const deleteContact = await Contact.findByIdAndDelete(id);
    console.log("borrado " + id);

    if (!deleteContact) {
      return response.status(404).json({
        message: "El contacto que quieres eliminar no existe o no se encuentra en la agenda de contactos"
      })
    }

    response.json(deleteContact);

  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Error al eliminar el contacto' });
  }

});

/* Solicitud Put:
 * para poder hacer esta solicitud tambien debemos indicar la url y un parametro ID que viene desde la solicitud ( request )
 * y también recibo el cuerpo de la solicitud para poder actualizar el contacto
 * primero buscamos el elemento con ayuda del modelo de Contact findByIdAndUpdate que me permite buscar el contacto 
 * y actualizarlo si todo sale bien se me envía el contacto con los nuevos cambios que se hicieron en el contacto
 * pero si el contacto no existe dentro de la base de datos entonces mostramos un error en el servidor
 * */

app.put("/api/contacts/:id", async (request, response) => {
  const id = request.params.id;
  const newContact = request.body;

  try {
    const updateContact = await Contact.findByIdAndUpdate(id, newContact, { new: true });

    if (!updateContact) {
      return response.status(404).json({
        message: "El usuario que quieres actualizar no se encuentra en la agenda de contactos"
      })
    }

    response.json(updateContact);

  } catch (error) {
    response.status(500).json({ error: 'Error al actualizar el contacto' });
  }
})

app.use(express.static(path.join(__dirname, '../client/dist')));// utilizamos el modulo path para mostrar los archivos estaticos 
// en al carpeta dist

// Manejo de rutas para React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname,"../client" , 'dist', 'index.html'));
});


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("l servidor esta prendido en el puerto", PORT);
})

