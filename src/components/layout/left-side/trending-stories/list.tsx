import React from "react";
import { TrendingStoryItem } from "./item";
import { ScrollArea } from "@/components/ui/scroll-area";

const ITEMS = [
  {
    title: "Deneme Burada bi zun bir title",
    view: 12,
    avatars: [
      {
        url: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/049bf557-843e-4384-1b04-d06927879e00/original",
        name: "onur akdeniz",
      },
      { url: "https://wrpcd.net/cdn-cgi/image/fit=contain,f=auto,w=144/https%3A%2F%2Fi.imgur.com%2FIzJxuId.jpg", name: "mehmet akdeniz" },
    ],
  },

  {
    title: "Deneme Burada ikinci tane title var bayada uzun bir title Deneme Burada bi zun bir title Deneme Burada bi zun bir title Deneme Burada bi zun bir title",
    view: 123,
    avatars: [
      {
        url: "https://wrpcd.net/cdn-cgi/image/fit=contain,f=auto,w=144/https%3A%2F%2Fi.imgur.com%2FIzJxuId.jpg",
        name: "onur akdeniz",
      },
    ],
  },

  {
    title: "Deneme Burada bi zun bir title",
    view: 12,
    avatars: [
      {
        url: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/049bf557-843e-4384-1b04-d06927879e00/original",
        name: "onur akdeniz",
      },
      { url: "https://wrpcd.net/cdn-cgi/image/fit=contain,f=auto,w=144/https%3A%2F%2Fi.imgur.com%2FIzJxuId.jpg", name: "mehmet akdeniz" },
    ],
  },

  {
    title: "Deneme Burada bi zun bir title",
    view: 12,
    avatars: [
      {
        url: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/049bf557-843e-4384-1b04-d06927879e00/original",
        name: "onur akdeniz",
      },
      { url: "https://wrpcd.net/cdn-cgi/image/fit=contain,f=auto,w=144/https%3A%2F%2Fi.imgur.com%2FIzJxuId.jpg", name: "mehmet akdeniz" },
    ],
  },

  {
    title: "Deneme Burada bi zun bir title",
    view: 12,
    avatars: [
      {
        url: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/049bf557-843e-4384-1b04-d06927879e00/original",
        name: "onur akdeniz",
      },
      { url: "https://wrpcd.net/cdn-cgi/image/fit=contain,f=auto,w=144/https%3A%2F%2Fi.imgur.com%2FIzJxuId.jpg", name: "mehmet akdeniz" },
    ],
  },
  {
    title: "Deneme Burada ikinci tane title var bayada uzun bir title",
    view: 123,
    avatars: [
      {
        url: "https://wrpcd.net/cdn-cgi/image/fit=contain,f=auto,w=144/https%3A%2F%2Fi.imgur.com%2FIzJxuId.jpg",
        name: "onur akdeniz",
      },
    ],
  },

  {
    title: "Deneme Burada ikinci tane title var bayada uzun bir title",
    view: 123,
    avatars: [
      {
        url: "https://wrpcd.net/cdn-cgi/image/fit=contain,f=auto,w=144/https%3A%2F%2Fi.imgur.com%2FIzJxuId.jpg",
        name: "onur akdeniz",
      },
    ],
  },

  {
    title: "Deneme Burada ikinci tane title var bayada uzun bir title",
    view: 123,
    avatars: [
      {
        url: "https://wrpcd.net/cdn-cgi/image/fit=contain,f=auto,w=144/https%3A%2F%2Fi.imgur.com%2FIzJxuId.jpg",
        name: "onur akdeniz",
      },
    ],
  },
];

export const TrendingItemsList = () => {
  return (
    <ScrollArea
      className="flex overflow-auto "
      style={{ height: "calc(100vh - 160px)" }}
    >
      <div className="flex flex-col gap-3 pr-4 ">
        {ITEMS.map((item) => (
          <TrendingStoryItem
            title={item.title}
            avatars={item.avatars}
            view={item.view}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default TrendingItemsList;
