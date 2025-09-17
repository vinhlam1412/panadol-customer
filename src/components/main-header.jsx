import React from 'react';
import MainHeaderImg from '../images/header.png';
import { Icon } from 'zmp-ui';

const MainHeader = ({ title }) => {
  return <div className="w-full relative">
    <img className="h-16 w-full" src={MainHeaderImg} />
    <h4 className='absolute bottom-2 -translate-x-1/2 text-sm sm:text-xl left-1/2 font-bold text-white mb-2'>{title}</h4>
    {/* <button><Icon icon='zi-arrow-left'></Icon></button> */}
  </div>;
};

export default MainHeader;
