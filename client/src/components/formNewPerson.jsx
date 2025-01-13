
/* 
 * Componente de PersonForm: Uno de los componentes principales 
 * Como funciona: Encargado de mostrar en la interfaz de la web un formulario 
 * con dos campos uno que corresponde a que se ingrese un nombre y el otro para que se ingrese 
 * un numero de telefono 
 * Aquí se obtienen los valores ingresados en estos dos campos de ( Inputs ) 
 * y se hace una verificación si los datos ingresados como el nombre ya existe dentro 
 * del arreglo de elementos o contactos y de ser el caso que ese elemento ya exista
 * entonces se pregunta si quieres actualizar el valor del numero de telefono de la persona ( Name )
 * y si deseas hacerlo se mostrará en la interfaz el usuario con el mismo nombre pero el numero de telefono 
 * modificado. 
 */

/* Importaciones de los estados useState para crear 
 * estados de las variables y actualizar el valor de estas variables
 * Importacion de las funciones asíncronas que provienen del archivo personServices que se encargan de hacer las solicitudes al servidor 
 * con Axios.
*/
import { useState } from "react";
import personServices from "../services/persons.js";
import "../App.css"

/* El componente PersonForm recibe como parametros arrayPerson ( que es el arreglo que contiene 
 * todos los elementos o contactos ) , setPersons() que es la funcion encargada de actualizar los 
 * valores del arreglo cada vez que se agrega , elimina , actualiza o obtiene los elementos 
 * esta funcion se encargara de mantener los datos bien actualizados para poder mostrar los cambios 
*/
const PersonForm = ({ arrayPerson, setPersons }) => {
  /* Variables de estado y funciones que se van a encargar de actualizar estas variables */
  const [newName, setNewName] = useState(""); // se actualiza el valor de la variable cada vez que yo ingreso un nuevo nombre
  const [newNumber, setNewNumber] = useState("");// se actualiza el valor de la variable cada vez que yo ingreso un nuevo telefono

  /* Función handleSubmitForm Es al encargada de enviar los datos que se ingresaron en el formulario con los campos 
   * de Name y Phone,
   * Como funciona: 
   *
   * 1. primero evita el comportamiento por defecto que tienen los formulario al enviar los datos, lo que hace 
   * es recargar de nuevo la pagina pero en este caso la pagina ya no se va a recargar
   *
   * 2. crea un nuevo objeto el cual tiene las propiedades que de name , phone y su valor 
   * va a depender del que tenga el newName y newNumber cuando en la interfaz se ingrese el nombre y el telefono 
   * ese nuevo objeto el que vamos a crear va a contener ese valores ingresados
   *
   * 3. Hace una verificación con el atributo name del objeto y la propiedad name de los elementos 
   * que estan guardados en el arreglo para comprobar si el elemento que yo esoty intentanto crear 
   * ya existe dentro del arreglo de elementos y lo guarda en la variable existingPerson
   * 
   * Dado el caso que el usuario exista dentro de mi arreglo de elementos 
   * pues entonces vamos a mostrar un mensaje emergente con el metodo confirm() 
   * Message: el usuario ya existe pero deseas cambiar o reemplazar el numero de telefono 
   * si la respuesta es si entonces devolvemos en la interfaz el nuevo elemento con el mismo
   * nombre pero con el teelfono actualizado
   * Si la respuesta es NO entonces devolvemos un mensaje de error
   * 4. Si ya se hizo toda la comprobación y los datos que se estan ingresando no corresponde
   * con ningún elemento dentro del arreglo de entonces llamamos a la funcion para crear un 
   * nuevo elemento en la interfaz y se meustra
   */

  const handleSubmitForm = async (event) => {

    event.preventDefault();
    const newPerson = {
      name: newName,
      phone: newNumber
    }

    const existingPerson = arrayPerson.find((person) => person.name === newPerson.name);

    if (existingPerson) {
      const confirmation = window.confirm(
        `The contact "${newPerson.name}" already exists. Do you want to replace the phone number?`
      );

      if (confirmation) {
        try {
          const updatedPerson = { ...existingPerson, phone: newNumber };
          const responseUpdate = await personServices.updatePhonePerson(existingPerson.id, updatedPerson);

          setPersons((prevPersons) =>
            prevPersons.map((person) =>
              person.id === responseUpdate.id ? responseUpdate : person
            )
          );

        } catch (error) {
          console.log("ha ocurrido un error", error)
        }

      }
    } else {
      try {
        const createdPerson = await personServices.createPerson(newPerson);
        setPersons((prevPersons) => [...prevPersons, createdPerson]);

      } catch (error) {
        console.log(`Failed to add "${newPerson.name}". Please try again.`);
      }
    }

    setNewName("");
    setNewNumber("");

    setTimeout(() => setNotification(null), 3000);
  };

  /* Controladores de eventos para los campos de ( Input ) del formulario 
   * 1. handleInputValue : se encarga de obtener el valor ingresado en el campo del nombre (Name)
   * y lo agrega a la variable de newName por medio de la función setNewName
   *
   * 2. handleInputNumber: se encarga de obtener el valor ingresado en el campo de telefono ( Phone )
   * y lo agrega a la variabe de newNumber por medio de la función setNewNumber
   */

  const handleInputValue = (event) => {
    let value = event.target.value;
    setNewName(value);
  }

  const handleInputNumber = (event) => {
    let value = event.target.value;
    setNewNumber(value);
  }


  return (
    <div className="containerForm">
      <form onSubmit={handleSubmitForm} className="form">
        <div className="inputName">
          Name: <input value={newName} onChange={handleInputValue} className="inputForm" />
        </div>
        <div className="inputPhone">
          Phone: <input value={newNumber} onChange={handleInputNumber}  className="inputForm"/>
        </div>
        <div>
          <button type='submit' className="submitBtn">Add</button>
        </div>
      </form>
    </div>
  );
}

export default PersonForm;
