
import { Carousel } from 'react-bootstrap';
import ZoryaAerial from '../../assets/images/originals/zorya.png';
import ZoryaGrand from '../../assets/images/originals/zorya.png';
import ZoryaAltitude from '../../assets/images/originals/zorya.png';

const ICarousel = () => {
  return (
    <Carousel>
      <Carousel.Item>
        <img src={ZoryaAerial} className="d-block w-100" alt="Zorya_aerial" />
        <Carousel.Caption>
          {/* <h5>First slide label</h5>
          <p>Some representative placeholder content for the first slide.</p> */}
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img src={ZoryaGrand} className="d-block w-100" alt="Zorya_grand" />
        <Carousel.Caption>
          {/* <h3>Second slide label</h3>
          <p>Some representative placeholder content for the second slide.</p> */}
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img src={ZoryaAltitude} className="d-block w-100" alt="Zorya_altitude" />
        <Carousel.Caption>
          {/* <h3>Third slide label</h3>
          <p>Some representative placeholder content for the third slide.</p> */}
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default ICarousel;
