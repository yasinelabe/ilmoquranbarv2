import { Mail, MapPin, Phone } from "lucide-react";
import { ContactItem } from "./types";

export const imageMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/bmp",
  "image/tiff",
];

export const isFile = (value: unknown): value is File =>
  typeof File !== "undefined" && value instanceof File;


export const contactInfo: ContactItem[] = [
  {
    icon: Phone,
    label: 'Phone',
    labelKey: 'phone',
    value: '+252 6XXXXXXX',
    link: 'tel:+2526XXXXXXX',
  },
  {
    icon: Mail,
    label: 'Email',
    labelKey: 'email',
    value: 'info@ilmoquraanbar.com',
    link: 'mailto:info@ilmoquraanbar.com',
  },
  {
    icon: MapPin,
    label: 'Location',
    labelKey: 'location',
    value: 'Hargeisa, Somaliland',
    link: '#',
  },
];

export const paymentMethods = {
  waafipay: {
    id: 'waafipay',
    name: 'WaafiPay',
    logo: '/payments/waafipay.png',
  }
}