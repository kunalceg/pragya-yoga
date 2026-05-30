import { useState } from "react";
import s from "./Dashboard.shared.module.css";

export default function PaymentsPage({ student }) {
  const [tab, setTab] = useState("history");
  const payments = student?.payments ?? [];

  return (
    <div>
      <p className={s.pageTitle}>Payments</p>
      <div className={s.tabs}>
        <button className={`${s.tab} ${tab === "history" ? s.tabActive : ""}`} onClick={() => setTab("history")}>History</button>
        <button className={`${s.tab} ${tab === "invoices" ? s.tabActive : ""}`} onClick={() => setTab("invoices")}>Invoices</button>
      </div>

      {tab === "history" && (
        <div className={s.card}>
          {payments.length === 0 && (
            <div className={s.emptyState}><i className="ti ti-receipt" aria-hidden="true" />No payments yet.</div>
          )}
          {payments.map((p, i) => (
            <div className={s.row} key={i}>
              <span className={s.rowLabel}>{p.label}</span>
              <span className={s.rowVal}>₹{p.amount?.toLocaleString("en-IN")}</span>
              <span className={`${s.badge} ${p.status === "paid" ? s.badgeGreen : s.badgeAmber}`} style={{ marginLeft:"8px" }}>
                {p.status === "paid" ? "Paid" : "Pending"}
              </span>
              {p.receiptUrl && (
                <a href={p.receiptUrl} target="_blank" rel="noreferrer">
                  <button className={s.btnSm} style={{ marginLeft:"8px" }} aria-label={`Download receipt for ${p.label}`}>
                    <i className="ti ti-download" aria-hidden="true" />
                  </button>
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "invoices" && (
        <div className={s.emptyState}>
          <i className="ti ti-file-invoice" aria-hidden="true" />
          Invoices are auto-generated after each payment.<br />
          Click the download icon next to any payment to save it.
        </div>
      )}
    </div>
  );
}
