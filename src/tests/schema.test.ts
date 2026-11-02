import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { WebsiteDataSchema } from '../data/schema';

const jsonPath = path.resolve(__dirname, '../../public/data/website_data.json');
const validData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

describe('schema.ts Zod validation', () => {
  it('successfully validates the valid website_data.json payload', () => {
    const result = WebsiteDataSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('fails validation when a required top-level key is missing', () => {
    const corruptData = { ...validData };
    delete (corruptData as any).recommendation;

    const result = WebsiteDataSchema.safeParse(corruptData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes('recommendation'))).toBe(true);
    }
  });

  it('fails validation when meta fields are missing or wrong type', () => {
    const corruptData = {
      ...validData,
      meta: {
        ...validData.meta,
        synthetic_inputs: 'not-a-boolean',
      },
    };

    const result = WebsiteDataSchema.safeParse(corruptData);
    expect(result.success).toBe(false);
  });

  it('fails validation when components.S_activity has invalid dimensions', () => {
    const corruptData = {
      ...validData,
      components: {
        ...validData.components,
        S_activity: [1, 2, 3], // not 2D array
      },
    };

    const result = WebsiteDataSchema.safeParse(corruptData);
    expect(result.success).toBe(false);
  });
});
