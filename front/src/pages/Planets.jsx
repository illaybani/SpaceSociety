import React from 'react';
import mercuryImg from "../imgs/mercury.jpg";
import venusImg from "../imgs/venus.png";
import earthImg from "../imgs/earth.jpg";
import marsImg from "../imgs/mars.png";
import jupiterImg from "../imgs/jupiter.jpg";
import saturnImg from "../imgs/saturn.png";
import uranusImg from "../imgs/uranus.jpg";
import neptuneImg from "../imgs/neptune.jpg";

const Planets = () => {
  return (
    <div style={styles.mainContainer}>

      <div style={styles.planetContainer}>
        <img src={mercuryImg} alt="Mercury" style={styles.planetImg} />
        <p style={styles.planetDescription}><span style={{ fontWeight: 'bold' }}>Mercury</span>: The smallest and closest planet to the Sun, Mercury is a rocky world with a heavily cratered surface. Due to its proximity to the Sun, it experiences extreme temperature variations, ranging from scorching hot during the day to freezing cold at night. It has no significant atmosphere, which means it has no weather or breathable air.</p>
      </div>

      <div style={styles.planetContainer}>
        <img src={venusImg} alt="Venus" style={styles.planetImg} />
        <p style={styles.planetDescription}><span style={{ fontWeight: 'bold' }}>Venus</span>: Often referred to as Earth's "sister planet" due to its similar size and composition, Venus is a rocky world with a thick atmosphere that's primarily composed of carbon dioxide, with clouds of sulfuric acid. This dense atmosphere causes a strong greenhouse effect, making Venus the hottest planet in our solar system.</p>
      </div>

      <div style={styles.planetContainer}>
        <img src={earthImg} alt="Earth" style={styles.planetImg} />
        <p style={styles.planetDescription}><span style={{ fontWeight: 'bold' }}>Earth</span>: Our home planet, Earth, is the third planet from the Sun and the only known celestial body to support life. A unique combination of liquid water, a stable atmosphere, and a suitable distance from the Sun allows for a wide range of living organisms to flourish here.</p>
      </div>

      <div style={styles.planetContainer}>
        <img src={marsImg} alt="Mars" style={styles.planetImg} />
        <p style={styles.planetDescription}><span style={{ fontWeight: 'bold' }}>Mars</span>: Known as the "Red Planet" due to its reddish appearance, Mars is a rocky planet with a thin atmosphere. Evidence suggests that Mars once had liquid water on its surface and may have been hospitable to life. Today, it has polar ice caps made of water and carbon dioxide, and scientists are keen to explore its potential to support life.</p>
      </div>

      <div style={styles.planetContainer}>
        <img src={jupiterImg} alt="Jupiter" style={styles.planetImg} />
        <p style={styles.planetDescription}><span style={{ fontWeight: 'bold' }}>Jupiter</span>: The largest planet in our solar system, Jupiter is a gas giant primarily composed of hydrogen and helium. It's known for its Great Red Spot, a massive storm that's raged for centuries. Jupiter's strong magnetic field and dozens of moons, including the notable Ganymede (the largest moon in the solar system), make it a focal point of astronomical study.</p>
      </div>

      <div style={styles.planetContainer}>
        <img src={saturnImg} alt="Saturn" style={styles.planetImg} />
        <p style={styles.planetDescription}><span style={{ fontWeight: 'bold' }}>Saturn</span>: Recognized by its stunning ring system, Saturn is another gas giant primarily made up of hydrogen and helium. Its rings are composed of ice particles and rock debris, which orbit the planet at various distances. Saturn also has a multitude of moons, with Titan being the most significant due to its thick atmosphere and evidence of liquid lakes.</p>
      </div>

      <div style={styles.planetContainer}>
        <img src={uranusImg} alt="Uranus" style={styles.planetImg} />
        <p style={styles.planetDescription}><span style={{ fontWeight: 'bold' }}>Uranus</span>: A gas giant with a distinct blue-green hue, Uranus is unique because it rotates on its side, possibly due to a colossal collision in its past. It has a frigid atmosphere made mostly of hydrogen, helium, and methane, and it's surrounded by a thin set of rings.</p>
      </div>

      <div style={styles.planetContainer}>
        <img src={neptuneImg} alt="Neptune" style={styles.planetImg} />
        <p style={styles.planetDescription}><span style={{ fontWeight: 'bold' }}>Neptune</span>: The furthest planet from the Sun, Neptune is known for its striking blue color, a result of the methane in its atmosphere. It's a stormy world, with high-speed winds and large storms like the Great Dark Spot. Neptune also has a system of thin rings and several moons.</p>
      </div>

    </div>
  );
};

const styles = {
  mainContainer: {
    marginLeft: '1.5rem',
    marginTop: '1rem'
  },
  planetContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px'
  },
  planetImg: {
    width: '150px',
    height: 'auto',
    marginRight: '20px'
  },
  planetDescription: {
    flex: 1,
    fontSize: '15px',
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    width: '80%'
  }
};

export default Planets;
