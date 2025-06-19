import React, { useState, useEffect } from 'react';

function StudentForm({ onClose, onSave, initialData }) {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        cfHandle: '',
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                name: initialData.name || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                cfHandle: initialData.cfHandle || '',
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-pink-500 text-xl font-bold"
                    aria-label="Close"
                >
                    ×
                </button>
                <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center">
                    {initialData ? 'Edit Student' : 'Add Student'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-yellow-200 focus:border-pink-400 focus:outline-none bg-yellow-50"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-pink-200 focus:border-pink-400 focus:outline-none bg-pink-50"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-sky-200 focus:border-pink-400 focus:outline-none bg-sky-50"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">CF Handle</label>
                        <input
                            type="text"
                            name="cfHandle"
                            value={form.cfHandle}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-pink-200 focus:border-pink-400 focus:outline-none bg-pink-50"
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 rounded-lg bg-pink-500 text-white font-semibold hover:bg-pink-600 transition shadow"
                        >
                            {initialData ? 'Update' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default StudentForm;