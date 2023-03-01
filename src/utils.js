export function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

export async function queryFeatureServer({
  url,
  outFields = "*",
  geometryPrecision = 5,
  where = "1=1",
}) {
  /* Query a feature server */

  // The query params
  let params = {
    f: "geojson",
    outFields: outFields,
    geometryPrecision: geometryPrecision,
    where: where,
  };

  // Get the param string
  let params_str = Object.entries(params)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");

  const options = {
    method: "POST",
    body: new URLSearchParams(params_str),
  };

  const r = await fetch(`${url}/query`, options);
  const result = await r.json();
  return result;
}

export function ordinal(number) {
  const ordinalRules = new Intl.PluralRules("en", {
    type: "ordinal",
  });
  const suffixes = {
    one: "st",
    two: "nd",
    few: "rd",
    other: "th",
  };
  const suffix = suffixes[ordinalRules.select(number)];
  return suffix;
}
