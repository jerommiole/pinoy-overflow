import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimestamp = (createdAt: Date): string => {
  const now = new Date();
  const timeDifference = now.getTime() - createdAt.getTime();

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);

  if (minutes === 0) {
    return `${seconds} secs ago`;
  } else if (minutes === 1) {
    return `1 min ago`;
  } else if (minutes < 60) {
    return `${minutes} mins ago`;
  } else {
    const hours = Math.floor(minutes / 60);
    if (hours === 1) {
      return `1 hour ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else {
      const days = Math.floor(hours / 24);
      if (days === 1) {
        return `1 day ago`;
      } else {
        return `${days} days ago`;
      }
    }
  }
};

export const formatAndDivideNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2) + "K";
  } else {
    return num.toString();
  }
};
