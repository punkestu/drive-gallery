import { useState } from "react";
import { useNavigate } from "react-router";

function getDriveFolderId(url) {
  const match = url.match(/\/folders\/([^/?]+)/);

  return match ? match[1] : null;
}

export default function Setup() {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();
  return (
    <main className="h-screen w-screen flex justify-center items-center bg-red-900 bg-halftone">
      <div className="bg-white backdrop-blur-xs p-8 rounded-lg flex flex-col items-center gap-2 w-1/2">
        <h1 className="text-red-900 font-sef text-6xl">
          <a href="https://soreaja.my.id">SOREAJA Gallery</a>
        </h1>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="bg-white/40 border-2 border-gray-800 rounded-lg w-full px-4 py-2 text-center"
          type="text"
          placeholder="Copy URL Google Drivemu kesini..."
        />
        <button
          onClick={() => navigate(`/${getDriveFolderId(url)}`)}
          className="font-semibold text-lg bg-red-900 text-white border-2 border-white/15 cursor-pointer rounded-lg px-4 py-1"
        >
          Generate
        </button>
      </div>
    </main>
  );
}
