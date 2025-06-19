import React from 'react';

// Helper: get color for submission count
function getColor(count) {
    if (!count) return '#f3f4f6'; // gray-100
    if (count >= 10) return '#3b82f6'; // blue-500
    if (count >= 5) return '#60a5fa'; // blue-400
    if (count >= 3) return '#93c5fd'; // blue-300
    return '#dbeafe'; // blue-100
}

export default function CustomHeatmap({ data, startDate, endDate, onCellClick }) {
    // Generate weeks and days for the heatmap grid
    const days = [];
    let current = new Date(startDate);
    while (current <= endDate) {
        days.push({
            date: current.toISOString().slice(0, 10),
            count: (data.find(d => d.date === current.toISOString().slice(0, 10)) || {}).count || 0,
        });
        current.setDate(current.getDate() + 1);
    }
    // Group days into weeks
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }

    return (
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
            <div className="mb-2 text-blue-600 font-semibold">Activity Heatmap</div>
            <div style={{ display: "flex", gap: 2 }}>
                {weeks.map((week, wi) => (
                    <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {week.map((day, di) => (
                            <div
                                key={di}
                                title={`${day.date}: ${day.count} submissions`}
                                style={{
                                    width: 18,
                                    height: 18,
                                    background: getColor(day.count),
                                    borderRadius: 6,
                                    cursor: "pointer",
                                    border: "1px solid #e5e7eb",
                                    transition: "background 0.2s"
                                }}
                                onClick={() => onCellClick && onCellClick(day)}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-2 mt-4">
                <span className="text-xs text-gray-400">Less</span>
                <div className="w-4 h-4 rounded" style={{ background: '#f3f4f6', border: '1px solid #e5e7eb' }} />
                <div className="w-4 h-4 rounded" style={{ background: '#dbeafe', border: '1px solid #e5e7eb' }} />
                <div className="w-4 h-4 rounded" style={{ background: '#93c5fd', border: '1px solid #e5e7eb' }} />
                <div className="w-4 h-4 rounded" style={{ background: '#60a5fa', border: '1px solid #e5e7eb' }} />
                <div className="w-4 h-4 rounded" style={{ background: '#3b82f6', border: '1px solid #e5e7eb' }} />
                <span className="text-xs text-gray-400">More</span>
            </div>
        </div>
    );
}