import React, { useEffect, useState } from 'react';
import { getStudentProblemData } from '../api/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CustomHeatmap from './CustomHeatMap';
import 'react-calendar-heatmap/dist/styles.css';

function ProblemSolvingStats({ id }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState(30);
    const [activeTab, setActiveTab] = useState('summary');

    useEffect(() => {
        fetchProblemData();
        // eslint-disable-next-line
    }, [range]);

    const fetchProblemData = async () => {
        try {
            setLoading(true);
            const res = await getStudentProblemData(id, range);
            setStats(res.data);
        } catch (err) {
            setStats(null);
        } finally {
            setLoading(false);
        }
    };

    const handleRangeChange = (newRange) => setRange(newRange);

    // Helper for heatmap color
    const getHeatmapColorStyle = (count) => {
        if (!count) return { fill: '#f3f4f6', backgroundColor: '#f3f4f6' };
        if (count >= 10) return { fill: '#f472b6', backgroundColor: '#f472b6' };
        if (count >= 5) return { fill: '#f9a8d4', backgroundColor: '#f9a8d4' };
        if (count >= 3) return { fill: '#fbcfe8', backgroundColor: '#fbcfe8' };
        return { fill: '#fdf2f8', backgroundColor: '#fdf2f8' };
    };

    // Tooltip for bar chart
    const CustomBarChartTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-pink-100/90 p-3 rounded-lg border border-pink-300/30 shadow-lg">
                    <p className="text-pink-700 font-medium">Rating: {label}</p>
                    <p className="text-pink-600 font-bold">{payload[0].value} Problems Solved</p>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-pink-400 border-solid"></div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="p-6 text-center">
                <div className="p-6 bg-pink-100/60 rounded-xl border border-pink-300/30">
                    <svg className="mx-auto h-12 w-12 text-pink-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-pink-400 mb-2">Error Loading Data</h3>
                    <p className="text-pink-500">Could not load problem solving statistics.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* Range Selector */}
            <div className="flex justify-center gap-2 mb-6">
                {[7, 30, 90].map((r) => (
                    <button
                        key={r}
                        onClick={() => handleRangeChange(r)}
                        className={`px-4 py-2 rounded-full font-semibold transition-all
                            ${range === r
                                ? 'bg-gradient-to-r from-pink-400 to-yellow-400 text-white shadow'
                                : 'bg-pink-50 text-pink-700 hover:bg-pink-100'}`}
                    >
                        Last {r} days
                    </button>
                ))}
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-6 gap-2">
                <button
                    onClick={() => setActiveTab('summary')}
                    className={`px-4 py-2 rounded-full font-semibold transition-all
                        ${activeTab === 'summary'
                            ? 'bg-pink-500 text-white'
                            : 'bg-pink-50 text-pink-700 hover:bg-pink-100'}`}
                >
                    Summary
                </button>
                <button
                    onClick={() => setActiveTab('distribution')}
                    className={`px-4 py-2 rounded-full font-semibold transition-all
                        ${activeTab === 'distribution'
                            ? 'bg-pink-500 text-white'
                            : 'bg-pink-50 text-pink-700 hover:bg-pink-100'}`}
                >
                    Rating Distribution
                </button>
                <button
                    onClick={() => setActiveTab('heatmap')}
                    className={`px-4 py-2 rounded-full font-semibold transition-all
                        ${activeTab === 'heatmap'
                            ? 'bg-pink-500 text-white'
                            : 'bg-pink-50 text-pink-700 hover:bg-pink-100'}`}
                >
                    Activity
                </button>
            </div>

            {/* Summary Tab */}
            {activeTab === 'summary' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                        <span className="text-pink-500 text-2xl font-bold mb-2">{stats.totalSolved}</span>
                        <span className="text-pink-700 font-semibold">Total Solved</span>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                        <span className="text-yellow-500 text-2xl font-bold mb-2">{stats.averageRating}</span>
                        <span className="text-yellow-700 font-semibold">Average Rating</span>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                        <span className="text-sky-500 text-2xl font-bold mb-2">{stats.averagePerDay}</span>
                        <span className="text-sky-700 font-semibold">Average per Day</span>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                        <span className="text-pink-500 text-2xl font-bold mb-2">
                            {stats.mostDifficultProblem ? stats.mostDifficultProblem.rating : 'N/A'}
                        </span>
                        <span className="text-pink-700 font-semibold">Most Difficult Problem</span>
                        {stats.mostDifficultProblem && (
                            <a
                                href={stats.mostDifficultProblem.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block mt-1 text-pink-500 underline text-sm hover:text-pink-700"
                            >
                                {stats.mostDifficultProblem.name}
                            </a>
                        )}
                    </div>
                </div>
            )}

            {/* Recent Problems */}
            {activeTab === 'summary' && stats.recentProblems && stats.recentProblems.length > 0 && (
                <div className="bg-white rounded-xl shadow p-6 mb-8">
                    <h3 className="text-lg font-semibold text-pink-700 mb-4">Recent Problems</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {stats.recentProblems.map((problem, idx) => (
                            <div
                                key={idx}
                                className="bg-pink-50 rounded-lg p-4 border border-pink-100 hover:border-pink-300 transition-all"
                            >
                                <a
                                    href={problem.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-pink-600 hover:text-pink-500 font-medium"
                                >
                                    {problem.name}
                                </a>
                                <div className="mt-2 flex items-center justify-between">
                                    <div className="text-xs text-pink-400">{new Date(problem.solvedDate).toLocaleDateString()}</div>
                                    <div className="px-2 py-1 bg-pink-200 rounded-full text-xs font-medium text-pink-700">
                                        Rating: {problem.rating || 'N/A'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Rating Distribution Tab */}
            {activeTab === 'distribution' && (
                <div className="bg-white rounded-xl shadow p-6 mb-8">
                    <h3 className="text-lg font-semibold text-pink-700 mb-4">Problems Solved per Rating Bucket</h3>
                    {Object.keys(stats.solvedPerRatingBucket).length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-center">
                            <svg className="h-12 w-12 text-pink-200 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-pink-400">No data available for chart.</p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={Object.entries(stats.solvedPerRatingBucket).map(([rating, count]) => ({
                                    rating: rating === '0' ? 'Non Rated' : rating,
                                    count
                                }))}
                                margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                            >
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f472b6" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#fbcfe8" stopOpacity={0.8} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#fbcfe8" opacity={0.5} />
                                <XAxis
                                    dataKey="rating"
                                    tick={{ fill: "#f472b6" }}
                                    label={{
                                        value: 'Problem Rating',
                                        position: 'insideBottom',
                                        offset: -10,
                                        fill: '#f472b6'
                                    }}
                                />
                                <YAxis
                                    allowDecimals={false}
                                    tick={{ fill: "#f472b6" }}
                                    label={{
                                        value: 'Problems Solved',
                                        angle: -90,
                                        position: 'insideLeft',
                                        fill: '#f472b6'
                                    }}
                                />
                                <Tooltip content={<CustomBarChartTooltip />} />
                                <Bar
                                    dataKey="count"
                                    fill="url(#barGradient)"
                                    radius={[4, 4, 0, 0]}
                                    animationDuration={1500}
                                    animationEasing="ease-in-out"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'heatmap' && (
                <div className="bg-white rounded-xl shadow p-6 mb-8">
                    <h3 className="text-lg font-semibold text-pink-700 mb-4">Submission Activity</h3>
                    {stats.submissionHeatmap.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-center">
                            <svg className="h-12 w-12 text-pink-200 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-pink-400">No submission activity in this period.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="p-3 w-full max-w-2xl overflow-x-auto">
                                <CustomHeatmap
                                    data={stats.submissionHeatmap}
                                    startDate={new Date(new Date().setDate(new Date().getDate() - range))}
                                    endDate={new Date()}
                                    onCellClick={() => {}}
                                />
                            </div>
                            <div className="flex justify-end mt-4 w-full max-w-2xl">
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs text-pink-400">Less</span>
                                    {[0, 1, 3, 5, 10].map((level) => (
                                        <div
                                            key={level}
                                            className="w-3 h-3 rounded-sm"
                                            style={getHeatmapColorStyle(level)}
                                        />
                                    ))}
                                    <span className="text-xs text-pink-400">More</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Streak Info */}
            {stats.streakInfo && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
                        <span className="text-pink-700 text-sm font-medium mb-1">Current Streak</span>
                        <span className="text-2xl font-bold text-pink-500">{stats.streakInfo.currentStreak} days</span>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
                        <span className="text-pink-700 text-sm font-medium mb-1">Longest Streak</span>
                        <span className="text-2xl font-bold text-pink-500">{stats.streakInfo.longestStreak} days</span>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
                        <span className="text-pink-700 text-sm font-medium mb-1">Total Active Days</span>
                        <span className="text-2xl font-bold text-pink-500">{stats.streakInfo.totalActiveDays} days</span>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
                        <span className="text-pink-700 text-sm font-medium mb-1">Submissions Today</span>
                        <span className="text-2xl font-bold text-pink-500">{stats.streakInfo.submissionsToday || 0}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProblemSolvingStats;