export type Category = "supercar" | "sports" | "luxury" | "suv" | "classic";

export type Car = {
  id: string;
  make: string;
  model: string;
  category: Category;
  /** short producer-facing role line */
  role: string;
  /** productions this exact car appeared in */
  seenIn: string[];
  /** Instagram clip in /media/v (muted loop on hover) */
  reel?: string;
  /** SceneDrive's own black/red slash card in /media/p */
  card?: string;
  /** on-set photo in /media/p */
  photo?: string;
  /** every car on the books can be written off for a scene */
  crashEligible: true;
};

const c = (car: Omit<Car, "crashEligible">): Car => ({ ...car, crashEligible: true });

export const fleet: Car[] = [
  // Ferrari
  c({ id: "ferrari-f8-tributo", make: "Ferrari", model: "F8 Tributo", category: "supercar", role: "Hero car. Red, mid-engine, unmistakable.", seenIn: ["Saqr w Kanarya"], reel: "DWudGrWDKBK_00.mp4", card: "DWudGrWDKBK_00.jpg", photo: "DYCw4w6jCwy_00.jpg" }),
  c({ id: "ferrari-488-pista", make: "Ferrari", model: "488 Pista", category: "supercar", role: "Track-bred. Stripes read on camera.", seenIn: [], reel: "DW5LL_4iHDg_00.mp4", card: "DW5LL_4iHDg_00.jpg" }),
  c({ id: "ferrari-california", make: "Ferrari", model: "California", category: "sports", role: "Convertible. Faces in shot, wind in hair.", card: "card_ferrari-california.jpg", seenIn: ["Fresh", "Mountain View"], reel: "DYBEPtiCDZp_02.mp4", photo: "DYBEPtiCDZp_00.jpg" }),
  c({ id: "ferrari-f430", make: "Ferrari", model: "F430", category: "supercar", role: "Classic-era Ferrari lines.", card: "card_ferrari-f430.jpg", seenIn: ["Italiano"], photo: "DVt5LdeDGot_00.jpg", reel: "DVt5LdeDGot_02.mp4" }),
  c({ id: "ferrari-f430-spider", make: "Ferrari", model: "F430 Spider", category: "supercar", role: "Open-top F430 for dialogue scenes.", seenIn: ["Schweppes"], photo: "DVpsLYwjEiy_00.jpg", reel: "DVpsLYwjEiy_01.mp4" }),
  c({ id: "ferrari-599-gtb", make: "Ferrari", model: "599 GTB Fiorano", category: "supercar", role: "V12 grand tourer.", card: "card_ferrari-599-gtb.jpg", seenIn: ["Wahed Tany"], photo: "DVwzTYHDNO__00.jpg", reel: "DVwzTYHDNO__03.mp4" }),
  c({ id: "ferrari-portofino", make: "Ferrari", model: "Portofino", category: "sports", role: "Convertible GT.", seenIn: ["The Brooks"], card: "DT3l7wnjIks_00.jpg", photo: "DT04vBFjM_Q_00.jpg", reel: "DT04vBFjM_Q_00.mp4" }),
  // McLaren
  c({ id: "mclaren-570s-spider", make: "McLaren", model: "570S Spider", category: "supercar", role: "Dihedral doors. Orange or white.", seenIn: ["Fresh", "Cottonil"], reel: "DWK80maiBto_00.mp4", card: "DWK80maiBto_00.jpg", photo: "DYvQTELjEcN_00.jpg" }),
  c({ id: "mclaren-600lt-spider", make: "McLaren", model: "600LT Spider", category: "supercar", role: "Baby blue, top-exit exhausts.", seenIn: [], reel: "DXX7EeniCs9_00.mp4", card: "DXX7EeniCs9_00.jpg" }),
  c({ id: "mclaren-gts", make: "McLaren", model: "GTS", category: "supercar", role: "Long-distance McLaren.", seenIn: [], reel: "DW1DY93jPst_00.mp4", card: "DW1DY93jPst_00.jpg" }),
  c({ id: "mclaren-12c-spider", make: "McLaren", model: "12C Spider", category: "supercar", role: "The Welad Rizk 2 chase car.", seenIn: ["Welad Rizk 2"], reel: "DVkHU4hiP5z_00.mp4", photo: "DVkHU4hiP5z_00.jpg", card: "DWe5jjpjJnS_00.jpg" }),
  // Lamborghini
  c({ id: "lamborghini-gallardo", make: "Lamborghini", model: "Gallardo", category: "supercar", role: "Yellow. The other Welad Rizk 2 chase car.", seenIn: ["Welad Rizk 2"], reel: "DULjyo2DMH7_00.mp4", card: "DULjyo2DMH7_00.jpg" }),
  // Porsche
  c({ id: "porsche-718-boxster", make: "Porsche", model: "718 Boxster", category: "sports", role: "The ad favourite. Red or blue.", card: "card_porsche-718-boxster.jpg", seenIn: ["STM", "Coca-Cola", "Ora Egypt", "Khareg El Saytara", "Afroto"], reel: "DV7uMSNDEca_01.mp4", photo: "DabMi1MxYzx_00.jpg" }),
  c({ id: "porsche-911-turbo-s", make: "Porsche", model: "911 Turbo S", category: "supercar", role: "The Ramadan hero car.", seenIn: ["Baba El Magal", "Madinaty", "e& · Etisalat"], reel: "DYXmoGJsuHF_00.mp4", card: "DUPF4M5iLE6_00.jpg", photo: "DYXmoGJsuHF_00.jpg" }),
  c({ id: "porsche-panamera-gts", make: "Porsche", model: "Panamera GTS", category: "luxury", role: "Four doors, still a Porsche.", seenIn: ["Welad Rizk 3"], reel: "DYa4cM-iALm_01.mp4", card: "DUyHynhDFna_00.jpg", photo: "DYa4cM-iALm_00.jpg" }),
  c({ id: "porsche-cayenne-coupe", make: "Porsche", model: "Cayenne Coupé", category: "suv", role: "Villain SUV, black.", seenIn: ["Meen Ysadak", "Vodafone", "e& · Etisalat"], reel: "DVxFQZwiPDW_01.mp4", photo: "DVXTVgpCCkb_00.jpg" }),
  // Mercedes
  c({ id: "mercedes-sls-amg", make: "Mercedes-Benz", model: "SLS AMG", category: "supercar", role: "Gullwing doors.", seenIn: [], reel: "DXQEzs-DJ44_00.mp4", card: "DXQEzs-DJ44_00.jpg" }),
  c({ id: "mercedes-amg", make: "Mercedes-AMG", model: "SL Roadster", category: "sports", role: "AMG roadster, black.", card: "card_mercedes-amg.jpg", seenIn: [], photo: "DYsyNBpDMwf_00.jpg" }),
  c({ id: "mercedes-sl", make: "Mercedes-Benz", model: "SL", category: "sports", role: "Roadster with period feel.", seenIn: ["Kazablanka", "Les Baghdad"], reel: "DX4hMKvsB5h_00.mp4", card: "DVxD-BMiAfy_00.jpg" }),
  c({ id: "mercedes-g-class", make: "Mercedes-Benz", model: "G-Class", category: "suv", role: "The boss car. Black or white.", seenIn: ["Gaafar El Omda", "Wahed Tany", "Welad Rizk 3", "Afroto", "e& · Etisalat"], reel: "DUqjkHRjHBo_01.mp4", card: "DUTwoOsjGly_00.jpg", photo: "DVuNHf5jHWx_00.jpg" }),
  c({ id: "mercedes-e-class", make: "Mercedes-Benz", model: "E-Class", category: "luxury", role: "Executive sedan for city scenes.", card: "card_mercedes-e-class.jpg", seenIn: ["Siret Hob"], photo: "DYk6sFsDC8m_00.jpg" }),
  // BMW
  c({ id: "bmw-i8-roadster", make: "BMW", model: "i8 Roadster", category: "supercar", role: "Butterfly doors, futuristic.", seenIn: ["Marwan Pablo"], reel: "DUvpV4YjHaL_03.mp4", card: "DUbrHc-DHwE_00.jpg", photo: "DYvR0YLjCCP_00.jpg" }),
  c({ id: "bmw-m4", make: "BMW", model: "M4", category: "sports", role: "Drift-ready.", seenIn: ["BMW Egypt"], reel: "DYvR0YLjCCP_00.mp4", photo: "DYvR0YLjCCP_00.jpg" }),
  c({ id: "bmw-8-series", make: "BMW", model: "8 Series", category: "luxury", role: "Red grand coupé.", card: "card_bmw-8-series.jpg", seenIn: ["BMW Egypt"], reel: "DYsEw42jH8T_02.mp4", photo: "DYsEw42jH8T_00.jpg" }),
  c({ id: "bmw-6-convertible", make: "BMW", model: "6 Series Convertible", category: "luxury", role: "White convertible.", card: "card_bmw-6-convertible.jpg", seenIn: ["Mai Omar campaign"], reel: "DVuQbJ1DDpz_03.mp4", photo: "DVuQbJ1DDpz_00.jpg" }),
  // Audi
  c({ id: "audi-r8", make: "Audi", model: "R8", category: "supercar", role: "Mid-engine, quattro.", card: "card_audi-r8.jpg", seenIn: ["El Ankaboot"], photo: "DVwqPYHjN1p_00.jpg" }),
  c({ id: "audi-tt-roadster", make: "Audi", model: "TT Roadster", category: "sports", role: "Red roadster.", card: "card_audi-tt-roadster.jpg", seenIn: [], photo: "DYHyIY6DC3B_00.jpg" }),
  // Others
  c({ id: "bentley-flying-spur", make: "Bentley", model: "Flying Spur", category: "luxury", role: "Chauffeur-class.", card: "card_bentley-flying-spur.jpg", seenIn: ["Welad Rizk 3"], reel: "DVu18sEDHZ3_01.mp4", photo: "DVu18sEDHZ3_00.jpg" }),
  c({ id: "maserati-granturismo", make: "Maserati", model: "GranTurismo", category: "sports", role: "Italian GT, orange.", seenIn: ["Orange"], reel: "DVM4JqliOwl_00.mp4", card: "DVM4JqliOwl_00.jpg" }),
  c({ id: "jaguar-f-pace", make: "Jaguar", model: "F-PACE", category: "suv", role: "Performance SUV.", card: "card_jaguar-f-pace.jpg", seenIn: ["Red Bull"], reel: "DVhOQ8DDAEK_01.mp4", photo: "DVhOQ8DDAEK_00.jpg" }),
  c({ id: "gmc-hummer-h2", make: "GMC", model: "Hummer H2", category: "suv", role: "The one we rolled.", seenIn: ["Welad Rizk 2", "e& · Etisalat", "Coca-Cola"], reel: "DUn4epVDNEe_01.mp4", card: "DTtBQA6DJ48_00.jpg", photo: "DUn4epVDNEe_00.jpg" }),
  c({ id: "jeep-wrangler", make: "Jeep", model: "Wrangler", category: "suv", role: "Off-road, camo.", seenIn: ["Welad Rizk 2"], reel: "DWNljgQCPiY_00.mp4", card: "DWNljgQCPiY_00.jpg" }),
  c({ id: "jeep-liberty", make: "Jeep", model: "Liberty", category: "suv", role: "Stunt-ready SUV.", seenIn: ["Khuda Haafiz 2"], reel: "DVpTFD9iAMC_00.mp4", photo: "DVpTFD9iAMC_00.jpg" }),
  c({ id: "ford-mustang-gt", make: "Ford", model: "Mustang GT", category: "classic", role: "American muscle, red.", seenIn: ["Welad Rizk"], reel: "DUED8g7DKV4_00.mp4", card: "DUED8g7DKV4_00.jpg" }),
  c({ id: "chevrolet-impala", make: "Chevrolet", model: "Impala", category: "classic", role: "Sixties classic, blue.", card: "card_chevrolet-impala.jpg", seenIn: ["Welad Rizk", "Vodafone RED"], reel: "DVu0UnuDJpb_02.mp4", photo: "DVu0UnuDJpb_00.jpg" }),
  c({ id: "mini-cooper-roadster", make: "MINI", model: "Cooper Roadster", category: "sports", role: "Small, characterful.", card: "card_mini-cooper-roadster.jpg", seenIn: [], photo: "DYsyNBpDMwf_00.jpg" }),
  c({ id: "vanderhall-venice", make: "Vanderhall", model: "Venice", category: "sports", role: "Three-wheeler. Nothing else looks like it.", seenIn: ["Mobil"], reel: "DVwmxrbjMNU_00.mp4", card: "DVwmxrbjMNU_00.jpg" }),
];

export const categories: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "supercar", label: "Supercars" },
  { id: "sports", label: "Sports" },
  { id: "luxury", label: "Luxury" },
  { id: "suv", label: "SUV & 4x4" },
  { id: "classic", label: "Classics" },
];

export const lineups = [
  { id: "heist-trio", art: "heist", title: "The heist trio", cars: ["mclaren-12c-spider", "lamborghini-gallardo", "jeep-wrangler"], seenIn: "Welad Rizk 2" },
  { id: "villain-suvs", art: "villain", title: "Villain SUVs", cars: ["mercedes-g-class", "porsche-cayenne-coupe", "gmc-hummer-h2"], seenIn: "Gaafar El Omda · e&" },
  { id: "ramadan-hero", art: "ramadan", title: "Ramadan hero", cars: ["porsche-911-turbo-s", "porsche-718-boxster"], seenIn: "Baba El Magal · STM" },
  { id: "red-carpet", art: "redcarpet", title: "Red carpet", cars: ["bentley-flying-spur", "ferrari-f8-tributo", "mercedes-sls-amg"], seenIn: "Welad Rizk 3" },
];
