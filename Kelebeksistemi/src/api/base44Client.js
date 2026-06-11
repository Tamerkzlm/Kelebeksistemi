import { createClient } from '@base44/sdk';

export const base44 = createClient({
  appId: import.meta.env.VITE_BASE44_APP_ID,
  headers: {
    "api_key": import.meta.env.VITE_BASE44_API_KEY
  }
});