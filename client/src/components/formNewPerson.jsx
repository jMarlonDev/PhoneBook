
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
import "../App.css"

const PersonForm = ({ arrayPerson, setPersons }) => {
  // variables de estado para cambiar y actualizar los valores 
  // de el nombre y el telefono ingresado en el input
  const [newName, setNewName] = useState(""); 
  const [newNumber, setNewNumber] = useState("");

  /* 
   * La funcion handleSubmitForm lo que hace evitar el comportamiento por defecto de recargar la pagina
   * y creamos un nuevo objeto newPerson y le vamos a dar los valores que tenga actualemente en las 
   * variables de newName y newPerson para que sean las propiedades del nuevo objeto,
   * luego verificamos si el nombre que yo estoy ingresando para crear un nuevo contacto 
   * si ese nombre ya existe entonces le indicamos con una ventana emergente 
   * para decir que el contacto ya existe pero si queremos podemos actualizar el numero de telefono 
   * de aquel contacto y el cambio se hara inmediatamente en al interfaz
   * y actualizamos el valor del numero de telefono del usuario y lo envíamos en la funcion de 
   * actualización del arreglo de contacts para mostrar los cambios en la interfaz
   *
   * Pero si despues de verificar si el nombre ingresado no existe entonces se trata de una creación 
   * de un nuevo contacto entonces envíamos a la función para actualizar 
   * el arreglo de contactos y le envíamos el nuevo contacto que queremos visualizar en la interfaz
   * */
  const handleSubmitForm = async (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
      phone: newNumber
    };
    const existingPerson = arrayPerson.find((person) => person.name === newPerson.name);
    if (existingPerson) {
      const confirmation = window.confirm(`The contact "${newPerson.name}" already exists. Do you want to replace the phone number?`);
      if (confirmation) {
        setPersons({ ...existingPerson, phone: newPerson.phone });
      }

    } else {
      setPersons(newPerson);
    }
    setNewName("");
    setNewNumber("");
  };

 /* Contraladores de eventos para obtener el valor ingresado en los campos de input 
  * name y phone en la interfaz y también se encarga de actualizar las variables de newName y newPerson 
  * para que cada vez que se ingrese un nuevo nombre y telefono en los campos estas variables van a tomar ese valor*/
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
          Name: <input value={newName} onChange={handleInputValue} className="inputForm" required />
        </div>
        <div className="inputPhone">
          Phone: <input value={newNumber} onChange={handleInputNumber} className="inputForm" required />
        </div>
        <div>
          <button type='submit' className="submitBtn">Add</button>
        </div>
      </form>
    </div>
  );
};

export default PersonForm;
