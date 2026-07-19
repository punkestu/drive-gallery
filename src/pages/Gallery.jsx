import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Modal from "../components/Modal";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [pagetokens, setPagetokens] = useState([]);
  const [isloading, setIsloading] = useState(true);
  const [timeouttime, setTimeoutTime] = useState(2500);
  const [selectedimageid, setSelectedimageid] = useState(null);

  const { id: folderId } = useParams();
  useEffect(() => {
    if (!folderId) return;
    const API_KEY = import.meta.env.VITE_API_KEY;
    const query = `'${folderId}' in parents and mimeType contains 'image/' and trashed=false`;

    const url = new URL("https://www.googleapis.com/drive/v3/files");
    url.searchParams.set("key", API_KEY);
    url.searchParams.set("q", query);
    url.searchParams.set("fields", "nextPageToken,files(id,name,mimeType)");
    url.searchParams.set("pageSize", "10");
    if (pagetokens.length > 0) {
      url.searchParams.set("pageToken", pagetokens.at(-1));
    }

    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        const files = res.files;
        setImages((prev) => [...prev, ...files]);
        if (!res.nextPageToken) {
          setIsloading(false);
          return;
        }

        setTimeout(() => {
          setPagetokens((prev) => [...prev, res.nextPageToken]);
          setTimeoutTime(2500 + ((timeouttime + 100) % 2500));
        }, timeouttime);
      })
      .catch((err) => console.error(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderId, pagetokens]);

  return (
    <main className="h-screen w-screen bg-red-900 bg-halftone overflow-auto">
      <header className="px-6 py-2 sticky top-0">
        <div className="bg-red-900 p-4 rounded-md flex justify-between items-center">
          <h1 className="text-white text-xl font-sef">
            <a href="https://soreaja.my.id">SOREAJA Gallery</a>
          </h1>
          <a
            href={`https://drive.google.com/drive/folders/${folderId}`}
            target="_blank"
            className="gap-2 text-white flex border p-2 rounded-md items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              className="h-5 w-5"
            >
              {
                "<!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->"
              }
              <path
                fill="rgb(255, 255, 255)"
                d="M403 378.9L239.4 96L400.6 96L564.2 378.9L403 378.9zM265.5 402.5L184.9 544L495.4 544L576 402.5L265.5 402.5zM218.1 131.4L64 402.5L144.6 544L301 272.8L218.1 131.4z"
              />
            </svg>
            <span className="sm:block hidden">Go to Drive</span>
          </a>
        </div>
      </header>
      <section className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 overflow-auto p-4">
        {isloading && images.length < 1 && (
          <p className="font-sef text-white col-span-full text-center text-2xl">
            Loading...
          </p>
        )}
        {images.map(
          (image) =>
            image && (
              <button
                className="h-64 bg-white p-2"
                key={image.id}
                onClick={() => setSelectedimageid(image.id)}
              >
                <img
                  className="h-full w-full object-cover hover:object-contain"
                  loading="lazy"
                  src={`https://drive.google.com/thumbnail?id=${image.id}&sz=w800`}
                  alt={image.name}
                />
              </button>
            ),
        )}
        {isloading && images.length >= 1 && (
          <div className="h-64 font-sef bg-slate-200 text-red-900 animate-pulse text-center text-2xl flex justify-center items-center p-2">
            Loading...
          </div>
        )}
      </section>

      <Modal isOpen={selectedimageid} onClose={() => setSelectedimageid(null)}>
        <div className="max-h-[80vh] overflow-auto">
          <img
            src={`https://drive.google.com/thumbnail?id=${selectedimageid}&sz=w1600`}
            width={1600}
            alt="Selected Image"
          />
        </div>
        <a
          className="flex w-full gap-1 bg-red-900 text-white font-semibold justify-center items-center p-2 rounded-md mt-4"
          href={`https://drive.google.com/uc?export=download&id=${selectedimageid}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            className="h-5 w-5"
          >
            {
              "<!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->"
            }
            <path
              fill="rgb(255, 255, 255)"
              d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM303 505C312.4 514.4 327.6 514.4 336.9 505L400.9 441C410.3 431.6 410.3 416.4 400.9 407.1C391.5 397.8 376.3 397.7 367 407.1L344 430.1L344 344C344 330.7 333.3 320 320 320C306.7 320 296 330.7 296 344L296 430.1L273 407.1C263.6 397.7 248.4 397.7 239.1 407.1C229.8 416.5 229.7 431.7 239.1 441L303.1 505z"
            />
          </svg>
          Download
        </a>
      </Modal>
    </main>
  );
}
