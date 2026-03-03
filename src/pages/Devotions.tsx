import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  getDevotions, addDevotion, updateDevotion, deleteDevotion, type Devotion,
} from "@/lib/store";
import { BookOpen, Search, Pencil, Trash2, Loader2, Plus, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const emptyDevotion: Omit<Devotion, "id" | "created_at" | "updated_at"> = {
  title: "",
  scripture: "",
  content: "",
  date: new Date().toISOString().split("T")[0],
  author: "Admin",
};

const Devotions = () => {
  const [devotions, setDevotions] = useState<Devotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyDevotion);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const loadDevotions = useCallback(async () => {
    try {
      const data = await getDevotions();
      setDevotions(data);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadDevotions();
  }, [loadDevotions]);

  const filtered = useMemo(
    () =>
      devotions.filter(
        (d) =>
          d.title.toLowerCase().includes(search.toLowerCase()) ||
          d.scripture.toLowerCase().includes(search.toLowerCase()) ||
          d.content.toLowerCase().includes(search.toLowerCase())
      ),
    [devotions, search]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateDevotion(editingId, form);
        toast({ title: "Berhasil", description: "Renungan berhasil diperbarui" });
      } else {
        await addDevotion(form);
        toast({ title: "Berhasil", description: "Renungan berhasil ditambahkan" });
      }
      setDialogOpen(false);
      setEditingId(null);
      setForm(emptyDevotion);
      await loadDevotions();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (devotion: Devotion) => {
    setEditingId(devotion.id);
    setForm({
      title: devotion.title,
      scripture: devotion.scripture,
      content: devotion.content,
      date: devotion.date,
      author: devotion.author,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus renungan ini?")) return;
    try {
      await deleteDevotion(id);
      toast({ title: "Berhasil", description: "Renungan berhasil dihapus" });
      await loadDevotions();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Kelola Renungan
          </h2>
          <p className="text-muted-foreground mt-1">
            Tambah dan kelola renungan harian untuk jemaat
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingId(null); setForm(emptyDevotion); }}>
              <Plus className="h-4 w-4 mr-2" /> Tambah Renungan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Renungan" : "Tambah Renungan Baru"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="date">Tanggal</Label>
                <Input
                  id="date"
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="title">Judul Renungan</Label>
                <Input
                  id="title"
                  required
                  placeholder="Contoh: Kasih yang Sempurna"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="scripture">Ayat Alkitab</Label>
                <Input
                  id="scripture"
                  required
                  placeholder="Contoh: Yohanes 3:16 - Karena begitu besar kasih Allah..."
                  value={form.scripture}
                  onChange={(e) => setForm({ ...form, scripture: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="content">Isi Renungan</Label>
                <Textarea
                  id="content"
                  required
                  rows={10}
                  placeholder="Tuliskan isi renungan..."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="author">Penulis</Label>
                <Input
                  id="author"
                  required
                  placeholder="Nama penulis"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  {editingId ? "Perbarui" : "Simpan"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={saving}
                >
                  Batal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari renungan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Total: {filtered.length} renungan
        </div>
      </div>

      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Ayat</TableHead>
              <TableHead>Penulis</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  {search ? "Tidak ada renungan yang cocok dengan pencarian." : "Belum ada renungan. Klik 'Tambah Renungan' untuk mulai."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((devotion) => (
                <TableRow key={devotion.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{formatDate(devotion.date)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{devotion.title}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-xs mt-1">
                      {devotion.content.substring(0, 60)}...
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground truncate max-w-xs">
                      {devotion.scripture.substring(0, 50)}
                      {devotion.scripture.length > 50 ? "..." : ""}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{devotion.author}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(devotion)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(devotion.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Devotions;
