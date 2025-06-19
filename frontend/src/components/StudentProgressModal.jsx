import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './Dialog';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { fetchStudentProgress } from '../api/api';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function StudentProgressModal({ student, onClose, setLoading }) {
    const [ratingData, setRatingData] = useState([]);
    const [submissionData, setSubmissionData] = useState([]);

    useEffect(() => {
        if (student) {
            loadProgressData();
        }

        return () => {
            setLoading(false);
        };
        // eslint-disable-next-line
    }, [student]);

    const loadProgressData = async () => {
        try {
            setLoading(true);
            const progress = await fetchStudentProgress(student.cfHandle);
            setRatingData(progress.data.ratingHistory);
            setSubmissionData(progress.data.submissionHistory);
        } catch (error) {
            console.error('Error fetching student progress:', error);
            toast.error(
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error.message ||
                'Failed to fetch student progress. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            className="w-full max-w-4xl"
        >
            <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
            <Dialog open={true} onOpenChange={onClose}>
                <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br from-yellow-50 via-pink-50 to-sky-50 border border-pink-200 shadow-2xl rounded-2xl p-2 sm:p-4 md:p-6 relative">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-pink-400 hover:text-pink-600 transition cursor-pointer rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-pink-300"
                        aria-label="Close"
                    >
                        <X size={28} />
                    </button>
                    <DialogHeader>
                        <DialogTitle className="text-xl sm:text-2xl md:text-3xl text-pink-600 font-extrabold mb-4 drop-shadow-lg text-center">
                            {student.name}&apos;s Codeforces Progress
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-8">
                        {/* Rating Graph */}
                        <div>
                            <h2 className="text-base sm:text-lg font-semibold text-pink-700 mb-2 text-center sm:text-left">Rating Progress</h2>
                            {ratingData.length > 0 ? (
                                <div className="w-full h-[220px] sm:h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={ratingData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#fbcfe8" opacity={0.5} />
                                            <XAxis hide={true} dataKey="contestName" />
                                            <YAxis domain={['auto', 'auto']} />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="rating" stroke="#f472b6" strokeWidth={3} dot={{ r: 5, fill: "#fff", stroke: "#f472b6", strokeWidth: 2 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="text-pink-400 bg-pink-50 rounded p-4 text-center">No rating data available.</div>
                            )}
                        </div>

                        {/* Submission Heatmap */}
                        <div>
                            <h2 className="text-base sm:text-lg font-semibold text-pink-700 mb-2 text-center sm:text-left">Submission Heatmap</h2>
                            {submissionData.length > 0 ? (
                                <>
                                    <div className="w-full overflow-x-auto flex justify-center">
                                        <div className="min-w-[320px] max-w-full sm:max-w-[500px] md:max-w-[700px]">
                                            <CalendarHeatmap
                                                startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
                                                endDate={new Date()}
                                                values={submissionData}
                                                classForValue={() => 'color-empty'}
                                                tooltipDataAttrs={value => ({ 'data-tip': `${value.date}: ${value.count} submissions` })}
                                                transformDayElement={(element, value) => {
                                                    let fillColor = '#fce7f3';
                                                    if (value && value.count >= 10) fillColor = '#f472b6';
                                                    else if (value && value.count >= 5) fillColor = '#f9a8d4';
                                                    else if (value && value.count >= 3) fillColor = '#fbcfe8';
                                                    else if (value && value.count >= 1) fillColor = '#fdf2f8';
                                                    return React.cloneElement(element, { style: { fill: fillColor } });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {/* Color Legend */}
                                    <div className="flex flex-wrap items-center gap-4 mt-4 justify-center">
                                        <div className="flex items-center gap-1">
                                            <div className="w-4 h-4 rounded bg-[#fdf2f8] border border-pink-200"></div>
                                            <span className="text-xs text-pink-500">1-2</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="w-4 h-4 rounded bg-[#fbcfe8] border border-pink-200"></div>
                                            <span className="text-xs text-pink-500">3-4</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="w-4 h-4 rounded bg-[#f9a8d4] border border-pink-200"></div>
                                            <span className="text-xs text-pink-500">5-9</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="w-4 h-4 rounded bg-[#f472b6] border border-pink-200"></div>
                                            <span className="text-xs text-pink-500">10+</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-pink-400 bg-pink-50 rounded p-4 text-center">No submission data available.</div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}

export default StudentProgressModal;