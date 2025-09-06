import Navbar from "@/components/landing page/Navbar";
import HeroSection from "@/components/landing page/HeroSection";
import MissionSection from "@/components/landing page/MissionSection";
import StatsSection from "@/components/landing page/StatsSection";
import EnquiryForm from "@/components/landing page/EnquiryForm";
import Footer from "@/components/landing page/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      {/* Prevent navbar overlap */}
        <HeroSection />
        <MissionSection />
        <StatsSection/>
        <EnquiryForm/>
        <Footer/>
    </main>
  );
}
