import ContactForm from '../../components/contact/ContactForm';
import ContactInfo from '../../components/contact/ContactInfo';
import Map from '../../components/contact/Map';

const Contact = () => {
  return (
    <section id="contact" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Liên hệ với chúng tôi</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn lòng hồi đáp lại phản hồi của bạn khi có thể !
          </p>
        </div>

        {/* Contact Box */}
        <div className="contact-box grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <ContactForm />
          <ContactInfo />
        </div>

        {/* Map Section */}
        <Map />
      </div>
    </section>
  );
};

export default Contact;