import { SafeUrl } from "@angular/platform-browser";

export interface Ref {
  id: string;
  title: string;
  memeAuthor: string;
  memeRef: string;
  tiktokVideoId: string;
  tiktokVideoCite: string;
  tiktokVideoThumbnail: string;
  tiktokVideoHtml: string;
  shareCount?: number;
  viewCount?: number;
  uploadAt?: Date;
  tiktokVideoUrl?: SafeUrl;
}
