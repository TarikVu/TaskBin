// Card UI displayed in a Column. 
// TODO: Add button functionality
// Planned add a way to have a close-up look
const Card = ({ card, columnId, delCard }) => (
    <div className="card">
        <button className="delete-button"
            onClick={() => delCard({
                columnId: columnId,
                cardId: card._id
            })}>
            X
        </button>
        <button className="edit-button" >Edit</button>
        <h3>{card.title}</h3>
        <p>{card.text}</p>

        <span className={`card-priority ${getPriorityClass(card.priority)}`}>
            {card.priority}
        </span>

    </div>
);

const getPriorityClass = (priority) => {
    if (priority === 'urgent') return 'urgent-priority';
    if (priority === 'high') return 'high-priority';
    if (priority === 'normal') return 'normal-priority';
    return '';
}
export default Card;