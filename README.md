# Platform Engagement Tracker

A web application for tracking content engagement metrics across multiple platforms including YouTube, ServiceNow, and LinkedIn.

## Features

- Track content performance across multiple platforms
- View engagement statistics with interactive charts
- Automatically fetch content information from platforms using APIs
- Store historical engagement data to track growth over time
- Dark mode support
- User authentication and data persistence using local storage

## Setup Instructions

### Running the Application

1. Clone this repository:
   ```
   git clone <repository-url>
   cd main_content_tracker
   ```

2. Serve the application using a local web server:
   ```
   # Using Node.js http-server
   npx http-server

   # Using Python
   python -m http.server 3000
   ```

3. Open your browser and navigate to `http://localhost:3000`

### Setting Up API Keys

To use the platform integration features, you'll need to configure API keys in the Settings menu:

#### YouTube API
1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project
3. Enable the YouTube Data API v3
4. Create API credentials and add the key to the application settings

#### ServiceNow API
1. Log in to your ServiceNow instance
2. Create a service account or use existing credentials
3. Add the credentials to the application settings

#### LinkedIn API
1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Create a new app
3. Set up OAuth 2.0 and request necessary permissions
4. Add the client ID and secret to the application settings

## Running Tests

This application includes comprehensive end-to-end tests using Cypress.

1. Install dependencies:
   ```
   npm install
   ```

2. Set up Cypress:
   ```
   npm install cypress --save-dev
   ```

3. Start the application server:
   ```
   npx http-server
   ```

4. In another terminal, run the tests:
   ```
   npx cypress open
   ```

5. In the Cypress UI, click "E2E Testing" and select your browser
6. Select the `e2e-test.js` file to run the tests

## Recommended Improvements

Based on code analysis, here are recommended improvements for future development:

### Architecture Improvements

1. **Modularize the codebase**: Split the single HTML file into separate HTML, CSS, and JavaScript files for better maintainability.

2. **Use a modern framework**: Consider migrating to React, Vue, or Angular for better component organization and state management.

3. **Implement a build system**: Use Webpack or Parcel to bundle and optimize assets.

4. **Create a backend service**: Move API key handling and platform integrations to a server to improve security.

### Security Improvements

1. **API key protection**: Move API calls to a backend service to protect credentials.

2. **Implement proper authentication**: Replace local storage-based authentication with a more secure solution using JWT or OAuth.

3. **Use HTTPS**: Ensure the application is served over HTTPS to protect data in transit.

4. **Input validation**: Add stronger input validation to prevent XSS and other injection attacks.

### Performance Improvements

1. **Optimize API calls**: Implement caching and rate limiting to reduce API usage.

2. **Lazy load components**: Load modals and non-essential content on demand.

3. **Optimize chart rendering**: Use more efficient data structures for large datasets.

4. **Implement pagination**: Add pagination for content and engagement lists to handle large data sets.

### UX Improvements

1. **Mobile responsiveness**: Enhance mobile layouts for better usability on small screens.

2. **Accessibility**: Add ARIA labels, keyboard navigation, and screen reader support.

3. **Interactive tutorials**: Add first-time user onboarding and feature tours.

4. **Offline support**: Implement progressive web app features for offline functionality.

### Testing Improvements

1. **Unit tests**: Add unit tests for core functions and utilities.

2. **Integration tests**: Test integration points with external APIs.

3. **Visual regression tests**: Ensure UI changes don't break existing layouts.

4. **Performance tests**: Test application performance with large datasets.

## License

[MIT License](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 