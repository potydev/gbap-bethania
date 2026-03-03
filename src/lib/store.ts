// Supabase-based data store for church management
import { supabase } from "@/lib/supabase";

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  birth_date: string;
  join_date: string;
  status: "Aktif" | "Tidak Aktif" | "Pindahan";
  gender: "Laki-laki" | "Perempuan";
  baptized: boolean;
  created_at?: string;
}

export interface ChurchEvent {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  type: "Ibadah" | "Kegiatan" | "Pelayanan" | "Rapat";
  description: string;
  status: "Mendatang" | "Berlangsung" | "Selesai";
  created_at?: string;
}

export interface FinanceRecord {
  id: string;
  date: string;
  type: "Pemasukan" | "Pengeluaran";
  category: string;
  amount: number;
  description: string;
  recorded_by: string;
  created_at?: string;
}

export interface Devotion {
  id: string;
  title: string;
  scripture: string;
  content: string;
  date: string;
  author: string;
  created_at?: string;
  updated_at?: string;
}

// Members CRUD
export const getMembers = async (): Promise<Member[]> => {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const addMember = async (member: Omit<Member, "id" | "created_at">): Promise<Member> => {
  const { data, error } = await supabase
    .from("members")
    .insert(member)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateMember = async (id: string, updates: Partial<Member>) => {
  const { error } = await supabase
    .from("members")
    .update(updates)
    .eq("id", id);
  if (error) throw error;
};

export const deleteMember = async (id: string) => {
  const { error } = await supabase
    .from("members")
    .delete()
    .eq("id", id);
  if (error) throw error;
};

// Events CRUD
export const getEvents = async (): Promise<ChurchEvent[]> => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true });
  if (error) throw error;
  return data || [];
};

export const addEvent = async (event: Omit<ChurchEvent, "id" | "created_at">): Promise<ChurchEvent> => {
  const { data, error } = await supabase
    .from("events")
    .insert(event)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateEvent = async (id: string, updates: Partial<ChurchEvent>) => {
  const { error } = await supabase
    .from("events")
    .update(updates)
    .eq("id", id);
  if (error) throw error;
};

export const deleteEvent = async (id: string) => {
  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", id);
  if (error) throw error;
};

// Finance CRUD
export const getFinance = async (): Promise<FinanceRecord[]> => {
  const { data, error } = await supabase
    .from("finance")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const addFinance = async (record: Omit<FinanceRecord, "id" | "created_at">): Promise<FinanceRecord> => {
  const { data, error } = await supabase
    .from("finance")
    .insert(record)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateFinance = async (id: string, updates: Partial<FinanceRecord>) => {
  const { error } = await supabase
    .from("finance")
    .update(updates)
    .eq("id", id);
  if (error) throw error;
};

export const deleteFinance = async (id: string) => {
  const { error } = await supabase
    .from("finance")
    .delete()
    .eq("id", id);
  if (error) throw error;
};

// Devotions CRUD
export const getDevotions = async (): Promise<Devotion[]> => {
  const { data, error } = await supabase
    .from("devotions")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const getTodayDevotion = async (): Promise<Devotion | null> => {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from("devotions")
    .select("*")
    .eq("date", today)
    .single();
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
  return data || null;
};

export const addDevotion = async (devotion: Omit<Devotion, "id" | "created_at" | "updated_at">): Promise<Devotion> => {
  const { data, error } = await supabase
    .from("devotions")
    .insert(devotion)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateDevotion = async (id: string, updates: Partial<Devotion>) => {
  const { error } = await supabase
    .from("devotions")
    .update(updates)
    .eq("id", id);
  if (error) throw error;
};

export const deleteDevotion = async (id: string) => {
  const { error } = await supabase
    .from("devotions")
    .delete()
    .eq("id", id);
  if (error) throw error;
};
