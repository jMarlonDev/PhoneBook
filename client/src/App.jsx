

/* Tengo que ser capaz de  vamos con toda entender todo esto de una vez por todas ...*/

/* 
 * Primera parte del componente App.jsx que es el componente principal encargado de 
 * cargar la interfaz de la pagina y ejecutar toda la lógica para el filtrado de datos 
 * actulizacion de datos, eliminar datos , crear datos
*/

/*
 * Importando los modulos necesarios para poder ejecutar toda la lógica necesaria para que la aplicacion funcione
 * 1. importando los hooks de estado y efecto para poder manipular los estados de los componentes y cambiar y actualizar su valor 
 *    en la pagina y el hook de efecto para hacer una solicitud http para obtener los datos de un servidor simulado
 *
 * 2.Importando los tres componentes principales
    + Componentes principales encargados de mostrar la interfaz grafica del contenido para filtrar personas (-Filter-)
    + componente encargado de crear, actualizar y obtener todos los datos interactuando con el servidor simlado (-PersonForm-)
    + componente encargado de mostrar en la interfaz o en la pagina la lista de todos los datos que provienen del servidor simulado (-Persons-) 

   3.Importando el modulo que se llama personServices que es archivo en el cual 
     se definieron todas las funciones asíncronas que usa la aplicacion la cual nos permite manipular y comunicarnos 
     con el servirdor simulado con la librería de React json-server al cual nos da un archivo .json
     
     * Funciones Asíncronas definidas en este archivo
       1. funcion que hace una solicitud http.get para obtener todos los datos que se encuentran en el servidor simulado
       2. funcion que hace una solicitud http.post para la creacion de un nuevo elemento que se guarda en un objeto 
       y el cual es enviado al servidor simulado para que se realizen los cambios tanto en la pagina mostrando el nuevo elemento 
       creado y en el servidor para que se agregue al servidor simulado
       3.funciones que hace una solicitud http.put para actualizar el valor de la propiedad del objeto que se quiere agregar a la lista
       es decir que esta funcion primero verifica si ya el elemento existe mediante su nombre y nos pregunta si queremos 
       reemplazar la propiedad de telefono de este elemento con la solicitud http.put actuliza el valor de la pagina e igualmente en el 
       servidor simulado
*/

import { useEffect, useState } from 'react'
import "./App.css"
import PersonForm from './components/formNewPerson';
import Filter from './components/filter';
import Persons from './components/persons';
import personServices from "./services/persons.js"

const App = () => {
  /* 
   * Creacion del estado que se encargar de almacenar los elementos que provienen del servidor simulado 
   * en un array persons y la funcion de setPersons() que se va a encargar de almancer 
   * los cambios en el arreglo si se elimino , creo o actulizo algo en la interfaz para que 
   * así el servidor pueda mostrar correctamente los datos
   */
  const [persons, setPersons] = useState([]);

  /*
   * Se utiliza el hook useEffect para realizar la llamada a la funcion getAllPersons del archivo personServices que es 
   * donde se definieron las funciones y en este caso el efecto lo que va a hacer es hacer la solicitud para obtener 
   * todos los datos del servidor y los va a guardar en un array este array sera el nuevo valor que va a tener el estado de 
   * setPerson mostrando los datos en la interfaz
   */

  useEffect(() => {
    personServices.getAllPersons()
      .then((arrayPerson) => {
        setPersons(arrayPerson);
      })
  }, [])


  /*
  Recordar que como el useEffect este hook necesita unas dependencias para poder ejecutarse y saber cuando debe hacerlo
  entonces dentro de las dependencias le indicamos que quiero que se llame o se pida todos los datos del servidor para mostrarlo 
  en la interfaz solo una vez en el primer renderizado que muestra los elementos que provienen del 
  arreglo para que así se me muestren los cambios en tiempo real en la interfaz 
  si algo llegó a cambiar en el servidor
  */


  /*
   * La funcion para eliminar una persona o elemento en la interfaz:
   * lo que hace esta funcion es primero buscar en el array actual si se encuentra el id que esta funcion recibe 
   * como parametro de ser el caso que el id se encuentre entonces se procede a preguntar
   * usando el evento general window.confirm() con esto preguntamos al usuario en un cuadro de dialogo
   * si realmente quiere eliminar el elemento si la persona le da en marcar OK entonces el elemento se elimina 
   * y ya no se muestra en la interfaz e igualmente este elemento también se elimina del servidor simulado
   */

  const handleDelete = async (id) => {
    if (window.confirm("¿Estas seguro de que quieres eliminar este contacto?")) {
      try {
        const updatePersons = await personServices.deletePerson(id);
        setPersons(updatePersons);
      } catch (error) {
        console.log("ha ocurrido un error al intentar eliminar el elemento", error);
      }
    }
  };

  return (
    <>
      <h2>PhoneBook</h2>
      <Filter arrayPerson={persons} />
      <h3>Add A New Contact</h3>
      <PersonForm arrayPerson={persons} setPersons={setPersons} />
      <Persons arrayPersons={persons} handleDelete={handleDelete} />
    </>
  )
}

export default App
