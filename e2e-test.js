// End-to-end tests for Platform Engagement Tracker
// Using Cypress framework - https://www.cypress.io/

describe('Platform Engagement Tracker', () => {
  beforeEach(() => {
    // Visit the application and setup mocks
    cy.visit('index.html')
    
    // Mock localStorage to simulate logged in state for testing
    cy.window().then((win) => {
      // Create mock user
      const mockUser = {
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
        createdAt: new Date().toISOString()
      }
      
      // Mock users array with our test user
      win.localStorage.setItem('users', JSON.stringify([mockUser]))
      
      // Set logged in user
      win.localStorage.setItem('loggedInUser', mockUser.id)
      
      // Add some sample content items for testing
      const mockContentItems = [
        {
          id: 'content-1',
          name: 'Test YouTube Video',
          description: 'A test video',
          platform: 'youtube',
          url: 'https://youtube.com/watch?v=test123',
          contentId: 'test123',
          publishedDate: '2023-01-01',
          duration: '10:30',
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'content-2',
          name: 'Test ServiceNow Blog',
          description: 'A test blog post',
          platform: 'servicenow',
          url: 'https://community.servicenow.com/blog/test456',
          contentId: 'test456',
          publishedDate: '2023-02-15',
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        }
      ]
      
      win.localStorage.setItem(`user_${mockUser.id}_contentItems`, JSON.stringify(mockContentItems))
      
      // Add mock engagement data
      const mockEngagementData = [
        {
          contentUrl: 'https://youtube.com/watch?v=test123',
          timestamp: new Date().toISOString(),
          views: 1000,
          likes: 100,
          comments: 25,
          shares: 10,
          otherMetrics: {}
        },
        {
          contentUrl: 'https://community.servicenow.com/blog/test456',
          timestamp: new Date().toISOString(),
          views: 500,
          likes: 30,
          comments: 15,
          shares: 5,
          otherMetrics: {}
        }
      ]
      
      win.localStorage.setItem(`user_${mockUser.id}_engagementData`, JSON.stringify(mockEngagementData))
    })
    
    // Reload the page to apply our mocked data
    cy.reload()
  })

  // Test authentication flows
  describe('Authentication', () => {
    it('should show main content when user is logged in', () => {
      // Check that the main content is displayed
      cy.get('#main-content').should('be.visible')
      cy.get('#auth-content').should('not.be.visible')
    })
    
    it('should log out when logout button is clicked', () => {
      // Click the user menu to show dropdown
      cy.get('#user-menu-button').click()
      
      // Click logout
      cy.get('#logout-button').click()
      
      // Verify we're logged out
      cy.get('#auth-content').should('be.visible')
      cy.get('#main-content').should('not.be.visible')
    })
    
    it('should log in with correct credentials', () => {
      // First log out
      cy.get('#user-menu-button').click()
      cy.get('#logout-button').click()
      
      // Fill in login form
      cy.get('#login-email').type('demo@example.com')
      cy.get('#login-password').type('password')
      
      // Submit the form
      cy.get('#login-form').submit()
      
      // Verify login was successful
      cy.get('#main-content').should('be.visible')
      cy.get('#current-user-name').should('contain', 'Demo User')
    })
  })
  
  // Test content management
  describe('Content Management', () => {
    it('should display existing content items', () => {
      // We should see our two mock content items
      cy.get('#content-list tr').should('have.length', 2)
      
      // Check first content
      cy.get('#content-list tr').first().should('contain', 'Test YouTube Video')
    })
    
    it('should add a new content item', () => {
      // Click to expand add content form if collapsed
      cy.get('#toggle-add-content').click()
      
      // Fill in content form
      cy.get('#content-url').type('https://youtube.com/watch?v=newvideo')
      cy.get('#content-source').select('youtube')
      cy.get('#content-name').type('New Test Video')
      cy.get('#content-description').type('Testing add functionality')
      cy.get('#content-published').type('2023-03-15')
      
      // Submit form
      cy.get('#content-form').submit()
      
      // Verify new content is added
      cy.get('#content-list tr').should('have.length', 3)
      cy.get('#content-list').should('contain', 'New Test Video')
    })
    
    it('should delete a content item', () => {
      // Find the delete button for the first content item
      cy.get('#content-list tr').first().find('.delete-content-btn').click()
      
      // Confirm the deletion in alert
      cy.on('window:confirm', () => true)
      
      // Verify content is deleted
      cy.get('#content-list tr').should('have.length', 1)
      cy.get('#content-list').should('not.contain', 'Test YouTube Video')
    })
  })
  
  // Test statistics and charts
  describe('Statistics and Charts', () => {
    it('should display correct statistics', () => {
      // Check total content count
      cy.get('#total-content').should('contain', '2')
      
      // Check total engagements (views)
      cy.get('#total-engagements').should('contain', '1,500')
    })
    
    it('should have working charts', () => {
      // Platform chart should exist
      cy.get('#platform-chart').should('exist')
      
      // Content chart should exist
      cy.get('#content-chart').should('exist')
    })
    
    it('should refresh data when refresh button is clicked', () => {
      // Mock API responses before clicking refresh
      cy.intercept('GET', 'https://www.googleapis.com/youtube/v3/videos*', {
        items: [{
          statistics: {
            viewCount: '2000',
            likeCount: '200',
            commentCount: '50'
          }
        }]
      })
      
      // Click refresh
      cy.get('#refresh-data').click()
      
      // Check that engagement data was updated
      cy.get('#engagement-list').should('contain', '2,000')
    })
  })
  
  // Test settings
  describe('Settings', () => {
    it('should open settings when settings link is clicked', () => {
      // Click user menu
      cy.get('#user-menu-button').click()
      
      // Click settings
      cy.get('#show-settings-link').click()
      
      // Verify settings modal is open
      cy.get('#api-settings').should('be.visible')
    })
    
    it('should save API settings', () => {
      // Open settings
      cy.get('#user-menu-button').click()
      cy.get('#show-settings-link').click()
      
      // Fill in YouTube API key
      cy.get('#youtube-api-key').type('test-api-key')
      
      // Save settings
      cy.get('#save-api-config').click()
      
      // Verify settings are saved by checking for API status change
      cy.get('#youtube-api-status').should('not.have.class', 'bg-red-100')
    })
  })
  
  // Test user profile
  describe('User Profile', () => {
    it('should open profile when profile link is clicked', () => {
      // Click user menu
      cy.get('#user-menu-button').click()
      
      // Click profile
      cy.get('#user-profile-link').click()
      
      // Verify profile modal is open
      cy.get('#profile-modal').should('be.visible')
      
      // Check that user info is displayed
      cy.get('#profile-name').should('contain', 'Test User')
      cy.get('#profile-email').should('contain', 'test@example.com')
    })
    
    it('should update user profile', () => {
      // Open profile
      cy.get('#user-menu-button').click()
      cy.get('#user-profile-link').click()
      
      // Change display name
      cy.get('#profile-display-name').clear().type('Updated User Name')
      
      // Save profile
      cy.get('#save-profile').click()
      
      // Verify profile is updated
      cy.get('#profile-message').should('be.visible')
      cy.get('#current-user-name').should('contain', 'Updated User Name')
    })
  })
  
  // Test dark mode
  describe('Dark Mode', () => {
    it('should toggle dark mode', () => {
      // Open settings
      cy.get('#user-menu-button').click()
      cy.get('#show-settings-link').click()
      
      // Toggle dark mode
      cy.get('#dark-mode-toggle').click()
      
      // Verify dark mode is enabled
      cy.get('html').should('have.class', 'dark')
      
      // Toggle back to light mode
      cy.get('#dark-mode-toggle').click()
      
      // Verify dark mode is disabled
      cy.get('html').should('not.have.class', 'dark')
    })
  })
}) 