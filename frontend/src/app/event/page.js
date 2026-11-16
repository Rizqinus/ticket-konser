"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AdminLayout from "@/components/AdminLayout";
import Icon from "@/components/Icon";
import { api } from "@/lib/api";

export default function KelolaEventPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    concert_date: "",
    concert_time: "19:00",
    image: "",
    status: "upcoming",
  });
  const [posterFile, setPosterFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [tickets, setTickets] = useState({
    reguler: { price: "", stock: "" },
    vip: { price: "", stock: "" },
    festival: { price: "", stock: "" },
  });
  const [artists, setArtists] = useState([]);
  const [artistForm, setArtistForm] = useState({
    name: "",
    description: "Pengisi Acara Utama",
    image: "",
    file: null,
    preview: "",
  });

  const API_SERVER_URL =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:5000";

  function getConcertImage(img) {
    if (!img) return defaultImg;
    if (img.startsWith("/uploads")) return `${API_SERVER_URL}${img}`;
    return img;
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      setPosterFile(file);
      setFilePreview(URL.createObjectURL(file));
      setForm((prev) => ({ ...prev, image: "" }));
    }
  }

  function handleRemoveFile() {
    setPosterFile(null);
    setFilePreview("");
  }

  function handleArtistFileChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      setArtistForm((prev) => ({
        ...prev,
        file,
        preview: URL.createObjectURL(file),
      }));
    }
  }

  function handleAddArtist() {
    if (!artistForm.name.trim()) {
      alert("Nama artis wajib diisi!");
      return;
    }
    setArtists((prev) => [
      ...prev,
      {
        id: `art-${Date.now()}`,
        name: artistForm.name.trim(),
        description: artistForm.description.trim() || "Musisi Penampil",
        image: artistForm.image || "/concerts/indie-guitarist.jpg",
        file: artistForm.file,
        preview: artistForm.preview || artistForm.image || "/concerts/indie-guitarist.jpg",
      },
    ]);
    setArtistForm({
      name: "",
      description: "Pengisi Acara Utama",
      image: "",
      file: null,
      preview: "",
    });
  }

  function handleRemoveArtist(idx) {
    setArtists((prev) => prev.filter((_, i) => i !== idx));
  }

  async function loadEvents() {
    setLoading(true);
    try {
      const res = await api.getConcerts();
      if (res?.data) {
        setEvents(res.data || []);
      }
    } catch (err) {
      console.error("Gagal memuat event:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  function handleOpenCreate() {
    setEditingEvent(null);
    setForm({
      title: "",
      description: "",
      location: "",
      concert_date: "",
      concert_time: "19:00",
      image: "",
      status: "upcoming",
    });
    setTickets({
      reguler: { price: "", stock: "" },
      vip: { price: "", stock: "" },
      festival: { price: "", stock: "" },
    });
    setArtists([]);
    setArtistForm({
      name: "",
      description: "Pengisi Acara Utama",
      image: "",
      file: null,
      preview: "",
    });
    setPosterFile(null);
    setFilePreview("");
    setShowModal(true);
  }

  function handleOpenEdit(event) {
    setEditingEvent(event);
    setForm({
      title: event.title || "",
      description: event.description || "",
      location: event.location || "",
      concert_date: event.concert_date ? String(event.concert_date).split("T")[0] : "",
      concert_time: event.concert_time ? String(event.concert_time).slice(0, 5) : "19:00",
      image: event.image || "",
      status: event.status || "upcoming",
    });

    const reg = event.tickets?.find((t) => t.class === "Reguler" || t.name === "Reguler");
    const vip = event.tickets?.find((t) => t.class === "VIP" || t.name === "VIP");
    const fest = event.tickets?.find((t) => t.class === "Festival" || t.name === "Festival");

    setTickets({
      reguler: { price: reg?.price ?? "", stock: reg?.stock ?? "" },
      vip: { price: vip?.price ?? "", stock: vip?.stock ?? "" },
      festival: { price: fest?.price ?? "", stock: fest?.stock ?? "" },
    });

    if (Array.isArray(event.artists) && event.artists.length > 0) {
      setArtists(
        event.artists.map((a, idx) => ({
          id: a.id || `art-${idx}-${Date.now()}`,
          name: a.name || "",
          description: a.description || "Musisi Penampil",
          image: a.image || "/concerts/indie-guitarist.jpg",
          file: null,
          preview: a.image ? getConcertImage(a.image) : "/concerts/indie-guitarist.jpg",
        }))
      );
    } else {
      setArtists([]);
    }
    setArtistForm({
      name: "",
      description: "Pengisi Acara Utama",
      image: "",
      file: null,
      preview: "",
    });

    setPosterFile(null);
    setFilePreview(event.image ? getConcertImage(event.image) : "");
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.location || !form.concert_date) {
      alert("Judul, lokasi, dan tanggal konser wajib diisi!");
      return;
    }
    setSubmitting(true);
    try {
      const ticketList = [];
      if (tickets.reguler.price || tickets.reguler.stock) {
        ticketList.push({
          class: "Reguler",
          price: Number(tickets.reguler.price) || 0,
          stock: Number(tickets.reguler.stock) || 0,
        });
      }
      if (tickets.vip.price || tickets.vip.stock) {
        ticketList.push({
          class: "VIP",
          price: Number(tickets.vip.price) || 0,
          stock: Number(tickets.vip.stock) || 0,
        });
      }
      if (tickets.festival.price || tickets.festival.stock) {
        ticketList.push({
          class: "Festival",
          price: Number(tickets.festival.price) || 0,
          stock: Number(tickets.festival.stock) || 0,
        });
      }

      // Upload file foto artis jika ada
      const processedArtists = [];
      for (const art of artists) {
        let artImageUrl = art.image;
        if (art.file) {
          try {
            const uploadRes = await api.uploadArtistImage(art.file);
            if (uploadRes?.data?.url) {
              artImageUrl = uploadRes.data.url;
            }
          } catch (uploadErr) {
            console.error("Gagal upload gambar artis:", uploadErr);
          }
        }
        processedArtists.push({
          id: typeof art.id === "number" ? art.id : undefined,
          name: art.name,
          description: art.description,
          image: artImageUrl || "/concerts/indie-guitarist.jpg",
        });
      }

      let payload;
      if (posterFile) {
        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("description", form.description || "");
        formData.append("location", form.location);
        formData.append("concert_date", form.concert_date);
        formData.append("concert_time", form.concert_time || "19:00");
        formData.append("status", form.status || "upcoming");
        formData.append("image", posterFile);
        formData.append("tickets", JSON.stringify(ticketList));
        formData.append("artists", JSON.stringify(processedArtists));
        payload = formData;
      } else {
        payload = {
          ...form,
          tickets: ticketList,
          artists: processedArtists,
        };
      }

      if (editingEvent) {
        await api.updateConcert(editingEvent.id, payload);
        alert("Event konser berhasil diperbarui!");
      } else {
        await api.createConcert(payload);
        alert("Event konser beserta lineup artis dan tiket berhasil ditambahkan!");
      }

      setShowModal(false);
      setEditingEvent(null);
      setForm({
        title: "",
        description: "",
        location: "",
        concert_date: "",
        concert_time: "19:00",
        image: "",
        status: "upcoming",
      });
      setPosterFile(null);
      setFilePreview("");
      setTickets({
        reguler: { price: "", stock: "" },
        vip: { price: "", stock: "" },
        festival: { price: "", stock: "" },
      });
      setArtists([]);
      setArtistForm({
        name: "",
        description: "Pengisi Acara Utama",
        image: "",
        file: null,
        preview: "",
      });
      loadEvents();
    } catch (err) {
      alert(err.message || (editingEvent ? "Gagal memperbarui konser." : "Gagal membuat konser."));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id, title) {
    if (!confirm(`Hapus konser "${title}"?`)) return;
    try {
      await api.deleteConcert(id);
      loadEvents();
    } catch (err) {
      alert(err.message || "Gagal menghapus konser.");
    }
  }

  const defaultImg = "/concerts/rock-stage.jpg";

  return (
    <AdminLayout>
      <div className="mb-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Kelola Event
          </h2>
          <p className="font-body-base text-body-base text-on-surface-variant">
            Atur jadwal konser, deskripsi, dan status penjualan tiket.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-label-md shadow-sm hover:opacity-90 active:scale-95 transition-all"
        >
          <Icon name="add" className="text-sm" />
          Tambah Event Baru
        </button>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-surface-container-low border-b border-outline-variant">
              <tr>
                <th className="px-6 py-4 text-left font-label-md text-on-surface-variant uppercase tracking-wider">
                  Poster
                </th>
                <th className="px-6 py-4 text-left font-label-md text-on-surface-variant uppercase tracking-wider">
                  Judul Event
                </th>
                <th className="px-6 py-4 text-left font-label-md text-on-surface-variant uppercase tracking-wider">
                  Tanggal &amp; Waktu
                </th>
                <th className="px-6 py-4 text-left font-label-md text-on-surface-variant uppercase tracking-wider">
                  Lokasi
                </th>
                <th className="px-6 py-4 text-left font-label-md text-on-surface-variant uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left font-label-md text-on-surface-variant uppercase tracking-wider">
                  Kategori Tiket
                </th>
                <th className="px-6 py-4 text-right font-label-md text-on-surface-variant uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {events.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-on-surface-variant font-body-sm"
                  >
                    {loading
                      ? "Memuat jadwal konser..."
                      : "Belum ada event konser di database. Klik tombol 'Tambah Event Baru' untuk mulai."}
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr
                    key={event.id}
                    className="hover:bg-surface-container-low/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="w-12 h-16 rounded-lg overflow-hidden bg-surface-container shadow-sm relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="object-cover w-full h-full"
                          src={getConcertImage(event.image)}
                          alt={event.title}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-label-md text-on-surface font-semibold">
                        {event.title}
                      </div>
                      <div className="text-xs text-on-surface-variant line-clamp-1 max-w-xs">
                        {event.description || "Tidak ada deskripsi"}
                      </div>
                      {event.artists && event.artists.length > 0 && (
                        <div className="flex items-center gap-1 mt-1.5 flex-wrap max-w-xs">
                          {event.artists.map((a) => (
                            <span
                              key={a.id || a.name}
                              className="inline-flex items-center gap-1 text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                              {a.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-body-sm text-on-surface">
                        {event.concert_date
                          ? new Date(event.concert_date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "-"}
                      </div>
                      <div className="text-xs text-on-surface-variant">
                        {event.concert_time || "19:00"} WIB
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-body-sm text-on-surface">
                        {event.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase ${
                          event.status === "upcoming"
                            ? "bg-emerald-100 text-emerald-800"
                            : event.status === "ongoing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {event.status || "upcoming"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {event.tickets && event.tickets.length > 0 ? (
                        <div className="flex flex-col gap-1 max-w-xs">
                          {Object.values(
                            event.tickets.reduce((acc, t) => {
                              const key = (t.class || t.name || "").toUpperCase();
                              if (!acc[key]) acc[key] = t;
                              return acc;
                            }, {})
                          ).map((t) => (
                            <div
                              key={t.id || t.class}
                              className="inline-flex items-center justify-between gap-2 px-2 py-0.5 rounded bg-surface-container-low text-xs border border-outline-variant"
                            >
                              <span
                                className={`font-semibold ${
                                  t.class === "VIP"
                                    ? "text-amber-700"
                                    : t.class === "Festival"
                                    ? "text-purple-700"
                                    : "text-blue-700"
                                }`}
                              >
                                {t.class || t.name}
                              </span>
                              <span className="text-on-surface-variant text-[11px]">
                                Rp {Number(t.price).toLocaleString("id-ID")} ({t.stock})
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-on-surface-variant italic">
                          Belum ada tiket
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          title="Edit Event"
                          onClick={() => handleOpenEdit(event)}
                          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Icon name="edit" className="text-[18px]" />
                        </button>
                        <button
                          title="Hapus Event"
                          onClick={() => handleDelete(event.id, event.title)}
                          className="p-2 text-on-surface-variant hover:text-error hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Icon name="delete" className="text-[18px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Event */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-on-surface">
                {editingEvent ? "Edit Event Konser" : "Tambah Event Konser"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-outline">
                <Icon name="close" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">
                  Judul Konser *
                </label>
                <input
                  required
                  placeholder="Contoh: Rock Revolution 2026"
                  className="w-full border border-outline-variant rounded-xl p-3 text-sm outline-none focus:border-primary"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">
                  Deskripsi
                </label>
                <textarea
                  rows={2}
                  placeholder="Deskripsi singkat konser..."
                  className="w-full border border-outline-variant rounded-xl p-3 text-sm outline-none focus:border-primary"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    Tanggal Konser *
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full border border-outline-variant rounded-xl p-3 text-sm outline-none focus:border-primary"
                    value={form.concert_date}
                    onChange={(e) => setForm({ ...form, concert_date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    Waktu Konser
                  </label>
                  <input
                    type="time"
                    className="w-full border border-outline-variant rounded-xl p-3 text-sm outline-none focus:border-primary"
                    value={form.concert_time}
                    onChange={(e) => setForm({ ...form, concert_time: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    Lokasi / Venue *
                  </label>
                  <input
                    required
                    placeholder="Contoh: Gelora Bung Karno, Jakarta"
                    className="w-full border border-outline-variant rounded-xl p-3 text-sm outline-none focus:border-primary"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    Status Event
                  </label>
                  <select
                    className="w-full border border-outline-variant rounded-xl p-3 text-sm outline-none focus:border-primary bg-white"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="upcoming">Upcoming (Akan Datang)</option>
                    <option value="ongoing">Ongoing (Sedang Berjalan)</option>
                    <option value="finished">Finished (Selesai)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">
                  Gambar Poster Konser (Upload File atau URL)
                </label>

                {/* Upload File Input */}
                <div className="mb-2">
                  <input
                    type="file"
                    accept="image/*"
                    id="poster-upload-input"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="poster-upload-input"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-xl text-xs font-semibold hover:bg-primary/20 transition-all active:scale-95"
                    >
                      <Icon name="upload" className="text-sm" />
                      {posterFile ? "Ganti File Poster" : "Pilih File Gambar dari Komputer..."}
                    </label>

                    {posterFile && (
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="text-xs text-error hover:underline flex items-center gap-1"
                      >
                        <Icon name="close" className="text-sm" />
                        Hapus File
                      </button>
                    )}
                  </div>

                  {filePreview && (
                    <div className="mt-2.5 flex items-center gap-3 p-2.5 bg-surface-container-low rounded-xl border border-outline-variant">
                      <div className="w-14 h-16 rounded-lg overflow-hidden bg-black/5 relative shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={filePreview}
                          alt="Preview Poster"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-xs overflow-hidden">
                        <div className="font-semibold text-on-surface truncate max-w-[260px]">
                          {posterFile?.name}
                        </div>
                        <div className="text-emerald-700 text-[11px] font-medium mt-0.5">
                          ✓ File siap diupload ({(posterFile?.size / 1024).toFixed(1)} KB)
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {!posterFile && (
                  <>
                    <div className="relative flex py-1 items-center">
                      <div className="flex-grow border-t border-outline-variant"></div>
                      <span className="flex-shrink mx-2 text-[10px] uppercase font-bold text-on-surface-variant">
                        Atau Gunakan URL Gambar
                      </span>
                      <div className="flex-grow border-t border-outline-variant"></div>
                    </div>
                    <input
                      type="text"
                      placeholder="Masukkan URL gambar poster (https://...)"
                      className="w-full border border-outline-variant rounded-xl p-3 text-sm outline-none focus:border-primary"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                    />
                  </>
                )}
              </div>

              {/* Lineup Artis & Pengisi Acara */}
              <div className="border-t border-outline-variant pt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon name="person" className="text-primary text-base" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface">
                      Lineup Artis &amp; Penampil Konser
                    </h4>
                  </div>
                  <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {artists.length} Artis Terdaftar
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant mb-3">
                  Pilih file gambar artis dari komputer untuk ditampilkan pada avatar lingkaran di halaman detail mobile.
                </p>

                {/* Form Tambah Artis */}
                <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                        Nama Artis / Musisi *
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Hindia / Noah"
                        className="w-full bg-white border border-outline-variant rounded-lg p-2.5 text-xs outline-none focus:border-primary"
                        value={artistForm.name}
                        onChange={(e) => setArtistForm({ ...artistForm, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                        Peran di Panggung
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Guest Star / Main Act"
                        className="w-full bg-white border border-outline-variant rounded-lg p-2.5 text-xs outline-none focus:border-primary"
                        value={artistForm.description}
                        onChange={(e) => setArtistForm({ ...artistForm, description: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Input Foto Artis (Pilih File) */}
                  <div>
                    <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                      Foto Artis (Pilih File Gambar)
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        id="artist-file-input"
                        className="hidden"
                        onChange={handleArtistFileChange}
                      />
                      <label
                        htmlFor="artist-file-input"
                        className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 min-h-[44px] bg-white border border-primary/40 text-primary hover:bg-primary/5 active:scale-95 rounded-lg text-xs font-semibold transition-all shadow-sm"
                      >
                        <Icon name="photo_camera" className="text-sm" />
                        {artistForm.file ? "Ganti File Foto" : "Pilih File Foto Artis"}
                      </label>

                      {artistForm.file && (
                        <button
                          type="button"
                          onClick={() => setArtistForm({ ...artistForm, file: null, preview: "" })}
                          className="min-h-[44px] px-2 text-xs text-error hover:underline inline-flex items-center gap-1"
                        >
                          <Icon name="close" className="text-sm" />
                          Batal File
                        </button>
                      )}
                    </div>

                    {/* Preview Foto yang Dipilih */}
                    {artistForm.preview && (
                      <div className="mt-2 flex items-center gap-3 p-2 bg-white rounded-lg border border-outline-variant">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-300 relative shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={artistForm.preview}
                            alt="Preview Artis"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-xs overflow-hidden flex-1">
                          <div className="font-semibold text-on-surface truncate">
                            {artistForm.file?.name || artistForm.preview}
                          </div>
                          <div className="text-emerald-700 text-[10px] font-medium">
                            {artistForm.file
                              ? `Siap diupload (${(artistForm.file.size / 1024).toFixed(1)} KB)`
                              : "Foto artis terpilih"}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleAddArtist}
                    className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 active:scale-98 transition-all"
                  >
                    <Icon name="add" className="text-sm" />
                    Tambahkan Artis ke Lineup
                  </button>
                </div>

                {/* List Artis yang Sudah Ditambahkan */}
                {artists.length > 0 ? (
                  <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
                    {artists.map((art, idx) => (
                      <div
                        key={art.id || idx}
                        className="flex items-center justify-between p-2.5 bg-surface-container-low rounded-xl border border-outline-variant"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-900 border-2 border-slate-200 shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={art.preview || getConcertImage(art.image)}
                              alt={art.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-on-surface truncate">
                              {art.name}
                            </div>
                            <div className="text-[11px] text-on-surface-variant truncate">
                              {art.description}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {art.file ? (
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                              Foto Baru
                            </span>
                          ) : (
                            <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full font-medium">
                              Tersimpan
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveArtist(idx)}
                            className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-red-50 rounded-lg transition-all"
                            title="Hapus dari Lineup"
                          >
                            <Icon name="close" className="text-sm" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-2 text-center py-3 bg-surface-container-low rounded-xl border border-dashed border-outline-variant text-[11px] text-on-surface-variant italic">
                    Belum ada artis yang ditambahkan ke lineup konser ini.
                  </div>
                )}
              </div>

              {/* Input Kategori Tiket: Reguler, VIP, Festival */}
              <div className="border-t border-outline-variant pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="confirmation_number" className="text-primary text-base" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface">
                    Input Kategori Tiket (Reguler, VIP, Festival)
                  </h4>
                </div>

                <div className="space-y-3">
                  {/* Reguler */}
                  <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant">
                    <div className="text-xs font-bold text-on-surface mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-blue-700">
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        Tiket Reguler
                      </span>
                      <span className="text-[10px] text-on-surface-variant font-normal">Standard Tribune</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-on-surface-variant mb-1">Harga (Rp)</label>
                        <input
                          type="number"
                          placeholder="Contoh: 350000"
                          className="w-full bg-white border border-outline-variant rounded-lg p-2 text-xs outline-none focus:border-primary"
                          value={tickets.reguler.price}
                          onChange={(e) =>
                            setTickets({
                              ...tickets,
                              reguler: { ...tickets.reguler, price: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-on-surface-variant mb-1">Kuota / Stok</label>
                        <input
                          type="number"
                          placeholder="Contoh: 500"
                          className="w-full bg-white border border-outline-variant rounded-lg p-2 text-xs outline-none focus:border-primary"
                          value={tickets.reguler.stock}
                          onChange={(e) =>
                            setTickets({
                              ...tickets,
                              reguler: { ...tickets.reguler, stock: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* VIP */}
                  <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant">
                    <div className="text-xs font-bold text-on-surface mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-amber-700">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        Tiket VIP
                      </span>
                      <span className="text-[10px] text-on-surface-variant font-normal">Lounge & Best View</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-on-surface-variant mb-1">Harga (Rp)</label>
                        <input
                          type="number"
                          placeholder="Contoh: 1500000"
                          className="w-full bg-white border border-outline-variant rounded-lg p-2 text-xs outline-none focus:border-primary"
                          value={tickets.vip.price}
                          onChange={(e) =>
                            setTickets({
                              ...tickets,
                              vip: { ...tickets.vip, price: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-on-surface-variant mb-1">Kuota / Stok</label>
                        <input
                          type="number"
                          placeholder="Contoh: 100"
                          className="w-full bg-white border border-outline-variant rounded-lg p-2 text-xs outline-none focus:border-primary"
                          value={tickets.vip.stock}
                          onChange={(e) =>
                            setTickets({
                              ...tickets,
                              vip: { ...tickets.vip, stock: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Festival */}
                  <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant">
                    <div className="text-xs font-bold text-on-surface mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-purple-700">
                        <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                        Tiket Festival
                      </span>
                      <span className="text-[10px] text-on-surface-variant font-normal">Standing Area</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-on-surface-variant mb-1">Harga (Rp)</label>
                        <input
                          type="number"
                          placeholder="Contoh: 750000"
                          className="w-full bg-white border border-outline-variant rounded-lg p-2 text-xs outline-none focus:border-primary"
                          value={tickets.festival.price}
                          onChange={(e) =>
                            setTickets({
                              ...tickets,
                              festival: { ...tickets.festival, price: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-on-surface-variant mb-1">Kuota / Stok</label>
                        <input
                          type="number"
                          placeholder="Contoh: 300"
                          className="w-full bg-white border border-outline-variant rounded-lg p-2 text-xs outline-none focus:border-primary"
                          value={tickets.festival.stock}
                          onChange={(e) =>
                            setTickets({
                              ...tickets,
                              festival: { ...tickets.festival, stock: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-highest rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 text-sm bg-primary text-white font-medium rounded-lg hover:opacity-90"
                >
                  {submitting ? "Menyimpan..." : editingEvent ? "Perbarui Event & Tiket" : "Simpan Event & Tiket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
