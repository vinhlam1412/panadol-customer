import React from 'react';
import { useNavigate } from 'react-router';

const FeatureCard = ({ index, imgSrc, title, primary, href }: {
  index: number,
  imgSrc: string,
  title: string,
  primary?: boolean,
  href: string
}) => {
  const navigate = useNavigate();

  return <div className="feature-card-wrapper cursor-pointer hover:bg-gray-100" onClick={() => navigate(href)}>
    <div className="feature-card-body p-4">
      <div className={`index ${primary ? 'index-primary' : ''}`}>
        <svg width="49" height="50" viewBox="0 0 49 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="15" cy="16" r="34" fill="currentColor" />
        </svg>
        <span className="text">{index}</span>
      </div>


      <img alt={""} className="text-center w-full" src={imgSrc} />
      <div className="title text-xl text-center mt-3">{title}</div>
    </div>
  </div>;
};

export default FeatureCard;
