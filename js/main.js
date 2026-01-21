function load(id, file) {
  fetch(file)
    .then((res) => res.text())
    .then((html) => {
      document.getElementById(id).innerHTML = html;
    });
}

load("toolbar", "components/toolbar.html");
load("sidebar-left", "components/sidebar-left.html");
load("sidebar-right", "components/sidebar-right.html");
