'use client';

import React from 'react';

interface Props { text: string; }

export function MessageText({ text }: Props) {
  const lines = text.split('\n').filter((l, i, arr) =>
    !(l.trim() === '' && (i === 0 || i === arr.length - 1))
  );

  function renderInline(str: string): React.ReactNode[] {
    // Bold: **text**
    // Italic: *text* (not preceded/followed by *)
    const parts: React.ReactNode[] = [];
    let remaining = str;
    let key = 0;
    while (remaining.length > 0) {
      const boldIdx = remaining.indexOf('**');
      const italIdx = remaining.search(/(?<!\*)\*(?!\*)/);
      const first   = [boldIdx, italIdx].filter(i => i >= 0).sort((a, b) => a - b)[0];
      if (first === undefined || first < 0) {
        parts.push(remaining);
        break;
      }
      if (remaining.slice(0, first)) parts.push(remaining.slice(0, first));
      if (first === boldIdx) {
        const end = remaining.indexOf('**', boldIdx + 2);
        if (end < 0) { parts.push(remaining); break; }
        parts.push(<strong key={key++}>{remaining.slice(boldIdx + 2, end)}</strong>);
        remaining = remaining.slice(end + 2);
      } else {
        const end = remaining.indexOf('*', italIdx + 1);
        if (end < 0) { parts.push(remaining); break; }
        parts.push(<em key={key++}>{remaining.slice(italIdx + 1, end)}</em>);
        remaining = remaining.slice(end + 1);
      }
    }
    return parts;
  }

  const elements: React.ReactNode[] = [];
  let bulletGroup: string[] = [];
  let numGroup: string[] = [];

  function flushBullets() {
    if (!bulletGroup.length) return;
    elements.push(
      <ul key={elements.length} className="list-disc list-inside text-sm space-y-0.5 my-1">
        {bulletGroup.map((b, i) => <li key={i}>{renderInline(b)}</li>)}
      </ul>
    );
    bulletGroup = [];
  }

  function flushNums() {
    if (!numGroup.length) return;
    elements.push(
      <ol key={elements.length} className="list-decimal list-inside text-sm space-y-0.5 my-1">
        {numGroup.map((n, i) => <li key={i}>{renderInline(n.replace(/^\d+\.\s*/, ''))}</li>)}
      </ol>
    );
    numGroup = [];
  }

  for (const line of lines) {
    if (/^[-•]\s+/.test(line)) {
      flushNums();
      bulletGroup.push(line.replace(/^[-•]\s+/, ''));
    } else if (/^\d+\.\s+/.test(line)) {
      flushBullets();
      numGroup.push(line);
    } else if (line.trim() === '') {
      flushBullets(); flushNums();
      elements.push(<div key={elements.length} className="h-1" />);
    } else {
      flushBullets(); flushNums();
      elements.push(
        <p key={elements.length} className="text-sm leading-relaxed">
          {renderInline(line)}
        </p>
      );
    }
  }

  flushBullets();
  flushNums();

  return <div className="flex flex-col gap-0.5">{elements}</div>;
}
