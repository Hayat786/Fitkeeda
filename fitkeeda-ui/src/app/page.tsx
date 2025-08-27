import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MissionSection from "@/components/MissionSection";
import StatsSection from "@/components/StatsSection";
import EnquiryForm from "@/components/EnquiryForm";
import Footer from "@/components/Footer";

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
