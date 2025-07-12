import React, { useEffect, useState } from 'react';
import './home_page.css'; 
import CardSlider from './CardSlider';
import SellCropVisual from './SellCropVisual';

const HomePage = () => {
  const text = "Your Trusted Crop Care Companion !!"
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[index]);
        setIndex(index + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [index, text]);

  return (
    <>
    <div className='home'>
        <h1 className='wlcm-line'>Welcome to FreshFinds 
          <br/> 
          {displayText}
        </h1>
        <p className='wlcm-txt'>Modern technique for crop care and disease detection, tailored to your field.
        <br/>
        Connecting Farmers Directly to Buyers — No Middlemen, Just Fair Trade.
        </p>
    </div>
    <CardSlider />
    <SellCropVisual />
    </>
  );
};

export default HomePage;
