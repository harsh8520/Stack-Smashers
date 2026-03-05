import { useState } from 'react';
import {
    LayoutDashboard,
    FileText,
    History as HistoryIcon,
    BarChart3,
    Settings,
    Search,
    Bell,
    User,
    Zap,
    ChevronDown,
    Filter,
    Download,
    Eye,
    Sparkles,
    TrendingUp,
    TrendingDown
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type HistoryProps = {
    onNavigate: (screen: 'landing' | 'login' | 'signup' | 'dashboard' | 'processing' | 'results' | 'history' | 'settings') => void;
};

export default function History({ onNavigate }: HistoryProps) {
    const [activeNav, setActiveNav] = useState('history');

    const navItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'review', icon: FileText, label: 'Review Content' },
        { id: 'history', icon: HistoryIcon, label: 'History' },
        { id: 'analytics', icon: BarChart3, label: 'Analytics' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    const handleNavClick = (id: string) => {
        setActiveNav(id);
        if (id === 'review' || id === 'dashboard') {
            onNavigate('dashboard');
        } else if (id === 'settings') {
            onNavigate('settings');
        }
    };

    const reviews = [
        {
            id: 1,
            title: 'How to Build Better Habits',
            platform: 'Blog',
            score: 82,
            date: '2026-02-04',
            time: '2:30 PM',
            wordCount: 1250
        },
        {
            id: 2,
            title: 'The Future of AI in Education',
            platform: 'LinkedIn',
            score: 88,
            date: '2026-02-03',
            time: '10:15 AM',
            wordCount: 650
        },
        {
            id: 3,
            title: '5 Tips for Productive Remote Work',
            platform: 'Medium',
            score: 75,
            date: '2026-02-01',
            time: '4:45 PM',
            wordCount: 890
        },
        {
            id: 4,
            title: 'Understanding Machine Learning Basics',
            platform: 'Blog',
            score: 91,
            date: '2026-01-30',
            time: '11:20 AM',
            wordCount: 1800
        },
        {
            id: 5,
            title: 'Why Emotional Intelligence Matters',
            platform: 'LinkedIn',
            score: 79,
            date: '2026-01-28',
            time: '3:00 PM',
            wordCount: 580
        },
    ];

    const chartData = [
        { date: 'Jan 28', score: 79 },
        { date: 'Jan 30', score: 91 },
        { date: 'Feb 01', score: 75 },
        { date: 'Feb 03', score: 88 },
        { date: 'Feb 04', score: 82 },
    ];

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-orange-600';
        return 'text-red-600';
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 80) return 'bg-green-50';
        if (score >= 60) return 'bg-orange-50';
        return 'bg-red-50';
    };

    const averageScore = Math.round(reviews.reduce((acc, r) => acc + r.score, 0) / reviews.length);
    const trend = reviews[0].score > reviews[reviews.length - 1].score ? 'up' : 'down';
    const trendValue = Math.abs(reviews[0].score - reviews[reviews.length - 1].score);

    return (
        <>

            <div className="min-h-screen bg-[#F8FAFC] flex">
                {/* Sidebar */}
                <div className="w-64 bg-white border-r border-[#E5E7EB] flex flex-col">
                    <div className="p-6 border-b border-[#E5E7EB]">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-semibold">ContentLens AI</span>
                        </div>
                    </div>

                    <nav className="flex-1 p-4">
                        <ul className="space-y-1">
                            {navItems.map((item) => (
                                <li key={item.id}>
                                    <button
                                        onClick={() => handleNavClick(item.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeNav === item.id
                                                ? 'bg-blue-50 text-[#2563EB]'
                                                : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="p-4 border-t border-[#E5E7EB]">
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-gray-700">Free Plan</span>
                                <Sparkles className="w-4 h-4 text-[#2563EB]" />
                            </div>
                            <div className="text-xs text-gray-600 mb-2">2 of 5 reviews used</div>
                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-[#2563EB] w-[40%]"></div>
                            </div>
                            <button className="text-xs text-[#2563EB] font-medium mt-3 hover:underline">
                                Upgrade to Pro
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Top Bar */}
                    <div className="bg-white border-b border-[#E5E7EB] px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 max-w-md">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-sm"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors relative">
                                    <Bell className="w-5 h-5 text-gray-600" />
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                                </button>
                                <button className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-8">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold mb-1">History & Analytics</h1>
                            <p className="text-sm text-gray-600">Track your content quality over time</p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-3 gap-6 mb-6">
                            <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
                                <div className="text-sm text-gray-600 mb-1">Total Reviews</div>
                                <div className="text-3xl font-bold">{reviews.length}</div>
                            </div>
                            <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
                                <div className="text-sm text-gray-600 mb-1">Average Score</div>
                                <div className="flex items-baseline gap-2">
                                    <div className={`text-3xl font-bold ${getScoreColor(averageScore)}`}>
                                        {averageScore}
                                    </div>
                                    <div className="text-sm text-gray-500">/ 100</div>
                                </div>
                            </div>
                            <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
                                <div className="text-sm text-gray-600 mb-1">Score Trend</div>
                                <div className="flex items-center gap-2">
                                    <div className="text-3xl font-bold">{trendValue}%</div>
                                    {trend === 'up' ? (
                                        <TrendingUp className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <TrendingDown className="w-5 h-5 text-red-600" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 mb-6">
                            <h3 className="font-semibold mb-4">Score Improvement Over Time</h3>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 12 }}
                                        stroke="#9CA3AF"
                                    />
                                    <YAxis
                                        domain={[0, 100]}
                                        tick={{ fontSize: 12 }}
                                        stroke="#9CA3AF"
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            fontSize: '12px'
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#2563EB"
                                        strokeWidth={2}
                                        dot={{ fill: '#2563EB', r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Reviews Table */}
                        <div className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
                                <h3 className="font-semibold">Recent Reviews</h3>
                                <button className="flex items-center gap-2 px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-sm hover:bg-gray-50 transition-colors">
                                    <Filter className="w-4 h-4" />
                                    Filter
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-[#E5E7EB]">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Title</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Platform</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Words</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Score</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#E5E7EB]">
                                        {reviews.map((review) => (
                                            <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-sm">{review.title}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-600">{review.platform}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-600">{review.wordCount.toLocaleString()}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${getScoreBgColor(review.score)}`}>
                                                        <span className={`font-bold ${getScoreColor(review.score)}`}>
                                                            {review.score}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-600">{review.date}</div>
                                                    <div className="text-xs text-gray-500">{review.time}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => onNavigate('results')}
                                                            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                                                            title="View Report"
                                                        >
                                                            <Eye className="w-4 h-4 text-gray-600" />
                                                        </button>
                                                        <button
                                                            onClick={() => alert('Report would be downloaded as PDF')}
                                                            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                                                            title="Download"
                                                        >
                                                            <Download className="w-4 h-4 text-gray-600" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}