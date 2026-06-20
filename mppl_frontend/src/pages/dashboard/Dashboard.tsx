import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Package, Tag, Users, ArrowLeftRight, CheckCircle2,
  Wrench, BarChart3, Clock, TrendingUp, RefreshCw,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Stats {
  total_aset: number; total_tersedia: number; total_dipinjam: number;
  total_rusak: number; total_kategori: number; total_users: number;
  total_peminjaman: number; aktif_peminjaman: number;
  chart_peminjaman: { label: string; total: number }[];
  chart_stok: { label: string; total: number }[];
  trend_7hari: { tgl: string; total: number }[];
  peminjaman_terbaru: {
    id: number; kode_peminjaman: string; qty: number;
    waktu_pinjam: string; waktu_kembali: string | null;
    nama_peminjam: string; nama_barang: string; kode_qr: string;
  }[];
}

interface PublicAset {
  id: number; kode_qr: string; nama_barang: string; stok: number;
  status: string; nama_kategori: string; deskripsi: string | null;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color, sub }: {
  icon: React.ElementType; label: string; value: number | string;
  color: string; sub?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4"
  >
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-xs text-slate-500 font-medium">{label}</p>
      <p className="text-2xl font-black text-slate-800">{value}</p>
      {sub && <p className="text-[11px] text-slate-400">{sub}</p>}
    </div>
  </motion.div>
);

