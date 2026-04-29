import dynamic from "next/dynamic";

const MapQL = dynamic(() => import("@/app/components/MapQL"), {
  loading: () => <p>Loading map...</p>,
});

export default function Home() {
  return (
    <main>
      <MapQL />
    </main>
  );
}