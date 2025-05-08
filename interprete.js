const buttonEjecutar = document.querySelector("#button-ejecutar");
const buttonEjemplo = document.querySelector("#button-ejemplo");
const xpathQuery = document.querySelector("#xpath");

buttonEjecutar.addEventListener("click", runXPath);
buttonEjemplo.addEventListener("click", restoreExampleXML);
xpathQuery.addEventListener("input", runXPath);

const copiables = document.querySelectorAll(".copiable");
copiables.forEach(element => {
  element.addEventListener("click", () => {
    copyToClipboard(element.textContent);
  });
});

function runXPath() {
    const xmlStr = document.getElementById('xml').value;
    const xpath = document.getElementById('xpath').value;
    const mode = document.getElementById('mode').value;
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = '';

    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlStr, 'text/xml');

        if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
            resultDiv.textContent = '❌ Error al parsear el XML.';
            return;
        }

        const nodes = xmlDoc.evaluate(xpath, xmlDoc, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        let node = nodes.iterateNext();
        let results = [];

        while (node) {
            if (mode === 'text') {
                results.push(node.textContent);
            } else {
                const serializer = new XMLSerializer();
                results.push(serializer.serializeToString(node));
            }
            node = nodes.iterateNext();
        }

        resultDiv.textContent = results.length > 0 ? results.join('\n\n') : '⚠️ No se encontraron resultados.';
    } catch (e) {
        resultDiv.textContent = `❌ Error: ${e.message}`;
    }
}

function restoreExampleXML() {
    const exampleXML = 
`<catalog>
  <section name="Books">
    <book id="bk101" category="fiction">
      <title>Harry Potter</title>
      <authors>
        <author nationality="UK">J.K. Rowling</author>
      </authors>
      <price currency="USD">29.99</price>
      <description>
        <summary>Once upon a time...</summary>
        <keywords>
          <keyword>Magic</keyword>
          <keyword>Wizards</keyword>
        </keywords>
      </description>
    </book>
    <book id="bk102" category="non-fiction">
      <title>Steve Jobs</title>
      <authors>
        <author nationality="US">Walter Isaacson</author>
      </authors>
      <price currency="USD">24.95</price>
      <description>
        <summary>Biography of Steve Jobs.</summary>
        <keywords>
          <keyword>Technology</keyword>
          <keyword>Apple</keyword>
        </keywords>
      </description>
    </book>
    <book id="bk103" category="fiction">
      <title>The Hobbit</title>
      <authors>
        <author nationality="UK">J.R.R. Tolkien</author>
      </authors>
      <price currency="USD">22.99</price>
      <description>
        <summary>An unexpected journey.</summary>
      </description>
    </book>
    <book id="bk104" category="non-fiction">
      <title>¿Y si fuéramos nosotros?</title>
      <authors>
        <author nationality="US">Becky Albertalli</author>
        <author nationality="US">Adam Silvera</author>
      </authors>
      <price currency="EUR" status="sale">15.20</price>
      <description>
        <summary>Arthur is alone in New York.</summary>
      </description>
    </book>
  </section>

  <section name="Magazines">
    <magazine id="mg201" category="science">
      <title>National Geographic</title>
      <issue>
        <date>2023-09</date>
        <editor>Jane Doe</editor>
      </issue>
    </magazine>
    <magazine id="mg202" category="history">
      <title>Historia National</title>
      <issue>
        <date>2024-01</date>
        <editor nationality="ES">Carlos Ruiz</editor>
      </issue>
    </magazine>
  </section>
</catalog>`;
    document.getElementById('xml').value = exampleXML;
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    Swal.fire({
      icon: 'success',
      title: 'Texto copiado',
      text: text,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
  }).catch(err => {
    Swal.fire({
      icon: 'error',
      title: 'Error al copiar',
      text: err,
    });
  });
}