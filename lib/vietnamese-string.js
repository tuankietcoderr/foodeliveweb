const VietnameseSigns = [
  "aAeEoOuUiIdDyY",

  "áàạảãâấầậẩẫăắằặẳẵ",

  "ÁÀẠẢÃÂẤẦẬẨẪĂẮẰẶẲẴ",

  "éèẹẻẽêếềệểễ",

  "ÉÈẸẺẼÊẾỀỆỂỄ",

  "óòọỏõôốồộổỗơớờợởỡ",

  "ÓÒỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠ",

  "úùụủũưứừựửữ",

  "ÚÙỤỦŨƯỨỪỰỬỮ",

  "íìịỉĩ",

  "ÍÌỊỈĨ",

  "đ",

  "Đ",

  "ýỳỵỷỹ",

  "ÝỲỴỶỸ",
];

export const convertToUnSign = (str) => {
  for (let i = 1; i < VietnameseSigns.length; i++) {
    for (let j = 0; j < VietnameseSigns[i].length; j++) {
      str = str.replace(VietnameseSigns[i][j], VietnameseSigns[0][i - 1]);
    }
  }
  return str;
};
