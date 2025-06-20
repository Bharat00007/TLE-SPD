import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

function DeleteConfirmModal({ student, onClose, onConfirm }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-pink-50 to-yellow-50/80 backdrop-blur-sm p-2 sm:p-4">
            <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                className="relative bg-white border border-pink-200 p-4 sm:p-8 rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-md"
            >
                {/* Decorative Icon */}
                <div className="flex justify-center mb-4">
                    <span className="inline-flex items-center justify-center rounded-full bg-pink-100 p-3 shadow-lg">
                        <Trash2 size={36} className="text-pink-500" />
                    </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold mb-2 text-center text-pink-600 drop-shadow">Delete Confirmation</h2>
                <p className="mb-6 text-yellow-700 text-center text-sm sm:text-base">
                    Are you sure you want to <span className="font-semibold text-pink-500">delete</span> <span className="font-semibold">{student.name}</span>?
                    <br />
                    <span className="text-xs text-gray-400">(This action cannot be undone.)</span>
                </p>
                <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-5 py-2 rounded-lg transition cursor-pointer font-semibold"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800 text-white px-5 py-2 rounded-lg shadow transition cursor-pointer font-semibold flex items-center justify-center gap-2"
                    >
                        <Trash2 size={18} className="inline-block" />
                        Delete
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

export default DeleteConfirmModal;