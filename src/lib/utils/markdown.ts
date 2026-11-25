function renderInline(raw: string): string {
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g,
      '<a href="$2" rel="noopener noreferrer" target="_blank">$1</a>',
    )
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
}

/** Markdown ringan: judul "## / ###", paragraf, **bold**, *italic*, [link](url), daftar "- item". HTML mentah di-escape. */
export function renderMarkdown(md: string): string {
  // Judul selalu menjadi blok sendiri, walau tidak dipisah baris kosong.
  const source = md.replace(/\r\n/g, "\n").replace(/^(#{1,3}[ \t]+.+)$/gm, "\n\n$1\n\n");
  const blocks = source.trim().split(/\n{2,}/);
  return blocks
    .map((block) => {
      const heading = /^(#{1,3})[ \t]+(.+)$/.exec(block);
      if (heading) {
        const level = heading[1].length === 3 ? "h3" : "h2";
        return `<${level}>${renderInline(heading[2])}</${level}>`;
      }
      const lines = block.split("\n");
      if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
        const items = lines
          .map((l) => `<li>${renderInline(l.replace(/^\s*[-*]\s+/, ""))}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }
      return `<p>${lines.map(renderInline).join("<br />")}</p>`;
    })
    .join("");
}
