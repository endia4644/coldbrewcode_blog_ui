module.exports = (Quill) => {
  const BaseImage = Quill.import("formats/image");

  const ATTRIBUTES = ["alt", "height", "width", "style"];

  class Image extends BaseImage {
    static formats(domNode) {
      return ATTRIBUTES.reduce(function (formats, attribute) {
        if (domNode.hasAttribute(attribute)) {
          formats[attribute] = domNode.getAttribute(attribute);
        }
        return formats;
      }, {});
    }
  }

  Quill.register(Image, true);
  return Image;
}