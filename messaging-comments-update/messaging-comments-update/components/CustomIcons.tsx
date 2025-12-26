
import React from 'react';
import Svg, { Path, Circle, Rect, Line, G } from 'react-native-svg';
import { colors } from '@/styles/commonStyles';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

// Flame Icon - Geometric monoline style
export function FlameIcon({ size = 24, color = colors.text, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C12 2 8 6 8 10C8 12.2091 9.79086 14 12 14C14.2091 14 16 12.2091 16 10C16 6 12 2 12 2Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 14C12 14 9 16 9 18.5C9 20.433 10.567 22 12.5 22C14.433 22 16 20.433 16 18.5C16 16 12 14 12 14Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 8C12 8 10.5 9.5 10.5 11C10.5 12.1046 11.3954 13 12.5 13C13.6046 13 14.5 12.1046 14.5 11C14.5 9.5 12 8 12 8Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Comment Bubble with "LC?" text
export function CommentIcon({ size = 24, color = colors.text, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 11.5C21 16.7467 16.9706 21 12 21C10.3126 21 8.73341 20.5787 7.36246 19.8398L3 21L4.16019 16.6375C3.42132 15.2666 3 13.6874 3 12C3 6.75329 7.02944 2.5 12 2.5C16.9706 2.5 21 6.75329 21 11.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 11H8.01M12 11H12.01M16 11H16.01"
        stroke={color}
        strokeWidth={strokeWidth * 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Vault Door Icon
export function VaultIcon({ size = 24, color = colors.text, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="2"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle
        cx="12"
        cy="12"
        r="4"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle
        cx="12"
        cy="12"
        r="1.5"
        fill={color}
      />
      <Line
        x1="12"
        y1="8"
        x2="12"
        y2="6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Line
        x1="16"
        y1="12"
        x2="18"
        y2="12"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Line
        x1="12"
        y1="16"
        x2="12"
        y2="18"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Line
        x1="8"
        y1="12"
        x2="6"
        y2="12"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Path
        d="M2 20H22"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}

// Shoebox with "+" Icon
export function ShoeboxAddIcon({ size = 24, color = colors.text, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Box base */}
      <Path
        d="M4 8H20V20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V8Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Box lid */}
      <Path
        d="M3 5C3 4.44772 3.44772 4 4 4H20C20.5523 4 21 4.44772 21 5V8H3V5Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Plus sign */}
      <Line
        x1="12"
        y1="11"
        x2="12"
        y2="18"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Line
        x1="8.5"
        y1="14.5"
        x2="15.5"
        y2="14.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Lid detail */}
      <Line
        x1="7"
        y1="6"
        x2="17"
        y2="6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}

// Price Tag Icon
export function PriceTagIcon({ size = 24, color = colors.text, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20.59 13.41L13.42 20.58C13.2343 20.766 13.0137 20.9135 12.7709 21.0141C12.5281 21.1148 12.2678 21.1666 12.005 21.1666C11.7422 21.1666 11.4819 21.1148 11.2391 21.0141C10.9963 20.9135 10.7757 20.766 10.59 20.58L2 12V2H12L20.59 10.59C20.9625 10.9647 21.1716 11.4716 21.1716 12C21.1716 12.5284 20.9625 13.0353 20.59 13.41Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle
        cx="7"
        cy="7"
        r="1.5"
        fill={color}
      />
      <Path
        d="M8 8L11 11"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}

// Sneaker Rotation Icon
export function SneakerRotateIcon({ size = 24, color = colors.text, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Sneaker outline */}
      <Path
        d="M3 16L5 14L7 12L9 11L11 10.5L13 10.5L15 11L17 12L19 14L20 16H3Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 16V18C3 18.5523 3.44772 19 4 19H19C19.5523 19 20 18.5523 20 18V16"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Laces */}
      <Line x1="9" y1="11" x2="9" y2="13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="11" y1="10.5" x2="11" y2="12.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="13" y1="10.5" x2="13" y2="12.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="15" y1="11" x2="15" y2="13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      {/* Rotation arrows */}
      <Path
        d="M7 6C7 6 9 4 12 4C15 4 17 6 17 6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5 6L7 6L7 4"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19 6L17 6L17 4"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Home/Feed Icon - Shoebox stack
export function FeedIcon({ size = 24, color = colors.text, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Bottom box */}
      <Rect
        x="4"
        y="14"
        width="16"
        height="6"
        rx="1"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Middle box */}
      <Rect
        x="5"
        y="9"
        width="14"
        height="5"
        rx="1"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Top box */}
      <Rect
        x="6"
        y="4"
        width="12"
        height="5"
        rx="1"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Details */}
      <Line x1="8" y1="6.5" x2="16" y2="6.5" stroke={color} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
      <Line x1="7" y1="11.5" x2="17" y2="11.5" stroke={color} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
      <Line x1="6" y1="17" x2="18" y2="17" stroke={color} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
    </Svg>
  );
}

// Database Icon - Shelf
export function ShelfIcon({ size = 24, color = colors.text, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Shelves */}
      <Line x1="3" y1="6" x2="21" y2="6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="3" y1="12" x2="21" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="3" y1="18" x2="21" y2="18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      {/* Vertical supports */}
      <Line x1="4" y1="3" x2="4" y2="21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="20" y1="3" x2="20" y2="21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      {/* Shoes on shelves */}
      <Path d="M7 5C7 5 8 4 9 4C10 4 11 5 11 5" stroke={color} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
      <Path d="M13 5C13 5 14 4 15 4C16 4 17 5 17 5" stroke={color} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
      <Path d="M7 11C7 11 8 10 9 10C10 10 11 11 11 11" stroke={color} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
      <Path d="M13 11C13 11 14 10 15 10C16 10 17 11 17 11" stroke={color} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
      <Path d="M7 17C7 17 8 16 9 16C10 16 11 17 11 17" stroke={color} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
      <Path d="M13 17C13 17 14 16 15 16C16 16 17 17 17 17" stroke={color} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
    </Svg>
  );
}
