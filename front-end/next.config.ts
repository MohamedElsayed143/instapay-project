import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // تفعيل الـ Standalone Mode يحل مشكلة ملفات التشغيل الناقصة في Vercel
  output: 'standalone', 
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },

  // تم حذف سطر outputFileTracingRoot القديم لأنه كان يسبب أخطاء في المسارات
  // واستبداله بضبط المسار الصحيح للمجلد الحالي فقط
  outputFileTracingRoot: path.resolve(__dirname),

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // ملحوظة: إذا استمر الخطأ، يفضل تعطيل Turbopack في الـ Build 
  // لأن بعض الـ Loaders الخارجية قد لا تدعمه بشكل مستقر في الإنتاج
};

export default nextConfig;