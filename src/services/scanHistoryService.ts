import { supabase } from '../lib/supabase';
import { Scan, SearchParams, WeakSignal } from '../types';

export const saveScan = async (
  searchParams: SearchParams,
  signals: WeakSignal[]
): Promise<Scan | null> => {
  try {
    const defaultTitle = `${searchParams.domain} - ${searchParams.geography} (${searchParams.timeline})`;

    const { data, error } = await supabase
      .from('scans')
      .insert({
        title: defaultTitle,
        domain: searchParams.domain,
        geography: searchParams.geography,
        timeline: searchParams.timeline,
        detailed_context: searchParams.detailedContext || null,
        signals: signals,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving scan:', error);
      return null;
    }

    return data as Scan;
  } catch (error) {
    console.error('Error saving scan:', error);
    return null;
  }
};

export const getAllScans = async (): Promise<Scan[]> => {
  try {
    const { data, error } = await supabase
      .from('scans')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching scans:', error);
      return [];
    }

    return (data as Scan[]) || [];
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
    const { error } = await supabase
      .from('scans')
      .update({ title: newTitle })
      .eq('id', scanId);

    if (error) {
      console.error('Error updating scan title:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating scan title:', error);
    return false;
  }
};

export const deleteScan = async (scanId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('scans')
      .delete()
      .eq('id', scanId);

    if (error) {
      console.error('Error deleting scan:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting scan:', error);
    return false;
  }
};
