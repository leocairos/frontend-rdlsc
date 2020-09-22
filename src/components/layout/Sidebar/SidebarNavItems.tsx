import React from 'react';

import SidebarNavItem, { ISidebarNavItemProps } from './SidebarNavItem';

export interface ISidebarNavItemsProps {
  items: ISidebarNavItemProps[];
  isNested?: boolean;
  isCollapsed?: boolean;
}

const SidebarNavItems: React.FC<ISidebarNavItemsProps> = (
  props: ISidebarNavItemsProps,
) => {
  const { items = [], isCollapsed = false, isNested = false } = props;
  // const classes = useStyles()

  return (
    <>
      {items.map((item, index) => (
        <SidebarNavItem
          {...item}
          isCollapsed={isCollapsed}
          isNested={isNested}
          key={index}
        />
      ))}
    </>
  );
};

export default SidebarNavItems;
