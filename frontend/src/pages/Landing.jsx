import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { THEME } from "../theme";
import StatusBadge from "../components/StatusBadge";
import hostelHelpLogo from "../assets/hostel-help-logo.png";
import {
  FileText,
  BarChart2,
  UserCheck,
  Bell,
  ClipboardList,
  Star,
  GraduationCap,
  Zap,
  ArrowRight,
  ClipboardCheck,
  CheckCircle,
  Clock3,
  Users,
} from "lucide-react";

// Inline social media SVG icons
const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Landing = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  // Monitor scroll to add shadow to navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const featureList = [
    {
      icon: FileText,
      title: "Submit Complaints",
      desc: "Log complaints instantly, choose categories, and get immediate tracking numbers.",
    },
    {
      icon: BarChart2,
      title: "Real-time Tracking",
      desc: "Watch your complaint go from Pending to In Progress to Resolved in real-time.",
    },
    {
      icon: UserCheck,
      title: "Smart Assignment",
      desc: "Auto-route complaints directly to the warden assigned to that specific category.",
    },
    {
      icon: Bell,
      title: "Email Alerts",
      desc: "Receive instant notifications when wardens accept or resolve your complaints.",
    },
    {
      icon: ClipboardList,
      title: "Admin Control",
      desc: "Full-featured back-office admin dashboard for categories, wardens, and metrics.",
    },
    {
      icon: Star,
      title: "Feedback System",
      desc: "Students can review and rate resolutions to ensure quality standards.",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: THEME.colors.white,
        fontFamily: THEME.fonts.family,
      }}
    >
      {/* Sticky Navbar */}
      <nav
        className="responsive-padding"
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          right: 0,
          height: "72px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${THEME.colors.gray100}`,
          boxShadow: scrolled
            ? "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)"
            : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          zIndex: 1000,
          transition: THEME.transition,
        }}
      >
        {/* Left: Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img
            src={hostelHelpLogo}
            alt="Hostel Help Logo"
            style={{
              height: "40px",
              width: "auto",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Center: Links */}
        <div className="responsive-nav-links" style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          {["Features", "How it Works", "Stats", "About"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/ /g, "-")}`}
              style={{
                textDecoration: "none",
                color: THEME.colors.gray700,
                fontSize: "15px",
                fontWeight: "500",
                transition: THEME.transition,
              }}
              onMouseEnter={(e) => {
                e.target.style.color = THEME.colors.purple600;
              }}
              onMouseLeave={(e) => {
                e.target.style.color = THEME.colors.gray700;
              }}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="responsive-nav-actions" style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <button
            onClick={() => navigate("/login")}
            style={{
              background: "none",
              border: `1.5px solid ${THEME.colors.purple600}`,
              borderRadius: THEME.radius.button,
              padding: "8px 18px",
              color: THEME.colors.purple600,
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: THEME.transition,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = THEME.colors.purple50;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            style={{
              background: THEME.gradients.primaryBtn,
              border: "none",
              borderRadius: THEME.radius.button,
              padding: "10px 20px",
              color: THEME.colors.white,
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: THEME.shadows.button,
              transition: THEME.transition,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = "brightness(0.95)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="responsive-hero"
        style={{
          padding: "100px 40px",
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "64px",
          flexWrap: "wrap",
        }}
      >
        {/* Hero Left */}
        <div style={{ flex: "1.2", minWidth: "320px" }}>
          {/* Badge */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: THEME.colors.purple100,
              color: THEME.colors.purple700,
              padding: "6px 16px",
              borderRadius: THEME.radius.badge,
              fontSize: "13px",
              fontWeight: "700",
              marginBottom: "24px",
            }}
          >
            <GraduationCap size={16} />
            Built for Modern Hostels
          </span>

          <h1
            style={{
              fontSize: THEME.fonts.sizes.h1,
              fontWeight: "800",
              color: THEME.colors.gray900,
              lineHeight: "1.2",
              marginBottom: "20px",
              maxWidth: "560px",
            }}
          >
            Smart Complaint Management for Modern Hostels
          </h1>

          <p
            style={{
              fontSize: "18px",
              color: THEME.colors.gray700,
              lineHeight: "1.6",
              marginBottom: "32px",
              maxWidth: "480px",
            }}
          >
            Streamline resolution times, assign wardens instantly, and keep
            students informed every step of the way with a premium SaaS
            interface.
          </p>

          {/* Hero Buttons */}
          <div className="responsive-hero-buttons" style={{ display: "flex", gap: "16px", marginBottom: "40px" }}>
            <button
              onClick={() => navigate("/register")}
              style={{
                background: THEME.gradients.primaryBtn,
                border: "none",
                borderRadius: THEME.radius.button,
                padding: "14px 28px",
                color: THEME.colors.white,
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: THEME.shadows.button,
                transition: THEME.transition,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = "brightness(0.95)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <span>Start for Free</span>
              <ArrowRight size={18} />
            </button>
            <button
              style={{
                background: THEME.colors.white,
                border: `1.5px solid ${THEME.colors.gray200}`,
                borderRadius: THEME.radius.button,
                padding: "14px 28px",
                color: THEME.colors.gray700,
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: THEME.transition,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = THEME.colors.gray50;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = THEME.colors.white;
              }}
            >
              Watch Demo
            </button>
          </div>

          {/* Trust Bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Avatars */}
            <div style={{ display: "flex", marginRight: "8px" }}>
              {[1, 2, 3, 4, 5].map((idx) => (
                <div
                  key={idx}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    border: `2px solid ${THEME.colors.white}`,
                    backgroundColor: THEME.colors.purple500,
                    marginLeft: idx > 1 ? "-8px" : 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: THEME.colors.white,
                    fontSize: "10px",
                    fontWeight: "700",
                  }}
                >
                  {["A", "R", "S", "N", "K"][idx - 1]}
                </div>
              ))}
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  color: THEME.colors.yellow500,
                  fontSize: "14px",
                  lineHeight: 1,
                }}
              >
                ★★★★★
              </div>
              <span
                style={{
                  fontSize: "13px",
                  color: THEME.colors.gray500,
                  fontWeight: "500",
                }}
              >
                Trusted by 500+ students & staff
              </span>
            </div>
          </div>
        </div>

        {/* Hero Right: Mockup Card */}
        <div
          style={{
            flex: "0.8",
            minWidth: "320px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "460px",
              backgroundColor: THEME.colors.white,
              borderRadius: THEME.radius.card,
              boxShadow: "0 25px 50px -12px rgba(124, 58, 237, 0.25)",
              transform: "rotate(-2deg)",
              overflow: "hidden",
              border: `1px solid ${THEME.colors.gray100}`,
              transition: THEME.transition,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "rotate(0deg) scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "rotate(-2deg) scale(1)";
            }}
          >
            {/* Gradient accent bar */}
            <div style={{ height: "6px", background: THEME.gradients.hero }} />

            {/* Dashboard Mockup Content */}
            <div style={{ padding: "24px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: "11px",
                      color: THEME.colors.gray500,
                      fontWeight: "600",
                    }}
                  >
                    OVERVIEW
                  </span>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "800",
                      color: THEME.colors.gray900,
                    }}
                  >
                    Complaints Center
                  </div>
                </div>
                <span
                  style={{
                    color: THEME.colors.purple600,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Zap size={20} />
                </span>
              </div>

              {/* Mini Stat Cards */}
              <div
                style={{ display: "flex", gap: "8px", marginBottom: "24px" }}
              >
                {[
                  { value: "28", label: "Total", color: THEME.colors.blue500 },
                  {
                    value: "3",
                    label: "Pending",
                    color: THEME.colors.yellow500,
                  },
                  {
                    value: "25",
                    label: "Resolved",
                    color: THEME.colors.green500,
                  },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      backgroundColor: THEME.colors.gray50,
                      borderRadius: THEME.radius.small,
                      padding: "12px",
                      textAlign: "center",
                      border: `1px solid ${THEME.colors.gray100}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: "800",
                        color: THEME.colors.gray900,
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: THEME.colors.gray500,
                        fontWeight: "500",
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Small Complaints List */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {[
                  {
                    title: "Ceiling Fan Not Working",
                    cat: "Electrical",
                    status: "PENDING",
                  },
                  {
                    title: "Water Leakage Room 302",
                    cat: "Plumbing",
                    status: "IN_PROGRESS",
                  },
                  {
                    title: "Wi-Fi Speed Dropping",
                    cat: "Internet",
                    status: "RESOLVED",
                  },
                ].map((comp, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px",
                      backgroundColor: THEME.colors.white,
                      border: `1px solid ${THEME.colors.gray100}`,
                      borderRadius: "10px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          color: THEME.colors.gray900,
                        }}
                      >
                        {comp.title}
                      </div>
                      <div
                        style={{
                          fontSize: "10px",
                          color: THEME.colors.gray500,
                        }}
                      >
                        {comp.cat}
                      </div>
                    </div>
                    <StatusBadge status={comp.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        style={{
          backgroundColor: THEME.colors.gray50,
          padding: "100px 40px",
          borderTop: `1px solid ${THEME.colors.gray100}`,
          borderBottom: `1px solid ${THEME.colors.gray100}`,
        }}
      >
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}
        >
          <span
            style={{
              display: "inline-block",
              backgroundColor: THEME.colors.purple100,
              color: THEME.colors.purple600,
              fontSize: "11px",
              fontWeight: "700",
              padding: "4px 12px",
              borderRadius: THEME.radius.badge,
              letterSpacing: "0.8px",
              marginBottom: "16px",
            }}
          >
            FEATURES
          </span>
          <h2
            style={{
              fontSize: THEME.fonts.sizes.h2,
              fontWeight: "800",
              color: THEME.colors.gray900,
              marginBottom: "48px",
            }}
          >
            Everything you need to manage complaints
          </h2>

          {/* 3-Column Feature Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px",
              textAlign: "left",
            }}
          >
            {featureList.map((feat, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: THEME.colors.white,
                  borderRadius: THEME.radius.card,
                  padding: "24px",
                  boxShadow: THEME.shadows.card,
                  transition: THEME.transition,
                  cursor: "default",
                  border: `1px solid ${THEME.colors.gray100}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = THEME.shadows.cardHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = THEME.shadows.card;
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor: THEME.colors.purple50,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                    color: THEME.colors.purple600,
                  }}
                >
                  <feat.icon size={22} />
                </div>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: THEME.colors.gray900,
                    marginBottom: "8px",
                  }}
                >
                  {feat.title}
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: THEME.colors.gray500,
                    lineHeight: "1.6",
                  }}
                >
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Complaint Resolution Workflow Section */}
      <section
        id="how-it-works"
        style={{ padding: "100px 40px", backgroundColor: THEME.colors.white }}
      >
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}
        >
          <span
            style={{
              display: "inline-block",
              backgroundColor: THEME.colors.purple100,
              color: THEME.colors.purple600,
              fontSize: "11px",
              fontWeight: "700",
              padding: "4px 12px",
              borderRadius: THEME.radius.badge,
              letterSpacing: "0.8px",
              marginBottom: "16px",
            }}
          >
            WORKFLOW
          </span>
          <h2
            style={{
              fontSize: THEME.fonts.sizes.h2,
              fontWeight: "800",
              color: THEME.colors.gray900,
              marginBottom: "12px",
            }}
          >
            Complaint Resolution Workflow
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: THEME.colors.gray500,
              maxWidth: "650px",
              margin: "0 auto 64px auto",
              lineHeight: 1.6,
            }}
          >
            A transparent process that ensures every hostel issue is tracked,
            assigned, and resolved efficiently.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "24px",
            }}
          >
            {[
              {
                step: "01",
                title: "Complaint Registration",
                desc: "Students submit maintenance, internet, electrical, plumbing, or hostel-related issues through a simple complaint portal.",
              },
              {
                step: "02",
                title: "Smart Assignment",
                desc: "Administrators review complaints and assign them to the appropriate warden based on category and responsibility.",
              },
              {
                step: "03",
                title: "Resolution & Tracking",
                desc: "Wardens update progress in real time while students stay informed through status updates and notifications.",
              },
              {
                step: "04",
                title: "Verification & Closure",
                desc: "Resolved complaints are reviewed, confirmed, and archived with complete history for accountability.",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: THEME.colors.white,
                  borderRadius: THEME.radius.card,
                  padding: "32px 24px",
                  boxShadow: THEME.shadows.card,
                  border: `1px solid ${THEME.colors.gray200 || "#E5E7EB"}`,
                  textAlign: "left",
                  transition: THEME.transition,
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = THEME.shadows.cardHover;
                  e.currentTarget.style.borderColor = THEME.colors.purple200;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = THEME.shadows.card;
                  e.currentTarget.style.borderColor =
                    THEME.colors.gray200 || "#E5E7EB";
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "800",
                    color: THEME.colors.purple600,
                    backgroundColor: THEME.colors.purple50,
                    padding: "4px 8px",
                    borderRadius: "4px",
                    display: "inline-block",
                    marginBottom: "16px",
                  }}
                >
                  STEP {card.step}
                </span>
                <h3
                  style={{
                    fontSize: "17px",
                    fontWeight: "700",
                    color: THEME.colors.gray900,
                    marginBottom: "12px",
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: THEME.colors.gray500,
                    lineHeight: "1.6",
                    margin: 0,
                  }}
                >
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        id="stats"
        style={{
          background: THEME.gradients.hero,
          color: THEME.colors.white,
          padding: "80px 40px",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "800",
              marginBottom: "48px",
              color: THEME.colors.white,
            }}
          >
            Trusted by Hostel Communities
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "24px",
            }}
          >
            {[
              {
                icon: ClipboardCheck,
                val: "5,000+",
                label: "Complaints Managed",
              },
              {
                icon: CheckCircle,
                val: "98%",
                label: "Resolution Success Rate",
              },
              {
                icon: Clock3,
                val: "24 Hours",
                label: "Average Resolution Time",
              },
              { icon: Users, val: "500+", label: "Active Hostel Residents" },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: THEME.radius.card,
                  padding: "32px 24px",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  transition: THEME.transition,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.1)";
                }}
              >
                <div
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "50%",
                    width: "48px",
                    height: "48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                    color: THEME.colors.white,
                  }}
                >
                  <item.icon size={22} />
                </div>
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "800",
                    marginBottom: "8px",
                    lineHeight: 1,
                  }}
                >
                  {item.val}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: THEME.colors.purple100,
                  }}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section style={{ padding: '100px 40px', textAlign: 'center', backgroundColor: THEME.colors.white }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: '32px',
              fontWeight: '800',
              color: THEME.colors.gray900,
              marginBottom: '16px'
            }}
          >
            Build a More Efficient Hostel Support System
          </h2>
          <p
            style={{
              fontSize: '17px',
              color: THEME.colors.gray500,
              marginBottom: '32px',
              lineHeight: 1.6
            }}
          >
            Reduce complaint resolution delays, improve student satisfaction, and streamline hostel operations through a centralized complaint management platform.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/register')}
              style={{
                background: THEME.gradients.primaryBtn,
                border: 'none',
                borderRadius: THEME.radius.button,
                padding: '14px 28px',
                color: THEME.colors.white,
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: THEME.shadows.button,
                transition: THEME.transition
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'brightness(0.95)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: THEME.colors.white,
                border: `1.5px solid ${THEME.colors.purple600}`,
                borderRadius: THEME.radius.button,
                padding: '14px 28px',
                color: THEME.colors.purple600,
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: THEME.transition
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = THEME.colors.purple50;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = THEME.colors.white;
              }}
            >
              View Live Demo
            </button>
          </div>
        </div>
      </section> */}

      {/* Why Choose Section */}
      <section
        style={{
          backgroundColor: THEME.colors.gray50,
          padding: "100px 40px",
          borderTop: `1px solid ${THEME.colors.gray200}`,
        }}
      >
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}
        >
          <span
            style={{
              display: "inline-block",
              backgroundColor: THEME.colors.purple100,
              color: THEME.colors.purple600,
              fontSize: "11px",
              fontWeight: "700",
              padding: "4px 12px",
              borderRadius: THEME.radius.badge,
              letterSpacing: "0.8px",
              marginBottom: "16px",
            }}
          >
            BENEFITS
          </span>
          <h2
            style={{
              fontSize: THEME.fonts.sizes.h2,
              fontWeight: "800",
              color: THEME.colors.gray900,
              marginBottom: "48px",
            }}
          >
            Why Hostels Choose Hostel Help
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "24px",
              textAlign: "left",
            }}
          >
            {[
              {
                title: "Faster Complaint Resolution",
                desc: "Track every complaint from submission to closure with complete transparency.",
              },
              {
                title: "Centralized Management",
                desc: "Manage students, wardens, categories, and complaint history from one platform.",
              },
              {
                title: "Real-Time Updates",
                desc: "Students receive instant updates whenever complaint status changes.",
              },
              {
                title: "Actionable Insights",
                desc: "Monitor performance, identify recurring issues, and improve hostel services through analytics.",
              },
            ].map((benefit, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: THEME.colors.white,
                  borderRadius: THEME.radius.card,
                  padding: "32px 24px",
                  boxShadow: THEME.shadows.card,
                  border: `1px solid ${THEME.colors.gray200 || "#E5E7EB"}`,
                  transition: THEME.transition,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = THEME.shadows.cardHover;
                  e.currentTarget.style.borderColor = THEME.colors.purple200;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = THEME.shadows.card;
                  e.currentTarget.style.borderColor =
                    THEME.colors.gray200 || "#E5E7EB";
                }}
              >
                <div
                  style={{
                    backgroundColor: THEME.colors.purple50,
                    width: "40px",
                    height: "40px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                    color: THEME.colors.purple600,
                  }}
                >
                  <CheckCircle size={20} />
                </div>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: THEME.colors.gray900,
                    marginBottom: "8px",
                  }}
                >
                  {benefit.title}
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: THEME.colors.gray500,
                    lineHeight: "1.6",
                    margin: 0,
                  }}
                >
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: '#0A0F1D',
          color: THEME.colors.white,
          padding: '80px 40px 40px',
          borderTop: '1px solid #1F2937'
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            gap: '40px',
            flexWrap: 'wrap',
            marginBottom: '64px'
          }}
        >
          {/* Logo column */}
          <div style={{ flex: '1.2', minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <img
                src={hostelHelpLogo}
                alt="Hostel Help Logo"
                style={{
                  height: '44px',
                  width: 'auto',
                  objectFit: 'contain',
                  filter: 'brightness(0) invert(1)'
                }}
              />
            </div>
            <p
              style={{
                color: '#9CA3AF',
                fontSize: '13.5px',
                lineHeight: 1.6,
                margin: 0
              }}
            >
              Premium complaint management platform built specifically for hostel management.
            </p>
            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { icon: FacebookIcon, href: '#' },
                { icon: TwitterIcon, href: '#' },
                { icon: LinkedinIcon, href: '#' },
                { icon: InstagramIcon, href: '#' }
              ].map((soc, sIdx) => (
                <a
                  key={sIdx}
                  href={soc.href}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#9CA3AF',
                    transition: THEME.transition
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.color = THEME.colors.white;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = '#9CA3AF';
                  }}
                >
                  <soc.icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links columns mapping */}
          {[
            {
              title: 'Product',
              links: [
                { label: 'Features', href: '#' },
                { label: 'How It Works', href: '#how-it-works' },
                { label: 'Pricing', href: '#' },
                { label: 'Status', href: '#' }
              ]
            },
            {
              title: 'Company',
              links: [
                { label: 'About Us', href: '#' },
                { label: 'Careers', href: '#' },
                { label: 'Blog', href: '#' },
                { label: 'Contact', href: '#' }
              ]
            },
            {
              title: 'Resources',
              links: [
                { label: 'Help Center', href: '#' },
                { label: 'API Docs', href: '#' },
                { label: 'Guides', href: '#' },
                { label: 'FAQs', href: '#' }
              ]
            },
            {
              title: 'Legal',
              links: [
                { label: 'Privacy Policy', href: '#' },
                { label: 'Terms of Service', href: '#' },
                { label: 'Data Security', href: '#' },
                { label: 'Compliance', href: '#' }
              ]
            }
          ].map((col, idx) => (
            <div key={idx} style={{ flex: '0.8', minWidth: '110px' }}>
              <h4
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  marginBottom: '20px',
                  color: THEME.colors.white
                }}
              >
                {col.title}
              </h4>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <a
                      href={link.href}
                      style={{
                        textDecoration: 'none',
                        color: '#9CA3AF',
                        fontSize: '13px',
                        transition: THEME.transition
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = THEME.colors.purple400 || '#A78BFA';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = '#9CA3AF';
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Stay Updated Column */}
          <div style={{ flex: '1.5', minWidth: '260px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4
              style={{
                fontSize: '14px',
                fontWeight: '700',
                margin: 0,
                color: THEME.colors.white
              }}
            >
              Stay Updated
            </h4>
            <p
              style={{
                color: '#9CA3AF',
                fontSize: '13.5px',
                lineHeight: 1.5,
                margin: 0,
                maxWidth: '280px'
              }}
            >
              Subscribe to our newsletter for the latest updates.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success('Subscribed successfully!');
              }}
              style={{
                display: 'flex',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '4px',
                maxWidth: '320px',
                height: '44px',
                alignItems: 'center'
              }}
            >
              <input
                type="email"
                placeholder="Enter your email"
                required
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: THEME.colors.white,
                  fontSize: '13px',
                  padding: '0 12px',
                  flex: 1,
                  minWidth: 0
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: THEME.colors.purple600,
                  color: THEME.colors.white,
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0 16px',
                  height: '100%',
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: THEME.transition
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = THEME.colors.purple500;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = THEME.colors.purple600;
                }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            marginBottom: '32px'
          }}
        />

        {/* Copyright Bar */}
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            color: '#9CA3AF',
            fontSize: '13px'
          }}
        >
          <span>© {new Date().getFullYear()} Hostel Help. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
