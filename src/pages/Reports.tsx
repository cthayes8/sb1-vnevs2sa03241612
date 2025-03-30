import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileSpreadsheet,
  Download,
  Calendar,
  ChevronDown,
  Users,
  TrendingUp,
  Search
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

type ReportType = 'deals' | 'customers' | 'activities' | 'performance';

interface ReportConfig {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  type: ReportType;
}

const reports: ReportConfig[] = [
  {
    title: 'Deals Report',
    description: 'Export all deals with status, value, and customer details',
    icon: TrendingUp,
    type: 'deals'
  },
  {
    title: 'Customer Report',
    description: 'Export customer list with contact information and deal history',
    icon: Users,
    type: 'customers'
  },
  {
    title: 'Activity Report',
    description: 'Export deal activities and interactions log',
    icon: Calendar,
    type: 'activities'
  },
  {
    title: 'Performance Report',
    description: 'Export sales performance metrics and analytics',
    icon: FileSpreadsheet,
    type: 'performance'
  }
];

const Reports = () => {
  const [dateRange, setDateRange] = useState<'all' | '30' | '90' | 'custom'>('30');
  const [startDate, setStartDate] = useState<string>(
    format(new Date().setDate(new Date().getDate() - 30), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExport = async (report: ReportConfig) => {
    setLoading(true);
    try {
      // Sample data - replace with actual data from your database
      const data = [
        {
          id: '1',
          title: 'Enterprise Deal',
          customer: 'Acme Corp',
          value: 50000,
          status: 'qualified',
          created_at: '2025-03-01'
        },
        {
          id: '2',
          title: 'SMB Package',
          customer: 'TechStart Inc',
          value: 25000,
          status: 'proposal',
          created_at: '2025-03-15'
        }
      ];

      // Create workbook
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, report.title);

      // Generate filename
      const filename = `${report.type}_report_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;

      // Save file
      XLSX.writeFile(wb, filename);
    } catch (error) {
      console.error('Error exporting report:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(report =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Reports</h1>
          <p className="text-muted-foreground mt-1">Generate and download reports for your sales data</p>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background text-foreground border border-input rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Date Range */}
            <div className="flex flex-wrap gap-4">
              <div className="relative">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as any)}
                  className="appearance-none bg-background text-foreground border border-input rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="30">Last 30 Days</option>
                  <option value="90">Last 90 Days</option>
                  <option value="all">All Time</option>
                  <option value="custom">Custom Range</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>

              {dateRange === 'custom' && (
                <>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-background text-foreground border border-input rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-background text-foreground border border-input rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReports.map((report) => (
            <motion.div
              key={report.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl border border-border p-6 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <report.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{report.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => handleExport(report)}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;