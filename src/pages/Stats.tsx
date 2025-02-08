import React from 'react';
import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie,
  XAxis, YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { ArrowDown, ArrowUp, Users, MapPin, AlertTriangle, FileText } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  trend: 'up' | 'down';
  trendValue: string;
  icon: React.ComponentType<any>;
}

// Mock data
const monthlyData = [
  { name: 'Jan', value: 65 },
  { name: 'Feb', value: 78 },
  { name: 'Mar', value: 89 },
  { name: 'Apr', value: 92 },
  { name: 'May', value: 85 },
  { name: 'Jun', value: 94 },
  { name: 'Jul', value: 98 },
  { name: 'Aug', value: 110 },
  { name: 'Sep', value: 105 },
  { name: 'Oct', value: 115 },
  { name: 'Nov', value: 108 },
  { name: 'Dec', value: 120 }
];

const incidentTypes = [
  { name: 'Verbal Harassment', value: 425 },
  { name: 'Physical Harassment', value: 148 },
  { name: 'Online Abuse', value: 285 },
  { name: 'Discrimination', value: 342 },
  { name: 'Property Damage', value: 97 },
  { name: 'Workplace', value: 189 },
  { name: 'Public Services', value: 124 },
  { name: 'Other', value: 76 }
];

const locationData = [
  { name: 'NSW', value: 485 },
  { name: 'VIC', value: 423 },
  { name: 'QLD', value: 287 },
  { name: 'WA', value: 198 },
  { name: 'SA', value: 156 },
  { name: 'TAS', value: 89 },
  { name: 'ACT', value: 76 },
  { name: 'NT', value: 45 }
];

const StatsCard: React.FC<StatsCardProps> = ({ title, value, trend, trendValue, icon: Icon }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
      </div>
      <div className="p-3 bg-indigo-50 rounded-full">
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
    </div>
    <div className="mt-4 flex items-center">
      {trend === 'up' ? (
        <ArrowUp className="w-4 h-4 text-green-500" />
      ) : (
        <ArrowDown className="w-4 h-4 text-red-500" />
      )}
      <span className={`ml-2 text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
        {trendValue}
      </span>
    </div>
  </div>
);

const COLORS = ['#4F46E5', '#818CF8', '#A5B4FC', '#C7D2FE', '#E0E7FF', '#EEF2FF', '#F5F7FF', '#FAFAFA'];

const Stats: React.FC = () => {
  const totalReports = monthlyData.reduce((acc, curr) => acc + curr.value, 0);
  const previousMonthValue = monthlyData[monthlyData.length - 2].value;
  const currentMonthValue = monthlyData[monthlyData.length - 1].value;
  const monthlyGrowth = ((currentMonthValue - previousMonthValue) / previousMonthValue * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Incident Statistics</h1>
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FileText className="w-4 h-4 mr-2" />
            Download Report
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Reports"
            value={totalReports}
            trend="up"
            trendValue={`${monthlyGrowth}% vs last month`}
            icon={Users}
          />
          <StatsCard
            title="Most Common Location"
            value="NSW"
            trend="up"
            trendValue="485 incidents"
            icon={MapPin}
          />
          <StatsCard
            title="Primary Incident Type"
            value="Verbal"
            trend="up"
            trendValue="425 reports"
            icon={AlertTriangle}
          />
          <StatsCard
            title="Report Rate"
            value="89%"
            trend="up"
            trendValue="5% increase"
            icon={FileText}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Monthly Trend */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-6">Monthly Reports</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#4F46E5" 
                    strokeWidth={2}
                    name="Reported Incidents"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Incident Types */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-6">Incident Types</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incidentTypes} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Location Distribution */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-6">Location Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={locationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {locationData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key Findings */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-6">Key Findings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Reports Requiring Action</span>
                <span className="font-medium">76%</span>
                <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '76%' }} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Cases Resolved</span>
                <span className="font-medium">64%</span>
                <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '64%' }} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Follow-up Rate</span>
                <span className="font-medium">82%</span>
                <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '82%' }} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Support Provided</span>
                <span className="font-medium">91%</span>
                <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '91%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;