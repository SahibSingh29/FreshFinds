import React, { useState } from 'react';
import './ImageUpload.css';

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [lineMoving, setLineMoving] = useState(false); 

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    setPrediction(''); 
    setLineMoving(true); 

    setTimeout(async () => {
      try {
        const response = await fetch('http://localhost:8000/predict/', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        setPrediction(data.prediction); 
      } catch (error) {
        console.error("Error uploading file:", error);
      }

      setLineMoving(false); 
    }, 2000); 
  };

  return (
    <div className='main-fol'>
    <div className="image-upload-container">
      <h2 className="upload-heading">Upload an Image for Disease Prediction</h2>
      
      <div className="file-input-wrapper">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
        />
        <button
          className="upload-btn"
          onClick={handleUpload}
        >
          Upload
        </button>
      </div>

      {imagePreview && (
        <div className="image-preview-wrapper">
          <img src={imagePreview} alt="Uploaded Preview" className="image-preview" />
          
          {lineMoving && <div className="moving-line"></div>}
        </div>
      )}

      {prediction && <p className="prediction-text"><strong>Prediction:</strong> {prediction}</p>}
    </div>
    </div>
  );
};

export default ImageUpload;
