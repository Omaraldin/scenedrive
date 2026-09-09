export type ProductionType = "film" | "series" | "ad" | "music";

export type Production = {
  id: string;
  title: string;
  titleAr?: string;
  type: ProductionType;
  year?: string;
  cars: string;
  talent?: string;
  /** clips from /media/v (first is the lightbox default) */
  clips?: string[];
  /** photos from /media/p */
  photos?: string[];
  /** official YouTube id, if known */
  youtube?: string;
  /** Instagram post code for "see the post" */
  post?: string;
  ramadan?: boolean;
  /** partner logo under /partners/out */
  logo?: string;
};

export const productions: Production[] = [
  // Films & series
  { id: "welad-rizk-2", logo: "welad-rizk-2.png", title: "Welad Rizk 2", titleAr: "ولاد رزق 2", type: "film", year: "2019", cars: "McLaren 12C Spider, Lamborghini Gallardo, Jeep Wrangler, Hummer H2", talent: "Ahmed Ezz, Amr Youssef, Ahmed El Fishawy, Karim Kassem", clips: ["yt_wr2_chase.mp4", "DTtBQA6DJ48_00.mp4", "DWe5jjpjJnS_00.mp4", "DVy483WDLmY_00.mp4", "DWP-qZ8CFe__00.mp4", "DULjyo2DMH7_00.mp4", "DVkHU4hiP5z_00.mp4", "DVkHU4hiP5z_03.mp4", "DWNljgQCPiY_00.mp4"], photos: ["DVkHU4hiP5z_01.jpg", "DVkHU4hiP5z_02.jpg", "DVkHU4hiP5z_03.jpg", "DVkHU4hiP5z_04.jpg", "DVkHU4hiP5z_05.jpg", "DVy483WDLmY_00.jpg", "DWP-qZ8CFe__00.jpg"], youtube: "CeyL9IgTzZU", post: "DTtBQA6DJ48" },
  { id: "welad-rizk-3", logo: "welad-rizk-3.png", title: "Welad Rizk 3: El Qadeya", titleAr: "ولاد رزق 3: القاضية", type: "film", year: "2024", cars: "Bentley Flying Spur, Mercedes G-Class, Porsche Panamera", talent: "Ahmed Ezz, Amr Youssef, Asser Yassin", clips: ["DUyHynhDFna_00.mp4", "DU0rZ0KDHNx_02.mp4", "DU0rZ0KDHNx_00.mp4", "DU0rZ0KDHNx_01.mp4", "DVu18sEDHZ3_01.mp4"], photos: ["DVu18sEDHZ3_00.jpg", "DVu18sEDHZ3_01.jpg", "DVu18sEDHZ3_02.jpg", "DVu18sEDHZ3_03.jpg", "DU0rZ0KDHNx_00.jpg", "DU0rZ0KDHNx_01.jpg", "DU0rZ0KDHNx_02.jpg"], post: "DUyHynhDFna" },
  { id: "welad-rizk", logo: "welad-rizk.png", title: "Welad Rizk", titleAr: "ولاد رزق", type: "film", year: "2015", cars: "Ford Mustang GT, Chevrolet Impala", talent: "Ahmed Ezz, Amr Youssef", clips: ["DUED8g7DKV4_00.mp4", "DVu0UnuDJpb_02.mp4"], photos: ["DVu0UnuDJpb_00.jpg", "DVu0UnuDJpb_01.jpg", "DVu0UnuDJpb_03.jpg"], post: "DUED8g7DKV4" },
  { id: "wahed-tany", logo: "wahed-tany.png", title: "Wahed Tany", titleAr: "واحد تاني", type: "film", year: "2022", cars: "Ferrari 599 GTB Fiorano, Mercedes G-Class", talent: "Ahmed Helmy", clips: ["DUqjkHRjHBo_01.mp4", "DVwzTYHDNO__03.mp4"], photos: ["DVwzTYHDNO__00.jpg", "DVwzTYHDNO__01.jpg", "DVwzTYHDNO__02.jpg", "DVwzTYHDNO__03.jpg", "DUqjkHRjHBo_00.jpg", "DUqjkHRjHBo_01.jpg", "DUqjkHRjHBo_02.jpg", "DUqjkHRjHBo_03.jpg"], post: "DUqjkHRjHBo" },
  { id: "saqr-w-kanarya", logo: "saqr-w-kanarya.png", title: "Saqr w Kanarya", titleAr: "صقر وكناريا", type: "film", year: "2026", cars: "Ferrari F8 Tributo", talent: "Mohamed Emam, Chico", clips: ["DYCw4w6jCwy_03.mp4"], photos: ["DYCw4w6jCwy_00.jpg", "DYCw4w6jCwy_01.jpg", "DYCw4w6jCwy_02.jpg", "DYCw4w6jCwy_03.jpg", "DYCw4w6jCwy_04.jpg", "DYCw4w6jCwy_05.jpg", "DYCw4w6jCwy_06.jpg"], post: "DYCw4w6jCwy" },
  { id: "meen-ysadak", logo: "meen-ysadak.png", title: "Meen Ysadak", titleAr: "مين يصدق", type: "film", year: "2024", cars: "Porsche Cayenne Coupé", clips: ["DVxFQZwiPDW_01.mp4", "DVxFQZwiPDW_03.mp4"], photos: ["DVxFQZwiPDW_00.jpg", "DVxFQZwiPDW_01.jpg", "DVxFQZwiPDW_02.jpg", "DVxFQZwiPDW_03.jpg"], post: "DVxFQZwiPDW" },
  { id: "bimbo", logo: "bimbo.png", title: "Bimbo", titleAr: "بيمبو", type: "film", year: "2024", cars: "Fleet", talent: "Ahmed Malek, Wegz, Huda El Mufti", clips: ["DUYhgZeDBqd_00.mp4", "DUYhgZeDBqd_03.mp4"], photos: ["DUYhgZeDBqd_00.jpg", "DUYhgZeDBqd_01.jpg", "DUYhgZeDBqd_02.jpg", "DUYhgZeDBqd_03.jpg"], post: "DUYhgZeDBqd" },
  { id: "el-ankaboot", title: "El Ankaboot", titleAr: "العنكبوت", type: "film", year: "2022", cars: "Audi R8", talent: "Ahmed El Sakka, Mona Zaki", photos: ["DVwqPYHjN1p_00.jpg", "DVwqPYHjN1p_01.jpg", "DVwqPYHjN1p_02.jpg"], youtube: "dEyCf--31qM", post: "DVwqPYHjN1p" },
  { id: "khuda-haafiz-2", logo: "khuda-haafiz-2.png", title: "Khuda Haafiz 2", type: "film", year: "2022", cars: "Jeep Liberty", talent: "Vidyut Jammwal", clips: ["DVpTFD9iAMC_00.mp4", "DVpTFD9iAMC_01.mp4", "DVpTFD9iAMC_02.mp4", "DVpTFD9iAMC_03.mp4"], photos: ["DVpTFD9iAMC_01.jpg", "DVpTFD9iAMC_02.jpg", "DVpTFD9iAMC_03.jpg"], post: "DVpTFD9iAMC" },
  { id: "baba-el-magal", logo: "baba-el-magal.png", title: "Baba El Magal", titleAr: "بابا المجال", type: "series", year: "2023", ramadan: true, cars: "Porsche 911 Turbo S", talent: "Mostafa Shaban", clips: ["DVtsrbpjGK3_03.mp4", "DVtsrbpjGK3_04.mp4"], photos: ["DVtsrbpjGK3_00.jpg", "DVtsrbpjGK3_01.jpg", "DVtsrbpjGK3_02.jpg", "DVtsrbpjGK3_03.jpg", "DVtsrbpjGK3_04.jpg"], youtube: "-KAEC_Zm904", post: "DVtsrbpjGK3" },
  { id: "gaafar-el-omda", logo: "gaafar-el-omda.png", title: "Gaafar El Omda", titleAr: "جعفر العمدة", type: "series", year: "2023", ramadan: true, cars: "Mercedes G-Class", talent: "Mohamed Ramadan", photos: ["DVHgs1RjLU5_00.jpg", "DVHgs1RjLU5_01.jpg", "DVHgs1RjLU5_02.jpg", "DVHgs1RjLU5_03.jpg", "DVHgs1RjLU5_04.jpg"], youtube: "IA4dC47g9Nw", post: "DVHgs1RjLU5" },
  { id: "khareg-el-saytara", logo: "khareg-el-saytara.png", title: "Khareg El Saytara", titleAr: "خارج السيطرة", type: "series", year: "2021", cars: "Porsche 718 Boxster", clips: ["DWIVr92iG30_04.mp4"], photos: ["DWIVr92iG30_00.jpg", "DWIVr92iG30_01.jpg", "DWIVr92iG30_02.jpg", "DWIVr92iG30_03.jpg", "DWIVr92iG30_04.jpg"], post: "DWIVr92iG30" },
  { id: "kazablanka", logo: "kazablanka.png", title: "Kazablanka", titleAr: "كازابلانكا", type: "film", year: "2019", cars: "Mercedes-Benz SL", talent: "Amir Karara", clips: ["DVxD-BMiAfy_00.mp4"], youtube: "Iyvtp1bUDOY", post: "DVxD-BMiAfy" },
  { id: "siret-hob", logo: "siret-hob.png", title: "Siret Hob", titleAr: "سيرة حب", type: "series", year: "2014", cars: "Mercedes-Benz fleet", photos: ["DZBTOJQDKQj_00.jpg", "DZBTOJQDKQj_01.jpg", "DZBTOJQDKQj_02.jpg", "DZBTOJQDKQj_03.jpg"], post: "DZBTOJQDKQj" },
  { id: "les-baghdad", logo: "les-baghdad.png", title: "Les Baghdad", type: "film", cars: "Mercedes-Benz SL", clips: ["DX4hMKvsB5h_00.mp4"], photos: ["DX4hMKvsB5h_00.jpg"], post: "DX4hMKvsB5h" },

  // Ads
  { id: "stm", logo: "stm.png", title: "STM Egypt", type: "ad", year: "2026", ramadan: true, cars: "Porsche 718 Boxster", talent: "Ahmed Helmy", clips: ["DV7uMSNDEca_01.mp4", "DV7uMSNDEca_00.mp4", "DV7uMSNDEca_03.mp4", "DV7uMSNDEca_04.mp4", "DV7uMSNDEca_05.mp4"], photos: ["DV7uMSNDEca_00.jpg", "DV7uMSNDEca_01.jpg", "DV7uMSNDEca_02.jpg", "DV7uMSNDEca_03.jpg", "DV7uMSNDEca_04.jpg", "DV7uMSNDEca_05.jpg"], post: "DV7uMSNDEca" },
  { id: "orange", logo: "orange.png", title: "Orange Premier", type: "ad", cars: "Maserati GranTurismo", talent: "Nelly Karim, Karim Abdel Aziz", clips: ["yt_orange_premier.mp4", "DVM4JqliOwl_00.mp4"], youtube: "UMqFPVyeXAQ", post: "DVM4JqliOwl" },
  { id: "bmw-egypt", logo: "bmw-egypt.png", title: "BMW Egypt · Global Auto", type: "ad", year: "2026", cars: "BMW M4, 8 Series", clips: ["DUbrHc-DHwE_00.mp4"], post: "DUbrHc-DHwE" },
  { id: "the-brooks", logo: "the-brooks.png", title: "The Brooks", type: "ad", year: "2026", cars: "Ferrari Portofino", talent: "Mohamed Hamaki", clips: ["DT04vBFjM_Q_00.mp4", "DT3l7wnjIks_02.mp4"], photos: ["DT3l7wnjIks_00.jpg", "DT3l7wnjIks_01.jpg", "DT3l7wnjIks_02.jpg", "DT3l7wnjIks_03.jpg", "DT3l7wnjIks_04.jpg"], post: "DT04vBFjM_Q" },
  { id: "coca-cola", logo: "coca-cola.png", title: "Coca-Cola", type: "ad", cars: "Porsche 718 Boxster, Hummer H2", clips: ["DWSj0mPCP-F_03.mp4"], photos: ["DWSj0mPCP-F_00.jpg", "DWSj0mPCP-F_01.jpg", "DWSj0mPCP-F_02.jpg", "DWSj0mPCP-F_03.jpg"], post: "DWSj0mPCP-F" },
  { id: "pepsi", logo: "pepsi.png", title: "Pepsi", type: "ad", cars: "Fleet", talent: "Amr Diab", clips: ["DUNm14AjF5d_02.mp4", "DUNm14AjF5d_03.mp4"], photos: ["DUNm14AjF5d_00.jpg", "DUNm14AjF5d_01.jpg", "DUNm14AjF5d_02.jpg", "DUNm14AjF5d_03.jpg"], post: "DUNm14AjF5d" },
  { id: "vodafone-summer", logo: "vodafone-summer.png", title: "Vodafone Summer", type: "ad", cars: "Porsche Cayenne Coupé", clips: ["DVXTVgpCCkb_00.mp4", "DVXTVgpCCkb_01.mp4", "DVXTVgpCCkb_02.mp4"], photos: ["DVXTVgpCCkb_01.jpg", "DVXTVgpCCkb_02.jpg", "DVXTVgpCCkb_03.jpg", "DVXTVgpCCkb_04.jpg"], post: "DVXTVgpCCkb" },
  { id: "vodafone-red", logo: "vodafone-red.png", title: "Vodafone RED", type: "ad", year: "2026", cars: "Chevrolet Impala on the red carpet", talent: "Welad Rizk 3 cast", clips: ["DT8qcKNDM-W_01.mp4"], photos: ["DT8qcKNDM-W_00.jpg", "DT8qcKNDM-W_01.jpg", "DT8qcKNDM-W_02.jpg", "DT8qcKNDM-W_03.jpg", "DT8qcKNDM-W_04.jpg"], post: "DT8qcKNDM-W" },
  { id: "eand-mohamed-ramadan", logo: "eand.png", title: "e& · Etisalat", type: "ad", cars: "GMC Hummer H2", talent: "Mohamed Ramadan", clips: ["DUn4epVDNEe_01.mp4", "DUn4epVDNEe_04.mp4"], photos: ["DUn4epVDNEe_00.jpg", "DUn4epVDNEe_01.jpg", "DUn4epVDNEe_02.jpg", "DUn4epVDNEe_03.jpg", "DUn4epVDNEe_04.jpg"], post: "DUn4epVDNEe" },
  { id: "eand-khaled-el-nabawy", logo: "eand.png", title: "e& · Etisalat", type: "ad", cars: "Porsche Cayenne Coupé, Mercedes G-Class", talent: "Khaled El Nabawy", clips: ["DUeJYJdjN2s_01.mp4", "DUeJYJdjN2s_00.mp4"], photos: ["DUeJYJdjN2s_00.jpg", "DUeJYJdjN2s_01.jpg", "DUeJYJdjN2s_02.jpg", "DUeJYJdjN2s_03.jpg"], post: "DUeJYJdjN2s" },
  { id: "eand-ahmed-ezz", logo: "eand.png", title: "e& · Etisalat", type: "ad", cars: "Porsche 911 Turbo S", talent: "Ahmed Ezz", clips: ["DUPF4M5iLE6_00.mp4"], post: "DUPF4M5iLE6" },
  { id: "red-bull", title: "Red Bull", type: "ad", year: "2026", cars: "Jaguar F-PACE", talent: "Marwan Pablo", clips: ["DVhOQ8DDAEK_01.mp4"], photos: ["DVhOQ8DDAEK_00.jpg", "DVhOQ8DDAEK_01.jpg", "DVhOQ8DDAEK_02.jpg", "DVhOQ8DDAEK_03.jpg"], post: "DVhOQ8DDAEK" },
  { id: "madinaty", logo: "madinaty.png", title: "Madinaty", type: "ad", cars: "Porsche 911 Turbo S", talent: "Karim Abdel Aziz", clips: ["DVe_ZGxiPa-_01.mp4"], photos: ["DVe_ZGxiPa-_00.jpg", "DVe_ZGxiPa-_01.jpg", "DVe_ZGxiPa-_02.jpg", "DVe_ZGxiPa-_03.jpg"], post: "DVe_ZGxiPa-" },
  { id: "madinet-masr", logo: "madinet-masr.png", title: "Madinet Masr", type: "ad", cars: "Porsche 718 Boxster", talent: "Tamer Hosny", clips: ["DUokwMgDC_8_01.mp4", "DUokwMgDC_8_03.mp4"], photos: ["DUokwMgDC_8_00.jpg", "DUokwMgDC_8_01.jpg", "DUokwMgDC_8_02.jpg", "DUokwMgDC_8_03.jpg"], post: "DUokwMgDC_8" },
  { id: "ora-egypt", logo: "ora-egypt.png", title: "Ora Egypt", type: "ad", cars: "Porsche 718 Boxster", talent: "Ahmed Ezz, Yasmine Sabri", clips: ["DUeUAzZjLn5_02.mp4"], photos: ["DUeUAzZjLn5_00.jpg", "DUeUAzZjLn5_01.jpg", "DUeUAzZjLn5_02.jpg"], post: "DUeUAzZjLn5" },
  { id: "fresh", title: "Fresh", type: "ad", cars: "McLaren 570S Spider, Ferrari California", talent: "Dina El Sherbiny, Ruby", clips: ["DVPa-9yjLY3_01.mp4", "DVPa-9yjLY3_02.mp4"], photos: ["DVPa-9yjLY3_00.jpg", "DVPa-9yjLY3_01.jpg", "DVPa-9yjLY3_02.jpg", "DVPa-9yjLY3_03.jpg", "DVPa-9yjLY3_04.jpg", "DVPa-9yjLY3_05.jpg"], post: "DVPa-9yjLY3" },
  { id: "mountain-view", logo: "mountain-view.png", title: "Mountain View", type: "ad", year: "2017", cars: "Ferrari California", clips: ["DVKWbUhCItf_02.mp4"], photos: ["DVKWbUhCItf_00.jpg", "DVKWbUhCItf_01.jpg", "DVKWbUhCItf_02.jpg", "DVKWbUhCItf_03.jpg"], post: "DVKWbUhCItf" },
  { id: "mobil", logo: "mobil.png", title: "Mobil", type: "ad", cars: "Vanderhall Venice", clips: ["DVwmxrbjMNU_00.mp4"], post: "DVwmxrbjMNU" },
  { id: "schweppes", logo: "schweppes.png", title: "Schweppes", type: "ad", cars: "Ferrari F430 Spider", clips: ["DVpsLYwjEiy_01.mp4"], photos: ["DVpsLYwjEiy_00.jpg", "DVpsLYwjEiy_01.jpg", "DVpsLYwjEiy_02.jpg"], post: "DVpsLYwjEiy" },
  { id: "italiano", logo: "italiano.png", title: "Italiano", type: "ad", cars: "Ferrari F430", clips: ["DVt5LdeDGot_02.mp4"], photos: ["DVt5LdeDGot_00.jpg", "DVt5LdeDGot_01.jpg", "DVt5LdeDGot_02.jpg"], post: "DVt5LdeDGot" },
  { id: "cottonil", logo: "cottonil.png", title: "Cottonil", type: "ad", year: "2026", cars: "McLaren 570S Spider", clips: ["DWK80maiBto_00.mp4"], post: "DWK80maiBto" },
  { id: "mai-omar", logo: "rivoli.png", title: "Rivoli", type: "ad", year: "2026", cars: "BMW 6 Series Convertible", talent: "Mai Omar", clips: ["DVuQbJ1DDpz_03.mp4"], photos: ["DVuQbJ1DDpz_00.jpg", "DVuQbJ1DDpz_01.jpg", "DVuQbJ1DDpz_02.jpg", "DVuQbJ1DDpz_03.jpg"], post: "DVuQbJ1DDpz" },

  // Music videos
  { id: "el-melouk", title: "El Melouk", titleAr: "الملوك", type: "music", cars: "Fleet", talent: "Ahmed Saad ft. 3enba", clips: ["DUTwoOsjGly_00.mp4"], post: "DUTwoOsjGly" },
  { id: "roxy", title: "Roxy", titleAr: "روكسي", type: "music", year: "2026", cars: "Fleet, camera car rig", talent: "Amir Eid", clips: ["DUEz2tMCMFU_01.mp4", "DUEz2tMCMFU_04.mp4", "DUEz2tMCMFU_05.mp4"], photos: ["DUEz2tMCMFU_00.jpg", "DUEz2tMCMFU_01.jpg", "DUEz2tMCMFU_02.jpg", "DUEz2tMCMFU_03.jpg", "DUEz2tMCMFU_04.jpg", "DUEz2tMCMFU_05.jpg"], post: "DUEz2tMCMFU" },
  { id: "afroto", title: "Afroto", type: "music", year: "2026", cars: "Mercedes G-Class, Porsche 718 Boxster", talent: "Afroto", clips: ["DVuNHf5jHWx_02.mp4", "DVuNHf5jHWx_03.mp4", "DVuNHf5jHWx_04.mp4", "DVuNHf5jHWx_05.mp4"], photos: ["DVuNHf5jHWx_00.jpg", "DVuNHf5jHWx_01.jpg", "DVuNHf5jHWx_02.jpg", "DVuNHf5jHWx_03.jpg", "DVuNHf5jHWx_04.jpg", "DVuNHf5jHWx_05.jpg"], post: "DVuNHf5jHWx" },
  { id: "marwan-pablo", title: "Marwan Pablo", type: "music", year: "2026", cars: "BMW i8 Roadster", talent: "Marwan Pablo", clips: ["DUvpV4YjHaL_03.mp4"], photos: ["DUvpV4YjHaL_00.jpg", "DUvpV4YjHaL_01.jpg", "DUvpV4YjHaL_02.jpg", "DUvpV4YjHaL_03.jpg"], post: "DUvpV4YjHaL" },
  { id: "hamaki-the-brooks", title: "Hamaki × The Brooks", type: "music", year: "2026", cars: "Ferrari Portofino", talent: "Mohamed Hamaki", clips: ["DT04vBFjM_Q_00.mp4"], post: "DT04vBFjM_Q" },
];

export const brands = [
  "Coca-Cola", "Pepsi", "Vodafone", "Orange", "e& Etisalat", "Red Bull", "STM", "Mobil", "Schweppes", "Cottonil", "Madinaty", "Madinet Masr", "Mountain View", "Ora", "Fresh", "BMW Egypt", "The Brooks", "Italiano",
];

export const filmTitles = productions.filter((p) => p.type === "film" || p.type === "series").map((p) => p.title);
