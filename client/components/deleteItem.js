import db from '../utils/firestore';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from './ui/button';

const DeleteItem = ({ id, itemName }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [deletedItem, setDeletedItem] = useState('');

    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, 'pins', id));
            setDeletedItem(itemName);
            setIsDialogOpen(true);
        } catch (err) {
            console.error('Error deleting document:', err);
        }
    }

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        window.location.reload(); // Refresh the page when the dialog is closed
    }

    return (
        <>
            <Button onClick={handleDelete} variant="destructive" className='w-full mt-4'>Delete</Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Item Deleted</DialogTitle>
                    </DialogHeader>
                    <p className="text-center">Pin deleted successfully</p>
                    <button onClick={handleCloseDialog} className="mt-4 px-4 py-2 bg-red-600 text-white rounded">Close</button>
                </DialogContent>
            </Dialog>
        </>
    )
}
export default DeleteItem;
