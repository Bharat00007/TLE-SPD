import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudentById } from '../api/api';
import { Loader2, ArrowLeft } from 'lucide-react';
import ProblemSolvingStats from '../components/ProblemSolvingStats';
import ContestHistory from '../components/ContestHistory';

function StudentProfilePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStudent();
        // eslint-disable-next-line
    }, [id]);

    const fetchStudent = async () => {
        try {
            setLoading(true);
            const res = await getStudentById(id);
            setStudent(res.data);
        } catch (err) {
            setStudent(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-green-50">
                <Loader2 className="animate-spin text-blue-400" size={48} />
            </div>
        );
    }

    if (!student) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-blue-50 to-green-50">
                <h2 className="text-2xl font-bold text-red-500 mb-2">Student Not Found</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow transition flex items-center gap-2"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg shadow transition flex items-center gap-2"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1">
                        <h1 className="text-3xl font-extrabold text-blue-600 mb-2">{student.name}</h1>
                        <div className="text-gray-700 mb-2">
                            <span className="font-semibold">Email:</span> {student.email}
                        </div>
                        <div className="text-gray-700 mb-2">
                            <span className="font-semibold">Phone:</span> {student.phone}
                        </div>
                        <div className="text-gray-700 mb-2">
                            <span className="font-semibold">CF Handle:</span>{' '}
                            <span className="font-mono px-2 py-1 rounded bg-blue-50 text-blue-700">{student.cfHandle}</span>
                        </div>
                        <div className="flex gap-4 mt-4">
                            <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold shadow">
                                Current Rating: {student.currentRating}
                            </div>
                            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold shadow">
                                Max Rating: {student.maxRating}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="bg-gradient-to-br from-blue-200 to-green-200 rounded-full w-28 h-28 flex items-center justify-center shadow-lg">
                            <span className="text-5xl font-bold text-blue-600">{student.name[0]}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-2">Last updated: {new Date(student.lastUpdated).toLocaleString()}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <ProblemSolvingStats id={student._id} />
                    </div>
                    <div>
                        <ContestHistory id={student._id} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentProfilePage;