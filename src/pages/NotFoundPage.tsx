import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import { buttonVariants } from '@/components/ui/Button';
import { SEO } from '@/components/finance/SEO';

export default function NotFoundPage() {
  return (
    <>
      <SEO title="Page Not Found" description="The page you are looking for does not exist." />

      <main className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-600/15 text-blue-400">
            <Compass className="h-7 w-7" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-bold text-text-faint uppercase tracking-widest">
              Error 404
            </p>
            <h1 className="text-display-md text-text-primary tracking-tight">Page not found</h1>
            <p className="text-body-md text-text-muted leading-relaxed">
              The page you tried to reach is not on our map. Head back to the dashboard to continue
              curating your wealth.
            </p>
          </div>

          <Link to="/" className={buttonVariants({ variant: 'primary', size: 'md' })}>
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </main>
    </>
  );
}
