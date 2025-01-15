import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import db from '../utils/firestore';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import DeleteItem from './deleteItem';
import { motion } from 'framer-motion';
import { useAuth } from '@clerk/nextjs'; // Import useAuth

interface PinItem {
  id: string;
  response: string; // Assuming 'response' is a string
  uid: string; // Add uid property to the interface
}

const PinBoard = () => {
  const { userId } = useAuth(); // Use useAuth to get the user ID
  const [items, setItems] = useState<PinItem[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const QuerySnapshot = await getDocs(collection(db, 'pins'));
      const fetchedItems = QuerySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          response: doc.data().response, // Changed to 'response'
          uid: doc.data().uid, // Assuming 'uid' is stored in the document
        })) as PinItem[];

      setItems(fetchedItems.filter(item => item.uid === userId)); // Filter items by user ID
    };
    fetchItems();
  }, [userId]); // Add userId as a dependency

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'pins', id)); // Use document id to delete
    setItems((prevItems) => prevItems.filter(item => item.id !== id)); // Update state after deletion
  };

  return (
    <div className="p-4 relative">
      <div className="absolute inset-0 bg-gray-900 opacity-30 rounded-lg"></div>
      <h2 className="text-xl font-bold mb-4 relative z-10">📌 Pins Board</h2>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full relative z-10">
          <img src="/no-pins.png" alt="No Pins Illustration" className="mb-4 w-3/4 md:w-1/2" />
          <p className="text-lg text-gray-400">No pins yet 😔</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="p-4 bg-gray-800 text-white rounded-lg shadow-lg transform-gpu"
              style={{
                perspective: 1000,
              }}
            >
              <Card className="relative p-4 rounded-lg">
                <motion.div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('/card-bg.png')`,
                  }}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <motion.div
                  className="relative z-10 p-4"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-lg font-semibold">{item.response}</h3>
                  <DeleteItem id={item.id} itemName={item.response} />
                </motion.div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PinBoard;
