import AdminLayout from "@/components/AdminLayout";
import Icon from "@/components/Icon";

const STAT_CARDS = [
  { icon: "event", label: "Total Event", value: "48", delta: "+12%" },
  {
    icon: "confirmation_number",
    label: "Tiket Terjual",
    value: "12,840",
    delta: "+24%",
  },
  { icon: "payments", label: "Pendapatan", value: "IDR 2.4B", delta: "+8%" },
];

const TRANSACTIONS = [
  {
    id: "#TRX-98231",
    initials: "AS",
    name: "Aris Setiawan",
    event: "Summer Jazz Festival 2024",
    date: "May 24, 2024 14:22",
    tone: "primary" as const,
  },
  {
    id: "#TRX-98240",
    initials: "LM",
    name: "Lina Marlina",
    event: "Rock Revolution Jakarta",
    date: "May 24, 2024 15:45",
    tone: "secondary" as const,
  },
  {
    id: "#TRX-98255",
    initials: "BK",
    name: "Budi Kusuma",
    event: "Orchestra Night Vol. 3",
    date: "May 24, 2024 16:10",
    tone: "primary" as const,
  },
];

export default function DashboardPage() {
  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Dashboard Overview
          </h2>
          <p className="font-body-base text-body-base text-on-surface-variant">
            Real-time performance monitoring for all events.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 flex items-center gap-2 border border-outline-variant rounded-xl font-label-md text-on-surface hover:bg-surface-container-low transition-colors">
            <Icon name="calendar_today" />
            Last 30 Days
          </button>
          <button className="px-4 py-2 flex items-center gap-2 bg-primary text-on-primary rounded-xl font-label-md hover:shadow-md transition-all">
            <Icon name="download" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {STAT_CARDS.map((card) => (
          <div
            key={card.label}
            className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm hover:border-primary hover:-translate-y-0.5 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary-container/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-on-primary transition-all">
                <Icon name={card.icon} />
              </div>
              <span className="text-label-sm font-label-sm text-primary flex items-center bg-primary-fixed px-2 py-1 rounded-full">
                {card.delta}
              </span>
            </div>
            <p className="text-on-surface-variant font-label-md">{card.label}</p>
            <h3 className="text-headline-md font-headline-md text-on-surface">
              {card.value}
            </h3>
          </div>
        ))}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm hover:border-primary hover:-translate-y-0.5 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-tertiary-container text-on-tertiary-container rounded-lg group-hover:bg-tertiary transition-all">
              <Icon name="pending_actions" />
            </div>
            <span className="text-label-sm font-label-sm text-tertiary flex items-center bg-tertiary-fixed px-2 py-1 rounded-full">
              Critical
            </span>
          </div>
          <p className="text-on-surface-variant font-label-md">
            Transaksi Pending
          </p>
          <h3 className="text-headline-md font-headline-md text-on-surface">
            142
          </h3>
        </div>
      </div>

      {/* Sales Trend Chart */}
      <div className="bg-surface-container-lowest p-gutter rounded-xl border border-outline-variant shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h4 className="text-headline-md font-headline-md text-on-surface">
              Ticket Sales Trend
            </h4>
            <p className="text-body-sm font-body-sm text-on-surface-variant">
              Daily conversion performance across all active venues.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-label-sm text-on-surface-variant">
                Current Month
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-outline-variant"></div>
              <span className="text-label-sm text-on-surface-variant">
                Previous Month
              </span>
            </div>
          </div>
        </div>
        <div className="relative h-80 w-full bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/30">
          <div className="absolute inset-x-0 bottom-0 h-[60%] chart-gradient"></div>
          <svg
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
            viewBox="0 0 1000 100"
          >
            <line stroke="#c7c4d8" strokeDasharray="5,5" strokeWidth={0.5} x1={0} x2={1000} y1={20} y2={20} />
            <line stroke="#c7c4d8" strokeDasharray="5,5" strokeWidth={0.5} x1={0} x2={1000} y1={40} y2={40} />
            <line stroke="#c7c4d8" strokeDasharray="5,5" strokeWidth={0.5} x1={0} x2={1000} y1={60} y2={60} />
            <line stroke="#c7c4d8" strokeDasharray="5,5" strokeWidth={0.5} x1={0} x2={1000} y1={80} y2={80} />
            <path d="M0 100 L0 60 Q 150 40, 300 70 T 600 30 T 1000 50 L 1000 100 Z" fill="rgba(53, 37, 205, 0.05)" />
            <path d="M0 60 Q 150 40, 300 70 T 600 30 T 1000 50" fill="none" stroke="#3525cd" strokeLinecap="round" strokeWidth={3} />
            <path d="M0 80 Q 200 60, 400 85 T 800 65 T 1000 75" fill="none" stroke="#c7c4d8" strokeDasharray="4,4" strokeWidth={2} />
            <circle cx={300} cy={70} fill="#3525cd" r={4} />
            <circle cx={600} cy={30} fill="#3525cd" r={4} />
            <circle cx={1000} cy={50} fill="#3525cd" r={4} />
          </svg>
          <div className="absolute bottom-4 left-4 right-4 flex justify-between text-label-sm text-on-surface-variant px-4">
            <span>01 May</span>
            <span>07 May</span>
            <span>14 May</span>
            <span>21 May</span>
            <span>28 May</span>
            <span>31 May</span>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="p-gutter border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
          <div>
            <h4 className="text-headline-md font-headline-md text-on-surface">
              Recent Transactions
            </h4>
            <p className="text-body-sm font-body-sm text-on-surface-variant">
              Manual verification required for pending bank transfers.
            </p>
          </div>
          <a className="text-primary font-label-md hover:underline" href="#">
            View All Transactions
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="px-gutter py-4 text-label-sm font-label-md text-on-surface-variant uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-gutter py-4 text-label-sm font-label-md text-on-surface-variant uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-gutter py-4 text-label-sm font-label-md text-on-surface-variant uppercase tracking-wider">
                  Event
                </th>
                <th className="px-gutter py-4 text-label-sm font-label-md text-on-surface-variant uppercase tracking-wider">
                  Date
                </th>
                <th className="px-gutter py-4 text-label-sm font-label-md text-on-surface-variant uppercase tracking-wider">
                  Status
                </th>
                <th className="px-gutter py-4 text-label-sm font-label-md text-on-surface-variant uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {TRANSACTIONS.map((trx) => (
                <tr
                  key={trx.id}
                  className="hover:bg-surface-container-high transition-colors"
                >
                  <td className="px-gutter py-4 font-body-sm text-on-surface">
                    {trx.id}
                  </td>
                  <td className="px-gutter py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          trx.tone === "primary"
                            ? "bg-primary-fixed text-primary"
                            : "bg-secondary-fixed text-secondary"
                        }`}
                      >
                        {trx.initials}
                      </div>
                      <span className="font-body-sm text-on-surface">
                        {trx.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-gutter py-4 font-body-sm text-on-surface">
                    {trx.event}
                  </td>
                  <td className="px-gutter py-4 font-body-sm text-on-surface">
                    {trx.date}
                  </td>
                  <td className="px-gutter py-4">
                    <span className="px-3 py-1 bg-tertiary-fixed text-tertiary text-label-sm rounded-full font-semibold">
                      Pending
                    </span>
                  </td>
                  <td className="px-gutter py-4 text-right">
                    <button className="px-4 py-1.5 bg-primary text-on-primary rounded-lg text-label-sm font-label-md hover:bg-on-primary-fixed-variant transition-colors">
                      Verify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
