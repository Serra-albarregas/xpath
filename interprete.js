const buttonEjecutar = document.querySelector("#button-ejecutar");
const buttonEjemplo = document.querySelector("#button-ejemplo");
const xpathQuery = document.querySelector("#xpath");

buttonEjecutar.addEventListener("click", runXPath);
buttonEjemplo.addEventListener("click", restoreExampleXML);
xpathQuery.addEventListener("input", runXPath);

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
    const exampleXML = `<catalog>
    <book id="bk101" category="fiction">
      <title>Harry Potter</title>
      <author>J.K. Rowling</author>
      <price>29.99</price>
      <description>Once upon a time...</description>
    </book>
    <book id="bk102" category="non-fiction">
      <title>Steve Jobs</title>
      <author>Walter Isaacson</author>
      <price>24.95</price>
      <description>Biography of Steve Jobs.</description>
    </book>
    <book id="bk103" category="fiction">
      <title>The Hobbit</title>
      <author>J.R.R. Tolkien</author>
      <price>22.99</price>
      <description>An unexpected journey.</description>
    </book>
    <magazine id="mg201" category="science">
      <title>National Geographic</title>
      <issue>2023-09</issue>
    </magazine>
  </catalog>`;
    document.getElementById('xml').value = exampleXML;
}
