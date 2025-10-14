(function () {
  try {
    if (window.top === window.self) {
      document.getElementById('anti-clickjacking-style')?.remove();
      document.documentElement.style.removeProperty('display');
      return;
    }

    document.documentElement.style.setProperty('display', 'none', 'important');
    window.top.location = window.self.location;
  } catch (_error) {
    document.documentElement.style.setProperty('display', 'none', 'important');
  }
})();
