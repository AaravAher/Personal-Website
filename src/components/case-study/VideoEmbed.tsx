"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { mediaCopy, type VideoSource } from "@/content/site";
import { Picture } from "@/components/ui/Picture";

function embedUrl({ provider, id }: VideoSource) {
  return provider === "youtube"
    ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`
    : `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1`;
}

function posterUrl(video: VideoSource) {
  if (video.poster) return video.poster;
  if (video.provider === "youtube") return `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
  return null;
}

/**
 * 16:9 video, in the same frame as the other media. No id: an intentional
 * "coming soon" placeholder (a blurred product screen under navy). With an id:
 * a click-to-load facade, so the third-party iframe only loads on demand.
 */
export function VideoEmbed({ video }: { video: VideoSource }) {
  const [playing, setPlaying] = useState(false);
  const frame = "relative aspect-video w-full overflow-hidden rounded-lg border border-primary/15";

  if (!video.id) {
    return (
      <div
        role="img"
        aria-label={`${video.title}, ${mediaCopy.videoComingSoon.toLowerCase()}`}
        className={`${frame} bg-primary`}
      >
        {video.placeholderImage && (
          <Picture
            src={video.placeholderImage}
            alt=""
            sizes="960px"
            className="absolute inset-0 h-full w-full scale-125 object-cover blur-[40px]"
          />
        )}
        <span aria-hidden className="absolute inset-0 bg-primary/[0.72]" />
        <span aria-hidden className="relative flex h-full flex-col items-center justify-center text-cream">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-cream/80 sm:h-20 sm:w-20">
            <Play size={26} className="ml-1" />
          </span>
          <span className="mt-5 font-serif text-3xl sm:text-4xl">{mediaCopy.videoPlaceholderTitle}</span>
          <span className="mt-2 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-cream/70">
            {mediaCopy.videoComingSoon}
          </span>
        </span>
      </div>
    );
  }

  if (playing) {
    return (
      <div className={`${frame} bg-primary`}>
        <iframe
          src={embedUrl(video)}
          title={video.title}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  const poster = posterUrl(video);
  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`${mediaCopy.playVideo}: ${video.title}`}
      className={`group ${frame} block bg-primary`}
    >
      {poster && (
        <Image
          src={poster}
          alt=""
          fill
          sizes="(min-width: 1200px) 1200px, 100vw"
          className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
        />
      )}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-accent text-cream shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:bg-accent-strong">
          <Play size={30} aria-hidden className="ml-1" fill="currentColor" />
        </span>
      </span>
    </button>
  );
}