// ─── Simple Bar Chart ─────────────────────────────────────────────────────────
const BarChart = ({ data, title }: { data: { label: string; total: number }[]; title: string }) => {
  const max = Math.max(...data.map(d => Number(d.total)), 1);
  const colors = ["bg-blue-500","bg-emerald-500","bg-amber-500","bg-rose-500","bg-violet-500","bg-cyan-500"];
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <h3 className="font-bold text-slate-700 text-sm mb-4 flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-slate-400" />{title}
      </h3>
      <div className="space-y-3">
        {data.map((d, i) => (
          <div key={i}>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span className="truncate max-w-[60%] font-medium">{d.label}</span>
              <span className="font-bold text-slate-700">{d.total}</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${(Number(d.total) / max) * 100}%` }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className={`h-full rounded-full ${colors[i % colors.length]}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Trend Sparkline ──────────────────────────────────────────────────────────
const TrendChart = ({ data }: { data: { tgl: string; total: number }[] }) => {
  if (!data.length) return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <h3 className="font-bold text-slate-700 text-sm mb-3 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-slate-400" />Tren Peminjaman 7 Hari
      </h3>
      <p className="text-xs text-slate-400 text-center py-6">Belum ada data peminjaman</p>
    </div>
  );
  const max = Math.max(...data.map(d => Number(d.total)), 1);
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <h3 className="font-bold text-slate-700 text-sm mb-4 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-slate-400" />Tren Peminjaman 7 Hari Terakhir
      </h3>
      <div className="flex items-end gap-1.5 h-24">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[9px] text-slate-500 font-bold">{d.total}</span>
            <motion.div
              initial={{ height: 0 }} animate={{ height: `${(Number(d.total) / max) * 72}px` }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="w-full bg-gradient-to-t from-[#0b2f9f] to-[#00809d] rounded-t-md min-h-[4px]"
            />
            <span className="text-[9px] text-slate-400 text-center leading-tight">
              {new Date(d.tgl).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    tersedia: "bg-emerald-100 text-emerald-700",
    dipinjam: "bg-amber-100 text-amber-700",
    rusak:    "bg-rose-100 text-rose-700",
  };
  const label: Record<string, string> = { tersedia: "Tersedia", dipinjam: "Dipinjam", rusak: "Rusak" };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${map[status] ?? "bg-slate-100 text-slate-500"}`}>
      {label[status] ?? status}
    </span>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  useDocumentTitle("Dashboard — E-Asset");
  const { user } = useAuth();
  const isStaff = user?.role === "admin" || user?.role === "kerumahtanggaan";

  const [stats,   setStats]   = useState<Stats | null>(null);
  const [asets,   setAsets]   = useState<PublicAset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");

  const load = async () => {
    setLoading(true);
    try {
      if (isStaff) {
        const res = await api.get("/dashboard/stats");
        setStats(res.data.data);
      } else {
        const res = await api.get("/assets-main");
        setAsets(res.data.data ?? []);
      }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [isStaff]);

  const filtered = asets.filter(a =>
    !search || a.nama_barang.toLowerCase().includes(search.toLowerCase()) ||
    a.kode_qr.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-[#0b2f9f]/20 border-t-[#0b2f9f] rounded-full animate-spin" />
    </div>
  );

  // ── ADMIN / KERUMAHTANGGAAN DASHBOARD ──────────────────────────────────────
  if (isStaff && stats) return (
    <div className="flex-1 flex flex-col gap-5 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-800">Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Selamat datang, <span className="font-bold text-[#0b2f9f]">{user?.name}</span> —{" "}
            {new Date().toLocaleDateString("id-ID", { weekday:"long", day:"2-digit", month:"long", year:"numeric" })}
          </p>
        </div>
        <button onClick={load} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#0b2f9f] transition px-3 py-2 rounded-xl border border-slate-200 bg-white">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Package}       label="Total Aset"       value={stats.total_aset}      color="bg-blue-100 text-blue-600"    sub={`${stats.total_tersedia} tersedia`} />
        <StatCard icon={CheckCircle2}  label="Dipinjam Aktif"   value={stats.aktif_peminjaman} color="bg-amber-100 text-amber-600"  sub="transaksi berjalan" />
        <StatCard icon={Wrench}        label="Aset Rusak"        value={stats.total_rusak}      color="bg-rose-100 text-rose-600"    sub="perlu perbaikan" />
        <StatCard icon={Tag}           label="Kategori"          value={stats.total_kategori}   color="bg-violet-100 text-violet-600" />
        {user?.role === "admin" && (
          <StatCard icon={Users}         label="Total Pengguna"    value={stats.total_users}      color="bg-emerald-100 text-emerald-600" />
        )}
        <StatCard icon={ArrowLeftRight} label="Total Peminjaman" value={stats.total_peminjaman} color="bg-cyan-100 text-cyan-600"    sub="sepanjang masa" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1"><TrendChart data={stats.trend_7hari} /></div>
        <div className="lg:col-span-1"><BarChart data={stats.chart_peminjaman} title="Peminjaman per Kategori" /></div>
        <div className="lg:col-span-1"><BarChart data={stats.chart_stok} title="Stok per Kategori" /></div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />Transaksi Terbaru
          </h3>
          <Link to="/borrowing/history" className="text-xs text-[#0b2f9f] font-bold hover:underline">Lihat Semua →</Link>
        </div>
        {stats.peminjaman_terbaru.length === 0 ? (
          <div className="py-10 text-center text-slate-400 text-sm">Belum ada transaksi</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="bg-slate-50 text-slate-500 font-semibold">
                <th className="px-4 py-3 text-left">Kode</th>
                <th className="px-4 py-3 text-left">Barang</th>
                <th className="px-4 py-3 text-left">Peminjam</th>
                <th className="px-4 py-3 text-left">Waktu</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {stats.peminjaman_terbaru.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-mono text-[10px] text-slate-500">{p.kode_peminjaman}</td>
                    <td className="px-4 py-3 font-semibold text-slate-700">{p.nama_barang}</td>
                    <td className="px-4 py-3 text-slate-600">{p.nama_peminjam}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(p.waktu_pinjam).toLocaleDateString("id-ID", { day:"2-digit", month:"short", year:"2-digit" })}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={p.waktu_kembali ? "tersedia" : "dipinjam"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  // ── USER UMUM DASHBOARD — Katalog Barang ──────────────────────────────────
  return (
    <div className="flex-1 flex flex-col gap-5 p-4 sm:p-6">
      <div className="bg-gradient-to-r from-[#0b2f9f] to-[#00809d] rounded-2xl p-5 text-white shadow-lg">
        <h1 className="text-xl font-black">Halo, {user?.name} 👋</h1>
        <p className="text-blue-100 text-xs mt-1">Temukan barang yang ingin Anda pinjam dari katalog aset kampus di bawah ini.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Cari nama barang atau kode QR…"
          className="w-full pl-4 pr-10 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2f9f]/30"
        />
        <Package className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-slate-400">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Tidak ada barang ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-slate-800 text-sm leading-snug">{a.nama_barang}</p>
                  <p className="text-[10px] font-mono text-[#0b2f9f] mt-0.5">{a.kode_qr}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{a.nama_kategori}</p>
                </div>
                <StatusBadge status={a.status} />
              </div>
              {a.deskripsi && (
                <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">{a.deskripsi}</p>
              )}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-500">Stok: <strong className="text-slate-700">{a.stok}</strong> unit</span>
                {a.status === "tersedia" && a.stok > 0 && (
                  <Link
                    to="/borrowing/checkout"
                    state={{ kode_qr: a.kode_qr }}
                    className="text-[11px] font-bold text-[#0b2f9f] hover:underline"
                  >Ajukan Pinjam →</Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
