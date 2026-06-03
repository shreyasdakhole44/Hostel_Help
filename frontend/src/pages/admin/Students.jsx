import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { complaintService } from '../../services/complaintService';
import DashboardLayout from '../../components/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { THEME } from '../../theme';
import { Search, Users } from 'lucide-react';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [togglingMap, setTogglingMap] = useState({});

  const fetchStudents = async () => {
    try {
      const data = await complaintService.getAdminStudents();
      setStudents(data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load students list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleToggleStatus = async (student) => {
    const confirmToggle = window.confirm(
      `Are you sure you want to ${student.status === 'INACTIVE' ? 'activate' : 'deactivate'} student ${student.name}?`
    );
    if (!confirmToggle) return;

    setTogglingMap((prev) => ({ ...prev, [student.id]: true }));
    try {
      await complaintService.toggleUserStatus(student.id);
      toast.success(`Status updated for student: ${student.name}`);
      await fetchStudents();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update student status.');
    } finally {
      setTogglingMap((prev) => ({ ...prev, [student.id]: false }));
    }
  };

  const getInitials = (n) => {
    if (!n) return 'S';
    return n
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Filter students
  const filteredStudents = students.filter((stud) => {
    const matchesStatus = statusFilter === 'ALL' || stud.status === statusFilter;
    const matchesSearch =
      stud.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stud.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (stud.roomNumber && stud.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (stud.phone && stud.phone.includes(searchQuery));
    return matchesStatus && matchesSearch;
  });

  return (
    <DashboardLayout title="Student Accounts" breadcrumbs={['Admin', 'Users', 'Students']}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: THEME.colors.gray900, margin: 0 }}>
                Students
              </h2>
              <span
                style={{
                  backgroundColor: THEME.colors.purple100,
                  color: THEME.colors.purple600,
                  fontSize: '12px',
                  fontWeight: '700',
                  padding: '4px 10px',
                  borderRadius: THEME.radius.badge
                }}
              >
                {students.length} Total
              </span>
            </div>
          </div>

          {/* Filters and Search */}
          <div
            style={{
              backgroundColor: THEME.colors.white,
              borderRadius: THEME.radius.card,
              padding: '16px 24px',
              boxShadow: THEME.shadows.card,
              border: `1px solid ${THEME.colors.gray200}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            {/* Search */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span style={{ position: 'absolute', left: '12px', color: THEME.colors.gray500, display: 'flex', alignItems: 'center' }}>
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="Search by name, email, room..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  height: '38px',
                  width: '260px',
                  backgroundColor: THEME.colors.gray50,
                  border: `1px solid ${THEME.colors.gray200}`,
                  borderRadius: THEME.radius.input,
                  padding: '0 12px 0 36px',
                  fontSize: '13px',
                  outline: 'none',
                  transition: THEME.transition
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = THEME.colors.purple500;
                  e.target.style.boxShadow = `0 0 0 3px rgba(139,92,246,0.1)`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = THEME.colors.gray200;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Status pills toggle filter */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {['ALL', 'ACTIVE', 'INACTIVE'].map((f) => {
                const isActive = statusFilter === f;
                return (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    style={{
                      background: isActive ? THEME.gradients.primaryBtn : 'transparent',
                      color: isActive ? THEME.colors.white : THEME.colors.gray500,
                      border: `1.5px solid ${isActive ? 'transparent' : THEME.colors.gray200}`,
                      borderRadius: THEME.radius.badge,
                      padding: '4px 12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: THEME.transition
                    }}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Students Table */}
          {filteredStudents.length === 0 ? (
            <EmptyState
              icon={Users}
              heading="No students found"
              subtext={searchQuery ? "We couldn't find any students matching your search criteria." : "No student accounts are currently registered."}
            />
          ) : (
            <div
              style={{
                backgroundColor: THEME.colors.white,
                borderRadius: THEME.radius.card,
                boxShadow: THEME.shadows.card,
                border: `1px solid ${THEME.colors.gray200}`,
                overflow: 'hidden'
              }}
            >
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ backgroundColor: THEME.colors.gray50, borderBottom: `1px solid ${THEME.colors.gray200}` }}>
                      <th style={{ padding: '14px 20px', color: THEME.colors.gray500, fontWeight: '700' }}>Student Details</th>
                      <th style={{ padding: '14px 20px', color: THEME.colors.gray500, fontWeight: '700' }}>Email Address</th>
                      <th style={{ padding: '14px 20px', color: THEME.colors.gray500, fontWeight: '700' }}>Phone Number</th>
                      <th style={{ padding: '14px 20px', color: THEME.colors.gray500, fontWeight: '700' }}>Room No</th>
                      <th style={{ padding: '14px 20px', color: THEME.colors.gray500, fontWeight: '700' }}>Joined Date</th>
                      <th style={{ padding: '14px 20px', color: THEME.colors.gray500, fontWeight: '700' }}>Status Toggle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((stud) => {
                      const isToggling = togglingMap[stud.id];
                      return (
                        <tr
                          key={stud.id}
                          style={{ borderBottom: `1px solid ${THEME.colors.gray100}`, transition: THEME.transition }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = THEME.colors.gray50; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                          {/* Name + Initials Avatar */}
                          <td style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                backgroundColor: THEME.colors.purple50,
                                color: THEME.colors.purple600,
                                fontWeight: '700',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '13px'
                              }}
                            >
                              {getInitials(stud.name)}
                            </div>
                            <span style={{ fontWeight: '600', color: THEME.colors.gray900 }}>{stud.name}</span>
                          </td>
                          <td style={{ padding: '14px 20px', color: THEME.colors.gray700 }}>{stud.email}</td>
                          <td style={{ padding: '14px 20px', color: THEME.colors.gray700 }}>{stud.phone || '—'}</td>
                          <td style={{ padding: '14px 20px', color: THEME.colors.gray900, fontWeight: '600' }}>{stud.roomNumber || '—'}</td>
                          <td style={{ padding: '14px 20px', color: THEME.colors.gray500 }}>
                            {new Date(stud.createdAt || Date.now()).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '14px 20px' }}>
                            <button
                              onClick={() => handleToggleStatus(stud)}
                              disabled={isToggling}
                              style={{
                                backgroundColor: stud.status === 'INACTIVE' ? '#FEE2E2' : '#D1FAE5',
                                color: stud.status === 'INACTIVE' ? THEME.colors.red500 : THEME.colors.green500,
                                border: `1px solid ${stud.status === 'INACTIVE' ? THEME.colors.red500 : THEME.colors.green500}`,
                                borderRadius: THEME.radius.badge,
                                padding: '4px 12px',
                                fontSize: '11px',
                                fontWeight: '700',
                                cursor: isToggling ? 'not-allowed' : 'pointer',
                                transition: THEME.transition
                              }}
                            >
                              {isToggling ? '...' : (stud.status === 'INACTIVE' ? 'Inactive' : 'Active')}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Students;
