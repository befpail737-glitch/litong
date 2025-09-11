import * as React from 'react';

import { type LucideProps } from 'lucide-react';
import {
  Search,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Check,
  Plus,
  Minus,
  Send,
  Mail,
  Phone,
  MapPin,
  Building,
  User,
  MessageCircle,
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Star,
  Heart,
  ShoppingCart,
  Download,
  Upload,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Menu,
  Settings,
  HelpCircle,
  Info,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Globe,
  Shield,
  Lock,
  Unlock,
  Wifi,
  WifiOff,
  Battery,
  Zap,
  Cpu,
  HardDrive,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Camera,
  Video,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Share,
  Bookmark,
  Flag,
  Tag,
  Package,
  Truck,
  Home,
  FileText,
  Folder,
  FolderOpen,
  Image,
  File,
} from 'lucide-react';

// 图标映射对象
export const Icons = {
  // 导航和操作
  search: Search,
  close: X,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  check: Check,
  plus: Plus,
  minus: Minus,
  send: Send,

  // 联系方式
  mail: Mail,
  phone: Phone,
  mapPin: MapPin,
  building: Building,
  user: User,
  messageCircle: MessageCircle,

  // 筛选和排序
  filter: Filter,
  sortAsc: SortAsc,
  sortDesc: SortDesc,
  grid: Grid,
  list: List,

  // 互动
  star: Star,
  heart: Heart,
  shoppingCart: ShoppingCart,
  download: Download,
  upload: Upload,

  // 可见性
  eye: Eye,
  eyeOff: EyeOff,

  // 编辑
  edit: Edit,
  trash: Trash2,
  copy: Copy,
  externalLink: ExternalLink,

  // 箭头
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  arrowUp: ArrowUp,
  arrowDown: ArrowDown,

  // 界面
  menu: Menu,
  settings: Settings,
  help: HelpCircle,
  info: Info,

  // 状态
  alertCircle: AlertCircle,
  checkCircle: CheckCircle,
  xCircle: XCircle,

  // 时间
  clock: Clock,
  calendar: Calendar,

  // 网络和安全
  globe: Globe,
  shield: Shield,
  lock: Lock,
  unlock: Unlock,
  wifi: Wifi,
  wifiOff: WifiOff,

  // 硬件和设备
  battery: Battery,
  zap: Zap,
  cpu: Cpu,
  hardDrive: HardDrive,
  monitor: Monitor,
  smartphone: Smartphone,
  tablet: Tablet,
  laptop: Laptop,
  camera: Camera,
  video: Video,

  // 音频控制
  volume: Volume2,
  volumeOff: VolumeX,
  play: Play,
  pause: Pause,
  stop: Square,
  skipBack: SkipBack,
  skipForward: SkipForward,
  repeat: Repeat,
  shuffle: Shuffle,

  // 社交和分享
  share: Share,
  bookmark: Bookmark,
  flag: Flag,
  tag: Tag,

  // 商业
  package: Package,
  truck: Truck,

  // 文件和文件夹
  home: Home,
  fileText: FileText,
  folder: Folder,
  folderOpen: FolderOpen,
  image: Image,
  file: File,
} as const;

// 图标类型定义
export type IconName = keyof typeof Icons

// 通用图标组件接口
export interface IconProps extends LucideProps {
  name: IconName
}

// 通用图标组件
export function Icon({ name, ...props }: IconProps) {
  const IconComponent = Icons[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return <IconComponent {...props} />;
}

// 预设尺寸的便捷组件
export function SmallIcon({ name, ...props }: IconProps) {
  return <Icon name={name} size={16} {...props} />;
}

export function MediumIcon({ name, ...props }: IconProps) {
  return <Icon name={name} size={20} {...props} />;
}

export function LargeIcon({ name, ...props }: IconProps) {
  return <Icon name={name} size={24} {...props} />;
}

// 导出所有图标以便直接使用
export {
  Search,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Check,
  Plus,
  Minus,
  Send,
  Mail,
  Phone,
  MapPin,
  Building,
  User,
  MessageCircle,
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Star,
  Heart,
  ShoppingCart,
  Download,
  Upload,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Menu,
  Settings,
  HelpCircle,
  Info,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Globe,
  Shield,
  Lock,
  Unlock,
  Wifi,
  WifiOff,
  Battery,
  Zap,
  Cpu,
  HardDrive,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Camera,
  Video,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Share,
  Bookmark,
  Flag,
  Tag,
  Package,
  Truck,
  Home,
  FileText,
  Folder,
  FolderOpen,
  Image,
  File,
};
