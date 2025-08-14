import { React, AllWidgetProps, DataSourceComponent, DataSource, DataRecord } from 'jimu-core'
import defaultIcon from './assets/table.png'

export default function Widget(props: AllWidgetProps<any>) {
  // Defensive conversion for useDataSources
  const useDataSourcesRaw = props.useDataSources
  const useDataSource = typeof useDataSourcesRaw?.asMutable === 'function'
    ? useDataSourcesRaw.asMutable()[0]
    : Array.isArray(useDataSourcesRaw)
      ? useDataSourcesRaw[0]
      : undefined

  const [search, setSearch] = React.useState('')
  const [sortField, setSortField] = React.useState<string|null>(null)
  const [sortOrder, setSortOrder] = React.useState<'asc'|'desc'>('asc')
  const [page, setPage] = React.useState(1)
  const [selectedRow, setSelectedRow] = React.useState<number|null>(null)
  const pageSize = props.config?.defaultPageSize || 10

  // Config options
  const {
    enableSorting = true,
    enableFiltering = true,
    showFooter = true,
    showColumns = {},
    columnOrder = [],
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
    rowHighlight = false
  } = props.config || {}

  function handleSort(field: string) {
    if (!enableSorting) return
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  function exportCSV(records: DataRecord[], fields: string[]) {
    let csv = ''
    if (showRowNumbers) csv += 'Row,'
    csv += (fields || []).map(col => columnLabels[col] || col).join(',') + '\n'
    records.forEach((r, idx) => {
      if (showRowNumbers) csv += `${idx + 1},`
      csv += (fields || []).map(col => `"${r.getData()[col]}"`).join(',') + '\n'
    })
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'table.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={defaultIcon} alt="Table" style={{ width: 32, height: 32, marginRight: 8 }} />
        <h2>{props.intl.formatMessage({ id: '_widgetLabel', defaultMessage: 'Advanced Table' })}</h2>
      </div>
      {useDataSource ? (
        <DataSourceComponent useDataSource={useDataSource} widgetId={props.id}>
          {(ds: DataSource) => {
            const dataRecordsRaw = ds?.getRecords() || []
            // Defensive conversion for dataRecords
            const dataRecords = typeof dataRecordsRaw?.asMutable === 'function'
              ? dataRecordsRaw.asMutable()
              : Array.isArray(dataRecordsRaw)
                ? dataRecordsRaw
                : []

            // Get fields from config, fallback to all fields in first record
            let fields = (columnOrder || []).filter(col => showColumns[col] !== false)
            if (!(fields || []).length && dataRecords.length > 0)
              fields = Object.keys(dataRecords[0].getData())

            // Filtering
            let filtered = enableFiltering && search
              ? dataRecords.filter(
                  r => (fields || []).some(
                    col =>
                      (r.getData()[col] ?? '')
                        .toString()
                        .toLowerCase()
                        .includes(search.toLowerCase())
                  )
                )
              : dataRecords

            // Sorting
            let sorted = filtered
            if (enableSorting && sortField) {
              sorted = [...filtered].sort((a, b) => {
                const av = a.getData()[sortField]
                const bv = b.getData()[sortField]
                if (typeof av === 'string' && typeof bv === 'string')
                  return sortOrder === 'asc'
                    ? av.localeCompare(bv)
                    : bv.localeCompare(av)
                return sortOrder === 'asc'
                  ? (av ?? 0) - (bv ?? 0)
                  : (bv ?? 0) - (av ?? 0)
              })
            }

            // Pagination
            const totalRecords = sorted.length
            const pageCount = enablePagination ? Math.ceil(totalRecords / pageSize) : 1
            const paged = enablePagination
              ? sorted.slice((page - 1) * pageSize, page * pageSize)
              : sorted

            return (
              <div>
                {enableFiltering && (
                  <div style={{ margin: '8px 0' }}>
                    <input
                      type="text"
                      placeholder={props.intl.formatMessage({ id: 'search', defaultMessage: 'Search' })}
                      value={search}
                      onChange={e => { setSearch(e.target.value); setPage(1); }}
                      style={{ padding: '4px 8px', width: 200 }}
                    />
                  </div>
                )}
                <div style={{ marginBottom: 8 }}>
                  {allowExport && <button onClick={() => exportCSV(sorted, fields)}>Export to CSV</button>}
                </div>
                <table style={{
                  width: tableWidth,
                  borderCollapse: 'collapse',
                  marginTop: 8,
                  backgroundColor: tableColor,
                  fontSize,
                  border: showGridlines ? '1px solid #ddd' : 'none'
                }}>
                  <thead style={{
                    backgroundColor: headerColor,
                    fontWeight: headerBold ? 'bold' : 'normal',
                    position: headerSticky ? 'sticky' : 'static',
                    top: headerSticky ? 0 : undefined,
                    zIndex: headerSticky ? 1 : undefined
                  }}>
                    <tr>
                      {showRowNumbers && <th style={{ padding: cellPadding }}>#</th>}
                      {(fields || []).map(field => (
                        <th key={field}
                            onClick={() => handleSort(field)}
                            style={{
                              borderBottom: showGridlines ? '1px solid #ccc' : 'none',
                              textAlign: 'left',
                              padding: cellPadding,
                              cursor: enableSorting ? 'pointer' : 'default'
                            }}>
                          {columnLabels[field] || field}
                          {enableSorting && sortField === field ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ''}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((r, idx) => {
                      const rowIndex = (page - 1) * pageSize + idx
                      const isSelected = allowRowSelection && selectedRow === rowIndex
                      return (
                        <tr
                          key={r.getId()}
                          style={{
                            backgroundColor: isSelected && rowHighlight ? '#FFFDE7'
                              : undefined,
                            cursor: allowRowSelection ? 'pointer' : 'default'
                          }}
                          onClick={() => allowRowSelection ? setSelectedRow(rowIndex) : undefined}
                          onMouseOver={e => {
                            (e.currentTarget as HTMLTableRowElement).style.backgroundColor = rowHoverColor
                          }}
                          onMouseOut={e => {
                            (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                              isSelected && rowHighlight ? '#FFFDE7' : ''
                          }}
                        >
                          {showRowNumbers && <td style={{ padding: cellPadding }}>{rowIndex + 1}</td>}
                          {(fields || []).map(field => (
                            <td key={field} style={{
                              padding: cellPadding,
                              borderBottom: showGridlines ? '1px solid #eee' : 'none'
                            }}>{r.getData()[field]}</td>
                          ))}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {/* Pagination Controls */}
                {enablePagination && (
                  <div style={{ marginTop: 12, display: 'flex', alignItems: 'center' }}>
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      style={{ marginRight: 8 }}
                    >Prev</button>
                    <span>
                      {props.intl.formatMessage({ id: 'page', defaultMessage: 'Page' })} {page} / {pageCount}
                    </span>
                    <button
                      disabled={page === pageCount || pageCount === 0}
                      onClick={() => setPage(page + 1)}
                      style={{ marginLeft: 8 }}
                    >Next</button>
                  </div>
                )}
                {showFooter && (
                  <div style={{ marginTop: 12, fontSize: 12 }}>
                    {props.intl.formatMessage({ id: 'totalRecords', defaultMessage: 'Total records' )}: {totalRecords}
                  </div>
                )}
              </div>
            )
          }}
        </DataSourceComponent>
      ) : (
        <div>Please select a data source in the widget settings.</div>
      )}
    </div>
  )
}