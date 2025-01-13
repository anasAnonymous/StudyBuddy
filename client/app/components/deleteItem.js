import db from '../utils/firestore';
import { collection, deleteDoc, doc } from 'firebase/firestore';

const DeleteItem = ({ id }) => {
    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, 'items', id));
            alert('Item deleted successfully');
        } catch (err) {
            console.error('Error deleting document:', err);
        }
    }

    return (
        <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-200">Delete</button>
    )
}
export default DeleteItem;
