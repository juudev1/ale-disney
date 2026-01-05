import React, { useRef, useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Page } from './Page';

interface VideoData {
  title: string;
  description: string;
  videoPath: string; // Local path relative to public/ (e.g., /videos/video1.mp4)
}

interface BookProps {
  videos: VideoData[];
}

export default function Book({ videos }: BookProps) {
  const bookRef = useRef(null);
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Determine Dimensions based on screen size
  const isMobile = windowSize.width < 768;
  // If mobile, page width is almost full screen width (~90%)
  // If desktop, page width is around 500px (so open book is 1000px)
  const bookWidth = isMobile ? Math.min(windowSize.width * 0.9, 400) : 500;
  const bookHeight = isMobile ? Math.min(windowSize.height * 0.8, 600) : 700;

  // Handler for page flip to pause all videos
  const onFlip = React.useCallback((e: any) => {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      video.pause();
    });
  }, []);

  // Don't render until we have window size to avoid hydration mismatch affecting initial size
  if (windowSize.width === 0) return null;

  // Handler when a video starts playing
  const handlePlay = (e: any) => {
    const currentVideo = e.target;
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      if (video !== currentVideo) {
        video.pause();
      }
    });
  };

  return (
    <div className="flex items-center justify-center h-screen w-full perspective-[1500px]">
      {/* @ts-ignore - types for react-pageflip can be tricky */}
      <HTMLFlipBook
        width={bookWidth}
        height={bookHeight}
        size="fixed"
        minWidth={300}
        maxWidth={800}
        minHeight={400}
        maxHeight={1000}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        className="shadow-2xl"
        ref={bookRef}
        usePortrait={isMobile} // Force single page mode on mobile
        startZIndex={0}
        autoSize={true}
        onFlip={onFlip}
      >
        {/* Cover Page */}
        <Page variant="cover">
          <div className="h-full flex flex-col items-center justify-center text-center border-4 border-yellow-500/50 p-4 rounded-lg">
            <h1 className={`${isMobile ? 'text-4xl' : 'text-6xl'} text-yellow-500 drop-shadow-lg mb-8 font-heading`}>Mi amor por ti contado con escenas de Disney</h1>
            <div className="text-2xl text-yellow-200 font-script opacity-80">Cada historia me recuerda una forma distinta de amarte.</div>
            <div className="mt-12 text-6xl animate-pulse">✨</div>
          </div>
        </Page>

        {/* Introduction Page */}
        <Page>
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-3xl text-purple-900 mb-6 font-heading">Para mi Princesa</h2>
            <p className={`font-script ${isMobile ? 'text-xl' : 'text-2xl'} leading-relaxed text-gray-700`}>
              "No es nuestra historia,<br />
              pero son historias que me llevan a ti..."<br />
              Un pequeño detalle con mucho amor.
            </p>
          </div>
        </Page>

        {/* Video Pages */}
        {videos.map((v, i) => (
          <Page key={i} number={(i + 1).toString()}>
            <div className="flex flex-col h-full relative z-10 w-full">
              <h3 className={`${isMobile ? 'text-xl' : 'text-2xl'} text-center text-purple-900 mb-2 border-b border-purple-200 pb-2 font-heading truncate`}>
                {v.title}
              </h3>

              {/* Video Container - Reduced flex grow to give space to text if needed */}
              <div className="flex-shrink-0 relative w-full mb-4 border-4 border-yellow-600/30 rounded-lg p-1 bg-black/5">
                 {/* Local Video Player */}
                 <div 
                    className="w-full h-48 sm:h-64 bg-black rounded shadow-inner overflow-hidden relative group flex items-center justify-center"
                    ref={(el) => {
                      if (el) {
                        const stop = (e: any) => {
                          e.stopPropagation();
                        };
                        // Add native listeners to stop propagation to the flipbook
                        el.onmousedown = stop;
                        el.onmouseup = stop;
                        el.ontouchstart = stop;
                        el.ontouchend = stop;
                        el.onclick = stop;
                      }
                    }}
                 >
                    <video 
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-contain"
                      onPlay={handlePlay}
                    >
                      <source src={`${v.videoPath}#t=0.1`} type="video/mp4" />
                      Tu navegador no soporta videos.
                    </video>
                 </div>
              </div>

              {/* Description - Scrollable if too long */}
              <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-body italic text-gray-700 text-center whitespace-pre-line`}>
                  {v.description}
                </p>
              </div>

              <div className="mt-auto text-center text-xs text-gray-400 font-sans">
                {i + 1}
              </div>
            </div>

            {/* Decorations */}
            <div className="absolute top-0 right-0 p-2 text-2xl opacity-20">🏰</div>
            <div className="absolute bottom-0 left-0 p-2 text-2xl opacity-20">🌹</div>
          </Page>
        ))}

        {/* Back Cover */}
        <Page variant="back">
          <div className="h-full flex flex-col items-center justify-center text-center border-4 border-yellow-500/50 p-4 rounded-lg">
            <h2 className="text-4xl text-yellow-500 font-heading mb-4">Fin</h2>
            <p className="text-yellow-200 font-script text-xl">¿Y vivieron felices para siempre...?</p>
          </div>
        </Page>

      </HTMLFlipBook>
    </div>
  );
}
