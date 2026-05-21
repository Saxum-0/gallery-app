import { useEffect, useState } from "react";
import "./App.css";
import { FastAverageColor } from "fast-average-color";

type Photo = {
  id: number;
  url: string;
  name: string;
};

const fac = new FastAverageColor();

export default function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selected, setSelected] = useState<Photo | null>(null);
  const [bg, setBg] = useState("#0f0f0f");

  useEffect(() => {
    fetch("https://gallery-appb.onrender.com")
      .then((res) => res.json())
      .then((data) => setPhotos(data));
  }, []);

  const handleClick = (photo: Photo) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = photo.url;

    img.onload = () => {
      const color = fac.getColor(img);

      setBg(color.hex); // ✔ plus propre que rgb()
      setSelected(photo);
    };
  };

  return (
    <div className="app" style={{ background: bg }}>
      <h1>Pixel Flow</h1>

      <div className="masonry">
        {photos.map((p) => (
          <div key={p.id} className="item">
            <img
              src={p.url}
              loading="lazy"
              crossOrigin="anonymous"
              onClick={() => handleClick(p)}
            />
          </div>
        ))}
      </div>

      {/* 🔥 MODAL ZOOM */}
      {selected && (
        <div className="modal" onClick={() => setSelected(null)}>
          <img src={selected.url} className="modal-img" />
        </div>
      )}
    </div>
  );
}