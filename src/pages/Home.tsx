import Button from "../components/buttons/Button";
import Footer from "../components/footer/Footer";
import Nav from "../components/navbar/Nav";
import homeData from "../data/home.json";

interface HeroData {
  title: string;
  description: string;
  buttonText: string;
  backgroundImage: string;
}

export interface VisualService {
  title: string;
  description: string;
}

export interface VisualExperience {
  title: string;
  subtitle: string;
  services: VisualService[];
}

export interface HomeProduct {
  title: string;
  description: string;
  image: string;
}

export interface HomeProductList {
  title: string;
  subtitle: string;
  products: HomeProduct[];
}

export interface HomeGallery {
  colSpan: string;
  height: string;
  image: string;
}

export interface HomeGallerySection {
  title: string;
  subtitle: string;
  expertiseTitle: string;
  expertiseHeadline: string;
  expertiseDescription: string;
  image: string;
}

export interface HomeData {
  hero: HeroData;
  visualExperience: VisualExperience;
  homeProductLists: HomeProductList;
  homeGalleries: HomeGallerySection;
}

function Home() {
  const { visualExperience, homeProductLists, homeGalleries, hero }: HomeData =
    homeData;

  return (
    <>
      <Nav />
      {/* Hero */}
      <div>
        <div
          className="hero min-h-screen"
          style={{
            backgroundImage: `url(${hero.backgroundImage})`,
          }}
        >
          <div className="hero-overlay"></div>
          <div className="hero-content text-neutral-content text-center">
            <div className="max-w-md">
              <h1 className="mb-5 text-5xl font-bold text-white animate__animated animate__fadeIn animate__delay-1s">
                {hero.title}
              </h1>
              <p className="mb-5 text-lg text-white opacity-80 animate__animated animate__fadeIn animate__delay-1.5s">
                {hero.description}
              </p>
              <Button
                text={hero.buttonText}
                size="lg"
                color="warning"
                className="animate-pulse transition-transform duration-500 hover:scale-105 rounded-2xl"
              />
            </div>
          </div>
        </div>

        {/* Visual Experience */}
        <div className="bg-gray-900 py-12 text-white">
          {visualExperience && (
            <>
              <h1 className="py-5 text-center text-3xl font-bold">
                {visualExperience.title}
              </h1>
              <p className="mx-auto max-w-xl text-center text-gray-200">
                {visualExperience.subtitle}
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-8 md:flex-row">
                {visualExperience.services.map((service, index) => (
                  <div
                    key={index}
                    className="w-80 rounded-lg bg-white/10 p-6 text-center shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out hover:scale-105 hover:bg-white/20 hover:shadow-2xl"
                  >
                    <h2 className="mb-3 text-xl font-semibold transition-colors duration-300 hover:text-white">
                      {service.title}
                    </h2>
                    <p className="text-gray-200">{service.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Product List */}
        <section className="bg-gray-900 py-16 text-center text-white">
          {homeProductLists && (
            <>
              <h1 className="text-3xl font-extrabold md:text-4xl">
                {homeProductLists.title}
              </h1>
              <p className="mx-auto mt-2 max-w-2xl text-gray-400">
                {homeProductLists.subtitle}
              </p>

              <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
                {homeProductLists.products.map((item, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-xl shadow-lg transition-transform hover:scale-105"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-64 w-full object-cover brightness-75 transition group-hover:brightness-100"
                    />

                    <div className="absolute inset-0 flex flex-col justify-end bg-black/40 p-5">
                      <h2 className="text-lg font-bold">{item.title}</h2>
                      <p className="text-sm text-gray-300">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Gallery */}
        <div className="bg-gray-900 py-10 text-white">
          {homeGalleries && (
            <>
              <h1 className="text-center text-3xl font-extrabold text-gray-100 md:text-4xl">
                {homeGalleries.title}
              </h1>
              <p className="mx-auto mt-2 max-w-2xl text-center text-gray-300 text-base md:text-lg">
                {homeGalleries.subtitle}
              </p>
              <div className="mx-auto mt-8 flex flex-col gap-8 px-8 md:flex-row md:items-center md:gap-8 md:max-w-7xl">
                {/* Gambar */}
                <div className="order-first flex justify-center md:w-1/2 md:order-last">
                  <div className="group relative overflow-hidden rounded-lg w-full">
                    <img
                      src={homeGalleries.image}
                      alt="example.jpg"
                      className="w-full h-96 brightness-75 rounded-lg object-cover transition-all duration-500 ease-in-out group-hover:scale-105 group-hover:rotate-2 group-hover:shadow-2xl"
                    />
                  </div>
                </div>

                {/* Teks */}
                <div className="md:w-1/2 text-left">
                  <h2 className="text-xl font-semibold text-gray-300 uppercase">
                    {homeGalleries.expertiseTitle}
                  </h2>
                  <p className="mt-3 text-2xl leading-tight font-bold text-gray-200">
                    {homeGalleries.expertiseHeadline}
                  </p>
                  <p className="mt-3 text-gray-300 text-sm md:text-base">
                    {homeGalleries.expertiseDescription}
                  </p>
                  <button className="mt-4 animate-bounce rounded-full bg-purple-600 px-6 py-3 text-white shadow-md transition duration-1000 hover:bg-purple-500">
                    Beli Sekarang
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Home;
