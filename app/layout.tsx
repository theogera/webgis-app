import "./globals.css";
import "mapbox-gl/dist/mapbox-gl.css";

export const metadata = {
  title: "WebGIS App",
  description: "Next.js + Mapbox WebGIS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <title>WebGis-App</title>
      <body>{children}</body>
    </html>
  );
}