

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
   * lo primero es que cuando se envíe la respuesta del servidor que trae los datos de mongoDB 
   * debemos mapear esos datos que que el valor del _id que es lo que trabaja mongo sea el valor 
   * del id que ya tenemos definido en el arreglo y lo mostramos actualizando la función de 
   * setPersons
   */

   useEffect(() => {
    const fetchPersons = async () => {
      try {
        const arrayPerson = await personServices.getAllPersons();
        const mappedPersons = arrayPerson.map((person) => ({
          ...person,
          id: person._id
        }))

        setPersons(mappedPersons);

      } catch (err) {
        console.log("Ha ocurrido un error al obtener los contactos");
      }
    };
    fetchPersons();
  }, []);
  /*
  Recordar que como el useEffect este hook necesita unas dependencias para poder ejecutarse y saber cuando debe hacerlo
  entonces dentro de las dependencias le indicamos que quiero que se llame o se pida todos los datos del servidor para mostrarlo 
  en la interfaz solo una vez en el primer renderizado que muestra los elementos que provienen del 
  arreglo para que así se me muestren los cambios en tiempo real en la interfaz 
  si algo llegó a cambiar en el servidor
  */


  /*
   * la funcion para eliminar un contacto: 
   * esta función lo que hace es primero preguntar si realmente queremos eliminar este contacto 
   * si el usuario confirma entonces vamos a obtner el valor del id de ese elemento 
   * pero para hacer est primero debemos obtner el valor de ese nuevo id ya que se esta trabajando con 
   * mongoDB entonces mongo almacena los datos con el valor de _id y nosotros si viene el arreglo de objetos
   * con ese valor vamos a darle ese valor a la variable de id
   * y vamos a llamar la funcion de deletePerson  para eliminar ese arreglo 
   * y luego para poder ver ese cambio directamente en al interfaz 
   * vamos a recorrer el arreglo de personas que ya obtuvimos 
   * y vamos a mostrar solo los elementos qe sean diferentes del id que yo ya elimine
   */
  const handleDelete = async (person) => {
    if (window.confirm("¿Estas seguro de que quieres eliminar este contacto?")) {
      try {
        const id = person.id ?? person._id;
        await personServices.deletePerson(id);
        setPersons(prevPersons => prevPersons.filter(personx => (personx.id ?? personx._id) !== id));

      } catch (error) {
        console.log("Ha ocurrido un error al eliminar el contacto");
      }
    }
  };

  const handlePerson = async (person) => {
    try {
      let response = null;
      if (person.id ?? person._id) {
        const id = person.id ?? person._id;
        response = await personServices.updatePhonePerson(id, person);
      } else {
        response = await personServices.createPerson(person);
      }

      setPersons((prevPersons) => {
        const id = response.id ?? response._id;
        return person.id || person._id ? prevPersons.map(prevPerson => (prevPerson.id ?? prevPerson._id) === id ? { ...response, id: id } : prevPerson) : [...prevPersons, { ...response, id: id }]
      })

    } catch (error) {
      console.log(error);
    }
  };


  return (
    <>
      <h2>PhoneBook</h2>
      <Filter arrayPersons={persons} />
      <h3>Add A New Contact</h3>
      <PersonForm arrayPerson={persons} setPersons={handlePerson} />
      {persons && <Persons arrayPersons={persons} handleDelete={handleDelete} />}
    </>
  )
}

export default App
