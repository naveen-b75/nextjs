import Footer from 'components/layout/footer';
import Navbar from 'components/layout/navbar';
import { UserProvider } from 'lib/userContext.js';
import { ensureStartsWith } from 'lib/utils';
import { Josefin_Sans } from 'next/font/google';
import { ReactNode, Suspense } from 'react';
import './globals.css';

const { TWITTER_CREATOR, TWITTER_SITE, SITE_NAME, PLATFORM_TYPE } = process.env;
const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';
const twitterCreator = TWITTER_CREATOR ? ensureStartsWith(TWITTER_CREATOR, '@') : undefined;
const twitterSite = TWITTER_SITE ? ensureStartsWith(TWITTER_SITE, 'https://') : undefined;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`
  },
  robots: {
    follow: true,
    index: true
  },
  ...(twitterCreator &&
    twitterSite && {
      twitter: {
        card: 'summary_large_image',
        creator: twitterCreator,
        site: twitterSite
      }
    })
};

const josefinSans = Josefin_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-josefinSans'
});
const platformType = process.env.ECOMMERCE_PLATFORM;

export default async function RootLayout({ children }: { children: ReactNode }) {
  if (platformType?.toLocaleLowerCase() === 'magento') {
    return (
      <html lang="en" className={josefinSans.variable}>
        <body className="text-lightBlack selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
          <UserProvider>
            <Navbar />
            <Suspense>
              <main>{children}</main>
            </Suspense>
            <Suspense>
              <Footer />
            </Suspense>
          </UserProvider>
        </body>
      </html>
    );
  } else if (platformType?.toLocaleLowerCase() === 'bigcommerce') {
    return (
      <html lang="en" className={josefinSans.variable}>
        <body className="text-lightBlack selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
          <Navbar />
          <Suspense>
            <main>{children}</main>
          </Suspense>
          <Suspense>
            <Footer />
          </Suspense>
        </body>
      </html>
    );
  }
  return (
    <html lang="en" className={josefinSans.variable}>
      <body className="text-lightBlack selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
        <Navbar />
        <Suspense>
          <main>{children}</main>
        </Suspense>
        <Suspense>
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}
