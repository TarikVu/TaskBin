// Card UI displayed in a Column. 
// TODO: Add button functionality
// Planned add a way to have a close-up look
const Card = ({ title, text }) => (
    <div className="card">
        <button className="delete-button" >X</button>
        <button className="edit-button" >Edit</button>
        <h3>{title}</h3>
        <p>{text}</p>
    </div>
);
export default Card;