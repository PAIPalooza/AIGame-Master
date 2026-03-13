/**
 * ZeroDB Client for GameMaster Waitlist
 *
 * Provides API integration with ZeroDB for waitlist signup storage
 */

interface WaitlistSignup {
  email: string;
  role?: string;
  company?: string;
  interested_in_paid: boolean;
}

interface ZeroDBResponse {
  row_id: string;
  row_data: any;
  table_name: string;
  created_at: string;
}

class ZeroDBClient {
  private apiUrl: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_AINATIVE_API_URL || 'https://api.ainative.studio';
  }

  /**
   * Authenticate and get access token
   */
  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    // Login to get new token
    const response = await fetch(`${this.apiUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: process.env.NEXT_PUBLIC_AINATIVE_USERNAME,
        password: process.env.NEXT_PUBLIC_AINATIVE_PASSWORD,
      }),
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    // Token expires in 8 hours, refresh 5 minutes before
    this.tokenExpiry = Date.now() + (8 * 60 * 60 * 1000) - (5 * 60 * 1000);

    return this.accessToken;
  }

  /**
   * Submit waitlist signup to ZeroDB
   */
  async submitWaitlist(signup: WaitlistSignup): Promise<ZeroDBResponse> {
    const token = await this.getAccessToken();
    const projectId = process.env.NEXT_PUBLIC_ZERODB_PROJECT_ID;
    const tableName = process.env.NEXT_PUBLIC_ZERODB_TABLE_NAME || 'waitlist_signups';

    const response = await fetch(
      `${this.apiUrl}/api/v1/projects/${projectId}/database/tables/${tableName}/rows`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          row_data: {
            email: signup.email,
            role: signup.role || null,
            company: signup.company || null,
            interested_in_paid: signup.interested_in_paid,
            created_at: new Date().toISOString(),
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || 'Failed to submit waitlist signup');
    }

    return response.json();
  }

  /**
   * Check if email already exists in waitlist
   */
  async emailExists(email: string): Promise<boolean> {
    try {
      const token = await this.getAccessToken();
      const projectId = process.env.NEXT_PUBLIC_ZERODB_PROJECT_ID;
      const tableName = process.env.NEXT_PUBLIC_ZERODB_TABLE_NAME || 'waitlist_signups';

      const response = await fetch(
        `${this.apiUrl}/api/v1/projects/${projectId}/database/tables/${tableName}/rows`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return false;
      }

      const result = await response.json();
      // ZeroDB returns data in 'data' array, not 'rows'
      const entries = result.data || [];

      return entries.some((entry: any) => entry.row_data?.email === email);
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  }
}

// Export singleton instance
export const zeroDBClient = new ZeroDBClient();
