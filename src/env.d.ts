/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
	readonly RESEND_API_KEY: string;
	readonly CONTACT_FROM_EMAIL: string;
	readonly CONTACT_TO_EMAIL: string;
	readonly PROJECT_ACCESS_SECRET?: string;
	readonly PROJECT_ACCESS_PASSWORD?: string;
	readonly PROJECT_ACCESS_PASSWORDS?: string;
	readonly PROJECT_ACCESS_NOTIFY_TO_EMAIL?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
