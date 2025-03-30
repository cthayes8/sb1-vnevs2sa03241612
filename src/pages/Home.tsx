import { useWaitlistStore } from '../store/waitlistStore';
import ParticleBackground from '../components/ParticleBackground';
import { HeroWithChat } from '../components/HeroWithChat';
import Modal from '../components/Modal';
import WaitlistForm from '../components/WaitlistForm';
import { FeaturesGrid } from '../components/FeaturesGrid';
import { BetaWaitlist } from '../components/EarlyAdopterProgram';
import { HowItWorks } from '../components/HowItWorks';
import LogoCarousel from '../components/LogoCarousel';

const Home = () => {
  const { isOpen, closeModal } = useWaitlistStore();

  return (
    <>
      <ParticleBackground />
      
      {/* Hero Section - Showcase the AI */}
      <section className="relative">
        <HeroWithChat />
      </section>

      {/* Features Section - What the platform offers */}
      <section className="relative">
        <FeaturesGrid />
      </section>

      {/* How It Works - Process explanation */}
      <section className="relative">
        <HowItWorks />
      </section>

      {/* Beta Waitlist - Single clear CTA */}
      <section className="relative">
        <BetaWaitlist />
      </section>

      {/* Integration Partners Section */}
      <section className="relative">
        <LogoCarousel className="max-w-5xl mx-auto" />
      </section>

      {/* Waitlist Modal */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        <WaitlistForm />
      </Modal>
    </>
  );
};

export default Home;