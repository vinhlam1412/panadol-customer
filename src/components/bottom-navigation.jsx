import React from 'react';
import HomeActive from '../icons/home-activate.svg?react';
import HomeInactive from '../icons/home-deactive.svg?react';
import HistoryActive from '../icons/history-active.svg?react';
import HistoryInactive from '../icons/history-inactive.svg?react';
import RewardActive from '../icons/reward-active.svg?react';
import RewardInactive from '../icons/reward-inactive.svg?react';

import { BottomNavigation } from 'zmp-ui';
import { useNavigate } from 'react-router';

const MainBottomNavigation = ({ defaultActivate = null }) => {
  const [activeTab, setActiveTab] = React.useState(defaultActivate);
  const navigate = useNavigate();
  return <div>
    <BottomNavigation
      fixed
      activeKey={activeTab}
      onChange={(key) => {
        setActiveTab(key);
        navigate(key)
      }}
    >
      <BottomNavigation.Item
        key="/"
        onClick={() => navigate('/')}
        label={<div className="font-bold home-bottom">Trang chủ</div>}
        icon={<HomeInactive />}
        activeIcon={<HomeActive />}
      />
      <BottomNavigation.Item
        label={<div className="font-bold home-bottom">Trao quà</div>}
        key="history"
        onClick={() => navigate('/history')}
        icon={<HistoryInactive />}
        activeIcon={<HistoryActive />}
      />
      <BottomNavigation.Item
        label={<div className="font-bold home-bottom">Tạo đơn</div>}
        key="reward"
        onClick={() => navigate('/reward')}
        icon={<RewardInactive />}
        activeIcon={<RewardActive />}
      />
    </BottomNavigation>
  </div>;
};

export default MainBottomNavigation;
