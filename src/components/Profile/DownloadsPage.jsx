import { motion } from "framer-motion";
import c from "./ListCards.module.css";
import { Stagger, EmptyState, PageHeader } from "./widgets/DashboardWidgets";

const FILE_ICON = { pdf: "ti-file-type-pdf", video: "ti-video", audio: "ti-music", guide: "ti-file-text" };

export default function DownloadsPage({ student }) {
  const files = student?.downloads ?? [];

  return (
    <>
      <PageHeader title="Downloads" />

      {files.length === 0 ? (
        <EmptyState icon="ti-folder-open" title="No downloads available yet." />
      ) : (
        <Stagger className={c.grid}>
          {files.map((f, i) => (
            <motion.div
              key={i}
              className={c.resCard}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 26 }}
              whileHover={{ y: -4 }}
            >
              <span className={c.resIcon} data-type={f.type}>
                <i className={`ti ${FILE_ICON[f.type] ?? "ti-file"}`} aria-hidden="true" />
              </span>
              <div className={c.resBody}>
                <div className={c.resName}>{f.name}</div>
                <div className={c.resMeta}>{f.type?.toUpperCase()} · {f.size}</div>
              </div>
              <a href={f.url ?? "#"} download target="_blank" rel="noreferrer">
                <button className={c.iconBtn} aria-label={`Download ${f.name}`}>
                  <i className="ti ti-download" aria-hidden="true" />
                </button>
              </a>
            </motion.div>
          ))}
        </Stagger>
      )}
    </>
  );
}
