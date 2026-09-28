/// <reference types="vite/client" />

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_APPWRITE_ENDPOINT?: string;
  readonly VITE_APPWRITE_PROJECT?: string;
  readonly VITE_APPWRITE_DB_ID?: string;
  readonly VITE_APP_MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
