import type { ReactNode } from "react";

function inlineMarkdown(value: string): ReactNode[] {
  const pattern = /(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|~~[^~]+~~|(?<!\*)\*[^*]+\*)/g;
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(value))) {
    if (match.index > cursor) nodes.push(value.slice(cursor, match.index));
    const token = match[0];
    if (token.startsWith("[")) {
      const link = token.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
      if (link) nodes.push(<a key={match.index} href={link[2]} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-[#0F4C45]">{link[1]}</a>);
      else nodes.push(token);
    } else if (token.startsWith("`")) nodes.push(<code key={match.index} className="rounded bg-black/5 px-1 py-0.5 font-mono text-[0.92em]">{token.slice(1, -1)}</code>);
    else if (token.startsWith("**") || token.startsWith("__")) nodes.push(<strong key={match.index} className="font-semibold">{token.slice(2, -2)}</strong>);
    else if (token.startsWith("~~")) nodes.push(<del key={match.index}>{token.slice(2, -2)}</del>);
    else nodes.push(<em key={match.index}>{token.slice(1, -1)}</em>);
    cursor = match.index + token.length;
  }
  if (cursor < value.length) nodes.push(value.slice(cursor));
  return nodes;
}

function tableCells(line: string) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}

export function AuraMarkdown({ text }: { text: string }) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;
  let blockId = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) { index++; continue; }

    const codeStart = line.match(/^\s*```([\w+-]*)\s*$/);
    if (codeStart) {
      const language = codeStart[1];
      const code: string[] = [];
      index++;
      while (index < lines.length && !/^\s*```\s*$/.test(lines[index])) code.push(lines[index++]);
      if (index < lines.length) index++;
      blocks.push(<pre key={blockId++} className="my-3 overflow-x-auto rounded-xl bg-[#132E2A] p-3 text-[11px] text-white sm:text-xs"><code className={language ? `language-${language}` : undefined}>{code.join("\n")}</code></pre>);
      continue;
    }

    if (line.includes("|") && index + 1 < lines.length && /^\s*\|?\s*:?-{3,}/.test(lines[index + 1])) {
      const headers = tableCells(line);
      index += 2;
      const rows: string[][] = [];
      while (index < lines.length && lines[index].includes("|")) rows.push(tableCells(lines[index++]));
      blocks.push(
        <div key={blockId++} className="my-3 overflow-x-auto">
          <table className="w-full border-collapse text-left text-[11px] sm:text-xs">
            <thead><tr>{headers.map((cell, i) => <th key={i} className="border border-[#E5DECF] bg-[#FAF7F2] px-2 py-1.5 font-semibold">{inlineMarkdown(cell)}</th>)}</tr></thead>
            <tbody>{rows.map((row, r) => <tr key={r}>{headers.map((_, c) => <td key={c} className="border border-[#E5DECF] px-2 py-1.5">{inlineMarkdown(row[c] || "")}</td>)}</tr>)}</tbody>
          </table>
        </div>
      );
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const className = level <= 2 ? "mt-3 mb-1 font-serif text-base font-bold" : "mt-2 mb-1 font-semibold";
      blocks.push(<h3 key={blockId++} className={className}>{inlineMarkdown(heading[2])}</h3>);
      index++;
      continue;
    }

    if (/^\s*(?:[-*_]\s*){3,}$/.test(line)) {
      blocks.push(<hr key={blockId++} className="my-3 border-[#E5DECF]" />);
      index++;
      continue;
    }

    const listItem = line.match(/^\s*([-+*]|\d+\.)\s+(.+)$/);
    if (listItem) {
      const ordered = /\d+\./.test(listItem[1]);
      const items: string[] = [];
      while (index < lines.length) {
        const item = lines[index].match(/^\s*([-+*]|\d+\.)\s+(.+)$/);
        if (!item || /\d+\./.test(item[1]) !== ordered) break;
        items.push(item[2]);
        index++;
      }
      const List = ordered ? "ol" : "ul";
      blocks.push(<List key={blockId++} className={`my-2 space-y-1 pl-5 ${ordered ? "list-decimal" : "list-disc"}`}>{items.map((item, i) => <li key={i}>{inlineMarkdown(item)}</li>)}</List>);
      continue;
    }

    if (/^\s*>/.test(line)) {
      const quote: string[] = [];
      while (index < lines.length && /^\s*>/.test(lines[index])) quote.push(lines[index++].replace(/^\s*>\s?/, ""));
      blocks.push(<blockquote key={blockId++} className="my-2 border-l-2 border-[#C8A96A] pl-3 text-charcoal/75">{inlineMarkdown(quote.join(" "))}</blockquote>);
      continue;
    }

    const paragraph: string[] = [];
    while (index < lines.length && lines[index].trim() && !/^\s*```/.test(lines[index]) && !/^#{1,6}\s/.test(lines[index]) && !/^\s*([-+*]|\d+\.)\s+/.test(lines[index]) && !/^\s*>/.test(lines[index])) paragraph.push(lines[index++]);
    blocks.push(<p key={blockId++} className="my-1.5 leading-relaxed">{inlineMarkdown(paragraph.join(" "))}</p>);
  }

  return <div className="break-words">{blocks}</div>;
}
