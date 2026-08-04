'use client';
import { Header } from './layout/Header';

export default function Topbar({ onMenuClick }) {
  return <Header onMenuClick={onMenuClick} />;
}
