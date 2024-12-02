import React, { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Section } from '../config/config';
import { TabletNav } from './tablet-nav';
import { NavColor } from 'src/types/settings';
import { TABLET_NAV_WIDTH } from 'src/config';

const TabletLayout: FC<TabletLayoutProps> = (props) => {
  const { children, sections, navColor } = props;

  return (
    <div className='flex'>
      <TabletNav color={navColor} sections={sections} />
      <div className={`flex-1 flex flex-col max-w-full`} style={{ paddingLeft: TABLET_NAV_WIDTH }}>
        {children}
      </div>
    </div>
  );
};

interface TabletLayoutProps {
  children?: ReactNode;
  navColor?: NavColor;
  sections?: Section[];
}

TabletLayout.propTypes = {
  children: PropTypes.any,
  navColor: PropTypes.oneOf<NavColor>(['blend-in', 'discreet', 'evident']),
  sections: PropTypes.array
};

export default TabletLayout;
