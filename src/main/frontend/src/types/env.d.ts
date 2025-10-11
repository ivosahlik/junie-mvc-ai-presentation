/// <reference types="vite/client" />

/**
 * Type definitions for environment variables
 */
interface ImportMetaEnv {
  readonly VITE_APP_ENV: 'development' | 'test' | 'production';
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_ENABLE_MOCK_API: string;
  readonly VITE_ENABLE_DEBUG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
