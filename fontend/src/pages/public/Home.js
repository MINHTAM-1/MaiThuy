import Banner from "../../components/home/Banner";
import About from "../../components/home/About";
import Testimonials from "../../components/home/Testimonials";

const Home = () => {
  return (
    <div className="home">
      <Banner />
      <About />
      <Testimonials />
    </div>
  );
};

export default Home;