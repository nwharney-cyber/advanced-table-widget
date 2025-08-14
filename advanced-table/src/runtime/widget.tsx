import { React, AllWidgetProps, DataSourceComponent, DataSource, DataRecord } from 'jimu-core'
import defaultIcon from './assets/table.png'
import { TableWidgetConfig, DEFAULT_CONFIG } from '../types/TableWidgetConfig'
import { TableComponent } from './TableComponent'

export default function Widget(props: AllWidgetProps<TableWidgetConfig>) {
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

  // Merge config with defaults
  const config: TableWidgetConfig = { ...DEFAULT_CONFIG, ...props.config }

  function handleSort(field: string) {
    if (!config.enableSorting) return
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  function handleRowSelect(rowIndex: number) {
    if (config.allowRowSelection) {
      setSelectedRow(selectedRow === rowIndex ? null : rowIndex)
    }
  }

  function handlePageChange(newPage: number) {
    setPage(newPage)
  }

  function exportCSV(records: DataRecord[], fields: string[]) {
    let csv = ''
    if (config.showRowNumbers) csv += 'Row,'
    csv += (fields || []).map(col => config.columnLabels?.[col] || col).join(',') + '\n'
    records.forEach((r, idx) => {
      if (config.showRowNumbers) csv += `${idx + 1},`
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
            let fields = (config.columnOrder || []).filter(col => config.showColumns?.[col] !== false)
            if (!(fields || []).length && dataRecords.length > 0)
              fields = Object.keys(dataRecords[0].getData())

            return (
              <div>
                {config.enableFiltering && (
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
                <TableComponent
                  config={config}
                  dataRecords={dataRecords}
                  fields={fields}
                  search={search}
                  sortField={sortField}
                  sortOrder={sortOrder}
                  page={page}
                  selectedRow={selectedRow}
                  onSort={handleSort}
                  onRowSelect={handleRowSelect}
                  onExport={exportCSV}
                  onPageChange={handlePageChange}
                  formatMessage={props.intl.formatMessage}
                />
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