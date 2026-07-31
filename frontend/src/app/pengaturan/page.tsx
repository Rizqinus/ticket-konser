"use client";

import { useState } from "react";
import Image from "next/image";
import AdminLayout from "@/components/AdminLayout";
import Icon from "@/components/Icon";

const TABS = ["General", "Branding", "Security", "Notifications"];

export default function PengaturanSistemPage() {
  const [activeTab, setActiveTab] = useState("General");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <AdminLayout>
      <div className="mb-2">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">
          System Settings
        </h2>
        <p className="font-body-base text-body-base text-on-surface-variant">
          Configure the global parameters and branding for the ConcertHub
          platform.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Tabs Interface */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="flex border-b border-outline-variant bg-surface-container-low/50">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 font-label-md text-label-md transition-all ${
                  activeTab === tab
                    ? "text-primary font-bold border-b-2 border-primary"
                    : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left Column: Form Settings */}
              <div className="lg:col-span-7 space-y-8">
                <div className="space-y-2">
                  <label
                    className="font-label-md text-label-md text-on-surface flex items-center gap-1"
                    htmlFor="system_name"
                  >
                    System Name
                    <span className="text-error">*</span>
                  </label>
                  <input
                    className="w-full bg-white border border-outline rounded-lg px-4 py-3 text-body-base focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-all"
                    id="system_name"
                    type="text"
                    defaultValue="ConcertHub Management Pro"
                  />
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    The name displayed in the navigation bar and email
                    communications.
                  </p>
                </div>

                <div className="space-y-2">
                  <label
                    className="font-label-md text-label-md text-on-surface"
                    htmlFor="contact_email"
                  >
                    Contact Email
                  </label>
                  <input
                    className="w-full bg-white border border-outline rounded-lg px-4 py-3 text-body-base focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-all"
                    id="contact_email"
                    type="email"
                    defaultValue="admin@concerthub.pro"
                  />
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    The primary support address for ticket buyers and
                    artists.
                  </p>
                </div>

                {/* Maintenance Mode Toggle */}
                <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary">
                      <Icon name="construction" />
                    </div>
                    <div>
                      <h4 className="font-label-md text-label-md text-on-surface">
                        Maintenance Mode
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Temporarily disable public access to the box office.
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      className="sr-only peer"
                      type="checkbox"
                      checked={maintenanceMode}
                      onChange={(e) => setMaintenanceMode(e.target.checked)}
                    />
                    <div className="w-12 h-6 bg-secondary-fixed peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                  </label>
                </div>

                {/* Branding Preview / Upload */}
                <div className="space-y-4">
                  <h3 className="font-headline-md text-headline-md text-on-surface">
                    Brand Identity
                  </h3>
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-xl bg-surface-container flex items-center justify-center border-2 border-dashed border-outline-variant overflow-hidden group-hover:border-primary transition-colors">
                        <div className="relative w-full h-full">
                          <Image
                            className="object-contain p-4"
                            alt="Logo ConcertHub"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsJuONcJCMa-44qbXcJ8oYbt2j0eRqSvKJtyxdahbEhJmuyXMSDreDrtNleViGSIjen5OVHNZRob0yJtRnUJp4X8xdiQsU1IVm1I2dAqJWV2os9I4H4XvRETklA5U4OMODpoF_aFfBSCIm_T-0-7sxuiMKSLZNB3C45anpSpZwUtPXeN6Y2WSaVAQnThWFz8RnCqa947tPsXDo_In89cN9sNY26JAEyLgVle2T73pELgVDUjPPJZgJRmhgbP9c97ZKZLQmL74eQlA"
                            fill
                            sizes="128px"
                          />
                        </div>
                        <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                          <Icon name="upload" className="text-white text-3xl" />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex gap-2">
                        <button className="bg-primary text-white px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-primary-container transition-all active:scale-95 shadow-md">
                          Upload New Logo
                        </button>
                        <button className="border border-outline-variant text-secondary px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-all active:scale-95">
                          Remove
                        </button>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Recommended size: 512x512px. SVG or high-res PNG
                        preferred. Max file size 2MB.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Contextual Card */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-primary-container text-on-primary-container p-6 rounded-2xl shadow-xl relative overflow-hidden">
                  <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                  <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                  <h4 className="font-headline-md text-headline-md mb-4 relative z-10">
                    Quick Status
                  </h4>
                  <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-center py-2 border-b border-white/20">
                      <span className="font-body-base opacity-80">
                        Platform Status
                      </span>
                      <span className="bg-emerald-400/20 text-emerald-100 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>{" "}
                        OPERATIONAL
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/20">
                      <span className="font-body-base opacity-80">
                        Connected Apps
                      </span>
                      <span className="font-bold">14 Active</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="font-body-base opacity-80">
                        Last Backup
                      </span>
                      <span className="font-bold">2h ago</span>
                    </div>
                  </div>
                  <button className="mt-6 w-full bg-white text-primary font-bold py-3 rounded-xl hover:bg-inverse-on-surface transition-all active:scale-[0.98]">
                    Generate Audit Report
                  </button>
                </div>
                <div className="bg-surface-container-high/50 p-6 rounded-2xl border border-outline-variant">
                  <h4 className="font-label-md text-label-md text-on-surface mb-3 flex items-center gap-2">
                    <Icon name="info" className="text-primary" />
                    Important Notice
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Changing the system name or contact email will affect all
                    outgoing automated notifications. Please ensure your
                    legal team has reviewed these updates before saving.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Action Footer */}
          <div className="bg-surface-container-low px-8 py-5 border-t border-outline-variant flex justify-end items-center gap-4">
            <button className="text-secondary font-label-md text-label-md px-6 py-3 rounded-lg hover:bg-surface-container-high transition-all">
              Discard Changes
            </button>
            <button className="bg-primary text-white font-label-md text-label-md px-10 py-3 rounded-lg hover:bg-primary-container shadow-lg shadow-primary-container/30 transition-all active:scale-95 flex items-center gap-2">
              <Icon name="save" className="text-lg" />
              Save Changes
            </button>
          </div>
        </div>

        {/* Additional Help/Footer area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-white border border-outline-variant rounded-xl flex items-start gap-4">
            <Icon
              name="description"
              className="text-primary p-2 bg-primary-fixed rounded-lg"
            />
            <div>
              <h5 className="font-label-md text-label-md">Read the Docs</h5>
              <p className="text-[12px] text-secondary">
                Learn how to customize your workspace.
              </p>
            </div>
          </div>
          <div className="p-4 bg-white border border-outline-variant rounded-xl flex items-start gap-4">
            <Icon
              name="support_agent"
              className="text-tertiary p-2 bg-tertiary-fixed rounded-lg"
            />
            <div>
              <h5 className="font-label-md text-label-md">
                Contact Support
              </h5>
              <p className="text-[12px] text-secondary">
                Speak with a platform specialist.
              </p>
            </div>
          </div>
          <div className="p-4 bg-white border border-outline-variant rounded-xl flex items-start gap-4">
            <Icon
              name="history"
              className="text-secondary p-2 bg-secondary-fixed rounded-lg"
            />
            <div>
              <h5 className="font-label-md text-label-md">Change Log</h5>
              <p className="text-[12px] text-secondary">
                Review recent administrative changes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
