import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { FeaturesSection, CTASection } from "@/components/home/FeaturesSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <FeaturedProducts />
      <CategoriesSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
