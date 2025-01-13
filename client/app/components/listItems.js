'use client'

import { useState, useEffect } from 'react';
import db from '../utils/firestore';
import { collection, getDocs } from 'firebase/firestore';
import DeleteItem from './deleteItem';

const ListItems = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            const QuerySnapshot = await getDocs(collection(db, 'items'));
            setItems(
                QuerySnapshot.docs.map(
                    (doc) => (
                        { id: doc.id, ...doc.data() }
                    )
                )
            );
        }
        fetchItems();
    }, []);

    return (
        <div className="space-y-4">
            {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg shadow-md">
                    <p className="text-lg text-white">{item.name}</p>
                    <p className="text-sm text-gray-400">{item.completed ? 'Completed' : 'Not Completed'}</p>
                    <DeleteItem id={item.id} />
                </div>
            ))}
        </div>
    );
}

export default ListItems;