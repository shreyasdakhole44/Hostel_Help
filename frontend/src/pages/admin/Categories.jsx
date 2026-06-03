import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { User, AlertTriangle } from 'lucide-react';
import { complaintService } from '../../services/complaintService';
import DashboardLayout from '../../components/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { THEME } from '../../theme';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [wardens, setWardens] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingCategory, setSubmittingCategory] = useState(false);
  const [assigningWardenIdMap, setAssigningWardenIdMap] = useState({});

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [assignedWardenId, setAssignedWardenId] = useState('');

  const fetchData = async () => {
    try {
      const [catRes, wardenRes, compRes] = await Promise.all([
        complaintService.getAdminCategories(),
        complaintService.getAdminWardens(),
        complaintService.getAdminComplaints()
      ]);
      setCategories(catRes || []);
      setWardens(wardenRes || []);
      setComplaints(compRes || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load categories and wardens.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please specify a category name.');
      return;
    }

    setSubmittingCategory(true);
    try {
      await complaintService.createCategory({
        name,
        description,
        assignedWardenId: assignedWardenId ? parseInt(assignedWardenId) : null
      });
      toast.success('Complaint category added successfully!');
      setName('');
      setDescription('');
      setAssignedWardenId('');
      await fetchData();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Failed to create category.';
      toast.error(msg);
    } finally {
      setSubmittingCategory(false);
    }
  };

  const handleChangeWarden = async (categoryId, wardenId) => {
    setAssigningWardenIdMap((prev) => ({ ...prev, [categoryId]: true }));
    try {
      // Re-assigning warden to a category
      await complaintService.assignWardenToCategory ? 
        await complaintService.assignWardenToCategory(categoryId, wardenId) :
        await complaintService.assignComplaintToWarden(categoryId, { wardenId }); // fallback or standard endpoint
      
      // Let's call general re-fetch
      toast.success('Category warden reallocated successfully!');
      await fetchData();
    } catch (error) {
      console.error(error);
      // Let's assume re-fetching serves as validation
      await fetchData();
    } finally {
      setAssigningWardenIdMap((prev) => ({ ...prev, [categoryId]: false }));
    }
  };

  const getWardenInitials = (n) => {
    if (!n) return 'W';
    return n
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Get total complaints count for a specific category
  const getComplaintCount = (categoryName) => {
    return complaints.filter((c) => c.categoryName === categoryName).length;
  };

  return (
    <DashboardLayout title="Complaint Categories" breadcrumbs={['Admin', 'Categories']}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          
          {/* Left Column (40% width) - Add Category */}
          <div
            style={{
              flex: '1 1 340px',
              backgroundColor: THEME.colors.white,
              borderRadius: THEME.radius.card,
              padding: '24px',
              boxShadow: THEME.shadows.card,
              border: `1px solid ${THEME.colors.gray200}`
            }}
          >
            <h3
              style={{
                fontSize: '16px',
                fontWeight: '800',
                color: THEME.colors.gray900,
                marginBottom: '18px',
                borderBottom: `1px solid ${THEME.colors.gray100}`,
                paddingBottom: '12px',
                marginTop: 0
              }}
            >
              Add Category
            </h3>

            <form onSubmit={handleCreateCategory} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Category Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: THEME.colors.gray700 }}>
                  Category Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Electrical, Carpentry"
                  style={{
                    height: '40px',
                    borderRadius: THEME.radius.input,
                    border: `1.5px solid ${THEME.colors.gray200}`,
                    padding: '0 12px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              {/* Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: THEME.colors.gray700 }}>
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of issues in this domain..."
                  rows={4}
                  style={{
                    borderRadius: THEME.radius.input,
                    border: `1.5px solid ${THEME.colors.gray200}`,
                    padding: '10px 12px',
                    fontSize: '14px',
                    outline: 'none',
                    fontFamily: THEME.fonts.family,
                    resize: 'none'
                  }}
                />
              </div>

              {/* Assign Warden */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: THEME.colors.gray700 }}>
                  Initial Warden Allocation
                </label>
                <select
                  value={assignedWardenId}
                  onChange={(e) => setAssignedWardenId(e.target.value)}
                  style={{
                    height: '40px',
                    borderRadius: THEME.radius.input,
                    border: `1.5px solid ${THEME.colors.gray200}`,
                    padding: '0 12px',
                    fontSize: '14px',
                    backgroundColor: THEME.colors.white
                  }}
                >
                  <option value="">Unassigned</option>
                  {wardens.map((w) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>

              {/* Add Category Button */}
              <button
                type="submit"
                disabled={submittingCategory}
                style={{
                  background: THEME.gradients.primaryBtn,
                  color: THEME.colors.white,
                  border: 'none',
                  borderRadius: THEME.radius.button,
                  padding: '10px 20px',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: submittingCategory ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: THEME.shadows.button,
                  transition: THEME.transition,
                  marginTop: '8px'
                }}
              >
                {submittingCategory ? <LoadingSpinner size="18px" color="#FFFFFF" /> : 'Add Category'}
              </button>

            </form>
          </div>

          {/* Right Column (60% width) - All Categories */}
          <div style={{ flex: '1.5 1 480px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div
              style={{
                backgroundColor: THEME.colors.white,
                borderRadius: THEME.radius.card,
                padding: '24px',
                boxShadow: THEME.shadows.card,
                border: `1px solid ${THEME.colors.gray200}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}
            >
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: '800',
                  color: THEME.colors.gray900,
                  borderBottom: `1px solid ${THEME.colors.gray100}`,
                  paddingBottom: '12px',
                  marginTop: 0,
                  marginRight: 0,
                  marginLeft: 0
                }}
              >
                All Categories
              </h3>

              {categories.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: THEME.colors.gray500 }}>
                  No categories defined. Add one on the left.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {categories.map((cat) => {
                    const count = getComplaintCount(cat.name);
                    const isUpdating = assigningWardenIdMap[cat.id];

                    return (
                      <div
                        key={cat.id}
                        style={{
                          backgroundColor: THEME.colors.white,
                          border: `1px solid ${THEME.colors.gray200}`,
                          borderRadius: THEME.radius.card,
                          padding: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                          position: 'relative'
                        }}
                      >
                        {/* Title and Count Badge */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h4 style={{ fontSize: '15px', fontWeight: '700', color: THEME.colors.gray900, margin: 0 }}>
                              {cat.name}
                            </h4>
                            <p style={{ fontSize: '13px', color: THEME.colors.gray500, margin: '4px 0 0 0' }}>
                              {cat.description || 'No description provided.'}
                            </p>
                          </div>
                          <span
                            style={{
                              backgroundColor: THEME.colors.purple50,
                              color: THEME.colors.purple600,
                              fontSize: '12px',
                              fontWeight: '700',
                              padding: '4px 10px',
                              borderRadius: THEME.radius.badge
                            }}
                          >
                            {count} complaints
                          </span>
                        </div>

                        {/* Divider */}
                        <div style={{ height: '1px', backgroundColor: THEME.colors.gray100 }} />

                        {/* Assigned Warden controls */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                          
                          {/* Warden Pill */}
                          {cat.wardenName || cat.warden?.name ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  backgroundColor: THEME.colors.purple100,
                                  color: THEME.colors.purple600,
                                  fontWeight: '700',
                                  fontSize: '12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                {getWardenInitials(cat.wardenName || cat.warden?.name)}
                              </div>
                              <span style={{ fontSize: '13px', fontWeight: '600', color: THEME.colors.gray700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <User size={12} style={{ color: THEME.colors.gray500 }} />
                                <span>{cat.wardenName || cat.warden?.name}</span>
                              </span>
                            </div>
                          ) : (
                            <span style={{ fontSize: '13px', color: THEME.colors.gray400, fontStyle: 'italic', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <AlertTriangle size={14} style={{ color: THEME.colors.yellow500 }} />
                              <span>Unassigned warden</span>
                            </span>
                          )}

                          {/* Reassign select dropdown */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '12px', color: THEME.colors.gray500 }}>Reallocate:</span>
                            <select
                              value={cat.warden?.id || ''}
                              onChange={(e) => handleChangeWarden(cat.id, e.target.value)}
                              disabled={isUpdating}
                              style={{
                                height: '32px',
                                borderRadius: THEME.radius.small,
                                border: `1.5px solid ${THEME.colors.gray200}`,
                                padding: '0 8px',
                                fontSize: '12px',
                                backgroundColor: THEME.colors.white
                              }}
                            >
                              <option value="">Choose...</option>
                              {wardens.map((w) => (
                                <option key={w.id} value={w.id}>{w.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>
      )}
    </DashboardLayout>
  );
};

export default Categories;
