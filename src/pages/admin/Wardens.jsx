import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { complaintService } from '../../services/complaintService';
import DashboardLayout from '../../components/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';
import { THEME } from '../../theme';

const Wardens = () => {
  const [wardens, setWardens] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Slide-over drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [submittingWarden, setSubmittingWarden] = useState(false);
  const [togglingMap, setTogglingMap] = useState({});

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const fetchWardensAndCategories = async () => {
    try {
      const [wardenData, catData] = await Promise.all([
        complaintService.getAdminWardens(),
        complaintService.getAdminCategories()
      ]);
      setWardens(wardenData || []);
      setCategories(catData || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load warden accounts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWardensAndCategories();
  }, []);

  const handleToggleStatus = async (warden) => {
    const confirmToggle = window.confirm(
      `Are you sure you want to ${warden.status === 'INACTIVE' ? 'activate' : 'deactivate'} warden ${warden.name}?`
    );
    if (!confirmToggle) return;

    setTogglingMap((prev) => ({ ...prev, [warden.id]: true }));
    try {
      await complaintService.toggleUserStatus(warden.id);
      toast.success(`Warden ${warden.name} status updated.`);
      await fetchWardensAndCategories();
    } catch (error) {
      console.error(error);
      toast.error('Failed to toggle warden status.');
    } finally {
      setTogglingMap((prev) => ({ ...prev, [warden.id]: false }));
    }
  };

  const handleCreateWarden = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !phone) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setSubmittingWarden(true);
    try {
      await complaintService.createWarden({
        name,
        email,
        password,
        phone,
        categoryId: categoryId ? parseInt(categoryId) : null
      });

      toast.success('New Warden account registered successfully!');
      setDrawerOpen(false);
      
      // Reset form
      setName('');
      setEmail('');
      setPassword('');
      setPhone('');
      setCategoryId('');
      
      await fetchWardensAndCategories();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Failed to create warden account.';
      toast.error(msg);
    } finally {
      setSubmittingWarden(false);
    }
  };

  const getInitials = (n) => {
    if (!n) return 'W';
    return n
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Filter wardens
  const filteredWardens = wardens.filter((w) => {
    const matchesStatus = statusFilter === 'ALL' || w.status === statusFilter;
    const matchesSearch =
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.assignedCategoryName && w.assignedCategoryName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (w.phone && w.phone.includes(searchQuery));
    return matchesStatus && matchesSearch;
  });

  return (
    <DashboardLayout title="Warden Accounts" breadcrumbs={['Admin', 'Users', 'Wardens']}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: THEME.colors.gray900, margin: 0 }}>
                Wardens
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
                {wardens.length} Active
              </span>
            </div>
            <button
              onClick={() => setDrawerOpen(true)}
              style={{
                background: THEME.gradients.primaryBtn,
                color: THEME.colors.white,
                border: 'none',
                borderRadius: THEME.radius.button,
                padding: '10px 20px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: THEME.shadows.button,
                transition: THEME.transition
              }}
              onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(0.95)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }}
            >
              Create Warden +
            </button>
          </div>

          {/* Filters Panel */}
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
            {/* Search Input */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span style={{ position: 'absolute', left: '12px', color: THEME.colors.gray500 }}>🔍</span>
              <input
                type="text"
                placeholder="Search wardens..."
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

            {/* Filter status buttons */}
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

          {/* Wardens List Table */}
          {filteredWardens.length === 0 ? (
            <EmptyState
              icon="👷"
              heading="No wardens found"
              subtext={searchQuery ? "We couldn't find any wardens matching your search." : "No warden accounts are registered yet."}
              actionLabel="Add Warden"
              onAction={() => setDrawerOpen(true)}
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
                      <th style={{ padding: '14px 20px', color: THEME.colors.gray500, fontWeight: '700' }}>Warden Details</th>
                      <th style={{ padding: '14px 20px', color: THEME.colors.gray500, fontWeight: '700' }}>Email Address</th>
                      <th style={{ padding: '14px 20px', color: THEME.colors.gray500, fontWeight: '700' }}>Phone Number</th>
                      <th style={{ padding: '14px 20px', color: THEME.colors.gray500, fontWeight: '700' }}>Assigned Domain</th>
                      <th style={{ padding: '14px 20px', color: THEME.colors.gray500, fontWeight: '700' }}>Complaints Assigned</th>
                      <th style={{ padding: '14px 20px', color: THEME.colors.gray500, fontWeight: '700' }}>Status Toggle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWardens.map((warden) => {
                      const isToggling = togglingMap[warden.id];
                      return (
                        <tr
                          key={warden.id}
                          style={{ borderBottom: `1px solid ${THEME.colors.gray100}`, transition: THEME.transition }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = THEME.colors.gray50; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                          {/* Profile Details */}
                          <td style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                backgroundColor: THEME.colors.purple100,
                                color: THEME.colors.purple600,
                                fontWeight: '700',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '13px'
                              }}
                            >
                              {getInitials(warden.name)}
                            </div>
                            <span style={{ fontWeight: '600', color: THEME.colors.gray900 }}>{warden.name}</span>
                          </td>
                          <td style={{ padding: '14px 20px', color: THEME.colors.gray700 }}>{warden.email}</td>
                          <td style={{ padding: '14px 20px', color: THEME.colors.gray700 }}>{warden.phone}</td>
                          <td style={{ padding: '14px 20px' }}>
                            <span
                              style={{
                                backgroundColor: THEME.colors.purple50,
                                color: THEME.colors.purple600,
                                padding: '2px 8px',
                                borderRadius: THEME.radius.small,
                                fontWeight: '600'
                              }}
                            >
                              {warden.assignedCategoryName || 'General'}
                            </span>
                          </td>
                          <td style={{ padding: '14px 20px', color: THEME.colors.gray900, fontWeight: '700', textAlign: 'center' }}>
                            {warden.complaintsCount || 0}
                          </td>
                          <td style={{ padding: '14px 20px' }}>
                            <button
                              onClick={() => handleToggleStatus(warden)}
                              disabled={isToggling}
                              style={{
                                backgroundColor: warden.status === 'INACTIVE' ? '#FEE2E2' : '#D1FAE5',
                                color: warden.status === 'INACTIVE' ? THEME.colors.red500 : THEME.colors.green500,
                                border: `1px solid ${warden.status === 'INACTIVE' ? THEME.colors.red500 : THEME.colors.green500}`,
                                borderRadius: THEME.radius.badge,
                                padding: '4px 12px',
                                fontSize: '11px',
                                fontWeight: '700',
                                cursor: isToggling ? 'not-allowed' : 'pointer',
                                transition: THEME.transition
                              }}
                            >
                              {isToggling ? '...' : (warden.status === 'INACTIVE' ? 'Inactive' : 'Active')}
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

          {/* Slide-over Form Panel (Create Warden) */}
          <Modal
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            title="Add New Warden"
            type="slideover"
          >
            <form onSubmit={handleCreateWarden} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: THEME.colors.gray700 }}>Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  style={{
                    height: '42px',
                    borderRadius: THEME.radius.input,
                    border: `1.5px solid ${THEME.colors.gray200}`,
                    padding: '0 12px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              {/* Email */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: THEME.colors.gray700 }}>Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  style={{
                    height: '42px',
                    borderRadius: THEME.radius.input,
                    border: `1.5px solid ${THEME.colors.gray200}`,
                    padding: '0 12px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              {/* Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: THEME.colors.gray700 }}>Temporary Password *</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  style={{
                    height: '42px',
                    borderRadius: THEME.radius.input,
                    border: `1.5px solid ${THEME.colors.gray200}`,
                    padding: '0 12px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              {/* Phone */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: THEME.colors.gray700 }}>Phone Number *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  style={{
                    height: '42px',
                    borderRadius: THEME.radius.input,
                    border: `1.5px solid ${THEME.colors.gray200}`,
                    padding: '0 12px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              {/* Category expertise selection */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: THEME.colors.gray700 }}>
                  Assigned Specialty (Category)
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  style={{
                    height: '42px',
                    borderRadius: THEME.radius.input,
                    border: `1.5px solid ${THEME.colors.gray200}`,
                    padding: '0 12px',
                    fontSize: '14px',
                    backgroundColor: THEME.colors.white
                  }}
                >
                  <option value="">General (No specialty)</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                <button
                  type="submit"
                  disabled={submittingWarden}
                  style={{
                    background: THEME.gradients.primaryBtn,
                    color: THEME.colors.white,
                    border: 'none',
                    height: '44px',
                    borderRadius: THEME.radius.button,
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: submittingWarden ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: THEME.shadows.button
                  }}
                >
                  {submittingWarden ? <LoadingSpinner size="18px" color="#FFFFFF" /> : 'Create Warden'}
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: THEME.colors.gray500,
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    textAlign: 'center',
                    padding: '6px'
                  }}
                >
                  Cancel
                </button>
              </div>

            </form>
          </Modal>

        </div>
      )}
    </DashboardLayout>
  );
};

export default Wardens;
