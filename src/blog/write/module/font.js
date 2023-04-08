module.exports = (Quill) => {
  const fontFamilyArr = ["MapleStory", "NotoSans", "Roboto", "Sono", "NanumGothic"];
  let fonts = Quill.import("attributors/style/font");
  fonts.whitelist = fontFamilyArr;
  Quill.register(fonts, true);

  const fontSizeArr = ["8px", "10px", "11px", "12px", "14px", "18px", "24px", "36px", "48px"];
  var size = Quill.import("attributors/style/size");
  size.whitelist = fontSizeArr;
  Quill.register(size, true);

  return { fontFamilyArr, fontSizeArr };
}