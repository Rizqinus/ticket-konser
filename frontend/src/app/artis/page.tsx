"use client";

import { useState } from "react";
import Image from "next/image";
import AdminLayout from "@/components/AdminLayout";
import Icon from "@/components/Icon";

const ARTISTS = [
  {
    name: "The Indigo Waves",
    bio: "Pemenang penghargaan band indie-pop terbaik tahun 2023 dengan jutaan pendengar bulanan di platform streaming digital seluruh dunia.",
    photo:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCXaWZ7YRMMpEqO6qusL8s2iasD7ydXsBcq4x1PALNN9GLKYuADFU3xF_RqEVft-5Th6fjTvl2e6WH0rkf6qoWanDDVmLbCWf5F7-ZwNwwJdukx1Tz7KF1JfhPlF8La_KYy15B8DU27bJcW4vFcH4s0yQd7LUnaLdnkvTixhb3Z5ebJw7Noeb0vB6ZoUe2mIKMJTDlS1kHeSNslEmX6d4QTiCZqCm9Bs3YefAO-VAo3PcGL5wMwX4ryR6r2uFmOKwrmW6mhLfCxsVc",
  },
  {
    name: "DJ Quartz",
    bio: "Pelopor musik tekno-elektronik dengan aransemen orkestra yang telah tampil di lebih dari 20 negara di Benua Asia dan Eropa.",
    photo:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAU4LJO0hrrb74D_AaFIyGdbOMEwYG-mYwMwiqhtjN8C8qiVGnkCCmZK43I2jbOQM1NoNjOApxYojlc2x0j1F6RxrtjoELV5Gz1LiXAOriKl7sORNl1D9a33JPwOKFPDPLvFenxzj6VEDjZbWToFVkaIiDiAk65FCUnpfdOn4W-_rqch-wF4qnSuN30cNP74CTWFLPtz5EiacfFJDh0AQuHhBNgTwwOWpDhCk3zsi8d9J1iqSZkZqydk2UROxbulrwWqsNy3AXCWCE",
  },
  {
    name: "Luna Seraphina",
    bio: "Vokalis jazz kontemporer yang dikenal dengan teknik vokalnya yang luar biasa dan interpretasi lagu-lagu klasik yang sangat unik.",
    photo:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuACOSGKY5mjXOysfnpouXfVeDGwrbzA0Bj0T-zAN0PybId99GCuR2soLA-H71sAMIkFRP_P5sCWfxvp4d7fYt0TFxyawqWo2DFa_xZALqIRFNGl_ykKJN33OBzaS9znZcLM6A5BgBj46_gFi3zV5vrasBHb1lto8u5NN_XXuRxH66QyWB9r3-CBHoqANpTXTMhBLWp3kAHqAhpdpCRbq6aEmyq5AGEpmcP80V5kYhQn1ueQjMhCdoYuxXRZnVCbmGTa4DHJZhZvVN4",
  },
];

export default function KelolaArtisPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Kelola Artis
          </h2>
          <p className="font-body-base text-body-base text-on-surface-variant">
            Manajemen line-up artis untuk seluruh festival dan konser.
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-label-md hover:opacity-90 transition-all shadow-sm active:scale-95"
          onClick={() => setModalOpen(true)}
        >
          <Icon name="add" />
          Add Artist
        </button>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="px-6 py-4 font-label-md text-on-surface-variant uppercase tracking-wider">
                Photo
              </th>
              <th className="px-6 py-4 font-label-md text-on-surface-variant uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 font-label-md text-on-surface-variant uppercase tracking-wider">
                Bio
              </th>
              <th className="px-6 py-4 font-label-md text-on-surface-variant uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {ARTISTS.map((artist) => (
              <tr
                key={artist.name}
                className="hover:bg-surface-container-low transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-outline-variant relative">
                    <Image
                      className="object-cover"
                      src={artist.photo}
                      alt={artist.name}
                      fill
                      sizes="48px"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 font-label-md text-on-surface">
                  {artist.name}
                </td>
                <td className="px-6 py-4 font-body-sm text-on-surface-variant max-w-md">
                  <p className="line-clamp-2">{artist.bio}</p>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary-fixed rounded-lg transition-all">
                      <Icon name="edit" className="text-[20px]" />
                    </button>
                    <button className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container rounded-lg transition-all">
                      <Icon name="delete" className="text-[20px]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-4 border-t border-outline-variant flex items-center justify-between bg-surface-container-lowest">
          <p className="text-body-sm text-on-surface-variant">
            Showing {ARTISTS.length} of 12 artists
          </p>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 border border-outline-variant rounded-lg text-body-sm hover:bg-surface-container-high transition-colors disabled:opacity-50"
              disabled
            >
              Previous
            </button>
            <button className="px-3 py-1 border border-outline-variant bg-primary-container text-on-primary-container rounded-lg text-body-sm">
              1
            </button>
            <button className="px-3 py-1 border border-outline-variant rounded-lg text-body-sm hover:bg-surface-container-high transition-colors">
              2
            </button>
            <button className="px-3 py-1 border border-outline-variant rounded-lg text-body-sm hover:bg-surface-container-high transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-on-background/40 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative bg-surface-container-lowest w-full max-w-[600px] rounded-3xl shadow-2xl overflow-hidden border border-outline-variant">
            <div className="px-gutter pt-gutter">
              <h3 className="font-headline-md text-headline-md text-on-surface">
                Add Artist
              </h3>
            </div>
            <form className="p-gutter space-y-6">
              <div className="space-y-2">
                <label className="font-label-md text-on-surface">
                  Artist Name
                </label>
                <input
                  className="w-full bg-surface-container-lowest border border-outline px-4 py-3 rounded-xl font-body-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="e.g. The Indigo Waves"
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-md text-on-surface">
                  Artist Photo
                </label>
                <div className="border border-dashed border-outline-variant rounded-xl p-6 flex flex-col items-center justify-center gap-2 text-on-surface-variant">
                  <Icon name="upload" />
                  <span className="text-body-sm">
                    Click or drag a photo to upload
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-label-md text-on-surface">
                  Biography
                </label>
                <textarea
                  className="w-full bg-surface-container-lowest border border-outline px-4 py-3 rounded-xl font-body-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                  placeholder="Write a short biography about the artist..."
                  rows={4}
                />
              </div>
            </form>
            <div className="px-gutter py-6 border-t border-outline-variant flex items-center justify-end gap-3 bg-surface-container-low">
              <button
                className="px-6 py-2.5 font-label-md text-on-surface-variant hover:bg-surface-container-highest rounded-xl transition-all"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button className="px-8 py-2.5 bg-primary text-on-primary font-label-md rounded-xl hover:opacity-90 transition-all shadow-sm active:scale-95">
                Save Artist
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
