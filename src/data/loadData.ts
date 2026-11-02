import { WebsiteData, WebsiteDataSchema } from './schema';

export interface LoadDataResult {
  data: WebsiteData | null;
  error: string | null;
  isLoading: boolean;
}

export async function fetchWebsiteData(url = '/data/website_data.json'): Promise<WebsiteData> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load dataset: ${response.status} ${response.statusText} from ${url}`);
  }
  const json = await response.json();
  const parsed = WebsiteDataSchema.safeParse(json);
  if (!parsed.success) {
    const errorDetails = parsed.error.issues
      .map((issue) => `[${issue.path.join('.')}]: ${issue.message}`)
      .join('\n');
    throw new Error(`website_data.json validation failed:\n${errorDetails}`);
  }
  return parsed.data;
}
