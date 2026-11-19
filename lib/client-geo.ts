"use client";

/**
 * Client-Side Geolocation Helper for Linkface
 * 
 * Provides pinpoint accurate city-level resolution for non-metro cities (e.g. Ratnagiri, Kolhapur, etc.)
 * by combining client coordinates (HTML5 Geolocation) with reverse-geocoding via BigDataCloud.
 * Resolves directly from the visitor's device/IP instead of cloud edge proxy IP headers.
 */

export interface ClientGeoData {
  city: string;
  regionState: string;
  countryName: string;
  countryCode: string;
  source?: "coords" | "ip";
}

const STORAGE_KEY = "linkface_client_geo_v1";

let memoryGeo: ClientGeoData | null = null;
let inFlightPromise: Promise<ClientGeoData | null> | null = null;

/**
 * Synchronous getter: Reads instantaneously from memory or sessionStorage
 * without blocking UI thread or delaying link navigation.
 */
export function getClientGeoSync(): ClientGeoData | null {
  if (memoryGeo) return memoryGeo;
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.city === "string") {
        memoryGeo = parsed;
        return parsed;
      }
    }
  } catch {
    // sessionStorage error fallback
  }

  return null;
}

/**
 * Quick helper to obtain device GPS/Wi-Fi coordinates with a short non-blocking timeout.
 */
function getDeviceCoords(): Promise<{ lat: number; lon: number } | null> {
  if (typeof window === "undefined" || !("geolocation" in navigator)) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    // 2.5s maximum timeout so page responsiveness is never impaired
    const timer = setTimeout(() => resolve(null), 2500);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timer);
        resolve({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      () => {
        clearTimeout(timer);
        resolve(null);
      },
      {
        timeout: 2500,
        maximumAge: 300000, // 5 minutes cache for coordinates
        enableHighAccuracy: false,
      }
    );
  });
}

/**
 * Asynchronously resolves the visitor's accurate city, state, and country.
 * Uses cached result if already resolved in this session.
 */
export async function getClientGeo(): Promise<ClientGeoData | null> {
  const sync = getClientGeoSync();
  if (sync) return sync;

  if (inFlightPromise) return inFlightPromise;

  inFlightPromise = (async () => {
    try {
      // 1. Try to get device coordinates (if permitted/cached)
      const coords = await getDeviceCoords();

      // 2. Query BigDataCloud reverse geocode client API
      let url = "https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=en";
      if (coords) {
        url += `&latitude=${coords.lat}&longitude=${coords.lon}`;
      }

      const res = await fetch(url, {
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        return null;
      }

      const data = await res.json();
      const rawCity = (data.city || data.locality || "").trim();
      const rawState = (data.principalSubdivision || "").trim();
      const rawCountry = (data.countryName || "").trim();
      const rawCountryCode = (data.countryCode || "").trim().toUpperCase();

      if (rawCity || rawState || rawCountry) {
        const resolved: ClientGeoData = {
          city: rawCity || rawState,
          regionState: rawState || "Direct",
          countryName: rawCountry || "India",
          countryCode: rawCountryCode || "IN",
          source: coords ? "coords" : "ip",
        };

        memoryGeo = resolved;
        try {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(resolved));
        } catch {
          // quota or private browsing
        }

        return resolved;
      }
    } catch (err) {
      // Geolocation lookup failure fallback
      console.warn("Client geo resolution warning:", err);
    } finally {
      inFlightPromise = null;
    }

    return null;
  })();

  return inFlightPromise;
}

/**
 * Pre-warms the client geolocation in the background as soon as a profile page mounts.
 * Guarantees that when the visitor clicks a link seconds later, the city is already cached.
 */
export function initClientGeo(): void {
  if (typeof window === "undefined") return;
  getClientGeo().catch(() => {});
}

/**
 * Unified click tracking dispatcher:
 * Automatically enriches the click payload with accurate clientGeo.
 * Uses keepalive so navigation doesn't abort the request.
 */
export function recordClickWithGeo(payload: {
  linkId?: string;
  spotlightId?: string;
  profileUsername?: string;
}): void {
  if (typeof window === "undefined") return;

  const cached = getClientGeoSync();
  if (cached) {
    fetch("/api/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, clientGeo: cached }),
      keepalive: true,
    }).catch(() => {});
    return;
  }

  // If not yet cached, race geo lookup with a 250ms threshold so the click is never delayed
  Promise.race([
    getClientGeo(),
    new Promise<null>((res) => setTimeout(() => res(null), 250)),
  ])
    .then((geo) => {
      fetch("/api/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, clientGeo: geo || undefined }),
        keepalive: true,
      }).catch(() => {});
    })
    .catch(() => {
      fetch("/api/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    });
}
