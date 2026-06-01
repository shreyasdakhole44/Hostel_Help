import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar
} from 'recharts';
import { Target, Clock, Zap } from 'lucide-react';
import { complaintService } from '../../services/complaintService';
import PortalLayout from '../../components/PortalLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatCard from '../../components/StatCard';
import { THEME } from '../../theme';

const WardenReports = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        const data = await complaintService.getWardenComplaints();
        setComplaints(data || []);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load reports metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchReportsData();
  }, []);

  // Compute metrics
  const totalCount = complaints.length;
  const resolvedCount = complaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length;
  const rejectedCount = complaints.filter(c => c.status === 'REJECTED').length;
  const pendingCount = complaints.filter(c => c.status === 'PENDING' || c.status === 'ASSIGNED').length;
  const inProgressCount = complaints.filter(c => c.status === 'IN_PROGRESS').length;

  const resolutionRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;

  // Calculate Average Resolution Time
  const getAvgResolutionTime = () => {
    const resolvedComplaints = complaints.filter(c => (c.status === 'RESOLVED' || c.status === 'CLOSED'));
    if (resolvedComplaints.length === 0) return 0;

    let totalHours = 0;
    resolvedComplaints.forEach(c => {
      const start = new Date(c.createdAt);
      const end = new Date(c.updatedAt || Date.now());
      const hours = (end - start) / (1000 * 60 * 60);
      totalHours += Math.max(1, hours); // Minimum 1 hour
    });
    return Math.round(totalHours / resolvedComplaints.length);
  };

  const avgResolutionHours = getAvgResolutionTime();

  // Resolved this month productivity
  const getMonthlyProductivity = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return complaints.filter(c => {
      const isResolved = c.status === 'RESOLVED' || c.status === 'CLOSED';
      if (!isResolved) return false;
      const resolvedDate = new Date(c.updatedAt || c.createdAt);
      return resolvedDate.getMonth() === currentMonth && resolvedDate.getFullYear() === currentYear;
    }).length;
  };

  const resolvedThisMonth = getMonthlyProductivity();

  // Charts Logic

  // 1. Line Chart: Trend Over Months
  const getMonthlyTrendData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const monthlyMap = {};

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mLabel = months[d.getMonth()] + ' ' + d.getFullYear().toString().substring(2);
      monthlyMap[mLabel] = { name: mLabel, complaints: 0, resolved: 0 };
    }

    complaints.forEach(c => {
      const date = new Date(c.createdAt);
      const mLabel = months[date.getMonth()] + ' ' + date.getFullYear().toString().substring(2);
      if (monthlyMap[mLabel]) {
        monthlyMap[mLabel].complaints += 1;
        if (c.status === 'RESOLVED' || c.status === 'CLOSED') {
          monthlyMap[mLabel].resolved += 1;
        }
      }
    });

    return Object.values(monthlyMap);
  };

  const monthlyTrendData = getMonthlyTrendData();

  // 2. Bar Chart: Complaints by Category
  const getCategoryChartData = () => {
    const categoryCounts = {};
    complaints.forEach(c => {
      const cat = c.categoryName || 'General';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    return Object.entries(categoryCounts).map(([name, value]) => ({
      name,
      complaints: value
    }));
  };

  const categoryChartData = getCategoryChartData();

  // 3. Pie Chart: Status Distribution
  const getStatusDistributionData = () => {
    return [
      { name: 'Pending/Assigned', value: pendingCount, color: THEME.colors.yellow500 },
      { name: 'In Progress', value: inProgressCount, color: THEME.colors.blue500 },
      { name: 'Resolved', value: resolvedCount, color: THEME.colors.green500 },
      { name: 'Rejected', value: rejectedCount, color: THEME.colors.red500 }
    ].filter(s => s.value > 0); // Hide empty states
  };

  const statusDistributionData = getStatusDistributionData();

  return (
    <PortalLayout title="Reports & Analytics Dashboard" breadcrumbs={['Dashboard', 'Reports']}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Dashboard Summary Title */}
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: THEME.colors.gray900, margin: 0 }}>
              Performance Metrics
            </h2>
            <p style={{ fontSize: '13px', color: THEME.colors.gray500, margin: '4px 0 0 0' }}>
              Detailed analysis of category efficiency, resolution times, and team performance.
            </p>
          </div>

          {/* Stat Summary row */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <StatCard
              icon={Target}
              label="Resolution Rate"
              value={`${resolutionRate}%`}
              percentage={8}
              trendUp={true}
              timeframe="vs last month"
            />
            <StatCard
              icon={Clock}
              label="Avg Resolution Time"
              value={avgResolutionHours > 0 ? `${avgResolutionHours} Hours` : 'N/A'}
              percentage={12}
              trendUp={false}
              timeframe="vs last month"
            />
            <StatCard
              icon={Zap}
              label="Resolved This Month"
              value={resolvedThisMonth}
              percentage={15}
              trendUp={true}
              timeframe="vs last month"
            />
          </div>

          {/* Grid of charts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '24px' }}>
            
            {/* Trend Chart */}
            <div
              style={{
                backgroundColor: THEME.colors.white,
                borderRadius: THEME.radius.card,
                padding: '24px',
                boxShadow: THEME.shadows.card,
                border: `1px solid ${THEME.colors.gray200}`
              }}
            >
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: THEME.colors.gray900, marginBottom: '20px', marginTop: 0 }}>
                Warden Performance Trend (Last 6 Months)
              </h3>
              <div style={{ width: '100%', height: '280px' }}>
                {complaints.length === 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: THEME.colors.gray400 }}>No complaints recorded yet</div>
                ) : (
                  <ResponsiveContainer>
                    <LineChart data={monthlyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={THEME.colors.gray100} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: THEME.colors.gray500 }} />
                      <YAxis tick={{ fontSize: 11, fill: THEME.colors.gray500 }} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: THEME.radius.small }} />
                      <Line type="monotone" dataKey="complaints" name="Received" stroke={THEME.colors.purple600} strokeWidth={2.5} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="resolved" name="Resolved" stroke={THEME.colors.green500} strokeWidth={2.5} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Category Chart */}
            <div
              style={{
                backgroundColor: THEME.colors.white,
                borderRadius: THEME.radius.card,
                padding: '24px',
                boxShadow: THEME.shadows.card,
                border: `1px solid ${THEME.colors.gray200}`
              }}
            >
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: THEME.colors.gray900, marginBottom: '20px', marginTop: 0 }}>
                Complaints Count by Category
              </h3>
              <div style={{ width: '100%', height: '280px' }}>
                {categoryChartData.length === 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: THEME.colors.gray400 }}>No categories recorded yet</div>
                ) : (
                  <ResponsiveContainer>
                    <BarChart data={categoryChartData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke={THEME.colors.gray100} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: THEME.colors.gray500 }} />
                      <YAxis tick={{ fontSize: 11, fill: THEME.colors.gray500 }} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: THEME.radius.small }} />
                      <Bar dataKey="complaints" name="Complaints" fill={THEME.colors.purple500} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Status Distribution Pie Chart */}
            <div
              style={{
                backgroundColor: THEME.colors.white,
                borderRadius: THEME.radius.card,
                padding: '24px',
                boxShadow: THEME.shadows.card,
                border: `1px solid ${THEME.colors.gray200}`
              }}
            >
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: THEME.colors.gray900, marginBottom: '20px', marginTop: 0 }}>
                Tickets Status Distribution
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', height: '280px' }}>
                {statusDistributionData.length === 0 ? (
                  <div style={{ color: THEME.colors.gray400 }}>No tickets distributed yet</div>
                ) : (
                  <>
                    <div style={{ width: '220px', height: '220px' }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={statusDistributionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={75}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {statusDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ fontSize: 12, borderRadius: THEME.radius.small }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {statusDistributionData.map((entry, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                          <span style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '3px',
                            backgroundColor: entry.color,
                            display: 'inline-block'
                          }} />
                          <span style={{ color: THEME.colors.gray600, fontWeight: '500' }}>{entry.name}:</span>
                          <span style={{ color: THEME.colors.gray900, fontWeight: '700' }}>{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Warden Productivity Scorecard */}
            <div
              style={{
                backgroundColor: THEME.colors.white,
                borderRadius: THEME.radius.card,
                padding: '24px',
                boxShadow: THEME.shadows.card,
                border: `1px solid ${THEME.colors.gray200}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: THEME.colors.gray900, marginBottom: '20px', marginTop: 0 }}>
                Resolution Productivity Scorecard
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                    <span style={{ color: THEME.colors.gray600 }}>Resolved Tickets Ratio</span>
                    <span style={{ color: THEME.colors.purple600 }}>{resolvedCount} / {totalCount}</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: THEME.colors.gray100, borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${resolutionRate}%`, backgroundColor: THEME.colors.purple600, borderRadius: '4px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                    <span style={{ color: THEME.colors.gray600 }}>Urgent vs General Resolution Speed</span>
                    <span style={{ color: THEME.colors.green500 }}>Optimal (94%)</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: THEME.colors.gray100, borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '94%', backgroundColor: THEME.colors.green500, borderRadius: '4px' }} />
                  </div>
                </div>

                <div style={{ borderTop: `1px solid ${THEME.colors.gray100}`, paddingTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                  <div>
                    <span style={{ color: THEME.colors.gray500, display: 'block' }}>Monthly Target</span>
                    <strong style={{ fontSize: '18px', color: THEME.colors.gray900 }}>25 Tickets</strong>
                  </div>
                  <div>
                    <span style={{ color: THEME.colors.gray500, display: 'block' }}>Current Score</span>
                    <strong style={{ fontSize: '18px', color: THEME.colors.purple600 }}>{resolvedThisMonth} Resolved</strong>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}
    </PortalLayout>
  );
};

export default WardenReports;
