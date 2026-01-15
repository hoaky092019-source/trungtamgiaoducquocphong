// src/components/HeroBanner.jsx
export default function HeroBanner() {
  return (
    <div className="carousel-wrapper col-md-8 mx-auto">
      <div id="mainCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="/img/banner1.jpg" className="d-block w-100" alt="slide1" />
            <div className="carousel-caption d-none d-md-block">
              <h5>Tin nổi bật 1</h5>
              <p>Mô tả tin số 1</p>
            </div>
          </div>
          <div className="carousel-item">
            <img src="/img/banner1.jpg" className="d-block w-100" alt="slide2" />
            <div className="carousel-caption d-none d-md-block">
              <h5>Tin nổi bật 2</h5>
              <p>Mô tả tin số 2</p>
            </div>
          </div>
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#mainCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
        </button>
      </div>
    </div>
  );
}
