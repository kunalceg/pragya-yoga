import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_DIR = path.resolve(__dirname, '..', 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const CATEGORY_DIRS = ['pdf', 'video', 'audio', 'guide', 'worksheet', 'meditation', 'document', 'other'];
for (const dir of CATEGORY_DIRS) {
  const p = path.join(UPLOAD_DIR, dir);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    let sub = 'other';
    if (ext === '.pdf') sub = 'pdf';
    else if (['.mp4', '.webm', '.mov', '.avi', '.mkv'].includes(ext)) sub = 'video';
    else if (['.mp3', '.wav', '.ogg', '.aac', '.flac'].includes(ext)) sub = 'audio';
    else if (['.doc', '.docx', '.txt', '.csv', '.xlsx'].includes(ext)) sub = 'document';
    else if (['.jpg', '.jpeg', '.png', '.gif', '.svg'].includes(ext)) sub = 'guide';
    cb(null, path.join(UPLOAD_DIR, sub));
  },
  filename(req, file, cb) {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    '.pdf', '.doc', '.docx', '.txt', '.csv', '.xlsx',
    '.mp4', '.webm', '.mov', '.avi', '.mkv',
    '.mp3', '.wav', '.ogg', '.aac', '.flac',
    '.jpg', '.jpeg', '.png', '.gif', '.svg',
    '.zip', '.rar',
  ];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) return cb(null, true);
  cb(new Error(`File type ${ext} is not allowed`));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 },
});

export default upload;
