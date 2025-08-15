import { React, DataSourceComponent, DataSource } from 'jimu-core'

/**
 * AdvancedTableWidget
 * Baseline widget implementation: clones standard Table widget data rendering.
 * - Connects to Experience Builder data source
 * - Displays all fields from the first record as columns
 * - Renders records as rows
 * - No custom sorting/filtering/pagination
 */

export default function AdvancedTableWidget(props) {
  const { useDataSource } = props

  return (
    <div style={{ padding: 16 }}>
      <h2>Advanced Table (Standard Clone)</h2>
      {useDataSource ? (
        <DataSourceComponent useDataSource={useDataSource} widgetId={props.id}>
          {(ds: DataSource) => {
            const records = ds?.getRecords() || []
            const allFields = records.length > 0 ? Object.keys(records[0].getData()) : []

            return (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {allFields.map(field => (
                      <th key={field} style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>
                        {field}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.map((r, i) => (
                    <tr key={r.getId?.() || i}>
                      {allFields.map(field => (
                        <td key={field} style={{ border: '1px solid #eee', padding: '8px' }}>
                          {r.getData()[field]?.toString() ?? ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          }}
        </DataSourceComponent>
      ) : (
        <div>No data source configured.</div>
      )}
    </div>
  )
}