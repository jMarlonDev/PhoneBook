
const express = require("express");
const cors = require("cors");
const app = express();
const contactsObj = require("./data/contacts.json");
let contacts = contactsObj.contacts;
const path = require('path'); // Importa el módulo path
/* Middlewares:
 * - json() para poder cuando se haga la solicitud al servidor este envíe la respuesta en formato JSON 
 * - cors() para poder solucionar el problema de intentar hacer peticiones de Origen Cruzado con 
 *   este Middlewar podremos hacer solicitudes desde cualquier parte a nuestro servidor */
app.use(express.json())

app.use(cors({
  origin: "*", // Permitir cualquier dominio
}));

/* Rutas definidas para poder obtener y manipular los datos del archivo json */

/* Solicitud Get:
 * Indicamos la url donde se van a cargar los datos que provienen del archivo json contactsObj 
 * y enviamos como respuesta todos los datos de ese archivo en formato json 
 * ahora al cargar la url de http://localhost:3001/contacts/ se van a cargar los datos en formato json*/
app.use(express.static(path.join(__dirname, 'dist')));

app.get("/api/contacts", (request, response) => {
  response.json(contacts);
})

// Manejo de rutas para React Router
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


/* Solicitud Post
 * Para crear un nuevo elemento: debemos primero usar el metodo post y hacer la solicitud a la url /contacts
 * siempre para hacer este tipo de solicitud se debe crear un nuevo elemento con 
 * los datos enviados en la solicitud request.body
 * En esta parte lo que hacemos es generar un id automaticamente primero recorriendo 
 * el arreglo con todos los elementos y utilizamos la funcion Math.max
 * por Ejemplo: si en el arreglo hay estos IDs 
 * [
 * {id:1 , name:"j"} , {id:2 ,name:m} , {id:3}
 * ]
 * la funcion Math.max(retorna 1, 2 , 3 y devuelve el mayor en este caso 3)
 * y a este numero le suma 1 así comprobamos que cada vez que se genere un nuevo elemento lo haga en orden
*/

app.post("/api/contacts", (request, response) => {
  const newContact = request.body;

  newContact.id = contacts.length > 0 ? Math.max(...contacts.map((contact) => contact.id)) + 1 : 1;
  contacts.push(newContact);
  response.json(newContact);
})


/* 
 * Solicitud Delete:
 * Para poder hacer una solicitud delete primero debemos indicar la url /contacts que es la 
 * que contiene los datos que se van a mostrar en la interfaz
 * aquí le indicamos que necesitamos recibir un parametro en la solicitud (request ) que es el ID. 
 * como todos los parametros que son enviados en la solicitud son Strings lo convertimos en un numero.
 * Luego verificamos si el ID que viene en la solicitud se encuentra dentro de nuestro array de elementos
 * y luego modificamos nuestro array de elementos para que muestre todos los elementos excepto 
 * el elemento que contenga el ID que se paso en la solicitud si se encuentra.
*/

app.delete("/api/contacts/:id", (request, response) => {
  const id = Number(request.params.id);
  const contactFind = contacts.find((contact) => contact.id === id);

  if (!contactFind) {
    return response.status(404).json({
      message: "El contacto que quieres eliminar no existe o no se encuentra en tu agenda de telefono"
    }
    )
  }
  contacts = contacts.filter((contact) => contact.id !== id);
  response.json(contacts);
})

/* Solicitud Put:
 * para poder hacer esta solicitud tambien debemos indicar la url y un parametro ID que viene desde la solicitud ( request )
 * aquí como cada dato enviado como parametro en la solicitud es un string lo convertimos a un numero
 * y creamos una constante de un nuevo elemento que va a contener los datos ingresados ya sea enla interfaz 
 * que vienen en la solicitud ( request.body )
 * Luego creamos una nueva constante que va a almacenar el elemento que queremos actualizar
 * comprobando si el elemento con el id que viene desde la request existe dentro de mi arreglo 
 * de ser así entonces modificamos el arreglo original pasando el objeto o elemento que ya teníamos 
 * pero sobreescribiendo las propiedades modificadas desde la interfaz 
 * y devolvemos como respuesta el nuevo elemento ya modificado al cliente
 * */

app.put("/api/contacts/:id", (request, response) => {
  const id = Number(request.params.id);
  const newContact = request.body;
  const contactsUpdate = contacts.find((contact) => contact.id === id);
  if (!contactsUpdate) {
    return response.json({
      message: "El contacto que quieres actualizar no se encuentra en la agenda de contactos"
    })
  }

  contacts = contacts.map((contact) => contact.id === id ? { ...contact, ...newContact } : contact);
  response.json(newContact);

})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("l servidor esta prendido en el puerto 3001");
})

