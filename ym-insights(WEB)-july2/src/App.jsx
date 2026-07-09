import React, { useEffect, useRef, useState } from 'react';
import './index.css';

function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    const onScroll = () => {
      setShowScrollTop(window.scrollY > 420);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      animatedElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <div className="main-wrapper">
        <header className="header animate-fade-in">
          <div className="logo-container">
            <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '12px' }}>
              <path d="M50 10 L10 50 L25 65 L50 40 L75 65 L90 50 Z" fill="#0052cc" />
              <path d="M10 65 L25 80 L50 55 L75 80 L90 65 L50 25 Z" fill="#0066ff" />
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '1px', color: '#000' }}>YM-INSIGHTS</span>
              <span style={{ fontSize: '9px', fontWeight: '500', letterSpacing: '3px', color: '#64748B', textTransform: 'uppercase' }}>Scaling Businesses Seamlessly</span>
            </div>
          </div>

          <nav className="nav-links">
            <a href="#" className="nav-link">Platforms</a>
            <a href="#" className="nav-link">Pricing</a>
            <a href="#" className="nav-link">Sign In</a>
            <button className="btn-primary" style={{ padding: '10px 20px' }}>Start Free Trial &rarr;</button>
          </nav>
        </header>

        <section className="hero-section">
          <div className="hero-content">
            <div className="left-content animate-on-scroll slide-left">
              <div className="trust-badge">
                <div className="trust-dot"></div>
                Trusted by 500+ businesses across India
              </div>

              <h1 className="headline">
                Smart Employee<br />
                Management<br />
                <span>Software</span>
              </h1>

              <p className="description">
                YM-INSIGHTS unifies attendance, payroll, leave, and<br />
                analytics in one intelligent platform &mdash; so HR teams can<br />
                focus on people, not paperwork.
              </p>

              <div className="action-buttons">
                <button className="btn-primary" style={{ padding: '16px 32px', fontSize: '18px' }}>Start Free 14-Day Trial</button>
                <button className="btn-secondary" style={{ padding: '16px 32px', fontSize: '18px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="10 8 16 12 10 16 10 8"></polygon>
                  </svg>
                  Watch 2-min Demo
                </button>
              </div>

              <div className="reviews">
                <div className="avatars">
                  <img src="https://i.pravatar.cc/100?img=1" alt="User 1" className="avatar" />
                  <img src="https://i.pravatar.cc/100?img=2" alt="User 2" className="avatar" />
                  <img src="https://i.pravatar.cc/100?img=3" alt="User 3" className="avatar" />
                  <img src="https://i.pravatar.cc/100?img=4" alt="User 4" className="avatar" />
                  <img src="https://i.pravatar.cc/100?img=5" alt="User 5" className="avatar" />
                </div>
                <div className="review-text">
                  <div className="stars">★★★★★</div>
                  <strong>4.9/5</strong> from 200+ reviews &middot; <strong>10,000+</strong> employees managed
                </div>
              </div>
            </div>

            <div className="right-content animate-on-scroll slide-right">
              <div className="laptop-container">
                <img src="/laptop.png" alt="Dashboard on Laptop" className="laptop-frame" />

                {/* Floating Badges */}
                <div className="floating-badge badge-1 animate-scale-in delay-300">
                  <div className="badge-icon icon-green">✓</div>
                  <div className="badge-content">
                    <h4>98.4%</h4>
                    <p>Attendance accuracy<br /><span className="trend-up">↑ 12% this month</span></p>
                  </div>
                </div>

                <div className="floating-badge badge-2 animate-scale-in delay-400">
                  <div className="badge-icon icon-yellow">⚡</div>
                  <div className="badge-content">
                    <h4>3x Faster</h4>
                    <p>Payroll processing</p>
                  </div>
                </div>

                <div className="floating-badge badge-3 animate-scale-in delay-500">
                  <div className="badge-icon icon-blue">💰</div>
                  <div className="badge-content">
                    <h4>₹2,00,00,000</h4>
                    <p>This financial year</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="footer-section animate-fade-in-up">
          <img src="/img.png" alt="Footer Image" className="footer-image" />
        </footer>

        <section className="insights-section">
          <div className="insights-content-wrapper">
            <div className="insights-text-content animate-on-scroll fade-in">
              <span className="insights-badge">WHY YM-INSIGHTS</span>
              <h2 className="insights-title">Lorem ipsum</h2>
              <h2 className="insights-subtitle">Lorem ipsum dolor</h2>
              <p className="insights-description">
                We don't just automate HR tasks - we give you visibility,
                accuracy, and speed across every people operation.
              </p>
            </div>
            <div className="insights-features-grid">
              <div className="feature-box animate-on-scroll scale-up">
                <div className="feature-icon">🎯</div>
                <h3>Zero Proxy Attendance</h3>
                <p>
                  AI-powered face recognition ensures every attendance record is
                  accurate. Geofencing adds a second layer of verification - no
                  more buddy punching.
                </p>
              </div>
              <div className="feature-box animate-on-scroll scale-up">
                <div className="feature-icon">⚡</div>
                <h3>One-Click Payroll</h3>
                <p>
                  Automated salary calculation, tax deductions, and overtime
                  payments - processed in seconds. Your team gets accurate
                  payslips every cycle, guaranteed.
                </p>
              </div>
              <div className="feature-box animate-on-scroll scale-up">
                <div className="feature-icon">📊</div>
                <h3>Real-Time Insights</h3>
                <p>
                  Live dashboards that surface what matters - attendance trends,
                  salary expenditure, pending approvals - so you can act before
                  issues become problems.
                </p>
              </div>
            </div>
          </div>
        </section>

        <button
          className={`scroll-top-btn ${showScrollTop ? 'visible' : ''}`}
          onClick={handleScrollTop}
          aria-label="Scroll to top"
        >
          <span className="scroll-top-icon">↑</span>
        </button>

        <section className="features-header-section">
          <div className="features-header-content animate-on-scroll fade-in">
            <span className="product-badge">PRODUCT DEEP DIVE</span>
            <h2 className="features-heading">
              Every feature your<br />
              <span className="highlight">HR team</span> actually needs
            </h2>
          </div>
        </section>

        <section className="features-section">
          <div className="features-container">
            {/* Attendance Section */}
            <div className="feature-row animate-on-scroll fade-in">
            <div className="feature-content">
              <span className="feature-tag tag-attendance">🗓️ ATTENDANCE</span>
              <h2 className="feature-title">Smart attendance that can't be fooled</h2>
              <p className="feature-description">
                Eliminate attendance fraud with biometric-grade face recognition and GPS-based geofencing. Track check-ins,
                check-outs, breaks, overtime, and holidays — all in real time.
              </p>
              <ul className="feature-list">
                <li>Face recognition with liveness detection</li>
                <li>Geofence zones for remote & field teams</li>
                <li>Auto check-in/out with break time tracking</li>
                <li>Biometric device integration & logs</li>
                <li>Manual override with audit trail</li>
              </ul>
            </div>
            <div className="feature-image">
              <img src="/one.png" alt="Attendance System" className="screenshot" />
              <div className="face-id-badge">
                <div className="face-id-icon">🤖</div>
                <div className="face-id-content">
                  <div className="face-id-text">Face ID verified</div>
                  <div className="face-id-confidence">99.2% match confidence</div>
                </div>
              </div>
            </div>
          </div>

          {/* Payroll Section */}
          <div className="feature-row reverse animate-on-scroll fade-in">
            <div className="feature-content">
              <span className="feature-tag tag-payroll">💰 PAYROLL</span>
              <h2 className="feature-title">Payroll that runs itself - accurately</h2>
              <p className="feature-description">
                From salary calculations to tax deductions and overtime - everything is automated. Your team gets their payslips on time, every time, with zero manual errors.
              </p>
              <ul className="feature-list">
                <li>Auto salary & CTC breakdown calculation</li>
                <li>TDS, PF, ESI deduction handling</li>
                <li>Overtime & incentive payments</li>
                <li>One-click payslip generation & download</li>
                <li>Financial year salary expenditure reports</li>
              </ul>
            </div>
            <div className="feature-image">
              <img src="/two.png" alt="Payroll System" className="screenshot" />
            </div>
          </div>

          {/* Leave Management Section */}
          <div className="feature-row animate-on-scroll fade-in">
            <div className="feature-content">
              <span className="feature-tag tag-leave">🏖️ LEAVE</span>
              <h2 className="feature-title">Leave management that's actually painless</h2>
              <p className="feature-description">
                Multi-level approval workflows, automatic balance tracking, and holiday calendars make leave management effortless.
              </p>
              <ul className="feature-list">
                <li>Multi-level leave approval workflow</li>
                <li>Auto leave balance & accrual tracking</li>
                <li>Holiday calendar with regional festivals</li>
                <li>Leave history & trend analytics</li>
                <li>Comp-off and carry-forward rules</li>
              </ul>
            </div>
            <div className="feature-image">
              <img src="/three.png" alt="Leave Management System" className="screenshot" />
            </div>
          </div>

          {/* HR Intelligence Section */}
          <div className="feature-row reverse animate-on-scroll fade-in">
            <div className="feature-content">
              <span className="feature-tag tag-analytics">📊 ANALYTICS</span>
              <h2 className="feature-title">HR intelligence that drives decisions</h2>
              <p className="feature-description">
                Interactive dashboards and analytics give you visibility into attendance trends, salary expenditure, and workforce metrics.
              </p>
              <ul className="feature-list">
                <li>Interactive attendance & trend charts</li>
                <li>Salary expenditure year-over-year</li>
                <li>Department-wise workforce analytics</li>
                <li>Export to PDF, Excel or CSV</li>
                <li>Scheduled automated report delivery</li>
              </ul>
            </div>
            <div className="feature-image">
              <img src="/four.png" alt="HR Intelligence Dashboard" className="screenshot" />
            </div>
          </div>
          </div>
        </section>

        <section className="grid-section">
          <div className="grid-content-wrapper">
            <div className="grid-text-content animate-on-scroll fade-in">
              <span className="grid-badge">ALL MODULES</span>
              <h2 className="grid-title">Complete HR. <span className="highlight">Nothing missing.</span></h2>
              <p className="grid-description">
                Nine purpose-built modules working together so you never need another HR tool again.
              </p>
            </div>
            <div className="grid-9-box-layout">
              <div className="grid-box animate-on-scroll scale-up">
                <div className="grid-box-icon bg-light-blue">🏠</div>
                <h3 className="grid-box-title">Dashboard</h3>
                <p className="grid-box-desc">Get a complete overview of workforce activities with quick access to important HR operations and real-time updates.</p>
                <div className="grid-box-tags">
                  <span className="grid-box-tag">Live Data</span>
                  <span className="grid-box-tag">Analytics</span>
                  <span className="grid-box-tag">Overview</span>
                </div>
              </div>
              <div className="grid-box animate-on-scroll scale-up">
                <div className="grid-box-icon bg-light-orange">📷</div>
                <h3 className="grid-box-title">Smart Attendance</h3>
                <p className="grid-box-desc">Track employee attendance using Face ID, GPS geofencing, and biometric verification for accurate records.</p>
                <div className="grid-box-tags">
                  <span className="grid-box-tag">Face ID</span>
                  <span className="grid-box-tag">Geofence</span>
                  <span className="grid-box-tag">Biometric</span>
                </div>
              </div>
              <div className="grid-box animate-on-scroll scale-up">
                <div className="grid-box-icon bg-light-green">⏱️</div>
                <h3 className="grid-box-title">Time & Productivity</h3>
                <p className="grid-box-desc">Monitor work hours, overtime, shift schedules, and employee productivity with detailed reports.</p>
                <div className="grid-box-tags">
                  <span className="grid-box-tag">Timesheets</span>
                  <span className="grid-box-tag">Shifts</span>
                  <span className="grid-box-tag">Overtime</span>
                </div>
              </div>
              <div className="grid-box animate-on-scroll scale-up">
                <div className="grid-box-icon bg-light-pink">🌴</div>
                <h3 className="grid-box-title">Leave Management</h3>
                <p className="grid-box-desc">Apply, approve, and monitor employee leave balances with an easy-to-use leave management system.</p>
                <div className="grid-box-tags">
                  <span className="grid-box-tag">Approvals</span>
                  <span className="grid-box-tag">Balance</span>
                  <span className="grid-box-tag">Calendar</span>
                </div>
              </div>
              <div className="grid-box animate-on-scroll scale-up">
                <div className="grid-box-icon bg-light-yellow">💳</div>
                <h3 className="grid-box-title">Payroll</h3>
                <p className="grid-box-desc">Automate salary processing, tax deductions, PF calculations, and monthly payslip generation.</p>
                <div className="grid-box-tags">
                  <span className="grid-box-tag">Salary</span>
                  <span className="grid-box-tag">TDS</span>
                  <span className="grid-box-tag">Payslips</span>
                </div>
              </div>
              <div className="grid-box animate-on-scroll scale-up">
                <div className="grid-box-icon bg-light-cyan">👥</div>
                <h3 className="grid-box-title">Employee Self-Service</h3>
                <p className="grid-box-desc">Allow employees to manage profiles, attendance, leave requests, and salary details independently.</p>
                <div className="grid-box-tags">
                  <span className="grid-box-tag">Self Service</span>
                  <span className="grid-box-tag">Mobile</span>
                  <span className="grid-box-tag">ESS</span>
                </div>
              </div>
              <div className="grid-box animate-on-scroll scale-up">
                <div className="grid-box-icon bg-light-peach">✈️</div>
                <h3 className="grid-box-title">Expense & Travel</h3>
                <p className="grid-box-desc">Submit travel requests, manage expense claims, and track reimbursements effortlessly.</p>
                <div className="grid-box-tags">
                  <span className="grid-box-tag">Claims</span>
                  <span className="grid-box-tag">Travel</span>
                  <span className="grid-box-tag">Reimburse</span>
                </div>
              </div>
              <div className="grid-box animate-on-scroll scale-up">
                <div className="grid-box-icon bg-lavender">🔄</div>
                <h3 className="grid-box-title">Employee Lifecycle</h3>
                <p className="grid-box-desc">Simplify onboarding, promotions, transfers, and offboarding with centralized employee records.</p>
                <div className="grid-box-tags">
                  <span className="grid-box-tag">Onboarding</span>
                  <span className="grid-box-tag">Offboarding</span>
                  <span className="grid-box-tag">Lifecycle</span>
                </div>
              </div>
              <div className="grid-box animate-on-scroll scale-up">
                <div className="grid-box-icon bg-mint-green">📊</div>
                <h3 className="grid-box-title">Reports & Analytics</h3>
                <p className="grid-box-desc">Generate powerful HR reports with workforce insights, attendance trends, and payroll analytics.</p>
                <div className="grid-box-tags">
                  <span className="grid-box-tag">Reports</span>
                  <span className="grid-box-tag">Export</span>
                  <span className="grid-box-tag">Insights</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="platforms-section">
          <div className="platforms-container">
            <div className="platforms-header animate-on-scroll fade-in">
              <span className="platforms-badge">PLATFORMS</span>
              <h2 className="platforms-title">Work your way,<br /><span className="highlight">on every device</span></h2>
              <p className="platforms-subtitle">
                Web, mobile, desktop, and biometric — full HR in your hands wherever you are.
              </p>
            </div>
            <div className="platforms-grid">
              <div className="platform-card animate-on-scroll scale-up">
                <div className="platform-card-icon">📱</div>
                <h3 className="platform-card-title">Mobile App</h3>
                <p className="platform-card-description">
                  Full HR operations on the go. Mark attendance, apply leave, view payslips, and track approvals from your phone.
                </p>
                <ul className="platform-card-features">
                  <li>Face recognition attendance</li>
                  <li>Geofence check-in/check-out</li>
                  <li>Leave & approval management</li>
                  <li>Payslips & salary history</li>
                </ul>
                <div className="platform-card-buttons">
                  <button className="btn-outline">Get it on Google Play</button>
                  <button className="btn-outline">Download on the App Store</button>
                </div>
              </div>
              <div className="platform-card animate-on-scroll scale-up">
                <div className="platform-card-icon">🔐</div>
                <h3 className="platform-card-title">YM Insight Biometric</h3>
                <p className="platform-card-description">
                  Advanced biometric attendance app with real-time sync, liveness detection, and zero-proxy attendance.
                </p>
                <ul className="platform-card-features">
                  <li>AI face recognition + liveness</li>
                  <li>Prevents buddy punching</li>
                  <li>Real-time HRMS synchronization</li>
                  <li>Works with geofence tracking</li>
                </ul>
                <div className="platform-card-buttons">
                  <button className="btn-outline">Download App</button>
                </div>
              </div>
              <div className="platform-card animate-on-scroll scale-up">
                <div className="platform-card-icon">🌐</div>
                <h3 className="platform-card-title">Web Platform</h3>
                <p className="platform-card-description">
                  Browser-first access with real-time cloud synchronization. Scales seamlessly from startups to enterprise organizations.
                </p>
                <ul className="platform-card-features">
                  <li>Access from any browser</li>
                  <li>Real-time cloud synchronization</li>
                  <li>Role-based access control</li>
                  <li>ISO 27001 & GDPR compliant</li>
                </ul>
                <div className="platform-card-buttons">
                  <button className="btn-outline">Open Web App</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="results-section">
          <div className="results-container">
            <div className="results-header animate-on-scroll fade-in">
              <span className="results-badge">BY THE NUMBERS</span>
              <h2 className="results-title">Results that speak<br /><span className="highlight">for themselves</span></h2>
            </div>
            <div className="stats-card animate-on-scroll scale-up">
              <div className="stat">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Employees Managed</div>
                <div className="stat-sublabel">Across 500+ organizations</div>
              </div>
              <div className="stat">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Platform Uptime</div>
                <div className="stat-sublabel">Guaranteed SLA</div>
              </div>
              <div className="stat">
                <div className="stat-number">3×</div>
                <div className="stat-label">Faster Payroll</div>
                <div className="stat-sublabel">vs. manual processing</div>
              </div>
              <div className="stat">
                <div className="stat-number">4.9★</div>
                <div className="stat-label">Customer Rating</div>
                <div className="stat-sublabel">From 200+ verified reviews</div>
              </div>
            </div>
          </div>
        </section>

        <section className="testimonials-section">
          <div className="testimonials-container">
            <div className="testimonials-header animate-on-scroll fade-in">
              <span className="testimonials-badge">CUSTOMER STORIES</span>
              <h2 className="testimonials-title">Loved by HR teams<br /><span className="highlight">across industries</span></h2>
            </div>
            <div className="testimonials-grid">
              <div className="testimonial-card animate-on-scroll scale-up">
                <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
                <p className="testimonial-text">
                  "YM-INSIGHTS reduced our payroll processing time from two days to under two hours. Automated calculations saved our HR team countless hours every month."
                </p>
                <div className="testimonial-profile">
                  <div className="profile-avatar">👨‍💼</div>
                  <div className="profile-info">
                    <div className="profile-name">Rajesh Kumar</div>
                    <div className="profile-role">HR Director</div>
                    <div className="profile-company">TechCorp India</div>
                  </div>
                </div>
              </div>
              <div className="testimonial-card animate-on-scroll scale-up">
                <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
                <p className="testimonial-text">
                  "The face recognition attendance system completely eliminated proxy attendance. Accuracy improved from 82% to 98.4% within the first week."
                </p>
                <div className="testimonial-profile">
                  <div className="profile-avatar">👩‍💼</div>
                  <div className="profile-info">
                    <div className="profile-name">Anitha Rajan</div>
                    <div className="profile-role">Operations Manager</div>
                    <div className="profile-company">BuildMax</div>
                  </div>
                </div>
              </div>
              <div className="testimonial-card animate-on-scroll scale-up">
                <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
                <p className="testimonial-text">
                  "Our field sales team loves the geofence check-in. Attendance is automatic and managers now have real-time visibility."
                </p>
                <div className="testimonial-profile">
                  <div className="profile-avatar">👨‍💼</div>
                  <div className="profile-info">
                    <div className="profile-name">Praveen Nair</div>
                    <div className="profile-role">Sales Head</div>
                    <div className="profile-company">RetailNow</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pricing-section">
          <div className="pricing-container">
            <div className="pricing-header animate-on-scroll fade-in">
              <span className="pricing-badge">PRICING</span>
              <h2 className="pricing-title">Transparent pricing,<br /><span className="highlight">no surprises</span></h2>
              <p className="pricing-subtitle">
                Start free, scale as you grow. All plans include a 14-day free trial.
              </p>
            </div>

            <div className="pricing-toggle animate-on-scroll scale-up">
              <button className="toggle-btn active">Monthly</button>
              <div className="toggle-slider"></div>
              <button className="toggle-btn">Annual</button>
              <span className="save-badge">Save 20%</span>
            </div>

            <div className="pricing-grid">
              <div className="pricing-card starter-card animate-on-scroll scale-up">
                <h3 className="card-title">Starter</h3>
                <p className="card-description">For small teams getting started with HR automation.</p>
                <div className="card-price">
                  <span className="price-amount">₹49</span>
                  <span className="price-period">/mo</span>
                </div>
                <p className="price-note">per employee • billed monthly</p>
                <div className="card-divider"></div>
                <ul className="card-features">
                  <li>✓ Dashboard</li>
                  <li>✓ Basic attendance tracking</li>
                  <li>✓ Leave Management</li>
                  <li>✓ Permission Management</li>
                  <li>✓ Reimbursement Management</li>
                  <li>✓ Payroll Management</li>
                  <li>✓ Reports & Analytics</li>
                </ul>
                <button className="btn-outline pricing-cta">Start Now →</button>
              </div>

              <div className="pricing-card professional-card animate-on-scroll scale-up">
                <div className="popular-badge">MOST POPULAR</div>
                <h3 className="card-title">Professional</h3>
                <div className="card-price">
                  <span className="price-amount">₹99</span>
                  <span className="price-period">/mo</span>
                </div>
                <p className="price-note">per employee • billed monthly</p>
                <div className="card-divider"></div>
                <ul className="card-features">
                  <li>✓ Dashboard</li>
                  <li>✓ Face recognition & Location based Attendance</li>
                  <li>✓ Leave Management</li>
                  <li>✓ On Duty Management</li>
                  <li>✓ Permission Management</li>
                  <li>✓ Reimbursement Management</li>
                  <li>✓ Time Sheet Entry</li>
                  <li>✓ Shift Schedule</li>
                  <li>✓ Payroll Management</li>
                  <li>✓ Onboarding</li>
                  <li>✓ Offboarding</li>
                  <li>✓ Reports & Analytics</li>
                </ul>
                <button className="btn-primary pricing-cta">Start Now →</button>
              </div>

              <div className="pricing-card premium-card animate-on-scroll scale-up">
                <h3 className="card-title">Premium</h3>
                <p className="card-description">For growing enterprises.</p>
                <div className="card-price">
                  <span className="price-amount">₹150</span>
                  <span className="price-period">/mo</span>
                </div>
                <p className="price-note">per employee • billed monthly</p>
                <div className="card-divider"></div>
                <ul className="card-features">
                  <li>✓ Everything in Professional +</li>
                  <li>✓ Biometric integrations</li>
                  <li>✓ Salary Advance Management</li>
                  <li>✓ Over Time Management</li>
                  <li>✓ Time Sheet Entry</li>
                  <li>✓ Shift Schedule</li>
                  <li>✓ Payroll Management</li>
                  <li>✓ Onboarding</li>
                  <li>✓ Offboarding</li>
                  <li>✓ Reports & Analytics</li>
                </ul>
                <button className="btn-outline pricing-cta">Start Now →</button>
              </div>
            </div>

            <div className="cta-banner animate-on-scroll scale-up">
              <div className="cta-content">
                <h3 className="cta-title">Ready to transform the way<br />your team works?</h3>
                <p className="cta-description">
                  Join 500+ businesses already managing their workforce smarter with YM-INSIGHTS.
                </p>
              </div>
              <div className="cta-buttons">
                <button className="btn-primary cta-primary">Start Free 14-Day Trial</button>
                <button className="btn-outline cta-secondary">Schedule a Live Demo</button>
                <p className="cta-caption">No credit card · Cancel anytime · Full access</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="footer-section">
          <div className="footer-container">
            <div className="footer-grid animate-on-scroll fade-in">
              <div className="footer-column">
                <div className="footer-logo">
                  <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 10 L10 50 L25 65 L50 40 L75 65 L90 50 Z" fill="#0052cc" />
                    <path d="M10 65 L25 80 L50 55 L75 80 L90 65 L50 25 Z" fill="#0066ff" />
                  </svg>
                  <span className="footer-logo-text">YM-INSIGHTS</span>
                </div>
                <p className="footer-description">
                  Intelligent HR and workforce management platform built for modern Indian businesses — from startups to enterprises.
                </p>
                <div className="social-icons">
                  <button className="social-btn" aria-label="Twitter">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </button>
                  <button className="social-btn" aria-label="LinkedIn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </button>
                  <button className="social-btn" aria-label="Facebook">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                  <button className="social-btn" aria-label="YouTube">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="footer-column">
                <h4 className="footer-heading">Product</h4>
                <ul className="footer-links">
                  <li><a href="#">Dashboard</a></li>
                  <li><a href="#">Attendance</a></li>
                  <li><a href="#">Payroll</a></li>
                  <li><a href="#">Leave Management</a></li>
                  <li><a href="#">Reports</a></li>
                  <li><a href="#">Biometric App</a></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4 className="footer-heading">Company</h4>
                <ul className="footer-links">
                  <li><a href="#">About Us</a></li>
                  <li><a href="#">Careers</a></li>
                  <li><a href="#">Blog</a></li>
                  <li><a href="#">Press</a></li>
                  <li><a href="#">Contact</a></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4 className="footer-heading">Support</h4>
                <ul className="footer-links">
                  <li><a href="#">Help Center</a></li>
                  <li><a href="#">API Docs</a></li>
                  <li><a href="#">System Status</a></li>
                  <li><a href="#">Privacy Policy</a></li>
                  <li><a href="#">Terms of Service</a></li>
                </ul>
              </div>
            </div>

            <div className="footer-divider"></div>

            <div className="footer-bottom">
              <div className="footer-copyright">
                <p>© 2025 YM-INSIGHTS. All rights reserved.</p>
                <p>Made in India 🇮🇳</p>
              </div>
              <div className="footer-bottom-links">
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
                <a href="#">Cookies</a>
                <a href="#">Security</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
