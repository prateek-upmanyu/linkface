/**
 * Geolocation resolution helper for Linkface analytics
 * Reads Vercel and Cloudflare edge IP geolocation headers
 * and converts ISO codes to readable State and Country names.
 */

const INDIA_STATE_NAMES: Record<string, string> = {
  AN: "Andaman and Nicobar Islands",
  AP: "Andhra Pradesh",
  AR: "Arunachal Pradesh",
  AS: "Assam",
  BR: "Bihar",
  CH: "Chandigarh",
  CT: "Chhattisgarh",
  DL: "Delhi",
  DN: "Dadra and Nagar Haveli and Daman and Diu",
  GA: "Goa",
  GJ: "Gujarat",
  HR: "Haryana",
  HP: "Himachal Pradesh",
  JK: "Jammu and Kashmir",
  JH: "Jharkhand",
  KA: "Karnataka",
  KL: "Kerala",
  LA: "Ladakh",
  LD: "Lakshadweep",
  MP: "Madhya Pradesh",
  MH: "Maharashtra",
  MN: "Manipur",
  ML: "Meghalaya",
  MZ: "Mizoram",
  NL: "Nagaland",
  OR: "Odisha",
  PB: "Punjab",
  PY: "Puducherry",
  RJ: "Rajasthan",
  SK: "Sikkim",
  TN: "Tamil Nadu",
  TG: "Telangana",
  TR: "Tripura",
  UP: "Uttar Pradesh",
  UT: "Uttarakhand",
  WB: "West Bengal",
};

const US_STATE_NAMES: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

export interface GeoLocation {
  countryCode: string;
  countryName: string;
  regionCode: string;
  regionState: string;
  city: string;
}

export function extractGeoFromRequest(request: Request): GeoLocation {
  const headers = request.headers;

  // 1. Country code (Vercel standard: x-vercel-ip-country, Cloudflare: cf-ipcountry)
  let rawCountry = (
    headers.get("x-vercel-ip-country") ||
    headers.get("cf-ipcountry") ||
    ""
  ).trim().toUpperCase();

  // 2. Region / State (Vercel standard: x-vercel-ip-country-region)
  let rawRegion = (
    headers.get("x-vercel-ip-country-region") ||
    headers.get("x-vercel-ip-region") ||
    ""
  ).trim().toUpperCase();

  // 3. City (Vercel standard: x-vercel-ip-city)
  let rawCity = (
    headers.get("x-vercel-ip-city") ||
    ""
  ).trim();

  // URL decode city name if necessary
  if (rawCity) {
    try {
      rawCity = decodeURIComponent(rawCity);
    } catch {
      // keep raw
    }
  }

  // Fallback for localhost / local dev test
  if (!rawCountry) {
    const forwarded = headers.get("x-forwarded-for") || "";
    if (forwarded.includes("127.0.0.1") || forwarded.includes("::1") || !forwarded) {
      return {
        countryCode: "IN",
        countryName: "India",
        regionCode: "MH",
        regionState: "Maharashtra",
        city: "Mumbai",
      };
    }
    rawCountry = "UNKNOWN";
  }

  // Resolve Country Name
  let countryName = rawCountry;
  try {
    if (rawCountry && rawCountry.length === 2) {
      const displayNames = new Intl.DisplayNames(["en"], { type: "region" });
      countryName = displayNames.of(rawCountry) || rawCountry;
    }
  } catch {
    countryName = rawCountry;
  }

  // Resolve State/Region name based on country
  let regionState = rawRegion || "Direct";
  if (rawCountry === "IN" && INDIA_STATE_NAMES[rawRegion]) {
    regionState = INDIA_STATE_NAMES[rawRegion];
  } else if (rawCountry === "US" && US_STATE_NAMES[rawRegion]) {
    regionState = US_STATE_NAMES[rawRegion];
  }

  return {
    countryCode: rawCountry,
    countryName,
    regionCode: rawRegion,
    regionState,
    city: rawCity || regionState,
  };
}
