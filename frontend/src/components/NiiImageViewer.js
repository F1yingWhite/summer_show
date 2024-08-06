import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { Slider, Alert } from 'antd';

const NiiImageViewer = ({ niiname }) => {
  const [index, setIndex] = useState(0);
  const [imageSrc, setImageSrc] = useState('');
  const [nextImageSrc, setNextImageSrc] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const totalSlices = 50;

  const imageRef = useRef(null);
  const [sliderWidth, setSliderWidth] = useState(300);

  const fetchImage = useCallback(async (sliceIndex) => {
    setError(null);
    setLoading(true);
    try {
      const encodedNiiName = encodeURIComponent(niiname);
      const response = await axios.get(`http://10.130.128.52:10023/api/nii/${encodedNiiName}/${sliceIndex}`, {
        responseType: 'blob',
      });
      const imageObjectURL = URL.createObjectURL(response.data);
      setNextImageSrc(imageObjectURL);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [niiname]);

  useEffect(() => {
    fetchImage(index);
  }, [fetchImage, index]);

  useEffect(() => {
    if (imageRef.current) {
      setSliderWidth(imageRef.current.clientWidth);
    }
  }, [imageSrc]);

  const handleSliderChange = (value) => {
    setIndex(value);
  };

  const handleImageLoad = () => {
    setImageSrc(nextImageSrc);
    setLoading(false);
  };

  return (
    <div>
      {error && <Alert message={`Error: ${error}`} type="error" />}
      <div style={{ position: 'relative' }}>
        {imageSrc && (
          <img
            ref={imageRef}
            src={imageSrc}
            alt={`Slice ${index}`}
            style={{ maxWidth: '100%', maxHeight: '600px' }}
          />
        )}
        {nextImageSrc && (
          <img
            src={nextImageSrc}
            alt={`Slice ${index}`}
            style={{ maxWidth: '100%', maxHeight: '600px', display: 'none' }}
            onLoad={handleImageLoad}
          />
        )}
      </div>
      <div style={{ marginTop: 16 }}>
        <Slider
          min={0}
          max={totalSlices - 1}
          value={index}
          onChange={handleSliderChange}
          tooltip={{ formatter: (value) => `Slice: ${value + 1}` }}
          style={{ width: sliderWidth }}
        />
      </div>
    </div>
  );
};

export default NiiImageViewer;
