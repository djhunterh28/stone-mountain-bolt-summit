(function () {
  var script = document.currentScript;
  var origin = "";
  try {
    origin = script && script.src ? new URL(script.src).origin : "";
  } catch (e) {
    origin = "";
  }
  function mount(el) {
    if (el.getAttribute("data-nl-mounted")) return;
    var slug = el.getAttribute("data-nl-form");
    if (!slug) return;
    el.setAttribute("data-nl-mounted", "1");
    var vendor = el.getAttribute("data-nl-vendor") || "";
    var iframe = document.createElement("iframe");
    var src = origin + "/f/" + encodeURIComponent(slug) + "?embed=1";
    if (vendor) src += "&vendor=" + encodeURIComponent(vendor);
    iframe.src = src;
    iframe.title = "Northline form";
    iframe.loading = "lazy";
    iframe.style.cssText = "width:100%;border:0;min-height:520px;display:block;background:transparent";
    el.appendChild(iframe);
  }
  document.querySelectorAll("[data-nl-form]").forEach(mount);
  window.addEventListener("message", function (e) {
    if (!e.data) return;
    if (e.data.type === "nl-form-height") {
      document.querySelectorAll("[data-nl-form] iframe").forEach(function (ifr) {
        if (ifr.contentWindow === e.source) ifr.style.height = Math.max(420, Number(e.data.height) || 520) + "px";
      });
    }
  });
})();
