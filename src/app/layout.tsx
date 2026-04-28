import type { ReactNode } from "react";

export const metadata = {
  title: "Private Tool",
  description: "Private workflow automation tools"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
