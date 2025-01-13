import { useState } from 'react';
import db from '../utils/firestore';
import { collection, addDoc } from 'firebase/firestore';

const AddItem = () => {
    const [value, setValue] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const docRef = await addDoc(collection(db, 'items'), {
                name: value,
                completed: false,
            });
            console.log('Document written with ID: ', docRef.id);
            setValue('');

        } catch (err) {
            console.error('Error adding document:', err);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg shadow-md">
            <input 
                type='text'
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder='Add Item'
                className="flex-1 p-2 border text-white border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
                type='submit' 
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
            >
                Add Item
            </button>
        </form>
    )
}

export default AddItem;