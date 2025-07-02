// Editor – Export XML
function exportXML() {
  const klasse = document.getElementById("klasse").value;
  const thema = document.getElementById("thema").value;
  const titel = document.getElementById("titel").value;
  const aufgaben = document.getElementById("aufgaben").value.split("\n");

  const xmlDoc = document.implementation.createDocument("", "", null);
  const root = xmlDoc.createElement("lerninhalt");
  const klasseNode = xmlDoc.createElement("klasse");
  klasseNode.setAttribute("stufe", klasse);

  const themaNode = xmlDoc.createElement("thema");
  themaNode.setAttribute("name", thema);

  const abschnitt = xmlDoc.createElement("abschnitt");
  const titelNode = xmlDoc.createElement("titel");
  titelNode.textContent = titel;

  const aufgabenNode = xmlDoc.createElement("aufgaben");
  aufgaben.forEach(text => {
    const aufgabe = xmlDoc.createElement("aufgabe");
    aufgabe.textContent = text;
    aufgabenNode.appendChild(aufgabe);
  });

  abschnitt.appendChild(titelNode);
  abschnitt.appendChild(aufgabenNode);
  themaNode.appendChild(abschnitt);
  klasseNode.appendChild(themaNode);
  root.appendChild(klasseNode);
  xmlDoc.appendChild(root);

  const serializer = new XMLSerializer();
  const xmlString = serializer.serializeToString(xmlDoc);
  document.getElementById("xmlOutput").textContent = xmlString;
}

// Show-Modus – Datei laden & anzeigen
document.getElementById("fileLoader")?.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(event.target.result, "text/xml");
    renderContent(xml);
  };
  reader.readAsText(file);
});

function renderContent(xml) {
  const container = document.getElementById("content");
  container.innerHTML = "";

  const klassen = xml.getElementsByTagName("klasse");
  for (const klasse of klassen) {
    const stufe = klasse.getAttribute("stufe");
    const section = document.createElement("section");
    section.innerHTML = `<h2>Klasse ${stufe}</h2>`;

    const themen = klasse.getElementsByTagName("thema");
    for (const thema of themen) {
      const themaname = thema.getAttribute("name");
      const h3 = document.createElement("h3");
      h3.textContent = themaname;
      section.appendChild(h3);

      const abschnitte = thema.getElementsByTagName("abschnitt");
      for (const abschnitt of abschnitte) {
        const titel = abschnitt.getElementsByTagName("titel")[0].textContent;
        const details = document.createElement("details");
        const summary = document.createElement("summary");
        summary.textContent = titel;
        details.appendChild(summary);

        const aufgaben = abschnitt.getElementsByTagName("aufgabe");
        for (const aufgabe of aufgaben) {
          const p = document.createElement("p");
          p.textContent = aufgabe.textContent;
          details.appendChild(p);
        }

        section.appendChild(details);
      }
    }

    container.appendChild(section);
  }
}
