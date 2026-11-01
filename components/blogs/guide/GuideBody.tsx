import type { ReactNode } from "react";
import type { GuideBlock, Inline } from "@/lib/guideMarkdown";

export default function GuideBody({ blocks }: { blocks: GuideBlock[] }) {
  return (
    <div className="guide-body">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const Tag = block.level === 2 ? "h2" : block.level === 3 ? "h3" : "h4";
          return (
            <Tag id={block.id} key={block.id}>
              {block.text}
            </Tag>
          );
        }
        if (block.type === "paragraph") {
          return <p key={`p-${index}`}>{renderInlines(block.children)}</p>;
        }
        if (block.type === "list") {
          return (
            <ul key={`list-${index}`}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderInlines(item)}</li>
              ))}
            </ul>
          );
        }
        if (block.type === "image") {
          return (
            <figure className="guide-figure" key={`image-${index}`}>
              <img src={encodeURI(block.src)} alt={block.alt} />
            </figure>
          );
        }
        return (
          <div className="guide-table-wrap" key={`table-${index}`}>
            <table>
              <thead>
                <tr>
                  {block.headers.map((cell, cellIndex) => (
                    <th key={cellIndex} scope="col">
                      {renderInlines(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{renderInlines(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

function renderInlines(nodes: Inline[]): ReactNode {
  return nodes.map((node, index) => {
    if (node.type === "text") return <span key={index}>{node.text}</span>;
    if (node.type === "strong") return <strong key={index}>{renderInlines(node.children)}</strong>;
    return (
      <a key={index} href={node.href} target="_blank" rel="noopener noreferrer">
        {renderInlines(node.children)}
      </a>
    );
  });
}
