import { useState, useEffect } from "react";
import * as pdfjs from "pdfjs-dist";
import LoadingPage from "../LoadingPage";
// import { Card, CardContent } from "@/components/ui/card";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  // CarouselNext,
  // CarouselPrevious,
} from "@/components/ui/carousel";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const PdfThumbnail = ({ pdfDataUrl, width, height }) => {
  const [thumbnails, setThumbnails] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [count, setCount] = useState(0);
  const [current, setCurrent] = useState(0);
  const [api, setApi] = useState(null);

  useEffect(() => {
    const generateThumbnails = async () => {
      try {
        const pdf = await pdfjs.getDocument(pdfDataUrl).promise;
        const pageThumbnails = [];

        for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex++) {
          const page = await pdf.getPage(pageIndex);
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          if (!context) {
            throw new Error("Could not get 2D rendering context");
          }

          const viewport = page.getViewport({ scale: 1 });
          canvas.height = height;
          canvas.width = width;

          const renderContext = {
            canvasContext: context,
            viewport: page.getViewport({
              scale: Math.min(width / viewport.width, height / viewport.height),
            }),
          };

          await page.render(renderContext).promise;
          pageThumbnails.push(canvas.toDataURL());
        }

        setThumbnails(pageThumbnails);
        setIsLoaded(true);
      } catch (error) {
        console.error("Error generating PDF thumbnails:", error);
        setThumbnails([]);
        setIsLoaded(true);
      }
    };

    generateThumbnails();
  }, [pdfDataUrl, width, height]);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (!isLoaded) {
    return <LoadingPage />;
  }
  return (
    <div className="pdf-thumbnails">
      {thumbnails.length > 0 ? (
        <>
          <Carousel setApi={setApi}>
            <CarouselContent>
              {thumbnails.map((thumbnailUrl, index) => (
                <CarouselItem key={index}>
                  <Zoom>
                    <img
                      src={thumbnailUrl}
                      alt={`PDF Thumbnail Page ${index + 1}`}
                      className="rounded object-cover w-full h-full"
                    />
                  </Zoom>
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* <CarouselPrevious />
            <CarouselNext /> */}
          </Carousel>
          <div className="py-2 text-center text-sm text-muted-foreground">
            Slide {current} of {count}
          </div>
        </>
      ) : (
        <div className="">Not available</div>
      )}
    </div>
  );
};

export default PdfThumbnail;
