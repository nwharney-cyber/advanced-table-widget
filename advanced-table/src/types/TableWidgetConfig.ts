/**
 * Configuration interface for the Advanced Table Widget
 */
export interface TableWidgetConfig {
  /** Default number of records to display per page */
  defaultPageSize?: number;
  
  /** Enable sorting functionality on column headers */
  enableSorting?: boolean;
  
  /** Enable filtering/search functionality */
  enableFiltering?: boolean;
  
  /** Show footer with total record count */
  showFooter?: boolean;
  
  /** Object mapping column names to their visibility status */
  showColumns?: { [columnName: string]: boolean };
  
  /** Array defining the order of columns */
  columnOrder?: string[];
  
  /** Object mapping column names to their display labels */
  columnLabels?: { [columnName: string]: string };
  
  /** Background color for the table body */
  tableColor?: string;
  
  /** Background color for table headers */
  headerColor?: string;
  
  /** Whether header text should be bold */
  headerBold?: boolean;
  
  /** Color used when hovering over table rows */
  rowHoverColor?: string;
  
  /** Show sequential row numbers */
  showRowNumbers?: boolean;
  
  /** Enable pagination controls */
  enablePagination?: boolean;
  
  /** Allow export to CSV functionality */
  allowExport?: boolean;
  
  /** Allow users to select table rows */
  allowRowSelection?: boolean;
  
  /** Show gridlines between cells */
  showGridlines?: boolean;
  
  /** Font size for table text in pixels */
  fontSize?: number;
  
  /** Padding inside table cells in pixels */
  cellPadding?: number;
  
  /** Table width (CSS value like "100%" or "800px") */
  tableWidth?: string;
  
  /** Keep headers visible while scrolling */
  headerSticky?: boolean;
  
  /** Highlight selected rows */
  rowHighlight?: boolean;
}

/**
 * Default configuration values for the Advanced Table Widget
 */
export const DEFAULT_CONFIG: Required<TableWidgetConfig> = {
  defaultPageSize: 10,
  enableSorting: true,
  enableFiltering: true,
  showFooter: true,
  showColumns: {},
  columnOrder: [],
  columnLabels: {},
  tableColor: "#FFFFFF",
  headerColor: "#2196F3",
  headerBold: true,
  rowHoverColor: "#E3F2FD",
  showRowNumbers: false,
  enablePagination: true,
  allowExport: true,
  allowRowSelection: false,
  showGridlines: true,
  fontSize: 14,
  cellPadding: 8,
  tableWidth: "100%",
  headerSticky: false,
  rowHighlight: false
};