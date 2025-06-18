export function setFaviconFromApi(imageName = "favicon.ico") {
  const API_URL = import.meta.env.VITE_API_URL || "";
  const baseUrl = API_URL.replace("/api", "");
  const faviconUrl = `${baseUrl}/uploads/${imageName}`;

  let link = document.querySelector("link[rel*='icon']");

  if (!link) {
    link = document.createElement("link");
    document.head.appendChild(link);
  }

  link.type = "image/x-icon";
  link.rel = "shortcut icon";
  link.href = faviconUrl;
}
