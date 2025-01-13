import "../App.css";
const Persons = ({ arrayPersons, handleDelete }) => {

  return (
    <>
      <div className="containerContacts">
        {arrayPersons.map((person) => (
          <div key={person.id} className="contact">

            <i className="bi bi-person-square"></i>

            <div className="contactsProperties">
              <span>{person.name}: </span>
              <span>{person.phone}</span>
            </div>

            <div>
              <button onClick={() => handleDelete(person.id)} className="deleteBtn">Eliminar</button>
            </div>

          </div>
        ))}
      </div>
    </>
  );
};

export default Persons;
