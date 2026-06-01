import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { complaintService } from '../../services/complaintService';
import PortalLayout from '../../components/PortalLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { THEME } from '../../theme';

const SubmitComplaint = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await complaintService.getStudentCategories();
        setCategories(data || []);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load categories.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Compute live priority auto-tag based on keywords in title
  const getAutoPriority = () => {
    const text = title.toLowerCase();
    if (!text) return { label: 'LOW', color: THEME.colors.green500, bg: '#D1FAE5' };

    const highKeywords = ['fire', 'shock', 'leakage', 'flood', 'broken lock', 'stolen', 'emergency', 'short circuit', 'injury', 'theft', 'water leak'];
    const medKeywords = ['fan', 'light', 'internet', 'wifi', 'slow', 'noise', 'dirty', 'clean', 'mosquito', 'ac', 'cooler', 'geyser'];

    if (highKeywords.some((kw) => text.includes(kw))) {
      return { label: 'HIGH', color: THEME.colors.red500, bg: '#FEE2E2' };
    }
    if (medKeywords.some((kw) => text.includes(kw))) {
      return { label: 'MEDIUM', color: THEME.colors.yellow500, bg: '#FEF3C7' };
    }
    return { label: 'LOW', color: THEME.colors.green500, bg: '#D1FAE5' };
  };

  const priority = getAutoPriority();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !categoryId || !description) {
      toast.error('Please fill in all fields.');
      return;
    }

    setSubmitting(true);
    try {
      await complaintService.createStudentComplaint({
        title,
        categoryId: parseInt(categoryId),
        description
      });
      toast.success('Complaint submitted successfully!');
      navigate('/student/complaints');
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Failed to submit complaint. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to show custom icons beside category names
  const getCategoryIcon = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes('plumb')) return '🚰';
    if (lower.includes('elect')) return '⚡';
    if (lower.includes('internet') || lower.includes('wifi') || lower.includes('net')) return '🌐';
    if (lower.includes('clean') || lower.includes('sweep') || lower.includes('house')) return '🧹';
    if (lower.includes('carp') || lower.includes('wood') || lower.includes('furn')) return '🔨';
    return '📋';
  };

  return (
    <PortalLayout title="Submit Complaint" breadcrumbs={['Dashboard', 'Complaints', 'New']}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          
          {/* Main Card */}
          <div
            style={{
              backgroundColor: THEME.colors.white,
              borderRadius: THEME.radius.card,
              padding: '32px',
              boxShadow: THEME.shadows.card,
              border: `1px solid ${THEME.colors.gray200}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}
          >
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: THEME.colors.gray900, margin: 0 }}>
                Report an Issue
              </h2>
              <p style={{ fontSize: '13px', color: THEME.colors.gray500, margin: '4px 0 0 0' }}>
                Please provide detailed information about the hostel issue.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Section 1 — Complaint Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: THEME.colors.purple600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Section 1 — Complaint Details
                </div>

                {/* Title */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: THEME.colors.gray700 }}>
                    Complaint Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Bathroom faucet leaking water"
                    style={{
                      height: '44px',
                      borderRadius: THEME.radius.input,
                      border: `1.5px solid ${THEME.colors.gray200}`,
                      padding: '0 14px',
                      fontSize: '14px',
                      outline: 'none',
                      fontFamily: THEME.fonts.family,
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
                    required
                  />
                </div>

                {/* Category select + Priority layout row */}
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  
                  {/* Category select */}
                  <div style={{ flex: 2, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '600', color: THEME.colors.gray700 }}>
                      Category
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      style={{
                        height: '44px',
                        borderRadius: THEME.radius.input,
                        border: `1.5px solid ${THEME.colors.gray200}`,
                        padding: '0 14px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: THEME.colors.white,
                        fontFamily: THEME.fonts.family,
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
                      required
                    >
                      <option value="">Choose a category...</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {getCategoryIcon(cat.name)} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Priority indicator */}
                  <div style={{ flex: 1, minWidth: '120px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '600', color: THEME.colors.gray700 }}>
                      Detected Priority
                    </label>
                    <div
                      style={{
                        height: '44px',
                        borderRadius: THEME.radius.input,
                        backgroundColor: priority.bg,
                        color: priority.color,
                        fontSize: '14px',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `1px solid ${priority.color}`,
                        cursor: 'default'
                      }}
                      title="Priority is auto-detected as you type titles like 'leakage' or 'fan'"
                    >
                      {priority.label}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2 — Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: THEME.colors.purple600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Section 2 — Description
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '14px', fontWeight: '600', color: THEME.colors.gray700 }}>
                      Detailed Description
                    </label>
                    <span style={{ fontSize: '12px', color: description.length > 500 ? THEME.colors.red500 : THEME.colors.gray500 }}>
                      {description.length}/500 chars
                    </span>
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => {
                      if (e.target.value.length <= 500) {
                        setDescription(e.target.value);
                      }
                    }}
                    placeholder="Describe the issue. Mention specific details such as room corners, item brands, or exact timelines..."
                    rows={6}
                    style={{
                      borderRadius: THEME.radius.input,
                      border: `1.5px solid ${THEME.colors.gray200}`,
                      padding: '12px 14px',
                      fontSize: '14px',
                      outline: 'none',
                      fontFamily: THEME.fonts.family,
                      resize: 'none',
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
                    required
                  />
                </div>
              </div>

              {/* Form actions row */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  alignItems: 'center',
                  borderTop: `1px solid ${THEME.colors.gray100}`,
                  paddingTop: '20px'
                }}
              >
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  style={{
                    background: 'none',
                    border: `1.5px solid ${THEME.colors.gray200}`,
                    borderRadius: THEME.radius.button,
                    padding: '10px 20px',
                    color: THEME.colors.gray700,
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: THEME.transition
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = THEME.colors.gray50; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    background: THEME.gradients.primaryBtn,
                    color: THEME.colors.white,
                    border: 'none',
                    borderRadius: THEME.radius.button,
                    padding: '10px 24px',
                    fontWeight: '600',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    boxShadow: THEME.shadows.button,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: THEME.transition
                  }}
                  onMouseEnter={(e) => {
                    if (!submitting) {
                      e.currentTarget.style.filter = 'brightness(0.95)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!submitting) {
                      e.currentTarget.style.filter = 'none';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {submitting ? <LoadingSpinner size="18px" color="#FFFFFF" /> : 'Submit Complaint →'}
                </button>
              </div>
            </form>
          </div>

          {/* Info Box */}
          <div
            style={{
              marginTop: '16px',
              backgroundColor: THEME.colors.purple50,
              border: `1px solid ${THEME.colors.purple100}`,
              borderRadius: THEME.radius.small,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '13px',
              color: THEME.colors.purple900,
              fontWeight: '500'
            }}
          >
            <span>ℹ️</span>
            <span>You will receive an email confirmation once the complaint is submitted and routed.</span>
          </div>
        </div>
      )}
    </PortalLayout>
  );
};

export default SubmitComplaint;