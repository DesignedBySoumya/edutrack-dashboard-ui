
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const WeeklyProgress = () => {
    const data = [
        { name: 'Mon', hours: 4 }, { name: 'Tue', hours: 3 },
        { name: 'Wed', hours: 5 }, { name: 'Thu', hours: 2 },
        { name: 'Fri', hours: 6 }, { name: 'Sat', hours: 8 },
        { name: 'Sun', hours: 3 },
    ];

    return (
        <div className="bg-[#1a1a1d] rounded-xl p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Weekly Progress</h2>
            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2d" />
                        <XAxis dataKey="name" tick={{ fill: '#a1a1aa' }} />
                        <YAxis tick={{ fill: '#a1a1aa' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#0e0e10', border: '1px solid #2a2a2d' }} />
                        <Bar dataKey="hours" fill="#3B82F6" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
