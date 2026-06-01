import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  ArrowLeft, 
  Folder, 
  Calendar, 
  Tag, 
  User, 
  MessageSquare, 
  Clock, 
  Star 
} from 'lucide-react';
import { complaintService } from '../../services/complaintService';
import PortalLayout from '../../components/PortalLayout';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { THEME } from '../../theme';

const StudentComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [submittingReopen, setSubmittingReopen] = useState(false);

  useEffect(() => {
    const fetchComplaintDetail = async () => {
      try {
        const data = await complaintService.getStudentComplaintDetail(id);
        if (data) {
          // Check local storage fallback
          const localFeedback = localStorage.getItem(`feedback_${id}`);
          if (localFeedback) {
            const parsed = JSON.parse(localFeedback);
            data.rating = data.rating || parsed.rating;
            data.feedbackComment = data.feedbackComment || parsed.feedbackComment;
          }
          setComplaint(data);
          setRating(data.rating || 0);
          setFeedbackComment(data.feedbackComment || '');
        } else {
          setComplaint(null);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load complaint details.');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaintDetail();
  }, [id]);

  if (loading) {
    return (
      <PortalLayout title="Complaint Details" breadcrumbs={['Dashboard', 'Complaints', 'Detail']}>
        <LoadingSpinner />
      </PortalLayout>
    );
  }

  if (!complaint) {
    return (
      <PortalLayout title="Complaint Details" breadcrumbs={['Dashboard', 'Complaints', 'Detail']}>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>Complaint not found.</div>
      </PortalLayout>
    );
  }

  // Get status index for timeline progress
  const getStatusIndex = (status) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'ASSIGNED': return 1;
      case 'IN_PROGRESS': return 2;
      case 'RESOLVED':
      case 'REJECTED': return 3;
      default: return 0;
    }
  };

  const currentStatusIndex = getStatusIndex(complaint.status);

  // Define steps for the vertical timeline
  const timelineSteps = [
    { label: 'Submitted', status: 'PENDING', desc: 'Complaint submitted by student' },
    { label: 'Assigned', status: 'ASSIGNED', desc: 'Assigned to a hostel warden' },
    { label: 'In Progress', status: 'IN_PROGRESS', desc: 'Warden is working on resolution' },
    { label: 'Resolved', status: 'RESOLVED', desc: 'Issue resolved or closed' }
  ];

  const getWardenInitials = (name) => {
    if (!name) return 'W';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a star rating between 1 and 5.');
      return;
    }
    setSubmittingFeedback(true);
    try {
      await complaintService.submitFeedback(id, { rating, feedbackComment });
      toast.success('Thank you for your feedback!');
      setComplaint(prev => ({
        ...prev,
        rating,
        feedbackComment
      }));
    } catch (error) {
      console.error(error);
      toast.info('Feedback saved locally.');
      setComplaint(prev => ({
        ...prev,
        rating,
        feedbackComment
      }));
      localStorage.setItem(`feedback_${id}`, JSON.stringify({ rating, feedbackComment }));
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleReopenComplaint = async () => {
    if (!window.confirm('Are you sure you want to reopen this complaint? This will notify the warden that the issue is still unresolved.')) {
      return;
    }
    setSubmittingReopen(true);
    try {
      await complaintService.reopenComplaint(id);
      toast.success('Complaint has been reopened.');
      setComplaint(prev => ({
        ...prev,
        status: 'PENDING',
        resolvedAt: null,
        rating: null,
        feedbackComment: null
      }));
      setRating(0);
      setFeedbackComment('');
      localStorage.removeItem(`feedback_${id}`);
    } catch (error) {
      console.error(error);
      toast.info('Complaint reopened (local update).');
      setComplaint(prev => ({
        ...prev,
        status: 'PENDING',
        resolvedAt: null,
        rating: null,
        feedbackComment: null
      }));
      setRating(0);
      setFeedbackComment('');
      localStorage.removeItem(`feedback_${id}`);
    } finally {
      setSubmittingReopen(false);
    }
  };

  const renderStars = () => {
    const isSubmitted = complaint.rating !== undefined && complaint.rating !== null && complaint.rating > 0;
    return (
      <div style={{ display: 'flex', gap: '8px' }}>
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = hoverRating ? star <= hoverRating : star <= rating;
          return (
            <Star
              key={star}
              onClick={() => {
                if (!isSubmitted) setRating(star);
              }}
              onMouseEnter={() => {
                if (!isSubmitted) setHoverRating(star);
              }}
              onMouseLeave={() => {
                if (!isSubmitted) setHoverRating(0);
              }}
              size={24}
              fill={filled ? THEME.colors.yellow500 : 'transparent'}
              stroke={filled ? THEME.colors.yellow500 : THEME.colors.gray300}
              style={{
                cursor: isSubmitted ? 'default' : 'pointer',
                transition: 'transform 0.1s ease',
                transform: !isSubmitted && hoverRating === star ? 'scale(1.15)' : 'none'
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <PortalLayout title={`Complaint #${complaint.id}`} breadcrumbs={['Dashboard', 'Complaints', `Detail #${complaint.id}`]}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Back Button */}
        <div>
          <button
            onClick={() => navigate('/student/complaints')}
            style={{
              background: 'none',
              border: 'none',
              color: THEME.colors.purple600,
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 0',
              transition: THEME.transition
            }}
            onMouseEnter={(e) => { e.target.style.color = THEME.colors.purple700; }}
            onMouseLeave={(e) => { e.target.style.color = THEME.colors.purple600; }}
          >
            <ArrowLeft size={16} /> My Complaints
          </button>
        </div>

        {/* 65/35 Two Column Grid */}
        <div
          style={{
            display: 'flex',
            gap: '24px',
            flexWrap: 'wrap',
            width: '100%',
            alignItems: 'flex-start'
          }}
        >
          {/* Left Column (65%): Main Content */}
          <div
            style={{
              flex: '2 1 500px',
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
            {/* Header: Title + Status Badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: THEME.colors.gray900, margin: 0 }}>
                {complaint.title}
              </h2>
              <StatusBadge status={complaint.status} />
            </div>

            {/* Meta Row: Category | Date | Ticket ID */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                fontSize: '13px',
                color: THEME.colors.gray500,
                fontWeight: '500',
                alignItems: 'center'
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Folder size={14} style={{ color: THEME.colors.gray400 }} />
                <span>Category: <strong style={{ color: THEME.colors.gray700 }}>{complaint.categoryName || 'General'}</strong></span>
              </span>
              <span>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} style={{ color: THEME.colors.gray400 }} />
                <span>Date: <strong style={{ color: THEME.colors.gray700 }}>{new Date(complaint.createdAt).toLocaleDateString()}</strong></span>
              </span>
              <span>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Tag size={14} style={{ color: THEME.colors.gray400 }} />
                <span>ID: <strong style={{ color: THEME.colors.gray700 }}>#TICKET-{complaint.id}</strong></span>
              </span>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', backgroundColor: THEME.colors.gray100 }} />

            {/* Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: THEME.colors.gray500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Description
              </div>
              <p
                style={{
                  fontSize: '15px',
                  color: THEME.colors.gray700,
                  lineHeight: '1.6',
                  margin: 0,
                  whiteSpace: 'pre-wrap'
                }}
              >
                {complaint.description}
              </p>
            </div>

            {/* Warden's Remark Section */}
            {complaint.wardenRemark && (
              <div
                style={{
                  backgroundColor: THEME.colors.purple50,
                  borderLeft: `3px solid ${THEME.colors.purple600}`,
                  borderRadius: THEME.radius.small,
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  marginTop: '12px'
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: '700', color: THEME.colors.purple900, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={14} style={{ color: THEME.colors.purple600 }} /> Warden's Remark ({complaint.wardenName || 'Warden'})
                </div>
                <p style={{ fontSize: '14px', color: THEME.colors.purple900, margin: 0, lineHeight: '1.5' }}>
                  {complaint.wardenRemark}
                </p>
                {complaint.resolvedAt && (
                  <span style={{ fontSize: '11px', color: THEME.colors.gray500, alignSelf: 'flex-end' }}>
                    Resolved at: {new Date(complaint.resolvedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            )}

            {/* Feedback & Resolution Rating Section */}
            {complaint.status === 'RESOLVED' && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '24px',
                  borderRadius: THEME.radius.card,
                  backgroundColor: THEME.colors.gray50,
                  border: `1px solid ${THEME.colors.gray200}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: THEME.colors.gray900 }}>
                    Resolution Feedback
                  </h4>
                  {complaint.rating ? (
                    <span style={{ fontSize: '12px', color: THEME.colors.green500, fontWeight: '700', textTransform: 'uppercase' }}>
                      ✓ Feedback Submitted
                    </span>
                  ) : null}
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: THEME.colors.gray700, display: 'block', marginBottom: '8px' }}>
                    Rate your satisfaction with this resolution:
                  </label>
                  {renderStars()}
                </div>

                {complaint.rating ? (
                  complaint.feedbackComment && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: THEME.colors.gray500 }}>Your Comment:</span>
                      <p style={{ margin: 0, fontSize: '14px', color: THEME.colors.gray700, fontStyle: 'italic', backgroundColor: THEME.colors.white, padding: '12px', borderRadius: THEME.radius.small, border: `1px solid ${THEME.colors.gray100}` }}>
                        "{complaint.feedbackComment}"
                      </p>
                    </div>
                  )
                ) : (
                  <form onSubmit={handleSubmitFeedback} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: THEME.colors.gray700 }}>
                        Add Comments (Optional)
                      </label>
                      <textarea
                        value={feedbackComment}
                        onChange={(e) => setFeedbackComment(e.target.value)}
                        placeholder="Tell us what you think of the resolution..."
                        rows={3}
                        style={{
                          width: '100%',
                          borderRadius: THEME.radius.input,
                          border: `1.5px solid ${THEME.colors.gray200}`,
                          padding: '12px',
                          fontSize: '14px',
                          fontFamily: THEME.fonts.family,
                          outline: 'none',
                          resize: 'vertical',
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

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <button
                        type="submit"
                        disabled={submittingFeedback}
                        style={{
                          background: THEME.gradients.primaryBtn,
                          color: THEME.colors.white,
                          border: 'none',
                          borderRadius: THEME.radius.button,
                          padding: '10px 20px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          boxShadow: THEME.shadows.button,
                          transition: THEME.transition
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(0.95)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }}
                      >
                        Submit Feedback
                      </button>

                      <button
                        type="button"
                        onClick={handleReopenComplaint}
                        disabled={submittingReopen}
                        style={{
                          backgroundColor: 'transparent',
                          color: THEME.colors.red500,
                          border: `1.5px solid ${THEME.colors.red500}`,
                          borderRadius: THEME.radius.button,
                          padding: '10px 20px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: THEME.transition
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#FEF2F2';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        Reopen Complaint
                      </button>
                    </div>
                  </form>
                )}

                {complaint.rating && (
                  <div style={{ borderTop: `1px solid ${THEME.colors.gray200}`, paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: THEME.colors.gray500 }}>
                      Not satisfied? You can still reopen the complaint.
                    </span>
                    <button
                      type="button"
                      onClick={handleReopenComplaint}
                      disabled={submittingReopen}
                      style={{
                        backgroundColor: 'transparent',
                        color: THEME.colors.red500,
                        border: 'none',
                        fontSize: '14px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: THEME.transition
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
                    >
                      Reopen Complaint
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Reopen Box for REJECTED Complaints */}
            {complaint.status === 'REJECTED' && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '24px',
                  borderRadius: THEME.radius.card,
                  backgroundColor: '#FEF2F2',
                  border: `1px solid ${THEME.colors.red500}33`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: THEME.colors.red500 }}>
                  Complaint Rejected
                </h4>
                <p style={{ margin: 0, fontSize: '14px', color: THEME.colors.gray700 }}>
                  This complaint has been rejected. If you believe this was in error or the issue is still unresolved, you can reopen it to request another review.
                </p>
                <button
                  type="button"
                  onClick={handleReopenComplaint}
                  disabled={submittingReopen}
                  style={{
                    alignSelf: 'flex-start',
                    backgroundColor: THEME.colors.red500,
                    color: THEME.colors.white,
                    border: 'none',
                    borderRadius: THEME.radius.button,
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: THEME.shadows.button,
                    transition: THEME.transition
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(0.95)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }}
                >
                  Reopen Complaint
                </button>
              </div>
            )}
          </div>

          {/* Right Column (35%): Timeline & Warden Cards */}
          <div
            style={{
              flex: '1 1 300px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}
          >
            {/* Card 1: Complaint Status Timeline */}
            <div
              style={{
                backgroundColor: THEME.colors.white,
                borderRadius: THEME.radius.card,
                padding: '24px',
                boxShadow: THEME.shadows.card,
                border: `1px solid ${THEME.colors.gray200}`
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: THEME.colors.gray900, marginBottom: '20px', marginTop: 0 }}>
                Complaint Status
              </h3>

              {/* Vertical Timeline */}
              <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', paddingLeft: '8px' }}>
                {timelineSteps.map((step, idx) => {
                  const isPast = idx < currentStatusIndex;
                  const isActive = idx === currentStatusIndex;
                  const isFuture = idx > currentStatusIndex;

                  return (
                    <div key={idx} style={{ display: 'flex', gap: '16px', pb: '24px', position: 'relative' }}>
                      {/* Left timeline bar line connector */}
                      {idx < timelineSteps.length - 1 && (
                        <div
                          style={{
                            position: 'absolute',
                            left: '8px',
                            top: '18px',
                            bottom: '-12px',
                            width: '2px',
                            backgroundColor: isPast ? THEME.colors.purple600 : THEME.colors.gray200,
                            zIndex: 1
                          }}
                        />
                      )}

                      {/* Dot icon */}
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 2,
                          marginTop: '2px'
                        }}
                      >
                        {isActive ? (
                          <span
                            className="pulse-animation"
                            style={{
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              backgroundColor: THEME.colors.purple600,
                              boxShadow: `0 0 0 4px ${THEME.colors.purple100}`
                            }}
                          />
                        ) : isPast ? (
                          <span
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: THEME.colors.purple600
                            }}
                          />
                        ) : (
                          <span
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: THEME.colors.gray200
                            }}
                          />
                        )}
                      </div>

                      {/* Text */}
                      <div style={{ paddingBottom: '24px', flex: 1 }}>
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: isFuture ? THEME.colors.gray500 : THEME.colors.gray900,
                            lineHeight: 1.2
                          }}
                        >
                          {step.label}
                        </div>
                        <div style={{ fontSize: '12px', color: THEME.colors.gray500, marginTop: '2px' }}>
                          {step.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card 2: Assigned Warden Info */}
            <div
              style={{
                backgroundColor: THEME.colors.white,
                borderRadius: THEME.radius.card,
                padding: '24px',
                boxShadow: THEME.shadows.card,
                border: `1px solid ${THEME.colors.gray200}`
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: THEME.colors.gray900, marginBottom: '20px', marginTop: 0 }}>
                Assigned Warden
              </h3>

              {complaint.wardenName ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Avatar */}
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: THEME.colors.purple100,
                      color: THEME.colors.purple600,
                      fontWeight: '700',
                      fontSize: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {getWardenInitials(complaint.wardenName)}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: THEME.colors.gray900 }}>
                      {complaint.wardenName}
                    </div>
                    <div style={{ fontSize: '12px', color: THEME.colors.gray500 }}>
                      Hostel Warden
                    </div>
                    <span
                      style={{
                        display: 'inline-block',
                        backgroundColor: THEME.colors.purple50,
                        color: THEME.colors.purple600,
                        fontSize: '10px',
                        fontWeight: '700',
                        padding: '1px 6px',
                        borderRadius: THEME.radius.small,
                        marginTop: '4px'
                      }}
                    >
                      {complaint.categoryName || 'General'} Expert
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: THEME.colors.gray500, fontSize: '13px', padding: '10px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <Clock size={16} style={{ color: THEME.colors.gray400 }} />
                  <span>No warden has been assigned yet. Admin will assign this shortly.</span>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </PortalLayout>
  );
};

export default StudentComplaintDetail;