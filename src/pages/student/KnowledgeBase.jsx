import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  Search,
  HelpCircle,
  BookOpen,
  PhoneCall,
  Clock,
  VolumeX,
  Plug,
  Sparkles,
  Hammer,
  Ban,
  Shield,
  User,
  Heart,
  Zap,
  Wrench,
  Copy,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import PortalLayout from '../../components/PortalLayout';
import { THEME } from '../../theme';

const KnowledgeBase = () => {
  const [activeTab, setActiveTab] = useState('faq'); // 'faq' | 'rules' | 'contacts'
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  // FAQs Data
  const faqs = [
    {
      q: 'How long does it take for a complaint to be resolved?',
      a: 'Standard complaints like electrical issues, plumbing, or carpenting are typically resolved within 24-48 hours. Emergency issues are escalated immediately to the warden on duty.',
      cat: 'complaints'
    },
    {
      q: 'What should I do if a complaint is rejected but remains unresolved?',
      a: 'If a warden rejects your complaint, you can easily click the "Reopen Complaint" button in the Complaint Details page. This resets the status to Pending and alerts the Warden/Admin again.',
      cat: 'complaints'
    },
    {
      q: 'Can I report issues in common areas like the mess or recreation room?',
      a: 'Yes. When submitting a complaint, choose the relevant category (e.g., "Mess & Dining" or "General Maintenance") and specify the exact location of the issue in the description field.',
      cat: 'complaints'
    },
    {
      q: 'How do I update my room number or hostel block?',
      a: 'You can update your room number and select your correct hostel block (Newton Hall, Vinci, Einstein, Galileo) in the "My Profile" section under personal information.',
      cat: 'account'
    },
    {
      q: 'Who is responsible for fixing high-priority electrical issues?',
      a: 'The designated Warden for Electrical Maintenance is notified automatically by the system. If it is an emergency outside working hours, please call the Emergency Contact number.',
      cat: 'maintenance'
    },
    {
      q: 'Are visitors allowed to stay overnight in my room?',
      a: 'No, overnight visitors are strictly prohibited in student rooms without written permission from the Chief Warden. Guests can be hosted in the common room until curfew hours (10:00 PM).',
      cat: 'rules'
    }
  ];

  // Hostel Rules Data
  const rules = [
    {
      id: 1,
      title: 'Curfew & Attendance',
      desc: 'All students must return to the hostel by 10:00 PM daily. Daily attendance must be marked via the biometric readers at the main lobby between 9:00 PM and 10:00 PM.',
      icon: Clock
    },
    {
      id: 2,
      title: 'Quiet Hours',
      desc: 'Quiet hours are observed from 10:00 PM to 6:00 AM. Loud music, shouting, or noisy activities that disturb other residents are strictly prohibited during this time.',
      icon: VolumeX
    },
    {
      id: 3,
      title: 'Unauthorized Appliances',
      desc: 'High-wattage appliances such as room heaters, induction cooktops, water heaters/immersion rods, and air conditioners are not permitted in student rooms due to safety concerns.',
      icon: Plug
    },
    {
      id: 4,
      title: 'Room Upkeep & Hygiene',
      desc: 'Residents are responsible for maintaining cleanliness in their rooms. Trash must be disposed of daily in the corridor trash bins. Cooking inside rooms is strictly prohibited.',
      icon: Sparkles
    },
    {
      id: 5,
      title: 'Property Damage Policies',
      desc: 'Any damage or defacement of hostel property (furniture, walls, windows, electrical sockets) will result in a fine equal to the replacement cost plus disciplinary action.',
      icon: Hammer
    },
    {
      id: 6,
      title: 'Anti-Ragging Regulations',
      desc: 'Ragging in any form is a criminal offense and strictly prohibited. Any student found engaging in ragging will be immediately expelled from the hostel and university.',
      icon: Ban
    }
  ];

  // Emergency Contacts Data
  const contacts = [
    {
      role: 'Chief Hostel Warden',
      name: 'Dr. Ramesh Sharma',
      phone: '+91 98765 43210',
      email: 'chiefwarden@university.edu',
      hours: '9:00 AM - 6:00 PM (On-call for Emergencies)',
      icon: Shield
    },
    {
      role: 'Main Security Office (Gate 1)',
      name: 'Security Desk',
      phone: '+91 99999 88888',
      email: 'security.helpdesk@university.edu',
      hours: '24 Hours / 7 Days a week',
      icon: Shield
    },
    {
      role: 'Newton Hall Warden (Block A)',
      name: 'Mr. Rajesh Kumar',
      phone: '+91 98765 00001',
      email: 'newton.warden@university.edu',
      hours: '8:00 AM - 5:00 PM',
      icon: User
    },
    {
      role: 'Campus Health Clinic & Ambulance',
      name: 'Emergency Medical Care',
      phone: '+91 99999 11111',
      email: 'campushealth@university.edu',
      hours: '24 Hours / 7 Days (Ambulance on standby)',
      icon: Heart
    },
    {
      role: 'Electrical Maintenance Emergency',
      name: 'Helpdesk Support',
      phone: '+91 98765 00002',
      email: 'electrical.emerg@university.edu',
      hours: '6:00 AM - 10:00 PM',
      icon: Zap
    },
    {
      role: 'Plumbing & Leakage Helpdesk',
      name: 'Maintenance Department',
      phone: '+91 98765 00003',
      email: 'plumbing.desk@university.edu',
      hours: '8:00 AM - 8:00 PM',
      icon: Wrench
    }
  ];

  // Copy phone helper
  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard!`);
  };

  // Filters
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRules = rules.filter(
    (rule) =>
      rule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PortalLayout title="Knowledge Base" breadcrumbs={['Dashboard', 'Knowledge Base']}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Top Hero Search Banner */}
        <div
          style={{
            background: THEME.gradients.hero,
            borderRadius: THEME.radius.card,
            padding: '32px 24px',
            color: THEME.colors.white,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '16px',
            boxShadow: THEME.shadows.card
          }}
        >
          <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: THEME.colors.white }}>
            How can we help you today?
          </h2>
          <p style={{ fontSize: '14px', color: THEME.colors.purple100, margin: 0, maxWidth: '600px' }}>
            Find answers to frequently asked questions, review hostel guidelines, or get immediate support in case of emergencies.
          </p>

          {/* Search bar */}
          {activeTab !== 'contacts' && (
            <div style={{ position: 'relative', width: '100%', maxWidth: '480px', display: 'flex', alignItems: 'center' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', color: THEME.colors.gray400 }} />
              <input
                type="text"
                placeholder={`Search ${activeTab === 'faq' ? 'FAQs' : 'hostel rules'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  height: '46px',
                  borderRadius: THEME.radius.badge,
                  border: 'none',
                  outline: 'none',
                  padding: '0 20px 0 46px',
                  fontSize: '14px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                  color: THEME.colors.gray900
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    border: 'none',
                    background: 'none',
                    color: THEME.colors.gray500,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tab Controls */}
        <div
          style={{
            display: 'flex',
            backgroundColor: THEME.colors.white,
            borderRadius: THEME.radius.card,
            padding: '6px',
            border: `1px solid ${THEME.colors.gray200}`,
            gap: '6px'
          }}
        >
          {[
            { id: 'faq', label: 'Frequently Asked Questions', icon: HelpCircle },
            { id: 'rules', label: 'Hostel Rules & Regulations', icon: BookOpen },
            { id: 'contacts', label: 'Emergency Contacts', icon: PhoneCall }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchQuery('');
              }}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: 'none',
                borderRadius: THEME.radius.button,
                backgroundColor: activeTab === tab.id ? THEME.colors.purple50 : 'transparent',
                color: activeTab === tab.id ? THEME.colors.purple600 : THEME.colors.gray500,
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: THEME.transition,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) e.currentTarget.style.color = THEME.colors.gray900;
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) e.currentTarget.style.color = THEME.colors.gray500;
              }}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Panels */}
        <div style={{ minHeight: '300px' }}>
          {/* FAQ PANEL */}
          {activeTab === 'faq' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredFaqs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: THEME.colors.gray500 }}>
                  No FAQs found matching your search.
                </div>
              ) : (
                filteredFaqs.map((faq, index) => {
                  const isOpen = expandedFaq === index;
                  return (
                    <div
                      key={index}
                      style={{
                        backgroundColor: THEME.colors.white,
                        borderRadius: THEME.radius.card,
                        border: `1px solid ${THEME.colors.gray200}`,
                        overflow: 'hidden',
                        transition: THEME.transition,
                        boxShadow: isOpen ? THEME.shadows.cardHover : THEME.shadows.card
                      }}
                    >
                      {/* FAQ Header */}
                      <div
                        onClick={() => setExpandedFaq(isOpen ? null : index)}
                        style={{
                          padding: '20px 24px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer',
                          backgroundColor: isOpen ? THEME.colors.purple50 : 'transparent',
                          transition: THEME.transition
                        }}
                      >
                        <span style={{ fontSize: '15px', fontWeight: '700', color: isOpen ? THEME.colors.purple600 : THEME.colors.gray900 }}>
                          {faq.q}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', color: isOpen ? THEME.colors.purple600 : THEME.colors.gray500 }}>
                          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </span>
                      </div>

                      {/* FAQ Content */}
                      {isOpen && (
                        <div
                          style={{
                            padding: '20px 24px',
                            borderTop: `1px solid ${THEME.colors.gray100}`,
                            fontSize: '14px',
                            color: THEME.colors.gray700,
                            lineHeight: '1.6',
                            backgroundColor: THEME.colors.white
                          }}
                        >
                          {faq.a}
                          <div style={{ marginTop: '12px', display: 'flex', gap: '6px' }}>
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: '700',
                                backgroundColor: THEME.colors.gray100,
                                color: THEME.colors.gray500,
                                padding: '2px 6px',
                                borderRadius: THEME.radius.small,
                                textTransform: 'uppercase'
                              }}
                            >
                              Tag: {faq.cat}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* RULES PANEL */}
          {activeTab === 'rules' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {filteredRules.length === 0 ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px 0', color: THEME.colors.gray500 }}>
                  No rules found matching your search.
                </div>
              ) : (
                filteredRules.map((rule) => (
                  <div
                    key={rule.id}
                    style={{
                      backgroundColor: THEME.colors.white,
                      borderRadius: THEME.radius.card,
                      padding: '24px',
                      boxShadow: THEME.shadows.card,
                      border: `1px solid ${THEME.colors.gray200}`,
                      display: 'flex',
                      gap: '16px',
                      alignItems: 'flex-start',
                      transition: THEME.transition
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = THEME.shadows.cardHover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = THEME.shadows.card;
                    }}
                  >
                    <rule.icon size={32} style={{ color: THEME.colors.purple600, flexShrink: 0 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: THEME.colors.gray900 }}>
                        {rule.title}
                      </h4>
                      <p style={{ margin: 0, fontSize: '13px', color: THEME.colors.gray700, lineHeight: '1.5' }}>
                        {rule.desc}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* CONTACTS PANEL */}
          {activeTab === 'contacts' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
              {contacts.map((contact, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: THEME.colors.white,
                    borderRadius: THEME.radius.card,
                    padding: '24px',
                    boxShadow: THEME.shadows.card,
                    border: `1px solid ${THEME.colors.gray200}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    transition: THEME.transition
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = THEME.shadows.cardHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = THEME.shadows.card;
                  }}
                >
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        backgroundColor: THEME.colors.purple50,
                        color: THEME.colors.purple600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <contact.icon size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: THEME.colors.purple600, textTransform: 'uppercase' }}>
                        {contact.role}
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: '800', color: THEME.colors.gray900 }}>
                        {contact.name}
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: THEME.colors.gray500 }}>Phone:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: THEME.colors.gray900, fontWeight: '700' }}>{contact.phone}</span>
                        <button
                          onClick={() => handleCopy(contact.phone, 'Phone number')}
                          style={{
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            fontSize: '12px',
                            padding: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            color: THEME.colors.gray400
                          }}
                          title="Copy phone number"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: THEME.colors.gray500 }}>Email:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: THEME.colors.gray900, fontWeight: '700' }}>{contact.email}</span>
                        <button
                          onClick={() => handleCopy(contact.email, 'Email address')}
                          style={{
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            fontSize: '12px',
                            padding: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            color: THEME.colors.gray400
                          }}
                          title="Copy email"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>

                    <div style={{ borderTop: `1px solid ${THEME.colors.gray100}`, paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ color: THEME.colors.gray500, fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>
                        Availability
                      </span>
                      <span style={{ color: THEME.colors.gray700, fontWeight: '600' }}>
                        {contact.hours}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
};

export default KnowledgeBase;
