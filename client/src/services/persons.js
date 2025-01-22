
/* Componente de Services: 
 * Como funciona: este componente define las funciones asíncronas enviado solicitudes al servidor 
 * para hacer lo siguiente en la interfaz web:
 *
 * 1. Obtener todos los datos que hay en el archivo json y mostrarlo en la interfaz inicialmente.
 *
 * 2. Mandar una solicitud de Post al servidor para crear un nuevo objeto que se manda.
 *
 * con los datos desde la interfaz se carga en la interfaz y también en el servidor 
 * 3. Mandar una solicitud Put al servidor para actualizar un elemento ya existente dentro 
 * del arreglo de elementos.
 *
 * 4. Mandar una solicitud Delete al servidor para que me permita poder eliminar 
 * un elementos desde mi interfaz y también en el servidor.
 */

import axios from "axios";

const urlPersons = "/api/contacts";
async function getAllPersons() {
  const request = await axios.get(urlPersons);
  return request.data;
}


async function createPerson(newObjectPerson) {
  const response = await axios.post(urlPersons, newObjectPerson);
  return response.data;
}

async function updatePhonePerson(id, updatePerson) {
  try {
    const request = await axios.put(`${urlPersons}/${id}`, updatePerson);
    return request.data;
  } catch (error) {
    console.log("ocurrio un error", error);
  }
}

async function deletePerson(id) {
  const request = await axios.delete(`${urlPersons}/${id}`)
  return request.data;
}

export default { getAllPersons, createPerson, updatePhonePerson, deletePerson }
