import { BilingualWasteKnowledge } from "@/types/waste";

/**
 * The local knowledge base of waste items.
 * Contains detailed educational and recycling information for various materials,
 * supporting both English and Indonesian translations.
 */
export const wasteKnowledgeDB: BilingualWasteKnowledge[] = [
  {
    id: "plastic-pet",
    nameEn: "Plastic PET (Type 1)",
    nameId: "Plastik PET (Tipe 1)",
    categoryEn: "Plastic",
    categoryId: "Plastik",
    descriptionEn: "Polyethylene terephthalate (PET) is highly recyclable and commonly used for water bottles, soft drinks, and food packaging.",
    descriptionId: "Polietilena tereftalat (PET) sangat mudah didaur ulang dan biasanya digunakan untuk botol air, minuman ringan, dan wadah makanan.",
    recyclable: true,
    recyclingBinEn: "Yellow Bin / Plastics",
    recyclingBinId: "Tempat Sampah Kuning / Plastik",
    estimatedDecompositionEn: "450 years",
    estimatedDecompositionId: "450 tahun",
    environmentalImpactEn: "If not recycled, PET plastics break down into microplastics that pollute oceans and enter the food chain.",
    environmentalImpactId: "Jika tidak didaur ulang, plastik PET terurai menjadi mikroplastik yang mencemari lautan dan masuk ke dalam rantai makanan.",
    recommendationsEn: [
      "Empty all liquids.",
      "Crush the bottle to save space.",
      "Leave the cap on, as modern recycling facilities can process them."
    ],
    recommendationsId: [
      "Kosongkan semua cairan.",
      "Remas botol untuk menghemat tempat.",
      "Biarkan tutupnya terpasang, karena fasilitas daur ulang modern dapat memprosesnya."
    ],
    difficultyEn: "Easy",
    difficultyId: "Mudah",
    confidenceNoteEn: "Easily identifiable due to clarity and common shapes (e.g., water bottles).",
    confidenceNoteId: "Mudah diidentifikasi karena kejernihan dan bentuknya yang umum (seperti botol air)."
  },
  {
    id: "plastic-hdpe",
    nameEn: "HDPE (Type 2)",
    nameId: "HDPE (Tipe 2)",
    categoryEn: "Plastic",
    categoryId: "Plastik",
    descriptionEn: "High-density polyethylene is a durable plastic used for milk jugs, shampoo bottles, and cleaning product containers.",
    descriptionId: "Polietilena densitas tinggi adalah plastik tahan lama yang digunakan untuk wadah susu, botol sampo, dan wadah produk pembersih.",
    recyclable: true,
    recyclingBinEn: "Yellow Bin / Plastics",
    recyclingBinId: "Tempat Sampah Kuning / Plastik",
    estimatedDecompositionEn: "100+ years",
    estimatedDecompositionId: "100+ tahun",
    environmentalImpactEn: "HDPE is highly sought after by recyclers and saves significant energy compared to producing new plastic.",
    environmentalImpactId: "HDPE sangat diminati oleh pendaur ulang dan menghemat energi secara signifikan dibandingkan dengan memproduksi plastik baru.",
    recommendationsEn: [
      "Rinse out any residual liquids.",
      "Labels can usually be left on."
    ],
    recommendationsId: [
      "Bilas semua sisa cairan.",
      "Label biasanya bisa dibiarkan menempel."
    ],
    difficultyEn: "Easy",
    difficultyId: "Mudah",
    confidenceNoteEn: "Usually opaque or solid-colored thick plastics.",
    confidenceNoteId: "Biasanya berupa plastik tebal yang buram atau berwarna solid."
  },
  {
    id: "paper",
    nameEn: "Paper",
    nameId: "Kertas",
    categoryEn: "Paper",
    categoryId: "Kertas",
    descriptionEn: "Standard paper includes office paper, newspapers, and magazines. It is highly recyclable.",
    descriptionId: "Kertas standar mencakup kertas kantor, koran, dan majalah. Kertas sangat mudah didaur ulang.",
    recyclable: true,
    recyclingBinEn: "Blue Bin / Paper",
    recyclingBinId: "Tempat Sampah Biru / Kertas",
    estimatedDecompositionEn: "2-6 weeks",
    estimatedDecompositionId: "2-6 minggu",
    environmentalImpactEn: "Recycling 1 ton of paper saves 17 trees, 7,000 gallons of water, and 4,000 kilowatts of energy.",
    environmentalImpactId: "Mendaur ulang 1 ton kertas menghemat 17 pohon, 7.000 galon air, dan 4.000 kilowatt energi.",
    recommendationsEn: [
      "Keep it dry and clean.",
      "Remove staples if possible, though large facilities can handle them.",
      "Do not recycle paper stained with food or grease."
    ],
    recommendationsId: [
      "Jaga agar tetap kering dan bersih.",
      "Lepaskan staples jika memungkinkan, meskipun fasilitas besar dapat menanganinya.",
      "Jangan mendaur ulang kertas yang terkena noda makanan atau minyak."
    ],
    difficultyEn: "Easy",
    difficultyId: "Mudah",
    confidenceNoteEn: "AI might confuse heavily crumpled paper with organic waste. Verify if it's clean paper.",
    confidenceNoteId: "AI mungkin mengira kertas yang sangat kusut sebagai sampah organik. Pastikan kertas tersebut bersih."
  },
  {
    id: "cardboard",
    nameEn: "Cardboard",
    nameId: "Kardus",
    categoryEn: "Paper",
    categoryId: "Kertas",
    descriptionEn: "Corrugated cardboard used for shipping boxes and packaging.",
    descriptionId: "Kardus bergelombang yang digunakan untuk kotak pengiriman dan pengemasan.",
    recyclable: true,
    recyclingBinEn: "Blue Bin / Paper",
    recyclingBinId: "Tempat Sampah Biru / Kertas",
    estimatedDecompositionEn: "2 months",
    estimatedDecompositionId: "2 bulan",
    environmentalImpactEn: "Reduces deforestation and saves significant water in the manufacturing process.",
    environmentalImpactId: "Mengurangi penggundulan hutan dan menghemat air secara signifikan dalam proses manufaktur.",
    recommendationsEn: [
      "Flatten the boxes to save space in the bin.",
      "Remove plastic tape or labels if possible.",
      "Greasy pizza boxes belong in the compost or regular trash, not recycling."
    ],
    recommendationsId: [
      "Lipat atau ratakan kardus untuk menghemat tempat di tempat sampah.",
      "Lepaskan lakban plastik atau label jika memungkinkan.",
      "Kotak pizza berminyak termasuk dalam kompos atau tempat sampah umum, bukan daur ulang."
    ],
    difficultyEn: "Easy",
    difficultyId: "Mudah",
    confidenceNoteEn: "Easily identified. Watch out for food contamination.",
    confidenceNoteId: "Mudah diidentifikasi. Hati-hati terhadap kontaminasi makanan."
  },
  {
    id: "glass",
    nameEn: "Glass",
    nameId: "Kaca",
    categoryEn: "Glass",
    categoryId: "Kaca",
    descriptionEn: "Glass bottles and jars can be recycled endlessly without loss in quality or purity.",
    descriptionId: "Botol dan toples kaca dapat didaur ulang tanpa batas waktu tanpa penurunan kualitas atau kemurnian.",
    recyclable: true,
    recyclingBinEn: "Green Bin / Glass",
    recyclingBinId: "Tempat Sampah Hijau / Kaca",
    estimatedDecompositionEn: "1 million years",
    estimatedDecompositionId: "1 juta tahun",
    environmentalImpactEn: "Recycling glass reduces related air pollution by 20% and water pollution by 50%.",
    environmentalImpactId: "Mendaur ulang kaca mengurangi polusi udara terkait sebesar 20% dan polusi air sebesar 50%.",
    recommendationsEn: [
      "Rinse lightly.",
      "Remove metal or plastic caps and recycle them separately.",
      "Broken glass (like windows or mirrors) often cannot be recycled with standard container glass."
    ],
    recommendationsId: [
      "Bilas dengan air bersih mengalir secara ringan.",
      "Lepaskan tutup logam atau plastik dan daur ulang secara terpisah.",
      "Pecahan kaca (seperti jendela atau cermin) sering kali tidak dapat didaur ulang bersama dengan wadah kaca standar."
    ],
    difficultyEn: "Medium",
    difficultyId: "Sedang",
    confidenceNoteEn: "Transparent materials can sometimes challenge AI models due to reflections.",
    confidenceNoteId: "Bahan transparan terkadang menantang model AI karena adanya pantulan cahaya."
  },
  {
    id: "metal-can",
    nameEn: "Metal Can",
    nameId: "Kaleng Logam",
    categoryEn: "Metal",
    categoryId: "Logam",
    descriptionEn: "Aluminum and steel/tin cans are among the most valuable and easy-to-recycle materials.",
    descriptionId: "Kaleng aluminium dan baja/timah termasuk bahan yang paling berharga dan mudah didaur ulang.",
    recyclable: true,
    recyclingBinEn: "Yellow Bin / Metals",
    recyclingBinId: "Tempat Sampah Kuning / Logam",
    estimatedDecompositionEn: "50-200 years",
    estimatedDecompositionId: "50-200 tahun",
    environmentalImpactEn: "Recycling one aluminum can saves enough energy to run a TV for 3 hours. It uses 95% less energy than producing new aluminum.",
    environmentalImpactId: "Mendaur ulang satu kaleng aluminium menghemat energi yang cukup untuk menyalakan TV selama 3 jam. Ini menggunakan 95% lebih sedikit energi daripada memproduksi aluminium baru.",
    recommendationsEn: [
      "Empty and rinse.",
      "Crushing is optional but helps save space.",
      "Leave the pop tab attached."
    ],
    recommendationsId: [
      "Kosongkan dan bilas.",
      "Meremaskannya opsional tetapi membantu menghemat tempat.",
      "Biarkan cincin pembuka kaleng tetap menempel."
    ],
    difficultyEn: "Easy",
    difficultyId: "Mudah",
    confidenceNoteEn: "High confidence. Metal reflections are distinct.",
    confidenceNoteId: "Tingkat keyakinan tinggi. Pantulan logam sangat khas."
  },
  {
    id: "organic-waste",
    nameEn: "Organic Waste",
    nameId: "Sampah Organik",
    categoryEn: "Organic",
    categoryId: "Organik",
    descriptionEn: "Food scraps, yard waste, and other biodegradable materials.",
    descriptionId: "Sisa makanan, sampah halaman, dan bahan biodegradable lainnya.",
    recyclable: true,
    recyclingBinEn: "Brown Bin / Compost",
    recyclingBinId: "Tempat Sampah Cokelat / Kompos",
    estimatedDecompositionEn: "2 weeks - 6 months",
    estimatedDecompositionId: "2 minggu - 6 bulan",
    environmentalImpactEn: "Organic waste in landfills produces methane, a potent greenhouse gas. Composting turns it into nutrient-rich soil.",
    environmentalImpactId: "Sampah organik di tempat pembuangan akhir menghasilkan metana, gas rumah kaca yang kuat. Pengomposan mengubahnya menjadi tanah yang kaya nutrisi.",
    recommendationsEn: [
      "Use for home composting or place in municipal organics bin.",
      "Do not include plastic bags or non-biodegradable stickers."
    ],
    recommendationsId: [
      "Gunakan untuk pembuatan kompos rumah tangga atau tempatkan di tempat sampah organik kota.",
      "Jangan sertakan kantong plastik atau stiker non-biodegradable."
    ],
    difficultyEn: "Medium",
    difficultyId: "Sedang",
    confidenceNoteEn: "Vast variety of shapes and colors. Verification is important.",
    confidenceNoteId: "Keragaman bentuk dan warna yang sangat banyak. Verifikasi sangatlah penting."
  },
  {
    id: "battery",
    nameEn: "Battery",
    nameId: "Baterai",
    categoryEn: "Hazardous",
    categoryId: "Berbahaya",
    descriptionEn: "Alkaline, lithium-ion, and other types of batteries contain toxic heavy metals.",
    descriptionId: "Baterai alkalin, lithium-ion, dan jenis baterai lainnya mengandung logam berat beracun.",
    recyclable: true,
    recyclingBinEn: "Specialized E-Waste / Battery Drop-off",
    recyclingBinId: "Tempat Penampungan Khusus E-Waste / Baterai",
    estimatedDecompositionEn: "100+ years",
    estimatedDecompositionId: "100+ tahun",
    environmentalImpactEn: "If landfilled, heavy metals like lead and cadmium can leach into soil and groundwater.",
    environmentalImpactId: "Jika dibuang di tempat pembuangan sampah biasa, logam berat seperti timbal dan kadmium dapat merembes ke dalam tanah dan air tanah.",
    recommendationsEn: [
      "Do NOT put in standard recycling or trash bins.",
      "Tape the ends of lithium batteries to prevent fires.",
      "Take to designated collection points or retail stores."
    ],
    recommendationsId: [
      "Jangan masukkan ke dalam tempat sampah atau daur ulang standar.",
      "Tempelkan selotip pada ujung baterai litium untuk mencegah kebakaran.",
      "Bawa ke titik pengumpulan atau toko ritel khusus yang ditunjuk."
    ],
    difficultyEn: "Specialized",
    difficultyId: "Khusus",
    confidenceNoteEn: "Small objects. May require close-up scan for correct identification.",
    confidenceNoteId: "Objek kecil. Mungkin memerlukan pemindaian jarak dekat untuk identifikasi yang benar."
  },
  {
    id: "electronic-waste",
    nameEn: "Electronic Waste",
    nameId: "Sampah Elektronik",
    categoryEn: "E-Waste",
    categoryId: "Sampah Elektronik",
    descriptionEn: "Phones, computers, cables, and appliances containing valuable metals but also hazardous materials.",
    descriptionId: "Telepon genggam, komputer, kabel, dan peralatan rumah tangga yang mengandung logam berharga tetapi juga bahan berbahaya.",
    recyclable: true,
    recyclingBinEn: "Specialized E-Waste Drop-off",
    recyclingBinId: "Tempat Penampungan Khusus E-Waste",
    estimatedDecompositionEn: "1-2 million years",
    estimatedDecompositionId: "1-2 juta tahun",
    environmentalImpactEn: "E-waste contains precious metals like gold and silver, but also toxic substances like lead and mercury.",
    environmentalImpactId: "E-waste mengandung logam mulia seperti emas dan perak, tetapi juga zat beracun seperti timbal dan merkuri.",
    recommendationsEn: [
      "Do NOT put in standard recycling or trash bins.",
      "Wipe personal data before recycling.",
      "Use certified e-waste recyclers to ensure safe handling."
    ],
    recommendationsId: [
      "Jangan masukkan ke dalam tempat sampah atau daur ulang standar.",
      "Hapus data pribadi sebelum mendaur ulang.",
      "Gunakan pendaur ulang e-waste bersertifikat untuk memastikan penanganan yang aman."
    ],
    difficultyEn: "Specialized",
    difficultyId: "Khusus",
    confidenceNoteEn: "Complex structures. AI usually detects the general object type (e.g., 'phone' or 'cable').",
    confidenceNoteId: "Struktur kompleks. AI biasanya mendeteksi tipe objek umum (seperti 'telepon' atau 'kabel')."
  },
  {
    id: "b3-waste",
    nameEn: "B3 Hazardous Waste",
    nameId: "Limbah Bahan Berbahaya & Beracun (B3)",
    categoryEn: "B3",
    categoryId: "B3",
    descriptionEn: "Household hazardous waste (B3) including aerosol cans, pesticides, paint, solvents, and strong chemical containers.",
    descriptionId: "Limbah bahan berbahaya dan beracun (B3) rumah tangga termasuk kaleng aerosol, pestisida, cat, pelarut, dan wadah kimia keras.",
    recyclable: false,
    recyclingBinEn: "Red Bin / Toxic Waste Drop-off",
    recyclingBinId: "Tempat Sampah Merah / Pengumpulan Khusus B3",
    estimatedDecompositionEn: "Varies (non-biodegradable, persists indefinitely)",
    estimatedDecompositionId: "Bervariasi (tidak dapat terurai secara alami)",
    environmentalImpactEn: "Extremely toxic. Incorrect disposal can contaminate groundwater, poison soil, and cause serious health issues to humans and wildlife.",
    environmentalImpactId: "Sangat beracun. Pembuangan yang salah dapat mencemari air tanah, meracuni tanah, serta menyebabkan masalah kesehatan serius bagi manusia dan satwa liar.",
    recommendationsEn: [
      "Do NOT mix with domestic waste or throw in regular bins.",
      "Keep in original containers with labels intact.",
      "Deliver to authorized local hazardous waste collection points."
    ],
    recommendationsId: [
      "Jangan campur dengan sampah rumah tangga atau dibuang ke tempat sampah biasa.",
      "Simpan dalam wadah asli dengan label yang masih utuh.",
      "Serahkan ke pos pengumpulan limbah B3 setempat yang resmi."
    ],
    difficultyEn: "Specialized",
    difficultyId: "Khusus",
    confidenceNoteEn: "AI identifies containers of chemicals. Please handle carefully.",
    confidenceNoteId: "AI mengidentifikasi wadah bahan kimia. Harap tangani dengan hati-hati."
  },
  {
    id: "medical-waste",
    nameEn: "Medical Waste",
    nameId: "Sampah Medis",
    categoryEn: "Medical",
    categoryId: "Medis",
    descriptionEn: "Waste generated from healthcare activities, such as used syringes, face masks, gloves, bandages, and expired medications.",
    descriptionId: "Sampah yang dihasilkan dari aktivitas medis, seperti jarum suntik bekas, masker wajah, sarung tangan, perban, dan obat kadaluwarsa.",
    recyclable: false,
    recyclingBinEn: "Red Bin / Biohazard Waste Drop-off",
    recyclingBinId: "Tempat Sampah Merah / Pengumpulan Sampah Medis",
    estimatedDecompositionEn: "Varies (synthetic materials and plastics may take hundreds of years)",
    estimatedDecompositionId: "Bervariasi (bahan sintetis dan plastik dapat memakan waktu ratusan tahun)",
    environmentalImpactEn: "Presents biological and chemical hazards. Can spread infectious pathogens and disease if mixed with municipal waste.",
    environmentalImpactId: "Menyajikan bahaya biologis dan kimiawi. Dapat menyebarkan patogen infeksius dan penyakit jika dicampur dengan sampah umum.",
    recommendationsEn: [
      "Cut the ear loops of face masks before discarding to prevent wildlife entanglement.",
      "Place sharps and needles in puncture-proof containers before disposal.",
      "Take expired medicines and clinical items to designated health clinics or hospital drop boxes."
    ],
    recommendationsId: [
      "Gunting tali masker wajah sebelum dibuang untuk mencegah hewan terjerat.",
      "Tempatkan jarum suntik dan benda tajam lainnya di wadah tahan tusukan sebelum dibuang.",
      "Bawa obat kedaluwarsa dan limbah klinis ke puskesmas atau kotak pengumpulan rumah sakit terdekat."
    ],
    difficultyEn: "Specialized",
    difficultyId: "Khusus",
    confidenceNoteEn: "AI detects masks and syringes. Prioritize safe containment and biosafety disposal.",
    confidenceNoteId: "AI mendeteksi masker dan jarum suntik. Prioritaskan penyimpanan aman dan pembuangan biosekuriti."
  },
  {
    id: "metal-non-can",
    nameEn: "Non-Can Metal",
    nameId: "Logam Non-Kaleng",
    categoryEn: "Metal",
    categoryId: "Logam",
    descriptionEn: "Household metal objects that are not cans, such as wires, cutlery (spoons, forks), metal pots, pans, and tools.",
    descriptionId: "Objek logam rumah tangga selain kaleng, seperti kabel, peralatan makan (sendok, garpu), panci logam, wajan, dan perkakas.",
    recyclable: true,
    recyclingBinEn: "Yellow Bin / Metals",
    recyclingBinId: "Tempat Sampah Kuning / Logam",
    estimatedDecompositionEn: "100 - 500 years",
    estimatedDecompositionId: "100 - 500 tahun",
    environmentalImpactEn: "Recycling scrap metal uses significantly less energy than refining virgin ore, reducing greenhouse gas emissions.",
    environmentalImpactId: "Mendaur ulang logam bekas menggunakan energi jauh lebih sedikit daripada memurnikan bijih mentah, sehingga mengurangi emisi gas rumah kaca.",
    recommendationsEn: [
      "Remove non-metal attachments like rubber handles if possible.",
      "Ensure items are clean and free of excessive food residue or grease.",
      "Take larger metal scrap to local recycling centers."
    ],
    recommendationsId: [
      "Lepaskan bagian non-logam seperti pegangan karet jika memungkinkan.",
      "Pastikan barang bersih dan bebas dari sisa makanan atau minyak berlebih.",
      "Bawa logam bekas yang lebih besar ke pusat daur ulang setempat."
    ],
    difficultyEn: "Medium",
    difficultyId: "Sedang",
    confidenceNoteEn: "AI detects metallic items. Shape variation might trigger low confidence.",
    confidenceNoteId: "AI mendeteksi barang berbahan logam. Variasi bentuk mungkin memicu tingkat keyakinan rendah."
  }
];
