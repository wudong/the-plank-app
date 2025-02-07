/// <reference types="vite/client" />

declare global {
  interface Window {
    handleSignInWithGoogle: (response: any) => Promise<void>;
  }
}

export {};

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
