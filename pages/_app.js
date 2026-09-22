import { Sora } from 'next/font/google';

const sora = Sora({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export default function App({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        :root {
          --font-brand: ${sora.style.fontFamily};
        }
        html,
        body {
          font-family: ${sora.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
