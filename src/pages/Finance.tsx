import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  getFinance, addFinance, deleteFinance, type FinanceRecord,
} from "@/lib/store";
import { PlusCircle, Trash2, TrendingUp, TrendingDown, Wallet, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const incomeCategories = ["Persembahan Minggu", "Perpuluhan", "Persembahan Khusus", "Donasi", "Lainnya"];
const expenseCategories = ["Operasional", "Pelayanan", "Perawatan", "Gaji Staf", "Kegiatan", "Lainnya"];

const emptyRecord: Omit<FinanceRecord, "id" | "created_at"> = {
  date: new Date().toISOString().split("T")[0],
  type: "Pemasukan", category: "", amount: 0, description: "", recorded_by: "",
};

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const Finance = () => {
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyRecord);
  const [filterType, setFilterType] = useState<string>("all");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const loadRecords = useCallback(async () => {
    try {
      const data = await getFinance();
      setRecords(data);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { loadRecords(); }, [loadRecords]);

  const filtered = useMemo(
    () => (filterType === "all" ? records : records.filter((r) => r.type === filterType)),
    [records, filterType]
  );

  const totalIncome = records.filter((r) => r.type === "Pemasukan").reduce((s, r) => s + r.amount, 0);
  const totalExpense = records.filter((r) => r.type === "Pengeluaran").reduce((s, r) => s + r.amount, 0);
  const balance = totalIncome - totalExpense;
  const categories = form.type === "Pemasukan" ? incomeCategories : expenseCategories;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category || form.amount <= 0) {
      toast({ title: "Error", description: "Kategori dan jumlah wajib diisi.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await addFinance(form);
      await loadRecords();
      setDialogOpen(false);
      setForm(emptyRecord);
      toast({ title: "Berhasil", description: "Transaksi ditambahkan." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus transaksi ini?")) return;
    try {
      await deleteFinance(id);
      await loadRecords();
      toast({ title: "Dihapus", description: "Transaksi telah dihapus." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
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
          <h2 className="font-display text-2xl font-bold text-foreground">Keuangan Gereja</h2>
          <p className="text-sm text-muted-foreground">{records.length} total transaksi</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><PlusCircle className="h-4 w-4 mr-2" />Tambah Transaksi</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">Tambah Transaksi</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Jenis *</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as FinanceRecord["type"], category: "" })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pemasukan">Pemasukan</SelectItem>
                      <SelectItem value="Pengeluaran">Pengeluaran</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Tanggal</Label>
                  <Input id="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Kategori *</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Jumlah (Rp) *</Label>
                <Input id="amount" type="number" min={0} value={form.amount || ""} onChange={(e) => setForm({ ...form, amount: parseInt(e.target.value) || 0 })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Keterangan</Label>
                <Input id="desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={200} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Simpan
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-2"><TrendingUp className="h-5 w-5 text-accent" /><span className="text-sm font-medium text-muted-foreground">Total Pemasukan</span></div>
          <p className="text-xl font-bold text-foreground font-display">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="p-5 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-2"><TrendingDown className="h-5 w-5 text-destructive" /><span className="text-sm font-medium text-muted-foreground">Total Pengeluaran</span></div>
          <p className="text-xl font-bold text-foreground font-display">{formatCurrency(totalExpense)}</p>
        </div>
        <div className="p-5 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-2"><Wallet className="h-5 w-5 text-primary" /><span className="text-sm font-medium text-muted-foreground">Saldo</span></div>
          <p className={`text-xl font-bold font-display ${balance >= 0 ? "text-accent" : "text-destructive"}`}>{formatCurrency(balance)}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {["all", "Pemasukan", "Pengeluaran"].map((type) => (
          <Button key={type} variant={filterType === type ? "default" : "outline"} size="sm" onClick={() => setFilterType(type)}>
            {type === "all" ? "Semua" : type}
          </Button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead className="hidden md:table-cell">Keterangan</TableHead>
              <TableHead className="text-right">Jumlah</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  {records.length === 0 ? "Belum ada transaksi." : "Tidak ada data ditemukan."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="text-sm">{record.date}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      record.type === "Pemasukan" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"
                    }`}>{record.type}</span>
                  </TableCell>
                  <TableCell className="text-sm">{record.category}</TableCell>
                  <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{record.description}</TableCell>
                  <TableCell className="text-right font-medium text-sm">{formatCurrency(record.amount)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(record.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
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

export default Finance;
