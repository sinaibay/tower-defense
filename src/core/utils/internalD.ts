export function internalD(
  p0: google.maps.LatLng,
  p1: google.maps.LatLng
): number {
  const lat0 = p0.lat();
  const lng0 = p0.lng();
  const lat1 = p1.lat();
  const lng1 = p1.lng();
  const p = 0.017453292519943295; // Math.PI / 180
  const c = Math.cos;
  const a =
    0.5 -
    c((lat1 - lat0) * p) / 2 +
    (c(lat0 * p) * c(lat1 * p) * (1 - c((lng1 - lng0) * p))) / 2;

  return 12742 * Math.asin(Math.sqrt(a)) * 1000; // 2 * R; R = 6371 km
}
