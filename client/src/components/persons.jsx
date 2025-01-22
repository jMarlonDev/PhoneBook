import "../App.css";
const Persons = ({ arrayPersons, handleDelete }) => {
  console.log(arrayPersons);
  return (
    <>
      <div className="containerContacts">
        {arrayPersons.map((person) => (
          <div key={person.id} className="contact"> {/* Añadimos la prop key */}

            <i className="bi bi-person-square"></i>

            <div className="contactsProperties">
              <span>{person.name}: </span>
              <span>{person.phone}</span>
            </div>

            <div>
              <button onClick={() => handleDelete(person)} className="deleteBtn">Eliminar</button>
            </div>

          </div>
        ))}
      </div>
    </>
  );
};

export default Persons;
