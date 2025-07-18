import ChildrenNavbar from "@/components/ChildrenNavbar";
import ChildrenHero from "@/components/ChildrenHero";
import StoryFeatures from "@/components/StoryFeatures";
import FAQ from "@/components/FAQ";
import ChildrenFooter from "@/components/ChildrenFooter";

export default function Page() {
  return (
    <>
      <ChildrenNavbar />
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
        <ChildrenHero />
        <StoryFeatures />
        <FAQ />
      </main>
      <ChildrenFooter />
    </>
  );
}

