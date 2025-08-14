# Advanced Table Widget

A full-featured table widget for ArcGIS Experience Builder that provides comprehensive data visualization and interaction capabilities.

## Features

- **Sorting by column** - Click column headers to sort data ascending/descending
- **Filtering/search** - Real-time search across all visible columns
- **Pagination** - Configurable page size with navigation controls
- **Custom page size** - Set default records per page
- **Multi-language support** - English and Spanish translations included
- **Configurable styling** - Customize colors, fonts, spacing, and visual elements
- **Export functionality** - Export filtered/sorted data to CSV
- **Row selection** - Optional row selection with highlighting
- **Responsive design** - Adapts to different screen sizes
- **Sticky headers** - Keep column headers visible while scrolling

## Installation

1. Copy the `advanced-table` folder to your ArcGIS Experience Builder `client/your-extensions/widgets/` directory
2. Restart your Experience Builder development server
3. The Advanced Table widget will appear in the widget panel

## Usage

### Basic Setup
1. Add the Advanced Table widget to your Experience Builder app
2. Open the widget settings panel
3. Select a data source from the dropdown
4. Configure display options as needed
5. Save and preview your app

### Configuration Options

The widget provides extensive configuration through the settings panel:

#### Data Settings
- **Data Source**: Connect to feature layers, web maps, or other data sources
- **Default Page Size**: Number of records to display per page (default: 10)

#### Display Features
- **Enable Sorting**: Allow users to sort by clicking column headers
- **Enable Filtering/Search**: Show search box for real-time filtering
- **Show Footer**: Display total record count at bottom
- **Show Row Numbers**: Add sequential row numbers
- **Enable Pagination**: Split data across multiple pages
- **Show Gridlines**: Display borders between cells

#### Column Management
- **Show Columns**: Toggle visibility for each data field
- **Column Labels**: Customize display names for columns
- **Column Order**: Rearrange column display sequence

#### Visual Styling
- **Table Color**: Background color for table body
- **Header Color**: Background color for table headers
- **Header Bold**: Make header text bold
- **Row Hover Color**: Highlight color when hovering over rows
- **Font Size**: Text size (10-32px)
- **Cell Padding**: Space inside cells (2-32px)
- **Table Width**: Table width (percentage or pixels)
- **Header Sticky**: Keep headers visible while scrolling

#### Interactive Features
- **Allow Export to CSV**: Show export button for data download
- **Allow Row Selection**: Enable clicking rows to select them
- **Row Highlight on Selection**: Highlight selected rows

## Development

### Project Structure
```
advanced-table/
├── manifest.json          # Widget metadata and configuration
├── config.json           # Default configuration values
├── icon.svg              # Widget icon
├── doc/                  # Documentation
├── src/
│   ├── runtime/
│   │   ├── widget.tsx    # Main widget component
│   │   ├── assets/       # Images and resources
│   │   └── translations/ # Internationalization files
│   ├── setting/
│   │   ├── setting.tsx   # Configuration panel component
│   │   └── translations/ # Settings panel translations
│   └── types/            # TypeScript type definitions
```

### Building and Testing
This widget is designed for ArcGIS Experience Builder and doesn't require a separate build process. Changes are reflected when the Experience Builder development server restarts.

### Supported Data Sources
- ArcGIS Feature Layers
- Map Services
- Web Maps
- Survey123 data
- Any data source compatible with ArcGIS Experience Builder

## Contributing

We welcome contributions to improve the Advanced Table Widget! Here's how to get started:

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes following the coding standards below
4. Test your changes thoroughly
5. Submit a pull request with a clear description

### Coding Standards
- Use TypeScript for type safety
- Follow React functional component patterns
- Use descriptive variable and function names
- Add JSDoc comments for public functions
- Maintain consistent code formatting
- Test with multiple data sources and configurations

### Reporting Issues
Please report bugs and feature requests through GitHub Issues. Include:
- Steps to reproduce the issue
- Expected vs actual behavior
- ArcGIS Experience Builder version
- Browser and operating system details
- Sample data or configuration if relevant

### Development Guidelines
- Maintain backward compatibility with existing configurations
- Follow ArcGIS Experience Builder widget development patterns
- Ensure accessibility (ARIA labels, keyboard navigation)
- Support both English and Spanish languages
- Test with various screen sizes and devices

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Check the [GitHub Issues](https://github.com/nwharney-cyber/advanced-table-widget/issues) for existing solutions
- Review the [ArcGIS Experience Builder documentation](https://developers.arcgis.com/experience-builder/)
- Contact the development team through GitHub

## Changelog

### Version 2.0.0
- Enhanced configuration options
- Improved TypeScript support
- Better error handling
- Refactored component structure
- Updated documentation