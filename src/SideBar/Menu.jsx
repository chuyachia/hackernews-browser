import React, { useState } from "react";
import { List } from "react-virtualized";

import MenuItem from './MenuItem';
import { safeGet } from '../util';

export default (props) => {
  const [activePostId, setActivePostId] = useState(undefined);
  let cache = {};

  const setCache = (id,item) => {
    cache[id] = item;
  }

  const rowRenderer = ({ index, key, style }) => {
    const id = props.postIds[index];
    const menuProps = {
      style,
      key,
      id,
      setCache,
      index,
      onItemClick: setActivePostId,
      onActivePostChange : props.onActivePostChange,
    }
    if (cache[id] !== undefined) {
      menuProps.item = cache[id];
    }

    return <MenuItem {...menuProps} active={id === activePostId} />;
  }

  const setMiddlePostActive = ({ overscanStartIndex, startIndex, stopIndex }) => {
    setActivePostId(overscanStartIndex == startIndex ? props.postIds[0] : props.postIds[Math.floor((startIndex + stopIndex) / 2)]);
  }

  return (
    <aside>
      <List
        height={650}
        rowHeight={200}
        width={400}
        rowCount={safeGet(['length'], props.postIds, 0)}
        overscanRowCount={10}
        rowRenderer={rowRenderer}
        onRowsRendered={setMiddlePostActive}
      />
    </aside>);
}
