
/* componente encargado de crear la interfaz para filtrar las caracteríticas de un contacto
 * Como Funciona Este Componente: 
 * En la interfaz web se muestra un campo de ( input ) para ingresar un nombre que puede corresponder 
 * a un elemento dentro del arreglo que almacena los datos de todos los contactos con el nombre y el numero de 
 * telefono, para este caso en el campo solo ingresaremos el nombre y si hay coincidencias del nombre ingresado 
 * con un que ya existe en el arreglo entonces en la interfaz vamos a mostrar ese elemento que se busco 
 * con las propiedades de Name y Phone 
 * Pero caso contrario si el nombre que ingramos no coincide con ningún elemento dentro del arreglo 
 * entonces devolvemos un mensaje como el siguiente ( Not Results Found )
*/

/* Importacion del Hook useState() para controlar los estados y actualizar 
 * el valor de la variable con el nombre que se ingrese en el input cada vez que se escriba un nuevo nombre
*/
import { useState } from "react";
import "../App.css"

/* El componente Filter recibe como parametro el arreglo que contiene a la lista de contactos que en este caso 
 * vamos a usar para filtrar un solo elemento 
*/
const Filter = ({ arrayPerson }) => {

  /* Definición de las variables y funciones que van a actualizar las variables
   * - setFilterName() función encargada de actualizar el valor de la variable filterName 
   *   cada vez que se ingrese un nuevo nombre.
   *
   * - setFilteredPerson(): función encarga de actualizar el valor de la variable filteredPerson
   *   que va almancar el elemento encontrado en la lista del arreglo si el nombre ingresado en 
   *   el campo coincide con este elemento y así poder mostrar en la interfaz este elemento 
   *   con las caracteríticas del Name y el Phone
   */
  const [filterName, setFilterName] = useState("");
  const [filteredPerson, setFilteredPerson] = useState(null); // Manejo del estado para una sola persona

  /* Función principal: handleFilterInput 
   * Esta funcion lo que hace es primero obtener el nombre ingresado en el campo del input 
   * y lo almacena el variable filterName actualizando su valor por medio de la función setFilterName.
   *
   * Luego comprobamos si el campo ( input ) no se encuentra vacío ya que 
   * si este ( input ) esta vacío y no contienen ningún nombre 
   * entonces debemos mostrar el mensaje de ( Not Results Found) 
   *
   * Si el input o esta vacío
   * comprobamos recorriendo el arreglo con los elementos si el nombre que se ha ingresado en el 
   * campo de input se encuentra dentro de este arreglo de ser caso lo guardamos en la variable personFound.
   *
   * Actualizamos el valor de la variable filteredPerson con el elemento que se encontro en el arreglo 
   * con la funcion setFilteredPerson() así podremos mostrarlo en la inerfaz
   */
  const handleFilterInput = (event) => {
    const value = event.target.value;
    setFilterName(value);

    if (value.trim() === "") {
      // Si el campo está vacío, no mostrar nada
      setFilteredPerson(null);
      return;
    }

    // Buscar la persona que coincida con el nombre ingresado
    const personFound = arrayPerson.find((person) =>
      person.name.toLowerCase().includes(value.toLowerCase())
    );

    // Actualizar el estado con la persona encontrada o null si no coincide
    setFilteredPerson(personFound || null);
  };

  return (
    <div className="filter">
      <div className="containerFilter">
        <h3>Find A Contact</h3>
        <small>Enter the name of the contact you want to search for...</small>
        <input
          className="filterInput"
          type="text"
          placeholder="Enter name"
          value={filterName}
          onChange={handleFilterInput}
        />
      </div>
      <br />
      {filteredPerson ? (
        <div>
          <p>
            <strong>Name:</strong> {filteredPerson.name}
          </p>
          <p>
            <strong>Phone:</strong> {filteredPerson.phone}
          </p>
        </div>
      ) : (
        filterName && <p>No results found</p>
      )}
    </div>
  );
};

export default Filter;

