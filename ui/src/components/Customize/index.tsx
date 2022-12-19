import { FC, memo, useEffect } from 'react';

import { customizeStore } from '@/stores';

const CUSTOM_MARK_HEAD = 'customize_head';
const CUSTOM_MARK_HEADER = 'customize_header';
const CUSTOM_MARK_FOOTER = 'customize_footer';

const makeMarker = (mark) => {
  return `<!--${mark}-->`;
};

type pos = 'afterbegin' | 'beforeend';
const renderCustomArea = (el, part, pos: pos, content: string = '') => {
  let startMarkNode;
  let endMarkNode;
  const { childNodes } = el;
  for (let i = 0; i < childNodes.length; i += 1) {
    const node = childNodes[i];
    if (node.nodeType === 8 && node.nodeValue === part) {
      if (!startMarkNode) {
        startMarkNode = node;
      } else {
        endMarkNode = node;
        break;
      }
    }
  }
  if (startMarkNode && endMarkNode) {
    while (
      startMarkNode.nextSibling &&
      startMarkNode.nextSibling !== endMarkNode
    ) {
      el.removeChild(startMarkNode.nextSibling);
    }
  }
  if (startMarkNode) {
    el.removeChild(startMarkNode);
  }
  if (endMarkNode) {
    el.removeChild(endMarkNode);
  }
  el.insertAdjacentHTML(pos, makeMarker(part));
  el.insertAdjacentHTML(pos, content);
  el.insertAdjacentHTML(pos, makeMarker(part));
};
const handleCustomHead = (content) => {
  const el = document.head;
  renderCustomArea(el, CUSTOM_MARK_HEAD, 'beforeend', content);
};

const handleCustomHeader = (content) => {
  const el = document.body;
  renderCustomArea(el, CUSTOM_MARK_HEADER, 'afterbegin', content);
};

const handleCustomFooter = (content) => {
  const el = document.documentElement;
  renderCustomArea(el, CUSTOM_MARK_FOOTER, 'beforeend', content);
};

const Index: FC = () => {
  const { custom_head, custom_header, custom_footer } = customizeStore(
    (state) => state,
  );
  useEffect(() => {
    setTimeout(() => {
      handleCustomHead(custom_head);
    }, 1000);
    handleCustomHeader(custom_header);
    handleCustomFooter(custom_footer);
  }, [custom_head, custom_header, custom_footer]);
  return (
    <>
      {null}
      {/* App customize */}
    </>
  );
};

export default memo(Index);
