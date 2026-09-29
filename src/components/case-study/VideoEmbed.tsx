"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { mediaCopy, type VideoSource } from "@/content/site";

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
 * 16:9 video. No id: "coming soon" placeholder. With an id: a click-to-load
 * facade, so the third-party iframe only loads when someone wants to watch.
 */
export function VideoEmbed({ video }: { video: VideoSource }) {
  const [playing, setPlaying] = useState(false);
  const frame = "relative aspect-video w-full overflow-hidden rounded-lg";

  if (!video.id) {
    return (
      <div
        role="img"
        aria-label={mediaCopy.videoComingSoon}
        className={`${frame} flex flex-col items-center justify-center gap-4 border border-primary/15 bg-base-deep text-primary-soft`}
      >
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-primary/25">
          <Play size={24} aria-hidden className="ml-1" />
        </span>
        <span className="text-sm">{mediaCopy.videoComingSoon}</span>
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
