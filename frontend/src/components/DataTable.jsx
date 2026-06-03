import React from 'react';
import { THEME } from '../theme';

const DataTable = ({ columns, data = [], renderRow, emptyMessage = 'No data available' }) => {
  return (
    <div
      style={{
        backgroundColor: THEME.colors.white,
        borderRadius: THEME.radius.card,
        boxShadow: THEME.shadows.card,
        border: `1px solid ${THEME.colors.gray200}`,
        overflow: 'hidden',
        width: '100%'
      }}
    >
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontFamily: THEME.fonts.family
          }}
        >
          <thead>
            <tr style={{ backgroundColor: THEME.colors.gray50, borderBottom: `1px solid ${THEME.colors.gray200}` }}>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  style={{
                    padding: '14px 20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: THEME.colors.gray500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    width: col.width || 'auto'
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    padding: '32px 20px',
                    textAlign: 'center',
                    color: THEME.colors.gray500,
                    fontSize: '14px'
                  }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, rowIdx) => (
                <tr
                  key={rowIdx}
                  style={{
                    borderBottom: rowIdx === data.length - 1 ? 'none' : `1px solid ${THEME.colors.gray100}`,
                    transition: 'background-color 0.2s ease',
                    cursor: 'default'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = THEME.colors.gray50;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {renderRow(item, rowIdx)}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
