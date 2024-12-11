const axios = require('axios'); // You can use Axios or Fetch API for HTTP requests.

// Replace these placeholders with your actual values
const tenantId = '<Your Tenant ID>';
const clientId = '<Your Client ID>';
const clientSecret = '<Your Client Secret>';
const workspaceId = '<Your Log Analytics Workspace ID>';
const query = 'InsightsMetrics | summarize Count = count() by bin(TimeGenerated, 1h)'; // Your KQL query

// Get OAuth token from Azure AD
async function getToken() {
    const response = await axios.post(
        `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
        new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret,
            scope: 'https://api.loganalytics.io/.default',
        })
    );
    return response.data.access_token;
}

// Query Log Analytics API
async function queryLogAnalytics(token) {
    const response = await axios.post(
        `https://api.loganalytics.io/v1/workspaces/${workspaceId}/query`,
        { query },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
    );
    return response.data;
}

// Main Function
(async () => {
    try {
        const token = await getToken();
        const data = await queryLogAnalytics(token);
        console.log('Query Results:', data);
        // Use this data to display on your SharePoint page.
    } catch (error) {
        console.error('Error querying Log Analytics:', error);
    }
})();
