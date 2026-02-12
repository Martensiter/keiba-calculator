'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'keiba-theme';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  const resolved = theme === 'system' ? getSystemTheme() : theme;
  document.documentElement.classList.toggle('dark', resolved === 'dark');
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);

  // 初回: localStorage から復元
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial = saved || 'system';
    setTheme(initial);
    applyTheme(initial);
    setMounted(true);
  }, []);

  // OS設定変更への追従
  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const cycle = () => {
    const order: Theme[] = ['light', 'dark', 'system'];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  };

  // SSR中は何も表示しない（ハイドレーションずれ防止）
  if (!mounted) {
    return <div className="w-8 h-8" />;
  }

  const icons: Record<Theme, string> = {
    light: '☀️',
    dark: '🌙',
    system: '💻',
  };

  const labels: Record<Theme, string> = {
    light: 'ライト',
    dark: 'ダーク',
    system: 'システム',
  };

  return (
    <button
      onClick={cycle}
      className="flex items-center gap-1 px-2 py-1 rounded-lg text-sm transition-colors
                 hover:bg-green-600/20 dark:hover:bg-white/10"
      aria-label={`テーマ切替: 現在 ${labels[theme]}`}
      title={`テーマ: ${labels[theme]}（クリックで切替）`}
    >
      <span className="text-base leading-none">{icons[theme]}</span>
      <span className="hidden sm:inline text-xs opacity-80">{labels[theme]}</span>
    </button>
  );
}
