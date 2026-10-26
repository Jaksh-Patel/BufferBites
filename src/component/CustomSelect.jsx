import React, { useState, useRef, useEffect } from 'react';

export default function CustomSelect({ value, onChange, options, placeholder = '', className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // helper to get display text
  const getDisplayValue = () => {
    if (!value) return placeholder;
    for (const opt of options) {
      if (opt.group) {
        const match = opt.items.find(i => i.value === value);
        if (match) return match.label;
      } else {
        if (opt.value === value) return opt.label;
      }
    }
    return value;
  };

  return (
    <div className={`input-field m-0 p-0 ${className}`} style={{marginBottom: 0}} ref={ref}>
      <div
        className={`input-wrapper custom-select ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
      >
        <div className={`custom-select-display ${!value ? 'placeholder' : ''}`}
             style={{ minHeight: '36px', padding: '8px 30px 8px 12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
          {getDisplayValue()}
        </div>
        <span className="input-highlight" />
        <svg className={`select-arrow ${isOpen ? 'open' : ''}`} style={{ right: '10px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      {isOpen && (
        <ul className="custom-dropdown-menu" style={{ zIndex: 100 }}>
          {options.map((opt, i) => {
            if (opt.group) {
              return (
                <React.Fragment key={i}>
                  <li className="custom-dropdown-group-label" style={{ padding: '8px 12px', fontSize: '11px', fontWeight: 'bold', color: '#888', background: 'rgba(0,0,0,0.02)' }}>
                    {opt.group}
                  </li>
                  {opt.items.map(item => (
                    <li
                      key={item.value}
                      className={`custom-dropdown-item ${value === item.value ? 'selected' : ''}`}
                      style={{ paddingLeft: '24px' }}
                      onClick={() => {
                        onChange({ target: { value: item.value } });
                        setIsOpen(false);
                      }}
                    >
                      {item.label}
                    </li>
                  ))}
                </React.Fragment>
              );
            }
            return (
              <li
                key={opt.value}
                className={`custom-dropdown-item ${value === opt.value ? 'selected' : ''}`}
                onClick={() => {
                  onChange({ target: { value: opt.value } });
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}


