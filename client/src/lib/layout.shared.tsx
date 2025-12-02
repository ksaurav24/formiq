import ThemeToggle from '@/components/theme-toggle';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'Formiq',
      url: "/"
    },
    themeSwitch:{
        component:<div className='w-full flex justify-end'>
            <ThemeToggle/>
        </div>
    }
        
  };
}