function useScroll() {
  const smoothScroll = (target, offset = 0) => {
    let element;
    if (typeof target === "string") {
      element = (void 0).querySelector(target);
    } else {
      element = target;
    }
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + (void 0).pageYOffset;
      (void 0).scrollTo({
        top: elementPosition - offset,
        behavior: "smooth"
      });
    }
  };
  const scrollToTop = () => {
    smoothScroll("body");
  };
  return {
    smoothScroll,
    scrollToTop
  };
}

export { useScroll as u };
//# sourceMappingURL=useScroll-jpfBEZIf.mjs.map
