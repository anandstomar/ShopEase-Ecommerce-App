import React from 'react';

const NotificationPermission = () => {
return (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fcefe8', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '20px' }}>
        
        {/* Main Card */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '40px', maxWidth: '540px', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          
          {/* Header */}
          <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#1a1a1a', marginTop: 0, fontSize: '24px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#b04646" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              <path d="M18.63 13A17.89 17.89 0 0 1 18 8"></path>
              <path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"></path>
              <path d="M18 8a6 6 0 0 0-9.33-5"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
            Notifications Are Required
          </h2>
          
          <p style={{ color: '#4a4a4a', fontSize: '16px', lineHeight: '1.5', textAlign: 'center', marginBottom: '30px' }}>
            To proceed, ShopEase needs your permission to send order updates and shipping confirmations.
          </p>
          
          {/* Dashed Instruction Box */}
          <div style={{ backgroundColor: '#f4f5f7', border: '2px dashed #b04646', borderRadius: '8px', padding: '25px', color: '#1a1a1a', textAlign: 'left' }}>
            <p style={{ margin: '0 0 20px 0', fontWeight: 'bold', fontSize: '16px' }}>How to enable notifications:</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Step 1 */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                  <path d="M8 13v-8.5a1.5 1.5 0 0 1 3 0v7.5"/><path d="M11 11.5v-2a1.5 1.5 0 1 1 3 0v2.5"/><path d="M14 10.5v-1a1.5 1.5 0 1 1 3 0v3.5"/><path d="M17 11.5v-1a1.5 1.5 0 1 1 3 0v4.5a6 6 0 0 1-6 6h-2c-2.5 0-5-2-6-5l-2-4a2 2 0 0 1 3.5-2l2.5 2.5v-8.5a1.5 1.5 0 0 1 3 0v4.5"/>
                </svg>
                <span>1. Look up to your browser's URL address bar.</span>
              </div>
              
              {/* Step 2 */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                  <path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 8h6"/>
                </svg>
                <span style={{ lineHeight: '1.6' }}>
                  2. Click the 'Site Info' (
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderRadius: '4px', padding: '2px', border: '1px solid #ddd', margin: '0 4px', verticalAlign: 'middle' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#f5b041" stroke="#e67e22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </span>
                  or
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderRadius: '4px', padding: '2px', border: '1px solid #ddd', margin: '0 4px', verticalAlign: 'middle' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11 7h11v2h-11v-2zm-2 1c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM3 7h2v2H3V7zm10 10h8v-2h-8v2zm-2-1c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM3 15h12v2H3v-2z" /></svg>
                  </span>
                  ) or 'Settings' (
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderRadius: '4px', padding: '2px', border: '1px solid #ddd', margin: '0 4px', verticalAlign: 'middle' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                  </span>
                  ) icon next to the website URL.
                </span>
              </div>
              
              {/* Step 3 */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                <svg width="26" height="24" viewBox="0 0 32 18" style={{ flexShrink: 0, marginTop: '2px' }}>
                  <rect width="32" height="18" rx="9" fill="#1a1a1a"/><circle cx="23" cy="9" r="6" fill="#fff"/>
                </svg>
                <span>3. Find the <strong>Notifications</strong> setting and change it to <strong>Allow</strong>.</span>
              </div>
            </div>

            <p style={{ marginTop: '25px', fontSize: '14px', color: '#666', fontStyle: 'italic', textAlign: 'center' }}>
              (This page will automatically close once you grant permission.)
            </p>
          </div>

          {/* Footer Loading Area */}
          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#1a1a1a', fontWeight: 'bold' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
              </svg>
              Waiting for permission...
            </div>
            <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '14px' }}>
              Please grant access in the browser menu.
            </p>
          </div>
          
        </div>
      </div>
    );
};

export default NotificationPermission;