import React from "react";
import jamesWebbImg from "../imgs/jameswebb.jpg";

const JamesWebb = () => {
  return (
    <div style={styles.container}>
      <img src={jamesWebbImg} alt="James Webb Space Telescope" style={styles.image} />
      <div style={styles.content}>
        <h1>The James Webb Space Telescope (JWST)</h1>
        <p>The James Webb Space Telescope (JWST), often dubbed Hubble's "big brother," is a triumph of modern astronomy. Unveiled as the next-generation space observatory, JWST is primarily focused on infrared wavelengths, allowing it to penetrate cosmic dust and unveil hidden universes. Stationed a staggering million miles from Earth at the L2 Lagrange point, it benefits from a stable and interference-free environment. With a mirror size dwarfing Hubble's, JWST promises unparalleled clarity and depth in its cosmic pursuits. From uncovering the earliest galaxies formed after the Big Bang to probing the atmospheres of distant exoplanets, JWST is set to redefine our understanding of space and our place within it.</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#f4f4f4',
    height: '100vh',
    textAlign: 'center',
    paddingTop: '1rem'
  },
  image: {
    maxWidth: '400px',
    height: '400px',
    marginBottom: '20px'
  },
  content: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    width: '80%'
  }
};

export default JamesWebb;
