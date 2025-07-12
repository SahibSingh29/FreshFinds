import React from 'react';
import './SellCropVisual.css'; 
import { useNavigate } from 'react-router-dom';

const SellCropVisual = () => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/vendors')
    }

  return (
    <>
    <div className='SellCrop'>
        <div className='InfoText'>
            <h1>Platform where farmers can sell crops to vendors</h1>
            <h2>Main aim is to:</h2>
            <ul className='aim'>
              <li>Remove Middleman.</li>
              <br/>
              <li>Provide farmers more knowledge.</li>
              <br/>
              <li>Make farmers' daily activities easier.</li>
              <br/>
              <li>Provide updates to the farmer.</li>
            </ul>
        </div>

        <div className='SellButton'>
            <button className='SellBtn' onClick={handleNavigate}>Sell your Crops</button>
        </div>
        
    </div>
    </>
  );
};

export default SellCropVisual;
