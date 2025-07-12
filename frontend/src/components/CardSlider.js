import React, { useEffect, useState, useRef } from "react";
import "./CardSlider.css";

const CardSlider = () => {
  const [visible, setVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const currentRef = cardRef.current; // Store the reference before using it
  
    if (currentRef) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setVisible(true);
          }
        },
        { threshold: 0.3 }
      );
  
      observer.observe(currentRef);
  
      return () => {
        observer.unobserve(currentRef);
      };
    }
  }, []);  

  const cardData = [
    { id: 1, image: "/tab_app.jpg", title: "Smart Farming", desc: "Empowering agriculture with Smart Farming — where data meets the field for better yield and sustainability." },
    { id: 2, image: "/smart_app.jpg", title: "Weather Updates", desc: "Stay ahead of the weather and organize your farm like a pro — schedule, track, and manage all tasks in one place." },
    { id: 3, image: "/plant_dis.jpg", title: "Disease Prediction", desc: "Smart disease prediction feature helps you act fast, reduce losses, and ensure a healthier harvest." },
    { id: 4, image: "/farmer_deal.jpg", title: "Eliminate Middleman", desc: "Empowering farmers to sell smarter — send crop requests straight to vendors with full transparency." },
  ];

  return (
    <div className="service-content">
    <div className="services">
      <h1>Our Features</h1>
    </div>
    <div className="card-container" ref={cardRef}>
      {cardData.map((card, index) => (
        <div key={card.id} className={`card ${visible ? "slide-up" : ""}`} data-index={index}>
          <img src={card.image} alt={card.title} className="card-img" />
          <h3 className="txt-decor">{card.title}</h3>
          <p className="txt-decor">{card.desc}</p>
        </div>
      ))}
    </div>
    </div>
  );
};

export default CardSlider;
