import React, { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Section } from '../config/config';
import { NavColor } from 'src/types/settings';
import MobileTopNav from './mobile-top-nav';

const MobileLayout: FC<MobileLayoutProps> = (props) => {
  const { children, sections, navColor } = props;

  return (
    <div className='flex flex-col'>
      <MobileTopNav sections={sections as Section[]} />
      <div className='flex-1 flex flex-col max-w-full'>{children}</div>
    </div>
  );
};

interface MobileLayoutProps {
  children?: ReactNode;
  navColor?: NavColor;
  sections?: Section[];
}

MobileLayout.propTypes = {
  children: PropTypes.any,
  navColor: PropTypes.oneOf<NavColor>(['blend-in', 'discreet', 'evident']),
  sections: PropTypes.array
};

export default MobileLayout;
