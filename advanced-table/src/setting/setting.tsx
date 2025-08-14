import { React } from 'jimu-core'
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector'

export default function Setting(props) {
  const { config, useDataSources, onSettingChange, id } = props

  // Defensive conversion for useDataSources
  const useDataSourcesSafe = typeof useDataSources?.asMutable === 'function'
    ? useDataSources.asMutable()
    : Array.isArray(useDataSources)
      ? useDataSources
      : []

  // Defensive conversion for dataSources
  const dataSourcesSafe = typeof props.dataSources?.asMutable === 'function'
    ? props.dataSources.asMutable()
    : props.dataSources || {}

  const handleDSChange = (incomingUseDataSources) => {
    const safeUseDataSources = typeof incomingUseDataSources?.asMutable === 'function'
      ? incomingUseDataSources.asMutable()
      : Array.isArray(incomingUseDataSources)
        ? incomingUseDataSources
        : []

    onSettingChange({ useDataSources: safeUseDataSources })
    onSettingChange({ config: { ...config, showColumns: {}, columnOrder: [], columnLabels: {} } })
  }

  const fields = React.useMemo(() => {
    if (!useDataSourcesSafe?.[0]?.dataSourceId || !dataSourcesSafe) return []
    const ds = dataSourcesSafe[useDataSourcesSafe[0].dataSourceId]
    return ds?.getSchema()?.fields?.map(f => f.jimuName) || []
  }, [useDataSourcesSafe, dataSourcesSafe])

  React.useEffect(() => {
    if (fields.length && (!config.columnOrder || config.columnOrder.length === 0)) {
      onSettingChange({ config: { ...config, columnOrder: fields } })
      let showCols = {}
      let colLabels = {}
      fields.forEach(f => {
        showCols[f] = true
        colLabels[f] = f
      })
      onSettingChange({ config: { ...config, showColumns: showCols } })
      onSettingChange({ config: { ...config, columnLabels: colLabels } })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields])

  const handleChange = (key, value) => {
    onSettingChange({ config: { ...config, [key]: value } })
  }

  const handleNestedChange = (parent, key, value) => {
    onSettingChange({
      config: {
        ...config,
        [parent]: { ...(config[parent] || {}), [key]: value }
      }
    })
  }

  const handleOrderChange = (idx, value) => {
    const order = [...(config.columnOrder || [])]
    order[idx] = value
    onSettingChange({ config: { ...config, columnOrder: order } })
  }

  return (
    <div style={{ padding: 16 }}>
      <h3>Table Settings</h3>
      <div style={{ marginBottom: 16 }}>
        <strong>Choose data source:</strong>
        <DataSourceSelector
          useDataSources={useDataSourcesSafe}
          onChange={handleDSChange}
          mustUseDataSource
          widgetId={id}
        />
      </div>
      {/* Main Table Settings */}
      <div>
        <label>Default Page Size:
          <input type="number" min={1} value={config.defaultPageSize || 10}
            onChange={e => handleChange('defaultPageSize', Number(e.target.value))}
            style={{ marginLeft: 8, width: 60 }} />
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={config.enableSorting}
            onChange={e => handleChange('enableSorting', e.target.checked)}
            style={{ marginRight: 4 }} />
          Enable Sorting
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={config.enableFiltering}
            onChange={e => handleChange('enableFiltering', e.target.checked)}
            style={{ marginRight: 4 }} />
          Enable Filtering/Search
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={config.showFooter}
            onChange={e => handleChange('showFooter', e.target.checked)}
            style={{ marginRight: 4 }} />
          Show Footer
        </label>
      </div>
      <hr/>
      {(fields || []).length > 0 && (
        <div>
          <strong>Show Columns:</strong>
          {(fields || []).map(col => (
            <div key={col}>
              <label>
                <input type="checkbox"
                  checked={(config.showColumns || {})[col] !== false}
                  onChange={e => handleNestedChange('showColumns', col, e.target.checked)}
                  style={{ marginRight: 4 }} />
                {col}
              </label>
            </div>
          ))}
          <div>
            <strong>Column Labels:</strong>
            {(fields || []).map(col => (
              <div key={col}>
                <label>
                  {col} Label:
                  <input type="text" value={(config.columnLabels || {})[col] || col}
                    onChange={e => handleNestedChange('columnLabels', col, e.target.value)}
                    style={{ marginLeft: 8, width: 120 }} />
                </label>
              </div>
            ))}
          </div>
          <div>
            <strong>Column Order:</strong>
            {(config.columnOrder || []).map((col, idx) => (
              <div key={idx}>
                <select value={col}
                  onChange={e => handleOrderChange(idx, e.target.value)}>
                  {(fields || []).map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}
      <hr/>
      <div>
        <label>Table Color:
          <input type="color" value={config.tableColor || "#FFFFFF"}
            onChange={e => handleChange('tableColor', e.target.value)}
            style={{ marginLeft: 8 }} />
        </label>
      </div>
      <div>
        <label>Header Color:
          <input type="color" value={config.headerColor || "#2196F3"}
            onChange={e => handleChange('headerColor', e.target.value)}
            style={{ marginLeft: 8 }} />
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={config.headerBold}
            onChange={e => handleChange('headerBold', e.target.checked)}
            style={{ marginRight: 4 }} />
          Header Bold
        </label>
      </div>
      <div>
        <label>Row Hover Color:
          <input type="color" value={config.rowHoverColor || "#E3F2FD"}
            onChange={e => handleChange('rowHoverColor', e.target.value)}
            style={{ marginLeft: 8 }} />
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={config.showRowNumbers}
            onChange={e => handleChange('showRowNumbers', e.target.checked)}
            style={{ marginRight: 4 }} />
          Show Row Numbers
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={config.enablePagination}
            onChange={e => handleChange('enablePagination', e.target.checked)}
            style={{ marginRight: 4 }} />
          Enable Pagination
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={config.allowExport}
            onChange={e => handleChange('allowExport', e.target.checked)}
            style={{ marginRight: 4 }} />
          Allow Export to CSV
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={config.allowRowSelection}
            onChange={e => handleChange('allowRowSelection', e.target.checked)}
            style={{ marginRight: 4 }} />
          Allow Row Selection
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={config.showGridlines}
            onChange={e => handleChange('showGridlines', e.target.checked)}
            style={{ marginRight: 4 }} />
          Show Gridlines
        </label>
      </div>
      <div>
        <label>Font Size:
          <input type="number" min={10} max={32} value={config.fontSize || 14}
            onChange={e => handleChange('fontSize', Number(e.target.value))}
            style={{ marginLeft: 8, width: 60 }} />
        </label>
      </div>
      <div>
        <label>Cell Padding:
          <input type="number" min={2} max={32} value={config.cellPadding || 8}
            onChange={e => handleChange('cellPadding', Number(e.target.value))}
            style={{ marginLeft: 8, width: 60 }} />
        </label>
      </div>
      <div>
        <label>Table Width:
          <input type="text" value={config.tableWidth || "100%"}
            onChange={e => handleChange('tableWidth', e.target.value)}
            style={{ marginLeft: 8, width: 80 }} />
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={config.headerSticky}
            onChange={e => handleChange('headerSticky', e.target.checked)}
            style={{ marginRight: 4 }} />
          Header Sticky
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={config.rowHighlight}
            onChange={e => handleChange('rowHighlight', e.target.checked)}
            style={{ marginRight: 4 }} />
          Row Highlight on Selection
        </label>
      </div>
    </div>
  )
}