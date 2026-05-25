import { useEffect, useRef, useState } from "react";
import "./App.css";

type Photo = {
  id: number;
  url: string;
  name: string;
};

function WatermarkedImage({ src, onClick }: { src: string; onClick: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      // Watermark
      ctx.save();
      ctx.font = "bold 48px Arial";
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-Math.PI / 6);
      ctx.textAlign = "center";
      ctx.fillText("Pixel Flow", 0, 0);
      ctx.restore();
    };
  }, [src]);

  return (
    <canvas
      ref={canvasRef}
      onClick={onClick}
      style={{ width: "100%", cursor: "pointer", display: "block" }}
    />
  );
}

export default function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selected, setSelected] = useState<Photo | null>(null);
  const [bg, setBg] = useState("#0f0f0f");

  useEffect(() => {
    fetch("https://gallery-appb.onrender.com/photos")
      .then((res) => res.json())
      .then((data) => setPhotos(data));
  }, []);

  const handleClick = (photo: Photo) => {
    setSelected(photo);
    setBg("#0f0f0f");
  };

  return (
    <div className="app" style={{ background: bg }}>
      <h1>Pixel Flow</h1>

      <div className="masonry">
        {photos.map((p) => (
          <div key={p.id} className="item">
            <WatermarkedImage src={p.url} onClick={() => handleClick(p)} />
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal" onClick={() => setSelected(null)}>
          <img src={selected.url} className="modal-img" />
        </div>
      )}
    </div>
  );
}