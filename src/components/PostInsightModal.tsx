import {
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";
import UiModal from "./shared/renderers/UiModal";
import {
  FaArrowLeft,
  FaArrowPointer,
  FaCircleInfo,
  FaShare,
} from "react-icons/fa6";
import { BsFillEmojiSmileFill, BsFillFileImageFill } from "react-icons/bs";
import { BiCommentDetail } from "react-icons/bi";
import { MdHideImage } from "react-icons/md";
import Image from "next/image";
import { AppDefaultImage } from "./shared/renderers/ImageTemp";
import { useQueryPostById } from "@/api/social";
import dayjs from "dayjs";

const interactions = [
  {
    id: "react-1",
    icon: `data:image/svg+xml,%3Csvg fill='none' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M16.0001 7.9996c0 4.418-3.5815 7.9996-7.9995 7.9996S.001 12.4176.001 7.9996 3.5825 0 8.0006 0C12.4186 0 16 3.5815 16 7.9996Z' fill='url(%23paint0_linear_15251_63610)'/%3E%3Cpath d='M16.0001 7.9996c0 4.418-3.5815 7.9996-7.9995 7.9996S.001 12.4176.001 7.9996 3.5825 0 8.0006 0C12.4186 0 16 3.5815 16 7.9996Z' fill='url(%23paint1_radial_15251_63610)'/%3E%3Cpath d='M16.0001 7.9996c0 4.418-3.5815 7.9996-7.9995 7.9996S.001 12.4176.001 7.9996 3.5825 0 8.0006 0C12.4186 0 16 3.5815 16 7.9996Z' fill='url(%23paint2_radial_15251_63610)' fill-opacity='.5'/%3E%3Cpath d='M7.3014 3.8662a.6974.6974 0 0 1 .6974-.6977c.6742 0 1.2207.5465 1.2207 1.2206v1.7464a.101.101 0 0 0 .101.101h1.7953c.992 0 1.7232.9273 1.4917 1.892l-.4572 1.9047a2.301 2.301 0 0 1-2.2374 1.764H6.9185a.5752.5752 0 0 1-.5752-.5752V7.7384c0-.4168.097-.8278.2834-1.2005l.2856-.5712a3.6878 3.6878 0 0 0 .3893-1.6509l-.0002-.4496ZM4.367 7a.767.767 0 0 0-.7669.767v3.2598a.767.767 0 0 0 .767.767h.767a.3835.3835 0 0 0 .3835-.3835V7.3835A.3835.3835 0 0 0 5.134 7h-.767Z' fill='%23fff'/%3E%3Cdefs%3E%3CradialGradient id='paint1_radial_15251_63610' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='rotate(90 .0005 8) scale(7.99958)'%3E%3Cstop offset='.5618' stop-color='%230866FF' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%230866FF' stop-opacity='.1'/%3E%3C/radialGradient%3E%3CradialGradient id='paint2_radial_15251_63610' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='rotate(45 -4.5257 10.9237) scale(10.1818)'%3E%3Cstop offset='.3143' stop-color='%2302ADFC'/%3E%3Cstop offset='1' stop-color='%2302ADFC' stop-opacity='0'/%3E%3C/radialGradient%3E%3ClinearGradient id='paint0_linear_15251_63610' x1='2.3989' y1='2.3999' x2='13.5983' y2='13.5993' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%2302ADFC'/%3E%3Cstop offset='.5' stop-color='%230866FF'/%3E%3Cstop offset='1' stop-color='%232B7EFF'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E`,
  },
  {
    id: "react-2",
    icon: `data:image/svg+xml,%3Csvg fill='none' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cg clip-path='url(%23clip0_15251_63610)'%3E%3Cpath d='M15.9963 8c0 4.4179-3.5811 7.9993-7.9986 7.9993-4.4176 0-7.9987-3.5814-7.9987-7.9992 0-4.4179 3.5811-7.9992 7.9987-7.9992 4.4175 0 7.9986 3.5813 7.9986 7.9992Z' fill='url(%23paint0_linear_15251_63610)'/%3E%3Cpath d='M15.9973 7.9992c0 4.4178-3.5811 7.9992-7.9987 7.9992C3.5811 15.9984 0 12.417 0 7.9992S3.5811 0 7.9986 0c4.4176 0 7.9987 3.5814 7.9987 7.9992Z' fill='url(%23paint1_radial_15251_63610)'/%3E%3Cpath d='M7.9996 5.9081c-.3528-.8845-1.1936-1.507-2.1748-1.507-1.4323 0-2.4254 1.328-2.4254 2.6797 0 2.2718 2.3938 4.0094 4.0816 5.1589.3168.2157.7205.2157 1.0373 0 1.6878-1.1495 4.0815-2.8871 4.0815-5.159 0-1.3517-.993-2.6796-2.4254-2.6796-.9811 0-1.822.6225-2.1748 1.507Z' fill='%23fff'/%3E%3C/g%3E%3Cdefs%3E%3CradialGradient id='paint1_radial_15251_63610' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='matrix(0 7.9992 -7.99863 0 7.9986 7.9992)'%3E%3Cstop offset='.5637' stop-color='%23E11731' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23E11731' stop-opacity='.1'/%3E%3C/radialGradient%3E%3ClinearGradient id='paint0_linear_15251_63610' x1='2.3986' y1='2.4007' x2='13.5975' y2='13.5993' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23FF74AE'/%3E%3Cstop offset='.5001' stop-color='%23FA2E3E'/%3E%3Cstop offset='1' stop-color='%23FF5758'/%3E%3C/linearGradient%3E%3CclipPath id='clip0_15251_63610'%3E%3Cpath fill='%23fff' d='M-.001.0009h15.9992v15.9984H-.001z'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E`,
  },
  {
    id: "react-3",
    icon: `data:image/svg+xml,%3Csvg fill='none' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cg clip-path='url(%23clip0_15251_63610)'%3E%3Cpath d='M15.9953 7.9996c0 4.418-3.5816 7.9996-7.9996 7.9996S-.004 12.4176-.004 7.9996 3.5776 0 7.9957 0c4.418 0 7.9996 3.5815 7.9996 7.9996Z' fill='url(%23paint0_linear_15251_63610)'/%3E%3Cpath d='M15.9973 7.9992c0 4.4178-3.5811 7.9992-7.9987 7.9992C3.5811 15.9984 0 12.417 0 7.9992S3.5811 0 7.9986 0c4.4176 0 7.9987 3.5814 7.9987 7.9992Z' fill='url(%23paint1_radial_15251_63610)'/%3E%3Cpath d='M15.9953 7.9996c0 4.418-3.5816 7.9996-7.9996 7.9996S-.004 12.4176-.004 7.9996 3.5776 0 7.9957 0c4.418 0 7.9996 3.5815 7.9996 7.9996Z' fill='url(%23paint2_radial_15251_63610)' fill-opacity='.8'/%3E%3Cpath d='M12.5278 8.1957c.4057.1104.6772.4854.623.9024-.3379 2.6001-2.5167 4.9012-5.1542 4.9012s-4.8163-2.3011-5.1542-4.9012c-.0542-.417.2173-.792.623-.9024.8708-.237 2.5215-.596 4.5312-.596 2.0098 0 3.6605.359 4.5312.596Z' fill='%234B280E'/%3E%3Cpath d='M11.5809 12.3764c-.9328.9843-2.1948 1.6228-3.5841 1.6228-1.3892 0-2.6512-.6383-3.5839-1.6225a1.5425 1.5425 0 0 0-.016-.0174c.4475-1.0137 2.2-1.3599 3.5999-1.3599 1.4 0 3.1514.3468 3.5998 1.3599l-.0157.0171Z' fill='url(%23paint3_linear_15251_63610)'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M13.3049 5.8793c.1614-1.1485-.6387-2.2103-1.7872-2.3717l-.0979-.0138c-1.1484-.1614-2.2103.6388-2.3717 1.7872l-.0163.1164a.5.5 0 0 0 .9902.1392l.0163-.1164c.0846-.6016.6408-1.0207 1.2424-.9362l.0978.0138c.6016.0845 1.0207.6407.9362 1.2423l-.0164.1164a.5.5 0 0 0 .9903.1392l.0163-.1164ZM2.6902 5.8793c-.1614-1.1485.6387-2.2103 1.7872-2.3717l.0979-.0138c1.1484-.1614 2.2103.6388 2.3717 1.7872l.0164.1164a.5.5 0 1 1-.9903.1392l-.0163-.1164c-.0846-.6016-.6408-1.0207-1.2423-.9362l-.098.0138c-.6015.0845-1.0206.6407-.936 1.2423l.0163.1164a.5.5 0 0 1-.9902.1392l-.0164-.1164Z' fill='%231C1C1D'/%3E%3C/g%3E%3Cdefs%3E%3CradialGradient id='paint1_radial_15251_63610' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='matrix(0 7.9992 -7.99863 0 7.9986 7.9992)'%3E%3Cstop offset='.5637' stop-color='%23FF5758' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23FF5758' stop-opacity='.1'/%3E%3C/radialGradient%3E%3CradialGradient id='paint2_radial_15251_63610' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='rotate(45 -4.5272 10.9202) scale(10.1818)'%3E%3Cstop stop-color='%23FFF287'/%3E%3Cstop offset='1' stop-color='%23FFF287' stop-opacity='0'/%3E%3C/radialGradient%3E%3ClinearGradient id='paint0_linear_15251_63610' x1='2.396' y1='2.3999' x2='13.5954' y2='13.5993' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23FFF287'/%3E%3Cstop offset='1' stop-color='%23F68628'/%3E%3C/linearGradient%3E%3ClinearGradient id='paint3_linear_15251_63610' x1='5.1979' y1='10.7996' x2='5.245' y2='14.2452' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23FF60A4'/%3E%3Cstop offset='.2417' stop-color='%23FA2E3E'/%3E%3Cstop offset='1' stop-color='%23BC0A26'/%3E%3C/linearGradient%3E%3CclipPath id='clip0_15251_63610'%3E%3Cpath fill='%23fff' d='M-.002 0h16v15.9992h-16z'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E`,
  },
  {
    id: "react-4",
    icon: `data:image/svg+xml,%3Csvg fill='none' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cg clip-path='url(%23clip0_15251_63610)'%3E%3Cpath d='M15.9972 7.9996c0 4.418-3.5815 7.9996-7.9996 7.9996-4.418 0-7.9996-3.5816-7.9996-7.9996S3.5796 0 7.9976 0c4.4181 0 7.9996 3.5815 7.9996 7.9996Z' fill='url(%23paint0_linear_15251_63610)'/%3E%3Cpath d='M15.9973 7.9992c0 4.4178-3.5811 7.9992-7.9987 7.9992C3.5811 15.9984 0 12.417 0 7.9992S3.5811 0 7.9986 0c4.4176 0 7.9987 3.5814 7.9987 7.9992Z' fill='url(%23paint1_radial_15251_63610)'/%3E%3Cpath d='M15.9972 7.9996c0 4.418-3.5815 7.9996-7.9996 7.9996-4.418 0-7.9996-3.5816-7.9996-7.9996S3.5796 0 7.9976 0c4.4181 0 7.9996 3.5815 7.9996 7.9996Z' fill='url(%23paint2_radial_15251_63610)' fill-opacity='.8'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M5.6144 10.8866c.159-1.8461 1.127-2.887 2.382-2.887 1.2551 0 2.2231 1.0418 2.3822 2.887.1591 1.8461-.7342 3.1127-2.3821 3.1127-1.648 0-2.5412-1.2666-2.3821-3.1127Z' fill='%234B280E'/%3E%3Cellipse cx='11.1978' cy='5.6997' rx='1.3999' ry='1.6999' fill='%231C1C1D'/%3E%3Cellipse cx='4.7979' cy='5.6997' rx='1.3999' ry='1.6999' fill='%231C1C1D'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M12.3528 3.166a1.4744 1.4744 0 0 0-1.8591-.3279.4.4 0 1 1-.3976-.6941c.9527-.5457 2.1592-.333 2.8678.5056a.4.4 0 0 1-.6111.5163ZM5.4998 2.8381a1.4744 1.4744 0 0 0-1.859.3278.4.4 0 0 1-.6111-.5162c.7085-.8387 1.915-1.0514 2.8677-.5057a.4.4 0 0 1-.3976.6941Z' fill='%23E0761A'/%3E%3C/g%3E%3Cdefs%3E%3CradialGradient id='paint1_radial_15251_63610' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='matrix(0 7.9992 -7.99863 0 7.9986 7.9992)'%3E%3Cstop offset='.5637' stop-color='%23FF5758' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23FF5758' stop-opacity='.1'/%3E%3C/radialGradient%3E%3CradialGradient id='paint2_radial_15251_63610' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='rotate(45 -4.5262 10.9226) scale(10.1818)'%3E%3Cstop stop-color='%23FFF287'/%3E%3Cstop offset='1' stop-color='%23FFF287' stop-opacity='0'/%3E%3C/radialGradient%3E%3ClinearGradient id='paint0_linear_15251_63610' x1='2.3979' y1='2.3999' x2='13.5973' y2='13.5993' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23FFF287'/%3E%3Cstop offset='1' stop-color='%23F68628'/%3E%3C/linearGradient%3E%3CclipPath id='clip0_15251_63610'%3E%3Cpath fill='%23fff' d='M-.002 0h15.9992v15.9992H-.002z'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E`,
  },
  {
    id: "react-5",
    icon: `data:image/svg+xml,%3Csvg fill='none' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cg clip-path='url(%23clip0_15251_63610)'%3E%3Cpath d='M15.9943 8.0004c0 4.4181-3.5815 7.9996-7.9996 7.9996-4.418 0-7.9996-3.5815-7.9996-7.9996 0-4.418 3.5816-7.9995 7.9996-7.9995 4.4181 0 7.9996 3.5815 7.9996 7.9995Z' fill='url(%23paint0_linear_15251_63610)'/%3E%3Cpath d='M15.9973 7.9992c0 4.4178-3.5811 7.9992-7.9987 7.9992C3.5811 15.9984 0 12.417 0 7.9992S3.5811 0 7.9986 0c4.4176 0 7.9987 3.5814 7.9987 7.9992Z' fill='url(%23paint1_radial_15251_63610)'/%3E%3Cpath d='M15.9943 8.0004c0 4.4181-3.5815 7.9996-7.9996 7.9996-4.418 0-7.9996-3.5815-7.9996-7.9996 0-4.418 3.5816-7.9995 7.9996-7.9995 4.4181 0 7.9996 3.5815 7.9996 7.9995Z' fill='url(%23paint2_radial_15251_63610)' fill-opacity='.8'/%3E%3Cpath d='M12.3964 9.0861c0 1.1142-.3999 1.1142-1.1999 1.1142-.7999 0-1.2 0-1.2-1.1142 0-.8205.5373-1.4856 1.2-1.4856s1.1999.6651 1.1999 1.4856ZM5.9965 9.0861c0 1.1142-.4 1.1142-1.1999 1.1142-.8 0-1.2 0-1.2-1.1142 0-.8205.5373-1.4856 1.2-1.4856s1.2.6651 1.2 1.4856Z' fill='%231C1C1D'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M7.9946 11.2002c1.6447 0 2.3999 1.0936 2.3999 1.4122 0 .1095-.084.1877-.2248.1877-.3152 0-.752-.4-2.1751-.4s-1.8599.4-2.175.4c-.1409 0-.2249-.0782-.2249-.1877 0-.3186.7552-1.4122 2.3999-1.4122Z' fill='%234B280E'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M10.7861 6.3078a3.3942 3.3942 0 0 1 1.8777 1.0409.4.4 0 0 0 .5892-.5411 4.1944 4.1944 0 0 0-2.3202-1.2862.4.4 0 1 0-.1467.7864ZM5.206 6.3078a3.3946 3.3946 0 0 0-1.8777 1.0409.4.4 0 1 1-.5891-.5411 4.1946 4.1946 0 0 1 2.3202-1.2862.4.4 0 0 1 .1467.7864Z' fill='%23E0761A'/%3E%3Cg filter='url(%23filter0_i_15251_63610)'%3E%3Cpath d='M2.9952 11.2004c-.2647-.003-.435.1598-1.1536 1.3088-.3267.5231-.6468 1.0515-.6468 1.691 0 .994.8 1.7999 1.8 1.7999.9999 0 1.8008-.8 1.8008-1.7999 0-.6395-.32-1.1679-.6468-1.691-.7186-1.149-.8887-1.3118-1.1536-1.3088Z' fill='%2302ADFC' fill-opacity='.9'/%3E%3C/g%3E%3C/g%3E%3Cdefs%3E%3CradialGradient id='paint1_radial_15251_63610' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='matrix(0 7.9992 -7.99863 0 7.9986 7.9992)'%3E%3Cstop offset='.5637' stop-color='%23FF5758' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23FF5758' stop-opacity='.1'/%3E%3C/radialGradient%3E%3CradialGradient id='paint2_radial_15251_63610' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='rotate(45 -4.5287 10.9195) scale(10.1818)'%3E%3Cstop stop-color='%23FFF287'/%3E%3Cstop offset='1' stop-color='%23FFF287' stop-opacity='0'/%3E%3C/radialGradient%3E%3ClinearGradient id='paint0_linear_15251_63610' x1='2.395' y1='2.4007' x2='13.5944' y2='13.6001' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23FFF287'/%3E%3Cstop offset='1' stop-color='%23F68628'/%3E%3C/linearGradient%3E%3CclipPath id='clip0_15251_63610'%3E%3Cpath fill='%23fff' d='M-.003.0009h15.9993v15.9984H-.003z'/%3E%3C/clipPath%3E%3Cfilter id='filter0_i_15251_63610' x='1.1948' y='11.2003' width='3.6006' height='4.7998' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeBlend in='SourceGraphic' in2='BackgroundImageFix' result='shape'/%3E%3CfeColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/%3E%3CfeOffset/%3E%3CfeGaussianBlur stdDeviation='1.1999'/%3E%3CfeComposite in2='hardAlpha' operator='arithmetic' k2='-1' k3='1'/%3E%3CfeColorMatrix values='0 0 0 0 0.278431 0 0 0 0 0.196078 0 0 0 0 0.952941 0 0 0 0.1 0'/%3E%3CfeBlend in2='shape' result='effect1_innerShadow_15251_63610'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E`,
  },
  {
    id: "react-6",
    icon: `data:image/svg+xml,%3Csvg fill='none' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cg clip-path='url(%23clip0_15251_63610)'%3E%3Cpath d='M15.9972 7.9996c0 4.418-3.5815 7.9996-7.9996 7.9996-4.418 0-7.9996-3.5816-7.9996-7.9996S3.5796 0 7.9976 0c4.4181 0 7.9996 3.5815 7.9996 7.9996Z' fill='url(%23paint0_linear_15251_63610)'/%3E%3Cpath d='M15.9973 7.9992c0 4.4178-3.5811 7.9992-7.9987 7.9992C3.5811 15.9984 0 12.417 0 7.9992S3.5811 0 7.9986 0c4.4176 0 7.9987 3.5814 7.9987 7.9992Z' fill='url(%23paint1_radial_15251_63610)'/%3E%3Cpath d='M15.9972 7.9996c0 4.418-3.5815 7.9996-7.9996 7.9996-4.418 0-7.9996-3.5816-7.9996-7.9996S3.5796 0 7.9976 0c4.4181 0 7.9996 3.5815 7.9996 7.9996Z' fill='url(%23paint2_radial_15251_63610)' fill-opacity='.8'/%3E%3Cpath d='M12.3955 9.0853c0 1.1142-.4 1.1142-1.2 1.1142-.7999 0-1.1999 0-1.1999-1.1143 0-.8205.5372-1.4856 1.1999-1.4856s1.2.6651 1.2 1.4857ZM5.9956 9.0853c0 1.1142-.4 1.1142-1.2 1.1142-.8 0-1.1999 0-1.1999-1.1143 0-.8205.5372-1.4856 1.2-1.4856.6626 0 1.1999.6651 1.1999 1.4857Z' fill='%231C1C1D'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M7.9936 11.5994c1.3257 0 2.3999.292 2.3999.8023 0 .4234-1.0742.3973-2.3999.3973-1.3256 0-2.3998.0261-2.3998-.3973 0-.5103 1.0742-.8023 2.3998-.8023Z' fill='%234B280E'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M13.3283 7.0331a.4.4 0 0 0-.5444-.1535c-.4415.2472-1.0866.4228-1.7434.5373-.6488.1132-1.2697.1604-1.6367.1691a.4.4 0 1 0 .0191.7997c.4037-.0096 1.0643-.0602 1.755-.1807.6828-.119 1.4354-.313 1.9969-.6275a.4.4 0 0 0 .1535-.5444ZM2.491 7.0331a.4.4 0 0 1 .5444-.1535c.4416.2472 1.0866.4228 1.7434.5373.6488.1132 1.2697.1604 1.6367.1691a.4.4 0 1 1-.019.7997c-.4038-.0096-1.0643-.0602-1.7551-.1807-.6827-.119-1.4353-.313-1.9968-.6275a.4.4 0 0 1-.1536-.5444Z' fill='%23BC0A26'/%3E%3C/g%3E%3Cdefs%3E%3CradialGradient id='paint1_radial_15251_63610' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='matrix(0 7.9992 -7.99863 0 7.9986 7.9992)'%3E%3Cstop offset='.8134' stop-color='%23FA2E3E' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23FA2E3E' stop-opacity='.1'/%3E%3C/radialGradient%3E%3CradialGradient id='paint2_radial_15251_63610' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='rotate(45 -4.5272 10.9202) scale(10.1818)'%3E%3Cstop stop-color='%23FFB169'/%3E%3Cstop offset='1' stop-color='%23FFB169' stop-opacity='0'/%3E%3C/radialGradient%3E%3ClinearGradient id='paint0_linear_15251_63610' x1='2.396' y1='2.3999' x2='13.5954' y2='13.5993' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23FFB169'/%3E%3Cstop offset='1' stop-color='%23FF5758'/%3E%3C/linearGradient%3E%3CclipPath id='clip0_15251_63610'%3E%3Cpath fill='%23fff' d='M-.004 0h15.9993v15.9992H-.004z'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E`,
  },
];

interface PostInsightModalContentProps {
  postId: string;
}
function PostInsightModalContent({ postId }: PostInsightModalContentProps) {
  const { post, isLoading } = useQueryPostById({
    postId: postId,
    platform: "facebook",
  });
  return (
    <ModalContent>
      <ModalHeader>
        <div className="flex items-center w-full justify-between">
          {/* <div className="p-3 bg-gray-600 rounded-full">
              <FaArrowLeft className="text-sm" />
            </div> */}
          <div>
            <span>Post Insights</span>
          </div>
          {/* <div className="pointer-events-none opacity-0 p-3 bg-gray-600 rounded-full">
              <FaArrowLeft className="text-sm" />
            </div> */}
        </div>
      </ModalHeader>
      <ModalBody className="flex flex-col gap-6 ">
        {isLoading ? (
          <>
            <div className="w-full flex justify-center items-center py-4">
              <Spinner label="Fetching Post Insights..." />
            </div>
          </>
        ) : (
          post && (
            <>
              <div className="flex gap-3">
                <div className="w-28 h-28 flex-shrink-0 rounded overflow-hidden">
                  <AppDefaultImage
                    className="w-full h-full object-cover flex-shrink-0"
                    src={post.details.full_picture}
                  />
                </div>
                <div className="flex flex-col gap-2 pt-1 overflow-hidden">
                  <h3 className="line-clamp-2 text-base">
                    {post.details.message}
                  </h3>
                  {dayjs(post.details.created_time).isValid() && (
                    <p className="text-tiny text-gray-500">
                      Published at{" "}
                      {dayjs(post.details.created_time).format(
                        "DD MMMM, HH:mm"
                      )}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-3 items-center p-3 bg-gray-700 rounded-lg">
                <FaCircleInfo />
                <p>
                  Some insights are only available when the total is at least
                  100.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-gray-700 rounded-lg flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <h4 className="text-tiny text-gray-300">
                      Post impressions
                    </h4>
                    <FaCircleInfo className="text-sm text-gray-300" />
                  </div>
                  <h3 className="text-xl">1</h3>
                </div>
                <div className="p-3 bg-gray-700 rounded-lg flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <h4 className="text-tiny text-gray-300">Post reach</h4>
                    <FaCircleInfo className="text-sm text-gray-300" />
                  </div>
                  <h3 className="text-xl">1</h3>
                </div>
                <div className="p-3 bg-gray-700 rounded-lg flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <h4 className="text-tiny text-gray-300">Engagement</h4>
                    <FaCircleInfo className="text-sm text-gray-300" />
                  </div>
                  <h3 className="text-xl">0</h3>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <h2 className="text-lg text-white font-medium">
                    Interactions
                  </h2>
                  <FaCircleInfo />
                </div>
                <div className="grid grid-cols-6">
                  {interactions.map((interaction) => (
                    <div
                      key={interaction.id}
                      className="flex flex-col items-center gap-2 py-3"
                    >
                      <div>
                        <Image
                          alt="Interaction Icon"
                          width={24}
                          height={24}
                          // style={{ width: "24px", height: "20px" }}
                          // className="w-[20px] h-[20px]"
                          src={interaction.icon}
                        />
                      </div>
                      <h3 className="text-tiny">0</h3>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-col gap-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <BsFillEmojiSmileFill className="text-2xl text-gray-500" />
                    </div>
                    <div className="flex-1 border-b border-gray-600 flex justify-between items-center pb-4">
                      <h4 className="text-gray-400">Reactions</h4>
                      <p>1</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <BiCommentDetail className="text-2xl text-gray-500" />
                    </div>
                    <div className="flex-1 border-b border-gray-600 flex justify-between items-center pb-4">
                      <h4 className="text-gray-400">Comments</h4>
                      <p>1</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <BsFillFileImageFill className="text-2xl text-gray-500" />
                    </div>
                    <div className="flex-1 border-b border-gray-600 flex justify-between items-center pb-4">
                      <h4 className="text-gray-400">Photo Views</h4>
                      <p>--</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <FaShare className="text-2xl text-gray-500" />
                    </div>
                    <div className="flex-1 border-b border-gray-600 flex justify-between items-center pb-4">
                      <h4 className="text-gray-400">Shares</h4>
                      <p>1</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <FaArrowPointer className="text-2xl text-gray-500" />
                    </div>
                    <div className="flex-1 border-b border-gray-600 flex justify-between items-center pb-4">
                      <h4 className="text-gray-400">Other Clicks</h4>
                      <p>--</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <h2 className="text-lg text-white font-medium">Other</h2>
                  <FaCircleInfo />
                </div>
                <div className="flex flex-col gap-4 mt-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <MdHideImage className="text-2xl text-gray-500" />
                    </div>
                    <div className="flex-1 border-b border-gray-600 flex justify-between items-center pb-4">
                      <h4 className="text-gray-400">Hide post</h4>
                      <p>--</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <MdHideImage className="text-2xl text-gray-500" />
                    </div>
                    <div className="flex-1 border-b border-gray-600 flex justify-between items-center pb-4">
                      <h4 className="text-gray-400">Hide all posts</h4>
                      <p>--</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        )}
      </ModalBody>
    </ModalContent>
  );
}

interface PostInsightModalProps {
  open: boolean;
  handleClose: () => void;
  post_id?: string;
}
export default function PostInsightModal({
  open,
  handleClose,
  post_id,
}: PostInsightModalProps) {
  return (
    <UiModal
      keepMounted={false}
      isOpen={open}
      onClose={handleClose}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      classNames={{
        wrapper: "bg-black bg-opacity-50",
        base: "!max-w-[600px] !h-auto !max-h-[80vh] overflow-auto !w-[90vw]",
      }}
    >
      {post_id && <PostInsightModalContent postId={post_id} />}
    </UiModal>
  );
} 
