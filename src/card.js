// Card UI displayed in a Column. 
// TODO: Add button functionality
// Planned add a way to have a close-up look
const Card = ({ card, columnId, delCard }) => (
    <div className="card">
        <button className="delete-button"
            onClick={() => delCard(card._id, columnId)}>
            X
        </button>
        <button className="edit-button" >Edit</button>
        <h3>{card.title}</h3>
        <p>{card.text}</p>
    </div>
);
export default Card;