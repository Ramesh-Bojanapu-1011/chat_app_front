import multer from 'multer';

const upload = multer({ dest: 'public/uploads/' });

export const config = {
  api: {
    bodyParser: false, // Required for multer
  },
};

export default function handler(req: any, res: any) {
  return new Promise<void>((resolve, reject) => {
    upload.single('file')(req as any, res as any, async (err) => {
      if (err) {
        console.error('Upload error:', err);
        return res.status(500).json({ error: 'File upload failed' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const filePath = `/uploads/${req.file.filename}`;
      res.status(200).json({ fileUrl: filePath });

      resolve();
    });
  });
}
