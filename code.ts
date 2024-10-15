let foundFonts: string[], output: string, mode: readonly SceneNode[];

figma.showUI(__html__, { width: 700, height: 500 });

figma.ui.onmessage = (message) => {
  foundFonts = [];
  output = '';
  mode = null;

  if (message.type === 'entire' || message.type === 'selection') {
    message.type === 'entire' ? (mode = figma.currentPage.children) : (mode = figma.currentPage.selection);

    for (const node of mode) searchForFonts(node);

    if (foundFonts.length > 0) {
      foundFonts.sort();

      output += '<tr><th>Family</th><th>Style</th><th>Size</th><th>Raw data</th></tr>';

      foundFonts.forEach((font) => (output += `<tr>${font}</tr>`));

      figma.ui.postMessage(output);
    } else {
      figma.ui.postMessage(`No fonts detected in ${message.type === 'entire' ? 'entire document' : 'selection'}!`);
    }
  } else figma.closePlugin();
};

function searchForFonts(node: any) {
  if (node.type === 'TEXT' && typeof node.fontSize === 'number') {
    const text = `<td>${node.fontName.family}</td><td>${node.fontName.style}</td><td>${node.fontSize}px</td><td>${node.fontName.family}, ${node.fontName.style}, ${node.fontSize}px</td>`;
    //@ts-ignore
    if (!foundFonts.includes(text)) foundFonts.push(text);
  } else if (node.children !== undefined) {
    for (let i = 0; i < node.children.length; i++) {
      searchForFonts(node.children[i]);
    }
  }
}
