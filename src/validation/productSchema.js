import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(3, "Nama minimal 3 karakter"),

  description: z
    .string()
    .min(10, "Deskripsi minimal 10 karakter"),

  price: z
    .number({
      required_error: "Harga wajib diisi",
    })
    .positive("Harga harus lebih dari 0"),

  stock: z
    .number({
      required_error: "Stok wajib diisi",
    })
    .min(0),

  category: z
    .string()
    .min(1, "Kategori wajib dipilih"),
});
