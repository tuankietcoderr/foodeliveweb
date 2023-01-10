export function toDot(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function toMoney(x) {
  const f = new Intl.NumberFormat("vi-VN", {
    currency: "VND",
    style: "currency",
  });
  return f.format(x);
}
