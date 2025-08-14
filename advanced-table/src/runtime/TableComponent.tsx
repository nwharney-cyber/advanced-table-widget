import { React, DataRecord } from 'jimu-core';
import { TableWidgetConfig } from '../types/TableWidgetConfig';

interface TableComponentProps {
  /** Configuration object for table display and behavior */
  config: TableWidgetConfig;
  
  /** Array of data records to display */
  dataRecords: DataRecord[];
  
  /** Array of field names to display as columns */
  fields: string[];
  
  /** Search term for filtering records */
  search: string;
  
  /** Current sort field */
  sortField: string | null;
  
  /** Current sort order */
  sortOrder: 'asc' | 'desc';
  
  /** Current page number */
  page: number;
  
  /** Selected row index */
  selectedRow: number | null;
  
  /** Function to handle column sorting */
  onSort: (field: string) => void;
  
  /** Function to handle row selection */
  onRowSelect: (rowIndex: number) => void;
  
  /** Function to export data to CSV */
  onExport: (records: DataRecord[], fields: string[]) => void;
  
  /** Function to handle page changes */
  onPageChange: (page: number) => void;
  
  /** Internationalization function */
  formatMessage: (options: { id: string; defaultMessage: string }) => string;
}

/**
 * TableComponent handles the rendering of the data table with all its features
 * including sorting, pagination, selection, and styling.
 */
export function TableComponent(props: TableComponentProps) {
  const {
    config,
    dataRecords,
    fields,
    search,
    sortField,
    sortOrder,
    page,
    selectedRow,
    onSort,
    onRowSelect,
    onExport,
    onPageChange,
    formatMessage
  } = props;

  const {
    enableSorting = true,
    enableFiltering = true,
    showFooter = true,
    showColumns = {},
    columnLabels = {},
    tableColor = "#FFFFFF",
    headerColor = "#2196F3",
    headerBold = true,
    rowHoverColor = "#E3F2FD",
    showRowNumbers = false,
    enablePagination = true,
    allowExport = true,
    allowRowSelection = false,
    showGridlines = true,
    fontSize = 14,
    cellPadding = 8,
    tableWidth = "100%",
    headerSticky = false,
    rowHighlight = false,
    defaultPageSize = 10
  } = config;

  const pageSize = defaultPageSize;

  // Filtering logic
  const filtered = React.useMemo(() => {
    if (!enableFiltering || !search) return dataRecords;
    
    return dataRecords.filter(record =>
      fields.some(field => {
        const value = record.getData()[field];
        return (value ?? '')
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase());
      })
    );
  }, [dataRecords, fields, search, enableFiltering]);

  // Sorting logic
  const sorted = React.useMemo(() => {
    if (!enableSorting || !sortField) return filtered;
    
    return [...filtered].sort((a, b) => {
      const aValue = a.getData()[sortField];
      const bValue = b.getData()[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortOrder === 'asc'
        ? (aValue ?? 0) - (bValue ?? 0)
        : (bValue ?? 0) - (aValue ?? 0);
    });
  }, [filtered, sortField, sortOrder, enableSorting]);

  // Pagination logic
  const totalRecords = sorted.length;
  const pageCount = enablePagination ? Math.ceil(totalRecords / pageSize) : 1;
  const paged = enablePagination
    ? sorted.slice((page - 1) * pageSize, page * pageSize)
    : sorted;

  // Handle case where no records are found
  if (totalRecords === 0) {
    return (
      <div style={{ 
        padding: 20, 
        textAlign: 'center', 
        color: '#666',
        backgroundColor: '#f5f5f5',
        border: '1px solid #ddd',
        borderRadius: 4
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#999' }}>No Records Found</h3>
        <p style={{ margin: 0 }}>
          {search 
            ? `No records match the search term "${search}".`
            : 'No data available to display.'
          }
        </p>
        {search && (
          <p style={{ margin: '10px 0 0 0', fontSize: '0.9em' }}>
            Try adjusting your search criteria or check your data source.
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Export button */}
      {allowExport && (
        <div style={{ marginBottom: 8 }}>
          <button onClick={() => onExport(sorted, fields)}>
            Export to CSV
          </button>
        </div>
      )}

      {/* Data table */}
      <table style={{
        width: tableWidth,
        borderCollapse: 'collapse',
        marginTop: 8,
        backgroundColor: tableColor,
        fontSize,
        border: showGridlines ? '1px solid #ddd' : 'none'
      }}>
        {/* Table header */}
        <thead style={{
          backgroundColor: headerColor,
          fontWeight: headerBold ? 'bold' : 'normal',
          position: headerSticky ? 'sticky' : 'static',
          top: headerSticky ? 0 : undefined,
          zIndex: headerSticky ? 1 : undefined
        }}>
          <tr>
            {showRowNumbers && (
              <th style={{ padding: cellPadding }}>#</th>
            )}
            {fields.map(field => (
              <th
                key={field}
                onClick={() => onSort(field)}
                style={{
                  borderBottom: showGridlines ? '1px solid #ccc' : 'none',
                  textAlign: 'left',
                  padding: cellPadding,
                  cursor: enableSorting ? 'pointer' : 'default'
                }}
              >
                {columnLabels[field] || field}
                {enableSorting && sortField === field 
                  ? (sortOrder === 'asc' ? ' ▲' : ' ▼') 
                  : ''
                }
              </th>
            ))}
          </tr>
        </thead>

        {/* Table body */}
        <tbody>
          {paged.map((record, idx) => {
            const rowIndex = (page - 1) * pageSize + idx;
            const isSelected = allowRowSelection && selectedRow === rowIndex;
            
            return (
              <tr
                key={record.getId()}
                style={{
                  backgroundColor: isSelected && rowHighlight ? '#FFFDE7' : undefined,
                  cursor: allowRowSelection ? 'pointer' : 'default'
                }}
                onClick={() => allowRowSelection ? onRowSelect(rowIndex) : undefined}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLTableRowElement).style.backgroundColor = rowHoverColor;
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                    isSelected && rowHighlight ? '#FFFDE7' : '';
                }}
              >
                {showRowNumbers && (
                  <td style={{ padding: cellPadding }}>
                    {rowIndex + 1}
                  </td>
                )}
                {fields.map(field => (
                  <td
                    key={field}
                    style={{
                      padding: cellPadding,
                      borderBottom: showGridlines ? '1px solid #eee' : 'none'
                    }}
                  >
                    {record.getData()[field]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination controls */}
      {enablePagination && pageCount > 1 && (
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center' }}>
          <button
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            style={{ marginRight: 8 }}
          >
            Prev
          </button>
          <span>
            {formatMessage({ id: 'page', defaultMessage: 'Page' })} {page} / {pageCount}
          </span>
          <button
            disabled={page === pageCount || pageCount === 0}
            onClick={() => onPageChange(page + 1)}
            style={{ marginLeft: 8 }}
          >
            Next
          </button>
        </div>
      )}

      {/* Footer with record count */}
      {showFooter && (
        <div style={{ marginTop: 12, fontSize: 12 }}>
          {formatMessage({ id: 'totalRecords', defaultMessage: 'Total records' })}: {totalRecords}
        </div>
      )}
    </div>
  );
}