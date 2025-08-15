import { React, AllWidgetProps, DataSourceComponent, DataSource } from 'jimu-core'

/**
 * AdvancedTableWidget - A minimal baseline table widget for Experience Builder
 * 
 * This stripped-down implementation provides a clean foundation for incremental
 * feature additions. Current functionality:
 * - Renders data from configured data source using DataSourceComponent
 * - Displays all fields from first record as table columns
 * - Renders all records as table rows with basic styling
 * 
 * Ready for future enhancements:
 * - Sorting functionality
 * - Filtering/search capabilities
 * - Pagination controls
 * - Export functionality
 * - Custom column configuration
 * - Advanced styling options
 */
export default function AdvancedTableWidget(props: AllWidgetProps<any>) {
  // Get the first configured data source
  const useDataSource = props.useDataSources?.[0]

  return (
    <div style={{ padding: 16 }}>
      {/* Header */}
      <h2 style={{ marginBottom: 16 }}>
        {props.intl.formatMessage({ id: '_widgetLabel', defaultMessage: 'Advanced Table' })}
      </h2>

      {/* Data source integration */}
      {useDataSource ? (
        <DataSourceComponent useDataSource={useDataSource} widgetId={props.id}>
          {(ds: DataSource) => {
            // Get all records from the data source
            const dataRecords = ds?.getRecords() || []

            // Extract field names from the first record
            // TODO: Future enhancement - support custom column configuration
            const fields = dataRecords.length > 0 
              ? Object.keys(dataRecords[0].getData())
              : []

            return (
              <div>
                {/* Basic table with minimal styling */}
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  border: '1px solid #ddd'
                }}>
                  {/* Table header - displays field names as column headers */}
                  <thead style={{
                    backgroundColor: '#f5f5f5',
                    fontWeight: 'bold'
                  }}>
                    <tr>
                      {fields.map(field => (
                        <th key={field} style={{
                          padding: 8,
                          textAlign: 'left',
                          borderBottom: '1px solid #ddd'
                        }}>
                          {field}
                          {/* TODO: Add sorting indicators here */}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  
                  {/* Table body - displays all records */}
                  <tbody>
                    {dataRecords.map((record) => (
                      <tr key={record.getId()}>
                        {fields.map(field => (
                          <td key={field} style={{
                            padding: 8,
                            borderBottom: '1px solid #eee'
                          }}>
                            {record.getData()[field]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Basic record count - foundation for future pagination */}
                <div style={{ 
                  marginTop: 12, 
                  fontSize: 12, 
                  color: '#666' 
                }}>
                  Total records: {dataRecords.length}
                  {/* TODO: Add pagination controls here */}
                </div>
              </div>
            )
          }}
        </DataSourceComponent>
      ) : (
        <div style={{ 
          padding: 16, 
          backgroundColor: '#f0f0f0', 
          border: '1px dashed #ccc',
          textAlign: 'center'
        }}>
          Please configure a data source in the widget settings.
        </div>
      )}
    </div>
  )
}