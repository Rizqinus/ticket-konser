import Image from "next/image";
import AdminLayout from "@/components/AdminLayout";
import Icon from "@/components/Icon";

const EVENTS = [
  {
    title: "Midnight Echoes Tour",
    artist: "Luna Vibe",
    date: "Oct 24, 2024",
    time: "20:00 WIB",
    venue: "Istora Senayan",
    city: "Jakarta, ID",
    status: "Open",
    salesOn: true,
    poster:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAW5imVWV7HZoue2Bd6oa1At7REztlQcRg6jzD5fEzjoVN8s18kCeSOSGFfTgTx6v2JauRITcXQ1T_M5gYzJB0SYfYD_SoHTykd4yTnrT6xGJAjgOR4F0Y5EFD4KuJg1tkaFxDS9y_4dntaJc-5lWMqlTGY2bcknXEmTJD9trWQ19lLBmLVNdj9izO6moQbWbNdjoYPHS-P20QnCvRWeJI84PI1ACswV205GsDCEqSfuNAhDprkrKwCowEhgVDDZ7uF-IC6DzME3SU",
  },
  {
    title: "Strings & Serenity",
    artist: "Jakarta Phil.",
    date: "Nov 02, 2024",
    time: "19:00 WIB",
    venue: "TIM Park",
    city: "Jakarta, ID",
    status: "Open",
    salesOn: true,
    poster:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA2xLM6pffiCWhiFbb4mquHmObUPDCWj98oxkO6Fo5_kivviEziD-cUc1-wXl9oI8aqQaW53KdMNDJ-qtf_zdhGWSjSpxC3xN2Xb4UKXMEfmgqJiTqqipIDbjHnWxW554AQq4QM5FEYHFVlK_vkIJvdtXemgaArAjkKOCD3w8ElScKXjMYKxHDGL98F35zeoLEvLotPzd2F2W9d53SMmLnk0o23cpRchEvRi9MqY9mZ74xTGYx1m1dnRC8uM3qiauJHN7UMxnBdnwQ",
  },
  {
    title: "Ignition Rock Festival",
    artist: "Various",
    date: "Dec 15, 2024",
    time: "15:00 WIB",
    venue: "ICE BSD",
    city: "Tangerang, ID",
    status: "Closed",
    salesOn: false,
    poster:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAWkTydyB1xSy1JQcIVD0m4Vd_eDeEuj4k0Qz571KrO0wmTl3uexZYBgzOhrrhqCEibEU5nxWPinWt9aDCECb_DTyUnoJBwtPv5a9dsTwWKUAvlCJXXSPeXSFJvL3f_tiQYnQ8Wd0hTuYGgHHW854HC9YYbnrRxZ5Y2_E-auAg197CR5EEmWsAl5j07z_-VjJMdExBoyioXOg8EHTxAhrAvKzXAOTzLfnmlwYL040rDNpSynDeQJUDWe9_OVEYlRdXU9RzJGfKZGak",
  },
  {
    title: "Dreamscape Pop",
    artist: "Zara Bloom",
    date: "Jan 10, 2025",
    time: "19:30 WIB",
    venue: "Beach City Stadium",
    city: "Jakarta, ID",
    status: "Open",
    salesOn: true,
    poster:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCeOpPoEWJJ0txkYQhIPaSP6Nw0WlQrBTg51z75oDaYwCrfMC_mmwLGm1D0K2_8YHIlr5rQv_F-IzNWLnQ96TjDUFvfRi-qSKR6Ph5UkzKLxhxFdAkORtr2iKRkgsji6Bke5UU3cs__Zhw1tpIQQ4-JzVMRKiYka9Hu6yFUwkQy6Whzk-fPwR509Lrc0wUQQlP3qeOULQgr7FpTSuVupeCIE-E0r1WThI-WwUXAm63uY1SDxnJtqhMmWZW02R-Jz4ckLCFhq6iVKlY",
  },
];

export default function KelolaEventPage() {
  return (
    <AdminLayout>
      <div className="mb-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Kelola Event
          </h2>
          <p className="font-body-base text-body-base text-on-surface-variant">
            Manage your concert schedules, ticket sales, and event status.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-label-md shadow-sm hover:opacity-90 active:scale-95 transition-all">
          <Icon name="add" className="text-sm" />
          Create New Event
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="font-label-md text-on-surface">Status:</span>
          <select className="bg-surface-container-low border border-outline-variant rounded-lg px-3 py-1 text-body-sm outline-none focus:border-primary transition-colors">
            <option>All Events</option>
            <option>Open</option>
            <option>Closed</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-label-md text-on-surface">Sort by:</span>
          <select className="bg-surface-container-low border border-outline-variant rounded-lg px-3 py-1 text-body-sm outline-none focus:border-primary transition-colors">
            <option>Newest First</option>
            <option>Oldest First</option>
            <option>Alphabetical</option>
          </select>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <p className="text-body-sm text-on-surface-variant">
            Showing {EVENTS.length} Events
          </p>
        </div>
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
                  Event Title
                </th>
                <th className="px-6 py-4 text-left font-label-md text-on-surface-variant uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left font-label-md text-on-surface-variant uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-left font-label-md text-on-surface-variant uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left font-label-md text-on-surface-variant uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-6 py-4 text-right font-label-md text-on-surface-variant uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {EVENTS.map((event) => (
                <tr
                  key={event.title}
                  className="hover:bg-surface-container-low/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="w-12 h-16 rounded-lg overflow-hidden bg-surface-container shadow-sm relative">
                      <Image
                        className="object-cover"
                        src={event.poster}
                        alt={event.title}
                        fill
                        sizes="48px"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-label-md text-on-surface">
                      {event.title}
                    </div>
                    <div className="text-xs text-on-surface-variant">
                      Artis: {event.artist}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-body-sm text-on-surface">
                      {event.date}
                    </div>
                    <div className="text-xs text-on-surface-variant">
                      {event.time}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-body-sm text-on-surface">
                      {event.venue}
                    </div>
                    <div className="text-xs text-on-surface-variant">
                      {event.city}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        event.status === "Open"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-secondary-container text-on-secondary-container"
                      }`}
                    >
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        defaultChecked={event.salesOn}
                        className="sr-only peer"
                        type="checkbox"
                      />
                      <div className="w-11 h-6 bg-secondary-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
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
        </div>
        <div className="px-6 py-4 bg-surface-container-low border-t border-outline-variant flex items-center justify-between">
          <span className="text-body-sm text-on-surface-variant">
            Showing 1 to {EVENTS.length} of {EVENTS.length} entries
          </span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 border border-outline-variant rounded-lg text-body-sm text-on-surface-variant hover:bg-surface-container-highest transition-colors disabled:opacity-50"
              disabled
            >
              Previous
            </button>
            <button className="px-3 py-1 bg-primary text-on-primary rounded-lg text-body-sm">
              1
            </button>
            <button className="px-3 py-1 border border-outline-variant rounded-lg text-body-sm text-on-surface-variant hover:bg-surface-container-highest transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
