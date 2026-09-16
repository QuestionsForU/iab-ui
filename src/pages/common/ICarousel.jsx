
import { Carousel } from 'react-bootstrap';
import rajwadaAerial from '../../assets/images/originals/zorya.png';
import rajwadaGrand from '../../assets/images/originals/zorya.png';
import rajwadaAltitude from '../../assets/images/originals/zorya.png';

const ICarousel = () => {
  return (
    <Carousel>
      <Carousel.Item>
        <img src={rajwadaAerial} className="d-block w-100" alt="rajwada_aerial" />
        <Carousel.Caption>
          {/* <h5>First slide label</h5>
          <p>Some representative placeholder content for the first slide.</p> */}
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img src={rajwadaGrand} className="d-block w-100" alt="rajwada_grand" />
        <Carousel.Caption>
          {/* <h3>Second slide label</h3>
          <p>Some representative placeholder content for the second slide.</p> */}
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img src={rajwadaAltitude} className="d-block w-100" alt="rajwada_altitude" />
        <Carousel.Caption>
          {/* <h3>Third slide label</h3>
          <p>Some representative placeholder content for the third slide.</p> */}
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default ICarousel;
