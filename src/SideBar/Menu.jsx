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
      setActivePostId: id => setActivePostId(id),
      setActivePost : post =>props.setActivePost(post)
    }
    if (cache[id] !== undefined) {
      menuProps.item = cache[id];
    }

    return <MenuItem {...menuProps} active={id === activePostId} />;
  }

  return (<aside>
    <List
      height={650}
      rowHeight={200}
      width={400}
      rowCount={safeGet(['length'], props.postIds, 0)}
      overscanRowCount={10}
      rowRenderer={rowRenderer}
      onRowsRendered={({ startIndex, stopIndex }) => setActivePostId(props.postIds[startIndex === 0 ? startIndex : Math.floor((startIndex + stopIndex) / 2)])}
    />
  </aside>);
}
