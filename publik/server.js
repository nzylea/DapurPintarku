
const express = require("express");
const multer = require("multer");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("publik"));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      return callback(new Error("File harus berupa gambar."));
    }
    callback(null, true);
  }
});

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "DapurPintarku backend aktif."
  });
});

app.post("/api/recommend", upload.single("image"), async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "API key belum diatur di hosting."
      });
    }

    const ingredients = req.body.ingredients || "";

    if (!ingredients.trim() && !req.file) {
      return res.status(400).json({
        error: "Masukkan bahan makanan atau unggah foto."
      });
    }

    const content = [];

    content.push({
      type: "input_text",
      text: `
Kamu adalah asisten memasak bernama DapurPintarku.

Tugas:
1. Kenali bahan makanan pada foto jika tersedia.
2. Gabungkan dengan bahan yang ditulis pengguna.
3. Buat 4 rekomendasi resep yang masuk akal.
4. Gunakan bahasa Indonesia.
5. Jangan mengarang bahan yang tidak diketahui.
6. Jelaskan bahan, jumlah, waktu, kesulitan, dan langkah memasak.

Bahan yang ditulis pengguna:
${ingredients || "Tidak ada bahan tertulis."}

Balas HANYA dengan JSON valid menggunakan format:
{
  "detectedIngredients": ["telur", "wortel"],
  "recipes": [
    {
      "name": "Nama resep",
      "description": "Deskripsi singkat",
      "ingredients": [
        "2 butir telur",
        "1 buah wortel"
      ],
      "time": "20 menit",
      "difficulty": "Mudah",
      "steps": [
        "Langkah pertama",
        "Langkah kedua"
      ]
    }
  ]
}
`
    });

    if (req.file) {
      const base64 = req.file.buffer.toString("base64");
      const imageUrl =
        `data:${req.file.mimetype};base64,${base64}`;

      content.push({
        type: "input_image",
        image_url: imageUrl,
        detail: "auto"
      });
    }

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-6.2-astra",
      input: [
        {
          role: "user",
          content
        }
      ]
    });

    const answer = response.output_text;

    if (!answer) {
      throw new Error("AI tidak memberikan jawaban.");
    }

    const cleaned = answer
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    const result = JSON.parse(cleaned);

    if (!Array.isArray(result.recipes)) {
      throw new Error("Format resep dari AI tidak valid.");
    }

    res.json({
      success: true,
      detectedIngredients: result.detectedIngredients || [],
      recipes: result.recipes
    });

  } catch (error) {
    console.error("Kesalahan:", error.message);

    res.status(500).json({
      error: "Maaf, rekomendasi belum berhasil dibuat. Silakan coba lagi."
    });
  }
});

app.listen(PORT, () => {
  console.log(`DapurPintarku berjalan pada port ${PORT}`);
});
