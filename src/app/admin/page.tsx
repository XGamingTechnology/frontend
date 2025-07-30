"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatarUrl: string;
}

interface LogEntry {
  message: string;
  timestamp: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [activityLogs, setActivityLogs] = useState<LogEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "user", password: "" });

  // 🔐 Cek autentikasi & ambil data user
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      router.push("/login");
      return;
    }

    const currentUser = JSON.parse(user);
    if (currentUser.role !== "admin") {
      alert("Akses ditolak: hanya admin yang bisa masuk");
      router.push("/map");
      return;
    }

    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `{ users { id username fullName email role avatarUrl } }`,
        }),
      });

      const result = await response.json();
      if (result.data?.users) {
        const mapped = result.data.users.map((u: any) => ({
          id: u.id,
          name: u.fullName || u.username,
          email: u.email,
          role: u.role as "user" | "admin",
          avatarUrl: u.avatarUrl || "/images/user-default.png",
        }));
        setUsers(mapped);
      }
    } catch (err) {
      console.error("Gagal ambil data user:", err);
      alert("Gagal terhubung ke server");
    }
  };

  const logActivity = (message: string) => {
    const timestamp = new Date().toLocaleString();
    setActivityLogs((prev) => [{ message, timestamp }, ...prev]);
  };

  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin logout?")) {
      logActivity("Admin logout");
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      router.push("/login");
    }
  };

  // 🔹 Tambah User (via register mutation)
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert("Semua field harus diisi");
      return;
    }

    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            mutation Register($name: String!, $email: String!, $password: String!) {
              register(name: $name, email: $email, password: $password) {
                success
                message
                user {
                  id
                  username
                  fullName
                  email
                  role
                  avatarUrl
                }
              }
            }
          `,
          variables: newUser,
        }),
      });

      const result = await response.json();
      if (result.data?.register.success) {
        const u = result.data.register.user;
        setUsers((prev) => [
          ...prev,
          {
            id: u.id,
            name: u.fullName || u.username,
            email: u.email,
            role: u.role,
            avatarUrl: u.avatarUrl,
          },
        ]);
        logActivity(`Menambahkan user ${u.fullName}`);
        setShowAddForm(false);
        setNewUser({ name: "", email: "", role: "user", password: "" });
      } else {
        alert(result.data?.register.message || "Gagal tambah user");
      }
    } catch (err) {
      console.error("Gagal tambah user:", err);
      alert("Terjadi kesalahan");
    }
  };

  // 🔹 Ubah Role
  const toggleRole = async (id: string) => {
    const token = localStorage.getItem("authToken");
    const target = users.find((u) => u.id === id);
    if (!target) return;

    const newRole = target.role === "admin" ? "user" : "admin";

    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            mutation UpdateUserRole($id: ID!, $role: String!) {
              updateUserRole(id: $id, role: $role) {
                success
                message
              }
            }
          `,
          variables: { id, role: newRole },
        }),
      });

      const result = await response.json();
      if (result.data?.updateUserRole.success) {
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
        logActivity(`Mengubah role ${target.name} menjadi ${newRole}`);
      } else {
        alert("Gagal ubah role");
      }
    } catch (err) {
      console.error("Gagal ubah role:", err);
      alert("Terjadi kesalahan");
    }
  };

  // 🔹 Hapus User
  const removeUser = async (id: string) => {
    const token = localStorage.getItem("authToken");
    const target = users.find((u) => u.id === id);
    if (!target) return;

    if (!confirm(`Yakin ingin menghapus ${target.name}?`)) return;

    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            mutation DeleteUser($id: ID!) {
              deleteUser(id: $id)
            }
          `,
          variables: { id },
        }),
      });

      const result = await response.json();
      if (result.data?.deleteUser) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        logActivity(`Menghapus user ${target.name}`);
      } else {
        alert("Gagal hapus user");
      }
    } catch (err) {
      console.error("Gagal hapus user:", err);
      alert("Terjadi kesalahan");
    }
  };

  // 🔹 Export CSV
  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + ["Nama,Email,Role"].concat(users.map((u) => `${u.name},${u.email},${u.role}`)).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = "users.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logActivity("Melakukan ekspor data pengguna ke CSV");
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <nav className="text-sm text-white/60 mb-1">
              <span className="hover:underline cursor-pointer" onClick={() => router.push("/")}>
                Home
              </span>{" "}
              /{" "}
              <span className="hover:underline cursor-pointer" onClick={() => router.push("/admin")}>
                Admin
              </span>{" "}
              / Manajemen Pengguna
            </nav>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <button onClick={handleLogout} className="text-sm text-red-400 hover:underline flex items-center gap-0.01" title="Keluar dari sistem">
            <Image src="/Logout.svg" alt="Logout" width={32} height={32} /> Logout
          </button>
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Daftar Pengguna</h2>
          <div className="space-x-2">
            <button onClick={() => setShowAddForm(true)} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md text-sm" title="Tambah pengguna baru">
              + Tambah User
            </button>
            <button onClick={exportCSV} className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-md text-sm" title="Export ke CSV">
              ⬇️ Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto bg-slate-800 rounded-lg shadow-md border border-slate-700">
          <table className="min-w-full text-sm text-left text-white">
            <thead className="bg-slate-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Nama</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                  <td className="px-6 py-4 font-medium flex items-center gap-2">
                    <Image src={user.avatarUrl || "/User.svg"} alt="User" width={24} height={24} />
                    {user.name}
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4 capitalize">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${user.role === "admin" ? "bg-red-500/20 text-red-300" : "bg-blue-500/20 text-blue-300"}`}>{user.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end items-center gap-2">
                      <button onClick={() => toggleRole(user.id)} className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-white text-xs">
                        Ubah Role
                      </button>
                      <button onClick={() => removeUser(user.id)} className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-white text-xs">
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 max-h-72 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-3">⏱️ Riwayat Aktivitas</h2>
          {activityLogs.length > 0 ? (
            activityLogs.map((log, i) => (
              <p key={i} className="text-sm text-white/80">
                {log.timestamp} – {log.message}
              </p>
            ))
          ) : (
            <p className="text-white/50 italic">Belum ada aktivitas tercatat.</p>
          )}
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg w-full max-w-md relative">
              <h3 className="text-xl font-bold mb-4">Tambah Pengguna</h3>
              <div className="space-y-3">
                <input type="text" placeholder="Nama" className="w-full px-4 py-2 rounded bg-slate-700 text-white focus:outline-none" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
                <input type="email" placeholder="Email" className="w-full px-4 py-2 rounded bg-slate-700 text-white focus:outline-none" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                <input type="password" placeholder="Password" className="w-full px-4 py-2 rounded bg-slate-700 text-white focus:outline-none" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
                <select className="w-full px-4 py-2 rounded bg-slate-700 text-white" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value as "user" | "admin" })}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-gray-600 rounded text-white hover:bg-gray-500">
                  Batal
                </button>
                <button onClick={handleAddUser} className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-500">
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
