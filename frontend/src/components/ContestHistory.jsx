import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getStudentContestData } from '../api/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ContestHistory({ id }) {
    const [contests, setContests] = useState([]);
    const [range, setRange] = useState(90);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('graph');

    useEffect(() => {
        fetchContestHistory();
        // eslint-disable-next-line
    }, [range]);

    const fetchContestHistory = async () => {
        try {
            setLoading(true);
            const res = await getStudentContestData(id, range || 90);
            setContests(res.data.contests);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching contest history:', error);
            toast.error('Failed to fetch contest history.');
            setLoading(false);
        }
    };

    const handleRangeChange = (newRange) => {
        setRange(newRange);
    };

    const formatChartData = () => {
        return contests.map((contest) => ({
            contestDate: contest.contestDate,
            newRating: contest.newRating,
        }));
    };

    const getRatingChangeColor = (change) => {
        if (change > 0) return 'text-pink-500';
        if (change < 0) return 'text-sky-500';
        return 'text-gray-400';
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-pink-100/90 backdrop-blur-sm p-4 rounded-lg border border-pink-300/30 shadow-lg">
                    <p className="text-pink-700 font-medium">{label}</p>
                    <p className="text-pink-600 font-bold">Rating: {payload[0].value}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-sky-50 p-2 sm:p-4 md:p-8 flex flex-col items-center">
            <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
            <div className="w-full max-w-7xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-pink-600 mb-4 md:mb-0 drop-shadow-lg tracking-tight">
                        Contest History
                    </h2>
                    {/* Filter Buttons */}
                    <div className="flex gap-2 flex-wrap justify-center">
                        {[30, 90, 365].map((r) => (
                            <button
                                key={r}
                                onClick={() => handleRangeChange(r)}
                                className={`group relative px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer
                                    ${range === r 
                                        ? 'bg-gradient-to-r from-pink-400 to-yellow-400 text-white shadow-lg shadow-pink-300/30' 
                                        : 'bg-slate-200/50 text-gray-700 hover:bg-pink-100/80'}`}
                            >
                                <span className="relative z-10">Last {r} days</span>
                                {range === r && (
                                    <span className="absolute inset-0 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-lg 
                                          animate-pulse opacity-40 blur-sm"></span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Selector */}
                <div className="flex mb-6 border-b border-pink-200/50 flex-wrap">
                    <button 
                        onClick={() => setActiveTab('graph')}
                        className={`px-4 sm:px-6 py-2 sm:py-3 font-medium transition-all duration-300 cursor-pointer ${activeTab === 'graph' 
                            ? 'text-pink-500 border-b-2 border-pink-500' 
                            : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Rating Graph
                    </button>
                    <button 
                        onClick={() => setActiveTab('table')}
                        className={`px-4 sm:px-6 py-2 sm:py-3 font-medium transition-all duration-300 cursor-pointer ${activeTab === 'table' 
                            ? 'text-pink-500 border-b-2 border-pink-500' 
                            : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Contest Details
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-ping h-4 w-4 mr-2 rounded-full bg-pink-400"></div>
                        <div className="animate-ping h-4 w-4 rounded-full bg-yellow-400"></div>
                    </div>
                ) : contests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <svg className="h-16 w-16 text-pink-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-pink-400">No contests found in this period.</p>
                    </div>
                ) : (
                    <>
                        {activeTab === 'graph' && (
                            <div className="animate-fade-in">
                                <div className="bg-white rounded-xl border border-pink-100 p-2 sm:p-4 mb-4 shadow">
                                    <h3 className="text-base sm:text-lg font-medium text-pink-700 mb-4">Rating Progress</h3>
                                    <div className="w-full h-[220px] sm:h-[350px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={formatChartData()}>
                                                <defs>
                                                    <linearGradient id="ratingGradient" x1="0" y1="0" x2="1" y2="0">
                                                        <stop offset="0%" stopColor="#f472b6" />
                                                        <stop offset="100%" stopColor="#facc15" />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#fbcfe8" opacity={0.5} />
                                                <XAxis dataKey="contestDate" tick={{fill: "#f472b6"}} />
                                                <YAxis tick={{fill: "#f472b6"}} />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Line 
                                                    type="monotone" 
                                                    dataKey="newRating" 
                                                    stroke="url(#ratingGradient)" 
                                                    strokeWidth={3}
                                                    dot={{r: 6, strokeWidth: 2, stroke: "#f472b6", fill: "#fff"}}
                                                    activeDot={{r: 8, stroke: "#f472b6", strokeWidth: 2, fill: "#facc15"}}
                                                    animationDuration={1500}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'table' && (
                            <div className="animate-fade-in">
                                <div className="overflow-x-auto w-full">
                                    <table className="min-w-[900px] divide-y divide-pink-100 text-xs sm:text-sm md:text-base rounded-xl overflow-hidden border border-pink-100 bg-white shadow">
                                        <thead className="bg-pink-50">
                                            <tr>
                                                <th scope="col" className="px-2 sm:px-6 py-2 sm:py-4 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Contest Name</th>
                                                <th scope="col" className="px-2 sm:px-6 py-2 sm:py-4 text-center text-xs font-medium text-pink-700 uppercase tracking-wider">Rating</th>
                                                <th scope="col" className="px-2 sm:px-6 py-2 sm:py-4 text-center text-xs font-medium text-pink-700 uppercase tracking-wider">Change</th>
                                                <th scope="col" className="px-2 sm:px-6 py-2 sm:py-4 text-center text-xs font-medium text-pink-700 uppercase tracking-wider">Rank</th>
                                                <th scope="col" className="px-2 sm:px-6 py-2 sm:py-4 text-center text-xs font-medium text-pink-700 uppercase tracking-wider">Problems Unsolved</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-pink-50">
                                            {contests.map((contest, index) => (
                                                <tr key={contest.contestId}
                                                    className="hover:bg-pink-50 transition-colors duration-150"
                                                    style={{ animationDelay: `${index * 50}ms` }}>
                                                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm font-medium text-pink-900">{contest.contestName}</td>
                                                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-center text-sm font-bold text-pink-700">
                                                        {contest.newRating}
                                                    </td>
                                                    <td className={`px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-center text-sm font-medium ${getRatingChangeColor(contest.newRating - contest.oldRating)}`}>
                                                        {contest.newRating - contest.oldRating > 0 ? '+' : ''}
                                                        {contest.newRating - contest.oldRating}
                                                    </td>
                                                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-center text-sm text-pink-700">{contest.rank}</td>
                                                    <td className={
                                                        "px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-center text-sm font-semibold " +
                                                        (contest.problemsUnsolved === 0
                                                            ? 'bg-yellow-100 text-yellow-700'
                                                            : 'bg-pink-100 text-pink-500')
                                                    }>
                                                        {contest.problemsUnsolved}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default ContestHistory;