module.exports = (Quill) => {
  const code = Quill.import("formats/code");

  Quill.register(code, true);
  return code;
}