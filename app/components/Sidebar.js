'use client';
import { Sidebar as LayoutSidebar } from './layout/Sidebar';

export default function Sidebar({ collapsed, onToggle }) {
  // In the original POS-CLIENT design, `collapsed=true` meant the mobile menu was OPEN.
  return <LayoutSidebar isOpen={collapsed} onClose={onToggle} />;
}
