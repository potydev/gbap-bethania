import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  getEvents, addEvent, updateEvent, deleteEvent, type ChurchEvent,
} from "@/lib/store";
import { CalendarPlus, Pencil, Trash2, MapPin, Clock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const emptyEvent: Omit<ChurchEvent, "id" | "created_at"> = {
  name: "", date: new Date().toISOString().split("T")[0], time: "09:00",
  location: "", type: "Ibadah", description: "", status: "Mendatang",
};

const Events = () => {
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyEvent);
  const [filterType, setFilterType] = useState<string>("all");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const loadEvents = useCallback(async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  const filtered = useMemo(
    () => (filterType === "all" ? events : events.filter((e) => e.type === filterType)),
    [events, filterType]
  );

  const resetForm = () => { setForm(emptyEvent); setEditingId(null); };

  const handleEdit = (event: ChurchEvent) => {
    setEditingId(event.id);
    setForm({
      name: event.name, date: event.date, time: event.time,
      location: event.location, type: event.type,
      description: event.description, status: event.status,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.date) {
      toast({ title: "Error", description: "Nama acara dan tanggal wajib diisi.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateEvent(editingId, form);
        toast({ title: "Berhasil", description: "Acara diperbarui." });
      } else {
        await addEvent(form);
        toast({ title: "Berhasil", description: "Acara baru ditambahkan." });
      }
      await loadEvents();
      setDialogOpen(false);
      resetForm();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus acara ini?")) return;
    try {
      await deleteEvent(id);
      await loadEvents();
      toast({ title: "Dihapus", description: "Acara telah dihapus." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const statusColors: Record<string, string> = {
    Mendatang: "bg-accent/10 text-accent",
    Berlangsung: "bg-primary/10 text-primary",
    Selesai: "bg-muted text-muted-foreground",
  };

  const typeColors: Record<string, string> = {
    Ibadah: "bg-primary/10 text-primary",
    Kegiatan: "bg-accent/10 text-accent",
    Pelayanan: "bg-secondary/10 text-secondary-foreground",
    Rapat: "bg-muted text-muted-foreground",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Manajemen Acara</h2>
          <p className="text-sm text-muted-foreground">{events.length} total acara</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><CalendarPlus className="h-4 w-4 mr-2" />Tambah Acara</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">
                {editingId ? "Edit Acara" : "Tambah Acara Baru"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Acara *</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Tanggal *</Label>
                  <Input id="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Waktu</Label>
                  <Input id="time" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Lokasi</Label>
                <Input id="location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} maxLength={100} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Jenis</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as ChurchEvent["type"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ibadah">Ibadah</SelectItem>
                      <SelectItem value="Kegiatan">Kegiatan</SelectItem>
                      <SelectItem value="Pelayanan">Pelayanan</SelectItem>
                      <SelectItem value="Rapat">Rapat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as ChurchEvent["status"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mendatang">Mendatang</SelectItem>
                      <SelectItem value="Berlangsung">Berlangsung</SelectItem>
                      <SelectItem value="Selesai">Selesai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={500} rows={3} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>Batal</Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingId ? "Simpan" : "Tambah"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all", "Ibadah", "Kegiatan", "Pelayanan", "Rapat"].map((type) => (
          <Button key={type} variant={filterType === type ? "default" : "outline"} size="sm" onClick={() => setFilterType(type)}>
            {type === "all" ? "Semua" : type}
          </Button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-12">
            {events.length === 0 ? "Belum ada acara." : "Tidak ada acara ditemukan."}
          </div>
        ) : (
          filtered.map((event) => (
            <div key={event.id} className="rounded-xl bg-card border border-border p-5 hover:shadow-soft transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[event.type] || ""}`}>{event.type}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[event.status] || ""}`}>{event.status}</span>
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{event.name}</h3>
              <div className="space-y-1.5 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" />{event.date} · {event.time}</div>
                {event.location && <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{event.location}</div>}
              </div>
              {event.description && <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{event.description}</p>}
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(event)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(event.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Events;
