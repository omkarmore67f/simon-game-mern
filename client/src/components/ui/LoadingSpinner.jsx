export default function LoadingSpinner({ size = 'md', color = 'white' }) {
  const sz = { sm: 'w-4 h-4 border-2', md: 'w-6 h-6 border-2', lg: 'w-10 h-10 border-[3px]' }[size];
  const cl = { white: 'border-white/20 border-t-white', dark: 'border-black/20 border-t-black', muted: 'border-white/8 border-t-white/30' }[color];
  return <div className={`rounded-full animate-spin ${sz} ${cl}`} role="status" />;
}
