import { sql } from './dbClient';
import { Scan, SearchParams, WeakSignal } from '../types';

export const saveScan = async (
  searchParams: SearchParams,
  signals: WeakSignal[]
): Promise<Scan | null> => {
  try {
    const defaultTitle = `${searchParams.domain} - ${searchParams.geography} (${searchParams.timeline})`;

    const result = await sql`
      INSERT INTO scans (title, domain, geography, timeline, detailed_context, signals)
      VALUES (
        ${defaultTitle},
        ${searchParams.domain},
        ${searchParams.geography},
        ${searchParams.timeline},
        ${searchParams.detailedContext || null},
        ${sql.json(signals)}
      )
      RETURNING *
    `;

    return result[0] as Scan;
  } catch (error) {
    console.error('Error saving scan:', error);
    return null;
  }
};

export const getAllScans = async (): Promise<Scan[]> => {
  try {
    const result = await sql`
      SELECT * FROM scans
      ORDER BY created_at DESC
    `;

    return result as Scan[];
  } catch (error) {
    console.error('Error fetching scans:', error);
    return [];
  }
};

export const updateScanTitle = async (
  scanId: string,
  newTitle: string
): Promise<boolean> => {
  try {
    await sql`
      UPDATE scans
      SET title = ${newTitle}
      WHERE id = ${scanId}
    `;

    return true;
  } catch (error) {
    console.error('Error updating scan title:', error);
    return false;
  }
};

export const deleteScan = async (scanId: string): Promise<boolean> => {
  try {
    await sql`
      DELETE FROM scans
      WHERE id = ${scanId}
    `;

    return true;
  } catch (error) {
    console.error('Error deleting scan:', error);
    return false;
  }
};
