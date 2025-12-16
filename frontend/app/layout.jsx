import "leaflet/dist/leaflet.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-[#f4f7f5]">
        {children}
      </body>
    </html>
  );
}