import React from 'react';
import './index.css';

function App() {
  return (
    <div className="app-container">
      <div className="main-wrapper">
        <header className="header">
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
            <div className="left-content">
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
            
            <div className="right-content">
              <div className="laptop-container">
                <img src="/laptop.png" alt="Dashboard on Laptop" className="laptop-frame" />
                
                {/* Floating Badges */}
                <div className="floating-badge badge-1">
                  <div className="badge-icon icon-green">✓</div>
                  <div className="badge-content">
                    <h4>98.4%</h4>
                    <p>Attendance accuracy<br /><span className="trend-up">↑ 12% this month</span></p>
                  </div>
                </div>
                
                <div className="floating-badge badge-2">
                  <div className="badge-icon icon-yellow">⚡</div>
                  <div className="badge-content">
                    <h4>3x Faster</h4>
                    <p>Payroll processing</p>
                  </div>
                </div>
                
                <div className="floating-badge badge-3">
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

        <footer className="footer-section">
          <img src="/img.png" alt="Footer Image" className="footer-image" />
        </footer>

        <section className="insights-section">
          <div className="insights-content-wrapper">
            <div className="insights-text-content">
              <span className="insights-badge">WHY YM-INSIGHTS</span>
              <h2 className="insights-title">Lorem ipsum</h2>
              <h2 className="insights-subtitle">Lorem ipsum dolor</h2>
              <p className="insights-description">
                We don't just automate HR tasks - we give you visibility,<br />
                accuracy, and speed across every people operation.
              </p>
            </div>
            <div className="insights-features-grid">
              <div className="feature-box">
                <div className="feature-icon">🎯</div>
                <h3>Zero Proxy Attendance</h3>
                <p>
                  AI-powered face recognition ensures every attendance record is
                  accurate. Geofencing adds a second layer of verification - no
                  more buddy punching.
                </p>
              </div>
              <div className="feature-box">
                <div className="feature-icon">⚡</div>
                <h3>One-Click Payroll</h3>
                <p>
                  Automated salary calculation, tax deductions, and overtime
                  payments - processed in seconds. Your team gets accurate
                  payslips every cycle, guaranteed.
                </p>
              </div>
              <div className="feature-box">
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

        <section className="features-header-section">
          <div className="features-header-content">
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
            <div className="feature-row">
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
          <div className="feature-row reverse">
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
          <div className="feature-row">
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
          <div className="feature-row reverse">
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
      </div>
    </div>
  );
}

export default App;
