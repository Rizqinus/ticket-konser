import { getApiBase } from "@/lib/api";

export const ConcertAssets = {
  rockStage: require("../../assets/images/concerts/rock-stage.jpg"),
  festivalCrowd: require("../../assets/images/concerts/festival-crowd.jpg"),
  jazzAcoustic: require("../../assets/images/concerts/jazz-acoustic.jpg"),
  electronicStage: require("../../assets/images/concerts/electronic-stage.jpg"),
  indieGuitarist: require("../../assets/images/concerts/indie-guitarist.jpg"),
  stadiumConcert: require("../../assets/images/concerts/stadium-concert.jpg"),
  default: require("../../assets/images/concerts/rock-stage.jpg"),
};

export function getConcertImageSource(image?: string | null) {
  if (!image) {
    return ConcertAssets.default;
  }

  // Dukung gambar upload lokal dari backend (/uploads/posters/ atau /uploads/artists/)
  if (image.startsWith("/uploads/")) {
    const base = getApiBase().replace(/\/api$/, "");
    return { uri: `${base}${image}` };
  }

  // Dukung format Data URI base64
  if (image.startsWith("data:image/")) {
    return { uri: image };
  }

  // Check keywords for local curated assets
  const lower = image.toLowerCase();
  if (lower.includes("festival")) return ConcertAssets.festivalCrowd;
  if (lower.includes("jazz")) return ConcertAssets.jazzAcoustic;
  if (lower.includes("electronic") || lower.includes("edm")) return ConcertAssets.electronicStage;
  if (lower.includes("guitar") || lower.includes("indie")) return ConcertAssets.indieGuitarist;
  if (lower.includes("stadium")) return ConcertAssets.stadiumConcert;
  if (lower.includes("rock") || lower.includes("stage")) return ConcertAssets.rockStage;

  // Intercept external synthetic/placeholder URLs and use authentic local assets
  if (
    lower.includes("unsplash.com") ||
    lower.includes("aida-public") ||
    lower.includes("placeholder")
  ) {
    return ConcertAssets.default;
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return { uri: image };
  }

  return ConcertAssets.default;
}
